import { Clock, Layers3, ShieldCheck } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Stat } from "@/components/shared/stat";
import { TwoCol } from "@/components/shared/two-col";

export function CaseStudyTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Study: Digital Mortgage Workflow</CardTitle>
        <CardDescription>
          DocuSign + eOriginal eVaulting architecture for regulated lending.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-sm text-muted-foreground">
        <TwoCol
          left={
            <div className="space-y-3">
              <Stat label="Processing Time" value="Days → Hours" icon={<Clock className="w-4 h-4" />} />
              <Stat label="Manual Work" value="−70%" icon={<Layers3 className="w-4 h-4" />} />
              <Stat label="Compliance" value="Fully Digital" icon={<ShieldCheck className="w-4 h-4" />} />
            </div>
          }
          right={
            <p>
              Architected a fully digital mortgage workflow integrating DocuSign, eOriginal,
              and internal LOS systems. Automated envelope creation, routing, eVaulting, and
              audit‑grade event processing.
            </p>
          }
        />

        <Accordion type="single" collapsible>
          <AccordionItem value="challenge">
            <AccordionTrigger>Challenge</AccordionTrigger>
            <AccordionContent>
              Manual document handling, slow closing cycles, and compliance friction across
              multiple systems.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="solution">
            <AccordionTrigger>Solution</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                <li>DocuSign API envelope automation</li>
                <li>Webhook‑driven event processing</li>
                <li>eOriginal eVaulting + secure transfer</li>
                <li>Audit‑grade lifecycle tracking</li>
                <li>Cloud‑native deployment</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="results">
            <AccordionTrigger>Results</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                <li>Closing time reduced from days to hours</li>
                <li>Eliminated manual document handling</li>
                <li>Improved compliance and audit readiness</li>
                <li>Better borrower experience</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
