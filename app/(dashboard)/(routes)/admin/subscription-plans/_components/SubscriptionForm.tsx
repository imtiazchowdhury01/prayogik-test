// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { useRouter } from "next/navigation";
import { clientApi } from "@/lib/utils/openai/client";
import { subscriptionPlan } from "@/services/admin";
import { getSubscriptionDBCall } from "@/lib/data-access-layer/subscriptions";

// More permissive schema - allows form to be valid before type selection
const subscriptionSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    type: z
      .enum(["MONTHLY", "YEARLY"], {
        required_error: "Please select a subscription type",
      })
      .optional(),
    regularPrice: z.coerce.number().min(0, "Price must be 0 or greater"),
    offerPrice: z.coerce.number().optional(),
    durationInMonths: z.coerce
      .number()
      .positive("Duration must be > 0")
      .optional(),
    durationInYears: z.coerce
      .number()
      .positive("Duration must be > 0")
      .optional(),
    isTrial: z.boolean().default(false),
    trialDurationInDays: z.coerce
      .number()
      .positive("Trial duration must be > 0")
      .optional(),
    subscriptionDiscountId: z.string().min(1, "Please select a discount"),
  })
  .refine(
    (data) => {
      // For trial subscriptions, only validate trial duration
      if (data.isTrial) {
        return data.trialDurationInDays && data.trialDurationInDays > 0;
      }

      // For non-trial subscriptions, if type is not selected yet, allow it
      if (!data.type || data.type === "") {
        return true; // Let them submit or continue filling the form
      }

      // If type IS selected, then validate the corresponding duration
      if (data.type === "MONTHLY") {
        return data.durationInMonths && data.durationInMonths > 0;
      }

      if (data.type === "YEARLY") {
        return data.durationInYears && data.durationInYears > 0;
      }

      return true;
    },
    {
      message: "Please fill in the duration for the selected billing type",
      path: ["durationInMonths"], // Point to the relevant field
    }
  );

const SubscriptionForm = ({ subscription, onClose, onSave }) => {
  const isEditing = !!subscription;
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultDiscountId, setDefaultDiscountId] = useState(null);
  const router = useRouter();
  const [isTrialExist, setIsTrialExist] = useState(false);
  console.log(subscription, "sub");
  const form = useForm({
    resolver: zodResolver(subscriptionSchema),
    mode: "onChange",
    defaultValues: {
      name: subscription?.name || "",
      type: subscription?.type || undefined, // undefined allows the form to be initially valid
      regularPrice: subscription?.regularPrice ?? 0,
      offerPrice: subscription?.offerPrice ?? 0,
      durationInMonths: subscription?.durationInMonths ?? 1,
      durationInYears: subscription?.durationInYears ?? 1,
      isTrial: subscription?.isTrial || false,
      trialDurationInDays: subscription?.trialDurationInDays ?? 30,
      subscriptionDiscountId:
        subscription?.subscriptionDiscount?.id ||
        subscription?.subscriptionDiscount_id ||
        defaultDiscountId,
    },
  });

  const watchedType = form.watch("type");
  const watchedIsTrial = form.watch("isTrial");
  const { isSubmitting, isValid } = form.formState;

  // Fetch subscription discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
        const response = await clientApi.getSubscriptionDiscounts();
        if (response.status !== 200) {
          throw new Error("Failed to fetch subscription discounts");
        }
        setDiscounts(response.body);
        const defaultDiscount = response?.body?.find((d) => d.isDefault);
        if (defaultDiscount) {
          setDefaultDiscountId(defaultDiscount.id);
          // if (!isEditing && !subscription?.subscriptionDiscount?.id) {
          //   form.setValue("subscriptionDiscountId", defaultDiscount.id);
          //   form.clearErrors("subscriptionDiscountId");

          // }
        }
      } catch (error) {
        console.error("Error fetching subscription discounts:", error);
        toast.error("Failed to load subscription discounts");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiscounts();
  }, [form, isEditing, subscription]);

  // check trial available or not
  useEffect(() => {
    const checkTrialExist = async () => {
      // Add function name
      const subscriptionPlans = await getSubscriptionDBCall();
      const trialSubscriptionPlan = subscriptionPlans.find(
        (plan) => plan.isTrial
      );
      if (trialSubscriptionPlan) {
        setIsTrialExist(true);
      } else {
        setIsTrialExist(false);
      }
    };
    checkTrialExist(); // Call the function
  }, []);

  // submit handler
  const onSubmit = async (data) => {
    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/${subscription.id}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions`;
      const method = isEditing ? "PUT" : "POST";
      await subscriptionPlan(url, method, data);
      toast.success(
        `Subscription ${isEditing ? "updated" : "created"} successfully!`
      );
      onSave();
      onClose();
    } catch (error) {
      console.log(error?.message);
      console.error("Error saving subscription:", error);
      toast.error(
        error.message ||
          `Error ${isEditing ? "updating" : "creating"} subscription`
      );
    }
  };

  // Helper: number input that allows empty value
  const numberInput = (value, onChange) => ({
    value: value ?? "",
    onChange: (e) => {
      const val = e.target.value;
      onChange(val === "" ? "" : Number(val));
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold">
        {isEditing ? "Edit" : "Add New"} Subscription Plan
      </h2>
      <RequiredFieldText className="m-1 mb-4" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredFieldStar labelText="Name" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter subscription name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Trial checkbox */}
          {!isTrialExist && subscription?.isTrial && (
            <FormField
              control={form.control}
              name="isTrial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable trial</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          )}

          {/* Trial duration */}
          {watchedIsTrial && (
            <FormField
              control={form.control}
              name="trialDurationInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <RequiredFieldStar labelText="Trial Duration in Days" />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter trial duration in days"
                      {...numberInput(field.value, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {!watchedIsTrial && (
            <>
              {/* Price */}
              <FormField
                control={form.control}
                name="regularPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredFieldStar labelText="Regular Price" />
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter regular price"
                        {...numberInput(field.value, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Offer Price */}
              <FormField
                control={form.control}
                name="offerPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Offer Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter offer price"
                        {...numberInput(field.value, field.onChange)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <RequiredFieldStar labelText="Billing Frequency" />
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration fields */}
              {watchedType === "MONTHLY" && (
                <FormField
                  control={form.control}
                  name="durationInMonths"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredFieldStar labelText="Duration in Months" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter duration in months"
                          {...numberInput(field.value, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {watchedType === "YEARLY" && (
                <FormField
                  control={form.control}
                  name="durationInYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredFieldStar labelText="Duration in Years" />
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter duration in years"
                          {...numberInput(field.value, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </>
          )}

          {/* Discount */}
          <FormField
            control={form.control}
            name="subscriptionDiscountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredFieldStar labelText="Course Discount" />
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          isLoading ? "Loading discounts..." : "Select discount"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {discounts.map((discount) => (
                      <SelectItem key={discount.id} value={discount.id}>
                        {discount.name} ({discount.discountPercentage}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Info */}
          {subscription?.isDefault && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                This is the default subscription plan.
              </p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!isValid || isSubmitting || isLoading}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader className="animate-spin h-4 w-4" />
            ) : isEditing ? (
              "Update Plan"
            ) : (
              "Create Plan"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SubscriptionForm;
