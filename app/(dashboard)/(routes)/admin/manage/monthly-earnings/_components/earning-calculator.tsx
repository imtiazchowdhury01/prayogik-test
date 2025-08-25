"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface EarningsCalculatorProps {
  isAdmin: boolean;
}

export default function EarningsCalculator({
  isAdmin,
}: EarningsCalculatorProps) {
  const [loading, setLoading] = useState(false);

  const handleUpdateEarnings = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin/manage/teachers/earnings/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isAdmin }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || "Teacher monthly earnings updated successfully!"
        );
      } else {
        toast.error(data.message || "Failed to update teacher earnings.");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred while updating teacher earnings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl border border-gray-300 rounded-md border-dashed p-8 mt-6">
        <h1 className="text-2xl">Generate Monthly Earnings for Teachers</h1>
        <p className="mt-2 text-base text-gray-600">
          Click the button below to calculate and update the monthly earnings
          for all teachers based on the latest revenue data.
        </p>
        <Button
          variant="default"
          className={`mt-2 ${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleUpdateEarnings}
          disabled={loading}
        >
          {loading ? (
            <div className="flex gap-2">
              <Loader className="h-5 w-5 animate-spin" /> Calculating...
            </div>
          ) : (
            "Calculate"
          )}
        </Button>
      </div>
    </div>
  );
}
