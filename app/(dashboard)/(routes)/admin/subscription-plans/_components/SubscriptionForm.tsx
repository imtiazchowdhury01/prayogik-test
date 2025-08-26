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

// Updated schema with subscription discount field
const subscriptionSchema = z.object({
  name: z.string().min(1, " is required"),
  type: z.enum(["MONTHLY", "YEARLY"], {
    required_error: "Please select a subscription type",
  }),
  regularPrice: z.number().positive("Price must be greater than 0"),
  subscriptionDiscountId: z.string().optional(),
});

const SubscriptionForm = ({ subscription, onClose, onSave }) => {
  const isEditing = !!subscription;
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultDiscountId, setDefaultDiscountId] = useState(null);
  const router = useRouter();

  // Initialize form with react-hook-form
  const form = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: subscription?.name || "",
      type: subscription?.type || "",
      regularPrice: subscription?.regularPrice || undefined,
      subscriptionDiscountId:
        subscription?.subscriptionDiscount_id ||
        subscription?.subscriptionDiscount?.id ||
        "",
    },
  });

  // Fetch subscription discounts on component mount
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        setIsLoading(true);
        const response = await clientApi.getSubscriptionDiscounts();

        if (response.status !== 200) {
          throw new Error("Failed to fetch subscription discounts");
        }

        setDiscounts(response.body);

        // Find the default discount
        const defaultDiscount = response?.body?.find(
          (discount) => discount.isDefault
        );
        if (defaultDiscount) {
          setDefaultDiscountId(defaultDiscount.id);

          // If creating a new subscription and no discount is selected, set the default
          if (!isEditing && !subscription?.subscriptionDiscount?.id) {
            form.setValue("subscriptionDiscountId", defaultDiscount.id);
          }
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

  const { isSubmitting, isDirty } = form.formState;

  const onSubmit = async (data) => {
    try {
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/${subscription.id}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions`;

      const method = isEditing ? "PUT" : "POST";

      const response = await subscriptionPlan(url, method, data);

      toast.success(
        `Subscription ${isEditing ? "updated" : "created"} successfully!`
      );

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving subscription:", error);
      toast.error(`Error ${isEditing ? "updating" : "creating"} subscription`);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">
        {isEditing ? "Edit" : "Add New"} Subscription Plan
      </h2>
      <RequiredFieldText className={"m-1 mb-4"} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <FormField
            control={form.control}
            name="regularPrice"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>
                  <RequiredFieldStar labelText="Regular Price" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter regular price"
                    value={value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      onChange(value ? Number(value) : undefined);
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  value={field.value}
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
                        {discount.name} ({discount.discountPercentage}%){" "}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {subscription?.isDefault && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
              <p className="text-sm text-blue-700">
                This is the default subscription plan.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={!isDirty || isSubmitting || isLoading}
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
