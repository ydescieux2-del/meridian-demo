# MERIDIAN DEMO — Agent Learnings

## localStorage Versioning (CRITICAL)
- Users accumulate localStorage campaign data across sessions. When seed data structure changes (new fields like `startDate`, `endDate`, `activities.teamWork`, `activities.dueDate`), old localStorage data persists and **breaks features silently**.
- Solution: `CAMPAIGNS_DATA_VERSION` constant + auto-clear on version mismatch. **Bump this number every time CAMPAIGNS_SEED structure changes.**
- `loadCampaigns()` also has a merge function that backfills missing seed fields into stored campaigns, but version bump + clear is the safest approach.
- This applies to ALL localStorage keys, not just campaigns. If you add fields to any seed data, version it.

## Gantt Chart
- Gantt bars render as percentages (`left` and `width` in %). If the date range is too narrow (e.g., all campaigns lack dates → fallback to today), bars collapse to slivers.
- Fix: scan activity `dueDate` fields in addition to campaign `startDate`/`endDate`. Enforce minimum 3-month span. Set `min-width` on the container (~120px per month).
- The Gantt container needs `overflow-x: auto` on outer div and `min-width` on inner div to ensure bars have room at any viewport width.

## Drill-Down API
- Two drill functions exist: `showDrill({title, subtitle, columns, rows})` (object destructured) and `openDrillOverlay(html)` (raw HTML string).
- `showDrill` expects a destructured object — calling it with positional args (`showDrill('title', items, 'subtitle')`) fails silently with `TypeError: Cannot read properties of undefined`.
- Prefer `openDrillOverlay()` with inline HTML for custom drill layouts. It's more flexible and less error-prone.

## Finance Dashboard
- `DASH_FMT` and `DASH_FMT_K` format currency. Must include BOTH `minimumFractionDigits: 0` AND `maximumFractionDigits: 0` to avoid decimals like `$55,480.1`.
- Cash flow chart: don't stack income/expense labels above bars in a column — they overlap. Instead, position labels absolutely above each individual bar with `position: relative` on the bar and `position: absolute; top: -14px` on the label.
- All four hero KPI cards (Revenue, Expenses, Net Income, Cash on Hand) are clickable with drill-downs via `openDrillOverlay()`.
- Expenses drill supports two-level drill: category list → vendor-level itemized detail via `drillSpendingCategory()`.

## Campaign Lifecycle
- Four stages: `draft → active → paused → complete`
- `cycleStatus()` cycles through all four in order.
- `getCampaignHealth()` must handle `draft` status (returns gray `○ Draft`).
- Badge CSS: `.badge-draft { color: #999; border-color: #ccc; background: #f5f5f5; }`

## CSS Variables
- `--ember: #C0392B` — must be defined in `:root`. Was used in multiple places but never defined, causing silent CSS failures.
- `--green: #27AE60`, `--blue: #2980B9` — also added to `:root`.

## Phase II Tab
- Phase I includes: Campaign Command, CRM Pipeline, Finance + QB integration, Operations + Billable Hours. All marked "Delivered".
- Phase II features: Live QB OAuth sync, AI Proposals, Client Reports, Slack/GChat + Multi-User.
- Retainer: $500/month, 20 dev hours, 2 strategy sessions.
- No Creative Studio or Rebuilding California references in Phase II.

## Deploy Workflow
- Site: `curious-bienenstitch-b62207.netlify.app`
- Deploy: `netlify deploy --prod --dir=.` from `/Users/pandorasbox/descieux-digital/meridian-demo/`
- Guide page: `/guide.html` (standalone HTML, Meridian-styled, sticky nav)
- **NEVER share Netlify URL with Nicole until live site is visually verified current** (from project memory).

## Nicole's Access
- Email: `nicole@thednagency.com`
- Login: `nicole` / `meridian2026`
- Role: admin (sees all tabs including Finance and Phase II)

## Architecture
- Single-file HTML app (`index.html`, ~8000+ lines)
- Pure CSS charts: `conic-gradient` donut, CSS bar charts, flexbox cash flow bars
- localStorage persistence with seed data fallback
- No external charting libraries
- Preview server: `python3 -m http.server 8088`

## Subscription / Billing Model (as of April 2026)
- Nicole (DNA Agency) is on **$500/month Nonprofit Rate** — "Meridian Essential"
- Creative tools (AI Deck Builder, AI Content Engine, Visual Brief Generator, Report Builder) are **gated add-ons** — not included in base plan
- Creative Studio tab shows a gated add-on screen. Do NOT re-add Gamma/Canva integrations — they were intentionally removed.
- Creative add-ons are activated by Von manually — there is no self-serve toggle
- Next invoice auto-displays as the 1st of the following month

## Contractor Billing & Invoicing (as of April 2026)
- Contractor rates stored in localStorage key `meridian_contractor_rates`
- Default rates: Nicole Feenstra $175/hr, Sarah Chen $125/hr, Marcus Rivera $110/hr, Jade Thompson $95/hr, Alex Kim $105/hr
- Rates auto-fill when contractor is selected in Add Labor modal
- "⚙ Manage Rates" panel in the labor modal — inline editor, saves to localStorage
- `renderBillableInvoicing()` in Operations tab: filters labor by `category === 'Billable'`, groups by campaign, shows per-campaign invoice generation
- `generateCampaignInvoice()` opens modal with line items (contractor × hours × rate), auto-incremented invoice number, Download CSV, Mark Invoiced
- `markCampaignInvoiced()` sets `invoiced: true` on labor records in localStorage
- Finance > Campaigns view also shows "Contractor Labor Cost by Campaign" collapsible section

## Deploy — Two Netlify Sites (IMPORTANT)
- **Claimed site (connected to GitHub repo):** `curious-bienenstitch-b62207.netlify.app` — auto-deploys from `ydescieux2-del/meridian-demo` GitHub pushes, but has a cache lag issue and Netlify CLI is not authenticated locally
- **Old site:** `meridian-demo.netlify.app` — serves a React/Vite shell (~1.5KB), NOT the Meridian app. Do not use this URL.
- To force a deploy without CLI auth: go to app.netlify.com → meridian-demo site → Deploys → Trigger deploy
- Anonymous CLI deploys (`netlify deploy --allow-anonymous`) create a NEW temporary site — do not use those URLs for Nicole
- **Always verify live site AFTER deploy before sharing any URL with Nicole**

## Finance Tab Structure
- Entity toggle: **DNA Agency** (business financials) | **Campaigns** (per-campaign P&L)
- DNA Agency view: Subscription bar → QB Sync Status → Balance Sheet (collapsible) → Bank Feeds (collapsible) → P&L → Cash Position → Activity Feed → Spending Breakdown
- Campaigns view: Campaign selector → P&L summary cards → Nonprofit section (if Rebuilding California) → Contractor Labor Cost by Campaign (collapsible)
- `renderBalanceSheet()` and `renderBankFeeds()` exist — do NOT remove or break them
- Rebuilding California is treated as a Campaign, not a separate Finance entity

## V2 Features Added (April 2026)
- **Deals Pipeline**: `DEALS_SEED` (6 Nicole's real proposals as deals), `renderDeals()`, `openDealDetail()`. Separate from CRM contacts. Toggle via `.crm-mode-btn` buttons (Contacts / Deals Pipeline). Key: `meridian_deals`.
- **Daily Digest Bell**: Gear icon in header. `buildDigest()` computes stale deals (14d+), upcoming task deadlines (7d window), grant deadlines (30d window), stale contacts (21d+). Badge count visible at a glance. Panel closes on outside click.
- **Stale Indicators**: `staleBadge()` + `daysSince()` helpers. CRM kanban cards show amber (14–29d) or red (30d+) stale badge inline.
- **Contact Source Tagging**: `source` field on contacts: 'client' | 'prospect' | 'apollo-cte' | 'event'. Source filter dropdown in CRM toolbar. 3 Apollo CTE contacts + 1 event crew contact added to seed.
- **Next Action Field**: `nextAction` + `nextActionDue` on contacts and deals. Displayed on kanban cards and deal cards.
- **Gantt Shortcut**: "View Gantt" button in Campaign Command header calls `switchToGantt()` → switches to Operations tab + sets gantt view.
- **QB Invoice #1137**: Sierra Joint CCD, $46K PAID, QB-019 in invoice demo data.
- **CAMPAIGNS_DATA_VERSION bumped to 4** — clears stale localStorage.

## Common Pitfalls
1. Editing seed data without bumping `CAMPAIGNS_DATA_VERSION` → users see stale data
2. Adding new campaigns to seed without handling them in `loadCampaigns()` merge → new campaigns don't appear for existing users
3. Using `showDrill()` with positional args instead of object → silent failure
4. Forgetting `maximumFractionDigits` in number formatting → ugly decimals
5. CSS variables used but never defined in `:root` → silent style failures
6. Gantt bars rely on campaign dates existing — always scan activity dates as fallback
7. Never re-add Gamma/Canva to Creative Studio — intentionally replaced with add-on gate
8. `netlify deploy --allow-anonymous` creates a NEW throwaway site — never share that URL with Nicole
9. `loadGrants` may be referenced before it's defined if digest fires before Finance renders — guard with `loadGrants ?` optional call
