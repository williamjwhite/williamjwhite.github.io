import { useState, useEffect, useCallback } from 'react'
import { PinGate } from '../components/PinGate'
import { MarkdownViewer } from '../components/MarkdownViewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  isAuthenticated, getSheets, getDrafts, getDraft,
  saveDraft, deleteDraft, saveSheet, type Sheet,
  slugify, setPin,
  getStorageCfg, setStorageCfg, STORAGE_MODES, type StorageCfg,
} from '../lib/storage'
import {
  Eye, Code2, Plus, Save, Settings, FileText,
  Lock, FolderOpen, AlertCircle, Cloud, HardDrive,
  Github, CheckCircle2, XCircle, Loader2, ArrowLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const EMPTY: Sheet = {
  id: '', title: '', slug: '', category: '', content: '',
  source: 'draft', createdAt: '', updatedAt: '',
}

interface Props {
  initialId?: string
  onBack: () => void
  onViewSheet: (slug: string) => void
}

export function Editor({ initialId, onBack, onViewSheet }: Props) {
  const [authed, setAuthed] = useState(isAuthenticated())
  if (!authed) return <PinGate onUnlock={() => setAuthed(true)} />
  return <EditorInner initialId={initialId} onBack={onBack} onViewSheet={onViewSheet} />
}

function EditorInner({ initialId, onBack, onViewSheet }: Props) {
  const [allSheets, setAllSheets]   = useState(getSheets())
  const [active, setActive]         = useState<string | null>(null)
  const [form, setForm]             = useState<Sheet>({ ...EMPTY, id: `draft-${Date.now()}` })
  const [view, setView]             = useState<'edit' | 'split' | 'preview'>('split')
  const [dirty, setDirty]           = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ ok: boolean; message: string } | null>(null)
  const [saving, setSaving]         = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // PIN
  const [newPin, setNewPin] = useState('')
  const [pinMsg, setPinMsg] = useState('')

  // Storage config
  const [cfg, setCfgState]            = useState<StorageCfg>(getStorageCfg())
  const [cfgMsg, setCfgMsg]           = useState('')
  const [gistToken, setGistToken]     = useState(cfg.gistToken)
  const [gistId, setGistId]           = useState(cfg.gistId)
  const [gdriveToken, setGdriveToken] = useState(cfg.gdriveToken)
  const [gdriveFolderId, setGdriveFolderId] = useState(cfg.gdriveFolderId)

  function updateCfg(patch: Partial<StorageCfg>) {
    const next = { ...cfg, ...patch }
    setStorageCfg(next)
    setCfgState(next)
  }

  // Load initial sheet
  useEffect(() => {
    if (initialId) {
      const s = allSheets.find(x => x.id === initialId)
      if (s) { setActive(s.id); setForm({ ...s }) }
    }
  }, [])

  function refreshSheets() { setAllSheets(getSheets()) }

  function selectSheet(id: string | null) {
    if (dirty && !confirm('Discard unsaved changes?')) return
    if (id === null) {
      setForm({ ...EMPTY, id: `draft-${Date.now()}` })
      setActive(null)
    } else {
      const s = allSheets.find(x => x.id === id)!
      const draft = getDraft(s.slug)
      setForm(draft ? { ...draft } : { ...s })
      setActive(id)
    }
    setDirty(false)
    setSaveStatus(null)
  }

  function handleChange(field: keyof Sheet, value: string) {
    setForm(f => {
      const next = { ...f, [field]: value }
      if (field === 'title' && !active) next.slug = slugify(value)
      return next
    })
    setDirty(true)
  }

  const handleSave = useCallback(async () => {
    if (!form.title) return alert('Title is required')
    if (!form.id)    form.id   = `draft-${Date.now()}`
    if (!form.slug)  form.slug = slugify(form.title)
    setSaving(true)
    setSaveStatus(null)
    const result = await saveSheet(form)
    refreshSheets()
    setDirty(false)
    setSaving(false)
    setSaveStatus(result)
    setTimeout(() => setSaveStatus(null), 4000)
  }, [form])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); void handleSave() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave])

  function handleDelete() {
    const sheet = allSheets.find(s => s.id === active)
    if (!sheet) return
    if (sheet.source === 'file') {
      alert(`"${sheet.title}" is committed.\nDelete content/${sheet.slug}.md and push.`)
      return
    }
    if (!confirm(`Delete draft "${sheet.title}"?`)) return
    deleteDraft(sheet.id)
    refreshSheets()
    setForm({ ...EMPTY, id: `draft-${Date.now()}` })
    setActive(null)
    setDirty(false)
  }

  function savePin() {
    if (!/^\d{4}$/.test(newPin)) { setPinMsg('PIN must be 4 digits'); return }
    setPin(newPin); setNewPin('')
    setPinMsg('PIN updated ✓')
    setTimeout(() => setPinMsg(''), 3000)
  }

  function applyCfg(mode: typeof STORAGE_MODES[keyof typeof STORAGE_MODES]) {
    const patch: Partial<StorageCfg> = { mode }
    if (mode === STORAGE_MODES.GIST)   Object.assign(patch, { gistToken, gistId })
    if (mode === STORAGE_MODES.GDRIVE) Object.assign(patch, { gdriveToken, gdriveFolderId })
    updateCfg(patch)
    setCfgMsg('Config saved ✓')
    setTimeout(() => setCfgMsg(''), 3000)
  }

  const activeSheet = allSheets.find(s => s.id === active)
  const isFileSheet = activeSheet?.source === 'file'
  const drafts      = getDrafts()
  const hasDraft    = !!(active && isFileSheet && drafts.some(d => d.slug === activeSheet?.slug))
  const fileSheets  = allSheets.filter(s => s.source === 'file')
  const draftSheets = allSheets.filter(s => s.source === 'draft')

  const modeLabel: Record<string, string> = {
    [STORAGE_MODES.DOWNLOAD]: 'Download .md',
    [STORAGE_MODES.GIST]:     'GitHub Gist',
    [STORAGE_MODES.GDRIVE]:   'Google Drive',
  }

  return (
    <div className="flex border border-border rounded-[var(--radius)] overflow-hidden mt-4" style={{ height: '75vh' }}>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 border-r border-border flex flex-col bg-sidebar hidden sm:flex">
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={11} /> Sheets
          </button>
          <button
            onClick={() => selectSheet(null)}
            className="h-6 w-6 rounded-[var(--radius-sm)] border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            title="New draft"
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-1">
          {fileSheets.length > 0 && (
            <div>
              <div className="px-3 pt-2 pb-1 flex items-center gap-1.5">
                <FolderOpen size={10} className="text-muted-foreground" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">content/</span>
              </div>
              {fileSheets.map(s => (
                <SidebarItem key={s.id} sheet={s} active={active === s.id}
                  hasDraft={drafts.some(d => d.slug === s.slug)} onClick={() => selectSheet(s.id)} />
              ))}
            </div>
          )}
          {draftSheets.length > 0 && (
            <div>
              <div className="px-3 pt-3 pb-1 flex items-center gap-1.5">
                <AlertCircle size={10} className="text-amber-500" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">drafts</span>
              </div>
              {draftSheets.map(s => (
                <SidebarItem key={s.id} sheet={s} active={active === s.id}
                  isDraft onClick={() => selectSheet(s.id)} />
              ))}
            </div>
          )}
          {allSheets.length === 0 && (
            <p className="px-3 py-4 text-xs text-muted-foreground">No sheets yet</p>
          )}
        </div>

        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setShowSettings(s => !s)}
            className={cn(
              'w-full flex items-center gap-2 px-2 py-2 rounded-[var(--radius-sm)] text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
              showSettings && 'bg-muted text-foreground'
            )}
          >
            <Settings size={13} /> Settings
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Toolbar */}
        <div className="h-11 border-b border-border flex items-center px-3 gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 mr-auto">
            {(['edit', 'split', 'preview'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={cn(
                  'h-7 px-2.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors capitalize',
                  view === v ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {v === 'edit'    && <Code2 size={12} className="inline mr-1" />}
                {v === 'preview' && <Eye   size={12} className="inline mr-1" />}
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {dirty && <Badge variant="outline" className="text-xs text-muted-foreground">unsaved</Badge>}
            {saveStatus && (
              <div className={cn('flex items-center gap-1.5 text-xs', saveStatus.ok ? 'text-green-600' : 'text-destructive')}>
                {saveStatus.ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                <span className="hidden sm:block">{saveStatus.message}</span>
              </div>
            )}
            <Badge variant="secondary" className="text-xs font-mono hidden md:flex">
              {modeLabel[cfg.mode]}
            </Badge>
          </div>

          <Button size="sm" onClick={() => void handleSave()} disabled={saving} className="gap-1.5">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span className="hidden sm:block">Save</span>
            <span className="hidden sm:block text-primary-foreground/60 text-xs font-mono">⌘S</span>
          </Button>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="border-b border-border bg-muted/20 overflow-y-auto max-h-72">
            <div className="px-4 py-4 flex flex-col gap-5 max-w-xl">

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Storage Backend</p>
                <div className="grid grid-cols-3 gap-2">
                  <ModeButton active={cfg.mode === STORAGE_MODES.DOWNLOAD} icon={<HardDrive size={14} />}
                    label="Download .md" sub="Manual commit" onClick={() => applyCfg(STORAGE_MODES.DOWNLOAD)} />
                  <ModeButton active={cfg.mode === STORAGE_MODES.GIST} icon={<Github size={14} />}
                    label="GitHub Gist" sub="Auto-sync" onClick={() => applyCfg(STORAGE_MODES.GIST)} />
                  <ModeButton active={cfg.mode === STORAGE_MODES.GDRIVE} icon={<Cloud size={14} />}
                    label="Google Drive" sub="OAuth" onClick={() => applyCfg(STORAGE_MODES.GDRIVE)} />
                </div>

                {cfg.mode === STORAGE_MODES.GIST && (
                  <div className="flex flex-col gap-2 p-3 rounded-[var(--radius)] border border-border bg-background">
                    <Input type="password" placeholder="VITE_CS_GIST_TOKEN · ghp_xxx"
                      value={gistToken} onChange={e => setGistToken(e.target.value)}
                      className="font-mono text-xs h-8" />
                    <Input placeholder="Gist ID (blank = auto-created on first save)"
                      value={gistId} onChange={e => setGistId(e.target.value)}
                      className="font-mono text-xs h-8" />
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => applyCfg(STORAGE_MODES.GIST)}>Save</Button>
                      {cfgMsg && <span className="text-xs text-primary">{cfgMsg}</span>}
                    </div>
                  </div>
                )}

                {cfg.mode === STORAGE_MODES.GDRIVE && (
                  <div className="flex flex-col gap-2 p-3 rounded-[var(--radius)] border border-border bg-background">
                    <Input type="password" placeholder="OAuth2 access token · ya29.xxx"
                      value={gdriveToken} onChange={e => setGdriveToken(e.target.value)}
                      className="font-mono text-xs h-8" />
                    <Input placeholder="Folder ID (optional)"
                      value={gdriveFolderId} onChange={e => setGdriveFolderId(e.target.value)}
                      className="font-mono text-xs h-8" />
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => applyCfg(STORAGE_MODES.GDRIVE)}>Save</Button>
                      {cfgMsg && <span className="text-xs text-primary">{cfgMsg}</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Editor PIN</p>
                <div className="flex gap-2 items-center">
                  <Input type="password" placeholder="New 4-digit PIN" value={newPin}
                    onChange={e => setNewPin(e.target.value)} maxLength={4} className="w-36 font-mono h-8" />
                  <Button size="sm" variant="outline" onClick={savePin}>
                    <Lock size={12} /> Update
                  </Button>
                  {pinMsg && <span className="text-xs text-primary">{pinMsg}</span>}
                </div>
              </div>

              {active && (
                <button onClick={handleDelete} className="text-xs text-destructive hover:underline self-start">
                  {isFileSheet ? `Remove: delete content/${activeSheet?.slug}.md and push` : 'Delete this draft'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* File sheet banner */}
        {isFileSheet && !showSettings && (
          <div className="border-b border-amber-500/20 bg-amber-500/5 px-4 py-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle size={12} />
            File-based sheet — edits save as a local draft.
            {hasDraft && <Badge variant="outline" className="text-amber-600 border-amber-500/30 ml-auto">draft exists</Badge>}
          </div>
        )}

        {/* Meta fields */}
        <div className="border-b border-border px-3 py-2 flex flex-wrap gap-2 flex-shrink-0">
          <Input placeholder="Title" value={form.title} onChange={e => handleChange('title', e.target.value)}
            className="flex-1 min-w-32 h-8 text-sm font-medium" />
          <Input placeholder="slug-auto" value={form.slug} onChange={e => handleChange('slug', e.target.value)}
            className="flex-1 min-w-32 h-8 text-xs font-mono text-muted-foreground"
            readOnly={isFileSheet} />
          <Input placeholder="Category" value={form.category} onChange={e => handleChange('category', e.target.value)}
            className="w-32 h-8 text-sm" />
        </div>

        {/* Panes */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {(view === 'edit' || view === 'split') && (
            <div className={cn('flex flex-col overflow-hidden', view === 'split' ? 'w-1/2 border-r border-border' : 'flex-1')}>
              <div className="px-3 py-1 border-b border-border/50 flex items-center gap-1.5">
                <Code2 size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">markdown</span>
              </div>
              <textarea
                className="flex-1 p-4 resize-none bg-background text-sm font-mono leading-relaxed text-foreground focus:outline-none placeholder:text-muted-foreground/50"
                placeholder={`# My Cheatsheet\n\nStart writing markdown…`}
                value={form.content}
                onChange={e => handleChange('content', e.target.value)}
                spellCheck={false}
              />
            </div>
          )}
          {(view === 'preview' || view === 'split') && (
            <div className={cn('flex flex-col overflow-hidden', view === 'split' ? 'w-1/2' : 'flex-1')}>
              <div className="px-3 py-1 border-b border-border/50 flex items-center gap-1.5">
                <Eye size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">preview</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {form.content
                  ? <MarkdownViewer content={form.content} />
                  : <p className="text-sm text-muted-foreground italic">Nothing to preview yet</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function SidebarItem({ sheet, active, hasDraft, isDraft, onClick }: {
  sheet: Sheet; active: boolean; hasDraft?: boolean; isDraft?: boolean; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-sidebar-accent/10 transition-colors text-sm',
        active && 'bg-primary/10 border-l-2 border-l-primary text-primary'
      )}
    >
      <FileText size={13} className="flex-shrink-0 text-muted-foreground" />
      <span className="truncate flex-1">{sheet.title}</span>
      {hasDraft && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" />}
      {isDraft  && <span className="text-[9px] font-mono text-amber-500 flex-shrink-0">draft</span>}
    </button>
  )
}

function ModeButton({ active, icon, label, sub, onClick }: {
  active: boolean; icon: React.ReactNode; label: string; sub: string; onClick: () => void
}) {
  return (
    <button onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-1 p-2.5 rounded-[var(--radius)] border text-left transition-all',
        active ? 'border-primary bg-primary/5 text-foreground' : 'border-border bg-background text-muted-foreground hover:border-primary/40'
      )}
    >
      <div className={cn('flex items-center gap-1.5', active && 'text-primary')}>{icon}</div>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] text-muted-foreground">{sub}</span>
    </button>
  )
}
