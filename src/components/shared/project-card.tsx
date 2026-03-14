import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";

export function ProjectCard({
  title,
  desc,
  href,
  tags,
}: {
  title: string;
  desc: string;
  href: string;
  tags: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
        <Button
          variant="outline"
          onClick={() => window.open(href, "_blank", "noopener,noreferrer")}
        >
          View docs <ArrowRight className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
