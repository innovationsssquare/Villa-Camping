import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HighlightsTab = () => {
  return (
    <div className="p-4 space-y-6">
      {/* Things to do */}
      <div >
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">Things to do at Campsite</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Just relax beside lake</li>
          <li>• Feel the warmth of bonfire in the night</li>
          <li>• Playing sports activities on campground</li>
        </ul>
      </div>

      {/* Camping Services & Facilities */}
      <div >
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
          Camping Services & Facilities
        </h3>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm">
              Grab tents: 4 PM onwards
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Grab your tents and stay with your family, friends, or your
              spouse. Enjoy the outing without compromising the view and
              adventure.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-sm">
              Snacks: 5:30 PM to 6:00 PM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Evening snacks including tea and pakoda to refresh you after your
              journey.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-sm">
              Enjoy sunsets: around 5:30 PM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Watch the beautiful sunset over the lake and mountains.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-sm">
              Delicious BBQ: 7:30 PM to 8:30 PM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Enjoy a delicious BBQ session with marinated vegetables and
              non-veg options.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-sm">
              Unlimited dinner: 9:30 PM to 11 PM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Unlimited dinner with variety of vegetarian and non-vegetarian
              options.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-sm">
              Warm campfire: after 10:30 PM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Gather around the warm campfire under the stars.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-sm">
              Music: from 4 PM to 11 PM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Enjoy live music and speaker music throughout the evening.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-sm">
              Breakfast: 8:30 AM to 9:30 AM
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Start your day with a hearty breakfast including tea, poha, anda
              bhurji, bread, and jam.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger className="text-sm">
              Sports activities: Evening & Morning time
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              Various sports and recreational activities available at the
              campground.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Schedule Info */}
      <div >
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">Schedule of Campsite</h3>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            • Check-in after 4:00 PM (late check-in allowed but early check-in
            not allowed)
          </p>
          <p className="text-muted-foreground">
            • Snacks from 5:30 PM to 6:00 PM
          </p>
          <p className="text-muted-foreground">• BBQ from 7:30 PM to 8:30 PM</p>
          <p className="text-muted-foreground">• Bonfire after 10:30 PM</p>
          <p className="text-muted-foreground">
            • Dinner from 9:30 PM to 11:00 PM
          </p>
          <p className="text-muted-foreground">
            • Silent hours 12:00 AM to 6:00 AM
          </p>
          <p className="text-muted-foreground">
            • Next day breakfast from 8:30 AM to 9:30 AM
          </p>
          <p className="text-muted-foreground">
            • Check-out at 11:00 AM (late check-out not allowed but early
            check-out allowed)
          </p>
        </div>
      </div>
    </div>
  );
};

export default HighlightsTab;
