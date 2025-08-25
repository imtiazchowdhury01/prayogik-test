// @ts-nocheck
// import { updateBkashPaymentByAdmin } from "@/app/dal/admin";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { clientApi } from "@/lib/utils/openai/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bkashManualPaymentStatus,
  BkashManualPaymentType,
} from "@prisma/client";
import { Loader, X, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const manualPaymentSchema = z
  .object({
    amount: z
      .string()
      .min(1, "Paid Amount is required")
      .refine((val) => !isNaN(parseFloat(val)), {
        message: "Must be a valid number",
      })
      .transform(Number)
      .refine((val) => val > 0, "Amount must be greater than 0"),

    payableAmount: z
      .number()
      .min(0.01, "Pauable Amount must be greater than 0"),
    trxId: z
      .array(z.string().min(1, "Transaction ID is required"))
      .min(1, "At least one transaction ID is required"),
    payFrom: z
      .array(z.string().min(1, "Phone number is required"))
      .min(1, "At least one phone number is required"),
    // here would a validation check if the amount is equal to payable only then SUCCESS can be selected

    status: z.enum([
      bkashManualPaymentStatus.PENDING,
      bkashManualPaymentStatus.SUCCESS,
      bkashManualPaymentStatus.FAILED,
    ]),
  })
  .refine(
    (data) => {
      // If status is SUCCESS, amount must equal payableAmount
      if (data.status === bkashManualPaymentStatus.SUCCESS) {
        return data.amount === data.payableAmount;
      }
      return true; // Allow other statuses regardless of amount matching
    },
    {
      message: "Amount must equal payable amount when status is SUCCESS",
      path: ["status"], // This will attach the error to the status field
    }
  );

type ManualPaymentFormValues = z.infer<typeof manualPaymentSchema>;

type ManualPaymentDialogProps = {
  initialData?: {
    id: string;
    amount: number;
    payableAmount: number;
    status: bkashManualPaymentStatus;
    trxId: string;
    payFrom: string[];
    userName?: string;
    courseTitle?: string;
  };
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function ManualPaymentDialog({
  initialData,
  open,
  setOpen,
}: ManualPaymentDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ManualPaymentFormValues>({
    resolver: zodResolver(manualPaymentSchema),
    defaultValues: {
      amount: initialData?.amount.toString() || "",
      payableAmount: initialData?.payableAmount || 0,
      trxId: initialData?.trxId?.split(",") || [""],
      payFrom: initialData?.payFrom || [""],
      status: initialData?.status || "PENDING",
    },
  });

  const {
    fields: trxIdFields,
    append: appendTrxId,
    remove: removeTrxId,
  } = useFieldArray({
    control: form.control,
    name: "trxId",
  });

  const {
    fields: payFromFields,
    append: appendPayFrom,
    remove: removePayFrom,
  } = useFieldArray({
    control: form.control,
    name: "payFrom",
  });

  const handleFormSubmit = async (data: ManualPaymentFormValues) => {
    if (!initialData?.id) return;

    setLoading(true);
    try {
      const updateData = {
        ...data,
      };

      await clientApi.updateBkashPaymentById({
        params: {
          id: initialData.id,
        },
        body: updateData,
      });

      setOpen(false);
      router.refresh();
      toast.success("Manual payment updated successfully");
    } catch (error) {
      toast.error(error?.message || "An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTrxId = () => {
    appendTrxId("");
  };

  const addPayFrom = () => {
    appendPayFrom("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (loading) return;
        setOpen(open);
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Manual Payment</DialogTitle>
          <DialogDescription>
            Update the payment details below
          </DialogDescription>
        </DialogHeader>

        {initialData?.userName && initialData?.courseTitle && (
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <p>
              <strong>User:</strong> {initialData.userName}
            </p>
            <p>
              <strong>Course:</strong> {initialData.courseTitle}
            </p>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-4 mt-3"
          >
            <FormField
              control={form.control}
              name="payableAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payable Amount</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Paid Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Paid Amount" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="Enter paid amount"
                      // Handle empty string explicitly
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transaction IDs */}
            <div className="space-y-2">
              <FormLabel>
                <RequiredFieldStar labelText="Transaction IDs" />
              </FormLabel>
              {trxIdFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`trxId.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-between gap-2">
                          <div className="flex-1">
                            <Input
                              {...field}
                              placeholder="Enter transaction ID"
                            />
                          </div>
                          {trxIdFields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeTrxId(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTrxId}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction ID
              </Button>
            </div>

            {/* Pay From (Phone Numbers) */}
            <div className="space-y-2">
              <FormLabel>
                <RequiredFieldStar labelText="Pay From (Phone Numbers)" />
              </FormLabel>
              {payFromFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`payFrom.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              {...field}
                              placeholder="Enter phone number"
                            />
                          </div>
                          {payFromFields.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removePayFrom(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPayFrom}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Phone Number
              </Button>
            </div>

            <FormField
              control={form.control}
              name={"status"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={bkashManualPaymentStatus.PENDING}>
                        Pending
                      </SelectItem>
                      <SelectItem value={bkashManualPaymentStatus.SUCCESS}>
                        Success
                      </SelectItem>
                      <SelectItem value={bkashManualPaymentStatus.FAILED}>
                        Failed
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
