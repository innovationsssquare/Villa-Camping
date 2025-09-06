"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function Reviews({ average, total, reviews }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? reviews : reviews.slice(0, 3);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-500" aria-hidden />
          <span className="font-semibold">{average > 0 ? average : "New"}</span>
          {average > 0 && (
            <span className="text-muted-foreground text-sm">/5</span>
          )}
          <span className="text-muted-foreground text-sm">&nbsp;({total})</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {visible.map((rev, idx) => (
            <div key={idx} className="border-b last:border-b-0 pb-3 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">{rev.userName}</p>
                <span className="text-xs text-muted-foreground">
                  {rev.date}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rev.rating
                        ? "fill-amber-400 text-amber-500"
                        : "text-muted-foreground"
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
              <p className="text-sm">{rev.comment}</p>
            </div>
          ))}
          {reviews.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded
                ? "Show fewer reviews"
                : `View all ${reviews.length} reviews`}
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
