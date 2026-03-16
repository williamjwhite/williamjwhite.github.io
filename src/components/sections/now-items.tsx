import { MessageCircleQuestionMark, Search, Terminal, Truck } from "lucide-react";

// Items are stored in localStorage so the Admin CMS can edit them.
// Falls back to DEFAULTS if nothing has been saved yet.

const STORAGE_KEY = "wjw_now_items";

export interface NowItem { icon: string; text: string; }

export const DEFAULT_NOW_ITEMS: NowItem[] = [
  { icon: "terminal", text: "This site — it's a work in progress. Started 12/12/2025" },
  { icon: "terminal", text: "Updating williamjwhite.me with new content and case studies." },
  { icon: "truck",    text: "Recently relocated to New York from Seattle and exploring new remote and local opportunities." },
  { icon: "search",   text: "Open to full‑time roles and consulting and contract engagements." },
  { icon: "chat",     text: "Client consultations and architecture reviews." },
];

export function getNowItems(): NowItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as NowItem[];
  } catch { /* noop */ }
  return DEFAULT_NOW_ITEMS;
}

export function saveNowItems(items: NowItem[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* noop */ }
  window.dispatchEvent(new CustomEvent("wjw:now-items-change"));
}

function IconFor({ name }: { name: string }) {
  const cls = "w-4 h-4";
  switch (name) {
    case "truck":    return <Truck    className={cls} />;
    case "search":   return <Search   className={cls} />;
    case "chat":     return <MessageCircleQuestionMark className={cls} />;
    default:         return <Terminal className={cls} />;
  }
}

export function NowItems() {
  const items = getNowItems();
  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      {items.map(({ icon, text }, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-0.5 text-primary shrink-0"><IconFor name={icon} /></span>
          <div>{text}</div>
        </div>
      ))}
    </div>
  );
}
