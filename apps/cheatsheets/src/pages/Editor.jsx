import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PinGate } from '@/components/PinGate'
import { MarkdownViewer } from '@/components/MarkdownViewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  isAuthenticated, getSheets, getDrafts, getSheet, getDraft,
  saveDraft, deleteDraft, saveSheet, downloadSheet,
  slugify, setPin, getPin,
  getStorageCfg, setStorageCfg, STORAGE_MODES, listGistSheets,
} from '@/lib/storage'
import {
  Eye, Code2, Plus, Save, Download, Settings, FileText,
  Lock, FolderOpen, AlertCircle, Cloud, HardDrive,
  Github, CheckCircle2, XCircle, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const EMPTY = { id: '', title: '', slug: '', category: '', content: '' }

export function Editor() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  if (!authed) return <PinGate onUnlock={() => setAuthed(true)} />
  return <EditorInner navigate={navigate} searchParams={searchParams} />
}

function EditorInner({ navigate, searchParams }) {
  const [allSheets, setAllSheets]   = useState(getSheets())
  const [active, setActive]         = useState(null)
  const [form, setForm]             = useState(EMPTY)
  const [view, setView]             = useState('split')
  const [dirty, setDirty]           = useState(false)
  const [saveStatus, setSaveStatus] = useState(null)   // null | { ok, message }
  const [saving, setSaving]         = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // PIN
  const [newPin, setNewPin]   = useState('')
  const [pinMsg, setPinMsg]   = useState('')

  // Storage config
  const [cfg, setCfgState]      = useState(getStorageCfg())
  const [cfgMsg, setCfgMsg]     = useState('')
  const [gistToken, setGistToken] = useState(cfg.gistToken ?? '')
  const [gistId, setGistId]       = useState(cfg.gistId ?? '')
  const [gdriveToken, setGdriveToken] = useState(cfg.gdriveToken ?? '')
  const [gdriveFolderId, setGdriveFolderId] = useState(cfg.gdriveFolderId ?? '')

  function saveCfg(patch) {
    const next = { ...cfg, ...patch }
    setStorageCfg(next)
    setCfgState(next)
  }

  // Load sheet from URL param on mount
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const s = allSheets.find(x => x.id === id)
      if (s) { setActive(s.id); setForm({ ...s }) }
    }
  }, [])

  function refreshSheets() { setAllSheets(getSheets()) }

  function selectSheet(id) {
    if (dirty && !confirm('Discard unsaved changes?')) return
    if (id === null) {
      setForm({ ...EMPTY, id: `draft-${Date.now()}` })
      setActive(null)
    } else {
      const s = allSheets.find(x => x.id === id)
      const draft = getDraft(s.slug)
      setForm(draft ? { ...draft } : { ...s })
      setActive(id)
    }
    setDirty(false)
    setSaveStatus(null)
  }

  function handleChange(field, value) {
    setForm(f => {
      const next = { ...f, [field]: value }
      if (field === 'title' && !active) next.slug = slugify(value)
      return next
    })
    setDirty(true)
  }

  // ── Save ────────────────────────────────────────────────────
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

    navigate(`/cheatsheets/editor?id=${form.id}`, { replace: true })
  }, [form, navigate])

  // ⌘S
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSave() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleSave])

  function handleDelete() {
    const sheet = allSheets.find(s => s.id === active)
    if (!sheet) return
    if (sheet.source === 'file') {
      alert(`"${sheet.title}" is committed to the repo.\nDelete content/${sheet.slug}.md and push to remove it.`)
      return
    }
    if (!confirm(`Delete draft "${sheet.title}"?`)) return
    deleteDraft(sheet.id)
    refreshSheets()
    setForm(EMPTY); setActive(null); setDirty(false)
    navigate('/cheatsheets/editor', { replace: true })
  }

  function savePin() {
    if (!/^\d{4}$/.test(newPin)) { setPinMsg('PIN must be exactly 4 digits'); return }
    setPin(newPin); setNewPin('')
    setPinMsg('PIN updated ✓')
    setTimeout(() => setPinMsg(''), 3000)
  }

  function applyGistCfg() {
    saveCfg({ mode: STORAGE_MODES.GIST, gistToken, gistId })
    setCfgMsg('Gist config saved ✓')
    setTimeout(() => setCfgMsg(''), 3000)
  }

  function applyGdriveCfg() {
    saveCfg({ mode: STORAGE_MODES.GDRIVE, gdriveToken, gdriveFolderId })
    setCfgMsg('Drive config saved ✓')
    setTimeout(() => setCfgMsg(''), 3000)
  }

  function setMode(mode) {
    saveCfg({ mode })
  }

  const activeSheet = allSheets.find(s => s.id === active)
  const isFileSheet = activeSheet?.source === 'file'
  const drafts      = getDrafts()
  const hasDraft    = active && isFileSheet && drafts.some(d => d.slug === activeSheet?.slug)
  const fileSheets  = allSheets.filter(s => s.source === 'file')
  const draftSheets = allSheets.filter(s => s.source === 'draft')

  const modeLabel = {
    [STORAGE_MODES.DOWNLOAD]: 'Download .md',
    [STORAGE_MODES.GIST]:     'GitHub Gist',
    [STORAGE_MODES.GDRIVE]:   'Google Drive',
  }

  return (
    <div className="flex -mx-4 sm:-mx-6 -my-8 h-[calc(100vh-8rem)]">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-60 flex-shrink-0 border-r border-border flex flex-col bg-sidebar hidden sm:flex">
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Sheets</span>
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
            <Settings size={13} />
            Settings
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Toolbar */}
        <div className="h-11 border-b border-border flex items-center px-4 gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 mr-auto">
            {['edit', 'split', 'preview'].map(v => (
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

          {/* Status */}
          <div className="flex items-center gap-2">
            {dirty && <Badge variant="outline" className="text-xs text-muted-foreground">unsaved</Badge>}
            {saveStatus && (
              <div className={cn('flex items-center gap-1.5 text-xs', saveStatus.ok ? 'text-green-600' : 'text-destructive')}>
                {saveStatus.ok
                  ? <CheckCircle2 size={13} />
                  : <XCircle size={13} />}
                {saveStatus.message}
              </div>
            )}
            <Badge variant="secondary" className="text-xs font-mono hidden sm:flex">
              {modeLabel[cfg.mode]}
            </Badge>
          </div>

          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
            {saving
              ? <Loader2 size={13} className="animate-spin" />
              : <Save size={13} />}
            <span className="hidden sm:block">Save</span>
            <span className="hidden sm:block text-primary-foreground/60 text-xs font-mono">⌘S</span>
          </Button>
        </div>

        {/* ── Settings panel ────────────────────────────────── */}
        {showSettings && (
          <div className="border-b border-border bg-muted/20 overflow-y-auto">
            <div className="px-5 py-4 flex flex-col gap-6 max-w-2xl">

              {/* ── Storage backend ── */}
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Storage Backend</p>

                <div className="grid grid-cols-3 gap-2">
                  <ModeButton
                    active={cfg.mode === STORAGE_MODES.DOWNLOAD}
                    icon={<HardDrive size={15} />}
                    label="Download .md"
                    sub="Manual commit"
                    onClick={() => setMode(STORAGE_MODES.DOWNLOAD)}
                  />
                  <ModeButton
                    active={cfg.mode === STORAGE_MODES.GIST}
                    icon={<Github size={15} />}
                    label="GitHub Gist"
                    sub="Private, auto-sync"
                    onClick={() => setMode(STORAGE_MODES.GIST)}
                  />
                  <ModeButton
                    active={cfg.mode === STORAGE_MODES.GDRIVE}
                    icon={<Cloud size={15} />}
                    label="Google Drive"
                    sub="OAuth, any device"
                    onClick={() => setMode(STORAGE_MODES.GDRIVE)}
                  />
                </div>

                {/* Download mode info */}
                {cfg.mode === STORAGE_MODES.DOWNLOAD && (
                  <div className="rounded-[var(--radius)] border border-border bg-background p-3 text-xs text-muted-foreground leading-relaxed">
                    <p className="font-medium text-foreground mb-1">How it works</p>
                    Clicking <strong>Save</strong> downloads a <code className="font-mono bg-muted px-1 rounded">.md</code> file to your Downloads folder.
                    Move it to <code className="font-mono bg-muted px-1 rounded">apps/cheatsheets/content/</code> and push — it'll be live on the next deploy.
                    <p className="mt-2 font-mono text-[10px] bg-muted rounded px-2 py-1">
                      mv ~/Downloads/my-sheet.md apps/cheatsheets/content/ && git add . && git push
                    </p>
                  </div>
                )}

                {/* Gist config */}
                {cfg.mode === STORAGE_MODES.GIST && (
                  <div className="rounded-[var(--radius)] border border-border bg-background p-3 flex flex-col gap-3">
                    <p className="text-xs font-medium">GitHub Gist config</p>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Personal Access Token <span className="text-primary">(gist scope only)</span></label>
                      <Input
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        value={gistToken}
                        onChange={e => setGistToken(e.target.value)}
                        className="font-mono text-xs h-8"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Gist ID <span className="text-muted-foreground/60">(leave blank — auto-created on first save)</span></label>
                      <Input
                        placeholder="abc123def456…"
                        value={gistId}
                        onChange={e => setGistId(e.target.value)}
                        className="font-mono text-xs h-8"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={applyGistCfg}>Save config</Button>
                      {cfgMsg && <span className="text-xs text-primary">{cfgMsg}</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Token is stored in <strong>localStorage only</strong> — never sent anywhere except the GitHub API.
                      Create one at <strong>github.com → Settings → Developer settings → Fine-grained tokens</strong> with <em>Gists: Read and Write</em>.
                    </p>
                  </div>
                )}

                {/* Drive config */}
                {cfg.mode === STORAGE_MODES.GDRIVE && (
                  <div className="rounded-[var(--radius)] border border-border bg-background p-3 flex flex-col gap-3">
                    <p className="text-xs font-medium">Google Drive config</p>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">OAuth2 Access Token</label>
                      <Input
                        type="password"
                        placeholder="ya29.xxxxxxxxxxxxxxxxxxxx"
                        value={gdriveToken}
                        onChange={e => setGdriveToken(e.target.value)}
                        className="font-mono text-xs h-8"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs text-muted-foreground">Folder ID <span className="text-muted-foreground/60">(optional — saves to root if blank)</span></label>
                      <Input
                        placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                        value={gdriveFolderId}
                        onChange={e => setGdriveFolderId(e.target.value)}
                        className="font-mono text-xs h-8"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={applyGdriveCfg}>Save config</Button>
                      {cfgMsg && <span className="text-xs text-primary">{cfgMsg}</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Get a token from <strong>developers.google.com/oauthplayground</strong> — select <em>Drive API v3 → drive.file</em> scope.
                      Tokens expire after 1 hour; refresh as needed or set up a proper OAuth flow.
                    </p>
                  </div>
                )}
              </div>

              {/* ── PIN ── */}
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Editor PIN</p>
                <div className="flex gap-2 items-center">
                  <Input
                    type="password"
                    placeholder="New 4-digit PIN"
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    maxLength={4}
                    className="w-40 font-mono h-8"
                  />
                  <Button size="sm" variant="outline" onClick={savePin}>
                    <Lock size={13} /> Update
                  </Button>
                  {pinMsg && <span className="text-xs text-primary">{pinMsg}</span>}
                </div>
              </div>

              {/* ── Danger ── */}
              {active && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Danger</p>
                  <button onClick={handleDelete} className="text-xs text-destructive hover:underline self-start">
                    {isFileSheet
                      ? `Remove: delete content/${activeSheet.slug}.md and push`
                      : 'Delete this draft'}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* File sheet notice */}
        {isFileSheet && !showSettings && (
          <div className="border-b border-amber-500/20 bg-amber-500/5 px-4 py-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle size={12} />
            File-based sheet — edits save as a local draft.
            {cfg.mode === STORAGE_MODES.DOWNLOAD
              ? <><strong className="ml-1">Save</strong> to download the updated .md and commit it.</>
              : <><strong className="ml-1">Save</strong> to push to {modeLabel[cfg.mode]}.</>}
            {hasDraft && <Badge variant="outline" className="text-amber-600 border-amber-500/30 ml-auto">draft exists</Badge>}
          </div>
        )}

        {/* Meta fields */}
        <div className="border-b border-border px-4 py-2.5 flex flex-wrap gap-3 flex-shrink-0">
          <Input placeholder="Title" value={form.title} onChange={e => handleChange('title', e.target.value)}
            className="flex-1 min-w-36 h-8 text-sm font-medium" />
          <Input placeholder="slug-auto-generated" value={form.slug}
            onChange={e => handleChange('slug', e.target.value)}
            className="flex-1 min-w-36 h-8 text-xs font-mono text-muted-foreground"
            readOnly={isFileSheet} title={isFileSheet ? 'Slug set by filename in content/' : ''} />
          <Input placeholder="Category" value={form.category}
            onChange={e => handleChange('category', e.target.value)} className="w-36 h-8 text-sm" />
        </div>

        {/* Edit / Preview panes */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {(view === 'edit' || view === 'split') && (
            <div className={cn('flex flex-col overflow-hidden', view === 'split' ? 'w-1/2 border-r border-border' : 'flex-1')}>
              <div className="px-3 py-1.5 border-b border-border/50 flex items-center gap-1.5">
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
              <div className="px-3 py-1.5 border-b border-border/50 flex items-center gap-1.5">
                <Eye size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">preview</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
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

function SidebarItem({ sheet, active, hasDraft, isDraft, onClick }) {
  return (
    <button onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-sidebar-accent/10 transition-colors text-sm',
        active && 'bg-primary/10 border-l-2 border-l-primary text-primary'
      )}
    >
      <FileText size={13} className="flex-shrink-0 text-muted-foreground" />
      <span className="truncate flex-1">{sheet.title}</span>
      {hasDraft && <span className="h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0" title="Local draft exists" />}
      {isDraft  && <span className="text-[9px] font-mono text-amber-500 flex-shrink-0">draft</span>}
    </button>
  )
}

function ModeButton({ active, icon, label, sub, onClick }) {
  return (
    <button onClick={onClick}
      className={cn(
        'flex flex-col items-start gap-1 p-3 rounded-[var(--radius)] border text-left transition-all',
        active
          ? 'border-primary bg-primary/5 text-foreground'
          : 'border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground'
      )}
    >
      <div className={cn('flex items-center gap-1.5', active && 'text-primary')}>{icon}</div>
      <span className="text-xs font-medium">{label}</span>
      <span className="text-[10px] text-muted-foreground">{sub}</span>
    </button>
  )
}
