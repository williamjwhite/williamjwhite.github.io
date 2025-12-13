import * as React from "react";

type IconLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

function isExternalUrl(href: string): boolean {
  // Treat http(s) absolute URLs and mailto: as external
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href);
}

export function IconLink({ href, label, icon }: IconLinkProps) {
  const isExternal = isExternalUrl(href);

  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 text-sm transition-colors text-muted-foreground hover:text-foreground"
      {...(isExternal
        ? {
            target: "_blank",
            rel: "noopener noreferrer",
          }
        : {})}
      aria-label={label}
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
