import * as React from "react";

export function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="p-4 border rounded-2xl border-border bg-card">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-muted-foreground">{label}</div>
        <div className="text-primary">{icon}</div>
      </div>
      <div className="mt-2 text-lg font-black">{value}</div>
    </div>
  );
}
