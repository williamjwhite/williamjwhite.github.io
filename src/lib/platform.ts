export function getPlatformClass(): string {
  const ua = navigator.userAgent;
  if (/Mac/.test(ua) && !/iPhone|iPad/.test(ua)) return "os-mac";
  if (/Win/.test(ua)) return "os-windows";
  if (/Linux/.test(ua)) return "os-linux";
  return "os-other";
}