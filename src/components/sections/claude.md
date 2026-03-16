


Files delivered
FileWhat changedhooks/use-server-status.tsNew — extracted hook + types, shared by all componentssections/status-dot.tsxNew — extracted component, imported by about-section and admin-pagesections/now-items.tsxUpdated — items now stored in localStorage, editable from adminsections/about-section.tsxUpdated — Now items + live clock + StatusDot moved here from sidebarsections/sidebar-card.tsxUpdated — renamed to "Client Services", Now items removed, RSS has My Posts / Tech News tabs, + Doc Submission + Consultation Request addedsections/admin-page.tsxExpanded — 8 collapsible panels (see below)

Admin page panels
All collapsible, accessible at williamjwhite.me/admin:

Server Status — Live/Demo toggle + real endpoint health
Maintenance Mode — Toggle + custom message, warns in header when ON
Site Messages — Banner with info/warning/success/error types + live preview
Now Items — Edit/add/remove/reorder the 5 bullets, saves to localStorage, site picks up on next load
RSS Feeds — Configure feed sources, enable/disable each
Content Preview — Opens each tab in a new window for review
Database / CRM — Schema stubs for clients, consultations, documents, messages — wire to /api/admin/db
API & Docs Config — All endpoint URLs in one place


Two things to update in App.tsx
Remove the old imports for useServerStatus and ServerMode/ServerStatus from sidebar-card — they now live in hooks/use-server-status.ts. Also update the admin route import path: