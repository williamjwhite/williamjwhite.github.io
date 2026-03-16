

1. styles.css — add the keyframe
Paste the contents of styles-addition.css anywhere in your styles.css. Just one @keyframes wjw-blink block — both the sidebar dot and the admin page share it.

2. Route to the admin page
In App.tsx add a simple path check at the top:
tsximport { AdminPage } from "@/components/sections/admin-page";

export default function App() {
  // Simple client-side route — no React Router needed
  if (window.location.pathname === "/admin") {
    return <AdminPage />;
  }

  // ... rest of your existing App
}
Then visit williamjwhite.me/admin to access it.

How it all works
Status dot — sidebar-card.tsx

On load: sky-blue dot, fast blink (0.35 s), spinner icon, "Checking" label
After resolve: green dot, slow soft pulse (2.2 s), wifi icon, "Online" label
Glow is done via inline boxShadow — Tailwind can't do dynamic shadow values

Demo/Live toggle — shared via localStorage

getServerMode() / setServerMode() exported from sidebar-card.tsx
Admin toggle fires a wjw:mode-change custom event — sidebar reacts instantly without a reload
Demo mode simulates 0.9 s checking → online so the animation is still visible to demo viewers
Live mode polls /api/status every 15 s as before

Admin page

PIN gate (default "1234" — change ADMIN_PIN at the top of the file)
Session-scoped auth via sessionStorage — logs out on tab close
Server mode toggle with live endpoint status shown alongside
Stats row, quick links, settings stubs (save is disabled, marked "coming soon")