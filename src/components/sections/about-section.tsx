import { BookOpen, Code2, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Stat } from "@/components/shared/stat";

export function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Professional Summary</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          I'm a technical solutions architect and full‑stack engineer with deep
          experience across software development, cloud architecture, workflow
          automation, and enterprise eSignature systems. My background spans
          engineering, customer success, and IT operations — giving me a unique
          ability to bridge business needs with technical execution.
          <br /><br />
          I specialize in designing scalable systems, modernizing legacy workflows,
          and delivering solutions that are secure, maintainable, and built for
          long‑term success. Whether I'm building full‑stack applications, integrating
          DocuSign and eOriginal, or architecting cloud‑native platforms, I focus on
          clarity, reliability, and developer experience.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Focus" value="Architecture + Engineering" icon={<Terminal className="w-4 h-4" />} />
          <Stat label="Primary Stack" value="React • Node • AWS" icon={<Code2 className="w-4 h-4" />} />
          <Stat label="Strength" value="DX + Automation" icon={<BookOpen className="w-4 h-4" />} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Cloud</Badge>
          <Badge>Workflow Automation</Badge>
          <Badge>eSignature</Badge>
          <Badge>Systems Design</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
