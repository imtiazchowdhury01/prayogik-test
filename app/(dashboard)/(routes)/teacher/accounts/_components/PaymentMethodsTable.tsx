//@ts-nocheck
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

export const PaymentMethodsTable = ({
  paymentMethods,
  onMakePrimary,
  onDelete,
  loading,
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Account Number</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Routing No</TableHead>
          <TableHead>Account Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paymentMethods.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="py-4 text-center text-gray-500">
              <h5>No payment method found!</h5>
            </TableCell>
          </TableRow>
        ) : (
          paymentMethods.map((method) => (
            <TableRow key={method.id}>
              <TableCell>{method.bankName}</TableCell>
              <TableCell>{method.accountNumber}</TableCell>
              <TableCell>{method.branch}</TableCell>
              <TableCell>{method.routingNo}</TableCell>
              <TableCell>{method.accName}</TableCell>
              <TableCell
                className={cn(
                  method.active ? "text-green-500" : "text-red-500"
                )}
              >
                {method.active ? "Active" : "Inactive"}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2 w-full">
                  {!method.active && (
                    <Button
                      className="text-xs p-2"
                      onClick={() => onMakePrimary(method)}
                    >
                      Make Primary
                    </Button>
                  )}
                  <Trash
                    onClick={() => onDelete(method)}
                    className={cn(
                      "w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-all"
                    )}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};
