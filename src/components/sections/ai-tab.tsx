import { CheckCircle, Search, Zap } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Stat } from "@/components/shared/stat";
import { TwoCol } from "@/components/shared/two-col";

export function AiTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Workflow Automation</CardTitle>
        <CardDescription>Intelligent document processing and routing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <TwoCol
          left={
            <p>
              Built AI‑powered systems that classify, extract, and route documents using
              LLMs and embeddings. Integrated with existing workflow systems for real‑time
              automation.
            </p>
          }
          right={
            <div className="space-y-3">
              <Stat label="Manual Review" value="−85%" icon={<Search className="w-4 h-4" />} />
              <Stat label="Accuracy" value="High" icon={<CheckCircle className="w-4 h-4" />} />
              <Stat label="Latency" value="Low" icon={<Zap className="w-4 h-4" />} />
            </div>
          }
        />
        <Accordion type="single" collapsible>
          <AccordionItem value="features">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>
              <ul className="pl-5 list-disc">
                <li>Document classification via embeddings</li>
                <li>Field extraction using LLMs</li>
                <li>Smart routing based on business rules</li>
                <li>Real‑time audit logging</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
