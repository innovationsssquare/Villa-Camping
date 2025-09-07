import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle2 } from "lucide-react";

export default function HouseRulesAccordion({ rules }) {
  return (
    <Card className="p-0 overflow-hidden">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="rules">
          <AccordionTrigger className="px-4 bg-gray-200">House rules</AccordionTrigger>
          <AccordionContent className={"bg-gray-200"}>
            <div className="px-4 pb-4 space-y-2 ">
              {rules.map((rule, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2
                    className="h-4 w-4 text-green-600 mt-0.5"
                    aria-hidden
                  />
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
