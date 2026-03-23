// src/components/shared/demo-grid.tsx
//
// Fetches /projects/projects.json (array of slug strings) at runtime,
// then renders a DemoCard for each slug.
// Add a new slug to projects.json to surface a new project — no code changes needed.

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { DemoCard } from "./demo-card";

export function DemoGrid() {
  const [slugs, setSlugs]     = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    fetch("/projects/projects.json")
      .then(r => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json() as Promise<string[]>;
      })
      .then(data => { setSlugs(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading demos…
      </div>
    );
  }

  if (error || !slugs.length) {
    return (
      <p className="text-sm text-muted-foreground py-6">
        No demos found. Make sure <code className="font-mono text-xs">/projects/projects.json</code> exists.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {slugs.map(slug => (
        <DemoCard key={slug} slug={slug} />
      ))}
    </div>
  );
}
