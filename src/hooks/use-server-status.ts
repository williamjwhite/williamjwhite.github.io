// src/hooks/use-server-status.ts
// Single source of truth for server mode + status.
// Imported by sidebar-card, about-section, and admin-page.

import * as React from "react";

export type ServerStatus = "online" | "degraded" | "offline" | "checking";
export type ServerMode   = "live" | "demo";

const MODE_KEY = "wjw_server_mode";


export function getServerMode(): ServerMode {
  try {
    const stored = localStorage.getItem(MODE_KEY);
    if (stored === "demo") return "demo";
    return "live";
  }
  catch { return "live"; }
}
// Default to PRODUCTION

// export function getServerMode(): ServerMode {
//   try { return localStorage.getItem(MODE_KEY) === "demo" ? "demo" : "live"; }
//   catch { return "live"; }
// }

// Default to DEMO 

// fixed — defaults to demo instead of live:
// export function getServerMode(): ServerMode {
//   try {
//     const stored = localStorage.getItem(MODE_KEY);
//     if (stored === "live") return "live";
//     return "demo"; // default for new visitors
//   }
//   catch { return "demo"; }
// }

export function setServerMode(mode: ServerMode) {
  try { localStorage.setItem(MODE_KEY, mode); } catch { /* noop */ }
  window.dispatchEvent(new CustomEvent("wjw:mode-change", { detail: mode }));
}

export function useServerStatus(): { status: ServerStatus; mode: ServerMode } {
  const [mode,   setMode]   = React.useState<ServerMode>(getServerMode);
  const [status, setStatus] = React.useState<ServerStatus>("checking");

  React.useEffect(() => {
    function onModeChange(e: Event) {
      const m = (e as CustomEvent<ServerMode>).detail;
      setMode(m);
      setStatus("checking");
    }
    window.addEventListener("wjw:mode-change", onModeChange);
    return () => window.removeEventListener("wjw:mode-change", onModeChange);
  }, []);

  React.useEffect(() => {
    if (mode === "demo") {
      setStatus("checking");
      const t = setTimeout(() => setStatus("online"), 900);
      return () => clearTimeout(t);
    }
    let cancelled = false;
    async function check() {
      if (!cancelled) setStatus("checking");
      try {
        // const res = await fetch("/api/status", { signal: AbortSignal.timeout(5000) });
        const res = await fetch("/status.json", { signal: AbortSignal.timeout(5000) });
        if (!cancelled) setStatus(res.ok ? "online" : "degraded");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    }
    check();
    const id = setInterval(check, 15_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [mode]);

  return { status, mode };
}
