import { PurchaseType, ReferralStatus, ReferrerType } from "@prisma/client"

// types/referral.ts
export interface BaseReferralStats {
  totalReferees: number;
  totalRegisteredReferees: number;
  totalPaidReferees: number;
  totalPrimeUpgradedReferees: number;
  lifetimeRevenueFromReferees: number;
  lastReferralAt: Date | null;
  lastCreditAwardedAt: Date | null;
}

export interface StudentReferralStats extends BaseReferralStats {
  currentCredits: number;
  usedCredits: number;
  totalCredits: number;
}

export interface TeacherAffiliateReferralStats extends BaseReferralStats {
  cashEarningsPending: number;
  cashEarningsApproved: number;
  cashEarningsPaid: number;
}

export type ReferralStats = StudentReferralStats | TeacherAffiliateReferralStats;

export interface Referral {
  id: string
  refereeUserId: string
  refereeName: string
  refereeEmail: string
  status: ReferralStatus
  clickedAt?: string
  registeredAt?: string
  firstPurchaseAt?: string
  primeUpgradeAt?: string
  creditedAt?: string
}

export interface Purchase {
  id: string
  purchaseType: PurchaseType
  totalAmountTk: number
  createdAt: string
  courseName?: string
  certificationName?: string
  membershipName?: string
  subscriptionName?: string
}

export interface ReferralDashboardData {
  referralCode: string
  referrerType: ReferrerType
  stats: ReferralStats
  referrals: Referral[]
}
