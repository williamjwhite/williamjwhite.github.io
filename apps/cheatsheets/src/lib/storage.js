import { buildFileSheets } from './sheets.js'

const DRAFTS_KEY   = 'wjw_cs_drafts'
const PIN_KEY      = 'wjw_cs_pin'
const SESSION_KEY  = 'wjw_cs_auth'
const STORAGE_CFG  = 'wjw_cs_storage_cfg'

// ── File sheets (build-time, immutable at runtime) ────────────
let _fileSheets = null
function fileSheets() {
  if (!_fileSheets) _fileSheets = buildFileSheets()
  return _fileSheets
}

// ── Storage config ─────────────────────────────────────────────
export const STORAGE_MODES = {
  DOWNLOAD : 'download',   // manual download → commit to repo
  GIST     : 'gist',       // GitHub Gist (private) via token
  GDRIVE   : 'gdrive',     // Google Drive via picker API
}

export function getStorageCfg() {
  try {
    const raw = localStorage.getItem(STORAGE_CFG)
    return raw ? JSON.parse(raw) : { mode: STORAGE_MODES.DOWNLOAD }
  } catch { return { mode: STORAGE_MODES.DOWNLOAD } }
}

export function setStorageCfg(cfg) {
  localStorage.setItem(STORAGE_CFG, JSON.stringify(cfg))
}

// ── Draft sheets (localStorage) ────────────────────────────────
export function getDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}
function setDrafts(drafts) { localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts)) }

// ── Merged sheet list ──────────────────────────────────────────
export function getSheets() {
  const files     = fileSheets()
  const drafts    = getDrafts()
  const fileSlugs = new Set(files.map(s => s.slug))
  return [...files, ...drafts.filter(d => !fileSlugs.has(d.slug))]
}

export function getSheet(slug) {
  return fileSheets().find(s => s.slug === slug)
      ?? getDrafts().find(s => s.slug === slug)
      ?? null
}

export function getDraft(slug) {
  return getDrafts().find(d => d.slug === slug) ?? null
}

export function saveDraft(sheet) {
  const drafts = getDrafts()
  const idx    = drafts.findIndex(d => d.id === sheet.id)
  const now    = new Date().toISOString()
  const draft  = { ...sheet, updatedAt: now, source: 'draft' }
  if (idx >= 0) { drafts[idx] = { ...drafts[idx], ...draft } }
  else          { drafts.push({ ...draft, createdAt: now }) }
  setDrafts(drafts)
  return draft
}

export function deleteDraft(id) {
  setDrafts(getDrafts().filter(d => d.id !== id))
}

// ── Frontmatter builder ────────────────────────────────────────
export function sheetToMarkdown(sheet) {
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

// ── Save dispatcher ────────────────────────────────────────────
/**
 * saveSheet(sheet) — routes to the configured backend.
 * Returns { ok: boolean, message: string }
 */
export async function saveSheet(sheet) {
  const cfg = getStorageCfg()
  // Always keep a local draft regardless of backend
  saveDraft(sheet)

  switch (cfg.mode) {
    case STORAGE_MODES.GIST:
      return saveToGist(sheet, cfg)
    case STORAGE_MODES.GDRIVE:
      return saveToGDrive(sheet, cfg)
    default:
      return downloadSheet(sheet)
  }
}

// ── Download (default) ─────────────────────────────────────────
export function downloadSheet(sheet) {
  const md   = sheetToMarkdown(sheet)
  const blob = new Blob([md], { type: 'text/markdown' })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), {
    href: url,
    download: `${sheet.slug || slugify(sheet.title)}.md`,
  })
  a.click()
  URL.revokeObjectURL(url)
  return { ok: true, message: `Downloaded ${sheet.slug}.md — commit to content/` }
}

// ── GitHub Gist ────────────────────────────────────────────────
/**
 * Saves the sheet as a file inside a private Gist.
 * cfg: { mode, gistId, gistToken }
 *
 * On first save (no gistId) it creates a new private Gist and
 * saves the returned ID back to config so all future saves patch
 * the same Gist.
 *
 * The Gist acts as a persistent cloud store — every .md file in it
 * is one cheatsheet. A future CI step can pull from the Gist and
 * copy files into content/ automatically (see README for workflow).
 */
async function saveToGist(sheet, cfg) {
  const { gistToken, gistId } = cfg
  if (!gistToken) return { ok: false, message: 'No Gist token configured. Add it in Settings.' }

  const filename = `${sheet.slug || slugify(sheet.title)}.md`
  const body = {
    description: 'wjw-cheatsheets',
    public: false,
    files: { [filename]: { content: sheetToMarkdown(sheet) } },
  }

  try {
    let res, data

    if (gistId) {
      // PATCH existing gist
      res  = await fetch(`https://api.github.com/gists/${gistId}`, {
        method  : 'PATCH',
        headers : { Authorization: `Bearer ${gistToken}`, 'Content-Type': 'application/json' },
        body    : JSON.stringify(body),
      })
    } else {
      // POST new gist
      res  = await fetch('https://api.github.com/gists', {
        method  : 'POST',
        headers : { Authorization: `Bearer ${gistToken}`, 'Content-Type': 'application/json' },
        body    : JSON.stringify(body),
      })
    }

    data = await res.json()
    if (!res.ok) return { ok: false, message: data.message ?? 'Gist API error' }

    // Persist the gistId if this was a first-time create
    if (!gistId) setStorageCfg({ ...cfg, gistId: data.id })

    return { ok: true, message: `Saved to Gist · ${filename}` }
  } catch (e) {
    return { ok: false, message: `Gist error: ${e.message}` }
  }
}

/**
 * Lists all .md files in the configured Gist and returns them
 * as sheet objects — used by the editor sidebar to show Gist sheets.
 */
export async function listGistSheets(cfg) {
  const { gistToken, gistId } = cfg
  if (!gistToken || !gistId) return []
  try {
    const res  = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: { Authorization: `Bearer ${gistToken}` },
    })
    const data = await res.json()
    if (!res.ok) return []
    return Object.entries(data.files)
      .filter(([name]) => name.endsWith('.md'))
      .map(([name, file]) => {
        const slug = name.replace(/\.md$/, '')
        return { id: `gist-${slug}`, slug, title: slug.replace(/-/g, ' '), source: 'gist', content: file.content ?? '' }
      })
  } catch { return [] }
}

// ── Google Drive ───────────────────────────────────────────────
/**
 * Saves to Google Drive using the Picker API + Drive REST API.
 * cfg: { mode, gdriveToken, gdriveFolderId }
 *
 * gdriveToken must be a valid OAuth2 access token — see Settings
 * for how to obtain one via the Google Identity Services flow.
 */
async function saveToGDrive(sheet, cfg) {
  const { gdriveToken, gdriveFolderId } = cfg
  if (!gdriveToken) return { ok: false, message: 'No Google Drive token. Connect Drive in Settings.' }

  const filename = `${sheet.slug || slugify(sheet.title)}.md`
  const md       = sheetToMarkdown(sheet)

  const meta = JSON.stringify({
    name    : filename,
    mimeType: 'text/markdown',
    ...(gdriveFolderId ? { parents: [gdriveFolderId] } : {}),
  })

  const form = new FormData()
  form.append('metadata', new Blob([meta], { type: 'application/json' }))
  form.append('file',     new Blob([md],   { type: 'text/markdown'   }))

  try {
    const res  = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method  : 'POST',
      headers : { Authorization: `Bearer ${gdriveToken}` },
      body    : form,
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, message: data.error?.message ?? 'Drive API error' }
    return { ok: true, message: `Saved to Drive · ${filename}` }
  } catch (e) {
    return { ok: false, message: `Drive error: ${e.message}` }
  }
}

// ── Helpers ────────────────────────────────────────────────────
export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export function getPin()  { return localStorage.getItem(PIN_KEY) ?? '1234' }
export function setPin(p) { localStorage.setItem(PIN_KEY, p) }

export function isAuthenticated() { return sessionStorage.getItem(SESSION_KEY) === 'true' }
export function authenticate(pin) {
  if (pin === getPin()) { sessionStorage.setItem(SESSION_KEY, 'true'); return true }
  return false
}
export function logout() { sessionStorage.removeItem(SESSION_KEY) }
