// components/referral/purchase-history-sheet.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getPurchaseHistoryByIdDBCall } from "@/lib/data-access-layer/referral";
import { PurchaseHistorySkeleton } from "./purchase-history-skeleton";
import { PurchasesTable } from "./referral-purchase-table";

interface PurchaseHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  refereeName: string;
  refereeEmail: string;
  refereeUserId: string;
}

export function PurchaseHistorySheet({
  open,
  onOpenChange,
  refereeName,
  refereeEmail,
  refereeUserId,
}: PurchaseHistorySheetProps) {
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && refereeUserId) {
      loadPurchases();
    }
  }, [open, refereeUserId]);

  const loadPurchases = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPurchaseHistoryByIdDBCall(refereeUserId);
      setPurchases(data);
    } catch (err) {
      console.error("Failed to load purchases:", err);
      setError("Failed to load purchase history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>Purchase History</SheetTitle>
          <SheetDescription>
            <div className="space-y-1">
              <p className="font-medium text-foreground">{refereeName}</p>
              <p className="text-sm">{refereeEmail}</p>
            </div>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {loading ? (
            <PurchaseHistorySkeleton />
          ) : error ? (
            <div className="flex h-[200px] items-center justify-center rounded-lg border border-destructive bg-destructive/10">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <>
              <PurchasesTable purchases={purchases} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
