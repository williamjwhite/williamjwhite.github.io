import * as React from "react";
import { getThemeCookie, setThemeCookie } from "@/lib/theme-cookie";

export function useThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    return getThemeCookie() === "dark";
  });

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    setThemeCookie(isDark ? "dark" : "light");
  }, [isDark]);

  React.useEffect(() => {
    function syncFromCookie() {
      const cookie = getThemeCookie();
      if (!cookie) return;
      setIsDark(cookie === "dark");
    }
    function onVisibility() {
      if (document.visibilityState === "visible") syncFromCookie();
    }
    window.addEventListener("focus", syncFromCookie);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", syncFromCookie);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return { isDark, toggle: () => setIsDark((v) => !v) };
}
