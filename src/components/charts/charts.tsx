"use client";

import * as React from "react";
import {
  Legend as RechartsLegend,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";

import { cn } from "@/lib/utils";

/**
 * Chart config
 */
export type ChartConfig = Record<
  string,
  {
    label?: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: string;
    theme?: Partial<Record<"light" | "dark", string>>;
  }
>;

type ChartContextValue = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return ctx;
}

/**
 * Themes / CSS variable prefixes.
 * This matches how shadcn charts set CSS variables for light/dark.
 */
const THEMES = {
  light: ":root",
  dark: ".dark",
} as const;

type ThemeName = keyof typeof THEMES;

/**
 * Generates CSS variables for a given chart container id + config.
 * NOTE: join("\n") is important to avoid returning string[] into __html.  [oai_citation:2‡GitHub](https://github.com/shadcn-ui/ui/issues/4229)
 */
function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const entries = Object.entries(config).filter(
    ([, item]) => item.theme || item.color
  );

  if (!entries.length) return null;

  const css = (Object.entries(THEMES) as Array<[ThemeName, string]>)
    .map(([theme, selector]) => {
      const vars = entries
        .map(([key, item]) => {
          const color = item.theme?.[theme] ?? item.color;
          return color ? `  --color-${key}: ${color};` : null;
        })
        .filter(Boolean)
        .join("\n");

      if (!vars) return null;

      return `${selector} [data-chart="${id}"] {\n${vars}\n}`;
    })
    .filter(Boolean)
    .join("\n");

  if (!css) return null;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

/**
 * Container
 */
export function ChartContainer({
  className,
  children,
  config,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  config: ChartConfig;
  children: React.ReactNode;
}) {
  const id = React.useId();

  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={id} className={cn("w-full", className)} {...props}>
        <ChartStyle id={id} config={config} />
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/**
 * We re-export Recharts tooltip/legend wrappers, but keep typing safe for v3.
 */
export const ChartTooltip = RechartsTooltip;
export const ChartLegend = RechartsLegend;

/**
 * Minimal runtime-compatible payload types
 * (Recharts typings vary between v2 and v3; these match what you actually receive.)
 */
type TooltipPayloadItem = {
  name?: string;
  value?: unknown;
  dataKey?: string | number;
  color?: string;
  payload?: Record<string, unknown>;
};

type ChartTooltipContentProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: unknown;
} & React.HTMLAttributes<HTMLDivElement> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "dot" | "line" | "dashed";
    nameKey?: string;
    labelKey?: string;
  };

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  nameKey,
  labelKey,
  ...props
}: ChartTooltipContentProps) {
  const { config } = useChart();

  if (!active || !payload || payload.length === 0) return null;

  const resolvedLabel =
    typeof label === "string" || typeof label === "number"
      ? String(label)
      : undefined;

  return (
    <div
      className={cn(
        "grid min-w-[12rem] items-start gap-1.5 rounded-lg border bg-background px-3 py-2 text-xs shadow-xl",
        className
      )}
      {...props}
    >
      {!hideLabel && resolvedLabel ? (
        <div className="font-medium text-foreground">{resolvedLabel}</div>
      ) : null}

      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const rawKey =
            (nameKey && item.payload?.[nameKey]) ||
            item.dataKey ||
            item.name ||
            `item-${index}`;

          const key = String(rawKey);

          const cfg = config[key] ?? {};
          const labelFromConfig = cfg.label;
          const labelFromPayload =
            labelKey && item.payload?.[labelKey]
              ? String(item.payload[labelKey])
              : item.name
              ? String(item.name)
              : key;

          const rowLabel = labelFromConfig ?? labelFromPayload;

          const Icon = cfg.icon;
          const color =
            cfg.color ||
            item.color ||
            (item.dataKey ? `var(--color-${String(item.dataKey)})` : undefined);

          return (
            <div key={`${key}-${index}`} className="flex items-center gap-2">
              {!hideIndicator ? (
                <span
                  className={cn(
                    "shrink-0",
                    indicator === "dot" && "h-2 w-2 rounded-full",
                    indicator === "line" && "h-2 w-0.5 rounded-sm",
                    indicator === "dashed" &&
                      "h-2 w-0.5 rounded-sm border border-dashed"
                  )}
                  style={
                    color
                      ? { backgroundColor: color, borderColor: color }
                      : undefined
                  }
                />
              ) : null}

              {Icon ? (
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              ) : null}

              <div className="flex items-center justify-between w-full gap-3">
                <span className="text-muted-foreground">{rowLabel}</span>
                <span className="tabular-nums text-foreground">
                  {typeof item.value === "number" ||
                  typeof item.value === "string"
                    ? item.value
                    : item.value == null
                    ? "—"
                    : String(item.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Legend types (Recharts v2/v3 mismatch)
 * We do NOT depend on LegendProps["payload"] existing.  [oai_citation:3‡GitHub](https://github.com/recharts/recharts/issues/4443?utm_source=chatgpt.com)
 */
type LegendPayloadItem = {
  value?: unknown;
  dataKey?: string | number;
  color?: string;
  type?: string;
  payload?: Record<string, unknown>;
};

type ChartLegendContentProps = React.HTMLAttributes<HTMLDivElement> & {
  payload?: LegendPayloadItem[];
  verticalAlign?: "top" | "middle" | "bottom";
  hideIcon?: boolean;
  nameKey?: string;
};

export function ChartLegendContent({
  className,
  payload,
  hideIcon = false,
  nameKey,
  ...props
}: ChartLegendContentProps) {
  const { config } = useChart();

  if (!payload || payload.length === 0) return null;

  const items = payload
    .filter((item: LegendPayloadItem) => item.type !== "none")
    .map((item: LegendPayloadItem, index: number) => {
      const rawKey =
        (nameKey && item.payload?.[nameKey]) ||
        item.dataKey ||
        item.value ||
        `item-${index}`;

      const key = String(rawKey);
      const cfg = config[key] ?? {};
      const label =
        cfg.label ??
        (typeof item.value === "string" || typeof item.value === "number"
          ? String(item.value)
          : key);

      const Icon = cfg.icon;
      const color =
        cfg.color ||
        item.color ||
        (item.dataKey ? `var(--color-${String(item.dataKey)})` : undefined);

      return { key: `${key}-${index}`, label, Icon, color };
    });

  return (
    <div
      className={cn("flex flex-wrap items-center gap-3 text-xs", className)}
      {...props}
    >
      {items.map((it) => (
        <div key={it.key} className="flex items-center gap-2">
          {!hideIcon ? (
            it.Icon ? (
              <it.Icon className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <span
                className="w-2 h-2 rounded-full"
                style={it.color ? { backgroundColor: it.color } : undefined}
              />
            )
          ) : null}
          <span className="text-muted-foreground">{it.label}</span>
        </div>
      ))}
    </div>
  );
}
