"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function CampaignReviewForm({ slug }: { slug: string }) {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      toast.error("Review must be at least 5 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/v1/campaigns/${encodeURIComponent(slug)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment }),
      });
      const json = await res.json();
      if (!res.ok || !json?.ok) {
        toast.error(json?.error?.message ?? "Failed to submit review");
        return;
      }
      toast.success("Review added");
      setComment("");
      setRating(5);
      router.refresh();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={submit}>
      <div className="grid gap-2 sm:max-w-[220px]">
        <Label>Rating (1-5)</Label>
        <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Rating">
          {Array.from({ length: 5 }).map((_, idx) => {
            const value = idx + 1;
            const active = value <= rating;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} star${value > 1 ? "s" : ""}`}
                onClick={() => setRating(value)}
                className="rounded-sm outline-none transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <Star
                  className={cn(
                    "size-5",
                    active ? "fill-amber-500 text-amber-500" : "text-amber-500/30",
                  )}
                  strokeWidth={active ? 0 : 1.5}
                />
              </button>
            );
          })}
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="review-comment">Your review</Label>
        <textarea
          id="review-comment"
          className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/45"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this campaign..."
        />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Submitting..." : "Add review"}
      </Button>
    </form>
  );
}
