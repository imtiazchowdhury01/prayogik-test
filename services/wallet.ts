'use server';
import { db } from "@/lib/db";
import { WalletTransactionType, WalletTransactionStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { bdtToCredits, creditsToBdt, CREDIT_VALUE } from '@/lib/utils/wallet/walletUtils';
import type {
  ActionResult,
  AddCreditsParams,
  SpendCreditsParams,
  WalletBalance,
  CreditCalculation,
  TransactionHistoryResult,
} from '@/types/wallet';


/**
 * Create wallet for a new user
 */
export async function createWalletAction(
  userId: string
): Promise<ActionResult<{ walletId: string }>> {
  try {
    const existingWallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (existingWallet) {
      return {
        success: true,
        data: { walletId: existingWallet.id },
      };
    }

    const wallet = await db.wallet.create({
      data: {
        userId,
        totalCredits: 0,
        availableCredits: 0,
        expiredCredits: 0,
        usedCredits: 0,
        lifetimeEarnedCredits: 0,
      },
    });

    revalidatePath('/wallet');

    return {
      success: true,
      data: { walletId: wallet.id },
    };
  } catch (error) {
    console.error('Error creating wallet:', error);
    return {
      success: false,
      error: 'Failed to create wallet',
    };
  }
}

/**
 * Get wallet balance
 */
export async function getWalletBalanceAction(
  userId: string
): Promise<ActionResult<WalletBalance>> {
  try {
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    // if no cron job to update availableCredits, calculate it here
    const today = new Date()
    const availableCreditsLots = await db.creditLot.findMany({
      where:{
        walletId: wallet.id,
        remainingAmount: { gt: 0 },
        isExpired: false,
        expiresAt: { gte: today }
      }
    })
    const availableCredits = availableCreditsLots.reduce((sum, lot) => sum + lot.remainingAmount, 0);

    if(availableCredits !== wallet.availableCredits){
      await db.wallet.update({
        where: { id: wallet.id },
        data: { availableCredits }
      });
    }

    return {
      success: true,
      data: {
        totalCredits: wallet.totalCredits,
        availableCredits: availableCredits,
        expiredCredits: wallet.expiredCredits,
        usedCredits: wallet.usedCredits,
        lifetimeEarnedCredits: wallet.lifetimeEarnedCredits,
      },
    };
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    return {
      success: false,
      error: 'Failed to fetch wallet balance',
    };
  }
}

/**
 * Add credits to wallet
 */
export async function addCreditsAction(
  params: AddCreditsParams
): Promise<ActionResult<{ transactionId: string; newBalance: number }>> {
  try {
    const {
      userId,
      amount,
      type,
      description,
      source,
      sourceReferenceId,
      expiresInMonths = 12,
      metadata,
    } = params;

    // Validate amount
    if (amount <= 0) {
      return {
        success: false,
        error: 'Amount must be greater than 0',
      };
    }

    // Generate idempotency key
    const idempotencyKey = `${type}_${userId}_${sourceReferenceId || uuidv4()}`;

    // Check if transaction already exists
    const existingTransaction = await db.walletTransaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTransaction) {
      return {
        success: true,
        data: {
          transactionId: existingTransaction.id,
          newBalance: existingTransaction.balanceAfter,
        },
      };
    }

    // Execute transaction
    const result = await db.$transaction(async (tx) => {
      // Get or create wallet
      let wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        wallet = await tx.wallet.create({
          data: {
            userId,
            totalCredits: 0,
            availableCredits: 0,
            expiredCredits: 0,
            usedCredits: 0,
            lifetimeEarnedCredits: 0,
          },
        });
      }

      const balanceBefore = wallet.availableCredits;
      const balanceAfter = balanceBefore + amount;

      // Create credit lot for expiry tracking first so we can link the transaction
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + expiresInMonths);

      const createdLot = await tx.creditLot.create({
        data: {
          walletId: wallet.id,
          initialAmount: amount,
          remainingAmount: amount,
          expiresAt,
          isExpired: false,
          source,
          sourceReferenceId,
          metadata,
        },
      });

      // Build explicit relation fields based on source
  const txnRelationData: any = {};
  if (source === 'REFERRAL' && sourceReferenceId) txnRelationData.referral = { connect: { id: sourceReferenceId } };
  if (source === 'MILESTONE' && sourceReferenceId) txnRelationData.referralMilestone = { connect: { id: sourceReferenceId } };
  if (source === 'PURCHASE' && sourceReferenceId) txnRelationData.purchase = { connect: { id: sourceReferenceId } };

      // Create wallet transaction. The schema no longer has an explicit creditLot relation
      // so use generic referenceType/referenceId to link to the created CreditLot for traceability.
      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount,
          balanceBefore,
          balanceAfter,
          status: WalletTransactionStatus.COMPLETED,
          description,
          referenceId: createdLot.id,
          referenceType: source,
          idempotencyKey,
          metadata,
          ...txnRelationData,
        },
      });

      // Update wallet balances
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          totalCredits: { increment: amount },
          availableCredits: { increment: amount },
          lifetimeEarnedCredits: { increment: amount },
        },
      });

      return {
        transactionId: transaction.id,
        newBalance: balanceAfter,
      };
    });

    revalidatePath('/wallet');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error adding credits:', error);
    return {
      success: false,
      error: 'Failed to add credits',
    };
  }
}

/**
 * Spend credits using FIFO expiry logic
 */
export async function spendCreditsAction(
  params: SpendCreditsParams
): Promise<ActionResult<{ transactionId: string; newBalance: number }>> {
  try {
    const { userId, amount, description, referenceId, referenceType, metadata } =
      params;

    // Validate amount
    if (amount <= 0) {
      return {
        success: false,
        error: 'Amount must be greater than 0',
      };
    }

    const idempotencyKey = `SPEND_${userId}_${referenceId || uuidv4()}`;

    // Check if already processed
    const existingTransaction = await db.walletTransaction.findUnique({
      where: { idempotencyKey },
    });

    if (existingTransaction) {
      return {
        success: true,
        data: {
          transactionId: existingTransaction.id,
          newBalance: existingTransaction.balanceAfter,
        },
      };
    }

    const result = await db.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.availableCredits < amount) {
        throw new Error(
          `Insufficient credits. Available: ${wallet.availableCredits}, Required: ${amount}`
        );
      }


      const today = new Date();
      // Get credit lots ordered by expiry (FIFO)
      const creditLots = await tx.creditLot.findMany({
        where: {
          walletId: wallet.id,
          remainingAmount: { gt: 0 },
          isExpired: false,
          expiresAt: { gte: today },
        },
        orderBy: { expiresAt: 'asc' },
      });

      let remainingToSpend = amount;

      // Deduct from credit lots using FIFO
      for (const lot of creditLots) {
        if (remainingToSpend <= 0) break;

        const deductAmount = Math.min(lot.remainingAmount, remainingToSpend);

        await tx.creditLot.update({
          where: { id: lot.id },
          data: {
            remainingAmount: { decrement: deductAmount },
          },
        });

        remainingToSpend -= deductAmount;
      }

      const balanceBefore = wallet.availableCredits;
      const balanceAfter = balanceBefore - amount;

      // Map referenceType to explicit relation fields for safety
      const txnRelationData: any = {};
      if (referenceType === 'PURCHASE' && referenceId) txnRelationData.purchaseId = referenceId;
      if (referenceType === 'REFERRAL' && referenceId) txnRelationData.referralId = referenceId;
      if (referenceType === 'MILESTONE' && referenceId) txnRelationData.referralMilestoneId = referenceId;

      // Create wallet transaction
      const transaction = await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: WalletTransactionType.PURCHASE_DEDUCTION,
          amount: -amount,
          balanceBefore,
          balanceAfter,
          status: WalletTransactionStatus.COMPLETED,
          description,
          referenceId,
          referenceType,
          idempotencyKey,
          metadata,
          ...txnRelationData,
        },
      });

      // Update wallet
      await tx.wallet.update({
        where: { id: wallet.id },
        data: {
          availableCredits: { decrement: amount },
          usedCredits: { increment: amount },
        },
      });

      return {
        transactionId: transaction.id,
        newBalance: balanceAfter,
      };
    });

    revalidatePath('/wallet');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error spending credits:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to spend credits';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Calculate credits that can be applied to order (max 80%)
 */
export async function calculateOrderCreditsAction(
  userId: string,
  orderTotalTk: number
): Promise<ActionResult<CreditCalculation>> {
  try {
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return {
        success: true,
        data: {
          creditsUsed: 0,
          remainingAmountTk: orderTotalTk,
          availableCredits: 0,
        },
      };
    }

    // Max 80% of order can be paid with credits
    // Convert orderTotalTk to maximum credits allowed (in credits units)
    const maxCreditsAllowedTk = orderTotalTk * 0.8;
    const maxCreditsAllowed = bdtToCredits(maxCreditsAllowedTk);

    // Wallet stores credits as integer credits
    const availableCredits = wallet.availableCredits;

    // Use the lesser of available credits and max allowed credits
    const creditsUsed = Math.min(availableCredits, maxCreditsAllowed);

    // Convert used credits back to Tk to compute remaining amount
    const creditsUsedTk = creditsToBdt(creditsUsed);
    const remainingAmountTk = Math.max(0, orderTotalTk - creditsUsedTk);

    return {
      success: true,
      data: {
        creditsUsed,
        remainingAmountTk,
        availableCredits,
      },
    };
  } catch (error) {
    console.error('Error calculating order credits:', error);
    return {
      success: false,
      error: 'Failed to calculate order credits',
    };
  }
}

/**
 * Get wallet transaction history
 */
export async function getTransactionHistoryAction(
  userId: string,
  options?: { limit?: number; offset?: number }
): Promise<ActionResult<TransactionHistoryResult>> {
  try {
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    const { limit = 50, offset = 0 } = options || {};

    const [transactions, total] = await Promise.all([
      db.walletTransaction.findMany({
        where: { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.walletTransaction.count({
        where: { walletId: wallet.id },
      }),
    ]);

    return {
      success: true,
      data: {
        transactions,
        total,
        limit,
        offset,
      },
    };
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return {
      success: false,
      error: 'Failed to fetch transaction history',
    };
  }
}

/**
 * Get expiring credits (within 30 days)
 */
export async function getExpiringCreditsAction(userId: string) {
  try {
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringCredits = await db.creditLot.findMany({
      where: {
        walletId: wallet.id,
        remainingAmount: { gt: 0 },
        isExpired: false,
        expiresAt: {
          lte: thirtyDaysFromNow,
          gte: new Date(),
        },
      },
      orderBy: { expiresAt: 'asc' },
    });

    return {
      success: true,
      data: expiringCredits,
    };
  } catch (error) {
    console.error('Error fetching expiring credits:', error);
    return {
      success: false,
      error: 'Failed to fetch expiring credits',
    };
  }
}

/**
 * Get purchase (invoice) history for a student
 */
export async function getPurchaseHistoryAction(userId: string, options?: { limit?: number; offset?: number }) {
  try {
    // Find student profile
    const studentProfile = await db.studentProfile.findUnique({ where: { userId } });

    if (!studentProfile) {
      return { success: false, error: 'Student profile not found' };
    }

    const { limit = 20, offset = 0 } = options || {};

    const [purchases, total] = await Promise.all([
      db.purchase.findMany({ where: { studentProfileId: studentProfile.id }, orderBy: { createdAt: 'desc' }, take: limit, skip: offset }),
      db.purchase.count({ where: { studentProfileId: studentProfile.id } }),
    ]);

    return { success: true, data: { purchases, total, limit, offset } };
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    return { success: false, error: 'Failed to fetch purchase history' };
  }
}

/**
 * get credit lots for a user with optional filtering by expiry date range
 */
export async function getCreditLotsForUser(
  userId: string,
  options?: { startDate?: Date; endDate?: Date; limit?: number; offset?: number }){
  try {
    const wallet = await db.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      return {
        success: false,
        error: 'Wallet not found',
      };
    }

    const { startDate, endDate, limit = 50, offset = 0 } = options || {};

    const creditLots = await db.creditLot.findMany({
      where: {
        walletId: wallet.id,
        expiresAt: {
          gte: startDate || new Date(0),
          lte: endDate || new Date(8640000000000000),
        },
      },
      orderBy: { expiresAt: 'asc' },
      take: limit,
      skip: offset,
    });

    return {
      success: true,
      data: creditLots,
    };
  } catch (error) {
    console.error('Error fetching credit lots:', error);
    return {
      success: false,
      error: 'Failed to fetch credit lots',
    };
  }
}
