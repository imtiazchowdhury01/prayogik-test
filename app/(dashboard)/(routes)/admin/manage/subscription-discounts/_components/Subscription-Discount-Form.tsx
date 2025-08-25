// @ts-nocheck
"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader, Info } from "lucide-react";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrupdateSubscriptionDiscount } from "@/services/admin";

// Define the Zod schema for form validation
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  discountPercentage: z
    .number()
    .min(0, "Discount percentage must be at least 0")
    .max(100, "Discount percentage cannot exceed 100"),
  isDefault: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

const SubscriptionDiscountForm = ({ onClose, salesData }) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      discountPercentage: null,
      isDefault: false,
    },
  });

  const isDefault = watch("isDefault");
  const isEditingDefault = salesData?.isDefault;

  useEffect(() => {
    if (salesData) {
      reset({
        name: salesData.name,
        discountPercentage: salesData.discountPercentage,
        isDefault: salesData.isDefault || false,
      });
    }
  }, [salesData, reset]);

  const onSubmit = async (data: FormData) => {
    const method = salesData ? "PUT" : "POST";

    try {
      // The server action already handles the response.json() part
      const response = await createOrupdateSubscriptionDiscount(
        method,
        salesData,
        data
      );

      // No need to check response.ok, just assume success if no error is thrown
      toast.success(
        salesData
          ? "Subscription discount updated successfully!"
          : "Subscription discount created successfully!"
      );
      reset();
      onClose();
    } catch (error) {
      console.error("Error managing subscription discount:", error);
      toast.error("An error occurred while saving the discount.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-0">
        {salesData ? "Edit Discount" : "Add New Discount"}
      </h2>
      <RequiredFieldText className="mb-6 mt-0" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            <RequiredFieldStar labelText="Name" />
          </Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="name"
                placeholder="Enter Discount name"
                className={`mt-1 block w-full border ${
                  isEditingDefault ? "bg-gray-100" : ""
                } border-gray-300 rounded-md shadow-sm p-2`}
                disabled={isEditingDefault}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label
            htmlFor="discountPercentage"
            className="block text-sm font-medium text-gray-700"
          >
            <RequiredFieldStar labelText="Discount Percentage" />
          </Label>
          <Controller
            name="discountPercentage"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="discountPercentage"
                type="number"
                placeholder="Enter discount percentage (0-100)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? null : Number(value));
                }}
              />
            )}
          />
          {errors.discountPercentage && (
            <p className="text-red-500 text-sm mt-1">
              {errors.discountPercentage.message}
            </p>
          )}
        </div>

        {/* {!isEditingDefault && (
          <div className="mb-4">
            <div className="flex items-center">
              <Controller
                name="isDefault"
                control={control}
                render={({ field }) => (
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={field.value}
                    onChange={field.onChange}
                    className="mr-2"
                  />
                )}
              />
              <label
                htmlFor="isDefault"
                className="text-sm font-medium text-gray-700"
              >
                Set as Default Discount
              </label>
            </div>
          </div>
        )} */}

        {isEditingDefault && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-blue-700">
              This is the default subscription discount. Only the discount
              percentage can be edited.
            </p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="w-full flex items-center justify-center mt-10"
        >
          {isSubmitting ? (
            <Loader className="animate-spin h-4 w-4" />
          ) : salesData ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </div>
  );
};

export default SubscriptionDiscountForm;
