import { useParams, Link, useNavigate } from 'react-router-dom'
import { getSheet, deleteDraft, isAuthenticated } from '@/lib/storage'
import { MarkdownViewer } from '@/components/MarkdownViewer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, ArrowLeft, Clock } from 'lucide-react'
import { useState } from 'react'

export function Sheet() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const sheet = getSheet(slug)
  const authed = isAuthenticated()

  if (!sheet) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-muted-foreground">Cheatsheet not found.</p>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/cheatsheets/"><ArrowLeft size={14} className="mr-1" /> Back</Link>
        </Button>
      </div>
    )
  }

  function handleDelete() {
    if (confirmDelete) {
      deleteDraft(sheet.id)
      navigate('/cheatsheets/')
    } else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
        <div className="flex flex-col gap-2">
          {sheet.category && <Badge>{sheet.category}</Badge>}
          <h1 className="text-2xl font-light" style={{ fontFamily: "'Instrument Serif', serif" }}>
            {sheet.title}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Clock size={11} />
            Updated {new Date(sheet.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
        {authed && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/cheatsheets/editor?id=${sheet.id}`}>
                <Pencil size={13} /> Edit
              </Link>
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
