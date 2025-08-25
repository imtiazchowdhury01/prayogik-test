// @ts-nocheck
"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { Pencil, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import moment from "moment";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { revalidatePage } from "@/actions/revalidatePage";

// Updated schema with conditional validation
const formSchema = z.object({
  isFree: z.boolean().default(false),
  prices: z.array(
    z
      .object({
        id: z.string().optional(),
        regularAmount: z.coerce.number().optional(),
        discountedAmount: z.coerce.number().optional(),
        duration: z.enum(["1", "NA"]),
        frequency: z.enum(["MONTHLY", "YEARLY", "LIFETIME"]),
        discountExpiresOn: z.date().optional(),
        isFree: z.boolean().default(false),
      })
      .refine(
        (data) => {
          // If it's free, no need to validate regularAmount
          if (data.isFree) return true;
          // If not free, regularAmount must be greater than 0
          return data.regularAmount && data.regularAmount > 0;
        },
        {
          message: "Regular amount must be greater than 0 for paid courses",
          path: ["regularAmount"],
        }
      )
      .refine(
        (data) =>
          !data.discountedAmount ||
          (data.regularAmount && data.discountedAmount < data.regularAmount),
        {
          message: "Discounted amount should be less than regular amount",
          path: ["discountedAmount"],
        }
      )
  ),
});

export const MultiplePriceForm = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDiscountFields, setShowDiscountFields] = useState([]);
  const router = useRouter();

  // Process initial data
  const nonmembershipPrices =
    initialData?.prices?.filter(
      (price) => price.isSubscriptionPrice !== true
    ) || [];

  const isInitiallyFree = nonmembershipPrices[0]?.isFree || false;

  const getInitialPrices = () => {
    if (nonmembershipPrices.length) {
      return nonmembershipPrices.map((price) => ({
        ...price,
        duration: price.duration === 0 ? "NA" : "1",
        discountExpiresOn: price?.discountExpiresOn || undefined,
        discountedAmount: price?.discountedAmount || undefined,
      }));
    }

    return [
      {
        regularAmount: 0,
        discountedAmount: undefined,
        duration: "1",
        frequency: "LIFETIME",
        discountExpiresOn: undefined,
        isFree: false,
      },
    ];
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: isInitiallyFree,
      prices: getInitialPrices(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "prices",
  });

  const { isSubmitting, isValid } = form.formState;
  const watchIsFree = form.watch("isFree");

  // API functions
  const updateCoursePrices = async (updatedValues) => {
    try {
      const res = await axios.post(`/api/courses/prices`, updatedValues);
      return res;
    } catch (error) {
      console.error("Error updating prices:", error);
      throw error;
    }
  };

  const deleteAllPricesFromDb = async (courseId) => {
    try {
      const response = await axios.delete(
        `/api/courses/prices?courseId=${courseId}`
      );
      return response;
    } catch (error) {
      console.error("Error deleting all prices:", error);
      throw error;
    }
  };

  const fetchExistingPrices = async (courseId) => {
    try {
      const response = await axios.get(
        `/api/courses/prices?courseId=${courseId}`
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching existing prices:", error);
      return [];
    }
  };

  // Form handlers
  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values) => {
    try {
      const existingPrices = await fetchExistingPrices(courseId);

      // Delete existing prices
      if (existingPrices.length > 0) {
        await deleteAllPricesFromDb(courseId);
      }

      if (values.isFree) {
        // Handle free course
        await axios.patch(`/api/courses/${courseId}`, {
          isUnderSubscription: false,
        });

        const freeCoursePrices = [
          {
            isFree: true,
            regularAmount: 0,
            discountedAmount: null,
            duration: "1",
            frequency: "LIFETIME",
            discountExpiresOn: null,
            courseId: courseId,
          },
        ];

        await updateCoursePrices(freeCoursePrices);
      } else {
        // Handle paid course
        const paidCoursePrices = values.prices
          .filter((price) => !price.isFree)
          .map((price) => ({
            ...price,
            duration: price.duration === "1" ? "1" : "NA",
            courseId,
            isFree: false,
          }));

        await updateCoursePrices(paidCoursePrices);
      }

      toast.success("Course prices updated successfully");
      toggleEdit();
       await revalidatePage([
      { route: '/(site)', type: "layout" },
      { route: "/courses", type: "layout" },
    ]);
      router.refresh();
    } catch (error) {
      console.error("Error updating course prices:", error);
      toast.error("Failed to update course prices. Please try again.");
    }
  };

  // Effects
  useEffect(() => {
    const prices = form.getValues("prices");
    setShowDiscountFields(prices.map((price) => !!price.discountedAmount));
  }, [form]);

  // Handle free checkbox change
  useEffect(() => {
    if (watchIsFree) {
      // When free is selected, set a default free price
      form.setValue("prices", [
        {
          isFree: true,
          regularAmount: 0,
          discountedAmount: undefined,
          duration: "1",
          frequency: "LIFETIME",
          discountExpiresOn: undefined,
        },
      ]);
    } else {
      // When free is unselected, reset to paid prices
      form.setValue(
        "prices",
        getInitialPrices().map((price) => ({ ...price, isFree: false }))
      );
    }
  }, [watchIsFree]);

  const toggleDiscountField = (index) => {
    setShowDiscountFields((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];

      if (!newState[index]) {
        // Reset discount fields when hiding
        form.setValue(`prices.${index}.discountedAmount`, undefined);
        form.setValue(`prices.${index}.discountExpiresOn`, undefined);
      }

      return newState;
    });
  };

  return (
    <div className="p-4 mt-6 border rounded-md bg-slate-100">
      <div className="flex items-center justify-between font-medium">
        <div>
          Course price
          <span className="text-red-500">*</span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit price
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="flex flex-col max-w-lg">
          {nonmembershipPrices?.length ? (
            nonmembershipPrices[0]?.isFree ? (
              <p className="text-lg font-medium text-green-600">Free</p>
            ) : (
              nonmembershipPrices.map((price, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 mb-2 bg-white border border-gray-200 rounded-md"
                >
                  <div>
                    {price.discountedAmount ? (
                      <>
                        <span className="text-base font-medium">
                          ৳ {price.discountedAmount}
                        </span>
                        <span className="ml-2 text-sm text-gray-600 line-through">
                          ৳ {price.regularAmount}
                        </span>
                      </>
                    ) : (
                      <span className="text-base font-medium">
                        ৳ {price.regularAmount}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm">
                      {price.frequency === "LIFETIME"
                        ? "Lifetime"
                        : price.frequency === "YEARLY"
                        ? "Yearly"
                        : "Monthly"}
                    </div>
                    {price.discountExpiresOn && (
                      <p className="text-xs text-gray-600">
                        Expires:{" "}
                        {moment(price.discountExpiresOn).format("MMM Do YYYY")}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            <p className="italic text-slate-500">No prices set</p>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-6"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                      Check this box if you want to make this course free
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {!watchIsFree &&
              fields.map((field, index) => (
                <div key={field.id} className="p-4 space-y-4 border rounded-md">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`prices.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LIFETIME">Lifetime</SelectItem>
                              <SelectItem value="YEARLY">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prices.${index}.duration`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`prices.${index}.regularAmount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Regular Price *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="1"
                              placeholder="Enter regular price"
                              disabled={isSubmitting}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {showDiscountFields[index] && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={`prices.${index}.discountedAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discounted Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="1"
                                placeholder="Enter discounted price"
                                disabled={isSubmitting}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`prices.${index}.discountExpiresOn`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount Expires On</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                >
                                  {field.value
                                    ? format(field.value, "MMM dd, yyyy")
                                    : "Pick a date"}
                                  <CalendarIcon className="w-4 h-4 ml-2" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => toggleDiscountField(index)}
                      variant="outline"
                      size="sm"
                    >
                      {showDiscountFields[index]
                        ? "Remove Discount"
                        : "Add Discount"}
                    </Button>
                  </div>
                </div>
              ))}

            <div className="flex justify-start">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
