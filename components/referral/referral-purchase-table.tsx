import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/referral-utils";

interface Purchase {
  id: string;
  purchaseType: string;
  totalAmountTk: number;
  creditsUsedTk?: number;
  paymentStatus?: string;
  createdAt: string;
  courseName?: string;
  certificationName?: string;
  membershipName?: string;
  eventName?: string;
  subscriptionName?: string;
}

interface PurchasesTableProps {
  purchases: Purchase[];
}

const getPurchaseItemName = (purchase: Purchase) => {
  return (
    purchase.courseName ||
    purchase.certificationName ||
    purchase.membershipName ||
    purchase.eventName ||
    purchase.subscriptionName ||
    "N/A"
  );
};

const getPurchaseTypeBadgeVariant = (type: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "outline" | "destructive"
  > = {
    SINGLE_COURSE: "default",
    CERTIFICATION: "secondary",
    MEMBERSHIP: "outline",
    SUBSCRIPTION: "default",
    EVENT: "secondary",
    TRIAL: "outline",
    OFFER: "default",
  };
  return variants[type] || "default";
};

const getPaymentStatusBadgeVariant = (status?: string) => {
  const variants: Record<
    string,
    "default" | "secondary" | "outline" | "destructive"
  > = {
    COMPLETED: "default",
    PENDING: "secondary",
    FAILED: "destructive",
    REFUNDED: "outline",
  };
  return status ? variants[status] || "default" : "default";
};

export function PurchasesTable({ purchases }: PurchasesTableProps) {
  if (purchases.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border">
        <p className="text-muted-foreground">No purchases found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="min-h-[400px] overflow-y-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell className="font-medium">
                  {formatDate(purchase.createdAt)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {getPurchaseItemName(purchase)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={getPurchaseTypeBadgeVariant(purchase.purchaseType)}
                  >
                    {purchase.purchaseType.replace(/_/g, " ")}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={getPaymentStatusBadgeVariant(
                      purchase.paymentStatus
                    )}
                  >
                    {purchase.paymentStatus || "COMPLETED"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
