import { 
  WalletTransactionType, 
  WalletTransaction,
  CreditLot 
} from '@prisma/client';

// Source values used when creating CreditLots / transactions
export type SourceType = 'REFERRAL' | 'MILESTONE' | 'ADMIN' | 'PROMOTIONAL' | 'PURCHASE';

// Generic reference types used on WalletTransaction.referenceType
export type ReferenceType = 'REFERRAL' | 'MILESTONE' | 'PURCHASE' | 'CREDIT_LOT' | 'PROMOTIONAL' | string;

export interface AddCreditsParams {
  userId: string;
  amount: number;
  type: WalletTransactionType;
  description?: string;
  // High-level source (for credit lots)
  source: SourceType | string;
  // Optional generic reference id
  sourceReferenceId?: string;
  // Optional explicit relation ids to set on the wallet transaction
  referralId?: string;
  referralMilestoneId?: string;
  purchaseId?: string;
  creditLotId?: string;
  expiresInMonths?: number;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export interface SpendCreditsParams {
  userId: string;
  amount: number;
  description?: string;
  // Generic polymorphic reference fields (stringly-typed)
  referenceId?: string;
  referenceType?: ReferenceType;
  // Explicit relation ids (preferred when available)
  purchaseId?: string;
  referralId?: string;
  referralMilestoneId?: string;
  creditLotId?: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

export interface WalletBalance {
  totalCredits: number;
  availableCredits: number;
  expiredCredits: number;
  usedCredits: number;
  lifetimeEarnedCredits: number;
}

export interface CreditCalculation {
  creditsUsed: number;
  remainingAmountTk: number;
  availableCredits: number;
}

export interface TransactionHistoryResult {
  transactions: WalletTransaction[];
  total: number;
  limit: number;
  offset: number;
}

export interface ExpiryTimeline {
  expiringSoon: CreditLot[];
  expiringLater: CreditLot[];
  totalExpiring: number;
}

export interface WalletOverview {
  balance: WalletBalance;
  expiringCredits: CreditLot[];
  recentTransactions: WalletTransaction[];
  expiryTimeline: ExpiryTimeline;
}

export interface CreditValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  availableCredits: number;
  requestedCredits: number;
  maxAllowedCredits: number;
  adjustedCredits: number;
}

export interface PurchaseWithCreditsResult {
  totalAmountTk: number;
  creditsUsedTk: number;
  remainingAmountTk: number;
  creditTransaction: WalletTransaction | null;
}

export interface ExpiryNotification {
  userId: string;
  userEmail: string;
  userName: string;
  expiringAmount: number;
  expiresAt: Date;
}

export interface ExpiryStats {
  expiredLastMonth: {
    amount: number;
    count: number;
  };
  activeLots: {
    amount: number;
    count: number;
  };
  expiringNext30Days: {
    amount: number;
    count: number;
  };
}

export interface ExpiryJobResult {
  processed: number;
  failed: number;
  totalExpiredAmount: number;
}

// Action Result Types
export type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };