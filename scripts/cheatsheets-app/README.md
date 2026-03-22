# williamjwhite.me/cheatsheets

Quick-reference cheatsheet viewer + pin-protected editor.

## Stack
- React 19 + Vite 6
- React Router 7 (base: `/cheatsheets/`)
- Tailwind CSS v4 (with your `index.css` design tokens)
- shadcn/ui components (Radix primitives, CVA)
- `react-markdown@10` + `remark-gfm@4` + `rehype-highlight@7`
- `lucide-react` icons

## Dev
~~~ bash
npm install
npm run dev
~~~

## Build & Deploy (GitHub Pages)
~~~ bash
npm run build
# dist/ → deploy to gh-pages branch
# CNAME file is already in public/ → williamjwhite.me
~~~

## Editor PIN
Default PIN: **1234**
Change it in Editor → Settings panel after logging in.

## Adding cheatsheets
- Via the editor UI at `/cheatsheets/editor`
- Or drop `.md` files and seed `src/lib/storage.js`

## File structure
~~~
src/
  components/
    ui/          ← shadcn primitives
    Layout.jsx   ← nav + breadcrumb + footer
    MarkdownViewer.jsx
    PinGate.jsx  ← 4-digit PIN lock
  hooks/
    useTheme.js
  lib/
    utils.js
    storage.js   ← localStorage CRUD + PIN auth
  pages/
    Home.jsx
    Sheet.jsx
    Editor.jsx   ← split edit/preview + settings
  index.css      ← your design tokens + prose styles
~~~
