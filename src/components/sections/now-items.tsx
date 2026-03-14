import { MessageCircleQuestionMark, Search, Terminal, Truck } from "lucide-react";

const NOW_ITEMS = [
  { icon: <Terminal className="w-4 h-4" />, text: "This site — it's a work in progress. Started 12/12/2025" },
  { icon: <Terminal className="w-4 h-4" />, text: "Updating williamjwhite.me with new content and case studies." },
  { icon: <Truck className="w-4 h-4" />, text: "Recently relocated to New York from Seattle and exploring new opportunities." },
  { icon: <Search className="w-4 h-4" />, text: "Open to full‑time roles and consulting engagements." },
  { icon: <MessageCircleQuestionMark className="w-4 h-4" />, text: "Client consultations and architecture reviews." },
];

export function NowItems() {
  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      {NOW_ITEMS.map(({ icon, text }, i) => (
        <div key={i} className="flex items-start gap-2">
          <span className="mt-0.5 text-primary shrink-0">{icon}</span>
          <div>{text}</div>
        </div>
      ))}
    </div>
  );
}
