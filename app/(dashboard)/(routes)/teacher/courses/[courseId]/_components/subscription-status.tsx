// @ts-nocheck
"use client";

import React, { useState } from "react";
import axios from "axios";
import { Pencil, Loader, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/services/api";
import { Urls } from "@/constants/urls";
import { revalidatePage } from "@/actions/revalidatePage";

export const SubscriptionStatus = ({ initialData, courseId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isUnderSubscription, setIsUnderSubscription] = useState(
    initialData?.isUnderSubscription || false
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const saveSubscriptionSettings = async () => {
    const updatedValues = {
      isUnderSubscription,
    };

    setIsSubmitting(true);

    try {
      await axios.patch(`/api/courses/${courseId}`, updatedValues);
      if (!isUnderSubscription) {
        // Delete all membership prices from the database for that course
        const existingPrices = await fetchExistingPrices(courseId);

        // Loop through existing prices and delete membership prices
        const membershipPrices = existingPrices?.filter(
          (price) => price?.isSubscriptionPrice === true
        );

        // Delete each membership price
        for (const price of membershipPrices) {
          await deletePriceFromDb(price.id);
        }
      }

      toast.success("Subscription settings updated successfully!");
      toggleEdit();
        await revalidatePage([
      { route: '/(site)', type: "layout" },
      { route: "/courses", type: "layout" },
    ]);
      router.refresh();
    } catch (error) {
      toast.error(
        "Something went wrong: " +
          (error.response?.data.message || error.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchExistingPrices = async (courseId) => {
    try {
      const response = await axios.get(
        `/api/admin/courses/prices?courseId=${courseId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching existing prices:", error);
      return [];
    }
  };

  const deletePriceFromDb = async (priceId) => {
    try {
      await api.delete(`${Urls.admin.courses}/prices/${priceId}`);
    } catch (error) {
      console.error("Error deleting price:", error);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4 relative">
      <div className="font-medium flex items-center justify-between">
        <div className="flex items-center">
          Subscription Setting
          <span className="relative inline-block">
            <Info
              className="h-4 w-4 ml-2 cursor-pointer"
              onMouseEnter={() => setIsTooltipVisible(true)}
              onMouseLeave={() => setIsTooltipVisible(false)}
            />
            {isTooltipVisible && (
              <div className="absolute left-0 bottom-6 bg-white border border-gray-300 rounded-md p-2 shadow-lg transition-opacity duration-300 w-[400px]">
                If under subscription, subscribers will be able to access this
                course through their subscription.
              </div>
            )}
          </span>
        </div>
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div>
          <div className="max-w-lg flex flex-col">
            {isUnderSubscription ? (
              <p>This course is available under subscription.</p>
            ) : (
              <p className="text-slate-500 italic">
                Not under any subscription plan
              </p>
            )}
          </div>
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="subscription-status"
              checked={isUnderSubscription}
              onCheckedChange={setIsUnderSubscription}
            />
            <label
              htmlFor="subscription-status"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Include this course in under subscription
            </label>
          </div>

          <div className="flex justify-start mt-4">
            <Button
              type="button"
              onClick={saveSubscriptionSettings}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
