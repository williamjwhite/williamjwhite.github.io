import * as React from "react";
import {
  Rss, LogIn, Bot, Send, ExternalLink, X, Loader2,
  FileUp, CalendarDays, CheckCircle, Server,
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

import { DocumentWizard }      from "@/components/wizards/document-wizard";
import { ConsultationWizard }  from "@/components/wizards/consultation-wizard";
import { ClientPortalModal }   from "@/components/wizards/client-portal-modal";


// ─── Types ────────────────────────────────────────────────────────────────────

interface RssItem { title: string; url: string; source: string; }

// ─── RSS: My Posts (static, editable from Admin) ──────────────────────────────

const RSS_URLS_KEY = "wjw_rss_urls";

interface RssConfig { label: string; url: string; active: boolean; }

function getMyPosts(): RssItem[] {
  // My posts are hardcoded here — Admin can add/remove via RSS config
  return [
    { title: "Setting up Tailwind v4 in an Nx Monorepo",   url: "https://docs.williamjwhite.me/blog/tailwind-v4-nx",          source: "Me" },
    { title: "DocuSign + eOriginal: A Field Guide",         url: "https://docs.williamjwhite.me/blog/docusign-eoriginal",       source: "Me" },
    { title: "Cloud‑Native Patterns for Small Teams",       url: "https://docs.williamjwhite.me/blog/cloud-native-small-teams", source: "Me" },
  ];
}

// ─── RSS: Hacker News ─────────────────────────────────────────────────────────

function useHackerNews(count = 5): { items: RssItem[]; loading: boolean } {
  const [items,   setItems]   = React.useState<RssItem[]>([]);
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
              title:  s.title,
              url:    s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
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
  const [items,   setItems]   = React.useState<RssItem[]>([]);
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
              title:  a.title,
              url:    a.url ?? a.canonical_url,
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
  const [tab,      setTab]      = React.useState<FeedTab>("mine");
  const [expanded, setExpanded] = React.useState(false);

  const { items: hnItems,    loading: hnLoading    } = useHackerNews(6);
  const { items: devtoItems, loading: devtoLoading } = useDevTo(6);

  const sourceMap: Record<FeedTab, { items: RssItem[]; loading: boolean }> = {
    mine:  { items: getMyPosts(),  loading: false        },
    hn:    { items: hnItems,       loading: hnLoading    },
    devto: { items: devtoItems,    loading: devtoLoading },
  };

  const { items, loading } = sourceMap[tab];
  const visible = expanded ? items : items.slice(0, 3);

  const tabs: { id: FeedTab; label: string }[] = [
    { id: "mine",  label: "My Posts" },
    { id: "hn",    label: "HN"       },
    { id: "devto", label: "Dev.to"   },
  ];

  return (
    <div className="space-y-2">
      {/* Tab strip */}
      <div className="flex gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setExpanded(false); }}
            className={`px-2.5 py-1 rounded text-xs transition-colors ${
              tab === t.id
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

// ─── Document Submission ──────────────────────────────────────────────────────
// Sends multipart form to /api/documents/submit
// Backend should: (1) store record in DB, (2) send email notification to you.
// See README comment at bottom of this file for the expected API shape.

// function DocumentSubmission() {
//   const [open,   setOpen]   = React.useState(false);
//   const [name,   setName]   = React.useState("");
//   const [email,  setEmail]  = React.useState("");
//   const [type,   setType]   = React.useState("");
//   const [note,   setNote]   = React.useState("");
//   const [file,   setFile]   = React.useState<File | null>(null);
//   const [status, setStatus] = React.useState<"idle" | "sending" | "sent" | "error">("idle");

//   function reset() {
//     setOpen(false); setStatus("idle");
//     setName(""); setEmail(""); setType(""); setNote(""); setFile(null);
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!name.trim() || !email.trim()) return;
//     setStatus("sending");

//     try {
//       const fd = new FormData();
//       fd.append("name",         name.trim());
//       fd.append("email",        email.trim());
//       fd.append("documentType", type);
//       fd.append("note",         note.trim());
//       fd.append("timestamp",    new Date().toISOString());
//       if (file) fd.append("file", file);

//       // POST to your backend — expects { ok: true, id: string }
//       // Backend responsibility: store in DB + send email notification
//       const res = await fetch("/api/documents/submit", { method: "POST", body: fd });
//       setStatus(res.ok ? "sent" : "error");
//     } catch {
//       setStatus("error");
//     }
//   }

//   if (!open) {
//     return (
//       <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setOpen(true)}>
//         <FileUp className="w-3.5 h-3.5 text-primary" /> Document Submission
//       </Button>
//     );
//   }

//   if (status === "sent") {
//     return (
//       <div className="flex flex-col items-center gap-2 py-4 text-center">
//         <CheckCircle className="w-6 h-6 text-primary" />
//         <p className="text-xs font-medium">Submitted — I'll be in touch shortly.</p>
//         <p className="text-xs text-muted-foreground">A confirmation has been sent to {email}.</p>
//         <Button size="sm" variant="outline" onClick={reset}>Done</Button>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-2">
//       <div className="flex items-center justify-between mb-1">
//         <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//           Submit Documents
//         </span>
//         <button type="button" onClick={() => setOpen(false)}
//           className="text-muted-foreground hover:text-foreground transition-colors">
//           <X className="w-3.5 h-3.5" />
//         </button>
//       </div>

//       <Input placeholder="Your name *"  className="h-8 text-xs" value={name}
//         onChange={e => setName(e.target.value)} required />
//       <Input placeholder="Your email *" className="h-8 text-xs" value={email}
//         onChange={e => setEmail(e.target.value)} type="email" required />

//       <select
//         className="w-full h-8 px-3 text-xs border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-muted-foreground"
//         value={type} onChange={e => setType(e.target.value)}
//       >
//         <option value="">Document type (optional)</option>
//         <option value="proposal">Proposal / RFP</option>
//         <option value="contract">Contract</option>
//         <option value="brief">Project Brief</option>
//         <option value="nda">NDA</option>
//         <option value="other">Other</option>
//       </select>

//       <textarea
//         placeholder="Brief note (optional)"
//         className="w-full px-3 py-1.5 text-xs border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none h-16"
//         value={note} onChange={e => setNote(e.target.value)}
//       />

//       <div className="space-y-1">
//         <label className="text-xs text-muted-foreground">
//           Attach file (PDF, DOC, DOCX, PNG, JPG — max 10 MB)
//         </label>
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
//           className="w-full text-xs text-muted-foreground file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-muted file:text-foreground hover:file:bg-muted/70"
//           onChange={e => setFile(e.target.files?.[0] ?? null)}
//         />
//       </div>

//       {status === "error" && (
//         <p className="text-xs text-destructive">
//           Submission failed. Please email{" "}
//           <a href="mailto:hello@williamjwhite.me" className="underline">
//             hello@williamjwhite.me
//           </a>{" "}
//           directly.
//         </p>
//       )}

//       <Button
//         type="submit" size="sm" className="w-full gap-2"
//         disabled={status === "sending" || !name.trim() || !email.trim()}
//       >
//         {status === "sending"
//           ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
//           : <><FileUp  className="w-3.5 h-3.5" /> Submit Securely</>}
//       </Button>

//       <p className="text-[10px] text-muted-foreground text-center">
//         Stored securely · notification sent to William
//       </p>
//     </form>
//   );
// }

// ─── Consultation Request ─────────────────────────────────────────────────────

// function ConsultationRequest() {
//   const [open,    setOpen]    = React.useState(false);
//   const [name,    setName]    = React.useState("");
//   const [email,   setEmail]   = React.useState("");
//   const [company, setCompany] = React.useState("");
//   const [project, setProject] = React.useState("");
//   const [budget,  setBudget]  = React.useState("");
//   const [status,  setStatus]  = React.useState<"idle" | "sending" | "sent" | "error">("idle");

//   function reset() {
//     setOpen(false); setStatus("idle");
//     setName(""); setEmail(""); setCompany(""); setProject(""); setBudget("");
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!name.trim() || !email.trim() || !project.trim()) return;
//     setStatus("sending");
//     try {
//       const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "application/json" },
//         body: JSON.stringify({ name, email, company, project, budget }),
//       });
//       setStatus(res.ok ? "sent" : "error");
//     } catch { setStatus("error"); }
//   }

//   if (!open) {
//     return (
//       <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setOpen(true)}>
//         <CalendarDays className="w-3.5 h-3.5 text-primary" /> Request a Consultation
//       </Button>
//     );
//   }

//   if (status === "sent") {
//     return (
//       <div className="flex flex-col items-center gap-2 py-4 text-center">
//         <CheckCircle className="w-6 h-6 text-primary" />
//         <p className="text-xs font-medium">Request received.</p>
//         <p className="text-xs text-muted-foreground">I'll reach out within 1–2 business days.</p>
//         <Button size="sm" variant="outline" onClick={reset}>Done</Button>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-2">
//       <div className="flex items-center justify-between mb-1">
//         <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//           Request a Consultation
//         </span>
//         <button type="button" onClick={() => setOpen(false)}
//           className="text-muted-foreground hover:text-foreground transition-colors">
//           <X className="w-3.5 h-3.5" />
//         </button>
//       </div>

//       <div className="grid grid-cols-2 gap-2">
//         <Input placeholder="Name *"  className="h-8 text-xs" value={name}
//           onChange={e => setName(e.target.value)} required />
//         <Input placeholder="Email *" className="h-8 text-xs" value={email}
//           onChange={e => setEmail(e.target.value)} type="email" required />
//       </div>

//       <Input placeholder="Company (optional)" className="h-8 text-xs" value={company}
//         onChange={e => setCompany(e.target.value)} />

//       <textarea
//         placeholder="Tell me about your project *"
//         className="w-full px-3 py-1.5 text-xs border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
//         value={project} onChange={e => setProject(e.target.value)} required
//       />

//       <select
//         className="w-full h-8 px-3 text-xs border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring text-muted-foreground"
//         value={budget} onChange={e => setBudget(e.target.value)}
//       >
//         <option value="">Budget range (optional)</option>
//         <option value="<5k">Under $5k</option>
//         <option value="5-15k">$5k – $15k</option>
//         <option value="15-50k">$15k – $50k</option>
//         <option value="50k+">$50k+</option>
//         <option value="tbd">To be determined</option>
//       </select>

//       {status === "error" && (
//         <p className="text-xs text-destructive">
//           Submission failed. Email{" "}
//           <a href="mailto:hello@williamjwhite.me" className="underline">
//             hello@williamjwhite.me
//           </a>.
//         </p>
//       )}

//       <Button
//         type="submit" size="sm" className="w-full gap-2"
//         disabled={status === "sending" || !name.trim() || !email.trim() || !project.trim()}
//       >
//         {status === "sending"
//           ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
//           : <><CalendarDays className="w-3.5 h-3.5" /> Request Consultation</>}
//       </Button>
//     </form>
//   );
// }

// ─── Client Portal ────────────────────────────────────────────────────────────

// function ClientPortal() {
//   const [open,     setOpen]     = React.useState(false);
//   const [email,    setEmail]    = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [loading,  setLoading]  = React.useState(false);
//   const [error,    setError]    = React.useState("");

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();
//     if (!email.trim() || !password.trim()) { setError("Please enter your email and password."); return; }
//     setLoading(true); setError("");
//     try {
//       const res = await fetch("/api/client/login", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       if (res.ok) {
//         const { redirectUrl } = await res.json();
//         window.location.href = redirectUrl ?? "/client/dashboard";
//       } else { setError("Invalid credentials. Please try again."); }
//     } catch { setError("Unable to connect. Please try again."); }
//     finally { setLoading(false); }
//   }

//   if (!open) {
//     return (
//       <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => setOpen(true)}>
//         <LogIn className="w-3.5 h-3.5" /> Client Portal Login
//       </Button>
//     );
//   }

//   return (
//     <form onSubmit={handleLogin} className="space-y-2">
//       <div className="flex items-center justify-between mb-1">
//         <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
//           Client Portal
//         </span>
//         <button type="button" onClick={() => { setOpen(false); setError(""); }}
//           className="text-muted-foreground hover:text-foreground transition-colors">
//           <X className="w-3.5 h-3.5" />
//         </button>
//       </div>
//       <Input type="email"    placeholder="Email"    className="h-8 text-xs" value={email}
//         onChange={e => { setEmail(e.target.value);    setError(""); }} disabled={loading} />
//       <Input type="password" placeholder="Password" className="h-8 text-xs" value={password}
//         onChange={e => { setPassword(e.target.value); setError(""); }} disabled={loading} />
//       {error && <p className="text-xs text-destructive">{error}</p>}
//       <Button type="submit" size="sm" className="w-full gap-2" disabled={loading}>
//         {loading
//           ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Signing in…</>
//           : <><LogIn   className="w-3.5 h-3.5" /> Sign In</>}
//       </Button>
//     </form>
//   );
// }

// ─── AI Bot ───────────────────────────────────────────────────────────────────

interface ChatMessage { role: "user" | "bot"; text: string; }
const BOT_INTRO: ChatMessage = {
  role: "bot",
  text: "Hi! I'm William's assistant. Ask me about his work, services, or how to get in touch.",
};

function AiBot() {
  const [open,     setOpen]     = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([BOT_INTRO]);
  const [input,    setInput]    = React.useState("");
  const [loading,  setLoading]  = React.useState(false);
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
      const res  = await fetch("/api/chat", {
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
            <div className={`max-w-[85%] px-2.5 py-1.5 rounded-xl leading-relaxed ${
              msg.role === "user"
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
  const { status, mode } = useServerStatus();

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
          <StatusDot status={status} mode={mode} />
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

        {/* Document submission */}
        {/* <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <FileUp className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Document Submission
            </span>
          </div>
          <DocumentSubmission />
        </div> */}

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

        {/* <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarDays className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Request a Consultation
            </span>
          </div>
          <ConsultationRequest />
        </div> */}

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
        {/* <div className="space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <LogIn className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Client Access
            </span>
          </div>
          <ClientPortal />
        </div> */}

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
