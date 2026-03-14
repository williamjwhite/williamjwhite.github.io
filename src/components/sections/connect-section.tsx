import { BookOpen, Github, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { ConnectTile } from "@/components/shared/connect-tile";
import { ContactForm } from "@/components/shared/contact-form";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { LINKS } from "@/constants/links";
import { Separator } from "@/components/ui/separator";

export function ConnectSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect</CardTitle>
        <CardDescription>Fastest ways to reach me.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-2">
          <ConnectTile
            icon={<Mail className="w-4 h-4" />}
            title="Email"
            desc="Best for hiring, consulting, and collaborations."
            href={LINKS.email}
          />
          <ConnectTile
            icon={<LinkedinIcon className="w-4 h-4" />}
            title="LinkedIn"
            desc="Professional networking and messaging."
            href={LINKS.linkedin}
          />
          <ConnectTile
            icon={<Github className="w-4 h-4" />}
            title="GitHub"
            desc="Repos, issues, and project work."
            href={LINKS.github}
          />
          <ConnectTile
            icon={<BookOpen className="w-4 h-4" />}
            title="Docs"
            desc="Guides, standards, deep dives."
            href={LINKS.docs}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge>Open to roles</Badge>
          <Badge>Consulting</Badge>
          <Badge>Partnerships</Badge>
        </div>

        <Separator />

        <div>
          <p className="mb-4 text-sm font-semibold">Send a message</p>
          <ContactForm />
        </div>
      </CardContent>
    </Card>
  );
}
