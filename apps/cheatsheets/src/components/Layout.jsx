import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookOpen, Moon, Sun, PenLine, LogOut, ChevronRight } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { isAuthenticated, logout } from '@/lib/storage'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Layout({ children }) {
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const authed = isAuthenticated()

  function handleLogout() {
    logout()
    navigate('/cheatsheets/')
  }

  const isEditor = location.pathname.includes('/editor')

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/cheatsheets/"
            className="flex items-center gap-2.5 text-foreground hover:text-primary transition-colors group"
          >
            <div className="h-7 w-7 rounded-[var(--radius-sm)] bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <BookOpen size={14} className="text-primary" />
            </div>
            <span className="font-medium text-sm hidden sm:block">
              <span className="text-muted-foreground">williamjwhite.me /</span>
              <span className="ml-1 font-semibold">cheatsheets</span>
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            {authed ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className={cn(isEditor && 'bg-muted')}
                >
                  <Link to="/cheatsheets/editor">
                    <PenLine size={15} />
                    <span className="hidden sm:block">Editor</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} title="Lock editor">
                  <LogOut size={15} />
                </Button>
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cheatsheets/editor">
                  <PenLine size={15} />
                  <span className="hidden sm:block">Editor</span>
                </Link>
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={toggle} title="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      {location.pathname !== '/cheatsheets/' && location.pathname !== '/cheatsheets' && (
        <div className="border-b border-border/50 bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-9 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/cheatsheets/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            {isEditor
              ? <span className="text-foreground">Editor</span>
              : <span className="text-foreground truncate max-w-xs">
                  {decodeURIComponent(location.pathname.replace('/cheatsheets/', ''))}
                </span>
            }
          </div>
        </div>
      )}

      {/* Page */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>williamjwhite.me</span>
          <span className="font-mono">/cheatsheets</span>
        </div>
      </footer>
    </div>
  )
}
