import * as React from "react";
import {
  MessageCircleQuestionMark,
  Search,
  Terminal,
  Truck,
  Rss,
  LogIn,
  Bot,
  Send,
  ExternalLink,
  X,
  Loader2,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// ─── Types ────────────────────────────────────────────────────────────────────

type ServerStatus = "online" | "degraded" | "offline" | "checking";

interface RssItem {
  title: string;
  url: string;
  date?: string;
}

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

// ─── Server Status Hook ───────────────────────────────────────────────────────

function useServerStatus(): ServerStatus {
  const [status, setStatus] = React.useState<ServerStatus>("checking");

  React.useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/status", { signal: AbortSignal.timeout(5000) });
        setStatus(res.ok ? "online" : "degraded");
      } catch {
        setStatus("offline");
      }
    }
    check();
    const id = setInterval(check, 15_000);
    return () => clearInterval(id);
  }, []);

  return status;
}

// ─── Status Indicator ─────────────────────────────────────────────────────────

function StatusDot({ status }: { status: ServerStatus }) {
  const map = {
    online:   { color: "bg-green-500",  label: "Online",   Icon: Wifi },
    degraded: { color: "bg-amber-500",  label: "Degraded", Icon: AlertTriangle },
    offline:  { color: "bg-destructive",label: "Offline",  Icon: WifiOff },
    checking: { color: "bg-muted-foreground", label: "Checking…", Icon: Loader2 },
  } as const;

  const { color, label, Icon } = map[status];

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`inline-block w-2 h-2 rounded-full ${color} ${status === "checking" ? "animate-pulse" : ""}`} />
      <Icon className={`w-3 h-3 ${status === "checking" ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
}

// ─── RSS Feed ─────────────────────────────────────────────────────────────────

// Placeholder items — replace with a real fetch from your RSS/blog endpoint
const RSS_ITEMS: RssItem[] = [
  {
    title: "Setting up Tailwind v4 in an Nx Monorepo",
    url: "https://docs.williamjwhite.me/blog/tailwind-v4-nx",
    date: "Mar 2025",
  },
  {
    title: "DocuSign + eOriginal: A Field Guide",
    url: "https://docs.williamjwhite.me/blog/docusign-eoriginal",
    date: "Feb 2025",
  },
  {
    title: "Cloud‑Native Patterns for Small Teams",
    url: "https://docs.williamjwhite.me/blog/cloud-native-small-teams",
    date: "Jan 2025",
  },
];

function RssFeed() {
  const [expanded, setExpanded] = React.useState(false);
  const visible = expanded ? RSS_ITEMS : RSS_ITEMS.slice(0, 2);

  return (
    <div className="space-y-2">
      {visible.map((item) => (
        <a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-start justify-between gap-2 group"
        >
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 flex-1">
            {item.title}
          </span>
          <ExternalLink className="w-3 h-3 mt-0.5 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        </a>
      ))}
      {RSS_ITEMS.length > 2 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs text-primary hover:underline"
        >
          {expanded ? "Show less" : `+${RSS_ITEMS.length - 2} more`}
        </button>
      )}
    </div>
  );
}

// ─── Client Portal Login ──────────────────────────────────────────────────────

function ClientPortal() {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Replace with your actual auth endpoint
      const res = await fetch("/api/client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const { redirectUrl } = await res.json();
        window.location.href = redirectUrl ?? "/client/dashboard";
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <LogIn className="w-3.5 h-3.5" />
        Client Portal Login
      </Button>
    );
  }

  return (
    <form onSubmit={handleLogin} className="space-y-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Client Portal
        </span>
        <button
          type="button"
          onClick={() => { setOpen(false); setError(""); }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <Input
        type="email"
        placeholder="Email"
        className="h-8 text-xs"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setError(""); }}
        disabled={loading}
      />
      <Input
        type="password"
        placeholder="Password"
        className="h-8 text-xs"
        value={password}
        onChange={(e) => { setPassword(e.target.value); setError(""); }}
        disabled={loading}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" size="sm" className="w-full gap-2" disabled={loading}>
        {loading
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in…</>
          : <><LogIn className="w-3.5 h-3.5" /> Sign In</>}
      </Button>
    </form>
  );
}

// ─── AI Bot ───────────────────────────────────────────────────────────────────

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
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);

    try {
      // Replace with your actual AI endpoint / OpenAI proxy
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "bot", text: data.reply ?? "Sorry, I didn't catch that." }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "I'm having trouble connecting. Try emailing hello@williamjwhite.me directly." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2"
        onClick={() => setOpen(true)}
      >
        <Bot className="w-3.5 h-3.5 text-primary" />
        Ask AI Assistant
      </Button>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
        <span className="flex items-center gap-1.5 text-xs font-semibold">
          <Bot className="w-3.5 h-3.5 text-primary" />
          AI Assistant
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Messages */}
      <div className="h-48 overflow-y-auto p-3 space-y-2 bg-background text-xs">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-2.5 py-1.5 rounded-xl leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
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

      {/* Input */}
      <div className="flex gap-1.5 p-2 border-t border-border bg-muted/30">
        <Input
          className="h-7 text-xs flex-1"
          placeholder="Ask something…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <Button
          size="icon"
          className="h-7 w-7 shrink-0"
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ─── Now Items ────────────────────────────────────────────────────────────────

// const NOW_ITEMS = [
//   { icon: <Terminal className="w-4 h-4" />, text: "This site — it's a work in progress. Started 12/12/2025" },
//   { icon: <Terminal className="w-4 h-4" />, text: "Updating williamjwhite.me with new content and case studies." },
//   { icon: <Truck className="w-4 h-4" />, text: "Recently relocated to New York from Seattle and exploring new opportunities." },
//   { icon: <Search className="w-4 h-4" />, text: "Open to full‑time roles and consulting engagements." },
//   { icon: <MessageCircleQuestionMark className="w-4 h-4" />, text: "Client consultations and architecture reviews." },
// ];

// ─── Main SidebarCard ─────────────────────────────────────────────────────────

export function SidebarCard() {
  const status = useServerStatus();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            Server Status
          </div>
          {/* <div>
            <CardTitle>Now</CardTitle>
            <CardDescription>Current projects and focus.</CardDescription>
          </div> */}
          <StatusDot status={status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-5 text-sm text-muted-foreground">

        {/* Now items */}
        {/* <div className="space-y-2">
          {NOW_ITEMS.map(({ icon, text }, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-0.5 text-primary shrink-0">{icon}</span>
              <div>{text}</div>
            </div>
          ))}
        </div> */}

        <Separator />

        {/* RSS feed */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Rss className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Latest Posts
            </span>
            <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">
              RSS
            </Badge>
          </div>
          <RssFeed />
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
          <ClientPortal />
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
