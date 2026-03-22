/**
 * sheets.ts — build-time glob import of all content/*.md files.
 * Drop a .md file in content/ at the repo root and push.
 * Vite picks it up automatically — no registration needed.
 *
 * Frontmatter (all optional):
 *   ---
 *   title: My Cheatsheet
 *   category: Deployment
 *   date: 2026-03-21
 *   ---
 */

// Glob path is relative to THIS file: src/features/cheatsheets/lib/
// content/ is at the repo root → ../../../../content/
const modules = import.meta.glob('../../../../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export interface Sheet {
  id: string
  slug: string
  title: string
  category: string
  createdAt: string
  updatedAt: string
  content: string
  source: 'file' | 'draft' | 'gist'
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
  const match = raw.match(FM_RE)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx > 0) {
      meta[line.slice(0, colonIdx).trim()] = line.slice(colonIdx + 1).trim()
    }
  }
  return { meta, body: raw.slice(match[0].length) }
}

function titleFromBody(body: string, slug: string): string {
  const match = body.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

export function buildFileSheets(): Sheet[] {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = slugFromPath(path)
      const { meta, body } = parseFrontmatter(raw)
      return {
        id:        slug,
        slug,
        title:     meta['title']    ?? titleFromBody(body, slug),
        category:  meta['category'] ?? 'General',
        createdAt: meta['date'] ? new Date(meta['date']).toISOString() : new Date(0).toISOString(),
        updatedAt: meta['date'] ? new Date(meta['date']).toISOString() : new Date(0).toISOString(),
        content:   body,
        source:    'file' as const,
      }
    })
    .sort((a, b) => {
      const d = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      return d !== 0 ? d : a.title.localeCompare(b.title)
    })
}
