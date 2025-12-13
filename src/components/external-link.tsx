// src/components/external-link.tsx
import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ExternalLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function ExternalLink({ href, children, className }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("inline-flex", className)}
    >
      <Button variant="ghost">{children}</Button>
    </a>
  );
}
