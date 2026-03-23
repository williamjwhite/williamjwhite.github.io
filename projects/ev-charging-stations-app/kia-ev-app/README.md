# NiroCharge – Kia Niro EV Charging App

A Progressive Web App (PWA) optimized for the **2023–2025 Kia Niro EV Wind** (and all trims).

## 📲 How to Install

### iPhone / iPad (iOS)
1. Open `index.html` in **Safari** (must be Safari for PWA install)
2. Tap the **Share button** (the box with an arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** — the app icon appears on your home screen
5. Open from home screen to run in full-screen mode

### Android
1. Open `index.html` in **Chrome**
2. Tap the **three-dot menu (⋮)** in the top right
3. Tap **"Add to Home Screen"** or **"Install App"**
4. Tap **Add/Install**
5. Open from home screen or app drawer

### Desktop (Chrome/Edge)
- Look for the **install icon** in the address bar (📲)
- Or go to browser menu → "Install NiroCharge"

---

## ⚡ Features

### Vehicle Profile
- Default: 2024 Kia Niro EV Wind (64.8 kWh, 253mi EPA, 85kW DC max, CCS1 port)
- **Enter your VIN** to customize color and verify specs
- Switch between Wind / Wave / EX / EX Premium trims
- Year selection: 2023–2025

### Smart Charging Limits (Niro-Specific)
- The app **automatically caps effective charging speed at 85kW DC** regardless of station power rating
- **Overpaying warnings** appear when a charger exceeds 85kW (e.g., 150kW or 350kW EA stations) — you're billed for power you can't use
- Per-minute billing inefficiency warnings

### Station Finder
- View stations sorted by **Distance, Cost, Speed, or Availability**
- Filter by: All / DC Fast (Level 3) / Level 2 / Free / by Network
- Networks: Electrify America, ChargePoint, Blink, EVgo + free municipal stations
- Each card shows:
  - All connector types with actual power levels
  - Availability (ports open/total)
  - **Charge estimate**: miles added, time, and total cost (current SOC → target)

### Charge Calculator
- Adjust charging power (3.3kW Level 1 → 350kW HPC)
- Set duration in minutes
- Enter cost rate ($/kWh or $/min)
- Get: miles added, kWh added, total cost, cost per mile
- Overpaying alerts trigger automatically

### Battery State of Charge (SOC)
- Set current battery % via slider
- Set your charge target (default 80%)
- See: current range, range at target, kWh needed, time at 85kW

---

## 🔌 Kia Niro EV Charging Specs Reference

| Charging Type | Connector | Max Rate | Notes |
|---|---|---|---|
| Level 1 (120V) | J1772 | 1.8–3.3 kW | ~3 days full charge |
| Level 2 (240V) | J1772 | 11 kW | ~6–7 hrs full |
| DC Fast Charge | CCS1 | **85 kW** | ~45 min 10→80% |
| High-Power (HPC) | CCS1 | 85 kW (capped) | No benefit over 85kW station |

**The Niro EV cannot accept CHAdeMO without adapter.**

---

## 🌐 Data Sources
When online, the app can be extended to pull live data from:
- **NREL AFDC API** (US Dept of Energy) – free station locator
- **Open Charge Map** – global crowd-sourced station data
- **PlugShare API** – real-time availability
- **ChargePoint, Blink, EVgo, EA** – network-specific APIs

---

## 🔒 Privacy
- No account required
- Vehicle data stored locally on device only
- Location used only for station search (never stored)

---

*NiroCharge v1.0 | Optimized for Kia Niro EV 2023–2025*
