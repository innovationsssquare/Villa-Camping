"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  Coffee,
  Wifi,
  Dumbbell,
  Trees,
  Tv,
  Snowflake,
  Car,
  Drill as Grill,
} from "lucide-react";



const iconMap = {
  Wifi: Wifi,
  "Air Conditioning": Snowflake,
  TV: Tv,
  Parking: Car,
  BBQ: Grill,
  Garden: Trees,
  Gym: Dumbbell,
  Kitchen: Coffee,
}



export default function AmenitiesToggle({ amenities }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? amenities : amenities.slice(0, 6);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Amenities</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Show all"}
        </Button>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {visible.map((name, i) => {
          const Icon = iconMap[name] || Check;
          return (
            <div
              key={i}
              className="flex items-center gap-2 rounded-md border p-2"
            >
              <Icon className="h-4 w-4 text-primary" aria-hidden />
              <span className="text-sm">{name}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
