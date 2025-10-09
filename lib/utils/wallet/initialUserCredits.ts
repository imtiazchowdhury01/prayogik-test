// lib/utils/wallet/initialCredits.ts
import { db } from "@/lib/db";
import { WalletTransactionType, WalletTransactionStatus } from "@prisma/client";

interface InitialCreditResult {
  success: boolean;
  walletId?: string;
  error?: string;
}

/**
 * Awards initial signup credits to a new user's wallet
 */
export async function awardInitialSignupCredits(
  userId: string,
  walletId: string
): Promise<InitialCreditResult> {
  const creditAmount = Number(process.env.INITIAL_SIGNUP_CREDITS || 50);
  const expiryMonths = Number(process.env.REFERRER_CREDIT_EXPIRY_MONTHS || 15);

  // If no credits to award, skip
  if (creditAmount <= 0) {
    return { success: true, walletId };
  }

  try {
    // Calculate expiry date (15 months from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + expiryMonths);

    const idempotencyKey = `initial_credits_${userId}_${Date.now()}`;

    // Update wallet with initial credits
    await db.$transaction(async (tx) => {
      // Create wallet transaction
      await tx.walletTransaction.create({
        data: {
          walletId,
          type: WalletTransactionType.PROMOTIONAL,
          amount: creditAmount,
          balanceBefore: 0,
          balanceAfter: creditAmount,
          status: WalletTransactionStatus.COMPLETED,
          description: "Welcome bonus credits",
          referenceType: "USER_SIGNUP",
          referenceId: userId,
          idempotencyKey,
          metadata: {
            source: "SIGNUP_BONUS",
            expiryMonths,
            expiresAt: expiresAt.toISOString(),
          },
        },
      });

      // Create credit lot
      await tx.creditLot.create({
        data: {
          walletId,
          initialAmount: creditAmount,
          remainingAmount: creditAmount,
          expiresAt,
          isExpired: false,
          source: "SIGNUP_BONUS",
          sourceReferenceId: userId,
          metadata: {
            type: "SIGNUP_BONUS",
            awardedAt: new Date().toISOString(),
          },
        },
      });

      // Update wallet balances
      await tx.wallet.update({
        where: { id: walletId },
        data: {
          totalCredits: creditAmount,
          availableCredits: creditAmount,
          lifetimeEarnedCredits: creditAmount,
        },
      });
    });

    return { success: true, walletId };
  } catch (error) {
    console.error("Error awarding initial credits:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to award initial credits",
    };
  }
}