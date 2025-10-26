// components/dashboard/view-details-drawer.tsx
"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Mail,
  User,
  Calendar,
  Package,
  CreditCard,
  FileText,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ViewDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    date: string;
    userName: string;
    email: string;
    itemName: string;
    type: string;
    amount: number;
    status: string;
  } | null;
}

export function ViewDetailsDrawer({
  open,
  onOpenChange,
  data,
}: ViewDetailsDrawerProps) {
  const [transactionId] = useState(
    `TXN-${Math.random().toString(36).substring(2, 15).toUpperCase()}`
  );

  if (!data) return null;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          color:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          icon: <CheckCircle2 className="h-4 w-4" />,
        };
      case "PENDING":
        return {
          color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          icon: <Clock className="h-4 w-4" />,
        };
      case "FAILED":
        return {
          color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
          icon: <XCircle className="h-4 w-4" />,
        };
      default:
        return {
          color:
            "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
          icon: <Clock className="h-4 w-4" />,
        };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SINGLE_COURSE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "SUBSCRIPTION":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "EVENT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "CERTIFICATION":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const statusConfig = getStatusConfig(data.status);

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="top-0 right-0 left-auto mt-0 w-[500px] rounded-none h-full">
        <DrawerHeader className="border-b sticky top-0 bg-background z-10">
          <div className="space-y-2">
            <DrawerTitle className="text-2xl">Transaction Details</DrawerTitle>
            <DrawerDescription className="sr-only"></DrawerDescription>
          </div>
        </DrawerHeader>

        <div className="flex-1 h-[calc(100vh-180px)] overflow-y-scroll">
          <div className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <h3 className="font-semibold text-lg">Customer Information</h3>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Name
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">{data.userName}</p>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Mail className="h-3 w-3 -mt-1" />
                      Email
                    </p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-between group">
                      <p className="font-medium text-sm break-all">
                        {data.email}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => copyToClipboard(data.email)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Package className="h-5 w-5 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="font-semibold text-lg">Purchase Details</h3>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Item
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">{data.itemName}</p>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Type
                    </p>
                  </div>
                  <div className="col-span-2">
                    <Badge className={`${getTypeColor(data.type)} font-medium`}>
                      {data.type.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="h-3 w-3  -mt-1" />
                      Date
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium">
                      {new Date(data.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(data.date).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <h3 className="font-semibold text-lg">Payment Information</h3>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Total Amount
                    </p>
                    <p className="text-3xl font-bold text-primary">
                      ৳
                      {data.amount.toLocaleString("en-BD", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <Separator className="opacity-50" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Method
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-medium uppercase">
                      {data.type === "SUBSCRIPTION" ? "Credit Card" : "bKash"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-300" />
                </div>
                <h3 className="font-semibold text-lg">Transaction Info</h3>
              </div>
              <Separator />
              <div className="space-y-4">
                <div className="bg-muted/40 rounded-lg p-4 border">
                  <div className="flex items-center justify-between group">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Transaction ID
                      </p>
                      <p className="font-mono font-semibold text-sm">
                        {transactionId}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(transactionId)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DrawerFooter className="border-t sticky bottom-0 bg-background">
          <div className="flex gap-2">
            <DrawerClose asChild>
              <Button className="flex-1">Close</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
