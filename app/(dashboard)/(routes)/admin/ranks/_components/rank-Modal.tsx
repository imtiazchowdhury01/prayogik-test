// @ts-nocheck
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import RequiredFieldText from "@/components/common/requiredFieldText";
import RequiredFieldStar from "@/components/common/requiredFieldStar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { rankCreateOrUpdate } from "../action";
import { rankCreateOrUpdateByAdmin } from "@/services/admin";
import { Urls } from "@/constants/urls";

// Define validation schema with Zod
const rankSchema = z.object({
  name: z.string().min(1, "Rank name is required"),
  description: z.string(),
  numberOfSales: z.coerce
    .number()
    .min(1, "Number of sales must be a positive number"),
  feePercentage: z.coerce
    .number()
    .min(1, "Revenue percentage must be at least 1")
    .max(100, "Revenue percentage cannot exceed 100"),
});

type RankFormValues = z.infer<typeof rankSchema>;

const RankModal = ({ rank, onClose, onSave }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Initialize React Hook Form with Zod resolver
  const form = useForm<RankFormValues>({
    resolver: zodResolver(rankSchema),
    defaultValues: rank
      ? {
          name: rank.name,
          description: rank.description,
          numberOfSales: rank.numberOfSales,
          feePercentage: rank.feePercentage,
        }
      : {
          name: "",
          description: "",
          numberOfSales: "",
          feePercentage: "",
        },
  });

  const handleSubmit = async (data: RankFormValues) => {
    setIsLoading(true);

    try {
      const url = rank ? Urls.admin.rankById(rank.id) : Urls.admin.ranks;
      const method = rank ? "PUT" : "POST";
      const response = await rankCreateOrUpdateByAdmin(url, method, data);

      toast.success(
        rank ? "Rank updated successfully!" : "Rank created successfully!"
      );

      // Reset form
      form.reset();
      onSave();
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error(rank ? "Error updating rank." : "Error creating rank.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-semibold mb-6">
        {rank ? "Edit Teacher Rank" : "Add New Teacher Rank"}
      </h2>
      {/* <RequiredFieldText /> */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredFieldStar labelText="Rank Name" />
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter rank name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter rank description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numberOfSales"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredFieldStar labelText="Number of Sales Required" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    placeholder="Enter number of Sales"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="feePercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredFieldStar labelText="Revenue Percentage (%)" />
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={100}
                    {...field}
                    placeholder="Enter Revenue percentage (1-100)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button type="button" variant={"outline"} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !form.formState.isDirty}
              className={cn(
                "flex items-center justify-center",
                !form.formState.isDirty && "opacity-50"
              )}
            >
              {isLoading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : rank ? (
                "Save"
              ) : (
                "Create Rank"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default RankModal;
