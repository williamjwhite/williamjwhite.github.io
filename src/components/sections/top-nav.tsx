import { ArrowRight, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/constants/links";

function NavButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-2 text-sm font-semibold transition rounded-xl text-foreground/80 hover:bg-muted hover:text-foreground"
    >
      {label}
    </button>
  );
}

export function TopNav({
  isDark,
  onToggleTheme,
  onNavJump,
}: {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavJump: (tab: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/75 backdrop-blur">
      <div className="flex items-center justify-between max-w-6xl px-4 py-3 mx-auto">

        {/* Logo */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-left"
        >
          <div className="grid font-black h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            W
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold">William J. White</div>
            <div className="text-xs text-muted-foreground">Portfolio • Projects • Docs</div>
          </div>
        </button>

        {/* Nav */}
        <nav className="items-center hidden gap-2 md:flex">
          <NavButton label="About"      onClick={() => onNavJump("about")} />
          <NavButton label="Experience" onClick={() => onNavJump("experience")} />
          <NavButton label="Docs"       onClick={() => onNavJump("docs")} />
          <NavButton label="Connect"    onClick={() => onNavJump("connect")} />
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="inline-flex items-center justify-center transition rounded-full w-9 h-9 hover:bg-muted"
          >
            {isDark
              ? <Sun className="w-4 h-4 text-amber-500" />
              : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
          <Button
            onClick={() => window.open(LINKS.docs, "_blank", "noopener,noreferrer")}
            className="hidden sm:inline-flex"
          >
            Open Docs <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

      </div>
    </header>
  );
}