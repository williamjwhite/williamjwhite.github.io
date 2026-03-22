const STORAGE_KEY = 'wjw_cheatsheets'
const PIN_KEY     = 'wjw_cs_pin'
const SESSION_KEY = 'wjw_cs_auth'

// ── Default cheatsheet (seeded on first load) ────────────────
const DEFAULT_SHEETS = [
  {
    id: 'subdomains-vs-subpaths',
    slug: 'subdomains-vs-subpaths',
    title: 'Subdomains vs. Subpaths',
    category: 'Deployment',
    createdAt: new Date('2026-03-21').toISOString(),
    updatedAt: new Date('2026-03-21').toISOString(),
    content: `# Subdomains vs. Subpaths

> **Use case:** Deciding between \`delivery.williamjwhite.me\` and \`williamjwhite.me/delivery-tracker\`

---

## What's the Difference?

### \`delivery.williamjwhite.me\` — Subdomain

Treats "delivery" as a **separate host**. It has its own DNS record, its own SSL certificate, and is completely independent of whatever lives at \`williamjwhite.me\`.

**Setup requires:**

- A **CNAME DNS record** at your domain registrar: \`delivery\` → \`yourusername.github.io\`
- A **\`CNAME\` file** in the root of your GitHub repo containing exactly:
  \`\`\`
  delivery.williamjwhite.me
  \`\`\`
- GitHub Pages enabled on the repo (Settings → Pages → branch)

**What does the \`CNAME\` file actually do?**

It tells GitHub's CDN/edge network which custom domain should route to your repo. Without it, GitHub's servers don't know to serve your repo when someone visits \`delivery.williamjwhite.me\`. It's a single-line file with no extension — just the bare domain name.

---

### \`williamjwhite.me/delivery-tracker\` — Subpath

A route **within your main site**. Same host, same SSL cert, same DNS record as your root domain.

**Setup requires:**

- Your main site must already be serving \`williamjwhite.me\`
- The tracker must be one of:
  - A **subfolder** in the same repo (e.g. \`/delivery-tracker/index.html\`)
  - A **framework route** (e.g. Next.js App Router, React Router)
  - A **reverse proxy rule** if the app is hosted separately behind the scenes
- No separate DNS record needed
- No \`CNAME\` file

---

## Side-by-Side Comparison

| | \`delivery.williamjwhite.me\` | \`williamjwhite.me/delivery-tracker\` |
|---|---|---|
| DNS record needed | Yes — CNAME at registrar | No (uses existing) |
| \`CNAME\` file in repo | Yes | No |
| Own GitHub repo | Yes (fully independent) | No (shares main site) |
| SSL certificate | Separate (GitHub auto-provisions) | Shared with root domain |
| Independence | Fully isolated | Coupled to main site setup |
| Best for | Standalone apps/tools | Sections of a unified site |

---

## The \`CNAME\` File — Quick Reference

| Property | Detail |
|---|---|
| Filename | \`CNAME\` (no extension, uppercase) |
| Location | Root of the GitHub repo |
| Contents | One line: the full custom domain |
| Example | \`delivery.williamjwhite.me\` |
| Purpose | Tells GitHub Pages which domain maps to this repo |
| Without it | GitHub serves the default \`*.github.io\` URL only |

---

*Last updated: March 2026*
`,
  },
]

export function getSheets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) { setSheets(DEFAULT_SHEETS); return DEFAULT_SHEETS }
    return JSON.parse(raw)
  } catch { return DEFAULT_SHEETS }
}

export function setSheets(sheets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sheets))
}

export function getSheet(slug) {
  return getSheets().find(s => s.slug === slug) ?? null
}

export function saveSheet(sheet) {
  const sheets = getSheets()
  const idx = sheets.findIndex(s => s.id === sheet.id)
  const now = new Date().toISOString()
  if (idx >= 0) {
    sheets[idx] = { ...sheets[idx], ...sheet, updatedAt: now }
  } else {
    sheets.push({ ...sheet, createdAt: now, updatedAt: now })
  }
  setSheets(sheets)
  return sheets
}

export function deleteSheet(id) {
  const sheets = getSheets().filter(s => s.id !== id)
  setSheets(sheets)
  return sheets
}

export function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── PIN auth ─────────────────────────────────────────────────
export function getPin() {
  return localStorage.getItem(PIN_KEY) ?? '1234'
}
export function setPin(pin) {
  localStorage.setItem(PIN_KEY, pin)
}
export function isAuthenticated() {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}
export function authenticate(pin) {
  if (pin === getPin()) {
    sessionStorage.setItem(SESSION_KEY, 'true')
    return true
  }
  return false
}
export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}
