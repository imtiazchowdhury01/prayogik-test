// // /api/referrals/stats/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { getServerUserSession } from "@/lib/getServerUserSession";
// import { ReferralStatus, CommissionStatus } from "@prisma/client";

// // Cash to Credit conversion rate (can be set in .env)
// const CASH_TO_CREDIT_RATE = parseFloat(process.env.CASH_TO_CREDIT_CONVERSION_RATE || "1");

// // ============================================
// // UTILITY FUNCTIONS
// // ============================================

// /**
//  * Convert cash amount to credits
//  */
// const cashToCredits = (cashAmount: number): number => {
//   return cashAmount * CASH_TO_CREDIT_RATE;
// };

// /**
//  * Calculate referral status counts in parallel
//  */
// /**
//  * Calculate referral status counts in parallel
//  */
// const getReferralStatusCounts = async (referrerUserId: string): Promise<{
//   total: number;
//   breakdown: Record<string, number>;
//   [key: string]: any; // Allow dynamic keys
// }> => {
//   const statuses = Object.values(ReferralStatus);
//   const counts = await Promise.all(
//     statuses.map(status =>
//       db.referral.count({ where: { referrerUserId, status } })
//     )
//   );

//   const statusBreakdown = statuses.reduce((acc, status, index) => {
//     acc[status.toLowerCase()] = counts[index];
//     return acc;
//   }, {} as Record<string, number>);

//   return {
//     total: counts.reduce((sum, count) => sum + count, 0),
//     ...statusBreakdown,
//     breakdown: statusBreakdown,
//   };
// };

// /**
//  * Calculate commission totals by status
//  */
// const calculateCommissionsByStatus = (commissions: { amountTk: number; status: CommissionStatus }[]) => {
//   const totals = {
//     pending: 0,
//     approved: 0,
//     paid: 0,
//     total: 0,
//   };

//   commissions.forEach(commission => {
//     const amount = commission.amountTk;
//     totals.total += amount;
    
//     switch (commission.status) {
//       case "PENDING":
//         totals.pending += amount;
//         break;
//       case "APPROVED":
//         totals.approved += amount;
//         break;
//       case "PAID":
//         totals.paid += amount;
//         break;
//     }
//   });

//   return totals;
// };

// /**
//  * Get wallet transaction aggregates
//  */
// const getWalletTransactionTotals = async (walletId: string | undefined) => {
//   if (!walletId) return { referralBonus: 0, milestoneBonus: 0 };

//   const [referralCredits, milestoneCredits] = await Promise.all([
//     db.walletTransaction.aggregate({
//       where: {
//         walletId,
//         type: "REFERRAL_BONUS",
//         status: "COMPLETED",
//       },
//       _sum: { amount: true },
//     }),
//     db.walletTransaction.aggregate({
//       where: {
//         walletId,
//         type: "MILESTONE_BONUS",
//         status: "COMPLETED",
//       },
//       _sum: { amount: true },
//     }),
//   ]);

//   return {
//     referralBonus: referralCredits._sum.amount || 0,
//     milestoneBonus: milestoneCredits._sum.amount || 0,
//   };
// };

// /**
//  * Calculate milestone bonus totals
//  */
// const calculateMilestoneTotals = (referrals: any[]) => {
//   return referrals.reduce(
//     (sum, referral) => sum + referral.milestones.reduce(
//       (mSum: number, milestone: any) => mSum + milestone.bonusAmountTk,
//       0
//     ),
//     0
//   );
// };

// /**
//  * Build earnings object for different roles
//  */
// const buildEarningsObject = (
//   wallet: any,
//   cashEarnings: {
//     pending: number;
//     approved: number;
//     paid: number;
//     total: number;
//   },
//   milestoneCash: number,
//   sourceName: string // "commissions" or "affiliateEarnings"
// ) => {
//   const totalCashWithMilestones = cashEarnings.total + milestoneCash;
//   const equivalentCreditsFromSource = cashToCredits(cashEarnings.total);
//   const equivalentCreditsFromMilestones = cashToCredits(milestoneCash);
//   const totalEquivalentCredits = cashToCredits(totalCashWithMilestones);

//   return {
//     // Cash earnings breakdown
//     cashEarningsPending: cashEarnings.pending,
//     cashEarningsApproved: cashEarnings.approved,
//     cashEarningsPaid: cashEarnings.paid,
//     totalCashEarnings: cashEarnings.total,
//     milestoneBonusCash: milestoneCash,
//     totalCashWithMilestones,
    
//     // Wallet credits (existing + equivalent from cash)
//     currentCredits: (wallet?.availableCredits || 0) + totalEquivalentCredits,
//     usedCredits: wallet?.usedCredits || 0,
//     totalCredits: (wallet?.totalCredits || 0) + totalEquivalentCredits,
//     lifetimeEarnedCredits: (wallet?.lifetimeEarnedCredits || 0) + totalEquivalentCredits,
    
//     // Equivalent credits breakdown
//     equivalentCreditsFromCash: totalEquivalentCredits,
//     [`equivalentCreditsFrom${sourceName.charAt(0).toUpperCase() + sourceName.slice(1)}`]: equivalentCreditsFromSource,
//     equivalentCreditsFromMilestones,
//     equivalentCreditsPending: cashToCredits(cashEarnings.pending),
//     equivalentCreditsApproved: cashToCredits(cashEarnings.approved),
//     equivalentCreditsPaid: cashToCredits(cashEarnings.paid),
    
//     // Conversion rate info
//     cashToCreditRate: CASH_TO_CREDIT_RATE,
//   };
// };

// /**
//  * Group purchases by type
//  */
// const groupPurchasesByType = (purchases: any[]) => {
//   return purchases.reduce((acc, purchase) => {
//     if (!acc[purchase.purchaseType]) {
//       acc[purchase.purchaseType] = [];
//     }
//     acc[purchase.purchaseType].push({
//       id: purchase.id,
//       amount: purchase.totalAmountTk,
//       status: purchase.paymentStatus,
//       date: purchase.createdAt,
//       itemDetails: {
//         course: purchase.course,
//         certification: purchase.certification,
//         membership: purchase.membershipPlan,
//         subscription: purchase.subscription,
//         event: purchase.event,
//       },
//     });
//     return acc;
//   }, {} as Record<string, any[]>);
// };

// /**
//  * Format referral data
//  */
// const formatReferral = (referral: any, purchases: any[]) => {
//   const purchasesByType = groupPurchasesByType(purchases);
//   const totalRevenue = purchases
//     .filter((p) => p.paymentStatus === "COMPLETED")
//     .reduce((sum, p) => sum + p.totalAmountTk, 0);

//   return {
//     id: referral.id,
//     referee: referral.referee,
//     status: referral.status,
//     registeredAt: referral.registeredAt,
//     clickedAt: referral.clickedAt,
//     firstPurchaseAt: referral.firstPurchaseAt,
//     primeUpgradeAt: referral.primeUpgradeAt,
//     creditedAt: referral.creditedAt,
//     isBlocked: referral.isBlocked,
//     blockedReason: referral.blockedReason,
//     totalPurchases: purchases.length,
//     totalRevenue,
//     purchasesByType,
//     commissionEarned: referral.commissions.reduce(
//       (sum: number, c: any) => sum + c.amountTk,
//       0
//     ),
//     milestonesAchieved: referral.milestones.length,
//     milestoneBonusEarned: referral.milestones.reduce(
//       (sum: number, m: any) => sum + m.bonusAmountTk,
//       0
//     ),
//   };
// };

// // ============================================
// // MAIN ROUTE HANDLER
// // ============================================

// export async function GET(req: NextRequest) {
//   try {
//     // Get authenticated user
//     const { userId } = await getServerUserSession();
//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Get user with their role
//     const user = await db.user.findUnique({
//       where: { id: userId },
//       select: { role: true, referralCode: true },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Get referral status counts
//     const statusCounts = await getReferralStatusCounts(userId);

//     // Get all referrals with related data
//     const referrals = await db.referral.findMany({
//       where: { referrerUserId: userId },
//       include: {
//         referee: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             username: true,
//             avatarUrl: true,
//             currentPlan: true,
//             createdAt: true,
//           },
//         },
//         referrer: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//           },
//         },
//         commissions: {
//           where: { beneficiaryUserId: userId },
//           select: {
//             amountTk: true,
//             status: true,
//             createdAt: true,
//           },
//         },
//         milestones: {
//           select: {
//             milestoneCount: true,
//             bonusAmountTk: true,
//             awardedAt: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // Get recent referral dates
//     const lastReferral = referrals[0];
//     const lastCreditedReferral = referrals.find(r => r.status === ReferralStatus.CREDITED);

//     // Get purchases for all referees
//     const refereeIds = referrals.map((r) => r.refereeUserId);
//     const refereePurchases = await db.purchase.findMany({
//       where: {
//         studentProfile: {
//           userId: { in: refereeIds },
//         },
//       },
//       select: {
//         id: true,
//         purchaseType: true,
//         totalAmountTk: true,
//         paymentStatus: true,
//         createdAt: true,
//         studentProfile: {
//           select: { userId: true },
//         },
//         course: {
//           select: { title: true, slug: true },
//         },
//         certification: {
//           select: { title: true, slug: true },
//         },
//         membershipPlan: {
//           select: { title: true },
//         },
//         subscription: {
//           select: { name: true, type: true },
//         },
//         event: {
//           select: { title: true, slug: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // Group purchases by referee
//     const purchasesByReferee = refereePurchases.reduce((acc, purchase) => {
//       const userId = purchase.studentProfile.userId;
//       if (!acc[userId]) acc[userId] = [];
//       acc[userId].push(purchase);
//       return acc;
//     }, {} as Record<string, typeof refereePurchases>);

//     // Calculate lifetime revenue
//     const lifetimeRevenue = refereePurchases
//       .filter((p) => p.paymentStatus === "COMPLETED")
//       .reduce((sum, p) => sum + p.totalAmountTk, 0);

//     // Get wallet for all users
//     const wallet = await db.wallet.findUnique({
//       where: { userId },
//       select: {
//         id: true,
//         availableCredits: true,
//         totalCredits: true,
//         usedCredits: true,
//         lifetimeEarnedCredits: true,
//       },
//     });

//     // Calculate milestone totals
//     const totalMilestoneBonusCash = calculateMilestoneTotals(referrals);

//     // Calculate earnings based on role
//     let earnings: any = {};

//     if (user.role === "STUDENT") {
//       // Get wallet transaction totals
//       const walletTotals = await getWalletTransactionTotals(wallet?.id);
      
//       earnings = {
//         currentCredits: wallet?.availableCredits || 0,
//         usedCredits: wallet?.usedCredits || 0,
//         totalCredits: wallet?.totalCredits || 0,
//         lifetimeEarnedCredits: wallet?.lifetimeEarnedCredits || 0,
//         referralBonusEarned: walletTotals.referralBonus,
//         milestoneBonusEarned: walletTotals.milestoneBonus,
//       };
//     } else if (user.role === "TEACHER") {
//       // Get teacher commissions
//       const commissions = await db.referrerCommission.findMany({
//         where: { beneficiaryUserId: userId },
//         select: { amountTk: true, status: true },
//       });

//       const cashEarnings = calculateCommissionsByStatus(commissions);
//       earnings = buildEarningsObject(wallet, cashEarnings, totalMilestoneBonusCash, "commissions");
//     } else if (user.role === "AFFILIATE") {
//       // Get affiliate profile
//       const affiliateProfile = await db.affiliateProfile.findUnique({
//         where: { userId },
//         select: {
//           totalEarnings: true,
//           pendingEarnings: true,
//           paidEarnings: true,
//         },
//       });

//       const cashEarnings = affiliateProfile ? {
//         pending: affiliateProfile.pendingEarnings,
//         approved: affiliateProfile.totalEarnings - affiliateProfile.paidEarnings - affiliateProfile.pendingEarnings,
//         paid: affiliateProfile.paidEarnings,
//         total: affiliateProfile.totalEarnings,
//       } : {
//         pending: 0,
//         approved: 0,
//         paid: 0,
//         total: 0,
//       };

//       earnings = buildEarningsObject(wallet, cashEarnings, totalMilestoneBonusCash, "affiliateEarnings");
//     }

//     // Format referrals
//     const formattedReferrals = referrals.map((referral) => {
//       const purchases = purchasesByReferee[referral.refereeUserId] || [];
//       return formatReferral(referral, purchases);
//     });

//     // Prepare response
//     const response = {
//       summary: {
//         // Stats from Referral table
//         totalReferrals: statusCounts.total,
//         statusBreakdown: statusCounts.breakdown,
        
//         // Calculated counts
//         totalReferees: statusCounts.total,
//         registeredReferees: statusCounts?.registered || 0,
//         paidReferees: (statusCounts?.paid_lite || 0) + (statusCounts.paid_prime || 0),
//         totalPrimeUpgradedReferees: statusCounts?.paid_prime || 0,
//         lifetimeRevenue,
        
//         // Earnings
//         ...earnings,
        
//         // Backward compatibility
//         pendingCommissions: earnings.cashEarningsPending || 0,
        
//         // Recent dates
//         lastReferralAt: lastReferral?.createdAt,
//         lastCreditAwardedAt: lastCreditedReferral?.creditedAt,
//       },
//       referrals: formattedReferrals,
//       role: user.role,
//       referralCode: user?.referralCode,
//     };

//     return NextResponse.json(response);
//   } catch (error) {
//     console.error("Error fetching referral stats:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch referral statistics" },
//       { status: 500 }
//     );
//   }
// }

// /api/referrals/stats/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerUserSession } from "@/lib/getServerUserSession";
import { ReferralStatus, CommissionStatus } from "@prisma/client";

const CASH_TO_CREDIT_RATE = parseFloat(process.env.CASH_TO_CREDIT_CONVERSION_RATE || "1");

// ============================================
// UTILITY FUNCTIONS
// ============================================

const cashToCredits = (cashAmount: number): number => cashAmount * CASH_TO_CREDIT_RATE;

/**
 * Get referral counts
 */
const getReferralStatusCounts = async (referrerUserId: string) => {
  const [total, registered, paidPrime] = await Promise.all([
    db.referral.count({ where: { referrerUserId } }),
    db.referral.count({ where: { referrerUserId, status: ReferralStatus.REGISTERED } }),
    db.referral.count({ where: { referrerUserId, status: ReferralStatus.PAID_PRIME } }),
  ]);

  return { total, registered, paidPrime };
};

/**
 * Calculate commission totals by status
 */
const calculateCommissionsByStatus = (commissions: { amountTk: number; status: CommissionStatus }[]) => {
  return commissions.reduce((totals, commission) => {
    totals.total += commission.amountTk;
    if (commission.status === "APPROVED") totals.approved += commission.amountTk;
    else if (commission.status === "PAID") totals.paid += commission.amountTk;
    return totals;
  }, { approved: 0, paid: 0, total: 0 });
};

/**
 * Get lifetime earned credits (referral + milestone bonuses)
 */
const getLifetimeEarnedCredits = async (walletId: string | undefined) => {
  if (!walletId) return 0;

  const result = await db.walletTransaction.aggregate({
    where: {
      walletId,
      type: { in: ["REFERRAL_BONUS", "MILESTONE_BONUS"] },
      status: "COMPLETED",
    },
    _sum: { amount: true },
  });

  return result._sum.amount || 0;
};

/**
 * Get purchase stats grouped by referee
 */
const getRefereePurchaseStats = async (refereeIds: string[]) => {
  if (refereeIds.length === 0) return {};

  const purchases = await db.purchase.findMany({
    where: {
      studentProfile: {
        userId: { in: refereeIds },
      },
      paymentStatus: "COMPLETED",
    },
    select: {
      totalAmountTk: true,
      studentProfile: {
        select: { userId: true },
      },
    },
  });

  return purchases.reduce((acc, purchase) => {
    const userId = purchase.studentProfile.userId;
    if (!acc[userId]) {
      acc[userId] = { count: 0, revenue: 0 };
    }
    acc[userId].count += 1;
    acc[userId].revenue += purchase.totalAmountTk;
    return acc;
  }, {} as Record<string, { count: number; revenue: number }>);
};

// ============================================
// MAIN ROUTE HANDLER
// ============================================

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getServerUserSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { role: true, referralCode: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get referral counts
    const statusCounts = await getReferralStatusCounts(userId);

    // Get wallet
    const wallet = await db.wallet.findUnique({
      where: { userId },
      select: {
        id: true,
        availableCredits: true,
        usedCredits: true,
      },
    });

    // Calculate lifetime revenue (total earned from referral and milestone bonuses)
    const lifetimeRevenue = await getLifetimeEarnedCredits(wallet?.id);

    // Build summary stats based on role
    let summary: any = {
      totalReferees: statusCounts.total,
      totalPrimeUpgradedReferees: statusCounts.paidPrime,
      lifetimeRevenue,
    };

    if (user.role === "STUDENT") {
      summary.currentCredits = wallet?.availableCredits || 0;
      summary.usedCredits = wallet?.usedCredits || 0;
    } else {
      // For TEACHER and AFFILIATE - get cash earnings
      const commissions = await db.referrerCommission.findMany({
        where: { beneficiaryUserId: userId },
        select: { amountTk: true, status: true },
      });

      const cashEarnings = calculateCommissionsByStatus(commissions);
      summary.cashEarningsApproved = cashEarnings.approved;
      summary.cashEarningsPaid = cashEarnings.paid;
    }

    // Get referrals with minimal necessary data
    const referrals = await db.referral.findMany({
      where: { referrerUserId: userId },
      select: {
        id: true,
        status: true,
        registeredAt: true,
        primeUpgradeAt: true,
        refereeUserId: true,
        referee: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            avatarUrl: true,
            currentPlan: true,
          },
        },
        commissions: {
          where: { beneficiaryUserId: userId },
          select: { amountTk: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Get purchase stats for all referees
    const refereeIds = referrals.map((r) => r.refereeUserId);
    const purchaseStatsByUser = await getRefereePurchaseStats(refereeIds);

    // Format referrals with purchase stats
    const formattedReferrals = referrals.map((referral) => {
      const purchaseStat = purchaseStatsByUser[referral.refereeUserId] || { 
        count: 0, 
        revenue: 0 
      };

      return {
        id: referral.id,
        referee: referral.referee,
        status: referral.status,
        registeredAt: referral.registeredAt,
        primeUpgradeAt: referral.primeUpgradeAt,
        totalPurchases: purchaseStat.count,
        totalRevenue: purchaseStat.revenue,
        commissionEarned: referral.commissions.reduce(
          (sum, c) => sum + c.amountTk,
          0
        ),
      };
    });

    return NextResponse.json({
      summary,
      referrals: formattedReferrals,
      role: user.role,
      referralCode: user.referralCode,
    });
  } catch (error) {
    console.error("Error fetching referral stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch referral statistics" },
      { status: 500 }
    );
  }
}