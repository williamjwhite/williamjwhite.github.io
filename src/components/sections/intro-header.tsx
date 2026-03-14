import {
  Github, Mail, MessageCircleQuestionMark, Search, Terminal, Truck,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { LINKS } from "@/constants/links";
import { scrollToId } from "@/lib/utils";

import { SidebarCard } from "@/components/sections/sidebar-card";

export function IntroHeader() {
  return (
    <section className="pt-10">
      <div className="grid gap-6 md:grid-cols-5 md:items-center">
        <div className="md:col-span-3">
          <div className="flex items-center gap-4">
            <img
              src="/headshot.png"
              alt="William J. White"
              className="object-cover w-16 h-16 border rounded-full border-border"
              loading="eager"
            />
            <div>
              <div className="text-sm font-semibold text-muted-foreground">
                Technical Solutions Architect & Full‑Stack Engineer
              </div>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl">
                William J. White
              </h1>
            </div>
          </div>

          <p className="mt-4 text-base text-muted-foreground">
            I design and build scalable software systems, modernize digital workflows,
            and help organizations ship reliable, secure, and maintainable products.
            My work blends engineering depth with architecture clarity and a strong
            focus on developer experience.
          </p>

          <div className="flex flex-wrap gap-2 mt-5">
            <Button onClick={() => scrollToId("connect")}>
              Connect <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(LINKS.github, "_blank", "noopener,noreferrer")}
            >
              GitHub <Github className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => window.open(LINKS.email, "_blank", "noopener,noreferrer")}
            >
              Email <Mail className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge>Full‑Stack</Badge>
            <Badge>Cloud Architecture</Badge>
            <Badge>Workflow Automation</Badge>
            <Badge>eSignature Systems</Badge>
          </div>
        </div>
<div className="md:col-span-2">
  <SidebarCard />
</div>
        


      </div>
    </section>
  );
}
