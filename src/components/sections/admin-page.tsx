import * as React from "react";
import { WizardAdmin } from "@/components/sections/wizard-admin";
import { Wand2 } from "lucide-react";
import {
  Activity, AlertTriangle, ArrowLeft, Bot, CheckCircle, ChevronDown, ChevronUp,
  Cloud, Database, Edit3, ExternalLink, Eye, EyeOff, FileText, Gauge, Globe, HardDrive,
  Link, Loader2, LogOut, Mail, MousePointerClick, Plus, RotateCcw, Rss,
  Save, Server, Settings, Shield, ToggleLeft, ToggleRight, Trash2, Type,
  UserCheck, UserMinus, UserPlus, Users, Wifi, WifiOff, Wrench, X,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

// ─── Storage Engine ───────────────────────────────────────────────────────────

export type StorageBackend = "local" | "gist" | "cloudflare" | "firestore" | "gdrive";

interface StorageConfig {
  backend: StorageBackend;
  gistId?: string; gistToken?: string;
  cfWorkerUrl?: string; cfWorkerToken?: string;
  fsProjectId?: string; fsApiKey?: string; fsCollection?: string; fsDocId?: string;
  gdApiKey?: string; gdFileId?: string;
}

const STORAGE_CONFIG_KEY = "wjw_storage_config";
const SETTINGS_PAYLOAD_KEY = "wjw_settings_payload";

function getStorageConfig(): StorageConfig {
  try {
    const stored = localStorage.getItem(STORAGE_CONFIG_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}

  if (import.meta.env.VITE_GIST_ID && import.meta.env.VITE_GIST_TOKEN) {
    return {
      backend:    "gist",
      gistId:     import.meta.env.VITE_GIST_ID,
      gistToken:  import.meta.env.VITE_GIST_TOKEN,
    };
  }

  return { backend: "local" };
}

function saveStorageConfig(cfg: StorageConfig) {
  try { localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(cfg)); } catch {}
}

const GIST_FILENAME = "wjw-settings.json";
async function gistLoad(cfg: StorageConfig): Promise<Record<string, unknown>> {
  const res = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
    headers: { Authorization: `Bearer ${cfg.gistToken}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`Gist fetch failed: ${res.status}`);
  const data = await res.json();
  const content = data.files?.[GIST_FILENAME]?.content;
  return content ? JSON.parse(content) : {};
}
async function gistSave(cfg: StorageConfig, payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(`https://api.github.com/gists/${cfg.gistId}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${cfg.gistToken}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ files: { [GIST_FILENAME]: { content: JSON.stringify(payload, null, 2) } } }),
  });
  if (!res.ok) throw new Error(`Gist save failed: ${res.status}`);
}

async function cfLoad(cfg: StorageConfig): Promise<Record<string, unknown>> {
  const res = await fetch(`${cfg.cfWorkerUrl}/settings`, { headers: { Authorization: `Bearer ${cfg.cfWorkerToken}` } });
  if (!res.ok) throw new Error(`CF fetch failed: ${res.status}`);
  const data = await res.json();
  return data.value ? JSON.parse(data.value) : {};
}
async function cfSave(cfg: StorageConfig, payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${cfg.cfWorkerUrl}/settings`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${cfg.cfWorkerToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({ value: JSON.stringify(payload) }),
  });
  if (!res.ok) throw new Error(`CF save failed: ${res.status}`);
}

function fsUrl(cfg: StorageConfig) {
  return `https://firestore.googleapis.com/v1/projects/${cfg.fsProjectId}/databases/(default)/documents/${cfg.fsCollection}/${cfg.fsDocId}?key=${cfg.fsApiKey}`;
}
async function fsLoad(cfg: StorageConfig): Promise<Record<string, unknown>> {
  const res = await fetch(fsUrl(cfg));
  if (res.status === 404) return {};
  if (!res.ok) throw new Error(`Firestore fetch failed: ${res.status}`);
  const data = await res.json();
  const raw = data.fields?.payload?.stringValue;
  return raw ? JSON.parse(raw) : {};
}
async function fsSave(cfg: StorageConfig, payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(`${fsUrl(cfg)}&updateMask.fieldPaths=payload`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields: { payload: { stringValue: JSON.stringify(payload) } } }),
  });
  if (!res.ok) throw new Error(`Firestore save failed: ${res.status}`);
}

async function gdriveLoad(cfg: StorageConfig): Promise<Record<string, unknown>> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${cfg.gdFileId}?alt=media&key=${cfg.gdApiKey}`,
    { headers: { Authorization: `Bearer ${cfg.gdApiKey}` } });
  if (!res.ok) throw new Error(`Drive fetch failed: ${res.status}`);
  return res.json();
}
async function gdriveSave(cfg: StorageConfig, payload: Record<string, unknown>): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${cfg.gdFileId}?uploadType=media&key=${cfg.gdApiKey}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.gdApiKey}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Drive save failed: ${res.status}`);
}

export async function storageLoad(): Promise<Record<string, unknown>> {
  const cfg = getStorageConfig();
  const localCache = (() => {
    try { const r = localStorage.getItem(SETTINGS_PAYLOAD_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
  })();
  if (cfg.backend === "local") return localCache;
  try {
    let remote: Record<string, unknown> = {};
    if (cfg.backend === "gist")       remote = await gistLoad(cfg);
    if (cfg.backend === "cloudflare") remote = await cfLoad(cfg);
    if (cfg.backend === "firestore")  remote = await fsLoad(cfg);
    if (cfg.backend === "gdrive")     remote = await gdriveLoad(cfg);
    localStorage.setItem(SETTINGS_PAYLOAD_KEY, JSON.stringify(remote));
    return remote;
  } catch (e) {
    console.warn("[storage] remote load failed, using local cache:", e);
    return localCache;
  }
}

export async function storageSave(key: string, value: unknown): Promise<void> {
  let payload: Record<string, unknown> = {};
  try { const r = localStorage.getItem(SETTINGS_PAYLOAD_KEY); payload = r ? JSON.parse(r) : {}; } catch {}
  payload[key] = value;
  try { localStorage.setItem(SETTINGS_PAYLOAD_KEY, JSON.stringify(payload)); } catch {}
  const cfg = getStorageConfig();
  if (cfg.backend === "local") return;
  try {
    if (cfg.backend === "gist")       await gistSave(cfg, payload);
    if (cfg.backend === "cloudflare") await cfSave(cfg, payload);
    if (cfg.backend === "firestore")  await fsSave(cfg, payload);
    if (cfg.backend === "gdrive")     await gdriveSave(cfg, payload);
  } catch (e) {
    console.warn("[storage] remote save failed (local cache updated):", e);
    throw e;
  }
}

// ── StoragePanel ──────────────────────────────────────────────────────────────

const BACKEND_META: Record<StorageBackend, { label: string; icon: React.ReactNode; color: string; tagline: string }> = {
  local:      { label: "Local Storage",         icon: <HardDrive className="w-4 h-4" />, color: "text-muted-foreground", tagline: "Browser-only · no setup · resets per device" },
  gist:       { label: "GitHub Gist",           icon: <Database className="w-4 h-4" />,  color: "text-primary",          tagline: "Private JSON file · GitHub PAT · recommended for GitHub Pages" },
  cloudflare: { label: "Cloudflare Workers KV", icon: <Cloud className="w-4 h-4" />,     color: "text-orange-400",       tagline: "Free KV store · tiny Worker needed · very fast" },
  firestore:  { label: "Firebase Firestore",    icon: <Database className="w-4 h-4" />,  color: "text-yellow-400",       tagline: "Free tier · real-time · no server needed" },
  gdrive:     { label: "Google Drive",          icon: <Globe className="w-4 h-4" />,      color: "text-green-400",        tagline: "JSON file in your Drive · OAuth token required" },
};

function SetupStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-2.5 text-xs text-muted-foreground">
      <span className="shrink-0 w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">{n}</span>
      <span className="pt-0.5">{children}</span>
    </div>
  );
}

function CodeSnip({ children }: { children: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="relative group mt-1">
      <pre className="text-[10px] bg-muted rounded-lg px-3 py-2 overflow-x-auto text-muted-foreground leading-relaxed whitespace-pre-wrap">{children}</pre>
      <button
        onClick={() => { navigator.clipboard.writeText(children); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="absolute top-1.5 right-1.5 text-[10px] px-1.5 py-0.5 rounded bg-background border border-border text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >{copied ? "✓" : "copy"}</button>
    </div>
  );
}

function StoragePanel() {
  const [cfg, setCfg] = React.useState<StorageConfig>(getStorageConfig);
  const [status, setStatus] = React.useState<"idle" | "testing" | "ok" | "error">("idle");
  const [statusMsg, setStatusMsg] = React.useState("");
  const [saved, setSaved] = React.useState(false);

  function update(patch: Partial<StorageConfig>) { setCfg(prev => ({ ...prev, ...patch })); setStatus("idle"); }
  function handleBackendChange(b: StorageBackend) { update({ backend: b }); }

  async function testConnection() {
    setStatus("testing"); setStatusMsg("");
    try { await storageLoad(); setStatus("ok"); setStatusMsg("Connection successful ✓"); }
    catch (e: unknown) { setStatus("error"); setStatusMsg(e instanceof Error ? e.message : "Connection failed"); }
  }

  function save() { saveStorageConfig(cfg); setSaved(true); setTimeout(() => setSaved(false), 2000); }

  const b = cfg.backend;

  return (
    <div className="space-y-5">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(BACKEND_META) as StorageBackend[]).map(key => {
          const m = BACKEND_META[key];
          const active = b === key;
          return (
            <button key={key} onClick={() => handleBackendChange(key)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${active ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/50"}`}>
              <span className={`mt-0.5 shrink-0 ${active ? "text-primary" : m.color}`}>{m.icon}</span>
              <div>
                <p className={`text-xs font-semibold ${active ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</p>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{m.tagline}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Separator />

      {b === "local" && (
        <div className="rounded-xl bg-muted/40 border border-border p-3 text-xs text-muted-foreground space-y-1.5">
          <p className="font-medium text-foreground">About Local Storage</p>
          <p>Settings are stored in this browser only. No setup required — this is the default.</p>
          <p className="text-amber-400">⚠ Changes made on one machine won't sync to another.</p>
        </div>
      )}

      {b === "gist" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Setup Instructions</p>
            <SetupStep n={1}>
              Go to{" "}
              <a href="https://gist.github.com" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-0.5">
                gist.github.com <ExternalLink className="w-3 h-3" />
              </a>{" "}
              and create a <strong>secret</strong> Gist with one file named exactly:
              <CodeSnip>{"wjw-settings.json"}</CodeSnip>
              Paste <code className="bg-muted px-1 rounded text-[10px]">{"{}"}</code> as the content and save.
            </SetupStep>
            <SetupStep n={2}>
              Copy the Gist ID from the URL — the long hash after your username:
              <CodeSnip>{"https://gist.github.com/yourname/<GIST_ID>"}</CodeSnip>
            </SetupStep>
            <SetupStep n={3}>
              Go to{" "}
              <a href="https://github.com/settings/tokens/new" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-0.5">
                GitHub → Settings → Developer settings → Personal access tokens (classic) <ExternalLink className="w-3 h-3" />
              </a>. Create a token with <strong>only the <code className="bg-muted px-1 rounded text-[10px]">gist</code> scope</strong>. Copy it.
            </SetupStep>
            <SetupStep n={4}>
              Optionally add to <code className="bg-muted px-1 rounded text-[10px]">.env.local</code> so they pre-fill on rebuild:
              <CodeSnip>{"VITE_GIST_ID=your_gist_id_here\nVITE_GIST_TOKEN=ghp_your_token_here"}</CodeSnip>
            </SetupStep>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Gist ID</Label>
              <Input className="h-8 text-xs font-mono"
                placeholder={import.meta.env.VITE_GIST_ID ?? "abc123def456..."}
                value={cfg.gistId ?? import.meta.env.VITE_GIST_ID ?? ""}
                onChange={e => update({ gistId: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Personal Access Token (gist scope only)</Label>
              <Input className="h-8 text-xs font-mono" type="password"
                placeholder={import.meta.env.VITE_GIST_TOKEN ? "loaded from .env" : "ghp_..."}
                value={cfg.gistToken ?? import.meta.env.VITE_GIST_TOKEN ?? ""}
                onChange={e => update({ gistToken: e.target.value })} />
            </div>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-400 space-y-1">
            <p className="font-semibold">Security note</p>
            <p>The token is stored in localStorage. This is acceptable for a personal admin panel behind a PIN — the token only has <code className="bg-amber-500/10 rounded px-1">gist</code> scope and cannot touch your repos.</p>
          </div>
        </div>
      )}

      {b === "cloudflare" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Setup Instructions</p>
            <SetupStep n={1}>
              Create a free{" "}
              <a href="https://dash.cloudflare.com" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-0.5">
                Cloudflare account <ExternalLink className="w-3 h-3" />
              </a>, then go to <strong>Workers & Pages → KV</strong> and create a namespace called <code className="bg-muted px-1 rounded text-[10px]">WJW_SETTINGS</code>.
            </SetupStep>
            <SetupStep n={2}>
              Create a new Worker and paste this script:
              <CodeSnip>{`// wjw-settings-worker.js
const TOKEN = "your-secret-token"; // change this
const KV_KEY = "settings";

export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
      "Access-Control-Allow-Headers": "Authorization,Content-Type",
    };
    if (req.method === "OPTIONS")
      return new Response(null, { headers: cors });
    if (req.headers.get("Authorization") !== \`Bearer \${TOKEN}\`)
      return new Response("Unauthorized", { status: 401, headers: cors });
    if (req.method === "GET") {
      const value = await env.WJW_SETTINGS.get(KV_KEY) ?? "{}";
      return Response.json({ value }, { headers: cors });
    }
    if (req.method === "PUT") {
      const { value } = await req.json();
      await env.WJW_SETTINGS.put(KV_KEY, value);
      return Response.json({ ok: true }, { headers: cors });
    }
    return new Response("Method not allowed", { status: 405, headers: cors });
  },
};`}</CodeSnip>
            </SetupStep>
            <SetupStep n={3}>
              In the Worker's settings, bind the KV namespace: variable name <code className="bg-muted px-1 rounded text-[10px]">WJW_SETTINGS</code> → your namespace. Deploy and copy the Worker URL.
            </SetupStep>
            <SetupStep n={4}>Choose a secret token and paste it in the Worker AND the field below.</SetupStep>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Worker URL</Label>
              <Input className="h-8 text-xs font-mono" placeholder="https://wjw-settings.yourname.workers.dev"
                value={cfg.cfWorkerUrl ?? ""} onChange={e => update({ cfWorkerUrl: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Bearer Token</Label>
              <Input className="h-8 text-xs font-mono" type="password" placeholder="your-secret-token"
                value={cfg.cfWorkerToken ?? ""} onChange={e => update({ cfWorkerToken: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {b === "firestore" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Setup Instructions</p>
            <SetupStep n={1}>
              Go to the{" "}
              <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-0.5">
                Firebase Console <ExternalLink className="w-3 h-3" />
              </a>{" "}
              → create a project (free Spark plan) → <strong>Firestore Database → Create database</strong> in production mode.
            </SetupStep>
            <SetupStep n={2}>
              Set Firestore security rules:
              <CodeSnip>{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wjw-admin/{docId} {
      allow read, write: if true; // PIN-gated by your app
    }
  }
}`}</CodeSnip>
            </SetupStep>
            <SetupStep n={3}>
              Go to <strong>Project Settings → General</strong> and copy your <strong>Project ID</strong> and <strong>Web API key</strong>.
            </SetupStep>
            <SetupStep n={4}>Use collection <code className="bg-muted px-1 rounded text-[10px]">wjw-admin</code> and document <code className="bg-muted px-1 rounded text-[10px]">settings</code> (or customise below).</SetupStep>
          </div>
          <Separator />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">Project ID</Label>
              <Input className="h-8 text-xs font-mono" placeholder="your-project-id"
                value={cfg.fsProjectId ?? ""} onChange={e => update({ fsProjectId: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Web API Key</Label>
              <Input className="h-8 text-xs font-mono" type="password" placeholder="AIzaSy..."
                value={cfg.fsApiKey ?? ""} onChange={e => update({ fsApiKey: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Collection</Label>
              <Input className="h-8 text-xs font-mono" placeholder="wjw-admin"
                value={cfg.fsCollection ?? "wjw-admin"} onChange={e => update({ fsCollection: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Document ID</Label>
              <Input className="h-8 text-xs font-mono" placeholder="settings"
                value={cfg.fsDocId ?? "settings"} onChange={e => update({ fsDocId: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      {b === "gdrive" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Setup Instructions</p>
            <SetupStep n={1}>
              Go to{" "}
              <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-primary underline inline-flex items-center gap-0.5">
                Google Cloud Console <ExternalLink className="w-3 h-3" />
              </a>{" "}
              → create a project → enable the <strong>Google Drive API</strong>.
            </SetupStep>
            <SetupStep n={2}>
              Go to <strong>APIs & Services → Credentials → Create credentials → API key</strong>. Restrict it to the Drive API only.
            </SetupStep>
            <SetupStep n={3}>
              Create a JSON file in your Google Drive named <code className="bg-muted px-1 rounded text-[10px]">wjw-settings.json</code> with content <code className="bg-muted px-1 rounded text-[10px]">{"{}"}</code>. Make it accessible via link.
            </SetupStep>
            <SetupStep n={4}>
              Get the File ID from its share URL:
              <CodeSnip>{"https://drive.google.com/file/d/<FILE_ID>/view"}</CodeSnip>
            </SetupStep>
            <SetupStep n={5}>
              <strong>Important:</strong> Drive write access requires a short-lived OAuth2 token (~1 hour). For a static site, consider <strong>Gist</strong> or <strong>Firestore</strong> instead — they're simpler to maintain.
            </SetupStep>
          </div>
          <Separator />
          <div className="grid gap-2">
            <div className="space-y-1">
              <Label className="text-xs">API Key</Label>
              <Input className="h-8 text-xs font-mono" type="password" placeholder="AIzaSy..."
                value={cfg.gdApiKey ?? ""} onChange={e => update({ gdApiKey: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">File ID</Label>
              <Input className="h-8 text-xs font-mono" placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                value={cfg.gdFileId ?? ""} onChange={e => update({ gdFileId: e.target.value })} />
            </div>
          </div>
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-400">
            <p className="font-semibold mb-1">⚠ Limitation</p>
            <p>Drive write access requires a short-lived OAuth2 token that expires in ~1 hour. GitHub Gist or Firestore are more practical for a persistent static admin panel.</p>
          </div>
        </div>
      )}

      <Separator />
      <div className="flex items-center gap-3 flex-wrap">
        <Button size="sm" variant="outline" onClick={testConnection} disabled={status === "testing"} className="gap-1.5">
          {status === "testing"
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing…</>
            : <><Link className="w-3.5 h-3.5" /> Test Connection</>}
        </Button>
        <Button size="sm" onClick={save} className="gap-1.5">
          {saved ? <><CheckCircle className="w-3.5 h-3.5" /> Saved</> : <><Save className="w-3.5 h-3.5" /> Save Config</>}
        </Button>
        {status === "ok"    && <span className="text-xs text-green-400">{statusMsg}</span>}
        {status === "error" && <span className="text-xs text-destructive">{statusMsg}</span>}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        <span>Active backend:</span>
        <Badge variant="outline" className="text-[10px] gap-1">
          {BACKEND_META[getStorageConfig().backend].icon}
          {BACKEND_META[getStorageConfig().backend].label}
        </Badge>
      </div>
    </div>
  );
}

// ─── Typography Settings ──────────────────────────────────────────────────────

const TYPO_STORAGE_KEY = "wjw-typography";

const FONT_STACKS: Record<string, { label: string; value: string }> = {
  system:      { label: "System UI (default)", value: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif' },
  inter:       { label: "Inter",               value: '"Inter", ui-sans-serif, system-ui, sans-serif' },
  geist:       { label: "Geist",               value: '"Geist", ui-sans-serif, system-ui, sans-serif' },
  manrope:     { label: "Manrope",             value: '"Manrope", ui-sans-serif, system-ui, sans-serif' },
  plusJakarta: { label: "Plus Jakarta Sans",   value: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif' },
  dmSans:      { label: "DM Sans",             value: '"DM Sans", ui-sans-serif, system-ui, sans-serif' },
  nunito:      { label: "Nunito",              value: '"Nunito", ui-sans-serif, system-ui, sans-serif' },
  raleway:     { label: "Raleway",             value: '"Raleway", ui-sans-serif, system-ui, sans-serif' },
  outfit:      { label: "Outfit",              value: '"Outfit", ui-sans-serif, system-ui, sans-serif' },
  serif:       { label: "Georgia (serif)",     value: "ui-serif, Georgia, Cambria, serif" },
  playfair:    { label: "Playfair Display",    value: '"Playfair Display", ui-serif, Georgia, serif' },
  mono:        { label: "Monospace",           value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace' },
  firaCode:    { label: "Fira Code",           value: '"Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace' },
  jetbrains:   { label: "JetBrains Mono",      value: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace' },
};

interface TypoEl {
  id: string; label: string; desc: string;
  sizeVar: string; fontVar: string;
  defaultSize: number; defaultFont: string;
  min: number; max: number; step: number;
  sample: string;
}

const TYPO_ELEMENTS: TypoEl[] = [
  { id: "body",  label: "Body",             desc: "Base paragraph text",          sizeVar: "--font-size-body",  fontVar: "--font-body",  defaultSize: 100, defaultFont: "system", min: 75,  max: 130, step: 5,  sample: "The quick brown fox jumps over the lazy dog." },
  { id: "h1",   label: "H1 — Page Title",  desc: "Hero / largest heading",        sizeVar: "--font-size-h1",   fontVar: "--font-h1",   defaultSize: 300, defaultFont: "system", min: 200, max: 500, step: 10, sample: "Page Title" },
  { id: "h2",   label: "H2 — Section",     desc: "Section-level headings",        sizeVar: "--font-size-h2",   fontVar: "--font-h2",   defaultSize: 225, defaultFont: "system", min: 150, max: 350, step: 10, sample: "Section Heading" },
  { id: "h3",   label: "H3 — Sub Heading", desc: "Card titles, sub-sections",     sizeVar: "--font-size-h3",   fontVar: "--font-h3",   defaultSize: 175, defaultFont: "system", min: 125, max: 275, step: 10, sample: "Sub Heading" },
  { id: "h4",   label: "H4 — Minor",       desc: "Labels, sidebar headings",      sizeVar: "--font-size-h4",   fontVar: "--font-h4",   defaultSize: 125, defaultFont: "system", min: 100, max: 200, step: 5,  sample: "Minor Heading" },
  { id: "small",label: "Small / Caption",  desc: "Helper text, timestamps",       sizeVar: "--font-size-small",fontVar: "--font-small",defaultSize: 85,  defaultFont: "system", min: 65,  max: 110, step: 5,  sample: "Caption · helper text · timestamp" },
  { id: "link", label: "Links",            desc: "Anchor / hyperlink text",       sizeVar: "--font-size-link", fontVar: "--font-link", defaultSize: 100, defaultFont: "system", min: 75,  max: 130, step: 5,  sample: "Click here → visit page" },
  { id: "label",label: "Labels / UI",      desc: "Form labels, nav items",        sizeVar: "--font-size-label",fontVar: "--font-label",defaultSize: 90,  defaultFont: "system", min: 70,  max: 115, step: 5,  sample: "Form Label · Nav Item · Badge" },
  { id: "code", label: "Code / Mono",      desc: "Inline code, code blocks",      sizeVar: "--font-size-code", fontVar: "--font-code", defaultSize: 90,  defaultFont: "mono",   min: 70,  max: 115, step: 5,  sample: "const x = fn(arg) => result;" },
  { id: "muted",label: "Muted / Subtext",  desc: "Secondary descriptions",        sizeVar: "--font-size-muted",fontVar: "--font-muted",defaultSize: 90,  defaultFont: "system", min: 70,  max: 115, step: 5,  sample: "Subtitle · description · secondary info" },
];

type TypoState = Record<string, { size: number; font: string }>;

function loadTypoFromStorage(): TypoState {
  try { const r = localStorage.getItem(TYPO_STORAGE_KEY); return r ? JSON.parse(r) : {}; } catch { return {}; }
}

function TypographyPanel() {
  const [values, setValues] = React.useState<TypoState>(() => {
    const stored = loadTypoFromStorage();
    const init: TypoState = {};
    TYPO_ELEMENTS.forEach(el => { init[el.id] = stored[el.id] ?? { size: el.defaultSize, font: el.defaultFont }; });
    return init;
  });

  React.useEffect(() => {
    TYPO_ELEMENTS.forEach(el => {
      const v = values[el.id];
      document.documentElement.style.setProperty(el.sizeVar, `${(v.size / 100).toFixed(2)}rem`);
      document.documentElement.style.setProperty(el.fontVar, FONT_STACKS[v.font]?.value ?? FONT_STACKS.system.value);
    });
    storageSave(TYPO_STORAGE_KEY, values).catch(() => {});
  }, [values]);

  function setSize(id: string, size: number) { setValues(p => ({ ...p, [id]: { ...p[id], size } })); }
  function setFont(id: string, font: string) { setValues(p => ({ ...p, [id]: { ...p[id], font } })); }
  function resetOne(id: string) {
    const el = TYPO_ELEMENTS.find(e => e.id === id)!;
    setValues(p => ({ ...p, [id]: { size: el.defaultSize, font: el.defaultFont } }));
  }
  function resetAll() {
    const d: TypoState = {};
    TYPO_ELEMENTS.forEach(el => { d[el.id] = { size: el.defaultSize, font: el.defaultFont }; });
    setValues(d);
  }

  const isDirty = TYPO_ELEMENTS.some(el => {
    const v = values[el.id];
    return v.size !== el.defaultSize || v.font !== el.defaultFont;
  });

  return (
    <div className="space-y-1">
      {isDirty && (
        <div className="flex justify-end mb-2">
          <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1.5 text-xs text-muted-foreground">
            <RotateCcw className="w-3 h-3" /> Reset all
          </Button>
        </div>
      )}

      {TYPO_ELEMENTS.map((el, idx) => {
        const v = values[el.id];
        const changed = v.size !== el.defaultSize || v.font !== el.defaultFont;
        const fontLabel = Object.entries(FONT_STACKS).find(([k]) => k === v.font)?.[1].label ?? v.font;

        return (
          <div key={el.id}>
            {idx > 0 && <Separator className="my-4" />}
            <div className="space-y-2">
              {/* Row header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium">{el.label}</span>
                  {changed && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">modified</Badge>}
                  <span className="text-xs text-muted-foreground">— {el.desc}</span>
                </div>
                {changed && (
                  <button onClick={() => resetOne(el.id)} title={`Reset ${el.label}`}
                    className="text-muted-foreground hover:text-foreground transition-colors ml-2 shrink-0">
                    <RotateCcw className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Live preview */}
              <div className="rounded-xl border border-dashed border-border px-3 py-2 text-muted-foreground truncate"
                style={{ fontSize: `${v.size / 100}rem`, fontFamily: FONT_STACKS[v.font]?.value }}>
                {el.sample}
              </div>

              {/* Size slider */}
              <div className="flex items-center gap-3">
                <Label className="text-xs w-20 shrink-0 text-muted-foreground">
                  Size: {(v.size / 100).toFixed(2)}rem
                </Label>
                <Slider min={el.min} max={el.max} step={el.step} value={[v.size]}
                  onValueChange={([val]) => setSize(el.id, val)} className="flex-1" />
                <span className="text-xs text-muted-foreground w-16 text-right">
                  {el.min / 100}–{el.max / 100}rem
                </span>
              </div>

              {/* Font family */}
              <div className="flex items-center gap-3">
                <Label className="text-xs w-20 shrink-0 text-muted-foreground">Family</Label>
                <Select value={v.font} onValueChange={val => setFont(el.id, val)}>
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue>{fontLabel}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FONT_STACKS).map(([key, { label }]) => (
                      <SelectItem key={key} value={key} className="text-xs">{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      })}

      {/* CSS export snippet */}
      <Separator className="mt-6 mb-3" />
      <p className="text-xs text-muted-foreground font-medium">Copy to :root in index.css to make permanent</p>
      <pre className="text-[10px] leading-relaxed text-muted-foreground bg-muted rounded-xl p-3 overflow-x-auto">
        {TYPO_ELEMENTS.map(el => {
          const v = values[el.id];
          return `${el.sizeVar}: ${(v.size / 100).toFixed(2)}rem;\n${el.fontVar}: ${FONT_STACKS[v.font]?.value ?? "..."};`;
        }).join("\n")}
      </pre>
    </div>
  );
}

// ─── Button Style Settings ────────────────────────────────────────────────────

const BTN_STORAGE_KEY = "wjw-buttons";

interface BtnSlider {
  cssVar: string; label: string; desc: string;
  min: number; max: number; step: number; scale: number; unit: string; defaultVal: number;
}

const BTN_SLIDERS: BtnSlider[] = [
  { cssVar: "--btn-radius",         label: "Border Radius",       desc: "0 = square, higher = rounded",          min: 0,   max: 50,  step: 1,   scale: 0.1,    unit: "rem", defaultVal: 8  },
  { cssVar: "--btn-font-size",      label: "Font Size",           desc: "Text size inside buttons (px)",          min: 10,  max: 20,  step: 1,   scale: 0.0625, unit: "rem", defaultVal: 14 },
  { cssVar: "--btn-font-weight",    label: "Font Weight",         desc: "300 light · 500 medium · 700 bold",      min: 300, max: 800, step: 100, scale: 1,      unit: "",    defaultVal: 500 },
  { cssVar: "--btn-px",             label: "Padding X",           desc: "Horizontal padding (px)",                min: 4,   max: 40,  step: 1,   scale: 0.0625, unit: "rem", defaultVal: 16 },
  { cssVar: "--btn-py",             label: "Padding Y",           desc: "Vertical padding (px)",                  min: 2,   max: 24,  step: 1,   scale: 0.0625, unit: "rem", defaultVal: 8  },
  { cssVar: "--btn-border-width",   label: "Border Width",        desc: "Border / outline thickness (px)",        min: 0,   max: 4,   step: 1,   scale: 1,      unit: "px",  defaultVal: 1  },
  { cssVar: "--btn-letter-spacing", label: "Letter Spacing",      desc: "Character spacing (0 = normal)",         min: -2,  max: 10,  step: 1,   scale: 0.01,   unit: "em",  defaultVal: 0  },
];

interface BtnVariant {
  id: string; label: string; desc: string;
  bgVar: string; textVar: string; borderVar: string;
  defaultBg: string; defaultText: string; defaultBorder: string;
}

const BTN_VARIANTS: BtnVariant[] = [
  { id: "default",     label: "Default (Primary)", desc: "Main CTA",            bgVar: "--btn-default-bg",     textVar: "--btn-default-text",     borderVar: "--btn-default-border",     defaultBg: "#57c4dc", defaultText: "#171717", defaultBorder: "#57c4dc" },
  { id: "secondary",   label: "Secondary",         desc: "Lower-emphasis",      bgVar: "--btn-secondary-bg",   textVar: "--btn-secondary-text",   borderVar: "--btn-secondary-border",   defaultBg: "#f5f5f5", defaultText: "#171717", defaultBorder: "#f5f5f5" },
  { id: "outline",     label: "Outline",            desc: "Transparent + border",bgVar: "--btn-outline-bg",     textVar: "--btn-outline-text",     borderVar: "--btn-outline-border",     defaultBg: "transparent", defaultText: "#fafafa", defaultBorder: "#343434" },
  { id: "ghost",       label: "Ghost",              desc: "No bg or border",     bgVar: "--btn-ghost-bg",       textVar: "--btn-ghost-text",       borderVar: "--btn-ghost-border",       defaultBg: "transparent", defaultText: "#fafafa", defaultBorder: "transparent" },
  { id: "destructive", label: "Destructive",        desc: "Delete / danger",     bgVar: "--btn-destructive-bg", textVar: "--btn-destructive-text", borderVar: "--btn-destructive-border", defaultBg: "#ff6b6b", defaultText: "#171717", defaultBorder: "#ff6b6b" },
  { id: "link",        label: "Link",               desc: "Inline text-link",    bgVar: "--btn-link-bg",        textVar: "--btn-link-text",        borderVar: "--btn-link-border",        defaultBg: "transparent", defaultText: "#57c4dc", defaultBorder: "transparent" },
];

interface BtnState {
  sliders: Record<string, number>;
  variants: Record<string, { bg: string; text: string; border: string }>;
}

function buildBtnDefault(): BtnState {
  const sliders: Record<string, number> = {};
  BTN_SLIDERS.forEach(s => { sliders[s.cssVar] = s.defaultVal; });
  const variants: BtnState["variants"] = {};
  BTN_VARIANTS.forEach(v => { variants[v.id] = { bg: v.defaultBg, text: v.defaultText, border: v.defaultBorder }; });
  return { sliders, variants };
}

function loadBtnFromStorage(): BtnState | null {
  try { const r = localStorage.getItem(BTN_STORAGE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

function applyBtnState(state: BtnState) {
  const root = document.documentElement;
  BTN_SLIDERS.forEach(s => {
    const val = state.sliders[s.cssVar] ?? s.defaultVal;
    root.style.setProperty(s.cssVar, s.unit === "" ? `${val}` : `${(val * s.scale).toFixed(3)}${s.unit}`);
  });
  BTN_VARIANTS.forEach(v => {
    const col = state.variants[v.id];
    if (!col) return;
    root.style.setProperty(v.bgVar, col.bg);
    root.style.setProperty(v.textVar, col.text);
    root.style.setProperty(v.borderVar, col.border);
  });
}

function ButtonStylesPanel() {
  const [state, setState] = React.useState<BtnState>(() => {
    const stored = loadBtnFromStorage();
    const def = buildBtnDefault();
    if (!stored) return def;
    return { sliders: { ...def.sliders, ...stored.sliders }, variants: { ...def.variants, ...stored.variants } };
  });
  const [openVariant, setOpenVariant] = React.useState<string | null>(null);

  React.useEffect(() => {
    applyBtnState(state);
    storageSave(BTN_STORAGE_KEY, state).catch(() => {});
  }, [state]);

  function setSlider(cssVar: string, val: number) {
    setState(p => ({ ...p, sliders: { ...p.sliders, [cssVar]: val } }));
  }
  function setVariantColor(id: string, field: "bg" | "text" | "border", val: string) {
    setState(p => ({ ...p, variants: { ...p.variants, [id]: { ...p.variants[id], [field]: val } } }));
  }
  function resetAll() { setState(buildBtnDefault()); }
  function resetVariant(v: BtnVariant) {
    setState(p => ({ ...p, variants: { ...p.variants, [v.id]: { bg: v.defaultBg, text: v.defaultText, border: v.defaultBorder } } }));
  }

  const isDirty = BTN_SLIDERS.some(s => state.sliders[s.cssVar] !== s.defaultVal)
    || BTN_VARIANTS.some(v => {
      const c = state.variants[v.id];
      return c?.bg !== v.defaultBg || c?.text !== v.defaultText || c?.border !== v.defaultBorder;
    });

  // Inline preview style for variant swatch buttons
  function previewStyle(v: BtnVariant): React.CSSProperties {
    const s = state.sliders;
    const col = state.variants[v.id];
    return {
      background: col.bg === "transparent" ? "transparent" : col.bg,
      color: col.text,
      border: `${s["--btn-border-width"]}px solid ${col.border === "transparent" ? "transparent" : col.border}`,
      borderRadius: `${(s["--btn-radius"] * 0.1).toFixed(2)}rem`,
      fontSize: `${(s["--btn-font-size"] * 0.0625).toFixed(3)}rem`,
      fontWeight: s["--btn-font-weight"],
      padding: `${(s["--btn-py"] * 0.0625).toFixed(3)}rem ${(s["--btn-px"] * 0.0625).toFixed(3)}rem`,
      letterSpacing: `${(s["--btn-letter-spacing"] * 0.01).toFixed(3)}em`,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      textDecoration: v.id === "link" ? "underline" : "none",
      lineHeight: 1.4,
    };
  }

  return (
    <div className="space-y-6">
      {isDirty && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1.5 text-xs text-muted-foreground">
            <RotateCcw className="w-3 h-3" /> Reset all
          </Button>
        </div>
      )}

      {/* Shared sliders */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shared Properties</p>
        {BTN_SLIDERS.map(s => {
          const val = state.sliders[s.cssVar] ?? s.defaultVal;
          const display = s.unit === "" ? `${val}` : `${(val * s.scale).toFixed(2)}${s.unit}`;
          const changed = val !== s.defaultVal;
          return (
            <div key={s.cssVar} className="grid grid-cols-[130px_1fr_auto_auto] items-center gap-3">
              <div>
                <p className="text-xs font-medium">{s.label}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{s.desc}</p>
              </div>
              <Slider min={s.min} max={s.max} step={s.step} value={[val]}
                onValueChange={([v]) => setSlider(s.cssVar, v)} />
              <span className="text-xs text-muted-foreground w-14 text-right tabular-nums">{display}</span>
              {changed
                ? <button onClick={() => setSlider(s.cssVar, s.defaultVal)} className="text-muted-foreground hover:text-foreground transition-colors"><RotateCcw className="w-3 h-3" /></button>
                : <div className="w-4" />}
            </div>
          );
        })}
      </div>

      <Separator />

      {/* Live preview strip */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Live Preview</p>
        <div className="flex flex-wrap gap-3 rounded-xl border border-dashed border-border p-4 bg-muted/20">
          {BTN_VARIANTS.map(v => (
            <button key={v.id} style={previewStyle(v)}>{v.label}</button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Per-variant color editors */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variant Colors</p>
        <p className="text-[10px] text-muted-foreground">Accepts hex, rgb(), hsl(), or CSS variables like <code>var(--primary)</code></p>
        <div className="space-y-2 mt-2">
          {BTN_VARIANTS.map(v => {
            const col = state.variants[v.id];
            const changed = col?.bg !== v.defaultBg || col?.text !== v.defaultText || col?.border !== v.defaultBorder;
            const isOpen = openVariant === v.id;

            return (
              <Collapsible key={v.id} open={isOpen} onOpenChange={open => setOpenVariant(open ? v.id : null)}>
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center justify-between rounded-xl border border-border px-3 py-2 text-left hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded border border-border shrink-0"
                        style={{
                          background: col?.bg === "transparent" ? undefined : col?.bg,
                          backgroundImage: col?.bg === "transparent" ? "repeating-conic-gradient(#aaa 0% 25%, transparent 0% 50%) 0 / 8px 8px" : undefined,
                        }} />
                      <span className="text-sm font-medium">{v.label}</span>
                      <span className="text-xs text-muted-foreground">{v.desc}</span>
                      {changed && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">modified</Badge>}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mt-1 rounded-xl border border-border p-3 space-y-2 bg-card">
                    {(["bg", "text", "border"] as const).map(field => {
                      const labelMap = { bg: "Background", text: "Text", border: "Border" };
                      const defMap = { bg: v.defaultBg, text: v.defaultText, border: v.defaultBorder };
                      const val = col?.[field] ?? defMap[field];
                      return (
                        <div key={field} className="flex items-center gap-2">
                          <input type="color"
                            value={val.startsWith("#") ? val : "#888888"}
                            onChange={e => setVariantColor(v.id, field, e.target.value)}
                            className="h-7 w-7 rounded border border-border cursor-pointer bg-transparent p-0.5 shrink-0" />
                          <Input value={val} onChange={e => setVariantColor(v.id, field, e.target.value)}
                            className="h-7 text-xs font-mono flex-1" />
                          <Label className="text-xs w-20 shrink-0 text-muted-foreground">{labelMap[field]}</Label>
                          {val !== defMap[field] && (
                            <button onClick={() => setVariantColor(v.id, field, defMap[field])}
                              className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                    {changed && (
                      <div className="flex justify-end pt-1">
                        <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-muted-foreground"
                          onClick={() => resetVariant(v)}>
                          <RotateCcw className="w-3 h-3" /> Reset {v.label}
                        </Button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </div>

      {/* CSS export */}
      <Separator />
      <div className="space-y-1.5">
        <p className="text-xs text-muted-foreground font-medium">Copy to :root in index.css to make permanent</p>
        <pre className="text-[10px] leading-relaxed text-muted-foreground bg-muted rounded-xl p-3 overflow-x-auto whitespace-pre-wrap">
          {[
            ...BTN_SLIDERS.map(s => {
              const val = state.sliders[s.cssVar] ?? s.defaultVal;
              const css = s.unit === "" ? `${val}` : `${(val * s.scale).toFixed(3)}${s.unit}`;
              return `${s.cssVar}: ${css};`;
            }),
            "",
            ...BTN_VARIANTS.flatMap(v => {
              const col = state.variants[v.id];
              return [`${v.bgVar}: ${col.bg};`, `${v.textVar}: ${col.text};`, `${v.borderVar}: ${col.border};`];
            }),
          ].join("\n")}
        </pre>
      </div>
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

            <AdminSection title="Typography" description="Font families and sizes for every text element" icon={<Type className="w-4 h-4" />}>
              <TypographyPanel />
            </AdminSection>

            <AdminSection title="Button Styles" description="Shared properties and per-variant colors for all buttons" icon={<MousePointerClick className="w-4 h-4" />}>
              <ButtonStylesPanel />
            </AdminSection>

            <AdminSection title="Storage Backend" description="Choose where admin settings persist — local, Gist, Cloudflare KV, Firestore, or Google Drive" icon={<Database className="w-4 h-4" />}>
              <StoragePanel />
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
          williamjwhite.me admin · session auth · storage: {BACKEND_META[getStorageConfig().backend].label}
        </p>
      </main>
    </div>
  );
}
