// williamjwhite.github.io/src/lib/theme-cookie.ts
export type ThemeMode = "dark" | "light";

const COOKIE_NAME = "wjjw_theme";
const COOKIE_DOMAIN = ".williamjwhite.me";

export function getThemeCookie(): ThemeMode {
  if (typeof document === "undefined") return "dark";

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_NAME}=(dark|light)`)
  );

  return (match?.[1] as ThemeMode) ?? "dark";
}

export function setThemeCookie(theme: ThemeMode) {
  if (typeof document === "undefined") return;

  document.cookie = [
    `${COOKIE_NAME}=${theme}`,
    "Path=/",
    `Domain=${COOKIE_DOMAIN}`,
    "Max-Age=31536000",
    "SameSite=Lax",
    "Secure",
  ].join("; ");
}
// export type ThemeMode = "light" | "dark";

// const COOKIE_NAME = "wjjw_theme";

// /**
//  * Uses a cookie on the parent domain so it persists across subdomains:
//  * - williamjwhite.me
//  * - docs.williamjwhite.me
//  */
// export function setThemeCookie(mode: ThemeMode) {
//   const oneYear = 60 * 60 * 24 * 365;

//   // Prefer parent domain in production. On localhost this will be ignored,
//   // which is fine; localStorage can cover local dev.
//   const domain = window.location.hostname.endsWith("williamjwhite.me")
//     ? "domain=.williamjwhite.me; "
//     : "";

//   document.cookie = `${COOKIE_NAME}=${mode}; Max-Age=${oneYear}; Path=/; ${domain}SameSite=Lax; Secure`;
// }

// export function getThemeCookie(): ThemeMode | null {
//   const match = document.cookie.match(
//     new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`)
//   );
//   if (!match) return null;
//   const v = decodeURIComponent(match[1]);
//   return v === "dark" || v === "light" ? v : null;
// }
