import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";

export function HighlightsCards({ onJump }: { onJump: (id: string) => void }) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Professional Summary</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Full-stack developer with a bias toward systems that are maintainable,
            documented, and ergonomic.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onJump("about")}>
              Jump to About <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>Highlights + resume path.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            High-signal summary with optional drill-down.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onJump("experience")}>
              Jump to Experience <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Connect</CardTitle>
          <CardDescription>Hiring, consulting, collaborations.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email is best for structured inquiries; LinkedIn for networking.
          </p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => onJump("connect")}>
              Jump to Connect <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
