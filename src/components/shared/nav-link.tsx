import { isExternalUrl, scrollToId } from "@/lib/utils";

export function NavLink({ href, label }: { href: string; label: string }) {
  const external = isExternalUrl(href);
  const cls =
    "px-3 py-2 text-sm font-semibold transition rounded-xl text-foreground/80 hover:bg-muted hover:text-foreground";

  if (!external && href.startsWith("#")) {
    return (
      <button type="button" onClick={() => scrollToId(href.slice(1))} className={cls}>
        {label}
      </button>
    );
  }
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={cls}
    >
      {label}
    </a>
  );
}
