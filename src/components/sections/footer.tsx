import { BookOpen, Github, Mail } from "lucide-react";
import { IconLink } from "@/components/icon-link";
import { LinkedinIcon } from "@/components/icons/linkedin-icon";
import { LINKS } from "@/constants/links";

export function Footer() {
  return (
    <footer className="pt-8 mt-12 border-t border-border">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} William J. White. Designed and developed with care.
        </div>
        <div className="flex flex-wrap gap-2">
          <IconLink href={LINKS.github} label="GitHub" icon={<Github className="w-4 h-4" />} />
          <IconLink href={LINKS.linkedin} label="LinkedIn" icon={<LinkedinIcon className="w-4 h-4" />} />
          <IconLink href={LINKS.docs} label="Docs" icon={<BookOpen className="w-4 h-4" />} />
          <IconLink href={LINKS.email} label="Email" icon={<Mail className="w-4 h-4" />} />
        </div>
      </div>
    </footer>
  );
}
