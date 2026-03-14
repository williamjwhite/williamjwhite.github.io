import * as React from "react";
import { ArrowRight } from "lucide-react";
import { isExternalUrl, scrollToId } from "@/lib/utils";

export function FastLink({
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
  const isAnchor = href.startsWith("#");
  return (
    <a
      href={href}
      onClick={(e) => {
        if (isAnchor) {
          e.preventDefault();
          scrollToId(href.slice(1));
        }
      }}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className="flex items-start justify-between gap-3 p-4 transition border rounded-2xl border-border bg-card hover:bg-muted/50"
    >
      <div>
        <div className="flex items-center gap-2 text-sm font-extrabold">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
      </div>
      <ArrowRight className="w-4 h-4 mt-1 text-muted-foreground" />
    </a>
  );
}
