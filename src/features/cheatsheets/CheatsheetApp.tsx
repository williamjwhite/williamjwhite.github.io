import { useState } from 'react'
import { Home } from './pages/Home'
import { Sheet } from './pages/Sheet'
import { Editor } from './pages/Editor'

/**
 * CheatsheetApp — renders into a TabsContent in the main site App.tsx.
 * Uses simple state-based routing instead of React Router (the main site
 * doesn't use a router, keeping consistent with its /admin pattern).
 *
 * Routes:
 *   home              → sheet list
 *   sheet/:slug       → single sheet viewer
 *   editor            → pin-protected editor
 *   editor?id=:id     → editor with sheet pre-loaded
 */
type Route =
  | { page: 'home' }
  | { page: 'sheet'; slug: string }
  | { page: 'editor'; id?: string }

export function CheatsheetApp() {
  const [route, setRoute] = useState<Route>({ page: 'home' })

  function navigate(to: Route) {
    setRoute(to)
    // Scroll the tab content into view rather than the window top
    document.getElementById('cheatsheets-root')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div id="cheatsheets-root" className="min-h-[60vh]">
      {route.page === 'home' && (
        <Home
          onOpenSheet={slug => navigate({ page: 'sheet', slug })}
          onOpenEditor={() => navigate({ page: 'editor' })}
        />
      )}
      {route.page === 'sheet' && (
        <Sheet
          slug={route.slug}
          onBack={() => navigate({ page: 'home' })}
          onEdit={id => navigate({ page: 'editor', id })}
        />
      )}
      {route.page === 'editor' && (
        <Editor
          initialId={route.id}
          onBack={() => navigate({ page: 'home' })}
          onViewSheet={slug => navigate({ page: 'sheet', slug })}
        />
      )}
    </div>
  )
}
