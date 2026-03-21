#!/usr/bin/env bash
# ============================================================
#  GigLedger Pro — Scaffold Script
#  Run:  chmod +x scaffold.sh && ./scaffold.sh
#  Then: cd gigledger-pro && npm install && npm run dev
# ============================================================
set -e

APP="gigledger-pro"
echo "🚀  Scaffolding $APP..."
mkdir -p "$APP"
cd "$APP"

# ── package.json ─────────────────────────────────────────────
cat > package.json << 'PKGJSON'
{
  "name": "gigledger-pro",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@react-email/components": "^0.0.31",
    "@react-email/render": "^1.0.5",
    "chart.js": "^4.4.9",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "jspdf": "^2.5.2",
    "jspdf-autotable": "^3.5.0",
    "lucide-react": "^0.487.0",
    "marked": "^15.0.11",
    "react": "^19.1.0",
    "react-chartjs-2": "^5.3.0",
    "react-dom": "^19.1.0",
    "react-dropzone": "^14.3.8",
    "react-router-dom": "^7.4.1",
    "tailwind-merge": "^3.2.0",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@eslint/js": "^9.22.0",
    "@tailwindcss/typography": "^0.5.16",
    "@tailwindcss/vite": "^4.1.3",
    "@types/node": "^22.14.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "eslint": "^9.22.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^15.15.0",
    "tailwindcss": "^4.1.3",
    "typescript": "~5.8.3",
    "typescript-eslint": "^8.26.1",
    "vite": "^6.2.4"
  }
}
PKGJSON

# ── tsconfig.json ─────────────────────────────────────────────
cat > tsconfig.json << 'TSCONFIG'
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
TSCONFIG

cat > tsconfig.app.json << 'TSCONFIGAPP'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
TSCONFIGAPP

cat > tsconfig.node.json << 'TSCONFIGNODE'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
TSCONFIGNODE

# ── vite.config.ts ────────────────────────────────────────────
cat > vite.config.ts << 'VITECONFIG'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
VITECONFIG

# ── index.html ────────────────────────────────────────────────
cat > index.html << 'INDEXHTML'
<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GigLedger Pro</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
INDEXHTML

# ── public/favicon.svg ────────────────────────────────────────
mkdir -p public
cat > public/favicon.svg << 'FAVICON'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#818cf8"/>
  <text x="16" y="22" text-anchor="middle" font-size="18">💸</text>
</svg>
FAVICON

# ── src directory structure ───────────────────────────────────
mkdir -p src/{components/{ui,layout,dashboard,entries,platforms,statements,editor,admin,reports,settings},pages,store,types,lib,hooks,data,assets}

echo "📁  Directory structure created"

# ============================================================
#  TAILWIND / GLOBAL CSS
# ============================================================
cat > src/index.css << 'INDEXCSS'
@import "tailwindcss";
@import "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));

:root {
  --background: 9 9 11;
  --foreground: 250 250 249;
  --card: 17 17 19;
  --card-foreground: 250 250 249;
  --popover: 17 17 19;
  --popover-foreground: 250 250 249;
  --primary: 129 140 248;
  --primary-foreground: 255 255 255;
  --secondary: 31 31 36;
  --secondary-foreground: 161 161 170;
  --muted: 24 24 27;
  --muted-foreground: 113 113 122;
  --accent: 31 31 36;
  --accent-foreground: 250 250 249;
  --destructive: 248 113 113;
  --destructive-foreground: 255 255 255;
  --border: 42 42 48;
  --input: 31 31 36;
  --ring: 129 140 248;
  --radius: 0.625rem;
  --sidebar-width: 230px;
}

* { box-sizing: border-box; }

body {
  background-color: rgb(var(--background));
  color: rgb(var(--foreground));
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden;
  height: 100vh;
}

#root { height: 100vh; overflow: hidden; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgb(var(--border)); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: rgb(58 58 68); }

/* Markdown editor prose overrides */
.prose-editor { font-size: 14px; line-height: 1.7; }
.prose-editor h1 { font-size: 1.5rem; font-weight: 700; margin: 1rem 0 0.5rem; }
.prose-editor h2 { font-size: 1.25rem; font-weight: 600; margin: 0.875rem 0 0.4rem; }
.prose-editor h3 { font-size: 1.1rem; font-weight: 600; margin: 0.75rem 0 0.3rem; }
.prose-editor p  { margin: 0.5rem 0; }
.prose-editor ul, .prose-editor ol { margin: 0.5rem 0 0.5rem 1.5rem; }
.prose-editor code { background: rgb(var(--muted)); padding: 1px 5px; border-radius: 4px; font-size: 12px; font-family: 'JetBrains Mono', monospace; }
.prose-editor pre { background: rgb(var(--muted)); padding: 12px; border-radius: 8px; overflow-x: auto; }
.prose-editor pre code { background: none; padding: 0; }
.prose-editor blockquote { border-left: 3px solid rgb(var(--primary)); padding-left: 12px; color: rgb(var(--muted-foreground)); }
.prose-editor table { width: 100%; border-collapse: collapse; }
.prose-editor th, .prose-editor td { border: 1px solid rgb(var(--border)); padding: 6px 10px; }
.prose-editor th { background: rgb(var(--muted)); }
.prose-editor a { color: rgb(var(--primary)); text-decoration: underline; }
INDEXCSS

# ============================================================
#  LIB UTILITIES
# ============================================================
cat > src/lib/utils.ts << 'UTILS'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date: string): string {
  if (!date) return '—'
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
}

export function getStatusVariant(status: string): 'success' | 'warning' | 'destructive' | 'secondary' {
  const s = status.toLowerCase()
  if (['paid', 'completed', 'done'].includes(s)) return 'success'
  if (['pending', 'in progress', 'upcoming', 'in escrow'].includes(s)) return 'warning'
  if (['cancelled', 'overdue', 'dispute', 'refunded'].includes(s)) return 'destructive'
  return 'secondary'
}
UTILS

# ============================================================
#  TYPES
# ============================================================
cat > src/types/index.ts << 'TYPES'
export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'select' | 'textarea' | 'checkbox' | 'email' | 'url'

export interface PlatformField {
  id: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]      // for select
  helperText?: string
}

export interface Platform {
  id: string
  name: string
  icon: string            // emoji or URL to uploaded image
  iconType: 'emoji' | 'image'
  color: string           // hex
  category: string
  fields: PlatformField[]
  createdAt: string
  builtIn?: boolean
}

export interface Entry {
  id: string
  platformId: string
  createdAt: string
  updatedAt?: string
  [key: string]: unknown
}

export interface StatementTemplate {
  id: string
  name: string
  description: string
  markdown: string        // markdown source
  createdAt: string
  builtIn?: boolean
}

export interface EmailTemplate {
  id: string
  name: string
  description: string
  subject: string
  body: string            // react-email compatible JSX string or markdown
  createdAt: string
  builtIn?: boolean
}

export interface AppSettings {
  name: string
  businessName: string
  taxId: string
  currency: string
  email: string
  address: string
}

export interface StatementOptions {
  platformId: string | 'all'
  startDate: string
  endDate: string
  templateId: string
  title?: string
}
TYPES

# ============================================================
#  DATA — Default Platforms
# ============================================================
cat > src/data/platforms.ts << 'PLATFORMS'
import type { Platform } from '@/types'

export const DEFAULT_PLATFORMS: Platform[] = [
  {
    id: 'doordash',
    name: 'DoorDash',
    icon: '🍔',
    iconType: 'emoji',
    color: '#e52b2b',
    category: 'Delivery / Rideshare',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',            label: 'Date',                    type: 'date',     required: true },
      { id: 'period_start',    label: 'Period Start',            type: 'date' },
      { id: 'period_end',      label: 'Period End',              type: 'date' },
      { id: 'dasher_id',       label: 'Dasher ID',               type: 'text' },
      { id: 'statement_number',label: 'Statement #',             type: 'text' },
      { id: 'base_pay',        label: 'Base Pay',                type: 'currency' },
      { id: 'tips',            label: 'Tips',                    type: 'currency' },
      { id: 'peak_pay',        label: 'Peak Pay / Challenges',   type: 'currency' },
      { id: 'milestones',      label: 'Milestones / Bonuses',    type: 'currency' },
      { id: 'deliveries',      label: 'Total Deliveries',        type: 'number' },
      { id: 'active_hours',    label: 'Active Hours',            type: 'number' },
      { id: 'miles',           label: 'Miles Dashed',            type: 'number' },
      { id: 'platform_fees',   label: 'Platform Fees',           type: 'currency' },
      { id: 'payout_method',   label: 'Payout Method',          type: 'select',  options: ['DasherDirect', 'Bank Transfer', 'FastPay'] },
      { id: 'status',          label: 'Status',                  type: 'select',  options: ['Paid', 'Pending', 'Cancelled'] },
      { id: 'notes',           label: 'Notes',                   type: 'textarea' },
    ],
  },
  {
    id: 'upwork',
    name: 'Upwork',
    icon: '💼',
    iconType: 'emoji',
    color: '#14a800',
    category: 'Freelance / Tech',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',           label: 'Date',                  type: 'date',     required: true },
      { id: 'client_name',    label: 'Client Name',           type: 'text' },
      { id: 'contract_title', label: 'Contract / Job Title',  type: 'text' },
      { id: 'contract_type',  label: 'Contract Type',         type: 'select',  options: ['Hourly', 'Fixed Price', 'Bonus'] },
      { id: 'hours_worked',   label: 'Hours Worked',          type: 'number' },
      { id: 'hourly_rate',    label: 'Hourly Rate',           type: 'currency' },
      { id: 'gross_amount',   label: 'Gross Amount',          type: 'currency', required: true },
      { id: 'upwork_fee',     label: 'Upwork Service Fee',    type: 'currency' },
      { id: 'bonus',          label: 'Bonus',                 type: 'currency' },
      { id: 'payment_ref',    label: 'Payment Reference',     type: 'text' },
      { id: 'skill_tags',     label: 'Skills / Tags',         type: 'text' },
      { id: 'status',         label: 'Status',                type: 'select',  options: ['Paid', 'Pending', 'In Escrow', 'Dispute'] },
      { id: 'notes',          label: 'Notes',                 type: 'textarea' },
    ],
  },
  {
    id: 'fiverr',
    name: 'Fiverr',
    icon: '🟢',
    iconType: 'emoji',
    color: '#1dbf73',
    category: 'Freelance / Tech',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',          label: 'Date',              type: 'date',     required: true },
      { id: 'buyer_name',    label: 'Buyer Username',    type: 'text' },
      { id: 'gig_title',     label: 'Gig Title',         type: 'text' },
      { id: 'order_id',      label: 'Order ID',          type: 'text' },
      { id: 'gig_package',   label: 'Package',           type: 'select',  options: ['Basic', 'Standard', 'Premium', 'Custom'] },
      { id: 'gig_price',     label: 'Order Price',       type: 'currency', required: true },
      { id: 'tip',           label: 'Tip',               type: 'currency' },
      { id: 'fiverr_fee',    label: 'Fiverr Fee (20%)',  type: 'currency' },
      { id: 'delivery_days', label: 'Delivery Days',     type: 'number' },
      { id: 'rating',        label: 'Buyer Rating',      type: 'select',  options: ['5 ⭐', '4 ⭐', '3 ⭐', '2 ⭐', '1 ⭐', 'No rating'] },
      { id: 'category',      label: 'Gig Category',      type: 'text' },
      { id: 'status',        label: 'Status',            type: 'select',  options: ['Completed', 'Pending Clearance', 'Cancelled', 'In Progress'] },
      { id: 'notes',         label: 'Notes',             type: 'textarea' },
    ],
  },
  {
    id: 'direct',
    name: 'Direct Contract',
    icon: '🤝',
    iconType: 'emoji',
    color: '#4d9ef7',
    category: 'Direct Contract',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',            label: 'Invoice Date',          type: 'date',     required: true },
      { id: 'client_name',     label: 'Client Name',           type: 'text',     required: true },
      { id: 'client_email',    label: 'Client Email',          type: 'email' },
      { id: 'client_company',  label: 'Client Company',        type: 'text' },
      { id: 'invoice_number',  label: 'Invoice #',             type: 'text' },
      { id: 'project_name',    label: 'Project Name',          type: 'text' },
      { id: 'project_type',    label: 'Project Type',          type: 'select',  options: ['Web Development', 'Design', 'Consulting', 'Writing', 'Marketing', 'Other'] },
      { id: 'contract_type',   label: 'Contract Type',         type: 'select',  options: ['Hourly', 'Fixed Price', 'Retainer', 'Milestone'] },
      { id: 'hours_worked',    label: 'Hours Worked',          type: 'number' },
      { id: 'rate',            label: 'Rate ($/hr or fixed)',  type: 'currency' },
      { id: 'gross_amount',    label: 'Total Amount',          type: 'currency', required: true },
      { id: 'expenses',        label: 'Reimbursable Expenses', type: 'currency' },
      { id: 'taxes_withheld',  label: 'Taxes Withheld',        type: 'currency' },
      { id: 'payment_terms',   label: 'Payment Terms',         type: 'select',  options: ['Net 7', 'Net 14', 'Net 30', 'Due on Receipt', '50/50'] },
      { id: 'due_date',        label: 'Due Date',              type: 'date' },
      { id: 'payment_method',  label: 'Payment Method',        type: 'select',  options: ['Bank Transfer', 'PayPal', 'Zelle', 'Check', 'Crypto', 'Other'] },
      { id: 'status',          label: 'Status',                type: 'select',  options: ['Paid', 'Sent', 'Draft', 'Overdue', 'Cancelled'] },
      { id: 'notes',           label: 'Notes',                 type: 'textarea' },
    ],
  },
  {
    id: 'uber',
    name: 'Uber / Uber Eats',
    icon: '🚗',
    iconType: 'emoji',
    color: '#000000',
    category: 'Delivery / Rideshare',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',           label: 'Date',                    type: 'date',    required: true },
      { id: 'period_start',   label: 'Period Start',            type: 'date' },
      { id: 'period_end',     label: 'Period End',              type: 'date' },
      { id: 'driver_id',      label: 'Driver ID',               type: 'text' },
      { id: 'base_fare',      label: 'Base Fares / Fees',       type: 'currency' },
      { id: 'tips',           label: 'Tips',                    type: 'currency' },
      { id: 'surge_pay',      label: 'Surge / Boost',           type: 'currency' },
      { id: 'promotions',     label: 'Promotions / Quests',     type: 'currency' },
      { id: 'trips',          label: 'Number of Trips/Orders',  type: 'number' },
      { id: 'hours_online',   label: 'Hours Online',            type: 'number' },
      { id: 'miles_driven',   label: 'Miles Driven',            type: 'number' },
      { id: 'uber_service_fee', label: 'Uber Service Fee',      type: 'currency' },
      { id: 'service_type',   label: 'Service Type',            type: 'select',  options: ['UberX', 'UberXL', 'Uber Black', 'Uber Eats', 'Uber Comfort'] },
      { id: 'status',         label: 'Status',                  type: 'select',  options: ['Paid', 'Pending'] },
      { id: 'notes',          label: 'Notes',                   type: 'textarea' },
    ],
  },
  {
    id: 'etsy',
    name: 'Etsy',
    icon: '🛍️',
    iconType: 'emoji',
    color: '#f56400',
    category: 'Creative',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',             label: 'Date',                      type: 'date',    required: true },
      { id: 'order_id',         label: 'Order ID',                  type: 'text' },
      { id: 'item_name',        label: 'Item Name',                 type: 'text' },
      { id: 'quantity',         label: 'Quantity',                  type: 'number' },
      { id: 'sale_price',       label: 'Sale Price',                type: 'currency', required: true },
      { id: 'shipping_charged', label: 'Shipping Charged',          type: 'currency' },
      { id: 'transaction_fee',  label: 'Transaction Fee (6.5%)',    type: 'currency' },
      { id: 'listing_fee',      label: 'Listing Fee',               type: 'currency' },
      { id: 'payment_fee',      label: 'Payment Processing Fee',    type: 'currency' },
      { id: 'shipping_cost',    label: 'Actual Shipping Cost',      type: 'currency' },
      { id: 'materials_cost',   label: 'Materials Cost',            type: 'currency' },
      { id: 'buyer_location',   label: 'Buyer Country',             type: 'text' },
      { id: 'status',           label: 'Status',                    type: 'select',  options: ['Completed', 'In Progress', 'Refunded', 'Cancelled'] },
      { id: 'notes',            label: 'Notes',                     type: 'textarea' },
    ],
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    icon: '🏠',
    iconType: 'emoji',
    color: '#ff5a5f',
    category: 'Rental',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',              label: 'Payout Date',         type: 'date',    required: true },
      { id: 'listing_name',      label: 'Listing Name',        type: 'text' },
      { id: 'guest_name',        label: 'Guest Name',          type: 'text' },
      { id: 'checkin',           label: 'Check-in Date',       type: 'date' },
      { id: 'checkout',          label: 'Check-out Date',      type: 'date' },
      { id: 'nights',            label: 'Nights',              type: 'number' },
      { id: 'nightly_rate',      label: 'Nightly Rate',        type: 'currency' },
      { id: 'accommodation_fee', label: 'Accommodation Total', type: 'currency', required: true },
      { id: 'cleaning_fee',      label: 'Cleaning Fee',        type: 'currency' },
      { id: 'airbnb_host_fee',   label: 'Airbnb Host Fee',     type: 'currency' },
      { id: 'taxes_collected',   label: 'Taxes Collected',     type: 'currency' },
      { id: 'reservation_id',    label: 'Reservation ID',      type: 'text' },
      { id: 'guest_rating',      label: 'Guest Rating',        type: 'select',  options: ['5 ⭐', '4 ⭐', '3 ⭐', '2 ⭐', 'Not rated'] },
      { id: 'status',            label: 'Status',              type: 'select',  options: ['Paid', 'Upcoming', 'Cancelled'] },
      { id: 'notes',             label: 'Notes',               type: 'textarea' },
    ],
  },
  {
    id: 'instacart',
    name: 'Instacart',
    icon: '🛒',
    iconType: 'emoji',
    color: '#43b02a',
    category: 'Delivery / Rideshare',
    builtIn: true,
    createdAt: new Date().toISOString(),
    fields: [
      { id: 'date',          label: 'Date',              type: 'date',    required: true },
      { id: 'period_start',  label: 'Period Start',      type: 'date' },
      { id: 'period_end',    label: 'Period End',        type: 'date' },
      { id: 'batch_pay',     label: 'Batch Pay',         type: 'currency' },
      { id: 'tips',          label: 'Tips',              type: 'currency' },
      { id: 'quality_bonus', label: 'Quality Bonus',     type: 'currency' },
      { id: 'peak_boost',    label: 'Peak Boost',        type: 'currency' },
      { id: 'batches',       label: 'Batches Completed', type: 'number' },
      { id: 'items_picked',  label: 'Items Picked',      type: 'number' },
      { id: 'hours_active',  label: 'Hours Active',      type: 'number' },
      { id: 'miles',         label: 'Miles Driven',      type: 'number' },
      { id: 'status',        label: 'Status',            type: 'select',  options: ['Paid', 'Pending'] },
      { id: 'notes',         label: 'Notes',             type: 'textarea' },
    ],
  },
]
PLATFORMS

# ============================================================
#  DATA — Statement + Email Templates
# ============================================================
cat > src/data/templates.ts << 'TEMPLATES'
import type { StatementTemplate, EmailTemplate } from '@/types'

export const DEFAULT_STATEMENT_TEMPLATES: StatementTemplate[] = [
  {
    id: 'doordash-style',
    name: 'DoorDash Style',
    description: 'Clean payout statement matching DoorDash\'s official format',
    builtIn: true,
    createdAt: new Date().toISOString(),
    markdown: `# {{platformName}} — {{statementTitle}}

**Period:** {{startDate}} – {{endDate}}  
**Statement #:** {{statementNumber}}  
**Page:** 1

---

## Contractor Information

| Field | Value |
|-------|-------|
| Name | {{contractorName}} |
| ID | {{contractorId}} |
| Email | {{contractorEmail}} |

---

## Payouts ({{payoutCount}})

| Description | Amount |
|-------------|--------|
| Payout Subtotal | {{grossTotal}} |
| Fees | -{{feesTotal}} |

---

**Net Total: {{netTotal}}**

---

*This statement was generated by GigLedger Pro on {{generatedDate}}.*
`,
  },
  {
    id: 'freelance-invoice',
    name: 'Freelance Invoice',
    description: 'Professional invoice for freelance and contract work',
    builtIn: true,
    createdAt: new Date().toISOString(),
    markdown: `# INVOICE

**Invoice #:** {{statementNumber}}  
**Date:** {{generatedDate}}  
**Due Date:** {{endDate}}

---

## Bill From

**{{contractorName}}**  
{{contractorEmail}}  
{{contractorAddress}}

## Bill To

{{clientName}}  
{{clientEmail}}  
{{clientCompany}}

---

## Services

| Description | Hours | Rate | Amount |
|-------------|-------|------|--------|
{{lineItems}}

---

| | |
|---|---|
| **Subtotal** | {{grossTotal}} |
| **Fees / Deductions** | -{{feesTotal}} |
| **TOTAL DUE** | **{{netTotal}}** |

---

**Payment Terms:** Net 30  
**Payment Methods:** Bank Transfer, PayPal, Zelle

*Thank you for your business!*
`,
  },
  {
    id: 'annual-summary',
    name: 'Annual Summary',
    description: 'Year-end earnings summary across all platforms',
    builtIn: true,
    createdAt: new Date().toISOString(),
    markdown: `# Annual Earnings Summary — {{year}}

**Prepared for:** {{contractorName}}  
**Generated:** {{generatedDate}}

---

## Overview

| Metric | Value |
|--------|-------|
| Total Gross Earnings | {{grossTotal}} |
| Total Fees | -{{feesTotal}} |
| **Net Earnings** | **{{netTotal}}** |
| Total Transactions | {{payoutCount}} |
| Platforms Used | {{platformCount}} |

---

## By Platform

{{platformBreakdown}}

---

## Monthly Breakdown

{{monthlyBreakdown}}

---

## Tax Estimate

| | |
|---|---|
| Gross Self-Employment Income | {{grossTotal}} |
| SE Tax Deduction (50%) | -{{seTaxDeduction}} |
| Estimated SE Tax (15.3%) | {{seTax}} |
| Estimated Federal (22%) | {{federalTax}} |
| **Estimated Quarterly Payment** | **{{quarterlyEstimate}}** |

> *This is an estimate only. Consult a tax professional.*

---

*Generated by GigLedger Pro · {{generatedDate}}*
`,
  },
  {
    id: 'weekly-summary',
    name: 'Weekly Summary',
    description: 'Simple weekly earnings recap',
    builtIn: true,
    createdAt: new Date().toISOString(),
    markdown: `# Weekly Earnings — {{startDate}} to {{endDate}}

**Contractor:** {{contractorName}}

---

## This Week

| | |
|---|---|
| Gross Earnings | {{grossTotal}} |
| Fees | -{{feesTotal}} |
| **Net Pay** | **{{netTotal}}** |
| Entries | {{payoutCount}} |

---

## Entries

{{entriesTable}}

---

*GigLedger Pro · {{generatedDate}}*
`,
  },
]

export const DEFAULT_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'invoice-delivery',
    name: 'Invoice Delivery',
    description: 'Send invoice to client',
    builtIn: true,
    createdAt: new Date().toISOString(),
    subject: 'Invoice {{invoiceNumber}} from {{contractorName}}',
    body: `Hi {{clientName}},

Please find attached Invoice **{{invoiceNumber}}** for **{{projectName}}**.

| | |
|---|---|
| Amount Due | {{totalAmount}} |
| Due Date | {{dueDate}} |
| Payment Method | {{paymentMethod}} |

**Payment Instructions:**  
{{paymentInstructions}}

Please don't hesitate to reach out if you have any questions.

Best regards,  
{{contractorName}}  
{{contractorEmail}}
`,
  },
  {
    id: 'payment-received',
    name: 'Payment Received',
    description: 'Confirm receipt of payment from client',
    builtIn: true,
    createdAt: new Date().toISOString(),
    subject: 'Payment Received — {{invoiceNumber}}',
    body: `Hi {{clientName}},

Thank you! I've received your payment of **{{amount}}** for Invoice {{invoiceNumber}}.

This email serves as your receipt.

| | |
|---|---|
| Invoice | {{invoiceNumber}} |
| Amount | {{amount}} |
| Date Received | {{paymentDate}} |
| Project | {{projectName}} |

It was a pleasure working with you. I look forward to future opportunities!

Best,  
{{contractorName}}
`,
  },
  {
    id: 'overdue-reminder',
    name: 'Overdue Invoice Reminder',
    description: 'Politely follow up on unpaid invoice',
    builtIn: true,
    createdAt: new Date().toISOString(),
    subject: 'Friendly Reminder — Invoice {{invoiceNumber}} Overdue',
    body: `Hi {{clientName}},

I hope you're doing well! I wanted to send a friendly reminder that Invoice **{{invoiceNumber}}** for **{{amount}}** was due on **{{dueDate}}**.

If you've already sent payment, please disregard this message.

If you have any questions or need to arrange alternative payment terms, I'm happy to discuss.

| | |
|---|---|
| Invoice # | {{invoiceNumber}} |
| Amount Due | {{amount}} |
| Original Due Date | {{dueDate}} |
| Days Overdue | {{daysOverdue}} |

You can pay via: {{paymentMethod}}

Thank you for your attention to this matter.

Best regards,  
{{contractorName}}  
{{contractorEmail}}
`,
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    description: 'Send a project quote to a potential client',
    builtIn: true,
    createdAt: new Date().toISOString(),
    subject: 'Project Proposal — {{projectName}}',
    body: `Hi {{clientName}},

Thank you for reaching out! I'm excited about the opportunity to work on **{{projectName}}**.

Based on our conversation, here's my proposal:

## Scope of Work

{{scopeOfWork}}

## Timeline

**Start Date:** {{startDate}}  
**Estimated Completion:** {{endDate}}

## Investment

| Service | Price |
|---------|-------|
{{lineItems}}
| **Total** | **{{totalAmount}}** |

## Terms

- 50% deposit required to begin
- Remaining balance due upon completion
- Revisions: {{revisionPolicy}}

To move forward, simply reply to this email and I'll send over the contract and first invoice.

Looking forward to working with you!

Best,  
{{contractorName}}  
{{contractorEmail}}
`,
  },
]
TEMPLATES

# ============================================================
#  DATA — Seed Entries
# ============================================================
cat > src/data/seed.ts << 'SEED'
import type { Entry } from '@/types'
import { generateId } from '@/lib/utils'

export const SEED_ENTRIES: Entry[] = [
  { id: generateId(), platformId: 'doordash', createdAt: new Date().toISOString(),
    date: '2026-01-07', period_start: '2026-01-01', period_end: '2026-01-07',
    base_pay: '180', tips: '120', peak_pay: '40.92', deliveries: '24',
    active_hours: '12', dasher_id: '68430056', status: 'Paid' },
  { id: generateId(), platformId: 'doordash', createdAt: new Date().toISOString(),
    date: '2026-01-14', period_start: '2026-01-08', period_end: '2026-01-14',
    base_pay: '155', tips: '95', peak_pay: '30', deliveries: '18',
    active_hours: '9', dasher_id: '68430056', status: 'Paid' },
  { id: generateId(), platformId: 'doordash', createdAt: new Date().toISOString(),
    date: '2026-01-28', period_start: '2026-01-22', period_end: '2026-01-28',
    base_pay: '210', tips: '110', peak_pay: '45', deliveries: '27',
    active_hours: '13', dasher_id: '68430056', status: 'Paid' },
  { id: generateId(), platformId: 'upwork', createdAt: new Date().toISOString(),
    date: '2026-01-10', client_name: 'Acme Corp', contract_title: 'React Dashboard',
    contract_type: 'Fixed Price', gross_amount: '850', upwork_fee: '170', status: 'Paid' },
  { id: generateId(), platformId: 'upwork', createdAt: new Date().toISOString(),
    date: '2026-01-24', client_name: 'TechStartup Inc', contract_title: 'API Integration',
    contract_type: 'Hourly', hours_worked: '12', hourly_rate: '75',
    gross_amount: '900', upwork_fee: '180', status: 'Paid' },
  { id: generateId(), platformId: 'fiverr', createdAt: new Date().toISOString(),
    date: '2026-02-03', buyer_name: 'designlover99', gig_title: 'Logo Design',
    gig_package: 'Premium', gig_price: '250', tip: '30', fiverr_fee: '56',
    status: 'Completed', rating: '5 ⭐' },
  { id: generateId(), platformId: 'direct', createdAt: new Date().toISOString(),
    date: '2026-02-10', client_name: 'Johnson LLC', project_name: 'Brand Refresh',
    contract_type: 'Fixed Price', gross_amount: '2400', payment_method: 'Bank Transfer',
    status: 'Paid', invoice_number: 'INV-0042' },
  { id: generateId(), platformId: 'upwork', createdAt: new Date().toISOString(),
    date: '2026-02-18', client_name: 'Global Media', contract_title: 'Content Strategy',
    contract_type: 'Retainer', gross_amount: '1200', upwork_fee: '240', status: 'Paid' },
  { id: generateId(), platformId: 'direct', createdAt: new Date().toISOString(),
    date: '2026-03-05', client_name: 'StartupXYZ', project_name: 'MVP Website',
    contract_type: 'Milestone', gross_amount: '3500', payment_method: 'PayPal',
    status: 'Pending', invoice_number: 'INV-0043', due_date: '2026-03-20' },
  { id: generateId(), platformId: 'etsy', createdAt: new Date().toISOString(),
    date: '2026-03-10', order_id: 'ORD-99312', item_name: 'Custom Sticker Pack',
    quantity: '3', sale_price: '45', transaction_fee: '2.93',
    status: 'Completed', buyer_location: 'US' },
]
SEED

echo "📄  Data files created"

# ============================================================
#  STORE — Zustand
# ============================================================
cat > src/store/index.ts << 'STORE'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Platform, Entry, StatementTemplate, EmailTemplate, AppSettings } from '@/types'
import { DEFAULT_PLATFORMS } from '@/data/platforms'
import { DEFAULT_STATEMENT_TEMPLATES, DEFAULT_EMAIL_TEMPLATES } from '@/data/templates'
import { SEED_ENTRIES } from '@/data/seed'
import { generateId } from '@/lib/utils'

interface AppStore {
  // Data
  platforms: Platform[]
  entries: Entry[]
  statementTemplates: StatementTemplate[]
  emailTemplates: EmailTemplate[]
  settings: AppSettings

  // Platform actions
  addPlatform: (p: Omit<Platform, 'id' | 'createdAt'>) => void
  updatePlatform: (id: string, p: Partial<Platform>) => void
  deletePlatform: (id: string) => void

  // Entry actions
  addEntry: (e: Omit<Entry, 'id' | 'createdAt'>) => void
  updateEntry: (id: string, e: Partial<Entry>) => void
  deleteEntry: (id: string) => void
  bulkDeleteEntries: (ids: string[]) => void

  // Template actions
  addStatementTemplate: (t: Omit<StatementTemplate, 'id' | 'createdAt'>) => void
  updateStatementTemplate: (id: string, t: Partial<StatementTemplate>) => void
  deleteStatementTemplate: (id: string) => void

  addEmailTemplate: (t: Omit<EmailTemplate, 'id' | 'createdAt'>) => void
  updateEmailTemplate: (id: string, t: Partial<EmailTemplate>) => void
  deleteEmailTemplate: (id: string) => void

  // Settings
  updateSettings: (s: Partial<AppSettings>) => void

  // Utils
  getPlatform: (id: string) => Platform | undefined
  getEntriesForPlatform: (id: string) => Entry[]
  getGrossForEntry: (e: Entry) => number
  getNetForEntry: (e: Entry) => number
  importData: (data: Partial<AppStore>) => void
  resetToDefaults: () => void
}

const DEFAULT_SETTINGS: AppSettings = {
  name: '',
  businessName: '',
  taxId: '',
  currency: 'USD',
  email: '',
  address: '',
}

function getGrossForEntry(entry: Entry, platform: Platform | undefined): number {
  if (!platform) return 0
  return platform.fields.reduce((sum, f) => {
    if (f.type !== 'currency') return sum
    const val = parseFloat(String(entry[f.id] ?? 0)) || 0
    const isFee = /fee|cost|tax|deduct|withheld/.test(f.id)
    return isFee ? sum : sum + val
  }, 0)
}

function getNetForEntry(entry: Entry, platform: Platform | undefined): number {
  if (!platform) return 0
  const gross = getGrossForEntry(entry, platform)
  const fees = platform.fields.reduce((sum, f) => {
    if (f.type !== 'currency') return sum
    const val = parseFloat(String(entry[f.id] ?? 0)) || 0
    const isFee = /fee|cost|tax|deduct|withheld/.test(f.id)
    return isFee ? sum + val : sum
  }, 0)
  return Math.max(0, gross - fees)
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      platforms: DEFAULT_PLATFORMS,
      entries: SEED_ENTRIES,
      statementTemplates: DEFAULT_STATEMENT_TEMPLATES,
      emailTemplates: DEFAULT_EMAIL_TEMPLATES,
      settings: DEFAULT_SETTINGS,

      addPlatform: (p) => set(s => ({
        platforms: [...s.platforms, { ...p, id: generateId(), createdAt: new Date().toISOString() }],
      })),
      updatePlatform: (id, p) => set(s => ({
        platforms: s.platforms.map(pl => pl.id === id ? { ...pl, ...p } : pl),
      })),
      deletePlatform: (id) => set(s => ({
        platforms: s.platforms.filter(pl => pl.id !== id),
      })),

      addEntry: (e) => set(s => ({
        entries: [...s.entries, { ...e, id: generateId(), createdAt: new Date().toISOString() }],
      })),
      updateEntry: (id, e) => set(s => ({
        entries: s.entries.map(en => en.id === id ? { ...en, ...e, updatedAt: new Date().toISOString() } : en),
      })),
      deleteEntry: (id) => set(s => ({ entries: s.entries.filter(e => e.id !== id) })),
      bulkDeleteEntries: (ids) => set(s => ({ entries: s.entries.filter(e => !ids.includes(e.id)) })),

      addStatementTemplate: (t) => set(s => ({
        statementTemplates: [...s.statementTemplates, { ...t, id: generateId(), createdAt: new Date().toISOString() }],
      })),
      updateStatementTemplate: (id, t) => set(s => ({
        statementTemplates: s.statementTemplates.map(tpl => tpl.id === id ? { ...tpl, ...t } : tpl),
      })),
      deleteStatementTemplate: (id) => set(s => ({
        statementTemplates: s.statementTemplates.filter(t => t.id !== id),
      })),

      addEmailTemplate: (t) => set(s => ({
        emailTemplates: [...s.emailTemplates, { ...t, id: generateId(), createdAt: new Date().toISOString() }],
      })),
      updateEmailTemplate: (id, t) => set(s => ({
        emailTemplates: s.emailTemplates.map(tpl => tpl.id === id ? { ...tpl, ...t } : tpl),
      })),
      deleteEmailTemplate: (id) => set(s => ({
        emailTemplates: s.emailTemplates.filter(t => t.id !== id),
      })),

      updateSettings: (s) => set(st => ({ settings: { ...st.settings, ...s } })),

      getPlatform: (id) => get().platforms.find(p => p.id === id),
      getEntriesForPlatform: (id) => get().entries.filter(e => e.platformId === id),
      getGrossForEntry: (e) => getGrossForEntry(e, get().platforms.find(p => p.id === e.platformId)),
      getNetForEntry: (e) => getNetForEntry(e, get().platforms.find(p => p.id === e.platformId)),

      importData: (data) => set(s => ({
        platforms: data.platforms ?? s.platforms,
        entries: data.entries ? [...s.entries, ...data.entries] : s.entries,
        statementTemplates: data.statementTemplates ?? s.statementTemplates,
        emailTemplates: data.emailTemplates ?? s.emailTemplates,
        settings: data.settings ?? s.settings,
      })),
      resetToDefaults: () => set({
        platforms: DEFAULT_PLATFORMS,
        entries: SEED_ENTRIES,
        statementTemplates: DEFAULT_STATEMENT_TEMPLATES,
        emailTemplates: DEFAULT_EMAIL_TEMPLATES,
        settings: DEFAULT_SETTINGS,
      }),
    }),
    { name: 'gigledger-pro-v1' }
  )
)
STORE

echo "🗄️   Store created"

# ============================================================
#  UI COMPONENTS (shadcn-style primitives)
# ============================================================

cat > src/components/ui/button.tsx << 'BUTTON'
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:     'bg-indigo-500 text-white shadow hover:bg-indigo-400 active:scale-[.98]',
        destructive: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        outline:     'border border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600',
        secondary:   'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
        ghost:       'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
        success:     'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20',
        link:        'text-indigo-400 underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm:      'h-7 px-3 text-xs',
        lg:      'h-11 px-6',
        icon:    'h-9 w-9 p-0',
        'icon-sm': 'h-7 w-7 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
BUTTON

cat > src/components/ui/input.tsx << 'INPUT'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-100 placeholder:text-zinc-600 transition-colors',
        'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = 'Input'
export { Input }
INPUT

cat > src/components/ui/textarea.tsx << 'TEXTAREA'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 resize-none transition-colors',
        'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
)
Textarea.displayName = 'Textarea'
export { Textarea }
TEXTAREA

cat > src/components/ui/label.tsx << 'LABEL'
import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn('text-xs font-medium text-zinc-400 uppercase tracking-wider leading-none', className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName
export { Label }
LABEL

cat > src/components/ui/select.tsx << 'SELECT'
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-9 w-full items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600',
      'focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30',
      'disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-60 min-w-[8rem] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-xl',
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport className={cn('p-1', position === 'popper' && 'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]')}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-sm outline-none',
      'focus:bg-zinc-800 focus:text-zinc-100',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-indigo-400" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
SELECT

cat > src/components/ui/dialog.tsx << 'DIALOG'
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0', className)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
        'w-full max-w-lg max-h-[90vh] overflow-y-auto',
        'bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2',
        'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-lg p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors focus:outline-none">
        <X className="h-4 w-4" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col gap-1.5 p-6 pb-0', className)} {...props} />
)
const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-end gap-2 p-6 pt-4', className)} {...props} />
)
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-base font-semibold text-zinc-100 leading-none tracking-tight', className)} {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-sm text-zinc-500 mt-1', className)} {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogClose, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription }
DIALOG

cat > src/components/ui/badge.tsx << 'BADGE'
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors',
  {
    variants: {
      variant: {
        default:     'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20',
        secondary:   'bg-zinc-800 text-zinc-400 border border-zinc-700',
        success:     'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
        warning:     'bg-amber-500/15 text-amber-400 border border-amber-500/20',
        destructive: 'bg-red-500/15 text-red-400 border border-red-500/20',
        outline:     'border border-zinc-700 text-zinc-400',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
BADGE

cat > src/components/ui/card.tsx << 'CARD'
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100', className)} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1 p-5 pb-0', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-semibold leading-none tracking-tight text-zinc-100', className)} {...props} />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-zinc-500', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-5', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-5 pt-0', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
CARD

cat > src/components/ui/tabs.tsx << 'TABS'
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex h-9 items-center justify-start rounded-lg bg-zinc-900 border border-zinc-800 p-1 gap-1', className)}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium text-zinc-500 transition-all',
      'focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm',
      'hover:text-zinc-300',
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-4 focus-visible:outline-none', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
TABS

cat > src/components/ui/tooltip.tsx << 'TOOLTIP'
import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 shadow-xl',
        'animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
TOOLTIP

cat > src/components/ui/separator.tsx << 'SEPARATOR'
import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn('shrink-0 bg-zinc-800', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName
export { Separator }
SEPARATOR

cat > src/components/ui/switch.tsx << 'SWITCH'
import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(
      'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-indigo-500 data-[state=unchecked]:bg-zinc-700',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitive.Thumb className={cn('pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0')} />
  </SwitchPrimitive.Root>
))
Switch.displayName = SwitchPrimitive.Root.displayName
export { Switch }
SWITCH

cat > src/components/ui/toast.tsx << 'TOASTUI'
import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider = ToastPrimitive.Provider
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn('fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px]', className)}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & { variant?: 'default' | 'success' | 'error' }
>(({ className, variant = 'default', ...props }, ref) => (
  <ToastPrimitive.Root
    ref={ref}
    className={cn(
      'group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-xl border p-4 shadow-xl transition-all',
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-bottom-full',
      variant === 'default' && 'bg-zinc-900 border-zinc-700 text-zinc-100',
      variant === 'success' && 'bg-zinc-900 border-emerald-500/30 text-zinc-100',
      variant === 'error'   && 'bg-zinc-900 border-red-500/30 text-zinc-100',
      className
    )}
    {...props}
  />
))
Toast.displayName = ToastPrimitive.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title ref={ref} className={cn('text-sm font-semibold', className)} {...props} />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description ref={ref} className={cn('text-xs text-zinc-500', className)} {...props} />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn('rounded p-1 text-zinc-500 hover:text-zinc-200 transition-colors', className)}
    toast-close=""
    {...props}
  >
    <X className="h-3 w-3" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose }
TOASTUI

cat > src/hooks/use-toast.ts << 'USETOAST'
import * as React from 'react'

type ToastVariant = 'default' | 'success' | 'error'
interface ToastState { id: string; title: string; description?: string; variant?: ToastVariant; open: boolean }

const listeners: Array<(state: ToastState[]) => void> = []
let toasts: ToastState[] = []

function dispatch(action: { type: 'ADD' | 'REMOVE' | 'UPDATE'; toast: Partial<ToastState> & { id: string } }) {
  if (action.type === 'ADD') toasts = [action.toast as ToastState, ...toasts].slice(0, 5)
  else if (action.type === 'REMOVE') toasts = toasts.filter(t => t.id !== action.toast.id)
  else if (action.type === 'UPDATE') toasts = toasts.map(t => t.id === action.toast.id ? { ...t, ...action.toast } : t)
  listeners.forEach(l => l([...toasts]))
}

export function toast({ title, description, variant = 'default' }: { title: string; description?: string; variant?: ToastVariant }) {
  const id = Math.random().toString(36).slice(2)
  dispatch({ type: 'ADD', toast: { id, title, description, variant, open: true } })
  setTimeout(() => dispatch({ type: 'REMOVE', toast: { id } }), 4000)
  return id
}

export function useToast() {
  const [state, setState] = React.useState<ToastState[]>(toasts)
  React.useEffect(() => {
    listeners.push(setState)
    return () => { const i = listeners.indexOf(setState); if (i > -1) listeners.splice(i, 1) }
  }, [])
  return { toasts: state, toast, dismiss: (id: string) => dispatch({ type: 'REMOVE', toast: { id } }) }
}
USETOAST

echo "🎨  UI components created"

# ============================================================
#  LAYOUT COMPONENTS
# ============================================================

cat > src/components/layout/Sidebar.tsx << 'SIDEBAR'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FileText, PlusCircle, Briefcase,
  FileOutput, BarChart3, Settings, ShieldCheck, Mail, BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/store'

const navItems = [
  { section: 'Overview', items: [
    { to: '/',          label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/reports',   label: 'Reports',     icon: BarChart3 },
  ]},
  { section: 'Earnings', items: [
    { to: '/entries',   label: 'All Entries', icon: FileText },
    { to: '/entries/new', label: 'Add Entry', icon: PlusCircle },
    { to: '/platforms', label: 'Platforms',   icon: Briefcase },
  ]},
  { section: 'Generate', items: [
    { to: '/statements', label: 'Statements', icon: FileOutput },
    { to: '/editor',     label: 'MD Editor',  icon: BookOpen },
    { to: '/email',      label: 'Email Templates', icon: Mail },
  ]},
  { section: 'System', items: [
    { to: '/admin',    label: 'Admin',       icon: ShieldCheck },
    { to: '/settings', label: 'Settings',    icon: Settings },
  ]},
]

export function Sidebar() {
  const entries = useStore(s => s.entries)

  return (
    <aside className="w-[230px] min-w-[230px] bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="p-4 pb-3 border-b border-zinc-800 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-base shadow-lg shadow-indigo-500/20 shrink-0">
          💸
        </div>
        <div>
          <div className="text-sm font-bold text-zinc-100 tracking-tight">GigLedger Pro</div>
          <div className="text-[10px] text-zinc-500">Earnings Tracker</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {navItems.map(section => (
          <div key={section.section} className="px-2 mb-1">
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-widest px-2 py-2">
              {section.section}
            </p>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium mb-0.5 transition-all',
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'
                )}
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-indigo-400' : 'text-zinc-600')} />
                    <span>{item.label}</span>
                    {item.to === '/entries' && entries.length > 0 && (
                      <span className="ml-auto text-[10px] font-semibold bg-indigo-500 text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {entries.length}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <p className="text-[10px] text-zinc-600">GigLedger Pro v1.0</p>
      </div>
    </aside>
  )
}
SIDEBAR

cat > src/components/layout/Shell.tsx << 'SHELL'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

function Toaster() {
  const { toasts } = useToast()
  return (
    <ToastProvider>
      {toasts.map(t => (
        <Toast key={t.id} variant={t.variant} open={t.open}>
          <div className="flex-1">
            <ToastTitle>{t.title}</ToastTitle>
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

export function Shell() {
  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <Outlet />
      </main>
      <Toaster />
    </div>
  )
}
SHELL

echo "🏗️   Layout components created"

# ============================================================
#  SHARED COMPONENTS
# ============================================================

cat > src/components/ui/stat-card.tsx << 'STATCARD'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeUp?: boolean
  icon?: LucideIcon
  accentColor?: string
  className?: string
}

export function StatCard({ label, value, change, changeUp, icon: Icon, accentColor = '#818cf8', className }: StatCardProps) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-4', className)}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}66, transparent)` }} />
      <div className="flex items-start justify-between mb-2">
        <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accentColor}15` }}>
            <Icon className="w-3.5 h-3.5" style={{ color: accentColor }} />
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-zinc-100 tracking-tight font-mono">{value}</p>
      {change && (
        <p className={cn('text-[11px] mt-1', changeUp ? 'text-emerald-400' : 'text-red-400')}>
          {changeUp ? '▲' : '▼'} {change}
        </p>
      )}
    </div>
  )
}
STATCARD

cat > src/components/ui/empty-state.tsx << 'EMPTYSTATE'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-zinc-600" />
        </div>
      )}
      <p className="text-sm font-semibold text-zinc-300 mb-1">{title}</p>
      {description && <p className="text-xs text-zinc-600 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  )
}
EMPTYSTATE

cat > src/components/ui/page-header.tsx << 'PAGEHEADER'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)}>
      <div>
        <h1 className="text-xl font-bold text-zinc-100 tracking-tight">{title}</h1>
        {description && <p className="text-sm text-zinc-500 mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
PAGEHEADER

echo "🧩  Shared components created"

# ============================================================
#  PLATFORM ICON PICKER
# ============================================================

cat > src/components/platforms/IconPicker.tsx << 'ICONPICKER'
import * as React from 'react'
import * as Popover from '@radix-ui/react-popover'
import { Upload, Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Platform } from '@/types'

const COMMON_EMOJIS = [
  '💼','🍔','🚗','🛒','🏠','🛍️','🟢','🤝','💰','📱','🎨','✍️','📸','🎵','🎬',
  '🔧','⚡','🌐','📊','💻','🧑‍💻','🎓','🏋️','🍕','☕','🧹','📦','✈️','🚀','🎯',
  '💡','🔑','🌟','💎','🏆','🎪','🎭','🛠️','🔬','📝','💌','🎁','🌈','🦄','🔥',
]

interface IconPickerProps {
  value: string
  iconType: 'emoji' | 'image'
  color: string
  name: string
  onChange: (icon: string, iconType: 'emoji' | 'image') => void
}

export function IconPicker({ value, iconType, color, name, onChange }: IconPickerProps) {
  const [search, setSearch] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const fileRef = React.useRef<HTMLInputElement>(null)

  const filtered = COMMON_EMOJIS.filter(e => e.includes(search) || !search)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      onChange(ev.target?.result as string, 'image')
      setOpen(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center text-2xl border-2 border-dashed border-zinc-700',
            'hover:border-indigo-500 transition-colors cursor-pointer overflow-hidden'
          )}
          style={{ background: `${color}22` }}
          title="Click to change icon"
        >
          {iconType === 'image'
            ? <img src={value} alt={name} className="w-full h-full object-cover" />
            : <span>{value}</span>
          }
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl p-3"
          sideOffset={8}
          align="start"
        >
          <p className="text-xs font-semibold text-zinc-400 mb-2">Choose Icon</p>

          {/* Upload image */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-dashed border-zinc-700 text-xs text-zinc-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors mb-3"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload image / logo
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

          {/* Emoji search */}
          <Input
            placeholder="Search emoji..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mb-2 h-7 text-xs"
          />

          {/* Emoji grid */}
          <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
            {filtered.map(emoji => (
              <button
                key={emoji}
                type="button"
                onClick={() => { onChange(emoji, 'emoji'); setOpen(false) }}
                className={cn(
                  'w-7 h-7 rounded-md flex items-center justify-center text-base hover:bg-zinc-800 transition-colors',
                  value === emoji && iconType === 'emoji' && 'bg-indigo-500/20 ring-1 ring-indigo-500'
                )}
              >
                {emoji}
              </button>
            ))}
          </div>

          <Popover.Arrow className="fill-zinc-700" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
ICONPICKER

# ============================================================
#  ENTRY FORM (dynamic fields)
# ============================================================

cat > src/components/entries/EntryForm.tsx << 'ENTRYFORM'
import * as React from 'react'
import { useStore } from '@/store'
import type { Entry, Platform, PlatformField } from '@/types'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface EntryFormProps {
  platform: Platform
  initialValues?: Partial<Entry>
  onChange?: (values: Record<string, unknown>) => void
  formRef?: React.RefObject<Record<string, unknown>>
}

export function EntryForm({ platform, initialValues = {}, formRef }: EntryFormProps) {
  const [values, setValues] = React.useState<Record<string, unknown>>(() => {
    const init: Record<string, unknown> = {}
    platform.fields.forEach(f => { init[f.id] = initialValues[f.id] ?? '' })
    return init
  })

  React.useEffect(() => {
    if (formRef) (formRef as React.MutableRefObject<Record<string, unknown>>).current = values
  }, [values, formRef])

  function set(id: string, val: unknown) {
    setValues(prev => ({ ...prev, [id]: val }))
    if (formRef) (formRef as React.MutableRefObject<Record<string, unknown>>).current = { ...values, [id]: val }
  }

  // Group into pairs for layout
  const pairs: PlatformField[][] = []
  const fields = platform.fields
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    const next = fields[i + 1]
    if (f.type !== 'textarea' && f.type !== 'checkbox' && next && next.type !== 'textarea' && next.type !== 'checkbox') {
      pairs.push([f, next]); i++
    } else {
      pairs.push([f])
    }
  }

  return (
    <div className="space-y-3">
      {pairs.map((pair, idx) => (
        <div key={idx} className={cn('grid gap-3', pair.length === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
          {pair.map(field => (
            <FieldInput key={field.id} field={field} value={values[field.id]} onChange={val => set(field.id, val)} />
          ))}
        </div>
      ))}
    </div>
  )
}

interface FieldInputProps {
  field: PlatformField
  value: unknown
  onChange: (val: unknown) => void
}

function FieldInput({ field, value, onChange }: FieldInputProps) {
  const strVal = String(value ?? '')

  if (field.type === 'checkbox') {
    return (
      <div className="flex items-center gap-2">
        <Switch checked={!!value} onCheckedChange={onChange} id={field.id} />
        <Label htmlFor={field.id} className="text-zinc-300 normal-case text-sm">{field.label}</Label>
      </div>
    )
  }

  if (field.type === 'textarea') {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.id}>{field.label}</Label>
        <Textarea id={field.id} value={strVal} onChange={e => onChange(e.target.value)} placeholder={field.placeholder} className="min-h-[72px]" />
      </div>
    )
  }

  if (field.type === 'select') {
    return (
      <div className="space-y-1">
        <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}</Label>
        <Select value={strVal || undefined} onValueChange={onChange}>
          <SelectTrigger id={field.id}><SelectValue placeholder="Select..." /></SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    )
  }

  const inputType = field.type === 'currency' || field.type === 'number' ? 'number'
    : field.type === 'date' ? 'date'
    : field.type === 'email' ? 'email'
    : field.type === 'url' ? 'url'
    : 'text'

  return (
    <div className="space-y-1">
      <Label htmlFor={field.id}>{field.label}{field.required && <span className="text-red-400 ml-0.5">*</span>}</Label>
      <div className="relative">
        {field.type === 'currency' && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">$</span>
        )}
        <Input
          id={field.id}
          type={inputType}
          value={strVal}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder || (field.type === 'currency' ? '0.00' : field.type === 'number' ? '0' : '')}
          step={field.type === 'currency' ? '0.01' : undefined}
          min={field.type === 'currency' || field.type === 'number' ? '0' : undefined}
          className={field.type === 'currency' ? 'pl-6' : ''}
        />
      </div>
    </div>
  )
}
ENTRYFORM

echo "📋  Entry form created"

# ============================================================
#  MARKDOWN / PDF EDITOR COMPONENT
# ============================================================

cat > src/components/editor/MarkdownEditor.tsx << 'MDEDITOR'
import * as React from 'react'
import { marked } from 'marked'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered,
  Link, Heading1, Heading2, Heading3, Quote, Table, Minus, Eye, Edit3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

interface MarkdownEditorProps {
  value: string
  onChange: (val: string) => void
  minHeight?: string
  className?: string
}

const TOOLBAR: Array<{ icon: React.ElementType; label: string; wrap?: [string, string]; line?: string } | 'sep'> = [
  { icon: Heading1, label: 'H1', line: '# ' },
  { icon: Heading2, label: 'H2', line: '## ' },
  { icon: Heading3, label: 'H3', line: '### ' },
  'sep',
  { icon: Bold,          label: 'Bold',       wrap: ['**', '**'] },
  { icon: Italic,        label: 'Italic',     wrap: ['_', '_'] },
  { icon: Strikethrough, label: 'Strike',     wrap: ['~~', '~~'] },
  { icon: Code,          label: 'Code',       wrap: ['`', '`'] },
  'sep',
  { icon: List,          label: 'Bullet List', line: '- ' },
  { icon: ListOrdered,   label: 'Number List', line: '1. ' },
  { icon: Quote,         label: 'Quote',       line: '> ' },
  'sep',
  { icon: Link,          label: 'Link',        wrap: ['[', '](url)'] },
  { icon: Table,         label: 'Table',       line: '| Col 1 | Col 2 |\n|-------|-------|\n| Cell  | Cell  |' },
  { icon: Minus,         label: 'HR',          line: '\n---\n' },
]

export function MarkdownEditor({ value, onChange, minHeight = '400px', className }: MarkdownEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [preview, setPreview] = React.useState<string>('')
  const [tab, setTab] = React.useState('edit')

  React.useEffect(() => {
    if (tab === 'preview') {
      setPreview(marked.parse(value) as string)
    }
  }, [value, tab])

  function insertAtCursor(before: string, after = '') {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    const newVal = value.slice(0, start) + before + selected + after + value.slice(end)
    onChange(newVal)
    setTimeout(() => {
      el.selectionStart = start + before.length
      el.selectionEnd = start + before.length + selected.length
      el.focus()
    }, 0)
  }

  function insertLine(prefix: string) {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart)
    onChange(newVal)
    setTimeout(() => { el.selectionStart = el.selectionEnd = start + prefix.length; el.focus() }, 0)
  }

  function handleToolbarClick(item: typeof TOOLBAR[number]) {
    if (item === 'sep') return
    if (item.wrap) insertAtCursor(item.wrap[0], item.wrap[1])
    else if (item.line) insertLine(item.line)
  }

  function handleExportMarkdown() {
    const blob = new Blob([value], { type: 'text/markdown' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'document.md'
    a.click()
    toast({ title: 'Markdown exported', variant: 'success' })
  }

  function handleExportHtml() {
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Document</title>
<style>body{font-family:Georgia,serif;max-width:780px;margin:40px auto;padding:0 20px;line-height:1.7;color:#111}
h1,h2,h3{margin:1.2em 0 .4em}table{width:100%;border-collapse:collapse}
th,td{border:1px solid #ddd;padding:8px 12px}th{background:#f5f5f5}
blockquote{border-left:3px solid #888;margin:0;padding-left:12px;color:#555}
code{background:#f5f5f5;padding:1px 5px;border-radius:3px}pre{background:#f5f5f5;padding:12px;overflow:auto}
</style></head><body>${marked.parse(value)}</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'document.html'
    a.click()
    toast({ title: 'HTML exported', variant: 'success' })
  }

  function handlePrintPdf() {
    const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Document</title>
<style>body{font-family:Georgia,serif;max-width:720px;margin:0 auto;padding:24px 32px;line-height:1.7;color:#111;font-size:13px}
h1,h2,h3{margin:1em 0 .3em}table{width:100%;border-collapse:collapse;margin:12px 0}
th,td{border:1px solid #ccc;padding:6px 10px}th{background:#f5f5f5;font-weight:600}
blockquote{border-left:3px solid #666;margin:0;padding-left:12px;color:#555}
hr{border:none;border-top:1px solid #ddd;margin:18px 0}
code{background:#f5f5f5;padding:1px 4px;border-radius:3px;font-size:12px}
pre{background:#f5f5f5;padding:10px;border-radius:4px;overflow:auto}
@media print{body{margin:0;padding:20px 28px}}
</style></head><body>${marked.parse(value)}</body></html>`
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.onload = () => win.print()
    toast({ title: 'Print dialog opened — save as PDF', variant: 'success' })
  }

  return (
    <div className={cn('flex flex-col border border-zinc-800 rounded-xl overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-zinc-800 bg-zinc-900 flex-wrap">
        {TOOLBAR.map((item, i) =>
          item === 'sep'
            ? <div key={i} className="w-px h-4 bg-zinc-700 mx-1" />
            : (
              <button
                key={i}
                type="button"
                title={item.label}
                onClick={() => handleToolbarClick(item)}
                className="w-7 h-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                <item.icon className="w-3.5 h-3.5" />
              </button>
            )
        )}
        <div className="ml-auto flex gap-1">
          <Button variant="ghost" size="sm" onClick={handleExportMarkdown} className="h-7 text-xs px-2">⬇ .md</Button>
          <Button variant="ghost" size="sm" onClick={handleExportHtml} className="h-7 text-xs px-2">⬇ .html</Button>
          <Button variant="ghost" size="sm" onClick={handlePrintPdf} className="h-7 text-xs px-2">🖨 PDF</Button>
        </div>
      </div>

      {/* Edit / Preview tabs */}
      <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
        <div className="flex items-center px-3 pt-2 border-b border-zinc-800 bg-zinc-900">
          <TabsList className="h-7 border-0 bg-zinc-800 p-0.5 gap-0.5">
            <TabsTrigger value="edit" className="h-6 px-2.5 text-xs gap-1"><Edit3 className="w-3 h-3" />Edit</TabsTrigger>
            <TabsTrigger value="preview" className="h-6 px-2.5 text-xs gap-1"><Eye className="w-3 h-3" />Preview</TabsTrigger>
          </TabsList>
          <span className="ml-auto text-[10px] text-zinc-600">{value.length} chars · {value.split('\n').length} lines</span>
        </div>

        <TabsContent value="edit" className="flex-1 m-0 p-0">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full bg-zinc-950 text-zinc-200 text-sm font-mono resize-none outline-none p-4 leading-relaxed"
            style={{ minHeight }}
            placeholder="Write markdown here..."
            spellCheck={false}
          />
        </TabsContent>
        <TabsContent value="preview" className="flex-1 m-0 p-0">
          <div
            className="prose-editor p-4 text-zinc-300 overflow-y-auto"
            style={{ minHeight }}
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
MDEDITOR

echo "📝  Markdown editor created"

# ============================================================
#  PAGES
# ============================================================

cat > src/pages/Dashboard.tsx << 'DASHBOARD'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '@/store'
import { formatCurrency, formatDate, getStatusVariant } from '@/lib/utils'
import { StatCard } from '@/components/ui/stat-card'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Bar } from 'react-chartjs-2'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js'
import { DollarSign, TrendingUp, Layers, FileText, PlusCircle } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend)

const CHART_COLORS = ['#818cf8','#34d399','#fbbf24','#f87171','#60a5fa','#c084fc','#fb923c','#2dd4bf']

export default function Dashboard() {
  const { entries, platforms, getGrossForEntry, getNetForEntry } = useStore()

  const now = new Date()

  const stats = useMemo(() => {
    const thisMonthEntries = entries.filter(e => {
      const d = new Date(String(e.date) || e.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    const lastMonthEntries = entries.filter(e => {
      const d = new Date(String(e.date) || e.createdAt)
      const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()
    })
    const ytdEntries = entries.filter(e => new Date(String(e.date) || e.createdAt).getFullYear() === now.getFullYear())

    const thisMonthGross = thisMonthEntries.reduce((s, e) => s + getGrossForEntry(e), 0)
    const lastMonthGross = lastMonthEntries.reduce((s, e) => s + getGrossForEntry(e), 0)
    const pctChange = lastMonthGross > 0 ? ((thisMonthGross - lastMonthGross) / lastMonthGross * 100).toFixed(1) : null
    const ytdGross = ytdEntries.reduce((s, e) => s + getGrossForEntry(e), 0)
    const allTimeGross = entries.reduce((s, e) => s + getGrossForEntry(e), 0)
    const activePlatforms = new Set(entries.map(e => e.platformId)).size

    return { thisMonthGross, pctChange, ytdGross, allTimeGross, activePlatforms, thisMonthCount: thisMonthEntries.length }
  }, [entries])

  // Monthly chart data (last 6 months)
  const monthlyData = useMemo(() => {
    const months: string[] = []
    const data: number[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push(d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }))
      const sum = entries.filter(e => {
        const ed = new Date(String(e.date) || e.createdAt)
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear()
      }).reduce((s, e) => s + getGrossForEntry(e), 0)
      data.push(+sum.toFixed(2))
    }
    return { months, data }
  }, [entries])

  // Platform breakdown
  const platformData = useMemo(() => {
    const map: Record<string, number> = {}
    entries.forEach(e => {
      const p = platforms.find(pl => pl.id === e.platformId)
      if (!p) return
      map[p.name] = (map[p.name] || 0) + getGrossForEntry(e)
    })
    return {
      labels: Object.keys(map),
      data: Object.values(map).map(v => +v.toFixed(2)),
      colors: Object.keys(map).map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
    }
  }, [entries, platforms])

  const recentEntries = [...entries]
    .sort((a, b) => new Date(String(b.date) || b.createdAt).getTime() - new Date(String(a.date) || a.createdAt).getTime())
    .slice(0, 8)

  return (
    <div className="p-6">
      <PageHeader
        title="Dashboard"
        description="Your earnings overview"
        actions={<Link to="/entries/new"><Button size="sm"><PlusCircle className="w-4 h-4" />Add Entry</Button></Link>}
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="This Month" value={formatCurrency(stats.thisMonthGross)} change={stats.pctChange ? `${Math.abs(+stats.pctChange)}% vs last month` : undefined} changeUp={stats.pctChange ? +stats.pctChange >= 0 : undefined} icon={DollarSign} accentColor="#34d399" />
        <StatCard label="Year to Date" value={formatCurrency(stats.ytdGross)} change={`${now.getFullYear()}`} icon={TrendingUp} accentColor="#818cf8" />
        <StatCard label="All Time" value={formatCurrency(stats.allTimeGross)} change={`${entries.length} entries`} icon={FileText} accentColor="#fbbf24" />
        <StatCard label="Active Platforms" value={String(stats.activePlatforms)} change={`of ${platforms.length} configured`} icon={Layers} accentColor="#60a5fa" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card>
          <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Monthly Earnings</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              <Bar
                data={{ labels: monthlyData.months, datasets: [{ label: 'Gross', data: monthlyData.data, backgroundColor: '#818cf866', borderColor: '#818cf8', borderWidth: 1.5, borderRadius: 6 }] }}
                options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#27272a' }, ticks: { color: '#71717a', callback: (v) => '$' + v } }, x: { grid: { display: false }, ticks: { color: '#71717a' } } } }}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Platform Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48">
              {platformData.labels.length > 0 ? (
                <Doughnut
                  data={{ labels: platformData.labels, datasets: [{ data: platformData.data, backgroundColor: platformData.colors, borderWidth: 2, borderColor: '#18181b' }] }}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#a1a1aa', font: { size: 11 }, boxWidth: 10, padding: 8 } } } }}
                />
              ) : <EmptyState title="No data yet" description="Add entries to see breakdown" />}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent entries */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Recent Entries</CardTitle>
          <Link to="/entries"><Button variant="ghost" size="sm" className="text-xs h-7">View all →</Button></Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentEntries.length === 0 ? (
            <EmptyState icon={FileText} title="No entries yet" description="Start by logging your first earnings." action={<Link to="/entries/new"><Button size="sm"><PlusCircle className="w-4 h-4" />Add Entry</Button></Link>} className="py-10" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800">
                  {['Date', 'Platform', 'Description', 'Gross', 'Net', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider px-5 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentEntries.map(entry => {
                  const p = platforms.find(pl => pl.id === entry.platformId)
                  const desc = String(entry.client_name || entry.buyer_name || entry.gig_title || entry.project_name || entry.item_name || entry.listing_name || entry.contract_title || '—')
                  const status = String(entry.status || '—')
                  return (
                    <tr key={entry.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-zinc-400">{formatDate(String(entry.date || ''))}</td>
                      <td className="px-5 py-3">
                        {p && <span className="flex items-center gap-1.5 text-xs"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />{p.name}</span>}
                      </td>
                      <td className="px-5 py-3 text-zinc-400 text-xs max-w-[140px] truncate">{desc}</td>
                      <td className="px-5 py-3 font-mono text-xs text-emerald-400 font-semibold">{formatCurrency(getGrossForEntry(entry))}</td>
                      <td className="px-5 py-3 font-mono text-xs text-zinc-400">{formatCurrency(getNetForEntry(entry))}</td>
                      <td className="px-5 py-3"><Badge variant={getStatusVariant(status)}>{status}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
DASHBOARD

cat > src/pages/Entries.tsx << 'ENTRIESPAGE'
import * as React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { formatCurrency, formatDate, getStatusVariant, generateId } from '@/lib/utils'
import { PageHeader } from '@/components/ui/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { EntryForm } from '@/components/entries/EntryForm'
import { toast } from '@/hooks/use-toast'
import { PlusCircle, Search, Trash2, Pencil, FileText } from 'lucide-react'
import type { Entry } from '@/types'

export default function Entries() {
  const { entries, platforms, deleteEntry, updateEntry, getGrossForEntry, getNetForEntry } = useStore()
  const [search, setSearch] = React.useState('')
  const [filterPlatform, setFilterPlatform] = React.useState('all')
  const [filterStatus, setFilterStatus] = React.useState('all')
  const [editEntry, setEditEntry] = React.useState<Entry | null>(null)
  const formRef = React.useRef<Record<string, unknown>>({})
  const navigate = useNavigate()

  const filtered = React.useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(String(b.date) || b.createdAt).getTime() - new Date(String(a.date) || a.createdAt).getTime())
      .filter(e => {
        if (filterPlatform !== 'all' && e.platformId !== filterPlatform) return false
        if (filterStatus !== 'all' && String(e.status || '').toLowerCase() !== filterStatus) return false
        if (search) {
          const q = search.toLowerCase()
          return JSON.stringify(e).toLowerCase().includes(q)
        }
        return true
      })
  }, [entries, search, filterPlatform, filterStatus])

  function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    deleteEntry(id)
    toast({ title: 'Entry deleted', variant: 'error' })
  }

  function handleUpdate() {
    if (!editEntry) return
    updateEntry(editEntry.id, formRef.current)
    setEditEntry(null)
    toast({ title: 'Entry updated', variant: 'success' })
  }

  function exportCSV() {
    const rows = [['Date', 'Platform', 'Description', 'Gross', 'Net', 'Status']]
    filtered.forEach(e => {
      const p = platforms.find(pl => pl.id === e.platformId)
      const desc = String(e.client_name || e.buyer_name || e.gig_title || e.project_name || e.item_name || '')
      rows.push([String(e.date || ''), p?.name || '', desc, getGrossForEntry(e).toFixed(2), getNetForEntry(e).toFixed(2), String(e.status || '')])
    })
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'gigledger-entries.csv'
    a.click()
    toast({ title: 'CSV exported', variant: 'success' })
  }

  return (
    <div className="p-6">
      <PageHeader
        title="All Entries"
        description={`${entries.length} total earnings records`}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={exportCSV}>⬇ Export CSV</Button>
            <Link to="/entries/new"><Button size="sm"><PlusCircle className="w-4 h-4" />Add Entry</Button></Link>
          </>
        }
      />

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entries..." className="pl-8 h-8 text-xs" />
        </div>
        <Select value={filterPlatform} onValueChange={setFilterPlatform}>
          <SelectTrigger className="w-40 h-8 text-xs"><SelectValue placeholder="All Platforms" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map(p => <SelectItem key={p.id} value={p.id}>{p.icon} {p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32 h-8 text-xs"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {['paid', 'pending', 'completed', 'cancelled', 'overdue'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={FileText} title="No entries found" description="Try adjusting your filters or add a new entry." action={<Link to="/entries/new"><Button size="sm"><PlusCircle className="w-4 h-4" />Add Entry</Button></Link>} />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900">
                {['Date', 'Platform', 'Description', 'Gross', 'Net', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider px-4 py-2.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => {
                const p = platforms.find(pl => pl.id === entry.platformId)
                const desc = String(entry.client_name || entry.buyer_name || entry.gig_title || entry.project_name || entry.item_name || entry.listing_name || entry.contract_title || '—')
                const status = String(entry.status || '—')
                return (
                  <tr key={entry.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors group">
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-400">{formatDate(String(entry.date || ''))}</td>
                    <td className="px-4 py-2.5">
                      {p && (
                        <span className="flex items-center gap-1.5 text-xs">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                          {p.iconType === 'image' ? <img src={p.icon} alt="" className="w-4 h-4 rounded object-cover" /> : <span>{p.icon}</span>}
                          {p.name}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-400 text-xs max-w-[160px] truncate" title={desc}>{desc}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-emerald-400 font-semibold">{formatCurrency(getGrossForEntry(entry))}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-zinc-400">{formatCurrency(getNetForEntry(entry))}</td>
                    <td className="px-4 py-2.5"><Badge variant={getStatusVariant(status)}>{status}</Badge></td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon-sm" onClick={() => { if(p) { setEditEntry(entry); formRef.current = {...entry} } }}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(entry.id)} className="text-red-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editEntry} onOpenChange={open => !open && setEditEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Entry</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-4">
            {editEntry && (() => {
              const p = platforms.find(pl => pl.id === editEntry.platformId)
              return p ? <EntryForm platform={p} initialValues={editEntry} formRef={formRef} /> : null
            })()}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEntry(null)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
ENTRIESPAGE

cat > src/pages/AddEntry.tsx << 'ADDENTRY'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EntryForm } from '@/components/entries/EntryForm'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function AddEntry() {
  const { platforms, addEntry } = useStore()
  const [selectedPlatformId, setSelectedPlatformId] = React.useState(platforms[0]?.id ?? '')
  const formRef = React.useRef<Record<string, unknown>>({})
  const navigate = useNavigate()

  const platform = platforms.find(p => p.id === selectedPlatformId)

  function handleSave() {
    if (!platform) return
    const vals = formRef.current
    const requiredField = platform.fields.find(f => f.required && !vals[f.id])
    if (requiredField) {
      toast({ title: `"${requiredField.label}" is required`, variant: 'error' })
      return
    }
    addEntry({ platformId: selectedPlatformId, ...vals })
    toast({ title: 'Entry saved!', variant: 'success' })
    navigate('/entries')
  }

  return (
    <div className="p-6 max-w-3xl">
      <PageHeader title="Add Entry" description="Log a new earnings record" />

      {/* Platform selector */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Select Platform</p>
        <div className="flex flex-wrap gap-2">
          {platforms.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelectedPlatformId(p.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all',
                selectedPlatformId === p.id
                  ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
              )}
            >
              {p.iconType === 'image'
                ? <img src={p.icon} alt="" className="w-4 h-4 rounded object-cover" />
                : <span>{p.icon}</span>
              }
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic form */}
      {platform && (
        <Card>
          <CardContent className="pt-5">
            <EntryForm platform={platform} formRef={formRef} />
            <div className="flex gap-2 mt-5 pt-4 border-t border-zinc-800">
              <Button onClick={handleSave}>Save Entry</Button>
              <Button variant="outline" onClick={() => navigate('/entries')}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
ADDENTRY

cat > src/pages/Platforms.tsx << 'PLATFORMSPAGE'
import * as React from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { IconPicker } from '@/components/platforms/IconPicker'
import { toast } from '@/hooks/use-toast'
import { formatCurrency, slugify, generateId } from '@/lib/utils'
import { PlusCircle, Pencil, Trash2, Plus, GripVertical, X } from 'lucide-react'
import type { Platform, PlatformField, FieldType } from '@/types'

const CATEGORIES = ['Freelance / Tech', 'Delivery / Rideshare', 'Creative', 'Direct Contract', 'Rental', 'Physical Services', 'Other']
const FIELD_TYPES: FieldType[] = ['text', 'number', 'currency', 'date', 'select', 'textarea', 'checkbox', 'email', 'url']

function defaultPlatform(): Omit<Platform, 'id' | 'createdAt'> {
  return {
    name: '', icon: '💼', iconType: 'emoji', color: '#818cf8',
    category: 'Freelance / Tech',
    fields: [
      { id: 'date', label: 'Date', type: 'date', required: true },
      { id: 'gross_amount', label: 'Gross Amount', type: 'currency', required: true },
      { id: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Cancelled'] },
      { id: 'notes', label: 'Notes', type: 'textarea' },
    ],
  }
}

export default function Platforms() {
  const { platforms, entries, addPlatform, updatePlatform, deletePlatform, getGrossForEntry } = useStore()
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Platform | null>(null)
  const [form, setForm] = React.useState<Omit<Platform, 'id' | 'createdAt'>>(defaultPlatform())

  function openNew() { setForm(defaultPlatform()); setEditing(null); setDialogOpen(true) }
  function openEdit(p: Platform) { setForm({ name: p.name, icon: p.icon, iconType: p.iconType, color: p.color, category: p.category, fields: [...p.fields.map(f => ({...f, options: f.options ? [...f.options] : undefined}))] }); setEditing(p); setDialogOpen(true) }

  function handleSave() {
    if (!form.name.trim()) { toast({ title: 'Platform name is required', variant: 'error' }); return }
    if (editing) {
      updatePlatform(editing.id, form)
      toast({ title: 'Platform updated', variant: 'success' })
    } else {
      addPlatform(form)
      toast({ title: `${form.icon} ${form.name} created!`, variant: 'success' })
    }
    setDialogOpen(false)
  }

  function handleDelete(p: Platform) {
    const count = entries.filter(e => e.platformId === p.id).length
    if (!confirm(`Delete "${p.name}"?${count > 0 ? ` (${count} entries will remain but show "Unknown Platform")` : ''}`)) return
    deletePlatform(p.id)
    toast({ title: 'Platform deleted', variant: 'error' })
  }

  function addField() {
    const newId = `field_${generateId().slice(0, 6)}`
    setForm(f => ({ ...f, fields: [...f.fields, { id: newId, label: 'New Field', type: 'text' }] }))
  }
  function removeField(idx: number) { setForm(f => ({ ...f, fields: f.fields.filter((_, i) => i !== idx) })) }
  function updateField(idx: number, update: Partial<PlatformField>) {
    setForm(f => ({ ...f, fields: f.fields.map((field, i) => {
      if (i !== idx) return field
      const updated = { ...field, ...update }
      if (update.label && !update.id) updated.id = slugify(update.label)
      return updated
    })}))
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Platforms"
        description="Manage earning platforms and their fields"
        actions={<Button size="sm" onClick={openNew}><PlusCircle className="w-4 h-4" />New Platform</Button>}
      />

      <div className="grid grid-cols-3 gap-4">
        {platforms.map(p => {
          const pEntries = entries.filter(e => e.platformId === p.id)
          const total = pEntries.reduce((s, e) => s + getGrossForEntry(e), 0)
          return (
            <Card key={p.id} className="hover:border-zinc-700 transition-colors">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl overflow-hidden" style={{ background: `${p.color}22` }}>
                      {p.iconType === 'image' ? <img src={p.icon} alt={p.name} className="w-full h-full object-cover" /> : <span>{p.icon}</span>}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-100">{p.name}</p>
                      <p className="text-[11px] text-zinc-500">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(p)} className="text-red-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
                <p className="text-xl font-bold font-mono text-emerald-400">{formatCurrency(total)}</p>
                <p className="text-[11px] text-zinc-600 mt-0.5">{pEntries.length} entr{pEntries.length === 1 ? 'y' : 'ies'} · {p.fields.length} fields</p>
                <div className="flex gap-1 mt-3 flex-wrap">
                  <Badge variant="secondary">{p.category}</Badge>
                  {p.builtIn && <Badge variant="outline">Built-in</Badge>}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Platform dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Platform' : 'New Platform'}</DialogTitle>
            <DialogDescription>Configure platform details and custom fields</DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-3 space-y-4 overflow-y-auto max-h-[65vh]">
            {/* Icon + name row */}
            <div className="flex items-end gap-4">
              <IconPicker value={form.icon} iconType={form.iconType} color={form.color} name={form.name} onChange={(icon, iconType) => setForm(f => ({ ...f, icon, iconType }))} />
              <div className="flex-1 space-y-1">
                <Label>Platform Name *</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. TaskRabbit" />
              </div>
              <div className="space-y-1">
                <Label>Color</Label>
                <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-9 h-9 rounded-lg border border-zinc-700 cursor-pointer bg-zinc-900 p-1" />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>

            {/* Fields editor */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Fields</Label>
                <Button variant="ghost" size="sm" onClick={addField} className="h-7 text-xs gap-1"><Plus className="w-3 h-3" />Add Field</Button>
              </div>
              <div className="space-y-2">
                {form.fields.map((field, idx) => (
                  <div key={field.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800 border border-zinc-700">
                    <GripVertical className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    <Input value={field.label} onChange={e => updateField(idx, { label: e.target.value })} className="h-7 text-xs flex-1" placeholder="Label" />
                    <Select value={field.type} onValueChange={v => updateField(idx, { type: v as FieldType })}>
                      <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                      <SelectContent>{FIELD_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                    {field.type === 'select' && (
                      <Input
                        value={(field.options || []).join(', ')}
                        onChange={e => updateField(idx, { options: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="h-7 text-xs w-40"
                        placeholder="opt1, opt2, ..."
                      />
                    )}
                    <button onClick={() => removeField(idx)} className="text-zinc-500 hover:text-red-400 transition-colors shrink-0"><X className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save Changes' : 'Create Platform'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
PLATFORMSPAGE

cat > src/pages/Statements.tsx << 'STATEMENTSPAGE'
import * as React from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { MarkdownEditor } from '@/components/editor/MarkdownEditor'
import { formatCurrency, formatDate, generateId } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { marked } from 'marked'
import { Download, Eye, Plus, Pencil, Trash2, Copy, FileOutput } from 'lucide-react'
import type { StatementTemplate } from '@/types'

function renderTemplate(markdown: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((md, [k, v]) => md.replaceAll(`{{${k}}}`, v), markdown)
}

export default function Statements() {
  const { entries, platforms, statementTemplates, settings, addStatementTemplate, updateStatementTemplate, deleteStatementTemplate, getGrossForEntry, getNetForEntry } = useStore()

  const [opts, setOpts] = React.useState({
    platformId: 'all', startDate: '', endDate: '', templateId: statementTemplates[0]?.id ?? '', title: '',
  })
  const [preview, setPreview] = React.useState('')
  const [editTemplate, setEditTemplate] = React.useState<StatementTemplate | null>(null)
  const [editMd, setEditMd] = React.useState('')
  const [templateDialogOpen, setTemplateDialogOpen] = React.useState(false)
  const [newTemplateName, setNewTemplateName] = React.useState('')
  const [newTemplateDesc, setNewTemplateDesc] = React.useState('')

  // Set default dates
  React.useEffect(() => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)
    setOpts(o => ({ ...o, startDate: start, endDate: end }))
  }, [])

  function buildVars() {
    const now = new Date()
    const stmtEntries = entries.filter(e => {
      const d = String(e.date || e.createdAt)
      if (opts.startDate && d < opts.startDate) return false
      if (opts.endDate && d > opts.endDate) return false
      if (opts.platformId !== 'all' && e.platformId !== opts.platformId) return false
      return true
    })

    const grossTotal = stmtEntries.reduce((s, e) => s + getGrossForEntry(e), 0)
    const netTotal = stmtEntries.reduce((s, e) => s + getNetForEntry(e), 0)
    const feesTotal = grossTotal - netTotal
    const platformObj = opts.platformId !== 'all' ? platforms.find(p => p.id === opts.platformId) : null
    const stmtNum = 'STMT-' + Date.now().toString(36).toUpperCase().slice(-6)
    const year = String(now.getFullYear())

    // Platform breakdown table rows
    const pBreakdown = platforms
      .filter(p => stmtEntries.some(e => e.platformId === p.id))
      .map(p => {
        const pE = stmtEntries.filter(e => e.platformId === p.id)
        const g = pE.reduce((s, e) => s + getGrossForEntry(e), 0)
        return `| ${p.name} | ${pE.length} | ${formatCurrency(g)} |`
      }).join('\n')

    const platformBreakdown = `| Platform | Entries | Gross |\n|----------|---------|-------|\n${pBreakdown}`

    const monthlyBreakdown = (() => {
      const rows: string[] = ['| Month | Gross |', '|-------|-------|']
      for (let m = 0; m < 12; m++) {
        const mEntries = stmtEntries.filter(e => new Date(String(e.date) || e.createdAt).getMonth() === m)
        if (mEntries.length === 0) continue
        const label = new Date(+year, m, 1).toLocaleDateString('en-US', { month: 'long' })
        rows.push(`| ${label} | ${formatCurrency(mEntries.reduce((s, e) => s + getGrossForEntry(e), 0))} |`)
      }
      return rows.join('\n')
    })()

    const entriesTable = (() => {
      const rows = ['| Date | Description | Gross |', '|------|-------------|-------|']
      stmtEntries.slice(0, 20).forEach(e => {
        const p = platforms.find(pl => pl.id === e.platformId)
        const desc = String(e.client_name || e.gig_title || e.project_name || p?.name || '')
        rows.push(`| ${String(e.date || '')} | ${desc} | ${formatCurrency(getGrossForEntry(e))} |`)
      })
      return rows.join('\n')
    })()

    const seTax = grossTotal * 0.153
    const federalTax = grossTotal * 0.22

    return {
      contractorName: settings.name || 'Independent Contractor',
      contractorEmail: settings.email || '',
      contractorAddress: settings.address || '',
      contractorId: settings.taxId ? `****${settings.taxId}` : '—',
      platformName: platformObj?.name || 'All Platforms',
      statementTitle: opts.title || `${new Date(opts.startDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Statement`,
      statementNumber: stmtNum,
      startDate: formatDate(opts.startDate),
      endDate: formatDate(opts.endDate),
      generatedDate: now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      year,
      grossTotal: formatCurrency(grossTotal),
      feesTotal: formatCurrency(feesTotal),
      netTotal: formatCurrency(netTotal),
      payoutCount: String(stmtEntries.length),
      platformCount: String(new Set(stmtEntries.map(e => e.platformId)).size),
      platformBreakdown,
      monthlyBreakdown,
      entriesTable,
      lineItems: '| Services | ' + formatCurrency(grossTotal) + ' |',
      clientName: '—', clientEmail: '—', clientCompany: '—', invoiceNumber: stmtNum,
      seTaxDeduction: formatCurrency(seTax / 2),
      seTax: formatCurrency(seTax),
      federalTax: formatCurrency(federalTax),
      quarterlyEstimate: formatCurrency((seTax + federalTax) / 4),
    }
  }

  function handlePreview() {
    const template = statementTemplates.find(t => t.id === opts.templateId)
    if (!template) { toast({ title: 'Select a template', variant: 'error' }); return }
    const vars = buildVars()
    const rendered = renderTemplate(template.markdown, vars)
    setPreview(marked.parse(rendered) as string)
    toast({ title: 'Preview generated', variant: 'success' })
  }

  function handlePrint() {
    if (!preview) { toast({ title: 'Generate preview first', variant: 'error' }); return }
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Statement</title>
<style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;padding:0 32px;color:#111;line-height:1.65;font-size:13px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:20px 0 6px;border-bottom:2px solid #111;padding-bottom:4px}
h3{font-size:14px;margin:14px 0 4px}table{width:100%;border-collapse:collapse;margin:10px 0}
th,td{border:1px solid #ccc;padding:7px 10px;font-size:12px}th{background:#f5f5f5;font-weight:700;text-align:left}
hr{border:none;border-top:1px solid #ddd;margin:18px 0}blockquote{border-left:3px solid #888;margin:0;padding-left:12px;color:#555;font-style:italic}
strong{font-weight:700}@media print{body{margin:0;padding:20px 28px}}</style>
</head><body>${preview}</body></html>`)
    win.document.close()
    win.onload = () => win.print()
  }

  function openEditTemplate(t: StatementTemplate) {
    setEditTemplate(t); setEditMd(t.markdown)
  }

  function saveEditTemplate() {
    if (!editTemplate) return
    updateStatementTemplate(editTemplate.id, { markdown: editMd })
    setEditTemplate(null)
    toast({ title: 'Template saved', variant: 'success' })
  }

  function handleNewTemplate() {
    if (!newTemplateName.trim()) { toast({ title: 'Name required', variant: 'error' }); return }
    addStatementTemplate({ name: newTemplateName, description: newTemplateDesc, markdown: `# ${newTemplateName}\n\n**Period:** {{startDate}} – {{endDate}}\n\n---\n\n**Net Total: {{netTotal}}**\n` })
    setTemplateDialogOpen(false); setNewTemplateName(''); setNewTemplateDesc('')
    toast({ title: 'Template created', variant: 'success' })
  }

  function downloadTemplate(t: StatementTemplate) {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([t.markdown], { type: 'text/markdown' }))
    a.download = `${t.name.toLowerCase().replace(/\s+/g, '-')}.md`
    a.click()
    toast({ title: 'Template downloaded', variant: 'success' })
  }

  return (
    <div className="p-6">
      <PageHeader title="Statements" description="Generate and manage earnings statements" />

      <div className="grid grid-cols-5 gap-5">
        {/* Options panel */}
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Statement Options</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Platform</Label>
                <Select value={opts.platformId} onValueChange={v => setOpts(o => ({ ...o, platformId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    {platforms.map(p => <SelectItem key={p.id} value={p.id}>{p.icon} {p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label>Start Date</Label><Input type="date" value={opts.startDate} onChange={e => setOpts(o => ({ ...o, startDate: e.target.value }))} /></div>
                <div className="space-y-1"><Label>End Date</Label><Input type="date" value={opts.endDate} onChange={e => setOpts(o => ({ ...o, endDate: e.target.value }))} /></div>
              </div>
              <div className="space-y-1">
                <Label>Template</Label>
                <Select value={opts.templateId} onValueChange={v => setOpts(o => ({ ...o, templateId: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{statementTemplates.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Title Override (optional)</Label>
                <Input value={opts.title} onChange={e => setOpts(o => ({ ...o, title: e.target.value }))} placeholder="e.g. January 2026 Statement" />
              </div>
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={handlePreview}><Eye className="w-4 h-4" />Preview</Button>
                <Button variant="outline" onClick={handlePrint}><Download className="w-4 h-4" />Print / PDF</Button>
              </div>
            </CardContent>
          </Card>

          {/* Template list */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Templates</CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setTemplateDialogOpen(true)}><Plus className="w-3 h-3" />New</Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {statementTemplates.map(t => (
                <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 transition-colors">
                  <FileOutput className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200 truncate">{t.name}</p>
                    {t.builtIn && <Badge variant="outline" className="text-[9px] mt-0.5">built-in</Badge>}
                  </div>
                  <Button variant="ghost" size="icon-sm" onClick={() => openEditTemplate(t)} title="Edit"><Pencil className="w-3 h-3" /></Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => downloadTemplate(t)} title="Download"><Download className="w-3 h-3" /></Button>
                  {!t.builtIn && <Button variant="ghost" size="icon-sm" onClick={() => deleteStatementTemplate(t.id)} className="text-red-500"><Trash2 className="w-3 h-3" /></Button>}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Preview panel */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Preview</CardTitle></CardHeader>
            <CardContent>
              {preview ? (
                <div className="bg-white text-zinc-900 rounded-lg p-6 text-sm prose-editor max-h-[70vh] overflow-y-auto" dangerouslySetInnerHTML={{ __html: preview }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <FileOutput className="w-10 h-10 text-zinc-700 mb-3" />
                  <p className="text-sm text-zinc-500">Configure options and click Preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit template dialog */}
      <Dialog open={!!editTemplate} onOpenChange={open => !open && setEditTemplate(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Template — {editTemplate?.name}</DialogTitle>
            <DialogDescription>Use {'{{variableName}}'} for dynamic values. Available: contractorName, grossTotal, netTotal, startDate, endDate, etc.</DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-2">
            <MarkdownEditor value={editMd} onChange={setEditMd} minHeight="400px" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTemplate(null)}>Cancel</Button>
            <Button onClick={saveEditTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New template dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New Statement Template</DialogTitle></DialogHeader>
          <div className="p-6 pt-3 space-y-3">
            <div className="space-y-1"><Label>Name *</Label><Input value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)} placeholder="e.g. Monthly Summary" /></div>
            <div className="space-y-1"><Label>Description</Label><Input value={newTemplateDesc} onChange={e => setNewTemplateDesc(e.target.value)} placeholder="Brief description" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleNewTemplate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
STATEMENTSPAGE

cat > src/pages/Editor.tsx << 'EDITORPAGE'
import * as React from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { MarkdownEditor } from '@/components/editor/MarkdownEditor'
import { toast } from '@/hooks/use-toast'
import { Plus, Save, Trash2, BookOpen } from 'lucide-react'
import { generateId } from '@/lib/utils'

const STARTER = `# My Document

Write markdown here. This editor supports:

- **Bold**, _italic_, ~~strikethrough~~
- \`inline code\` and code blocks
- Tables, blockquotes, horizontal rules
- Links and more

## Section

> Tip: Use the toolbar buttons above to insert formatting quickly.

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Cell A   | Cell B   | Cell C   |

---

*Export as .md, .html, or print to PDF using the buttons in the toolbar.*
`

interface Doc { id: string; title: string; content: string; updatedAt: string }

export default function Editor() {
  const [docs, setDocs] = React.useState<Doc[]>(() => {
    try { return JSON.parse(localStorage.getItem('gigledger-docs') || '[]') } catch { return [] }
  })
  const [activeId, setActiveId] = React.useState<string | null>(null)
  const [content, setContent] = React.useState(STARTER)
  const [title, setTitle] = React.useState('Untitled Document')

  const activeDoc = docs.find(d => d.id === activeId)

  function save() {
    const now = new Date().toISOString()
    if (activeId) {
      const updated = docs.map(d => d.id === activeId ? { ...d, title, content, updatedAt: now } : d)
      setDocs(updated)
      localStorage.setItem('gigledger-docs', JSON.stringify(updated))
    } else {
      const newDoc = { id: generateId(), title, content, updatedAt: now }
      const updated = [newDoc, ...docs]
      setDocs(updated)
      setActiveId(newDoc.id)
      localStorage.setItem('gigledger-docs', JSON.stringify(updated))
    }
    toast({ title: 'Document saved', variant: 'success' })
  }

  function openDoc(doc: Doc) { setActiveId(doc.id); setTitle(doc.title); setContent(doc.content) }

  function newDoc() { setActiveId(null); setTitle('Untitled Document'); setContent(STARTER) }

  function deleteDoc(id: string) {
    const updated = docs.filter(d => d.id !== id)
    setDocs(updated)
    localStorage.setItem('gigledger-docs', JSON.stringify(updated))
    if (activeId === id) newDoc()
    toast({ title: 'Document deleted', variant: 'error' })
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Markdown Editor"
        description="Write, preview, and export documents as Markdown, HTML, or PDF"
        actions={
          <>
            <Button variant="outline" size="sm" onClick={newDoc}><Plus className="w-4 h-4" />New Doc</Button>
            <Button size="sm" onClick={save}><Save className="w-4 h-4" />Save</Button>
          </>
        }
      />

      <div className="grid grid-cols-5 gap-4">
        {/* Sidebar: saved docs */}
        <div className="col-span-1 space-y-2">
          <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">Saved Docs</p>
          {docs.length === 0 && <p className="text-xs text-zinc-600">No saved documents yet.</p>}
          {docs.map(doc => (
            <div
              key={doc.id}
              className={`flex items-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-colors group ${activeId === doc.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 hover:border-zinc-700'}`}
              onClick={() => openDoc(doc)}
            >
              <BookOpen className="w-3 h-3 text-zinc-600 shrink-0" />
              <p className="text-xs text-zinc-300 flex-1 truncate">{doc.title}</p>
              <button onClick={e => { e.stopPropagation(); deleteDoc(doc.id) }} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>

        {/* Editor */}
        <div className="col-span-4 space-y-2">
          <Input value={title} onChange={e => setTitle(e.target.value)} className="text-base font-semibold h-10 border-zinc-700 bg-zinc-900" placeholder="Document title..." />
          <MarkdownEditor value={content} onChange={setContent} minHeight="520px" />
        </div>
      </div>
    </div>
  )
}
EDITORPAGE

cat > src/pages/EmailTemplates.tsx << 'EMAILPAGE'
import * as React from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { MarkdownEditor } from '@/components/editor/MarkdownEditor'
import { toast } from '@/hooks/use-toast'
import { marked } from 'marked'
import { Plus, Pencil, Trash2, Copy, Mail, Send, Download } from 'lucide-react'
import type { EmailTemplate } from '@/types'

export default function EmailTemplates() {
  const { emailTemplates, settings, addEmailTemplate, updateEmailTemplate, deleteEmailTemplate } = useStore()
  const [selectedId, setSelectedId] = React.useState(emailTemplates[0]?.id ?? '')
  const [editOpen, setEditOpen] = React.useState(false)
  const [newOpen, setNewOpen] = React.useState(false)
  const [form, setForm] = React.useState<Partial<EmailTemplate>>({})
  const [previewVars, setPreviewVars] = React.useState<Record<string, string>>({
    contractorName: settings.name || 'Your Name',
    clientName: 'Client Name',
    invoiceNumber: 'INV-0042',
    totalAmount: '$1,250.00',
    dueDate: 'April 30, 2026',
    projectName: 'Website Redesign',
    paymentMethod: 'Bank Transfer / PayPal',
    paymentInstructions: 'Please transfer to the account on file.',
    amount: '$1,250.00',
    paymentDate: 'March 20, 2026',
    daysOverdue: '14',
    startDate: 'March 1, 2026',
    endDate: 'March 31, 2026',
    scopeOfWork: 'Full website redesign including homepage, about, and contact pages.',
    lineItems: '| Website Design | $1,250.00 |',
    revisionPolicy: '2 rounds included',
    contractorEmail: settings.email || 'you@example.com',
  })

  const selected = emailTemplates.find(t => t.id === selectedId)

  function renderPreview(template: EmailTemplate) {
    let body = template.body
    let subject = template.subject
    Object.entries(previewVars).forEach(([k, v]) => {
      body = body.replaceAll(`{{${k}}}`, v)
      subject = subject.replaceAll(`{{${k}}}`, v)
    })
    return { body: marked.parse(body) as string, subject }
  }

  function openEdit(t: EmailTemplate) {
    setForm({ ...t })
    setEditOpen(true)
  }

  function saveEdit() {
    if (!form.id || !form.name) return
    updateEmailTemplate(form.id, { name: form.name, subject: form.subject, body: form.body, description: form.description })
    setEditOpen(false)
    toast({ title: 'Email template saved', variant: 'success' })
  }

  function handleCreate() {
    if (!form.name?.trim()) { toast({ title: 'Name required', variant: 'error' }); return }
    addEmailTemplate({ name: form.name!, description: form.description || '', subject: form.subject || 'Subject', body: form.body || 'Email body...' })
    setNewOpen(false)
    setForm({})
    toast({ title: 'Email template created', variant: 'success' })
  }

  function copyHtml(t: EmailTemplate) {
    const { body } = renderPreview(t)
    navigator.clipboard.writeText(body)
    toast({ title: 'HTML copied to clipboard', variant: 'success' })
  }

  function downloadTemplate(t: EmailTemplate) {
    const content = `Subject: ${t.subject}\n\n---\n\n${t.body}`
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([content], { type: 'text/markdown' }))
    a.download = `${t.name.toLowerCase().replace(/\s+/g, '-')}.md`
    a.click()
    toast({ title: 'Template downloaded', variant: 'success' })
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Email Templates"
        description="React Email-compatible templates for client communication"
        actions={<Button size="sm" onClick={() => { setForm({ subject: '', body: '' }); setNewOpen(true) }}><Plus className="w-4 h-4" />New Template</Button>}
      />

      <div className="grid grid-cols-5 gap-5">
        {/* Template list */}
        <div className="col-span-2 space-y-2">
          {emailTemplates.map(t => (
            <div
              key={t.id}
              onClick={() => setSelectedId(t.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedId === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900'}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{t.name}</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">{t.description}</p>
                  </div>
                </div>
                {t.builtIn && <Badge variant="outline" className="text-[9px] shrink-0">built-in</Badge>}
              </div>
              <p className="text-[11px] text-zinc-500 font-mono truncate mt-1.5 pl-5">Sub: {t.subject}</p>
              <div className="flex gap-1 mt-2 pl-5">
                <Button variant="ghost" size="icon-sm" onClick={e => { e.stopPropagation(); openEdit(t) }}><Pencil className="w-3 h-3" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={e => { e.stopPropagation(); copyHtml(t) }} title="Copy rendered HTML"><Copy className="w-3 h-3" /></Button>
                <Button variant="ghost" size="icon-sm" onClick={e => { e.stopPropagation(); downloadTemplate(t) }}><Download className="w-3 h-3" /></Button>
                {!t.builtIn && <Button variant="ghost" size="icon-sm" onClick={e => { e.stopPropagation(); deleteEmailTemplate(t.id) }} className="text-red-500"><Trash2 className="w-3 h-3" /></Button>}
              </div>
            </div>
          ))}
        </div>

        {/* Preview panel */}
        <div className="col-span-3">
          {selected ? (() => {
            const { body, subject } = renderPreview(selected)
            return (
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900">
                  <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider mb-1">Preview Variables</p>
                  <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                    {Object.entries(previewVars).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-500 font-mono w-28 shrink-0 truncate">{k}</span>
                        <Input value={v} onChange={e => setPreviewVars(prev => ({ ...prev, [k]: e.target.value }))} className="h-6 text-[11px]" />
                      </div>
                    ))}
                  </div>
                </div>

                <Card>
                  <CardContent className="pt-4">
                    <div className="mb-3 pb-3 border-b border-zinc-800">
                      <p className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wider">Subject</p>
                      <p className="text-sm font-medium text-zinc-200">{subject}</p>
                    </div>
                    <div className="bg-white text-zinc-900 rounded-lg p-5 text-sm prose-editor max-h-[400px] overflow-y-auto" dangerouslySetInnerHTML={{ __html: body }} />
                  </CardContent>
                </Card>
              </div>
            )
          })() : (
            <div className="flex items-center justify-center h-64 text-zinc-600 text-sm">
              Select a template to preview
            </div>
          )}
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Email Template</DialogTitle>
            <DialogDescription>Use {'{{variableName}}'} for dynamic values</DialogDescription>
          </DialogHeader>
          <div className="p-6 pt-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Name</Label><Input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Subject Line</Label><Input value={form.subject || ''} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
            </div>
            <div className="space-y-1">
              <Label>Body (Markdown)</Label>
              <MarkdownEditor value={form.body || ''} onChange={body => setForm(f => ({ ...f, body }))} minHeight="360px" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New dialog */}
      <Dialog open={newOpen} onOpenChange={setNewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>New Email Template</DialogTitle></DialogHeader>
          <div className="p-6 pt-2 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Name *</Label><Input value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Follow-up Invoice" /></div>
              <div className="space-y-1"><Label>Subject</Label><Input value={form.subject || ''} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Invoice {{invoiceNumber}}" /></div>
            </div>
            <div className="space-y-1">
              <Label>Body (Markdown)</Label>
              <MarkdownEditor value={form.body || ''} onChange={body => setForm(f => ({ ...f, body }))} minHeight="300px" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
EMAILPAGE

cat > src/pages/Reports.tsx << 'REPORTSPAGE'
import { useMemo } from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { formatCurrency } from '@/lib/utils'
import { Bar, Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler } from 'chart.js'
import { TrendingUp, DollarSign, AlertTriangle } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler)

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function Reports() {
  const { entries, platforms, getGrossForEntry, getNetForEntry } = useStore()
  const now = new Date()
  const year = now.getFullYear()

  const yearEntries = useMemo(() => entries.filter(e => new Date(String(e.date) || e.createdAt).getFullYear() === year), [entries])

  const monthlyGross = useMemo(() => MONTHS.map((_, m) => {
    return yearEntries.filter(e => new Date(String(e.date) || e.createdAt).getMonth() === m).reduce((s, e) => s + getGrossForEntry(e), 0)
  }), [yearEntries])

  const quarterlyGross = useMemo(() => [0,1,2,3].map(q => monthlyGross.slice(q*3, q*3+3).reduce((a,b) => a+b, 0)), [monthlyGross])

  const ytdTotal = monthlyGross.reduce((a, b) => a + b, 0)
  const avgMonth = monthlyGross.filter(v => v > 0).reduce((a, b) => a + b, 0) / (monthlyGross.filter(v => v > 0).length || 1)
  const bestMonthIdx = monthlyGross.indexOf(Math.max(...monthlyGross))
  const seTax = ytdTotal * 0.153
  const federalTax = ytdTotal * 0.22
  const totalTax = seTax + federalTax
  const quarterlyEst = totalTax / 4

  const platformTotals = useMemo(() => platforms.map(p => ({
    platform: p,
    gross: yearEntries.filter(e => e.platformId === p.id).reduce((s, e) => s + getGrossForEntry(e), 0),
    count: yearEntries.filter(e => e.platformId === p.id).length,
  })).filter(x => x.count > 0).sort((a, b) => b.gross - a.gross), [yearEntries, platforms])

  const chartOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: '#27272a' }, ticks: { color: '#71717a', callback: (v: number | string) => '$' + v } }, x: { grid: { display: false }, ticks: { color: '#71717a' } } } }

  return (
    <div className="p-6">
      <PageHeader title="Reports" description={`Financial analysis for ${year}`} />

      <Tabs defaultValue="ytd">
        <TabsList className="mb-5">
          <TabsTrigger value="ytd">Year to Date</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="platforms">By Platform</TabsTrigger>
          <TabsTrigger value="tax">Tax Estimate</TabsTrigger>
        </TabsList>

        <TabsContent value="ytd">
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCard label="YTD Gross" value={formatCurrency(ytdTotal)} icon={DollarSign} accentColor="#34d399" />
            <StatCard label="Avg / Month" value={formatCurrency(avgMonth)} icon={TrendingUp} accentColor="#818cf8" />
            <StatCard label="Best Month" value={MONTHS[bestMonthIdx]} change={formatCurrency(monthlyGross[bestMonthIdx])} changeUp={true} accentColor="#fbbf24" />
            <StatCard label="YTD Entries" value={String(yearEntries.length)} accentColor="#60a5fa" />
          </div>
          <Card>
            <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Monthly Earnings — {year}</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <Line data={{ labels: MONTHS, datasets: [{ label: 'Gross', data: monthlyGross.map(v => +v.toFixed(2)), borderColor: '#818cf8', backgroundColor: 'rgba(129,140,248,0.1)', fill: true, tension: 0.4, pointBackgroundColor: '#818cf8' }] }} options={chartOpts} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quarterly">
          <div className="grid grid-cols-4 gap-3 mb-5">
            {['Q1','Q2','Q3','Q4'].map((q, i) => <StatCard key={q} label={`${q} ${year}`} value={formatCurrency(quarterlyGross[i])} />)}
          </div>
          <Card>
            <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Quarterly Earnings</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar data={{ labels: ['Q1', 'Q2', 'Q3', 'Q4'], datasets: [{ label: 'Gross', data: quarterlyGross.map(v => +v.toFixed(2)), backgroundColor: ['#818cf866','#34d39966','#fbbf2466','#60a5fa66'], borderColor: ['#818cf8','#34d399','#fbbf24','#60a5fa'], borderWidth: 1.5, borderRadius: 8 }] }} options={chartOpts} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="space-y-3">
            {platformTotals.map(({ platform, gross, count }) => (
              <div key={platform.id} className="flex items-center gap-4 p-4 rounded-xl border border-zinc-800 bg-zinc-900">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 overflow-hidden" style={{ background: `${platform.color}22` }}>
                  {platform.iconType === 'image' ? <img src={platform.icon} alt="" className="w-full h-full object-cover" /> : <span>{platform.icon}</span>}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-zinc-200">{platform.name}</p>
                  <p className="text-xs text-zinc-500">{count} entries</p>
                </div>
                <p className="font-mono font-bold text-emerald-400">{formatCurrency(gross)}</p>
                <div className="w-32">
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(100, (gross / ytdTotal) * 100)}%`, background: platform.color }} />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1 text-right">{ytdTotal > 0 ? ((gross/ytdTotal)*100).toFixed(1) : 0}%</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tax">
          <div className="max-w-lg">
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">Estimates only based on SE tax (15.3%) and 22% federal bracket. Consult a tax professional.</p>
            </div>
            <Card>
              <CardContent className="pt-5">
                <table className="w-full text-sm">
                  {[
                    ['Gross SE Income', formatCurrency(ytdTotal), 'text-emerald-400'],
                    ['SE Tax Deduction (50%)', `-${formatCurrency(seTax/2)}`, 'text-zinc-400'],
                    ['Est. SE Tax (15.3%)', formatCurrency(seTax), 'text-red-400'],
                    ['Est. Federal Tax (22%)', formatCurrency(federalTax), 'text-red-400'],
                    ['Total Estimated Tax', formatCurrency(totalTax), 'text-red-400 font-bold'],
                  ].map(([label, val, cls]) => (
                    <tr key={label} className="border-b border-zinc-800">
                      <td className="py-3 text-zinc-400">{label}</td>
                      <td className={`py-3 font-mono text-right ${cls}`}>{val}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="pt-4 font-bold text-zinc-200">Est. Quarterly Payment</td>
                    <td className="pt-4 font-mono font-bold text-amber-400 text-right text-lg">{formatCurrency(quarterlyEst)}</td>
                  </tr>
                </table>

                <div className="mt-5 pt-4 border-t border-zinc-800">
                  <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider mb-2">IRS Due Dates</p>
                  {[['Q1 (Jan–Mar)', 'April 15'], ['Q2 (Apr–May)', 'June 15'], ['Q3 (Jun–Aug)', 'September 15'], ['Q4 (Sep–Dec)', 'January 15']].map(([q, d]) => (
                    <div key={q} className="flex justify-between text-xs py-1.5 border-b border-zinc-800/50">
                      <span className="text-zinc-400">{q}</span><span className="text-zinc-300 font-medium">{d}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
REPORTSPAGE

cat > src/pages/Admin.tsx << 'ADMINPAGE'
import * as React from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { Download, Upload, Trash2, RefreshCw, Database, Shield } from 'lucide-react'

export default function Admin() {
  const store = useStore()

  function exportAll() {
    const data = { entries: store.entries, platforms: store.platforms, statementTemplates: store.statementTemplates, emailTemplates: store.emailTemplates, settings: store.settings, exportedAt: new Date().toISOString() }
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    a.download = `gigledger-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
    toast({ title: 'Data exported', variant: 'success' })
  }

  function exportCSV() {
    const rows = [['ID', 'Date', 'Platform', 'Gross', 'Net', 'Status', 'Notes']]
    store.entries.forEach(e => {
      const p = store.platforms.find(pl => pl.id === e.platformId)
      rows.push([e.id, String(e.date || ''), p?.name || '', store.getGrossForEntry(e).toFixed(2), store.getNetForEntry(e).toFixed(2), String(e.status || ''), String(e.notes || '')])
    })
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = 'gigledger-entries.csv'
    a.click()
    toast({ title: 'CSV exported', variant: 'success' })
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string)
        store.importData(data)
        toast({ title: `Imported ${data.entries?.length ?? 0} entries`, variant: 'success' })
      } catch { toast({ title: 'Import failed — invalid JSON', variant: 'error' }) }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function clearEntries() {
    if (!confirm('Delete ALL entries? This cannot be undone.')) return
    store.bulkDeleteEntries(store.entries.map(e => e.id))
    toast({ title: 'All entries cleared', variant: 'error' })
  }

  function resetAll() {
    if (!confirm('Reset ALL data to defaults? This cannot be undone.')) return
    store.resetToDefaults()
    toast({ title: 'Reset to defaults', variant: 'error' })
  }

  const totalGross = store.entries.reduce((s, e) => s + store.getGrossForEntry(e), 0)

  return (
    <div className="p-6">
      <PageHeader title="Admin" description="Data management and system settings" />

      <Tabs defaultValue="overview">
        <TabsList className="mb-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="platforms">Platform Registry</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Total Entries', value: String(store.entries.length), icon: Database, color: '#818cf8' },
              { label: 'Platforms', value: String(store.platforms.length), icon: Shield, color: '#34d399' },
              { label: 'All Time Gross', value: formatCurrency(totalGross), icon: Download, color: '#fbbf24' },
              { label: 'Templates', value: String(store.statementTemplates.length + store.emailTemplates.length), icon: RefreshCw, color: '#60a5fa' },
            ].map(s => (
              <Card key={s.label}>
                <CardContent className="pt-4">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-1">{s.label}</p>
                  <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="data">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Export</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={exportAll}><Download className="w-4 h-4" />Export All Data (JSON)</Button>
                <Button variant="outline" className="w-full justify-start gap-2" onClick={exportCSV}><Download className="w-4 h-4" />Export Entries (CSV)</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Import</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0">
                <label className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-zinc-700 text-sm text-zinc-400 hover:border-zinc-600 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4" />Import JSON backup
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
              </CardContent>
            </Card>
            <Card className="border-red-500/20">
              <CardHeader><CardTitle className="text-xs text-red-500 uppercase tracking-wider">Danger Zone</CardTitle></CardHeader>
              <CardContent className="space-y-2 pt-0">
                <Button variant="destructive" className="w-full justify-start gap-2" onClick={clearEntries}><Trash2 className="w-4 h-4" />Clear All Entries</Button>
                <Button variant="destructive" className="w-full justify-start gap-2" onClick={resetAll}><RefreshCw className="w-4 h-4" />Reset to Defaults</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms">
          <div className="rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900">
                  {['Platform', 'Category', 'Fields', 'Entries', 'Total Gross', 'Type'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-zinc-600 uppercase tracking-wider px-4 py-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {store.platforms.map(p => {
                  const pEntries = store.entries.filter(e => e.platformId === p.id)
                  const gross = pEntries.reduce((s, e) => s + store.getGrossForEntry(e), 0)
                  return (
                    <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm overflow-hidden" style={{ background: `${p.color}22` }}>
                            {p.iconType === 'image' ? <img src={p.icon} alt="" className="w-full h-full object-cover" /> : p.icon}
                          </span>
                          {p.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs">{p.category}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.fields.length}</td>
                      <td className="px-4 py-3 text-zinc-400">{pEntries.length}</td>
                      <td className="px-4 py-3 font-mono text-emerald-400 text-xs">{formatCurrency(gross)}</td>
                      <td className="px-4 py-3"><Badge variant={p.builtIn ? 'outline' : 'default'}>{p.builtIn ? 'Built-in' : 'Custom'}</Badge></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
ADMINPAGE

cat > src/pages/Settings.tsx << 'SETTINGSPAGE'
import * as React from 'react'
import { useStore } from '@/store'
import { PageHeader } from '@/components/ui/page-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import type { AppSettings } from '@/types'

export default function Settings() {
  const { settings, updateSettings } = useStore()
  const [form, setForm] = React.useState<AppSettings>({ ...settings })

  function save() {
    updateSettings(form)
    toast({ title: 'Settings saved', variant: 'success' })
  }

  function set(k: keyof AppSettings, v: string) { setForm(f => ({ ...f, [k]: v })) }

  return (
    <div className="p-6 max-w-2xl">
      <PageHeader title="Settings" description="Configure your profile and preferences" />

      <div className="space-y-4">
        <Card>
          <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Full Legal Name</Label><Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" /></div>
              <div className="space-y-1"><Label>Business / Trade Name</Label><Input value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Smith Creative LLC" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@example.com" /></div>
              <div className="space-y-1"><Label>Tax ID (last 4 digits)</Label><Input value={form.taxId} onChange={e => set('taxId', e.target.value)} maxLength={4} placeholder="1234" /></div>
            </div>
            <div className="space-y-1">
              <Label>Business Address (for statements)</Label>
              <Input value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City, ST 12345" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-xs text-zinc-500 uppercase tracking-wider">Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-4 pt-0">
            <div className="space-y-1">
              <Label>Currency</Label>
              <Select value={form.currency} onValueChange={v => set('currency', v)}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {[['USD', 'USD ($)'], ['EUR', 'EUR (€)'], ['GBP', 'GBP (£)'], ['CAD', 'CAD (CA$)'], ['AUD', 'AUD (A$)']].map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Button onClick={save}>Save Settings</Button>
      </div>
    </div>
  )
}
SETTINGSPAGE

echo "📄  Pages created"

# ============================================================
#  APP ROUTER (main.tsx + App.tsx)
# ============================================================

cat > src/App.tsx << 'APPTSX'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Shell } from '@/components/layout/Shell'
import Dashboard from '@/pages/Dashboard'
import Entries from '@/pages/Entries'
import AddEntry from '@/pages/AddEntry'
import Platforms from '@/pages/Platforms'
import Statements from '@/pages/Statements'
import Editor from '@/pages/Editor'
import EmailTemplates from '@/pages/EmailTemplates'
import Reports from '@/pages/Reports'
import Admin from '@/pages/Admin'
import Settings from '@/pages/Settings'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function App() {
  return (
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="entries" element={<Entries />} />
            <Route path="entries/new" element={<AddEntry />} />
            <Route path="platforms" element={<Platforms />} />
            <Route path="statements" element={<Statements />} />
            <Route path="editor" element={<Editor />} />
            <Route path="email" element={<EmailTemplates />} />
            <Route path="reports" element={<Reports />} />
            <Route path="admin" element={<Admin />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  )
}
APPTSX

cat > src/main.tsx << 'MAINTSX'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
MAINTSX

# ============================================================
#  README
# ============================================================
cat > README.md << 'README'
# GigLedger Pro

A full-featured gig economy earnings tracker built with:
- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** + **shadcn/ui** (Radix UI primitives)
- **Zustand** for state management (persisted to localStorage)
- **React Router v7** for navigation
- **Chart.js** + **react-chartjs-2** for charts
- **Marked** for Markdown rendering
- **React Email** for email templates

## Quick Start

```bash
npm install
npm run dev
```

## Features

| Feature | Description |
|---------|-------------|
| **Dashboard** | Stats, charts, recent entries |
| **Entries** | Log/edit/delete earnings with platform-specific fields |
| **Platforms** | 8 built-in platforms; add custom ones with icon/color/field editor |
| **Icon Picker** | Choose emoji or upload image/logo per platform |
| **Statements** | Generate PDF statements from Markdown templates |
| **MD Editor** | Full markdown editor with toolbar, preview, export (.md, .html, print-to-PDF) |
| **Email Templates** | React Email-compatible templates with live preview |
| **Reports** | YTD, quarterly, per-platform, tax estimates |
| **Admin** | Data export (JSON/CSV), import, platform registry |
| **Settings** | Profile, currency, business info |

## Built-in Platforms

DoorDash · Upwork · Fiverr · Direct Contract · Uber/Uber Eats ·
Etsy · Airbnb · Instacart

## Template Variables

In statement and email templates, use `{{variableName}}`:

`contractorName`, `grossTotal`, `netTotal`, `feesTotal`,
`startDate`, `endDate`, `statementNumber`, `generatedDate`,
`platformName`, `payoutCount`, `platformBreakdown`, `monthlyBreakdown`, `entriesTable`

## Project Structure

```
src/
├── components/
│   ├── ui/          # shadcn-style primitives
│   ├── layout/      # Sidebar, Shell
│   ├── entries/     # EntryForm (dynamic fields)
│   ├── platforms/   # IconPicker
│   └── editor/      # MarkdownEditor
├── pages/           # Route-level page components
├── store/           # Zustand store
├── types/           # TypeScript interfaces
├── data/            # Default platforms, templates, seed data
├── hooks/           # useToast
└── lib/             # utils (cn, formatCurrency, etc.)
```
README

echo ""
echo "✅  GigLedger Pro scaffolded successfully!"
echo ""
echo "📦  Next steps:"
echo "    cd $APP"
echo "    npm install"
echo "    npm run dev"
echo ""
echo "🌐  Then open http://localhost:5173"