import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { getPlatformClass } from "./lib/platform";
import { storageLoad } from "@/components/sections/admin-page";

async function hydrate() {
  try {
    const settings = await storageLoad();

    // Typography
    const typo = settings["wjw-typography"] as Record<string, { size: number; font: string }> | undefined;
    if (typo) {
      const FONT_VAR_MAP: Record<string, [string, string]> = {
        body:  ["--font-size-body",  "--font-body"],
        h1:    ["--font-size-h1",    "--font-h1"],
        h2:    ["--font-size-h2",    "--font-h2"],
        h3:    ["--font-size-h3",    "--font-h3"],
        h4:    ["--font-size-h4",    "--font-h4"],
        small: ["--font-size-small", "--font-small"],
        link:  ["--font-size-link",  "--font-link"],
        label: ["--font-size-label", "--font-label"],
        code:  ["--font-size-code",  "--font-code"],
        muted: ["--font-size-muted", "--font-muted"],
      };
      Object.entries(typo).forEach(([id, val]) => {
        const vars = FONT_VAR_MAP[id];
        if (!vars) return;
        document.documentElement.style.setProperty(vars[0], `${(val.size / 100).toFixed(2)}rem`);
        if (val.font) document.documentElement.style.setProperty(vars[1], val.font);
      });
    }

    // Buttons
    const btns = settings["wjw-buttons"] as {
      sliders?: Record<string, number>;
      variants?: Record<string, { bg: string; text: string; border: string }>;
    } | undefined;
    if (btns?.sliders) {
      const SLIDER_SCALES: Record<string, { scale: number; unit: string }> = {
        "--btn-radius":         { scale: 0.1,    unit: "rem" },
        "--btn-font-size":      { scale: 0.0625, unit: "rem" },
        "--btn-font-weight":    { scale: 1,      unit: "" },
        "--btn-px":             { scale: 0.0625, unit: "rem" },
        "--btn-py":             { scale: 0.0625, unit: "rem" },
        "--btn-border-width":   { scale: 1,      unit: "px" },
        "--btn-letter-spacing": { scale: 0.01,   unit: "em" },
      };
      Object.entries(btns.sliders).forEach(([cssVar, val]) => {
        const s = SLIDER_SCALES[cssVar];
        if (!s) return;
        document.documentElement.style.setProperty(cssVar,
          s.unit === "" ? `${val}` : `${(val * s.scale).toFixed(3)}${s.unit}`);
      });
    }
    if (btns?.variants) {
      const VAR_MAP: Record<string, [string, string, string]> = {
        default:     ["--btn-default-bg",     "--btn-default-text",     "--btn-default-border"],
        secondary:   ["--btn-secondary-bg",   "--btn-secondary-text",   "--btn-secondary-border"],
        outline:     ["--btn-outline-bg",     "--btn-outline-text",     "--btn-outline-border"],
        ghost:       ["--btn-ghost-bg",       "--btn-ghost-text",       "--btn-ghost-border"],
        destructive: ["--btn-destructive-bg", "--btn-destructive-text", "--btn-destructive-border"],
        link:        ["--btn-link-bg",        "--btn-link-text",        "--btn-link-border"],
      };
      Object.entries(btns.variants).forEach(([id, col]) => {
        const vars = VAR_MAP[id];
        if (!vars) return;
        document.documentElement.style.setProperty(vars[0], col.bg);
        document.documentElement.style.setProperty(vars[1], col.text);
        document.documentElement.style.setProperty(vars[2], col.border);
      });
    }
  } catch (e) {
    console.warn("[boot] settings hydration failed:", e);
  }
}

document.documentElement.classList.add("dark");
document.documentElement.classList.add(getPlatformClass());

hydrate().finally(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});