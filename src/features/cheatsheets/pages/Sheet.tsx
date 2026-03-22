import { useState } from 'react'
import { ArrowLeft, Clock, Pencil, Trash2 } from 'lucide-react'
import { getSheet, deleteDraft, isAuthenticated } from '../lib/storage'
import { MarkdownViewer } from '../components/MarkdownViewer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Props {
  slug: string
  onBack: () => void
  onEdit: (id: string) => void
}

export function Sheet({ slug, onBack, onEdit }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sheet  = getSheet(slug)
  const authed = isAuthenticated()

  if (!sheet) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-muted-foreground">Cheatsheet not found.</p>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={14} className="mr-1" /> Back
        </Button>
      </div>
    )
  }

  function handleDelete() {
    if (!sheet) return
    if (sheet.source === 'file') {
      alert(`"${sheet.title}" is committed to the repo.\nDelete content/${sheet.slug}.md and push to remove it.`)
      return
    }
    if (confirmDelete) {
      deleteDraft(sheet.id)
      onBack()
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-6 py-4 max-w-3xl">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
      >
        <ArrowLeft size={14} /> All sheets
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div className="flex flex-col gap-2">
          {sheet.category && <Badge>{sheet.category}</Badge>}
          <h1 className="text-2xl font-light" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {sheet.title}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock size={11} />
            Updated {new Date(sheet.updatedAt).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
            {sheet.source === 'draft' && (
              <Badge variant="outline" className="ml-1 text-amber-500 border-amber-500/30">draft</Badge>
            )}
          </div>
        </div>
        {authed && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => onEdit(sheet.id)}>
              <Pencil size={13} /> Edit
            </Button>
            <Button
              variant={confirmDelete ? 'destructive' : 'outline'}
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 size={13} />
              {confirmDelete ? 'Confirm?' : 'Delete'}
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <MarkdownViewer content={sheet.content} />
    </div>
  )
}
