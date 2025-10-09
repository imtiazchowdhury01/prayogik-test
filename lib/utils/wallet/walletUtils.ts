import { WalletTransactionType } from "@prisma/client";
import type { CreditLot } from "@prisma/client";

/**
 * Format currency for display (Bangladesh Taka)
 */
export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format currency without decimals
 */
export function formatCurrencyShort(amount: number): string {
  return `৳${Math.round(amount).toLocaleString("en-BD")}`;
}

// Credit value: 100 credits = 1 BDT (default)
export const CREDIT_VALUE = Number(process.env.CREDIT_VALUE) || 1;

/**
 * Helper function to convert BDT to credits
 */
export function bdtToCredits(bdtAmount: number): number {
  return Math.floor(bdtAmount * CREDIT_VALUE);
}

/**
 * Helper function to convert credits to BDT
 */
export function creditsToBdt(credits: number): number {
  return credits / CREDIT_VALUE;
}

/**
 * Calculate days until expiry
 */
export function daysUntilExpiry(expiryDate: Date): number {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Format expiry date for display
 */
export function formatExpiryDate(expiryDate: Date): string {
  const days = daysUntilExpiry(expiryDate);

  if (days < 0) {
    return "Expired";
  } else if (days === 0) {
    return "Expires today";
  } else if (days === 1) {
    return "Expires tomorrow";
  } else if (days <= 7) {
    return `Expires in ${days} days`;
  } else if (days <= 30) {
    return `Expires in ${Math.ceil(days / 7)} weeks`;
  } else {
    const months = Math.ceil(days / 30);
    return `Expires in ${months} ${months === 1 ? "month" : "months"}`;
  }
}

/**
 * Get expiry urgency level
 */
export function getExpiryUrgency(
  expiryDate: Date
): "critical" | "warning" | "normal" {
  const days = daysUntilExpiry(expiryDate);

  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  return "normal";
}

/**
 * Get transaction type display name
 */
export function getTransactionTypeLabel(type: WalletTransactionType): string {
  const labels: Record<WalletTransactionType, string> = {
    REFERRAL_BONUS: "Referral Bonus",
    MILESTONE_BONUS: "Milestone Bonus",
    ADMIN_CREDIT: "Admin Credit",
    ADMIN_DEBIT: "Admin Debit",
    PURCHASE_DEDUCTION: "Purchase",
    REFUND: "Refund",
    EXPIRY: "Expired",
    PROMOTIONAL: "Promotional",
  };

  return labels[type] || type;
}

/**
 * Get transaction type color/variant for UI
 */
export function getTransactionTypeColor(
  type: WalletTransactionType
){
  const colorMap: Record<WalletTransactionType, 'text-green-600' | 'text-red-600' | 'text-orange-600' | 'text-blue-600'> = {
    REFERRAL_BONUS: 'text-green-600',
    MILESTONE_BONUS: 'text-green-600',
    ADMIN_CREDIT: 'text-blue-600',
    ADMIN_DEBIT: 'text-red-600',
    PURCHASE_DEDUCTION: 'text-orange-600',
    REFUND: 'text-green-600',
    EXPIRY: 'text-red-600',
    PROMOTIONAL: 'text-blue-600',
  };
  
  return colorMap[type] || 'bg-blue-600/20 text-blue-600';
}
export function getTransactionTypeBgColor(
  type: WalletTransactionType
){
  const colorMap: Record<WalletTransactionType, 'bg-green-600/20' | 'bg-red-600/20' | 'bg-orange-600/20' | 'bg-blue-600/20'> = {
    REFERRAL_BONUS: 'bg-green-600/20',
    MILESTONE_BONUS: 'bg-green-600/20',
    ADMIN_CREDIT: 'bg-blue-600/20',
    ADMIN_DEBIT: 'bg-red-600/20',
    PURCHASE_DEDUCTION: 'bg-orange-600/20',
    REFUND: 'bg-green-600/20',
    EXPIRY: 'bg-red-600/20',
    PROMOTIONAL: 'bg-blue-600/20',
  };
  
  return colorMap[type] || 'bg-blue-600/20';
}

/**
 * Check if transaction is a credit (positive)
 */
export function isCredit(type: WalletTransactionType): boolean {
  return [
    "REFERRAL_BONUS",
    "MILESTONE_BONUS",
    "ADMIN_CREDIT",
    "REFUND",
    "PROMOTIONAL",
  ].includes(type);
}

/**
 * Check if transaction is a debit (negative)
 */
export function isDebit(type: WalletTransactionType): boolean {
  return ["PURCHASE_DEDUCTION", "ADMIN_DEBIT", "EXPIRY"].includes(type);
}

/**
 * Calculate total expiring amount from credit lots
 */
export function calculateTotalExpiring(lots: CreditLot[]): number {
  return lots.reduce((sum, lot) => sum + lot.remainingAmount, 0);
}

/**
 * Group credit lots by expiry urgency
 */
export function groupByExpiryUrgency(lots: CreditLot[]) {
  const critical: CreditLot[] = [];
  const warning: CreditLot[] = [];
  const normal: CreditLot[] = [];

  for (const lot of lots) {
    const urgency = getExpiryUrgency(lot.expiresAt);

    if (urgency === "critical") {
      critical.push(lot);
    } else if (urgency === "warning") {
      warning.push(lot);
    } else {
      normal.push(lot);
    }
  }

  return { critical, warning, normal };
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Format date with time
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Calculate percentage of credits used
 */
export function calculateUsagePercentage(used: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((used / total) * 100);
}

/**
 * Validate credit amount for 80% rule
 */
export function validateCreditAmount(
  requestedCredits: number,
  totalAmount: number
): { isValid: boolean; maxAllowed: number; message?: string } {
  const maxAllowed = totalAmount * 0.8;

  if (requestedCredits > maxAllowed) {
    return {
      isValid: false,
      maxAllowed,
      message: `You can only use up to 80% (${formatCurrency(
        maxAllowed
      )}) of the order total in credits`,
    };
  }

  return {
    isValid: true,
    maxAllowed,
  };
}

/**
 * Get source icon/emoji for display
 */
export function getSourceIcon(source: string): string {
  const icons: Record<string, string> = {
    REFERRAL: "👥",
    MILESTONE: "🏆",
    ADMIN: "⚙️",
    PROMOTION: "🎁",
    REFUND: "↩️",
    PURCHASE: "🛒",
    CREDIT_LOT: "⏰",
  };

  return icons[source] || "💰";
}

/**
 * Generate transaction description
 */
export function generateTransactionDescription(
  type: WalletTransactionType,
  metadata?: Record<string, any>
): string {
  switch (type) {
    case WalletTransactionType.REFERRAL_BONUS:
      return "Earned from successful referral";
    case WalletTransactionType.MILESTONE_BONUS:
      return `Milestone reward for ${metadata?.milestoneCount || ""} referrals`;
    case WalletTransactionType.PROMOTIONAL:
      return "Promotional bonus";
    case WalletTransactionType.PURCHASE_DEDUCTION:
      return "Used for purchase";
    case WalletTransactionType.REFUND:
      return "Refunded from cancelled purchase";
    case WalletTransactionType.EXPIRY:
      return "Credits expired";
    case WalletTransactionType.ADMIN_CREDIT:
      return "Added by admin";
    case WalletTransactionType.ADMIN_DEBIT:
      return "Deducted by admin";
    default:
      return "Wallet transaction";
  }
}

/**
 * Sort transactions by date (newest first)
 */
export function sortTransactionsByDate<T extends { createdAt: Date }>(
  transactions: T[]
): T[] {
  return [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Filter transactions by date range
 */
export function filterTransactionsByDateRange<T extends { createdAt: Date }>(
  transactions: T[],
  startDate?: Date,
  endDate?: Date
): T[] {
  return transactions.filter((transaction) => {
    const txDate = new Date(transaction.createdAt);

    if (startDate && txDate < startDate) return false;
    if (endDate && txDate > endDate) return false;

    return true;
  });
}

/**
 * Get wallet health status
 */
export function getWalletHealthStatus(
  availableCredits: number,
  expiringAmount: number
): { status: "healthy" | "warning" | "critical"; message: string } {
  if (availableCredits === 0) {
    return {
      status: "critical",
      message: "No credits available",
    };
  }

  const expiringPercentage = (expiringAmount / availableCredits) * 100;

  if (expiringPercentage >= 50) {
    return {
      status: "critical",
      message: "More than 50% of your credits are expiring soon",
    };
  }

  if (expiringPercentage >= 25) {
    return {
      status: "warning",
      message: "Some of your credits are expiring soon",
    };
  }

  return {
    status: "healthy",
    message: "Your wallet is in good shape",
  };
}

/**
 * Calculate savings from using credits
 */
export function calculateSavings(
  originalPrice: number,
  creditsUsed: number
): { savings: number; savingsPercentage: number } {
  const savings = creditsUsed;
  const savingsPercentage = (savings / originalPrice) * 100;

  return {
    savings,
    savingsPercentage: Math.round(savingsPercentage),
  };
}

/*
 * Calculate max credits used in a transaction
 */
export function calculateMaxCreditsUsed(
  originalPrice: number,
  availableCredits: number
): number {
  const CREDIT_REDEMPTION_PERCENTAGE =
    Number(process.env.NEXT_PUBLIC_MAX_CREDIT_REDEMPTION_PERCENTAGE) || 80;
  const maxDiscountAllowed =
    originalPrice * (CREDIT_REDEMPTION_PERCENTAGE / 100);
  const maxRedeemableCredits =
    maxDiscountAllowed >= availableCredits
      ? Math.floor(availableCredits * CREDIT_VALUE)
      : Math.floor(maxDiscountAllowed);
  return maxRedeemableCredits;
}
