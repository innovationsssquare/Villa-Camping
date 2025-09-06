import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import Link from "next/link";

export default function SimilarProperties({ items }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Similar properties</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/properties/${item.id}`}
            className="min-w-[240px]"
          >
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] w-full bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <Star
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-500"
                      aria-hidden
                    />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{item.city}</p>
                <p className="text-sm">
                  <span className="font-semibold">
                    ₹{item.price.toLocaleString()}
                  </span>{" "}
                  <span className="text-muted-foreground">/ night</span>
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
