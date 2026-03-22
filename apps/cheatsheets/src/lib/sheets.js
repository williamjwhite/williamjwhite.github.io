/**
 * sheets.js — build-time file index
 *
 * Vite's import.meta.glob scans content/*.md at build time.
 * Every file in that folder is automatically included — no registration needed.
 * Just drop a .md file in content/ and push.
 *
 * Frontmatter format (optional — all fields have fallbacks):
 *   ---
 *   title: My Cheatsheet
 *   category: Deployment
 *   date: 2026-03-21
 *   ---
 */

// Eagerly import every .md file as raw text
const modules = import.meta.glob('../../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/**
 * Parse optional YAML-ish frontmatter block.
 * Supports: title, category, date (all optional, no deps needed).
 */
function parseFrontmatter(raw) {
  const FM_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
  const match = raw.match(FM_RE)
  if (!match) return { meta: {}, body: raw }

  const meta = {}
  for (const line of match[1].split('\n')) {
    const [key, ...rest] = line.split(':')
    if (key && rest.length) meta[key.trim()] = rest.join(':').trim()
  }
  return { meta, body: raw.slice(match[0].length) }
}

/**
 * Derive a human-readable title from the first # heading,
 * falling back to the filename slug.
 */
function titleFromBody(body, slug) {
  const match = body.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Convert a file path like /content/github-actions.md → 'github-actions'
 */
function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

/**
 * Build the full sheet index from all content/*.md files.
 * Returns an array sorted by date desc, then title asc.
 */
export function buildFileSheets() {
  return Object.entries(modules)
    .map(([path, raw]) => {
      const slug = slugFromPath(path)
      const { meta, body } = parseFrontmatter(raw)

      return {
        id:        slug,                                         // stable — derived from filename
        slug,
        title:     meta.title    ?? titleFromBody(body, slug),
        category:  meta.category ?? 'General',
        createdAt: meta.date     ? new Date(meta.date).toISOString() : new Date(0).toISOString(),
        updatedAt: meta.date     ? new Date(meta.date).toISOString() : new Date(0).toISOString(),
        content:   body,
        source:    'file',                                       // marks this as repo-managed
      }
    })
    .sort((a, b) => {
      // Newest first; tie-break alphabetically by title
      const dateDiff = new Date(b.updatedAt) - new Date(a.updatedAt)
      return dateDiff !== 0 ? dateDiff : a.title.localeCompare(b.title)
    })
}
