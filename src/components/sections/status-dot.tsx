// src/components/sections/status-dot.tsx
// Shared by AboutSection and AdminPage — imported from here, not sidebar-card.

import * as React from "react";
import { Wifi, WifiOff, AlertTriangle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ServerStatus, ServerMode } from "@/hooks/use-server-status";

export function StatusDot({ status, mode }: { status: ServerStatus; mode: ServerMode }) {
  const meta: Record<ServerStatus, { label: string; Icon: React.ElementType; dot: string; glow: string }> = {
    checking: { label: "Checking",  Icon: Loader2,       dot: "bg-sky-400",   glow: "0 0 7px 3px rgba(56,189,248,0.6)"  },
    online:   { label: "Online",    Icon: Wifi,          dot: "bg-green-500", glow: "0 0 7px 3px rgba(34,197,94,0.6)"   },
    degraded: { label: "Degraded",  Icon: AlertTriangle, dot: "bg-amber-500", glow: "0 0 7px 3px rgba(245,158,11,0.6)"  },
    offline:  { label: "Offline",   Icon: WifiOff,       dot: "bg-red-500",   glow: "0 0 7px 3px rgba(239,68,68,0.6)"   },
  };

  const { label, Icon, dot, glow } = meta[status];

  const blinkStyle: React.CSSProperties = {
    boxShadow: glow,
    animation:
      status === "checking"
        ? "wjw-blink 0.35s ease-in-out infinite"
        : status === "online"
        ? "wjw-blink 2.2s ease-in-out infinite"
        : undefined,
  };

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground select-none">
      <span className={`inline-block w-2 h-2 rounded-full shrink-0 ${dot}`} style={blinkStyle} />
      <Icon className={`w-3 h-3 shrink-0 ${status === "checking" ? "animate-spin" : ""}`} />
      <span>{label}</span>
      <Badge variant="outline" className="ml-0.5 px-1 py-0 text-[10px] leading-4 uppercase tracking-wide">
        {mode === "demo" ? "Online" : "Live"}
      </Badge>
    </span>
  );
}
