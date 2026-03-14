import { ArrowRight, BookOpen, FileText, Layers3, Terminal } from "lucide-react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Stat } from "@/components/shared/stat";
import { LINKS } from "@/constants/links";

export function ExperienceSection({
  onViewResume,
}: {
  onViewResume: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
        <CardDescription>
          Engineering, architecture, and workflow automation across SaaS, financial
          services, digital mortgage, and enterprise platforms. I build systems that
          scale, teams that deliver, and processes that reduce operational friction.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button onClick={onViewResume}>
          View Resume <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Delivery" value="Production‑grade" icon={<Layers3 className="w-4 h-4" />} />
          <Stat label="Bias" value="Simplicity + Maintainability" icon={<FileText className="w-4 h-4" />} />
          <Stat label="Ops" value="Secure + Observable" icon={<Terminal className="w-4 h-4" />} />
        </div>

        <div className="mt-6">
          <Accordion type="single" collapsible>
            <AccordionItem value="highlights">
              <AccordionTrigger>Highlights</AccordionTrigger>
              <AccordionContent>
                <ul className="pl-5 list-disc">
                  <li>Architected cloud‑native systems with strong security and observability.</li>
                  <li>Integrated DocuSign + eOriginal for regulated digital workflows.</li>
                  <li>Built full‑stack applications with React, Node, Python, and SwiftUI.</li>
                  <li>Designed developer‑first tooling, documentation, and automation.</li>
                  <li>Led technical delivery across cross‑functional teams.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="timeline">
              <AccordionTrigger>Resume + detailed timeline</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-muted-foreground">
                  Recommended: add <strong>/public/resume.pdf</strong> and link it here.
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Button variant="outline" onClick={onViewResume}>
                    Open Resume PDF <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => window.open(LINKS.docs, "_blank", "noopener,noreferrer")}
                  >
                    Docs (Deep Dives) <BookOpen className="w-4 h-4" />
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
