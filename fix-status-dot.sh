#!/bin/bash

# Fix status-dot.tsx — remove _mode from props entirely
sed -i '' 's/export function StatusDot({ status, _mode }: { status: ServerStatus; _mode?: ServerMode })/export function StatusDot({ status }: { status: ServerStatus })/' src/components/sections/status-dot.tsx

# Remove ServerMode from import in status-dot.tsx
sed -i '' 's/import type { ServerStatus, ServerMode } from "@\/hooks\/use-server-status";/import type { ServerStatus } from "@\/hooks\/use-server-status";/' src/components/sections/status-dot.tsx

# Fix about-section.tsx — remove mode prop from StatusDot call
sed -i '' 's/<StatusDot status={status} mode={mode} \/>/<StatusDot status={status} \/>/' src/components/sections/about-section.tsx

# Fix sidebar-card.tsx — remove mode prop from StatusDot call
sed -i '' 's/<StatusDot status={status} mode={mode} \/>/<StatusDot status={status} \/>/' src/components/sections/sidebar-card.tsx

echo "✅ Done — StatusDot mode prop removed from all files"