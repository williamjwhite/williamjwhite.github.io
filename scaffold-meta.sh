#!/usr/bin/env bash
# scaffold-meta.sh
# Run from the root of your GitHub Pages repo.
# Creates each project folder + meta.json if they don't already exist.

set -e

echo "📁 Scaffolding project meta.json files..."

# ── ev-charging-stations-app ──────────────────────────────────────────────────
mkdir -p projects/ev-charging-stations-app
cat > projects/ev-charging-stations-app/meta.json << 'EOF'
{
  "title": "EV Charging Stations",
  "description": "Smart charging finder for the Kia Niro EV. Cost warnings, charge-to-mile estimates, and PWA install support.",
  "icon": "⚡",
  "color": "#00d4ff",
  "status": "live",
  "tags": ["PWA", "EV", "Tools"],
  "type": "demo"
}
EOF
echo "  ✓ ev-charging-stations-app/meta.json"

# ── anatomy-app ───────────────────────────────────────────────────────────────
mkdir -p projects/anatomy-app
cat > projects/anatomy-app/meta.json << 'EOF'
{
  "title": "Anatomy App",
  "description": "Interactive anatomical reference with layered body systems, region-based navigation, and clinical notes.",
  "icon": "🫀",
  "color": "#ff6b6b",
  "status": "live",
  "tags": ["Medical", "Interactive", "PWA"],
  "type": "demo"
}
EOF
echo "  ✓ anatomy-app/meta.json"

# ── delivery-tracker ──────────────────────────────────────────────────────────
mkdir -p projects/delivery-tracker
cat > projects/delivery-tracker/meta.json << 'EOF'
{
  "title": "Delivery Tracker",
  "description": "Real-time package tracking dashboard with multi-carrier support, status timelines, and notification management.",
  "icon": "📦",
  "color": "#f59e0b",
  "status": "live",
  "tags": ["Logistics", "Dashboard", "Tracking"],
  "type": "demo"
}
EOF
echo "  ✓ delivery-tracker/meta.json"

# ── accounting-app ────────────────────────────────────────────────────────────
mkdir -p projects/accounting-app
cat > projects/accounting-app/meta.json << 'EOF'
{
  "title": "Accounting App",
  "description": "Lightweight financial management with transaction tracking, categorization, and cash flow visualization.",
  "icon": "📊",
  "color": "#10b981",
  "status": "live",
  "tags": ["Finance", "Dashboard", "Tools"],
  "type": "demo"
}
EOF
echo "  ✓ accounting-app/meta.json"

# ── kia-niro-calculator ───────────────────────────────────────────────────────
mkdir -p projects/kia-niro-calculator
cat > projects/kia-niro-calculator/meta.json << 'EOF'
{
  "title": "Kia Niro Calculator",
  "description": "Total cost of ownership calculator comparing financing, charging costs, incentives, and savings vs ICE vehicles.",
  "icon": "🚗",
  "color": "#8b5cf6",
  "status": "live",
  "tags": ["EV", "Finance", "Calculator"],
  "type": "demo"
}
EOF
echo "  ✓ kia-niro-calculator/meta.json"

# ── projects.json index ───────────────────────────────────────────────────────
cat > projects/projects.json << 'EOF'
[
  "ev-charging-stations-app",
  "anatomy-app",
  "delivery-tracker",
  "accounting-app",
  "kia-niro-calculator"
]
EOF
echo "  ✓ projects/projects.json"

echo ""
echo "✅ Done. $(find projects -name meta.json | wc -l | tr -d ' ') meta.json files created."
echo ""
echo "To add a future project:"
echo "  1. mkdir -p projects/your-new-app"
echo "  2. Add meta.json to that folder"
echo "  3. Add \"your-new-app\" to projects/projects.json"
