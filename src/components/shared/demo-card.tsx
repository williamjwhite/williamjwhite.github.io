// src/components/shared/demo-card.tsx
//
// Renders a single public demo project card.
// Metadata is fetched from /projects/[slug]/meta.json at runtime.
// Clicking navigates full-page to /projects/[slug]/ (same tab).

import { useState, useEffect } from "react";
import { ExternalLink, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ── Types ──────────────────────────────────────────────────────────────────
interface ProjectMeta {
  title: string;
  description: string;
  icon: string;
  color: string;          // accent hex, e.g. "#00d4ff"
  status: "live" | "wip" | "archived";
  tags: string[];
  type: "demo";           // always "demo" for this component
}

interface DemoCardProps {
  slug: string;           // folder name, e.g. "ev-charging-stations-app"
}

// ── Status pill ────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  live: "Live",
  wip: "In Progress",
  archived: "Archived",
};
const STATUS_CLASS: Record<string, string> = {
  live:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  wip:      "bg-amber-500/10  text-amber-400  border-amber-500/20",
  archived: "bg-zinc-500/10   text-zinc-400   border-zinc-500/20",
};

// ── Component ──────────────────────────────────────────────────────────────
export function DemoCard({ slug }: DemoCardProps) {
  const [meta, setMeta]       = useState<ProjectMeta | null>(null);
  const [error, setError]     = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/projects/${slug}/meta.json`)
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<ProjectMeta>;
      })
      .then(data => { setMeta(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [slug]);

  // ── Loading skeleton ───────────────────────────────────────────────────
  if (loading) {
    return (
      <Card className="flex flex-col justify-between h-full animate-pulse">
        <CardHeader>
          <div className="h-8 w-8 rounded-lg bg-muted mb-3" />
          <div className="h-4 w-40 rounded bg-muted mb-2" />
          <div className="h-3 w-full rounded bg-muted" />
          <div className="h-3 w-3/4 rounded bg-muted mt-1" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-full rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  // ── Error fallback ─────────────────────────────────────────────────────
  if (error || !meta) {
    return (
      <Card className="flex flex-col justify-between h-full border-dashed opacity-50">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">
            {slug}
          </CardTitle>
          <CardDescription>Metadata unavailable</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const url = `/projects/${slug}/`;

  return (
    <Card
      className="group flex flex-col justify-between h-full transition-all duration-200
                 hover:shadow-[0_0_0_1px_var(--card-accent-color)] hover:-translate-y-0.5 cursor-pointer"
      style={{ "--card-accent-color": meta.color } as React.CSSProperties}
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
    >
      <CardHeader className="pb-3">
        {/* Icon + status row */}
        <div className="flex items-start justify-between mb-1">
          <span
            className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ background: `${meta.color}18` }}
          >
            {meta.icon}
          </span>
          <span
            className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border
                        ${STATUS_CLASS[meta.status] ?? STATUS_CLASS.wip}`}
          >
            {STATUS_LABEL[meta.status] ?? meta.status}
          </span>
        </div>

        <CardTitle
          className="text-base mt-2 group-hover:text-[var(--card-accent-color)] transition-colors"
          style={{ "--card-accent-color": meta.color } as React.CSSProperties}
        >
          {meta.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed line-clamp-3">
          {meta.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col gap-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {meta.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-[10px] font-mono px-2 py-0">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Launch button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2 group-hover:border-[var(--card-accent-color)]
                     group-hover:text-[var(--card-accent-color)] transition-colors"
          style={{ "--card-accent-color": meta.color } as React.CSSProperties}
          onClick={e => { e.stopPropagation(); window.open(url, '_blank', 'noopener,noreferrer'); }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Launch Demo
        </Button>
      </CardContent>
    </Card>
  );
}
