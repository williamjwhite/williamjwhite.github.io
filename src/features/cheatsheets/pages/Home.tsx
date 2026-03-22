import { useState, useMemo } from 'react'
import { Search, FileText, ChevronRight, Tag, PenLine, Lock, Unlock } from 'lucide-react'
import { getSheets, isAuthenticated, logout } from '../lib/storage'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  onOpenSheet: (slug: string) => void
  onOpenEditor: () => void
}

export function Home({ onOpenSheet, onOpenEditor }: Props) {
  const [query, setQuery] = useState('')
  const [authed, setAuthed] = useState(isAuthenticated())
  const sheets = getSheets()

  const categories = useMemo(() =>
    [...new Set(sheets.map(s => s.category).filter(Boolean))], [sheets])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return sheets.filter(s =>
      !q ||
      s.title.toLowerCase().includes(q) ||
      (s.category ?? '').toLowerCase().includes(q) ||
      s.content.toLowerCase().includes(q)
    )
  }, [sheets, query])

  const grouped = useMemo(() =>
    filtered.reduce<Record<string, typeof filtered>>((acc, s) => {
      const cat = s.category ?? 'Uncategorised'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(s)
      return acc
    }, {}), [filtered])

  function handleLockClick() {
    if (authed) {
      // Already in — go straight to editor
      onOpenEditor()
    } else {
      // Not authed — navigate to editor which will show PIN gate
      onOpenEditor()
    }
  }

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-light" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Cheatsheets
          </h2>
          <p className="text-sm text-muted-foreground">
            Quick-reference guides for deployment, tooling, and dev patterns.
          </p>
        </div>

        {/* Toolbar — always visible */}
        <div className="flex items-center gap-1.5 shrink-0">
          {authed && (
            <>
              <Button size="sm" variant="outline" onClick={onOpenEditor} className="gap-1.5">
                <PenLine size={13} />
                <span className="hidden sm:block">New sheet</span>
              </Button>
              <button
                onClick={handleLogout}
                title="Lock editor"
                className="h-8 w-8 rounded-[var(--radius-sm)] border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Unlock size={14} />
              </button>
            </>
          )}
          {!authed && (
            <button
              onClick={handleLockClick}
              title="Open editor"
              className="h-8 w-8 rounded-[var(--radius-sm)] border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Lock size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search cheatsheets…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
        <span>{sheets.length} sheet{sheets.length !== 1 ? 's' : ''}</span>
        <span>·</span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag size={11} />
          {categories.map(c => (
            <Badge key={c} variant="outline">{c}</Badge>
          ))}
        </div>
      </div>

      {/* Grid */}
      {Object.entries(grouped).length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">
          {query ? 'No results.' : 'No cheatsheets yet — add one in the editor.'}
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="flex flex-col gap-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{cat}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map(sheet => (
                <button
                  key={sheet.id}
                  onClick={() => onOpenSheet(sheet.slug)}
                  className="group text-left flex flex-col gap-2 p-4 rounded-[var(--radius)] border border-border bg-card hover:border-primary/40 hover:shadow-[var(--shadow-sm)] transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-8 w-8 rounded-[var(--radius-sm)] bg-primary/10 border border-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <FileText size={14} className="text-primary" />
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground mt-1 group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground leading-snug group-hover:text-primary transition-colors">
                      {sheet.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">{sheet.slug}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-auto pt-1 border-t border-border/50">
                    {sheet.content.replace(/[#*`>|_~[\]]/g, '').slice(0, 120)}…
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
