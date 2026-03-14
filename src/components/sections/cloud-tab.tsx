import { Cloud, Layers3, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Stat } from "@/components/shared/stat";
import { TwoCol } from "@/components/shared/two-col";

export function CloudTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloud Architecture</CardTitle>
        <CardDescription>Scalable, secure, cloud‑native deployment patterns.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-muted-foreground">
        <TwoCol
          left={
            <div className="space-y-3">
              <Stat label="Platform" value="AWS" icon={<Cloud className="w-4 h-4" />} />
              <Stat label="Orchestration" value="Docker / ECS" icon={<Layers3 className="w-4 h-4" />} />
              <Stat label="Deployments" value="CI/CD" icon={<Terminal className="w-4 h-4" />} />
            </div>
          }
          right={
            <p>
              Designed and deployed multi‑service cloud architectures using AWS, Docker, ECS,
              and GitHub Actions. Focus on security, observability, and zero‑downtime releases.
            </p>
          }
        />
        <div className="flex flex-wrap gap-2">
          <Badge>AWS</Badge>
          <Badge>Docker</Badge>
          <Badge>CI/CD</Badge>
          <Badge>PostgreSQL</Badge>
          <Badge>Redis</Badge>
          <Badge>API Gateway</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
