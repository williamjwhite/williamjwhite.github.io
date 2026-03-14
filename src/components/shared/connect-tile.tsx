import * as React from "react";
import { ArrowRight } from "lucide-react";
import { isExternalUrl } from "@/lib/utils";

export function ConnectTile({
  icon,
  title,
  desc,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}) {
  const external = isExternalUrl(href);
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="p-4 transition border rounded-2xl border-border bg-card hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{desc}</div>
    </a>
  );
}
