import { buildFileSheets, type Sheet } from './sheets'

const DRAFTS_KEY  = 'wjw_cs_drafts'
const PIN_KEY     = 'wjw_cs_pin'
const SESSION_KEY = 'wjw_cs_auth'
const STORAGE_CFG = 'wjw_cs_storage_cfg'

// ── File sheets (build-time, immutable at runtime) ──────────────
let _fileSheets: Sheet[] | null = null
function fileSheets(): Sheet[] {
  if (!_fileSheets) _fileSheets = buildFileSheets()
  return _fileSheets
}

// ── Storage config ───────────────────────────────────────────────
export const STORAGE_MODES = {
  DOWNLOAD : 'download',
  GIST     : 'gist',
  GDRIVE   : 'gdrive',
} as const

export type StorageMode = typeof STORAGE_MODES[keyof typeof STORAGE_MODES]

export interface StorageCfg {
  mode:           StorageMode
  gistToken:      string
  gistId:         string
  gdriveToken:    string
  gdriveFolderId: string
}

export interface SaveResult {
  ok:      boolean
  message: string
}

/**
 * Config priority (highest → lowest):
 *   1. localStorage (user set via Settings UI)
 *   2. VITE_CS_GIST_TOKEN / VITE_CS_GIST_ID (build-time, cheatsheets-specific)
 *
 * Intentionally separate from VITE_GIST_TOKEN / VITE_GIST_ID
 * which are reserved for the admin page.
 */
export function getStorageCfg(): StorageCfg {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_CFG) ?? '{}') as Partial<StorageCfg>
    const envToken = import.meta.env['VITE_CS_GIST_TOKEN'] as string ?? ''
    const envId    = import.meta.env['VITE_CS_GIST_ID']    as string ?? ''
    return {
      mode:           saved.mode           ?? (envToken ? STORAGE_MODES.GIST : STORAGE_MODES.DOWNLOAD),
      gistToken:      saved.gistToken      ?? envToken,
      gistId:         saved.gistId         ?? envId,
      gdriveToken:    saved.gdriveToken    ?? '',
      gdriveFolderId: saved.gdriveFolderId ?? '',
    }
  } catch {
    return {
      mode:           STORAGE_MODES.DOWNLOAD,
      gistToken:      import.meta.env['VITE_CS_GIST_TOKEN'] as string ?? '',
      gistId:         import.meta.env['VITE_CS_GIST_ID']    as string ?? '',
      gdriveToken:    '',
      gdriveFolderId: '',
    }
  }
}

export function setStorageCfg(cfg: StorageCfg): void {
  localStorage.setItem(STORAGE_CFG, JSON.stringify(cfg))
}

// ── Draft sheets (localStorage) ──────────────────────────────────
export function getDrafts(): Sheet[] {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    return raw ? (JSON.parse(raw) as Sheet[]) : []
  } catch { return [] }
}

function setDrafts(drafts: Sheet[]): void {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts))
}

// ── Merged sheet list ─────────────────────────────────────────────
export function getSheets(): Sheet[] {
  const files     = fileSheets()
  const drafts    = getDrafts()
  const fileSlugs = new Set(files.map(s => s.slug))
  return [...files, ...drafts.filter(d => !fileSlugs.has(d.slug))]
}

export function getSheet(slug: string): Sheet | null {
  return fileSheets().find(s => s.slug === slug)
      ?? getDrafts().find(s => s.slug === slug)
      ?? null
}

export function getDraft(slug: string): Sheet | null {
  return getDrafts().find(d => d.slug === slug) ?? null
}

export function saveDraft(sheet: Sheet): Sheet {
  const drafts = getDrafts()
  const idx    = drafts.findIndex(d => d.id === sheet.id)
  const now    = new Date().toISOString()
  const draft: Sheet = { ...sheet, updatedAt: now, source: 'draft' }
  if (idx >= 0) { drafts[idx] = { ...drafts[idx], ...draft } }
  else          { drafts.push({ ...draft, createdAt: now }) }
  setDrafts(drafts)
  return draft
}

export function deleteDraft(id: string): void {
  setDrafts(getDrafts().filter(d => d.id !== id))
}

// ── Frontmatter builder ───────────────────────────────────────────
export function sheetToMarkdown(sheet: Sheet): string {
  return [
    '---',
    `title: ${sheet.title}`,
    `category: ${sheet.category || 'General'}`,
    `date: ${new Date().toISOString().slice(0, 10)}`,
    '---',
    '',
    sheet.content,
  ].join('\n')
}

// ── Save dispatcher ───────────────────────────────────────────────
export async function saveSheet(sheet: Sheet): Promise<SaveResult> {
  const cfg = getStorageCfg()
  saveDraft(sheet)
  switch (cfg.mode) {
    case STORAGE_MODES.GIST:   return saveToGist(sheet, cfg)
    case STORAGE_MODES.GDRIVE: return saveToGDrive(sheet, cfg)
    default:                   return downloadSheet(sheet)
  }
}

// ── Download ──────────────────────────────────────────────────────
export function downloadSheet(sheet: Sheet): SaveResult {
  const blob = new Blob([sheetToMarkdown(sheet)], { type: 'text/markdown' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `${sheet.slug || slugify(sheet.title)}.md`,
  })
  a.click()
  URL.revokeObjectURL(url)
  return { ok: true, message: `Downloaded ${sheet.slug}.md — commit to content/` }
}

// ── GitHub Gist ───────────────────────────────────────────────────
async function saveToGist(sheet: Sheet, cfg: StorageCfg): Promise<SaveResult> {
  const { gistToken, gistId } = cfg
  if (!gistToken) return {
    ok: false,
    message: 'No Gist token. Add VITE_CS_GIST_TOKEN to repo secrets or paste in Settings.',
  }

  const filename = `${sheet.slug || slugify(sheet.title)}.md`
  const payload  = {
    description: 'wjw-cheatsheets',
    public: false,
    files: { [filename]: { content: sheetToMarkdown(sheet) } },
  }
  const headers = { Authorization: `Bearer ${gistToken}`, 'Content-Type': 'application/json' }

  try {
    const res  = await fetch(
      gistId ? `https://api.github.com/gists/${gistId}` : 'https://api.github.com/gists',
      { method: gistId ? 'PATCH' : 'POST', headers, body: JSON.stringify(payload) }
    )
    const data = await res.json() as { id?: string; message?: string }
    if (!res.ok) return { ok: false, message: data.message ?? 'Gist API error' }
    if (!gistId && data.id) setStorageCfg({ ...cfg, gistId: data.id })
    return { ok: true, message: `Saved to Gist · ${filename}` }
  } catch (e) {
    return { ok: false, message: `Gist error: ${e instanceof Error ? e.message : String(e)}` }
  }
}

// ── Google Drive ──────────────────────────────────────────────────
async function saveToGDrive(sheet: Sheet, cfg: StorageCfg): Promise<SaveResult> {
  const { gdriveToken, gdriveFolderId } = cfg
  if (!gdriveToken) return { ok: false, message: 'No Drive token. Connect Google Drive in Settings.' }

  const filename = `${sheet.slug || slugify(sheet.title)}.md`
  const meta     = JSON.stringify({
    name: filename, mimeType: 'text/markdown',
    ...(gdriveFolderId ? { parents: [gdriveFolderId] } : {}),
  })
  const form = new FormData()
  form.append('metadata', new Blob([meta],                    { type: 'application/json' }))
  form.append('file',     new Blob([sheetToMarkdown(sheet)],  { type: 'text/markdown'   }))

  try {
    const res  = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      { method: 'POST', headers: { Authorization: `Bearer ${gdriveToken}` }, body: form }
    )
    const data = await res.json() as { error?: { message?: string } }
    if (!res.ok) return { ok: false, message: data.error?.message ?? 'Drive API error' }
    return { ok: true, message: `Saved to Drive · ${filename}` }
  } catch (e) {
    return { ok: false, message: `Drive error: ${e instanceof Error ? e.message : String(e)}` }
  }
}

// ── Helpers ───────────────────────────────────────────────────────
export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function getPin(): string {
  return localStorage.getItem(PIN_KEY)
      ?? (import.meta.env['VITE_EDITOR_PIN'] as string | undefined)
      ?? '1234'
}
export function setPin(p: string): void { localStorage.setItem(PIN_KEY, p) }

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}
export function authenticate(pin: string): boolean {
  if (pin === getPin()) { sessionStorage.setItem(SESSION_KEY, 'true'); return true }
  return false
}
export function logout(): void { sessionStorage.removeItem(SESSION_KEY) }
