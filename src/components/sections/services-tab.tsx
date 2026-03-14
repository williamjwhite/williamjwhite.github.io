import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { TwoCol } from "@/components/shared/two-col";

export function ServicesTab() {
  return (
    <TwoCol
      left={
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
            <CardDescription>
              Full‑stack engineering, architecture, and workflow automation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              I help organizations design, build, and scale secure digital workflows,
              cloud‑native applications, and enterprise‑grade eSignature systems. My
              work blends engineering depth with solutions‑architecture clarity.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge>Full‑Stack</Badge>
              <Badge>Cloud</Badge>
              <Badge>DevOps</Badge>
              <Badge>DocuSign</Badge>
              <Badge>eOriginal</Badge>
              <Badge>AI/ML</Badge>
            </div>
          </CardContent>
        </Card>
      }
      right={
        <Card>
          <CardHeader>
            <CardTitle>What I Deliver</CardTitle>
            <CardDescription>High‑impact technical outcomes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="pl-5 list-disc">
              <li>Full‑stack application development (React, Node, Python)</li>
              <li>Cloud architecture & DevOps (AWS, Docker, CI/CD)</li>
              <li>DocuSign API + eOriginal eVaulting integrations</li>
              <li>Workflow automation & system modernization</li>
              <li>AI‑powered document processing & routing</li>
              <li>Technical leadership & digital transformation</li>
            </ul>
          </CardContent>
        </Card>
      }
    />
  );
}
