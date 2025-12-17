import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCamping } from "@/lib/context/CampingContext";

const HighlightsTab = () => {
  const camping = useCamping();

  return (
    <div className="p-4 space-y-6">
      {/* Things to do */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
          Things to do at Campsite
        </h3>
        {camping?.highlights?.thingsToDo &&
          camping?.highlights?.thingsToDo.map((highlights, index) => (
            <ul key={index} className="space-y-2 text-sm text-muted-foreground">
              <li>•{highlights}</li>
            </ul>
          ))}
      </div>

      {/* Camping Services & Facilities */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
          Camping Services & Facilities
        </h3>
        {camping?.highlights?.servicesAndFacilities &&
          camping?.highlights?.servicesAndFacilities.map(
            (highlights, index) => (
              <Accordion
                key={index}
                type="single"
                collapsible
                className="w-full"
              >
                <AccordionItem value={index}>
                  <AccordionTrigger className="text-sm">
                    {highlights?.title} : {highlights?.time}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {highlights?.description}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )
          )}
      </div>

      {/* Schedule Info */}
      <div>
        <h3 className="text-lg font-semibold mb-4 border-l-3 border-orange-500 pl-3">
          Schedule of Campsite
        </h3>
        {camping?.highlights?.scheduleInfo &&
          camping?.highlights?.scheduleInfo.map(
            (highlights, index) => (
              <div key={index} className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  • {highlights?.label} {highlights?.time}
                </p>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default HighlightsTab;
