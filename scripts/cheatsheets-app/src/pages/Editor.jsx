import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PinGate } from '@/components/PinGate'
import { MarkdownViewer } from '@/components/MarkdownViewer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  isAuthenticated, getSheet, getSheets, saveSheet,
  slugify, setPin, getPin
} from '@/lib/storage'
import {
  Eye, Code2, Plus, Save, X, Settings,
  FileText, ChevronRight, Lock
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
  const [sheets, setSheets] = useState(getSheets())
  const [active, setActive] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [view, setView] = useState('split')   // 'edit' | 'preview' | 'split'
  const [dirty, setDirty] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [pinMsg, setPinMsg] = useState('')

  // Load sheet from URL param
  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const s = sheets.find(x => x.id === id)
      if (s) { setActive(s.id); setForm({ ...s }) }
    }
  }, [])

  function selectSheet(id) {
    if (dirty && !confirm('Discard unsaved changes?')) return
    if (id === null) {
      const newId = `sheet-${Date.now()}`
      setForm({ ...EMPTY, id: newId })
      setActive(null)
    } else {
      const s = sheets.find(x => x.id === id)
      setForm({ ...s })
      setActive(id)
    }
    setDirty(false)
  }

  function handleChange(field, value) {
    setForm(f => {
      const next = { ...f, [field]: value }
      if (field === 'title' && !active) {
        next.slug = slugify(value)
      }
      return next
    })
    setDirty(true)
  }

  const save = useCallback(() => {
    if (!form.title) return alert('Title is required')
    if (!form.id) form.id = `sheet-${Date.now()}`
    if (!form.slug) form.slug = slugify(form.title)
    const updated = saveSheet(form)
    setSheets(updated)
    setActive(form.id)
    setDirty(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    navigate(`/cheatsheets/editor?id=${form.id}`, { replace: true })
  }, [form, navigate])

  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); save() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save])

  function savePin() {
    if (!/^\d{4}$/.test(newPin)) { setPinMsg('PIN must be exactly 4 digits'); return }
    setPin(newPin)
    setNewPin('')
    setPinMsg('PIN updated ✓')
    setTimeout(() => setPinMsg(''), 3000)
  }

  return (
    <div className="flex gap-0 -mx-4 sm:-mx-6 -my-8 h-[calc(100vh-8rem)]">

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 border-r border-border flex flex-col bg-sidebar hidden sm:flex">
        <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Sheets</span>
          <button
            onClick={() => selectSheet(null)}
            className="h-6 w-6 rounded-[var(--radius-sm)] border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
            title="New sheet"
          >
            <Plus size={12} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {sheets.map(s => (
            <button
              key={s.id}
              onClick={() => selectSheet(s.id)}
              className={cn(
                'w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-sidebar-accent/10 transition-colors text-sm',
                active === s.id && 'bg-primary/10 border-l-2 border-l-primary text-primary'
              )}
            >
              <FileText size={13} className="flex-shrink-0 text-muted-foreground" />
              <span className="truncate">{s.title}</span>
            </button>
          ))}
          {sheets.length === 0 && (
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

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Toolbar */}
        <div className="h-11 border-b border-border flex items-center px-4 gap-2 flex-shrink-0">
          <div className="flex items-center gap-1 mr-auto">
            {(['edit', 'split', 'preview']).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'h-7 px-2.5 rounded-[var(--radius-sm)] text-xs font-medium transition-colors capitalize',
                  view === v ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {v === 'edit' && <Code2 size={12} className="inline mr-1" />}
                {v === 'preview' && <Eye size={12} className="inline mr-1" />}
                {v}
              </button>
            ))}
          </div>

          {dirty && <Badge variant="outline" className="text-muted-foreground text-xs">unsaved</Badge>}
          {saved && <Badge className="text-xs">Saved ✓</Badge>}

          <Button size="sm" onClick={save} className="gap-1.5">
            <Save size={13} />
            <span>Save</span>
            <span className="hidden sm:block text-primary-foreground/60 text-xs font-mono">⌘S</span>
          </Button>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="border-b border-border bg-muted/30 px-4 py-4 flex flex-wrap items-end gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <Lock size={11} /> Change PIN
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="New 4-digit PIN"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  maxLength={4}
                  className="w-40 font-mono"
                />
                <Button size="sm" variant="outline" onClick={savePin}>Update</Button>
              </div>
              {pinMsg && <p className="text-xs text-primary">{pinMsg}</p>}
            </div>
          </div>
        )}

        {/* Meta fields */}
        <div className="border-b border-border px-4 py-2.5 flex flex-wrap gap-3 flex-shrink-0">
          <Input
            placeholder="Title"
            value={form.title}
            onChange={e => handleChange('title', e.target.value)}
            className="flex-1 min-w-36 h-8 text-sm font-medium"
          />
          <Input
            placeholder="slug-auto-generated"
            value={form.slug}
            onChange={e => handleChange('slug', e.target.value)}
            className="flex-1 min-w-36 h-8 text-xs font-mono text-muted-foreground"
          />
          <Input
            placeholder="Category"
            value={form.category}
            onChange={e => handleChange('category', e.target.value)}
            className="w-36 h-8 text-sm"
          />
        </div>

        {/* Edit / Preview panes */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Editor */}
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

          {/* Preview */}
          {(view === 'preview' || view === 'split') && (
            <div className={cn('flex flex-col overflow-hidden', view === 'split' ? 'w-1/2' : 'flex-1')}>
              <div className="px-3 py-1.5 border-b border-border/50 flex items-center gap-1.5">
                <Eye size={11} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono">preview</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {form.content
                  ? <MarkdownViewer content={form.content} />
                  : <p className="text-sm text-muted-foreground italic">Nothing to preview yet</p>
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
