---
title: GitHub Actions
category: CI/CD
date: 2026-03-21
---

# GitHub Actions Cheatsheet

> Quick reference for workflow syntax, common patterns, and gotchas.

---

## Anatomy of a Workflow File

```yaml
name: My Workflow           # shown in Actions UI

on:                         # triggers
  push:
    branches: ["main"]
  pull_request:
  workflow_dispatch:        # manual run button

jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Do something
        run: echo "Hello"
```

---

## Triggers (`on:`)

| Trigger | When it fires |
|---|---|
| `push` | Any push (filter with `branches:` or `paths:`) |
| `pull_request` | PR opened, updated, or reopened |
| `workflow_dispatch` | Manual trigger from Actions UI |
| `schedule` | Cron — e.g. `cron: '0 9 * * 1'` (Mon 9am UTC) |
| `release` | When a GitHub Release is published |
| `workflow_call` | Called by another workflow (reusable) |

**Filter by path — only run when specific files change:**

```yaml
on:
  push:
    paths:
      - 'apps/cheatsheets/**'
      - '.github/workflows/pages.yml'
```

---

## Secrets & Env Vars

```yaml
# Repo secret → env var in a step
- name: Build
  run: npm run build
  env:
    VITE_API_KEY: ${{ secrets.VITE_API_KEY }}

# Available to all steps in a job
jobs:
  build:
    env:
      NODE_ENV: production
```

> Secrets are **never** printed in logs. If you try to `echo` one, GitHub redacts it as `***`.

---

## Caching

```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: "24"
    cache: "npm"          # handles ~/.npm automatically

# Manual cache (for anything else)
- uses: actions/cache@v4
  with:
    path: ~/.cache/custom-tool
    key: ${{ runner.os }}-custom-${{ hashFiles('lockfile') }}
    restore-keys: |
      ${{ runner.os }}-custom-
```

Cache key tips: always include `runner.os` and a hash of your lockfile. The `restore-keys` fallback lets you use a stale cache rather than nothing.

---

## Job Dependencies & Parallelism

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # ...

  test:
    runs-on: ubuntu-latest
    needs: build            # waits for build to pass

  deploy:
    runs-on: ubuntu-latest
    needs: [build, test]    # waits for both
```

Jobs without `needs:` run in **parallel** by default.

---

## Outputs — Passing Data Between Jobs

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.get-version.outputs.version }}
    steps:
      - id: get-version
        run: echo "version=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying v${{ needs.build.outputs.version }}"
```

---

## Conditionals

```yaml
# Only run on main branch
- name: Deploy
  if: github.ref == 'refs/heads/main'
  run: ./deploy.sh

# Skip on draft PRs
- name: Test
  if: github.event.pull_request.draft == false

# Always run (even if prior steps fail) — useful for cleanup
- name: Notify
  if: always()
  run: ./notify.sh
```

---

## Matrix Builds

```yaml
jobs:
  test:
    strategy:
      matrix:
        node: [20, 22, 24]
        os: [ubuntu-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

Creates 6 parallel jobs (3 Node versions × 2 OSes). Use `fail-fast: false` to let all matrix jobs finish even if one fails.

---

## Reusable Workflows

```yaml
# .github/workflows/reusable-build.yml
on:
  workflow_call:
    inputs:
      working-directory:
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build
        working-directory: ${{ inputs.working-directory }}

# Caller workflow
jobs:
  build-cheatsheets:
    uses: ./.github/workflows/reusable-build.yml
    with:
      working-directory: apps/cheatsheets
```

---

## Useful Built-in Contexts

| Expression | Value |
|---|---|
| `github.sha` | Full commit SHA |
| `github.ref` | Branch/tag ref e.g. `refs/heads/main` |
| `github.actor` | Username that triggered the run |
| `github.event_name` | `push`, `pull_request`, etc. |
| `runner.os` | `Linux`, `macOS`, `Windows` |
| `env.MY_VAR` | Access a job-level env var |

---

## Common Gotchas

**`npm ci` vs `npm install`** — always use `npm ci` in CI. It installs exactly what's in `package-lock.json` and fails if there's a mismatch rather than silently updating it.

**Checkout depth** — `actions/checkout@v4` does a shallow clone by default (`fetch-depth: 1`). If you need git history (e.g. for versioning), set `fetch-depth: 0`.

**`working-directory`** — set it on the step, not on `run` itself. Or set a default for the whole job:

```yaml
jobs:
  build:
    defaults:
      run:
        working-directory: apps/cheatsheets
```

**Concurrency** — without this, rapid pushes queue up and waste runner minutes:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

**`.nojekyll`** — GitHub Pages runs Jekyll by default, which ignores files starting with `_`. Always `touch dist/.nojekyll` if your build output contains `_assets/` or similar.

---

*Last updated: March 2026*
