// @ts-nocheck

"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Urls } from "@/constants/urls";
import { zodResolver } from "@hookform/resolvers/zod";
import { TeacherPaymentStatus } from "@prisma/client";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useFormState } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

export default function EarningModalBody({ earningId, row, setDialogVisible }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const {
    id,
    month,
    year,
    total_earned,
    total_paid,
    balance_remaining,
    status,
  } = row?.original;

  const totalPayable = balance_remaining;

  // Create zod schema for validation
  const formSchema = z.object({
    amount_paid: z
      .number()
      .positive("Amount must be greater than 0")
      .refine((val) => val <= totalPayable, {
        message: `Amount cannot exceed ${totalPayable} TK`,
      }),
    payment_status: z.string().min(1, "Please select a status"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount_paid: 0,
      payment_status: TeacherPaymentStatus.PAID,
    },
  });

  const { isValid } = useFormState({ control: form.control });

  // Handle form submission
  async function onSubmit(formData) {
    setLoading(true);
    try {
      // Format the amount_paid to 2 decimal places and convert it back to a number
      const formatData = {
        ...formData,
        amount_paid: parseFloat(formData.amount_paid.toFixed(2)),
      };

      const response = await fetch(Urls.admin.teacherPay, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formatData, earningId }),
      });

      const data = await payTeacherEarnings(formatData, earningId);

      if (response.ok) {
        toast.success(data.message || "Payment updated successfully");
        setDialogVisible(false);
        router.refresh();
      } else {
        toast.error(data.error || "Failed to update payment.");
      }
    } catch (err) {
      toast.error("An error occurred while updating payment");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const getMonthName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months[monthNumber - 1]; // Subtract 1 because array is zero-indexed
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 grid gap-4 py-4"
      >
        <div className="flex justify-between gap-3">
          <span className="font-normal">Month</span>
          <span>{`${getMonthName(month)} ${year}`}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-normal">Total Payable</span>
          <span>
            <span className="font-bold text-green-600 text-xl">
              {balance_remaining.toFixed(2)}
            </span>{" "}
            TK
          </span>
        </div>

        <FormField
          control={form.control}
          name="amount_paid"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0">
              <FormLabel className="flex-shrink-0 mr-4 text-base font-normal">
                Amount Paid
              </FormLabel>
              <div className="flex-grow max-w-[200px]">
                <FormControl>
                  <div className="relative">
                    <Controller
                      name="amount_paid"
                      control={form.control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          className="pl-3 pr-12"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      )}
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-gray-500">
                      TK
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between space-y-0">
              <FormLabel className="flex-shrink-0 mr-4 text-base font-normal">
                Payment Status
              </FormLabel>
              <div className="flex-grow max-w-[200px]">
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem
                      key={TeacherPaymentStatus.PAID}
                      value={TeacherPaymentStatus.PAID}
                    >
                      {TeacherPaymentStatus.PAID}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-between gap-3 mt-5">
          {isValid && (
            <Button
              type="button"
              onClick={() => setDialogVisible(false)}
              className="flex-1 p-2"
              variant="outline"
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            className={`flex-1  p-2 disabled:bg-gray-300 ${
              loading || !isValid
                ? "cursor-not-allowed bg-gray-300"
                : "bg-teal-600 hover:bg-teal-500"
            }`}
            variant="default"
            disabled={loading || !isValid}
          >
            {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : "Add"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
