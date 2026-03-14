import { BookOpen, Briefcase, FileText, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { FastLink } from "@/components/shared/fast-link";
import { TwoCol } from "@/components/shared/two-col";
import { LINKS } from "@/constants/links";

export function OverviewTab() {
  return (
    <TwoCol
      left={
        <Card>
          <CardHeader>
            <CardTitle>What this site is</CardTitle>
            <CardDescription>
              A combination of my Professional experience, current and past projects,
              resources and tools I use, guides I've created I hope you find useful.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="pl-5 text-sm list-disc text-muted-foreground">
              <li>My primary website: <strong>williamjwhite.me</strong></li>
              <li>Developer Guides + reference at <strong>docs.williamjwhite.me</strong></li>
              <li>You'll find About, Experience, and how to contact me in the Connect section.</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge>React 19</Badge>
              <Badge>Vite</Badge>
              <Badge>Tailwind v4</Badge>
              <Badge>shadcn/ui</Badge>
            </div>
          </CardContent>
        </Card>
      }
      right={
        <Card>
          <CardHeader>
            <CardTitle>Fast paths</CardTitle>
            <CardDescription>Where most visitors should go next.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <FastLink icon={<FileText className="w-4 h-4" />} title="About" desc="Quick bio, focus areas, and working style." href="#about" />
            <FastLink icon={<Briefcase className="w-4 h-4" />} title="Experience" desc="High-signal summary with optional drill-down." href="#experience" />
            <FastLink icon={<Mail className="w-4 h-4" />} title="Connect" desc="Email + social links; fastest ways to reach me." href="#connect" />
            <FastLink icon={<BookOpen className="w-4 h-4" />} title="Developer Guides" desc="Guides, standards, tooling, and references." href={LINKS.docs} />
          </CardContent>
        </Card>
      }
    />
  );
}
