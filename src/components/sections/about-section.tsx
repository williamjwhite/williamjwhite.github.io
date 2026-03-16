import * as React from "react";
import { BookOpen, Code2, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Stat } from "@/components/shared/stat";
import { NowItems } from "@/components/sections/now-items";
import { StatusDot } from "@/components/sections/status-dot";
import { useServerStatus } from "@/hooks/use-server-status";

// ─── Live clock ───────────────────────────────────────────────────────────────

function LiveClock() {
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const date = now.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-4 py-3 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground">
      <span className="font-medium">{date}</span>
      <span className="font-mono tracking-wide text-foreground">{time}</span>
    </div>
  );
}

// ─── About Section ────────────────────────────────────────────────────────────

export function AboutSection() {
const { status } = useServerStatus();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>About</CardTitle>
            <CardDescription>Professional Summary</CardDescription>
          </div>
          {/* Server status moved here from sidebar */}
          <StatusDot status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Live date + time */}
        <LiveClock />

        {/* Bio */}
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

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Focus"         value="Architecture + Engineering"  icon={<Terminal  className="w-4 h-4" />} />
          <Stat label="Primary Stack" value="React • Node • AWS"          icon={<Code2     className="w-4 h-4" />} />
          <Stat label="Strength"      value="DX + Automation"             icon={<BookOpen  className="w-4 h-4" />} />
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge>Cloud</Badge>
          <Badge>Workflow Automation</Badge>
          <Badge>eSignature</Badge>
          <Badge>Systems Design</Badge>
        </div>

        <Separator />

        {/* Now items */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Now</p>
          <NowItems />
        </div>

      </CardContent>
    </Card>
  );
}
