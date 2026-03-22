# Cheatsheet Storage — Setup & Persistence Guide

Three backends are available. Pick one. You can switch at any time in
**Editor → Settings → Storage Backend**.

---

## Option A — Download .md (default, no setup)

**Best for:** infrequent edits, already comfortable with git.

### How it works
1. Write your sheet in the editor
2. Click **Save** → a `.md` file downloads to `~/Downloads`
3. Move it into the repo and push:

```bash
mv ~/Downloads/my-sheet.md \
   /path/to/williamjwhite.github.io/apps/cheatsheets/content/

cd /path/to/williamjwhite.github.io
git add apps/cheatsheets/content/my-sheet.md
git commit -m "add: my-sheet cheatsheet"
git push
```

4. GitHub Actions picks it up → live on next deploy (~60s)

### Persistence
Sheets are committed to the repo. They survive everything — browser clears,
device changes, redeploys.

---

## Option B — GitHub Gist (recommended, ~5 min setup)

**Best for:** editing from any device, no git required after setup.

### How it works
- Each sheet is a file inside a **single private Gist** on your account
- Saving hits the GitHub Gist API directly from the browser
- A CI step pulls updated files from the Gist into `content/` on each deploy

### Step 1 — Create a Fine-Grained Token

1. Go to **github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Click **Generate new token**
3. Set:
   - **Token name:** `wjw-cheatsheets-gist`
   - **Expiration:** No expiration (or 1 year, your call)
   - **Repository access:** Public repositories (Gists are separate from repos)
   - **Permissions → Account permissions → Gists:** Read and Write
4. Copy the token — you only see it once

### Step 2 — Add the token to your repo secret

This lets CI pull from the Gist during builds:

```
GitHub repo → Settings → Secrets and variables → Actions → New repository secret

Name:  GIST_TOKEN
Value: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3 — Configure the editor

1. Go to `/cheatsheets/editor` → **Settings → Storage Backend → GitHub Gist**
2. Paste your token into **Personal Access Token**
3. Leave **Gist ID** blank — it's created automatically on first save
4. Click **Save config**

> The token is stored in `localStorage` only. It is never sent anywhere
> except `api.github.com`. It does not go through any intermediary.

### Step 4 — Add the Gist sync step to `pages.yml`

After the cheatsheets `npm ci` step, add:

```yaml
- name: Sync sheets from Gist
  if: env.GIST_TOKEN != '' && env.GIST_ID != ''
  env:
    GIST_TOKEN: ${{ secrets.GIST_TOKEN }}
    GIST_ID:    ${{ secrets.GIST_ID }}
  run: |
    mkdir -p apps/cheatsheets/content
    # Fetch all .md files from the Gist and write them to content/
    curl -s -H "Authorization: Bearer $GIST_TOKEN" \
      "https://api.github.com/gists/$GIST_ID" \
    | python3 - << 'PYEOF'
import sys, json, os, urllib.request

data  = json.load(sys.stdin)
token = os.environ["GIST_TOKEN"]
dest  = "apps/cheatsheets/content"

for name, meta in data["files"].items():
    if not name.endswith(".md"):
        continue
    # Fetch raw content (may be truncated in the list response)
    req = urllib.request.Request(
        meta["raw_url"],
        headers={"Authorization": f"Bearer {token}"}
    )
    content = urllib.request.urlopen(req).read()
    path    = os.path.join(dest, name)
    with open(path, "wb") as f:
        f.write(content)
    print(f"  ✓ {name}")
PYEOF
```

Then add `GIST_ID` as a repo secret after your first save from the editor
(the Gist ID is shown in the editor status bar after first save, and also
visible in your browser's `localStorage` as `wjw_cs_storage_cfg`).

### Persistence
- Sheets live in the private Gist on your GitHub account
- They survive browser clears, device changes, redeploys
- CI pulls them in at build time → committed content wins over Gist for public display

---

## Option C — Google Drive

**Best for:** non-technical editing from mobile/tablet, sharing with collaborators.

### Step 1 — Get an OAuth token (quick method)

1. Go to **developers.google.com/oauthplayground**
2. In the top-right gear icon → check **Use your own OAuth credentials** (optional, can skip)
3. In the left panel, find **Drive API v3** → select `https://www.googleapis.com/auth/drive.file`
4. Click **Authorize APIs** → sign in with your Google account
5. Click **Exchange authorization code for tokens**
6. Copy the **Access token** (starts with `ya29.`)

> Access tokens expire after **1 hour**. For a permanent setup, you'd need
> a proper OAuth2 flow with a refresh token — the playground method is fine
> for personal use if you're okay refreshing occasionally.

### Step 2 — Get your folder ID (optional)

1. Open Google Drive → create a folder called `cheatsheets`
2. Open the folder — the URL will look like:
   `https://drive.google.com/drive/folders/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms`
3. Copy the ID (the long string after `/folders/`)

### Step 3 — Configure the editor

1. Go to `/cheatsheets/editor` → **Settings → Storage Backend → Google Drive**
2. Paste your access token and folder ID
3. Click **Save config**

### Persistence
- Sheets live in your Google Drive as `.md` files
- They do **not** auto-sync back to the repo — you'd need to download them
  from Drive and commit to `content/` to publish them on the live site

---

## Summary

| | Download .md | GitHub Gist | Google Drive |
|---|---|---|---|
| Setup time | None | ~5 min | ~5 min |
| Works offline | ✓ (local draft) | ✗ | ✗ |
| Any device | ✗ | ✓ | ✓ |
| Auto-publishes | Manual commit | ✓ with CI step | Manual |
| Token required | No | Yes (Gist scope) | Yes (OAuth) |
| Token stored | — | localStorage | localStorage |
| Survives redeploy | ✓ (in repo) | ✓ (in Gist) | ✓ (in Drive) |

---

## localStorage keys reference

| Key | Contents |
|---|---|
| `wjw_cs_drafts` | Array of draft sheet objects |
| `wjw_cs_storage_cfg` | `{ mode, gistToken, gistId, gdriveToken, gdriveFolderId }` |
| `wjw_cs_pin` | Editor PIN (default: `1234`) |
| `wjw_theme` | `'light'` or `'dark'` |

To export all drafts for backup, run in the browser console:

```js
copy(localStorage.getItem('wjw_cs_drafts'))
// then paste into a .json file
```
