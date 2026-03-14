import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { LINKS } from "@/constants/links";

export function CTA() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Developer Guides and Code</CardTitle>
        <CardDescription>
          Front-end, back-end, environment setup, design, framework and device setup and references.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          Just some guides and code I use often and find useful.
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => window.open(LINKS.docs, "_blank", "noopener,noreferrer")}>
            Open Docs <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open(LINKS.github, "_blank", "noopener,noreferrer")}
          >
            GitHub <Github className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
