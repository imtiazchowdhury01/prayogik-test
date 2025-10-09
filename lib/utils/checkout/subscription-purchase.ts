// lib/utils/referral/referralHelpers.ts
import { db } from "@/lib/db";
import { ReferrerType } from "@prisma/client";

// Cash to Credit conversion rate
const CASH_TO_CREDIT_RATE = parseFloat(process.env.CASH_TO_CREDIT_CONVERSION_RATE || "1");

// ===================================
// ======== UTILITY FUNCTIONS ========
// ====================================

/**
 * Convert cash to credits
 */
function cashToCredits(cashAmount: number): number {
  return cashAmount * CASH_TO_CREDIT_RATE;
}

/**
 * Check if user is within referral window
 */
export function isWithinReferralWindow(
  userCreatedAt: Date,
  windowDays: number
): boolean {
  const now = new Date();
  const daysSinceRegistration = Math.floor(
    (now.getTime() - new Date(userCreatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysSinceRegistration <= windowDays;
}

/**
 * Calculate total installments
 */
export function calculateTotalInstallments(
  totalAmount: number,
  installmentAmount: number
): number {
  return Math.ceil(totalAmount / installmentAmount);
}

/**
 * Create or get wallet for user
 */
export async function createReferrerWallet(tx: any, userId: string) {
  const existingWallet = await tx.wallet.findUnique({
    where: { userId },
  });

  if (existingWallet) {
    return existingWallet;
  }

  return await tx.wallet.create({
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

/**
 * Add credits to wallet
 */
async function addCreditsToWallet(
  tx: any,
  walletId: string,
  currentAvailableCredits: number,
  creditAmount: number,
  description: string,
  referralId: string,
  expiryMonths: number,
  metadata: any
) {
  const idempotencyKey = `${metadata.source}_${referralId}_${Date.now()}`;

  // Create wallet transaction
  const walletTransaction = await tx.walletTransaction.create({
    data: {
      walletId,
      type: metadata.type || "REFERRAL_BONUS",
      amount: creditAmount,
      balanceBefore: currentAvailableCredits,
      balanceAfter: currentAvailableCredits + creditAmount,
      status: "COMPLETED",
      description,
      referralId,
      idempotencyKey,
      metadata,
    },
  });

  // Create credit lot
  const creditExpiryDate = new Date();
  creditExpiryDate.setMonth(creditExpiryDate.getMonth() + expiryMonths);

  await tx.creditLot.create({
    data: {
      walletId,
      initialAmount: creditAmount,
      remainingAmount: creditAmount,
      expiresAt: creditExpiryDate,
      isExpired: false,
      source: metadata.source,
      sourceReferenceId: referralId,
      metadata: {
        ...metadata,
        walletTransactionId: walletTransaction.id,
      },
    },
  });

  // Update wallet balance
  await tx.wallet.update({
    where: { id: walletId },
    data: {
      totalCredits: { increment: creditAmount },
      availableCredits: { increment: creditAmount },
      lifetimeEarnedCredits: { increment: creditAmount },
    },
  });

  return walletTransaction;
}

// ===================================
// ======== REWARD FUNCTIONS =========
// ====================================

/**
 * Award referral rewards based on referrer type
 */
export async function awardReferralRewards(
  tx: any,
  referral: any,
  referrerWallet: any,
  user: any,
  purchaseId: string,
  amount: number,
  creditExpiryMonths: number,
  referrerType: ReferrerType
) {
  const now = new Date();

  if (referrerType === "STUDENT") {
    // Students earn credits directly
    await addCreditsToWallet(
      tx,
      referrerWallet.id,
      referrerWallet.availableCredits,
      amount,
      `Referral bonus for prime upgrade`,
      referral.id,
      creditExpiryMonths,
      {
        type: "REFERRAL_BONUS",
        source: "REFERRAL_PRIME_UPGRADE",
        refereeUserId: user.id,
        purchaseId,
        upgradeType: "TRIAL_TO_PRIME",
        rewardType: "CREDIT",
      }
    );
  } else {
    // Teachers and Affiliates earn cash + equivalent credits in wallet
    const idempotencyKey = `prime_upgrade_cash_${user.id}_${purchaseId}`;

    // Create referrer commission for cash tracking
    await tx.referrerCommission.create({
      data: {
        referralId: referral.id,
        beneficiaryUserId: user.referredByUserId,
        sourcePurchaseId: purchaseId,
        amountTk: amount,
        status: "APPROVED",
        idempotencyKey,
        approvedAt: now,
        metadata: {
          refereeUserId: user.id,
          upgradeType: "TRIAL_TO_PRIME",
          beneficiaryType: referrerType,
        },
      },
    });

    // Convert cash to credits and add to wallet
    const equivalentCredits = cashToCredits(amount);

    await addCreditsToWallet(
      tx,
      referrerWallet.id,
      referrerWallet.availableCredits,
      equivalentCredits,
      `Referral cash bonus converted to credits (${amount} Tk × ${CASH_TO_CREDIT_RATE})`,
      referral.id,
      creditExpiryMonths,
      {
        type: "REFERRAL_BONUS",
        source: "REFERRAL_CASH_TO_CREDIT",
        refereeUserId: user.id,
        purchaseId,
        upgradeType: "TRIAL_TO_PRIME",
        rewardType: "CASH_CONVERTED",
        originalCashAmount: amount,
        conversionRate: CASH_TO_CREDIT_RATE,
        beneficiaryType: referrerType,
      }
    );
  }

  // Update referral status
  await tx.referral.update({
    where: { id: referral.id },
    data: {
      status: "PAID_PRIME",
      primeUpgradeAt: now,
      creditedAt: now,
    },
  });
}

/**
 * Check and award milestone bonus
 */
export async function checkAndAwardMilestone(
  tx: any,
  referral: any,
  referrerWallet: any,
  totalPrimeUpgrades: number,
  referrerUserId: string,
  referrerType: ReferrerType
) {
  const MILESTONE_THRESHOLDS = [3, 5, 10];
  const MILESTONE_BONUS_AMOUNT = parseFloat(
    referrerType === "STUDENT"
      ? process.env.REFERRER_MILESTONE_BONUS_CREDITS || "100"
      : process.env.TEACHER_MILESTONE_BONUS_CASH || "100"
  );
  const MILESTONE_CREDIT_EXPIRY_MONTHS = parseInt(
    process.env.MILESTONE_CREDIT_EXPIRY_MONTHS || "12"
  );

  if (!MILESTONE_THRESHOLDS.includes(totalPrimeUpgrades)) {
    return null;
  }

  const milestoneCount = totalPrimeUpgrades;

  // Create milestone record
  const milestone = await tx.referralMilestone.create({
    data: {
      referralId: referral.id,
      milestoneCount,
      bonusAmountTk: MILESTONE_BONUS_AMOUNT,
      metadata: {
        referrerUserId,
        milestoneType: `${milestoneCount}_PRIME_UPGRADES`,
        rewardType: referrerType === "STUDENT" ? "CREDIT" : "CASH",
      },
    },
  });

  if (referrerType === "STUDENT") {
    // Students get milestone credits directly
    await addCreditsToWallet(
      tx,
      referrerWallet.id,
      referrerWallet.availableCredits,
      MILESTONE_BONUS_AMOUNT,
      `Milestone bonus for ${milestoneCount} prime upgrades`,
      referral.id,
      MILESTONE_CREDIT_EXPIRY_MONTHS,
      {
        type: "MILESTONE_BONUS",
        source: "REFERRAL_MILESTONE_PRIME",
        milestoneCount,
        milestoneType: "PRIME_UPGRADE",
        rewardType: "CREDIT",
      }
    );
  } else {
    // Teachers and Affiliates get cash + equivalent credits
    const idempotencyKey = `milestone_cash_${milestoneCount}_${referrerUserId}_${Date.now()}`;

    // Create commission for cash tracking
    await tx.referrerCommission.create({
      data: {
        referralId: referral.id,
        beneficiaryUserId: referrerUserId,
        sourcePurchaseId: milestone.id,
        amountTk: MILESTONE_BONUS_AMOUNT,
        status: "APPROVED",
        idempotencyKey,
        approvedAt: new Date(),
        metadata: {
          milestoneCount,
          milestoneType: "PRIME_UPGRADE_MILESTONE",
          beneficiaryType: referrerType,
        },
      },
    });

    // Convert cash to credits and add to wallet
    const equivalentCredits = cashToCredits(MILESTONE_BONUS_AMOUNT);

    await addCreditsToWallet(
      tx,
      referrerWallet.id,
      referrerWallet.availableCredits,
      equivalentCredits,
      `Milestone cash bonus converted to credits (${MILESTONE_BONUS_AMOUNT} Tk × ${CASH_TO_CREDIT_RATE})`,
      referral.id,
      MILESTONE_CREDIT_EXPIRY_MONTHS,
      {
        type: "MILESTONE_BONUS",
        source: "MILESTONE_CASH_TO_CREDIT",
        milestoneCount,
        milestoneType: "PRIME_UPGRADE",
        rewardType: "CASH_CONVERTED",
        originalCashAmount: MILESTONE_BONUS_AMOUNT,
        conversionRate: CASH_TO_CREDIT_RATE,
        beneficiaryType: referrerType,
      }
    );
  }

  return milestone;
}

/**
 * Get count of prime upgrades for a referrer
 */
async function getPrimeUpgradeCount(tx: any, referrerUserId: string): Promise<number> {
  return await tx.referral.count({
    where: {
      referrerUserId,
      status: "PAID_PRIME",
    },
  });
}

// ===================================
// ======== MAIN PROCESS FUNCTIONS ===
// ====================================

/**
 * Process referrer rewards for prime upgrade
 */
export async function processReferrerRewards(
  tx: any,
  user: any,
  purchaseId: string,
  isUpgradingFromTrial: boolean
) {
  if (!isUpgradingFromTrial || !user?.referredByUserId) {
    return null;
  }

  // Get referral record
  const referral = await tx.referral.findUnique({
    where: { refereeUserId: user.id },
    include: {
      referrer: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!referral || referral.isBlocked) {
    return null;
  }

  const referrerType = referral.referrer.role as ReferrerType;

  const REWARD_AMOUNT = parseFloat(
    referrerType === "STUDENT"
      ? process.env.REFERRER_PRIME_UPGRADE_CREDITS || "1500"
      : process.env.TEACHER_PRIME_UPGRADE_CASH || "500"
  );
  const CREDIT_EXPIRY_MONTHS = parseInt(
    process.env.REFERRER_CREDIT_EXPIRY_MONTHS || "15"
  );

  // Get or create referrer's wallet (for all types)
  const referrerWallet = await createReferrerWallet(tx, user.referredByUserId);

  // Award rewards (students get credits, teachers/affiliates get cash + equivalent credits)
  await awardReferralRewards(
    tx,
    referral,
    referrerWallet,
    user,
    purchaseId,
    REWARD_AMOUNT,
    CREDIT_EXPIRY_MONTHS,
    referrerType
  );

  // Get total prime upgrades for this referrer
  const totalPrimeUpgrades = await getPrimeUpgradeCount(tx, user.referredByUserId);

  // Check and award milestones
  const milestone = await checkAndAwardMilestone(
    tx,
    referral,
    referrerWallet,
    totalPrimeUpgrades,
    user.referredByUserId,
    referrerType
  );

  return { referral, milestone };
}

/**
 * Create installment record
 */
export async function createInstallmentRecord(
  tx: any,
  purchaseId: string,
  totalInstallments: number,
  installmentAmount: number
) {
  return {
    totalInstallments,
    completedInstallments: 1,
    installmentAmount,
    remainingAmount: (totalInstallments - 1) * installmentAmount,
  };
}

/**
 * Process installment referrer rewards (pending until all installments paid)
 */
export async function processInstallmentReferrerRewards(
  tx: any,
  user: any,
  purchaseId: string,
  referral: any,
  installmentInfo: any,
  referrerType: ReferrerType
) {
  const REWARD_AMOUNT = parseFloat(
    referrerType === "STUDENT"
      ? process.env.REFERRER_PRIME_UPGRADE_CREDITS || "1500"
      : process.env.TEACHER_PRIME_UPGRADE_CASH || "500"
  );

  const idempotencyKey = `installment_prime_upgrade_${user.id}_${purchaseId}`;

  // Create pending commission (for all types)
  const commission = await tx.referrerCommission.create({
    data: {
      referralId: referral.id,
      beneficiaryUserId: user.referredByUserId,
      sourcePurchaseId: purchaseId,
      amountTk: REWARD_AMOUNT,
      status: "PENDING",
      idempotencyKey,
      metadata: {
        type: "INSTALLMENT_PRIME_UPGRADE",
        totalInstallments: installmentInfo.totalInstallments,
        completedInstallments: 1,
        willCreditAfterInstallments: true,
        beneficiaryType: referrerType,
        rewardType: referrerType === "STUDENT" ? "CREDIT" : "CASH",
      },
    },
  });

  // Update referral status to PAID_LITE (installment in progress)
  await tx.referral.update({
    where: { id: referral.id },
    data: {
      status: "PAID_LITE",
    },
  });

  return commission;
}

/**
 * Process referrer rewards with installment support
 */
export async function processReferrerRewardsWithInstallment(
  tx: any,
  user: any,
  purchaseId: string,
  isUpgradingFromTrial: boolean,
  isInstallment: boolean,
  installmentInfo: any = null
) {
  if (!isUpgradingFromTrial || !user?.referredByUserId) {
    return null;
  }

  // Check if within referral window
  const REFERRAL_WINDOW_DAYS = parseInt(
    process.env.REFERRAL_WINDOW_DAYS || "45"
  );
  if (!isWithinReferralWindow(user.createdAt, REFERRAL_WINDOW_DAYS)) {
    return null;
  }

  // Get referral record
  const referral = await tx.referral.findUnique({
    where: { refereeUserId: user.id },
    include: {
      referrer: {
        select: {
          role: true,
        },
      },
    },
  });

  if (!referral || referral.isBlocked) {
    return null;
  }

  const referrerType = referral.referrer.role as ReferrerType;

  // Handle installment case
  if (isInstallment && installmentInfo) {
    return await processInstallmentReferrerRewards(
      tx,
      user,
      purchaseId,
      referral,
      installmentInfo,
      referrerType
    );
  }

  // Regular full payment flow
  return await processReferrerRewards(
    tx,
    user,
    purchaseId,
    isUpgradingFromTrial
  );
}

/**
 * Complete installment and award referrer rewards
 */
export async function completeInstallmentReferrerRewards(purchaseId: string) {
  const purchase = await db.purchase.findUnique({
    where: { id: purchaseId },
    include: {
      studentProfile: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!purchase || purchase.paymentStatus !== "COMPLETED") {
    return;
  }

  const commission = await db.referrerCommission.findFirst({
    where: {
      sourcePurchaseId: purchaseId,
      status: "PENDING",
    },
    include: {
      referral: {
        include: {
          referrer: {
            select: {
              role: true,
            },
          },
        },
      },
    },
  });

  if (!commission) {
    return;
  }

  const referrerType = commission.referral.referrer.role as ReferrerType;

  await db.$transaction(async (tx) => {
    // Get or create wallet
    const referrerWallet = await createReferrerWallet(
      tx,
      commission.beneficiaryUserId
    );

    // Award the rewards now that installments are complete
    const CREDIT_EXPIRY_MONTHS = parseInt(
      process.env.REFERRER_CREDIT_EXPIRY_MONTHS || "15"
    );

    if (referrerType === "STUDENT") {
      // Students get credits directly
      await addCreditsToWallet(
        tx,
        referrerWallet.id,
        referrerWallet.availableCredits,
        commission.amountTk,
        `Referral bonus for completed installment purchase`,
        commission.referralId,
        CREDIT_EXPIRY_MONTHS,
        {
          type: "REFERRAL_BONUS",
          source: "REFERRAL_INSTALLMENT_COMPLETE",
          purchaseId,
          rewardType: "CREDIT",
        }
      );
    } else {
      // Teachers/Affiliates: commission already created, now add equivalent credits
      const equivalentCredits = cashToCredits(commission.amountTk);

      await addCreditsToWallet(
        tx,
        referrerWallet.id,
        referrerWallet.availableCredits,
        equivalentCredits,
        `Referral cash bonus converted to credits (${commission.amountTk} Tk × ${CASH_TO_CREDIT_RATE})`,
        commission.referralId,
        CREDIT_EXPIRY_MONTHS,
        {
          type: "REFERRAL_BONUS",
          source: "REFERRAL_INSTALLMENT_CASH_TO_CREDIT",
          purchaseId,
          rewardType: "CASH_CONVERTED",
          originalCashAmount: commission.amountTk,
          conversionRate: CASH_TO_CREDIT_RATE,
          beneficiaryType: referrerType,
        }
      );
    }

    // Update commission status
    await tx.referrerCommission.update({
      where: { id: commission.id },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });

    // Update referral status
    await tx.referral.update({
      where: { id: commission.referralId },
      data: {
        status: "PAID_PRIME",
        primeUpgradeAt: new Date(),
        creditedAt: new Date(),
      },
    });

    // Check for milestones
    const totalPrimeUpgrades = await getPrimeUpgradeCount(
      tx,
      commission.beneficiaryUserId
    );

    await checkAndAwardMilestone(
      tx,
      { id: commission.referralId },
      referrerWallet,
      totalPrimeUpgrades,
      commission.beneficiaryUserId,
      referrerType
    );
  });
}