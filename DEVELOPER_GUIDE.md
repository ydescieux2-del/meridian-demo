# MERIDIAN — Developer Operations Guide
**Descieux Digital · Von Descieux**  
*For: Development team, operations oversight, technical maintenance*

---

## 1. Overview: What You Built

### Project Summary
MERIDIAN is a unified operations dashboard for Nicole Feenstra (DNA Agency). It consolidates four distinct business functions—ad campaigns, contact management, nonprofit finance, and creative generation—into a single, performant web application.

- **Architecture:** Single-page application (SPA) built with vanilla JavaScript
- **Hosting:** GitHub Pages (Phase 1), upgrade to Vercel/Railway (Phase 2)
- **Data Storage:** Browser localStorage (Phase 1), PostgreSQL or similar (Phase 2)
- **Deployment:** Git push to production (zero downtime)
- **Client Access:** URL-only, no installation or authentication required

### Why This Approach
- **Agility:** You control the entire codebase; updates deploy instantly
- **Simplicity:** No app store dependency, no version management for the client
- **Security:** Nicole's credentials go directly to API providers (Plaid, QuickBooks), never to you
- **Cost:** Free hosting until persistent data becomes necessary

---

## 2. Technical Architecture

### File Structure
```
meridian-demo/
├── index.html                    # Main application (all UI, logic, styles)
├── manifest.json                 # PWA metadata (optional Phase 2)
├── README.md                     # Public documentation
├── DEVELOPER_GUIDE.md            # This file
├── USER_GUIDE.md                 # Client-facing documentation
├── .github/
│   └── workflows/deploy.yml      # Auto-deploy on push (GitHub Actions)
└── assets/                       # Logos, icons (optional)
```

### Core Technology Stack
| Layer | Technology | Why |
|---|---|---|
| **Frontend** | HTML5 + CSS3 + Vanilla JS | Minimal dependencies, maximum control |
| **Data Layer** | Browser localStorage (Phase 1) | Instant MVP, no backend needed |
| **External APIs** | Plaid, QuickBooks, Meta, Google, Gamma, Canva | Live data, no data duplication |
| **Hosting** | GitHub Pages (Phase 1) | Free, instant deploy |
| **Backend** | Node.js/Express + PostgreSQL (Phase 2) | Persistent data, real-time sync |

### How Data Flows (Phase 1)
```
Client Authorizations
(Plaid, QB, Meta, Google)
        ↓
Frontend JavaScript
Makes API Calls
        ↓
API Responses
        ↓
Process & Format
        ↓
Store in localStorage
        ↓
Render UI
```

---

## 3. Tab-by-Tab Functionality

### Tab 1: Campaign Command Center
**Purpose:** Real-time tracking of all active ad campaigns across Meta and Google.

**Current Functionality:**
- Campaign list view with key metrics (spend, leads, CTR, ROAS, CPL)
- Drill-down: Click any campaign → see daily breakdown, audience targeting, creative rotation
- Cost per lead (CPL) and cost per acquisition (CPA) calculations
- Performance trending (week-over-week, month-over-month)
- Alert system for campaigns exceeding budget thresholds

**Data Source:** Meta Ads API + Google Ads API (Phase 2)  
**Update Frequency:** Real-time (or every 5 min with polling)

**Current Implementation Notes:**
- If API connections aren't yet live, this tab shows mock data
- Drill-down logic is built but requires live data source to populate detail views
- Pacing algorithm (spend rate vs. daily budget) is ready for integration

**Phase 2 Enhancements:**
- Automated bid adjustments based on performance thresholds
- A/B test statistical significance calculator
- Audience overlap detection across campaigns
- Attribution modeling (multi-touch first-click, linear, time-decay)

**Phase 3+ Ideas:**
- Predictive spend forecasting (trending to overspend by X date)
- Creative performance correlation (which ad creatives drive lowest CPL)
- Competitor spend tracking (if IQ or similar data is available)

---

### Tab 2: CRM & Pipeline
**Purpose:** Full contact lifecycle management with kanban-style pipeline visualization.

**Current Functionality:**
- Contact directory with search/filter (name, company, email, phone)
- Kanban board: stages (New, Qualified, Proposal, Negotiation, Closed)
- Edit contact details inline (name, title, company, email, phone)
- Headshot upload (stores as base64 in localStorage)
- Tag system (e.g., "hot prospect," "no-budget," "needs-follow-up")
- Notes on each contact with timestamps
- Social links (LinkedIn, Twitter, Instagram URLs)
- Last contact date tracking & countdown to auto-flag stale prospects

**Data Source:** Manual entry + CSV import  
**Storage:** localStorage  
**Update Frequency:** Real-time (instant on edit)

**Current Implementation Notes:**
- Headshots are base64-encoded to avoid external storage dependency
- Tags use a simple array; no tag hierarchy yet
- Last-contact date is used to surface stale leads (no automatic email reminders yet)
- Kanban board updates in real-time as you drag/drop contacts

**Phase 2 Enhancements:**
- Integration with email providers (Gmail/Outlook) to auto-capture emails sent to contacts
- LinkedIn integration to pull contact info automatically
- Email history timeline in contact record
- Automated follow-up task creation based on contact stage
- SMS integration (Twilio) for bulk outreach

**Phase 3+ Ideas:**
- Predictive lead scoring based on engagement patterns
- Auto-clean duplicate detection and merge suggestions
- CRM-to-email template library with smart personalization

---

### Tab 3: Nonprofit Finance
**Purpose:** Donor pipeline management, grant tracking, and live financial overview.

**Current Functionality:**
- **Donor Pipeline:** Visual funnel showing status (Education → Engagement → Ask → Thank)
- **Donor Records:** Individual donor profiles with gift history, preferences, capacity estimates
- **Grant Tracker:** Active grants with due dates, application status, award amounts
- **YTD Totals:** Sum of gifts received and grants awarded by month
- **Drill-down:** Click any month → see individual gifts, donors, grants that contributed to that total
- **Pipeline Stage Metrics:** Conversion rates between each stage (e.g., "45% of educated donors move to engagement")

**Data Source (Phase 1):** Manual entry + CSV import  
**Data Source (Phase 2):** Plaid (bank transactions) + QuickBooks (incoming funds) + manual entry  
**Update Frequency:** Manual (Phase 1), real-time (Phase 2)

**Current Implementation Notes:**
- Donor data stored as JSON objects in localStorage
- Gift records include date, amount, donor name, fund/purpose
- Grant records include name, deadline, amount, status (applied, awarded, pending)
- YTD totals are computed on-the-fly from transaction history
- Drill-down uses date range filtering to show contributing records

**Phase 2 Enhancements:**
- **Plaid Integration:** Auto-detect donor gifts (wire transfers, checks, credit cards)
- **QuickBooks Integration:** Sync invoice payments, donor restricted funds, fund accounting
- **Automated Thank-You Triggers:** Send personalized thank-you emails when gift is received
- **Donor Capacity Analysis:** Compare gift size to wealth indicators (public data)
- **Grant Calendar:** Sync with Nicole's Google Calendar, auto-alert before deadlines

**Phase 3+ Ideas:**
- Predictive next gift timing based on donor history
- Matching gift automation (identify corporations, auto-submit claims)
- Peer benchmarking (compare fundraising metrics to similar nonprofits)
- Major gift pipeline waterfall analysis

---

### Tab 4: Creative Studio
**Purpose:** Rapid deck generation, powered by Gamma, Canva, and MERIDIAN AI.

**Current Functionality:**
- **Brief Builder:** Form to capture presentation details (title, topic, audience, tone, key message, slide count)
- **Gamma Integration:** Pre-fill brief and launch Gamma in new tab (Nicole completes in Gamma, saves back)
- **Canva Integration:** Similar flow—pre-fill prompt, launch Canva for design
- **MERIDIAN AI (Claude):** Generate 5-slide outline inline using Anthropic API (requires Nicole's API key in Phase 1)
- **Output Panel:** Links to generated decks, templates, or slide frameworks

**Data Source:** Form input + API calls to Gamma/Canva/Anthropic  
**Update Frequency:** On-demand (user initiates generation)

**Current Implementation Notes:**
- Gamma and Canva launch via platform links with URL parameters
- MERIDIAN AI requires Nicole to paste her Anthropic API key (temporary until backend manages keys)
- Outputs are links, not embedded—decks live in Gamma or Canva
- No campaign data is auto-injected into decks yet (Phase 2)

**Phase 2 Enhancements:**
- **Campaign Data Injection:** Auto-pull spend, leads, ROAS from Campaign tab into deck
- **Donor Report Decks:** Auto-generate donor impact reports with YTD giving, fund allocation
- **Google Slides Export:** Deck generated in Gamma → exported to Google Drive + shared automatically
- **Template Library:** Pre-built slides for common scenarios (monthly board reports, campaign recaps, donor reports)
- **Brand Kit Integration:** Lock in DNA Agency colors, fonts, logo for consistency

**Phase 3+ Ideas:**
- Multi-page campaign performance reports (automated monthly)
- Board-ready fundraising progress summaries
- Donor segmentation analysis decks

---

## 4. How to Link Accounts (Setup Procedures)

### 4a. Plaid Integration (Banks & Credit Cards)

**What Plaid Does:**
Securely connects to 12,000+ financial institutions. Transactions flow into MERIDIAN Finance tab automatically.

**Your Setup (One-Time, ~2 hours):**

1. Go to [plaid.com](https://plaid.com) → sign up for developer account
2. Create a new project/app; get your **Client ID** and **Secret**
3. Add Plaid Client token to your frontend (MERIDIAN will display "Connect Account" button):
   ```javascript
   // In your index.html or separate module
   const PLAID_CLIENT_ID = 'YOUR_CLIENT_ID';
   const PLAID_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
   ```
4. Implement Plaid Link on frontend (Plaid provides embed code):
   ```javascript
   const handler = Plaid.create({
       token: PUBLIC_TOKEN,
       onSuccess: (publicToken) => {
           // Send to backend, exchange for access token
           // Store access token securely (backend, not localStorage)
       }
   });
   handler.open();
   ```
5. **Backend (Phase 2):** Exchange public token for permanent access token; store securely
6. **Polling:** Every 5 minutes (or on-demand), call Plaid to get latest transactions
7. **Error Handling:** Access tokens expire → implement refresh logic

**Nicole's Setup (What She Does):**
1. Opens MERIDIAN → Finance tab → clicks "Connect Account"
2. Plaid window opens → she searches for her bank
3. Logs in with her bank credentials (directly to bank, not to you)
4. Selects which accounts to share (e.g., business checking, not personal savings)
5. Done. Transactions now flow automatically.

**Troubleshooting:**

| Issue | Cause | Fix |
|---|---|---|
| "Invalid Client ID" error | Client ID not set or expired | Regenerate at plaid.com > Settings |
| Connection works, no transactions appear | Item not synced yet | Check Plaid dashboard under "Items" → check sync status |
| Transactions stopped appearing | Access token expired | Implement auto-refresh token flow |
| Nicole's bank not in Plaid | Plaid coverage gap | Use manual CSV upload fallback, or notify Nicole of limitation |
| Duplicate transactions | Polling happened twice | Add deduplication by transaction ID |

**Monthly Costs:**
- First 100 bank connections: Free tier
- Beyond 100: ~$0.30/account/month
- Typical for Nicole: 2–3 accounts = **$1–2/mo**

---

### 4b. QuickBooks Online Integration

**What QB Does:**
Syncs P&L, invoices, expenses, payroll into MERIDIAN Finance tab. Nicole's official income/expense source of truth.

**Your Setup (One-Time, ~4 hours):**

1. Go to [developer.intuit.com](https://developer.intuit.com) → create app
2. Fill in app details (name: "MERIDIAN Nicole Feenstra")
3. Get your **Client ID**, **Client Secret**, **Redirect URI**
4. Implement OAuth 2.0 flow:
   ```javascript
   // Step 1: Redirect Nicole to QB authorization
   const authURL = `https://appcenter.intuit.com/connect/oauth2?...`;
   window.location = authURL;
   
   // Step 2: QB redirects back with auth code
   // Exchange code for access token (BACKEND ONLY)
   const response = await fetch('https://oauth.platform.intuit.com/oauth2/tokens', {
       method: 'POST',
       body: JSON.stringify({
           grant_type: 'authorization_code',
           code: authCode,
           client_id: CLIENT_ID,
           client_secret: CLIENT_SECRET  // NEVER expose this
       })
   });
   ```
5. Store access + refresh tokens securely (backend database, encrypted)
6. Implement token refresh (QB tokens expire in 60 days)
7. Make periodic API calls to fetch:
   - Profit & Loss data (monthly)
   - Invoice list (daily)
   - Expense reports (daily)
   - Payroll (monthly)

**Nicole's Setup (What She Does):**
1. Opens MERIDIAN → Finance tab → clicks "Connect QuickBooks"
2. Signs in with her QuickBooks username/password (on Intuit's site, not yours)
3. Approves MERIDIAN app permissions
4. Redirected back to MERIDIAN — connection is live

**Troubleshooting:**

| Issue | Cause | Fix |
|---|---|---|
| "Invalid Client ID" | Not registered at developer.intuit.com | Register at intuit.com and get new credentials |
| Auth code not exchanging | Redirect URI doesn't match | Check that redirect matches exactly in both dev portal and code |
| "Token expired" error | 60+ days since authorization | Implement automatic refresh-token flow |
| P&L data is stale | API call hasn't been made recently | Implement scheduled sync (every 6 hours or on-demand) |
| Nicole has multiple QB companies | Unclear which company to sync | Store company ID in user settings; add selector |

**Monthly Costs:**
- QB API access: **Free** (included with her QB subscription)
- Your time to maintain: factored into monthly retainer

---

### 4c. Meta Ads API (Facebook & Instagram Campaigns)

**What Meta Provides:**
Real-time campaign spend, impressions, link clicks, conversions.

**Your Setup (One-Time, ~3 hours):**

1. Go to [developers.facebook.com](https://developers.facebook.com) → create app
2. Add "Marketing API" product
3. Get **App ID**, **App Secret**
4. Implement OAuth with Meta (similar to QB):
   ```javascript
   const fbAuthURL = `https://www.facebook.com/v18.0/dialog/oauth?...`;
   ```
5. Nicole authorizes → you get access token
6. Make API calls to `/me/adaccounts` to list her ad accounts
7. For each ad account, fetch campaigns, ads, insights (spend, clicks, conversions)

**Nicole's Setup (What She Does):**
1. MERIDIAN → Campaign tab → "Connect Meta Ads"
2. Logs in with her Facebook account
3. Approves MERIDIAN app permissions
4. Selects which ad accounts to sync (if multiple)
5. Connection live

**Troubleshooting:**

| Issue | Cause | Fix |
|---|---|---|
| "App Not Set Up" | App not properly configured at Meta | Double-check app ID, secret, permissions in Meta developer portal |
| No ad accounts appear | Nicole's account doesn't have admin access to any ad accounts | Check Meta Ads Manager → verify Nicole is Admin on at least one account |
| Spend data doesn't match Meta Ads Manager | Time zone or date range mismatch | Sync times carefully; ensure UTC conversion is correct |
| Permission denied error | Missing required permissions | Re-authorize; check that app has ADS_MANAGEMENT scope |

**Monthly Costs:**
- Meta API access: **Free** (no per-call charges)
- Your time to maintain: factored into monthly retainer

---

### 4d. Google Ads API (Google Search, Display, YouTube)

**What Google Provides:**
Campaign performance (spend, clicks, conversions, CTR).

**Your Setup (One-Time, ~3 hours):**

1. Go to [developers.google.com](https://developers.google.com) → create project
2. Enable Google Ads API
3. Create OAuth 2.0 credentials (Web application type)
4. Get **Client ID**, **Client Secret**
5. Implement OAuth flow (very similar to Meta)
6. Nicole authorizes → you get access token
7. Make API calls to list customer accounts, campaigns, ads, metrics

**Nicole's Setup (What She Does):**
1. MERIDIAN → Campaign tab → "Connect Google Ads"
2. Logs in with her Google account
3. Approves access
4. Selects which Google Ads accounts to sync
5. Connection live

**Troubleshooting:**

| Issue | Cause | Fix |
|---|---|---|
| "Customer not enabled" | Nicole hasn't activated Google Ads API access | Go to Google Ads → Settings → API Center → enable |
| Permission denied | Insufficient OAuth scopes | Re-auth with GOOGLE_ADS_API scope |
| No data appears | API might be rate-limited | Implement exponential backoff retry logic |

**Monthly Costs:**
- Google Ads API access: **Free**
- Your time to maintain: factored into monthly retainer

---

### 4e. Gamma AI (Deck Generation)

**What Gamma Does:**
Creates beautiful presentations from a text brief.

**Your Setup:**
1. Go to [gamma.app](https://gamma.app)
2. No API key needed; you generate decks via Gamma's public URL
3. Build URL with parameters (pre-fill form):
   ```
   https://gamma.app/create?topic=Your+Topic&outline=Key+Points
   ```
4. Nicole clicks link → Gamma opens with brief pre-filled
5. She generates deck in Gamma, saves to her account

**Nicole's Setup:**
1. When prompted, creates free Gamma account (or uses existing)
2. Generates deck inside Gamma
3. Saves to her Gamma library
4. Can download, share, or present

**Costs:**
- Gamma free tier: unlimited presentations
- Gamma Pro: $8/mo for premium templates (optional)

---

### 4f. Anthropic API (Claude for MERIDIAN AI)

**What Claude Does:**
Generates slide outlines, creative briefs, fundraising strategies inline in MERIDIAN.

**Your Setup (One-Time, ~1 hour):**

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create account → get **API key**
3. Set up backend endpoint to handle Claude requests:
   ```javascript
   // Backend endpoint: POST /api/generate-outline
   const response = await fetch('https://api.anthropic.com/v1/messages', {
       method: 'POST',
       headers: { 'x-api-key': ANTHROPIC_API_KEY },
       body: JSON.stringify({
           model: 'claude-3-haiku', // Cheapest for MVP
           messages: [{
               role: 'user',
               content: briefText
           }]
       })
   });
   ```
4. **IMPORTANT:** Never expose API key to frontend. Always proxy through your backend.

**Nicole's Setup (Phase 1):**
1. MERIDIAN → Creative Studio → "Generate Outline"
2. Fills in brief form
3. Clicks "Generate"
4. MERIDIAN AI returns 5-slide outline

**Phase 2 Setup:**
- Your backend handles API key (Nicole doesn't manage it)
- Same experience, more reliable

**Troubleshooting:**

| Issue | Cause | Fix |
|---|---|---|
| "Invalid API key" | Key expired or deleted | Regenerate at console.anthropic.com |
| Rate limit error | Too many requests in short time | Implement request throttling on backend |
| Responses too short/long | Model settings or prompt | Adjust max_tokens parameter, refine system prompt |

**Monthly Costs:**
- Usage-based: ~$0.003 per 1,000 tokens
- Realistic for Nicole: 5–10 generations/day = **$5–20/mo**

---

## 5. Monthly Operational Cost Breakdown

### Spread Sheet: What Nicole Pays (Her)
| Service | Use | Free Tier? | Nicole's Cost |
|---|---|---|---|
| **Plaid** | Bank connections | 100 connections | $0–3/mo (typically 2–3 accounts) |
| **QuickBooks** | P&L sync | N/A (already pays) | $0 (included in QB subscription) |
| **Meta API** | Campaign data | Yes | $0 |
| **Google Ads API** | Campaign data | Yes | $0 |
| **Gamma** | Deck generation | Yes, free tier | $0–8/mo (optional Pro) |
| **Anthropic** | Claude inline generation | No | $5–20/mo (pay-per-use) |
| **Custom Domain** | meridian.dnaagency.com | N/A | ~$15/year (~$1.25/mo) |
| **Hosting** | GitHub Pages (Phase 1) | Yes | $0 |
| **Hosting** | Backend database (Phase 2) | Free tier | $0–20/mo |
| **Your Monthly Retainer** | Maintenance, monitoring, strategy | N/A | **$TBD** (your call) |

**Total Monthly Stack (Phase 1):** $5–50/mo (Nicole's costs)  
**Total Monthly Stack (Phase 2):** $30–80/mo (Nicole's costs) + **your retainer**

### Spread Sheet: What YOU Pay (Your Infrastructure Costs)
| Item | Cost | Notes |
|---|---|---|
| **Domain Hosting** | ~$15/year (~$1.25/mo) | If you host it; can bill to Nicole |
| **Backend Server** (Phase 2) | $0–50/mo | Vercel free/Pro, Railway free/$20+, Heroku $50+ |
| **Database** (Phase 2) | $0–30/mo | PostgreSQL managed (ElephantSQL, Render, etc.) |
| **Email Service** (Phase 2) | $0–20/mo | SendGrid, Postmark for transactional emails |
| **Logging/Monitoring** | $0–10/mo | LogRocket, Sentry (optional but recommended) |
| **Development Time** | Your labor | Budget 80–120 hrs for Phase 2 |
| **CI/CD** | $0 | GitHub Actions free tier is sufficient |
| **DNS** | $0–12/mo | Usually bundled with domain host |

**Calculate Your Monthly Markup:**  
- Infrastructure costs: ~$1–30/mo (Phase 1), ~$20–80/mo (Phase 2)
- Your time: ~5–15 hrs/month at your hourly rate
- Retainer should cover: infrastructure + monitoring + proactive improvements

---

## 6. Troubleshooting Guide

### General Issues

**"MERIDIAN won't load"**
- Check that GitHub Pages is active: Repo Settings → Pages → Source (should be "Deploy from branch")
- Hard refresh browser (Cmd+Shift+R on Mac)
- Check browser console for JavaScript errors (F12 → Console tab)
- If console shows CORS errors, check API Origin settings in Plaid/QB/Meta

**"My data disappeared"**
- LocalStorage was cleared (Phase 1 risk)
- Browser was set to clear cache on exit
- Nicole opened MERIDIAN in a different browser or incognito
- **Temporary fix:** Ask Nicole to always use same browser/device (Phase 1)
- **Permanent fix:** Upgrade to Phase 2 backend database

**"API connection isn't working"**
- Check that Nicole authorized the connection (FB, QB, etc.)
- Verify API key is valid and not expired (Plaid, Anthropic)
- Check that OAuth redirect URI matches what's registered (Meta, Google, QB)
- Look for rate limiting (Google/Meta add delays if called too frequently)
- Monitor API dashboard (Plaid.com, developer.intuit.com, etc.) for errors

### Campaign Tab Issues

**"Spend numbers don't match Meta Ads Manager"**
- Time zone mismatch: MERIDIAN should convert all data to UTC, then Nicole's local time
- Date range: MERIDIAN might be showing different date than Nicole
- Filter: Check if Nicole has filters applied (e.g., "last 30 days")
- Solution: Add UTC timestamp to each metric, let Nicole set timezone in settings

**"Campaigns not appearing"**
- Meta/Google connection not authorized
- Nicole doesn't have admin access to the accounts
- No campaigns are currently active
- Solution: Check OAuth token validity; prompt to re-authorize

**"CTR/CPL calculations are wrong"**
- Check math: CPL = Total Spend / Total Leads
- Verify data source (Meta sometimes has clicks vs. link clicks distinction)
- Ensure decimals aren't rounding incorrectly
- Solution: Show formula in tooltip; add data source label

### Finance Tab Issues

**"Grant deadline coming up" — not alerted**
- Automated reminders not built yet (Phase 2)
- Manual check: Nicole needs to review tracker regularly
- Solution: Implement email reminders 14 days + 7 days + 1 day before deadline

**"Donor gift not appearing in YTD total"**
- Gift was entered in wrong stage (must be in "Thank" stage to count)
- Gift date is in wrong month (check date picker)
- localStorage corrupted
- Solution: Check donation edit form; verify date; clear cache and re-enter if needed

**"Plaid sync is slow"**
- First sync can take 30+ minutes (Plaid is catching up)
- Check Plaid dashboard for sync status
- Try manually triggering sync (refresh button in MERIDIAN)

### CRM Tab Issues

**"Contact headshot won't upload"**
- File too large (base64 encoding bloats file size)
- Unsupported format (should be JPG, PNG, GIF)
- Browser localStorage quota exceeded
- Solution: Compress image before upload; warn about file size limits; implement Phase 2 cloud storage

**"Contacts are stuck in old stage"**
- Drag-and-drop failed silently
- Browser refresh after drag (localStorage wasn't updated)
- Solution: Add drag-complete toast notification; verify localStorage write succeeded

**"Search isn't finding contact"**
- Search is case-sensitive / accent-sensitive
- Contact name doesn't contain search term exactly
- Solution: Make search case-insensitive; add fuzzy matching for Phase 2

### Creative Studio Issues

**"Gamma deck link is broken"**
- URL structure changed on Gamma's end
- Pre-fill parameters not formatted correctly
- Solution: Test Gamma links monthly; check their API docs for URL parameter changes

**"MERIDIAN AI returns generic outline"**
- Claude tokenizer counted wrong; response was cut short
- Prompt was too vague
- Solution: Add system prompt refinement; let Nicole edit brief and regenerate

---

## 7. Monitoring & Maintenance Checklist

### Daily
- [ ] Check GitHub Actions deploy log (any errors?)
- [ ] Glance at API error dashboards (Plaid, QB, Meta, Google)

### Weekly
- [ ] Test one Campaign tab metric (spot-check spend in Meta Ads Manager vs. MERIDIAN)
- [ ] Test Plaid connection (pull latest transactions)
- [ ] Test Creative Studio (generate one deck outline)

### Monthly
- [ ] Run full system test (all four tabs, all external APIs)
- [ ] Review client feedback for bugs or feature requests
- [ ] Check API token expiration dates; refresh as needed
- [ ] Monitor costs (Anthropic usage, Plaid transactions pulled, etc.)
- [ ] Update this guide with any findings

### Quarter
- [ ] Security audit (API keys, token storage, CORS settings)
- [ ] Performance audit (page load time, API response times)
- [ ] Database backup test (Phase 2)
- [ ] Plan Phase 2/Phase 3 enhancements

---

## 8. Phase 2 Roadmap (Backend + Persistent Data)

### 8a. Infrastructure Upgrade
- **From:** GitHub Pages + localStorage  
- **To:** Vercel (frontend) + Railway (backend) + PostgreSQL (data)
- **Benefit:** Persistent data, real-time sync, multi-device access, scalability
- **Estimated Cost:** $20–50/mo (you absorb or pass to client)
- **Estimated Dev Time:** 80–120 hours

### 8b. Database Schema
```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    external_id VARCHAR,  -- For OAuth (Plaid, QB, Meta, etc.)
    api_tokens JSON,  -- Encrypted {plaid, quickbooks, meta, google}
    settings JSON,  -- Timezone, preferences
    created_at TIMESTAMP
);

-- Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users,
    platform VARCHAR,  -- 'meta' or 'google'
    campaign_id VARCHAR,
    name VARCHAR,
    spend_usd DECIMAL,
    leads INT,
    cpl DECIMAL,
    ctr DECIMAL,
    roas DECIMAL,
    synced_at TIMESTAMP,
    created_at TIMESTAMP
);

-- Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users,
    name VARCHAR,
    email VARCHAR,
    company VARCHAR,
    stage VARCHAR,  -- 'new', 'qualified', 'proposal', etc.
    tags JSON,
    notes TEXT,
    headshot BYTEA,
    last_contact_at TIMESTAMP,
    created_at TIMESTAMP
);

-- Donations
CREATE TABLE donations (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users,
    donor_name VARCHAR,
    amount_usd DECIMAL,
    fund VARCHAR,
    source VARCHAR,  -- 'plaid', 'manual', 'quickbooks'
    donation_date DATE,
    created_at TIMESTAMP
);

-- Grants
CREATE TABLE grants (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users,
    name VARCHAR,
    amount_usd DECIMAL,
    deadline DATE,
    status VARCHAR,  -- 'applied', 'awarded', 'pending'
    created_at TIMESTAMP
);
```

### 8c. Real-Time Sync
- **Goal:** Data in MERIDIAN always matches source (Meta, QB, Plaid, Google)
- **Approach:** Background workers that run every 5–30 minutes
- **Tech:** Bull (Node.js job queue) or similar
- **API calls per day:** ~300–500 (easily within free/cheap tiers)

### 8d. Authentication
- **Current:** URL-only (insecure but acceptable for Phase 1)
- **Phase 2:** Email + password, or OAuth via Google/Microsoft
- **Tech:** NextAuth.js or Auth0
- **Benefit:** Multi-user support, audit trail, session security

### 8e. New Features
1. **Multi-device sync** — Nicole's changes on iPhone appear on Mac automatically
2. **Email notifications** — Grant deadlines, donation alerts, campaign issues
3. **Audit log** — See who changed what and when
4. **Data export** — CSV/PDF reports for board meetings or accountant
5. **API webhooks** — Receive real-time updates from Plaid, QB instead of polling

---

## 9. Security Considerations

### API Key Management
- **Never store API keys in frontend code** (even if it seems like no one has access)
- **Always proxy API calls through backend** where you control the environment
- **Rotate keys quarterly** (set calendar reminder)
- **Use environment variables** (never hardcode anything)

### Data Privacy
- **Phase 1:** Nicole's financial data lives only on her device (localStorage)
  - No sync between devices
  - No backup on your servers
  - She can't access from a different computer
- **Phase 2:** Implement encryption at rest + in transit
  - Database encryption for sensitive fields (bank account numbers, SSN, etc.)
  - HTTPS only (no HTTP)
  - Audit logs for all data access

### OAuth Best Practices
- **State parameter:** Always include to prevent CSRF attacks
- **Scope minimization:** Only request permissions you actually need
- **Token expiration:** Implement refresh token logic for long-lived tokens
- **Redirect URI whitelisting:** Only allow registered URLs

### Browser Security
- **Content Security Policy (CSP):** Restrict which scripts/APIs can run
- **SameSite cookies:** If using cookies for sessions
- **XSS prevention:** Validate all user input before rendering to DOM

---

## 10. Pricing & Pitch to Nicole

### What to Charge

**Option A: Hourly Rate**
- Maintenance: 5–10 hrs/month × your rate
- Setup + Phase 2 dev: billable hours as incurred

**Option B: Monthly Retainer**
- Covers monitoring, bug fixes, small features, platform updates
- Example: $1,500–3,000/mo depending on your rates and expected time
- Major features (Phase 2, new integrations) billed separately

**Option C: Tiered Model**
- **Tier 1 (Monitoring):** $800/mo — daily monitoring, bug fixes, API issue triage
- **Tier 2 (Monitoring + Strategy):** $1,500/mo — includes monthly strategy call, recommendations for campaigns/donors/campaigns
- **Tier 3 (Monitoring + Strategy + Development):** $2,500/mo — includes 10 hrs/mo for feature development

### Pitch Template
> "MERIDIAN costs to run: Plaid ($2–3/mo), Anthropic ($5–20/mo), optional Gamma Pro ($8/mo) — so roughly $10–30/mo in third-party services. The real value is the integration, the data accuracy, and the strategy oversight. That's where my monthly retainer comes in. Without it, the platform breaks silently, API connections go stale, and Nicole loses trust in the numbers. Think of me as the ops person who watches these pipes 24/7."

---

## 11. Frequently Asked Developer Questions

**Q: How do I test locally without GitHub Pages?**  
A: Run a simple HTTP server: `python3 -m http.server 8000` then open `localhost:8000`

**Q: Can I switch from github.io to a custom domain (meridian.dnaagency.com)?**  
A: Yes. In repo Settings → Pages → Custom domain. Add CNAME record to domain registrar. DNS propagates in 24–48 hrs.

**Q: What if Nicole's browser localStorage quota is exceeded?**  
A: Safari allows ~50MB, Chrome ~10MB per domain. If she has 500+ contacts, this could happen. Implement Phase 2 backend or aggressive archiving.

**Q: How do I handle when Plaid disconnects?**  
A: Plaid Items can go stale (password changed, security challenge, etc.). Implement re-authentication flow. Nicole gets email: "Your bank connection expired. Click here to re-authorize."

**Q: Can Nicole use MERIDIAN on multiple devices with Phase 1?**  
A: Not recommended. Her data won't sync. Use Phase 2 for multi-device support.

**Q: How do I debug when Meta API returns old spend data?**  
A: Check Meta Ads Manager directly. Sometimes Meta's data pipeline lags. Request "insights" with `time_increment=1` for daily breakdown. Compare timestamps.

**Q: Should I pre-fill Nicole's API keys so she doesn't have to paste them?**  
A: **No.** That's a security risk. Let her authorize via OAuth (Plaid, QB, Meta, Google). For Anthropic, implement backend key management in Phase 2.

---

*MERIDIAN Developer Guide v1.0 · March 2026 · Descieux Digital*  
*Last Updated: 2026-03-29*
