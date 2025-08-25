"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";

interface RatingFormProps {
  courseId: string;
  userId: string;
  initialRating: number | null;
  onRatingSubmit: (rating: number) => Promise<void>;
}

const RatingForm: React.FC<RatingFormProps> = ({
  courseId,
  userId,
  initialRating,
  onRatingSubmit,
}) => {
  const [ratingValue, setRatingValue] = useState<number>(initialRating || 0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialRating !== null) {
      setRatingValue(initialRating);
    }
  }, [initialRating]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (ratingValue < 1 || ratingValue > 5) {
      setError("Rating must be between 1 and 5!");
      setLoading(false);
      return;
    }

    await onRatingSubmit(ratingValue);
    toast.success("Rating submitted successfully!");
    setLoading(false);
  };

  const handleRatingClick = (value: number) => {
    setRatingValue(value);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <h1 className="text-2xl font-bold mb-4">Rate this Course</h1>
      <div className="flex flex-col items-left gap-5">
        <div className="flex gap-3 cursor-pointer">
          {[1, 2, 3, 4, 5].map((value) => (
            <span
              key={value}
              onClick={() => handleRatingClick(value)}
              aria-label={`Rate ${value} stars`}
              style={{
                fontSize: "24px",
                color: value <= ratingValue ? "gold" : "gray",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <div>
          <div className="flex items-center gap-x-2">
            <Button
              className="bg-teal-700"
              disabled={loading || ratingValue === 0}
              type="submit"
            >
              {loading ? (
                <Loader className="animate-spin h-4 w-4" />
              ) : (
                "Submit Rating"
              )}
            </Button>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </form>
  );
};

export default RatingForm;