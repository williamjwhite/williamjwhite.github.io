import * as React from "react";
// fixed — X added back:
import {
  Rss, LogIn, Bot, Send, ExternalLink, Loader2,
  FileUp, CalendarDays, Server, X,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useServerStatus } from "@/hooks/use-server-status";
import { StatusDot } from "@/components/sections/status-dot";

import { DocumentWizard } from "@/components/wizards/document-wizard";
import { ConsultationWizard } from "@/components/wizards/consultation-wizard";
import { ClientPortalModal } from "@/components/wizards/client-portal-modal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RssItem { title: string; url: string; source: string; }

// ─── RSS: My Posts (static, editable from Admin) ──────────────────────────────

function getMyPosts(): RssItem[] {
  return [
    { title: "Setting up Tailwind v4 in an Nx Monorepo", url: "https://docs.williamjwhite.me/blog/tailwind-v4-nx", source: "Me" },
    { title: "DocuSign + eOriginal: A Field Guide", url: "https://docs.williamjwhite.me/blog/docusign-eoriginal", source: "Me" },
    { title: "Cloud‑Native Patterns for Small Teams", url: "https://docs.williamjwhite.me/blog/cloud-native-small-teams", source: "Me" },
  ];
}

// ─── RSS: Hacker News ─────────────────────────────────────────────────────────

function useHackerNews(count = 5): { items: RssItem[]; loading: boolean } {
  const [items, setItems] = React.useState<RssItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const ids: number[] = await fetch(
          "https://hacker-news.firebaseio.com/v0/topstories.json"
        ).then(r => r.json());

        const top = ids.slice(0, count);
        const stories = await Promise.all(
          top.map(id =>
            fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
          )
        );

        if (!cancelled) {
          setItems(
            stories.map((s: { title: string; url?: string; id: number }) => ({
              title: s.title,
              url: s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
              source: "HN",
            }))
          );
        }
      } catch { /* fail silently */ }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [count]);

  return { items, loading };
}

// ─── RSS: Dev.to ──────────────────────────────────────────────────────────────

function useDevTo(count = 5): { items: RssItem[]; loading: boolean } {
  const [items, setItems] = React.useState<RssItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data: Array<{ title: string; url: string; canonical_url: string }> =
          await fetch(`https://dev.to/api/articles?top=1&per_page=${count}`).then(r => r.json());

        if (!cancelled) {
          setItems(
            data.map(a => ({
              title: a.title,
              url: a.url ?? a.canonical_url,
              source: "Dev.to",
            }))
          );
        }
      } catch { /* fail silently */ }
      finally { if (!cancelled) setLoading(false); }
    }
    load();
    return () => { cancelled = true; };
  }, [count]);

  return { items, loading };
}

// ─── RSS Feed Component ───────────────────────────────────────────────────────

type FeedTab = "mine" | "hn" | "devto";

function RssFeed() {
  const [tab, setTab] = React.useState<FeedTab>("mine");
  const [expanded, setExpanded] = React.useState(false);

  const { items: hnItems, loading: hnLoading } = useHackerNews(6);
  const { items: devtoItems, loading: devtoLoading } = useDevTo(6);

  const sourceMap: Record<FeedTab, { items: RssItem[]; loading: boolean }> = {
    mine: { items: getMyPosts(), loading: false },
    hn: { items: hnItems, loading: hnLoading },
    devto: { items: devtoItems, loading: devtoLoading },
  };

  const { items, loading } = sourceMap[tab];
  const visible = expanded ? items : items.slice(0, 3);

  const tabs: { id: FeedTab; label: string }[] = [
    { id: "mine", label: "My Posts" },
    { id: "hn", label: "HN" },
    { id: "devto", label: "Dev.to" },
  ];

  return (
    <div className="space-y-2">
      {/* Tab strip */}
      <div className="flex gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setExpanded(false); }}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${tab === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Items */}
      {loading && (
        <p className="text-xs text-muted-foreground italic flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Loading…
        </p>
      )}

      {!loading && items.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No items found.</p>
      )}

      {visible.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-start justify-between gap-2 group"
        >
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 flex-1">
            <Badge variant="outline" className="mr-1 px-1 py-0 text-[10px] align-middle">
              {item.source}
            </Badge>
            {item.title}
          </span>
          <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        </a>
      ))}

      {items.length > 3 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="text-xs text-primary hover:underline"
        >
          {expanded ? "Show less" : `+${items.length - 3} more`}
        </button>
      )}
    </div>
  );
}

// ─── AI Bot ───────────────────────────────────────────────────────────────────

interface ChatMessage { role: "user" | "bot"; text: string; }
const BOT_INTRO: ChatMessage = {
  role: "bot",
  text: "Hi! I'm William's assistant. Ask me about his work, services, or how to get in touch.",
};

function AiBot() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([BOT_INTRO]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "bot", text: data.reply ?? "Sorry, I didn't catch that." }]);
    } catch {
      setMessages(m => [...m, {
        role: "bot",
        text: "I'm having trouble connecting. Try emailing hello@williamjwhite.me directly.",
      }]);
    } finally { setLoading(false); }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setOpen(true)}>
        <Bot className="w-3.5 h-3.5 text-primary" /> Ask AI Assistant
      </Button>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Bot className="w-3.5 h-3.5 text-primary" /> AI Assistant
        </span>
        <button onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="h-48 overflow-y-auto p-3 space-y-2 bg-background text-xs">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-2.5 py-1.5 rounded-xl leading-relaxed ${msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-sm"
                : "bg-muted text-foreground rounded-bl-sm"
              }`}>{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted px-2.5 py-1.5 rounded-xl rounded-bl-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="flex gap-1.5 p-2 border-t border-border bg-muted/30">
        <Input
          className="h-7 text-xs flex-1" placeholder="Ask something…"
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey} disabled={loading}
        />
        <Button size="icon" className="h-7 w-7 shrink-0"
          onClick={sendMessage} disabled={loading || !input.trim()}>
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─── Main SidebarCard ─────────────────────────────────────────────────────────

export function SidebarCard() {
const { status } = useServerStatus();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-4 h-4 text-primary" />
              Client Services
            </CardTitle>
            <CardDescription>Portal, consultation, and resources.</CardDescription>
          </div>
          <StatusDot status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5 text-sm text-muted-foreground">

        {/* RSS — My Posts + HN + Dev.to */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Rss className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Latest Posts
            </span>
            <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">RSS</Badge>
          </div>
          <RssFeed />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <FileUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Document Submission
            </span>
          </div>
          <DocumentWizard />
        </div>

        <Separator />

        {/* Consultation */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Request a Consultation
            </span>
          </div>
          <ConsultationWizard />
        </div>

        <Separator />

        {/* Client portal */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <LogIn className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Client Access
            </span>
          </div>
          <ClientPortalModal />
        </div>

        <Separator />

        {/* AI assistant */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Bot className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              AI Assistant
            </span>
          </div>
          <AiBot />
        </div>

      </CardContent>
    </Card>
  );
}

/*
─── Backend contract for /api/documents/submit ────────────────────────────────

  Method:  POST multipart/form-data
  Fields:
    name          string   required
    email         string   required
    documentType  string   optional  (proposal | contract | brief | nda | other)
    note          string   optional
    timestamp     string   ISO 8601
    file          File     optional

  Expected response: { ok: true, id: string }

  Backend should:
    1. Store record in documents table:
       { id, name, email, documentType, note, timestamp, fileUrl, status: "received" }
    2. Upload file to storage (S3, Supabase Storage, etc.)
    3. Send email notification to hello@williamjwhite.me with submitter details
    4. Optionally send confirmation email to submitter

──────────────────────────────────────────────────────────────────────────────
*/
