/// <reference types="vite/client" />

// Raw markdown imports — used by cheatsheets glob loader
declare module '*.md?raw' {
  const content: string
  export default content
}

// Cheatsheets-specific env vars (separate from admin page vars)
interface ImportMetaEnv {
  readonly VITE_ADMIN_PIN:      string
  readonly VITE_GIST_TOKEN:     string
  readonly VITE_GIST_ID:        string
  readonly VITE_CS_GIST_TOKEN:  string
  readonly VITE_CS_GIST_ID:     string
  readonly VITE_EDITOR_PIN:     string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
