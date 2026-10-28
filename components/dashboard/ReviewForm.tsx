"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Star } from "lucide-react";
import { createReviewAction } from "@/app/dashboard/actions";
import DashboardActionButton from "@/components/dashboard/DashboardActionButton";

const ratingLabels = ["Poor", "Below average", "Average", "Good", "Excellent"];

const ReviewForm = ({
  propertyId,
  requestId,
  propertyTitle,
}: {
  propertyId: string;
  requestId: string;
  propertyTitle: string;
}) => {
  const [rating, setRating] = useState(5);
  const ratingRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleRatingKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentRating: number,
  ) => {
    let nextRating: number;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowUp":
        nextRating = (currentRating % 5) + 1;
        break;
      case "ArrowLeft":
      case "ArrowDown":
        nextRating = ((currentRating + 3) % 5) + 1;
        break;
      case "Home":
        nextRating = 1;
        break;
      case "End":
        nextRating = 5;
        break;
      default:
        return;
    }

    event.preventDefault();
    setRating(nextRating);
    ratingRefs.current[nextRating - 1]?.focus();
  };

  return (
    <form
      action={createReviewAction}
      className="rounded-2xl border border-white/30 bg-white/10 p-5 shadow-sm backdrop-blur-xl dark:bg-black/10"
    >
      <input type="hidden" name="propertyId" value={propertyId} />
      <input type="hidden" name="requestId" value={requestId} />
      <input type="hidden" name="rating" value={rating} />

      <h3 className="font-semibold text-foreground">{propertyTitle}</h3>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-foreground">
          Your rating
        </legend>
        <div
          role="radiogroup"
          aria-label="Rating from 1 to 5 stars"
          aria-required="true"
          className="mt-1 flex w-fit items-center gap-1"
        >
          {ratingLabels.map((label, index) => {
            const value = index + 1;
            const isSelected = rating === value;

            return (
              <button
                key={value}
                ref={(element) => {
                  ratingRefs.current[index] = element;
                }}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`${value} ${value === 1 ? "star" : "stars"} - ${label}`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setRating(value)}
                onKeyDown={(event) => handleRatingKeyDown(event, value)}
                className="rounded-md p-1 text-amber-500 outline-none transition-colors hover:text-amber-600 focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Star
                  aria-hidden="true"
                  className={`size-7 ${
                    value <= rating
                      ? "fill-current"
                      : "fill-transparent text-muted-foreground"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-4 block space-y-1.5 text-sm font-medium text-foreground">
        Comment
        <textarea
          name="comment"
          rows={3}
          maxLength={1000}
          placeholder="What should future tenants know?"
          className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <div className="mt-4">
        <DashboardActionButton
          label="Submit review"
          pendingLabel="Submitting review..."
          size="default"
        />
      </div>
    </form>
  );
};

export default ReviewForm;
