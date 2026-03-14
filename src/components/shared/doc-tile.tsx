import * as React from "react";
import { ArrowRight } from "lucide-react";

export function DocTile({
  icon,
  title,
  href,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  items: string[];
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="p-4 transition border rounded-2xl border-border bg-card hover:bg-muted/50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{items.join(" • ")}</div>
    </a>
  );
}
