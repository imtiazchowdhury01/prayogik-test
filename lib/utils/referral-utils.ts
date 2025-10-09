import { PurchaseType, ReferralStatus } from "@prisma/client";

export function getStatusBadgeVariant(
  status: any
): "default" | "secondary" | "success" | "warning" | "destructive" {
  switch (status) {
    case "CLICKED":
      return "secondary";
    case "REGISTERED":
      return "default";
    case "PAID_LITE":
      return "warning";
    case "PAID_PRIME":
      return "success";
    case "CREDITED":
      return "success";
    case "BLOCKED":
      return "destructive";
    default:
      return "default";
  }
}

export function getStatusLabel(status: any): string {
  switch (status) {
    case "CLICKED":
      return "Clicked";
    case "REGISTERED":
      return "Registered";
    case "PAID_LITE":
      return "Paid (Lite)";
    case "PAID_PRIME":
      return "Paid (Prime)";
    case "CREDITED":
      return "Credited";
    case "BLOCKED":
      return "Blocked";
    default:
      return status;
  }
}

export function getPurchaseTypeLabel(type: PurchaseType): string {
  switch (type) {
    case "SINGLE_COURSE":
      return "Single Course";
    case "MEMBERSHIP":
      return "Membership";
    case "CERTIFICATION":
      return "Certification";
    case "SUBSCRIPTION":
      return "Subscription";
    case "TRIAL":
      return "Trial";
    case "OFFER":
      return "Offer";
    case "EVENT":
      return "Event";
    default:
      return type;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function getReferralLink(referralCode: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`;
}
