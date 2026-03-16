import * as React from "react";
import { WizardAdmin } from "@/components/sections/wizard-admin";
import { Wand2 } from "lucide-react";
import {
  Activity, AlertTriangle, ArrowLeft, Bot, CheckCircle, ChevronDown, ChevronUp,
  Cloud, Database, Edit3, Eye, EyeOff, FileText, Gauge, Globe, Loader2,
  LogOut, Mail, Plus, Rss, Save, Server, Settings, Shield,
  ToggleLeft, ToggleRight, Trash2, UserCheck, UserMinus, UserPlus,
  Users, Wifi, WifiOff, Wrench, X,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  type ServerMode, type ServerStatus,
  getServerMode, setServerMode, useServerStatus,
} from "@/hooks/use-server-status";
import {
  type NowItem, getNowItems, saveNowItems, DEFAULT_NOW_ITEMS,
} from "@/components/sections/now-items";



// ─── Constants ────────────────────────────────────────────────────────────────

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN ?? "1234";          // ← change this
const SESSION_KEY = "wjw_admin_authed";
const MAINTENANCE_KEY = "wjw_maintenance";
const SITE_MSG_KEY = "wjw_site_message";
const RSS_URLS_KEY = "wjw_rss_urls";
const CLIENTS_KEY = "wjw_clients";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFlag(key: string): boolean {
  try { return localStorage.getItem(key) === "1"; } catch { return false; }
}
function setFlag(key: string, val: boolean) {
  try { localStorage.setItem(key, val ? "1" : "0"); } catch { }
}
function getStr(key: string, fallback = ""): string {
  try { return localStorage.getItem(key) ?? fallback; } catch { return fallback; }
}
function setStr(key: string, val: string) {
  try { localStorage.setItem(key, val); } catch { }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

function useAdminAuth() {
  const [authed, setAuthed] = React.useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === "1"; } catch { return false; }
  });
  function login(pin: string) {
    if (pin === ADMIN_PIN) {
      try { sessionStorage.setItem(SESSION_KEY, "1"); } catch { }
      setAuthed(true); return true;
    }
    return false;
  }
  function logout() {
    try { sessionStorage.removeItem(SESSION_KEY); } catch { }
    setAuthed(false);
  }
  return { authed, login, logout };
}

// ─── PIN Gate ─────────────────────────────────────────────────────────────────

function PinGate({ onLogin }: { onLogin: (p: string) => boolean }) {
  const [pin, setPin] = React.useState("");
  const [error, setError] = React.useState("");
  const [show, setShow] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!onLogin(pin)) { setError("Incorrect PIN."); setPin(""); }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="grid place-items-center w-12 h-12 rounded-xl bg-primary text-primary-foreground font-black text-xl">
              W
            </div>
          </div>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Enter your PIN to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <Input
                type={show ? "text" : "password"} inputMode="numeric"
                placeholder="PIN" value={pin}
                onChange={e => { setPin(e.target.value); setError(""); }}
                className="pr-10" autoFocus
              />
              <button type="button" onClick={() => setShow(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={!pin.trim()}>
              <Shield className="w-4 h-4" /> Unlock
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// EMAIL 
function EmailTemplatesPanel({
  showPreview, previewUrl, onUrlChange, onLoad,
}: {
  showPreview: boolean;
  previewUrl: string;
  onUrlChange: (v: string) => void;
  onLoad: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">Setup</p>
        <p>1. <code className="bg-muted px-1 rounded">npm install react-email @react-email/components -D</code></p>
        <p>2. Add to package.json scripts: <code className="bg-muted px-1 rounded">"email": "email dev --dir src/emails --port 3001"</code></p>
        <p>3. Run <code className="bg-muted px-1 rounded">npm run email</code> then click Load below.</p>
      </div>

      <div className="flex gap-2">
        <Input
          className="h-8 text-xs font-mono flex-1"
          value={previewUrl}
          onChange={e => onUrlChange(e.target.value)}
        />
        <Button size="sm" variant="outline" onClick={onLoad}>
          Load
        </Button>
      </div>

      {showPreview && (
        <iframe
          src={previewUrl}
          className="w-full h-96 rounded-xl border border-border bg-white"
          title="React Email preview"
        />
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-border bg-muted/30">
          <Mail className="w-3.5 h-3.5 text-primary" /> consultation-request.tsx
        </div>
        <div className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-border bg-muted/30">
          <Mail className="w-3.5 h-3.5 text-primary" /> document-submission.tsx
        </div>
      </div>
    </div>
  );
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function AdminSection({
  title, description, icon, defaultOpen = false, badge, children,
}: {
  title: string; description?: string; icon: React.ReactNode;
  defaultOpen?: boolean; badge?: React.ReactNode; children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <Card>
      <CardHeader className="cursor-pointer select-none" onClick={() => setOpen(v => !v)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary">{icon}</span>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {title} {badge}
              </CardTitle>
              {description && <CardDescription className="mt-0.5">{description}</CardDescription>}
            </div>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </CardHeader>
      {open && <CardContent>{children}</CardContent>}
    </Card>
  );
}

// ─── Stat tile ────────────────────────────────────────────────────────────────

function StatTile({ icon, label, value, sub, accent }: {
  icon: React.ReactNode; label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`p-4 border rounded-2xl border-border ${accent ? "bg-primary/5" : "bg-card"}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <div className="text-xl font-black">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── 1. Server Mode ───────────────────────────────────────────────────────────

function ServerModePanel() {
  const { status: liveStatus } = useServerStatus();
  const [mode, setMode] = React.useState<ServerMode>(getServerMode);

  function toggle() {
    const next: ServerMode = mode === "live" ? "demo" : "live";
    setServerMode(next); setMode(next);
  }

  const dotBg: Record<ServerStatus, string> = {
    online: "#22c55e", degraded: "#f59e0b", offline: "#ef4444", checking: "#38bdf8",
  };
  const StatusIcons: Record<ServerStatus, React.ElementType> = {
    online: Wifi, degraded: AlertTriangle, offline: WifiOff, checking: Loader2,
  };
  const StatusIcon = StatusIcons[liveStatus];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-2xl border-border bg-card">
        <div>
          <p className="text-sm font-semibold">Live endpoint</p>
          <p className="text-xs text-muted-foreground">/api/status · polls every 15 s</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full"
            style={{
              background: dotBg[liveStatus],
              boxShadow: `0 0 6px 2px ${dotBg[liveStatus]}88`,
              animation: liveStatus === "checking"
                ? "wjw-blink 0.35s ease-in-out infinite"
                : "wjw-blink 2.2s ease-in-out infinite",
            }} />
          <StatusIcon className={`w-4 h-4 ${liveStatus === "checking" ? "animate-spin" : ""}`} />
          <span className="text-sm font-semibold capitalize">{liveStatus}</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border rounded-2xl border-border bg-card">
        <div>
          <p className="text-sm font-semibold">Display mode</p>
          <p className="text-xs text-muted-foreground">
            {mode === "demo" ? "Visitors see simulated Online status" : "Visitors see real server status"}
          </p>
        </div>
        <button onClick={toggle}
          className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
          {mode === "live"
            ? <><ToggleRight className="w-8 h-8 text-primary" /> Live</>
            : <><ToggleLeft className="w-8 h-8 text-muted-foreground" /> Demo</>}
        </button>
      </div>
    </div>
  );
}

// ─── 2. Maintenance Mode ──────────────────────────────────────────────────────

function MaintenancePanel() {
  const [on, setOn] = React.useState(() => getFlag(MAINTENANCE_KEY));
  const [msg, setMsg] = React.useState(() => getStr("wjw_maintenance_msg", "Site is temporarily down for maintenance. Check back shortly."));
  const [saved, setSaved] = React.useState(false);

  function save() {
    setFlag(MAINTENANCE_KEY, on);
    setStr("wjw_maintenance_msg", msg);
    window.dispatchEvent(new CustomEvent("wjw:maintenance-change", { detail: { on, msg } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 border rounded-2xl border-border bg-card">
        <div>
          <p className="text-sm font-semibold">Maintenance mode</p>
          <p className="text-xs text-muted-foreground">Replaces site with maintenance message for visitors.</p>
        </div>
        <button onClick={() => setOn(v => !v)}
          className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
          {on
            ? <><ToggleRight className="w-8 h-8 text-destructive" /> On</>
            : <><ToggleLeft className="w-8 h-8 text-muted-foreground" /> Off</>}
        </button>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium">Message shown to visitors</label>
        <textarea
          className="w-full px-3 py-2 text-sm border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none h-20"
          value={msg} onChange={e => setMsg(e.target.value)}
        />
      </div>
      <Button size="sm" onClick={save} className="gap-2">
        {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save</>}
      </Button>
      {on && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-xs text-destructive font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          Maintenance mode is ON — visitors see the maintenance screen.
        </div>
      )}
    </div>
  );
}

// ─── 3. Site Messages ─────────────────────────────────────────────────────────

function SiteMessagesPanel() {
  const [msg, setMsg] = React.useState(() => getStr(SITE_MSG_KEY));
  const [active, setActive] = React.useState(() => getFlag("wjw_site_msg_active"));
  const [type, setType] = React.useState(() => getStr("wjw_site_msg_type", "info"));
  const [saved, setSaved] = React.useState(false);

  function save() {
    setStr(SITE_MSG_KEY, msg);
    setFlag("wjw_site_msg_active", active);
    setStr("wjw_site_msg_type", type);
    window.dispatchEvent(new CustomEvent("wjw:site-message-change"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const previewCls: Record<string, string> = {
    info: "bg-primary/10 text-primary border-primary/30",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
    error: "bg-destructive/10 text-destructive border-destructive/30",
    success: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Site-wide banner</p>
        <button onClick={() => setActive(v => !v)}
          className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors">
          {active
            ? <><ToggleRight className="w-7 h-7 text-primary" /> Active</>
            : <><ToggleLeft className="w-7 h-7 text-muted-foreground" /> Off</>}
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {(["info", "warning", "success", "error"] as const).map(t => (
          <button key={t} onClick={() => setType(t)}
            className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{t}</button>
        ))}
      </div>
      <textarea
        placeholder="Banner message…"
        className="w-full px-3 py-2 text-sm border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none h-16"
        value={msg} onChange={e => setMsg(e.target.value)}
      />
      {msg.trim() && (
        <div className={`px-4 py-2 rounded-xl text-xs font-medium border ${previewCls[type] ?? previewCls.info}`}>
          Preview: {msg}
        </div>
      )}
      <Button size="sm" onClick={save} className="gap-2">
        {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save</>}
      </Button>
    </div>
  );
}

// ─── 4. Now Items ─────────────────────────────────────────────────────────────

const ICON_OPTIONS = ["terminal", "truck", "search", "chat"];

function NowItemsCMS() {
  const [items, setItems] = React.useState<NowItem[]>(getNowItems);
  const [saved, setSaved] = React.useState(false);

  function update(i: number, field: keyof NowItem, val: string) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, [field]: val } : it));
  }
  function add() { setItems(prev => [...prev, { icon: "terminal", text: "" }]); }
  function remove(i: number) { setItems(prev => prev.filter((_, idx) => idx !== i)); }
  function reset() { setItems(DEFAULT_NOW_ITEMS); }

  function save() {
    saveNowItems(items.filter(it => it.text.trim()));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <select
            className="h-8 px-2 text-xs border rounded-md bg-background border-input shrink-0"
            value={item.icon} onChange={e => update(i, "icon", e.target.value)}
          >
            {ICON_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <Input className="h-8 text-xs flex-1" value={item.text}
            onChange={e => update(i, "text", e.target.value)} placeholder="Item text" />
          <button onClick={() => remove(i)}
            className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <div className="flex gap-2 pt-1 flex-wrap">
        <Button size="sm" variant="outline" onClick={add} className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Add item</Button>
        <Button size="sm" variant="ghost" onClick={reset} className="gap-1.5 text-muted-foreground">Reset defaults</Button>
      </div>
      <Button size="sm" onClick={save} className="gap-2 w-full">
        {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save Now Items</>}
      </Button>
    </div>
  );
}

// ─── 5. RSS Feed Config ───────────────────────────────────────────────────────

interface RssUrl { label: string; url: string; active: boolean; }

const DEFAULT_RSS: RssUrl[] = [
  { label: "Hacker News", url: "https://hacker-news.firebaseio.com/v0/topstories.json", active: true },
  { label: "Dev.to", url: "https://dev.to/api/articles?top=1", active: true },
  { label: "My Blog", url: "https://docs.williamjwhite.me/rss.xml", active: true },
];

function RssConfigPanel() {
  const [feeds, setFeeds] = React.useState<RssUrl[]>(() => {
    try {
      const raw = localStorage.getItem(RSS_URLS_KEY);
      return raw ? JSON.parse(raw) : DEFAULT_RSS;
    } catch { return DEFAULT_RSS; }
  });
  const [saved, setSaved] = React.useState(false);

  function update(i: number, field: keyof RssUrl, val: string | boolean) {
    setFeeds(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f));
  }
  function add() { setFeeds(prev => [...prev, { label: "", url: "", active: true }]); }
  function remove(i: number) { setFeeds(prev => prev.filter((_, idx) => idx !== i)); }

  function save() {
    try { localStorage.setItem(RSS_URLS_KEY, JSON.stringify(feeds)); } catch { }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Hacker News and Dev.to are fetched live. Toggle any feed off to hide it from the sidebar.
      </p>
      {feeds.map((feed, i) => (
        <div key={i} className="flex items-center gap-2">
          <input type="checkbox" checked={feed.active}
            onChange={e => update(i, "active", e.target.checked)}
            className="accent-primary shrink-0" />
          <Input className="h-8 text-xs w-24 shrink-0" placeholder="Label"
            value={feed.label} onChange={e => update(i, "label", e.target.value)} />
          <Input className="h-8 text-xs flex-1" placeholder="URL or API endpoint"
            value={feed.url} onChange={e => update(i, "url", e.target.value)} />
          <button onClick={() => remove(i)}
            className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={add} className="gap-1.5">
        <Plus className="w-3.5 h-3.5" /> Add feed
      </Button>
      <Button size="sm" onClick={save} className="gap-2 w-full">
        {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save RSS Config</>}
      </Button>
    </div>
  );
}

// ─── 6. Wizard Section  ────────────────────────────────────────────────────
// WIZARD SECTION. 
<AdminSection
  title="Wizard Builder"
  description="Configure multi-step wizards for Document Submission and Consultation Request"
  icon={<Wand2 className="w-4 h-4" />}
>
  <WizardAdmin />
</AdminSection>


// ─── 6. Client Access List ────────────────────────────────────────────────────

interface ClientRecord {
  id: string;
  name: string;
  email: string;
  company: string;
  role: "client" | "prospect" | "partner";
  active: boolean;
  notes: string;
  added: string; // ISO date
}

function makeId() { return Math.random().toString(36).slice(2, 10); }

function getClients(): ClientRecord[] {
  try {
    const raw = localStorage.getItem(CLIENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveClients(clients: ClientRecord[]) {
  try { localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients)); } catch { }
}

const ROLE_COLORS: Record<string, string> = {
  client: "bg-primary/10 text-primary",
  prospect: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  partner: "bg-green-500/10 text-green-700 dark:text-green-400",
};

function ClientAccessPanel() {
  const [clients, setClients] = React.useState<ClientRecord[]>(getClients);
  const [editing, setEditing] = React.useState<ClientRecord | null>(null);
  const [adding, setAdding] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const blank: ClientRecord = {
    id: makeId(), name: "", email: "", company: "",
    role: "prospect", active: true, notes: "", added: new Date().toISOString().slice(0, 10),
  };

  function persist(updated: ClientRecord[]) {
    saveClients(updated);
    setClients(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function upsert(record: ClientRecord) {
    const existing = clients.find(c => c.id === record.id);
    if (existing) {
      persist(clients.map(c => c.id === record.id ? record : c));
    } else {
      persist([...clients, record]);
    }
    setEditing(null);
    setAdding(false);
  }

  function remove(id: string) {
    if (!confirm("Remove this client?")) return;
    persist(clients.filter(c => c.id !== id));
  }

  function toggleActive(id: string) {
    persist(clients.map(c => c.id === id ? { ...c, active: !c.active } : c));
  }

  const filtered = clients.filter(c =>
    [c.name, c.email, c.company].some(v => v.toLowerCase().includes(search.toLowerCase()))
  );

  // ── Inline form ──
  if (editing || adding) {
    const rec = editing ?? blank;
    return <ClientForm initial={rec} onSave={upsert} onCancel={() => { setEditing(null); setAdding(false); }} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          className="h-8 text-xs flex-1" placeholder="Search clients…"
          value={search} onChange={e => setSearch(e.target.value)}
        />
        <Button size="sm" className="gap-1.5 shrink-0" onClick={() => setAdding(true)}>
          <UserPlus className="w-3.5 h-3.5" /> Add client
        </Button>
      </div>

      {filtered.length === 0 && (
        <p className="text-xs text-muted-foreground italic text-center py-4">
          {clients.length === 0 ? "No clients yet — add your first one above." : "No results."}
        </p>
      )}

      <div className="space-y-2">
        {filtered.map(client => (
          <div key={client.id}
            className={`flex items-start justify-between gap-3 p-3 border rounded-xl transition-colors ${client.active ? "border-border bg-card" : "border-border/50 bg-muted/30 opacity-60"
              }`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold truncate">{client.name || "—"}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${ROLE_COLORS[client.role]}`}>
                  {client.role}
                </span>
                {!client.active && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">Inactive</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{client.email}</p>
              {client.company && (
                <p className="text-xs text-muted-foreground">{client.company}</p>
              )}
              {client.notes && (
                <p className="text-xs text-muted-foreground italic mt-0.5 line-clamp-1">{client.notes}</p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toggleActive(client.id)}
                title={client.active ? "Deactivate" : "Activate"}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {client.active
                  ? <UserCheck className="w-3.5 h-3.5 text-primary" />
                  : <UserMinus className="w-3.5 h-3.5" />}
              </button>
              <a href={`mailto:${client.email}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Email client">
                <Mail className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => setEditing(client)}
                className="text-muted-foreground hover:text-primary transition-colors">
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(client.id)}
                className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {clients.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {clients.filter(c => c.active).length} active · {clients.length} total
          {saved && <span className="ml-2 text-primary">✓ saved</span>}
        </p>
      )}
    </div>
  );
}

function ClientForm({
  initial, onSave, onCancel,
}: {
  initial: ClientRecord;
  onSave: (r: ClientRecord) => void;
  onCancel: () => void;
}) {
  const [rec, setRec] = React.useState<ClientRecord>(initial);

  function set(field: keyof ClientRecord, val: string | boolean) {
    setRec(prev => ({ ...prev, [field]: val }));
  }

  return (
    <div className="space-y-3 p-4 border rounded-xl border-border bg-muted/30">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {initial.name ? `Editing: ${initial.name}` : "New Client"}
        </span>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Input className="h-8 text-xs" placeholder="Full name *" value={rec.name}
          onChange={e => set("name", e.target.value)} />
        <Input className="h-8 text-xs" placeholder="Email *" value={rec.email}
          onChange={e => set("email", e.target.value)} type="email" />
      </div>

      <Input className="h-8 text-xs" placeholder="Company (optional)" value={rec.company}
        onChange={e => set("company", e.target.value)} />

      <div className="flex gap-2">
        <select
          className="h-8 flex-1 px-2 text-xs border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring"
          value={rec.role}
          onChange={e => set("role", e.target.value)}
        >
          <option value="prospect">Prospect</option>
          <option value="client">Client</option>
          <option value="partner">Partner</option>
        </select>

        <label className="flex items-center gap-2 text-xs cursor-pointer">
          <input type="checkbox" checked={rec.active}
            onChange={e => set("active", e.target.checked)}
            className="accent-primary" />
          Active
        </label>
      </div>

      <textarea
        className="w-full px-3 py-1.5 text-xs border rounded-md bg-background border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none h-16"
        placeholder="Notes (optional)"
        value={rec.notes} onChange={e => set("notes", e.target.value)}
      />

      <div className="flex gap-2">
        <Button size="sm" onClick={() => onSave(rec)}
          disabled={!rec.name.trim() || !rec.email.trim()}
          className="flex-1 gap-1.5">
          <Save className="w-3.5 h-3.5" /> Save Client
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  );
}

// ─── 7. Content Preview ───────────────────────────────────────────────────────

function ContentPreview() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 text-sm">
      {[
        { label: "Portfolio home", href: "/" },
        { label: "About tab", href: "/?tab=about" },
        { label: "Projects tab", href: "/?tab=projects" },
        { label: "Docs tab", href: "/?tab=docs" },
        { label: "Connect tab", href: "/?tab=connect" },
        { label: "Case Study tab", href: "/?tab=case-study" },
        { label: "Services tab", href: "/?tab=services" },
        { label: "AI tab", href: "/?tab=ai" },
      ].map(({ label, href }) => (
        <a key={href} href={href} target="_blank" rel="noreferrer noopener"
          className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl border border-border hover:bg-muted transition-colors">
          <Eye className="w-3.5 h-3.5 text-primary" /> {label}
        </a>
      ))}
    </div>
  );
}

// ─── 8. API Config ────────────────────────────────────────────────────────────

function ApiConfigPanel() {
  const fields = [
    { label: "Status endpoint", key: "wjw_api_status", placeholder: "/api/status" },
    { label: "Chat endpoint", key: "wjw_api_chat", placeholder: "/api/chat" },
    { label: "Client login endpoint", key: "wjw_api_login", placeholder: "/api/client/login" },
    { label: "Doc submission endpoint", key: "wjw_api_docs", placeholder: "/api/documents/submit" },
    { label: "Consultation endpoint", key: "wjw_api_consult", placeholder: "https://formspree.io/f/YOUR_ID" },
    { label: "Docs site URL", key: "wjw_docs_url", placeholder: "https://docs.williamjwhite.me" },
  ];

  const [vals, setVals] = React.useState<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    fields.forEach(f => { out[f.key] = getStr(f.key); });
    return out;
  });
  const [saved, setSaved] = React.useState(false);

  function save() {
    fields.forEach(f => setStr(f.key, vals[f.key] ?? ""));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-3">
      {fields.map(f => (
        <div key={f.key} className="space-y-1">
          <label className="text-xs font-medium">{f.label}</label>
          <Input className="h-8 text-xs" placeholder={f.placeholder}
            value={vals[f.key] ?? ""}
            onChange={e => setVals(prev => ({ ...prev, [f.key]: e.target.value }))} />
        </div>
      ))}
      <Button size="sm" onClick={save} className="gap-2 w-full">
        {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save API Config</>}
      </Button>
    </div>
  );
}

// ─── Quick links ──────────────────────────────────────────────────────────────

function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="w-4 h-4" /> Quick Links
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {[
          { icon: <Globe className="w-4 h-4" />, label: "Portfolio", href: "/" },
          { icon: <FileText className="w-4 h-4" />, label: "Docs site", href: "https://docs.williamjwhite.me" },
          { icon: <Rss className="w-4 h-4" />, label: "RSS feed", href: "/rss.xml" },
          { icon: <Bot className="w-4 h-4" />, label: "AI chat API", href: "/api/chat" },
          { icon: <Users className="w-4 h-4" />, label: "Client portal", href: "/client/dashboard" },
          { icon: <Database className="w-4 h-4" />, label: "DB admin API", href: "/api/admin/db" },
        ].map(({ icon, label, href }) => (
          <a key={href} href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-xl border border-border hover:bg-muted transition-colors">
            <span className="text-primary">{icon}</span> {label}
          </a>
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────

export function AdminPage() {
  const { authed, login, logout } = useAdminAuth();
  const maintenanceOn = getFlag(MAINTENANCE_KEY);

  const [showEmailPreview, setShowEmailPreview] = React.useState(false);
  const [emailPreviewUrl, setEmailPreviewUrl] = React.useState("http://localhost:3001");

  if (!authed) return <PinGate onLogin={login} />;

  const clientCount = getClients().filter(c => c.active).length;


  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="flex items-center justify-between max-w-5xl px-4 py-3 mx-auto">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to site
            </a>
            <Separator orientation="vertical" className="h-4" />
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Shield className="w-4 h-4 text-primary" /> Admin
              {maintenanceOn && (
                <Badge variant="destructive" className="text-xs">Maintenance ON</Badge>
              )}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout} className="gap-1.5 text-muted-foreground">
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl px-4 py-8 mx-auto space-y-6">

        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile icon={<Gauge className="w-4 h-4" />} label="Server mode" value={getServerMode() === "demo" ? "Demo" : "Live"} sub="Toggle below" accent />
          <StatTile icon={<Wrench className="w-4 h-4" />} label="Maintenance" value={maintenanceOn ? "ON" : "Off"} sub="Visitor-facing" accent={maintenanceOn} />
          <StatTile icon={<Users className="w-4 h-4" />} label="Active clients" value={String(clientCount)} sub="In access list" />
          <StatTile icon={<Cloud className="w-4 h-4" />} label="Endpoint" value="/api/status" sub="15 s poll" />
        </div>

        {/* Two-col layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">

            <AdminSection title="Server Status" description="Live/Demo mode and endpoint health" icon={<Server className="w-4 h-4" />} defaultOpen>
              <ServerModePanel />
            </AdminSection>

            <AdminSection title="Maintenance Mode" description="Take the site offline for visitors" icon={<Wrench className="w-4 h-4" />}>
              <MaintenancePanel />
            </AdminSection>

            <AdminSection title="Site Messages" description="Banner alerts shown to all visitors" icon={<AlertTriangle className="w-4 h-4" />}>
              <SiteMessagesPanel />
            </AdminSection>

            <AdminSection title="Now Items" description="Edit the 5 bullets in the About tab" icon={<Edit3 className="w-4 h-4" />}>
              <NowItemsCMS />
            </AdminSection>

            <AdminSection title="RSS Feeds" description="Configure Hacker News, Dev.to, and custom feeds" icon={<Rss className="w-4 h-4" />}>
              <RssConfigPanel />
            </AdminSection>

            <AdminSection
              title="Client Access List"
              description="Manage clients, prospects, and partners"
              icon={<Users className="w-4 h-4" />}
              badge={clientCount > 0
                ? <Badge variant="secondary" className="text-xs">{clientCount} active</Badge>
                : undefined}
            >
              <ClientAccessPanel />
            </AdminSection>

            <AdminSection title="Content Preview" description="Open site sections in a new tab" icon={<Eye className="w-4 h-4" />}>
              <ContentPreview />
            </AdminSection>

            <AdminSection title="API & Endpoints" description="Endpoints, form IDs, docs URL" icon={<Settings className="w-4 h-4" />}>
              <ApiConfigPanel />
            </AdminSection>

            <AdminSection title="Email Templates" description="Preview React Email templates locally" icon={<Mail className="w-4 h-4" />}>
              <EmailTemplatesPanel
                showPreview={showEmailPreview}
                previewUrl={emailPreviewUrl}
                onUrlChange={setEmailPreviewUrl}
                onLoad={() => setShowEmailPreview(true)}
              />
            </AdminSection>

          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <QuickLinks />
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full text-xs border rounded-md bg-background border-input px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring resize-none h-48"
                  placeholder="Admin scratch pad…"
                  onChange={e => setStr("wjw_admin_notes", e.target.value)}
                  defaultValue={getStr("wjw_admin_notes")}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground pb-4">
          williamjwhite.me admin · session auth · changes persist via localStorage
        </p>
      </main>
    </div>
  );
}
