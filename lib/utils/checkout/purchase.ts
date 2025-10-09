import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {
  calculateMaxCreditsUsed,
  CREDIT_VALUE,
} from "@/lib/utils/wallet/walletUtils";

export async function purchase(
  payload: any,
  createErrorResponse: (message: string) => any,
  subscriptionPlan: any,
  studentProfile: any,
  executePaymentResult: any = null,
  purchaseData: any
) {

  // Calculate expiry date with upgrade logic
  const now = new Date();
  // Extract payment details from payload
  const {
    creditsUsed = 0,
    mobileAmount = 0,
    walletId,
  } = payload;

  const creditsUsedTk = creditsUsed * CREDIT_VALUE;
  const totalAmountTk = mobileAmount + creditsUsedTk;

  // ============================================
  // HANDLE CREDIT PAYMENT (If credits are used)
  // ============================================
  let walletTransactionId: string | null = null;
  let creditPaymentId: string | null = null;

  if (creditsUsed > 0 && walletId) {
    // 1. Get wallet and verify available credits
    const wallet = await db.wallet.findUnique({
      where: { id: walletId },
      include: { creditLots: true },
    });

    if (!wallet) {
      return createErrorResponse("Wallet not found");
    }

    // 2. Deduct credits from CreditLots (FIFO)
    let remainingToDeduct = creditsUsed;
    const creditLotUpdates = [];

    for (const lot of wallet.creditLots) {
      if (remainingToDeduct <= 0) break;

      const deductFromLot = Math.min(lot.remainingAmount, remainingToDeduct);
      remainingToDeduct -= deductFromLot;

      creditLotUpdates.push(
        db.creditLot.update({
          where: { id: lot.id },
          data: {
            remainingAmount: lot.remainingAmount - deductFromLot,
          },
        })
      );
    }

    // Execute all credit lot updates
    await Promise.all(creditLotUpdates);


    // 3. Update Wallet
    const updatedWallet = await db.wallet.update({
      where: { id: walletId },
      data: {
        usedCredits: wallet.usedCredits + creditsUsed,
      },
    });

    // 4. Create WalletTransaction
    const idempotencyKey = `purchase-${Date.now()}-${studentProfile.id}`;
    const walletTransaction = await db.walletTransaction.create({
      data: {
        walletId: walletId,
        type: 'PURCHASE_DEDUCTION',
        amount: -creditsUsed,
        balanceBefore: wallet.availableCredits,
        balanceAfter: updatedWallet.availableCredits,
        status: 'COMPLETED',
        description: `Credits used for ${subscriptionPlan.name} subscription`,
        idempotencyKey,
      },
    });

    walletTransactionId = walletTransaction.id;
  }
  // ============================================
  // CREATE PURCHASE RECORD
  // ============================================
  const purchase = await db.purchase.create({
    data: {
      ...purchaseData,
      totalAmountTk,
      creditsUsedTk,
      totalPaidTk: mobileAmount,
    },
  });
  // ============================================
  // CREATE CREDIT PAYMENT ENTRY (If credits used)
  // ============================================
  if (creditsUsed > 0 && walletId && walletTransactionId) {
    const creditPayment = await db.creditPayment.create({
      data: {
        purchaseId: purchase.id,
        amountTk: creditsUsedTk,
        walletId,
        transactionId: walletTransactionId,
        status: 'COMPLETED',
        idempotencyKey: `credit-${purchase.id}-${Date.now()}`,
        processedAt: now,
      },
    });
    creditPaymentId = creditPayment.id;
  }

  // ============================================
  // CREATE MOBILE PAYMENT ENTRY
  // ============================================
  if (mobileAmount > 0) {
    await db.mobilePayment.create({
      data: {
        purchaseId: purchase.id,
        amountTk: mobileAmount,
        provider: 'bKash', // Adjust based on your payment provider
        phoneNumber: executePaymentResult?.customerMsisdn || '',
        mobileTransactionId: executePaymentResult?.trxID || null,
        bkashData: JSON.parse(JSON.stringify(executePaymentResult)),
        status: 'COMPLETED',
        idempotencyKey: `mobile-${purchase.id}-${Date.now()}`,
        processedAt: now,
      },
    });
  }

  return { purchase };
}



// export async function purchase(
//   { purchaseData, amount }, originalAmount, redeemedCredits = 0, walletId = null
// ) {

//   // Create Wallet Transaction
//   // const walletTransaction = await db.walletTransaction.create({
//   //   data: {
//   //       walletId,
//   //       type: 'PURCHASE_DEDUCTION',
//   //       amount: redeemedCredits,
//   //       balanceBefore: 0,
//   //       balanceAfter: 0,
//   //       status: "COMPLETED",
//   //       idempotencyKey: '',
//   //   }
//   // });

//   // Credit Lot Update
//   // TODO: First fetch credit lots based on FIFO where availableCredits > 0 && expirationDate > now, then use them to deduct the credits
//   // const creditLot = Promise.all([]);

//   // Create Purchase Record
//   const purchaseRecord = await db.purchase.create({
//     data:
//     {
//       ...purchaseData, totalAmountTk: redeemedCredits * CREDIT_VALUE + amount,
//       creditsUsedTk: redeemedCredits * CREDIT_VALUE, // Max 80% of total
//       totalPaidTk: amount, // Sum of all payment methods
//       remainingAmountTk: originalAmount - redeemedCredits * CREDIT_VALUE - amount
//     }
//   });

//   // Create MobilePayment Record
//   // const mobilePayment = await db.mobilePayment.create({
//   //   data: {
//   //     purchaseId: purchaseRecord.id,
//   //     amountTk: purchaseData.amount,
//   //     provider: purchaseData.provider,
//   //     phoneNumber: purchaseData.phoneNumber,
//   //     mobileTransactionId: purchaseData.mobileTransactionId,
//   //     bkashData: purchaseData.bkashData,
//   //     status: purchaseData.status,
//   //     idempotencyKey: purchaseData.idempotencyKey,
//   //     processedAt: purchaseData.processedAt,
//   //     failureReason: purchaseData.failureReason,
//   //     metadata: purchaseData.metadata
//   //   }
//   // });

//   // Create CreditPayment Record
//   // if (redeemedCredits > 0 && walletId) {
//   //   const maxRedeemableCredits = calculateMaxCreditsUsed(
//   //     purchaseData.amount,
//   //     walletId
//   //   );
//   //   const creditPayment = await db.creditPayment.create({
//   //     data: {
//   //       purchaseId: purchaseRecord.id,
//   //       amountTk: redeemedCredits*CREDIT_VALUE,
//   //       walletId,
//   //       transactionId:'',
//   //       status: 'COMPLETED',
//   //       idempotencyKey: ""
//   //     }
//   //   });

//   // TODO: Implement purchase logic
//   return null;
// }