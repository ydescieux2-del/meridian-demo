# MERIDIAN — Product Guide
**DNA Agency · Rebuilding California**
Prepared by Von Descieux · Descieux Digital

---

## 1. What MERIDIAN Is

MERIDIAN is a private, branded operations dashboard built specifically for Nicole Feenstra. It consolidates four core business functions into a single, elegant interface:

| Tab | What It Does |
|---|---|
| **Campaign Command Center** | Track all active ad campaigns — spend, leads, CPL, CTR, ROAS — with drill-down into every metric |
| **CRM & Pipeline** | Full contact management with search, kanban pipeline, contact editing, headshot upload, tags, notes, socials |
| **Nonprofit Finance** | Donor pipeline (Education → Engagement → Ask → Thank), grant tracker, YTD gift totals — all drillable |
| **Creative Studio** | Deck generator — connects to MERIDIAN AI (Claude), Canva, and Gamma with a pre-filled brief |

Everything is built on a single file (`index.html`) served from GitHub — no app to install, no login required beyond knowing the URL.

---

## 2. Where the Harness Lives — and Why This Matters

### Current State
MERIDIAN is hosted on **GitHub Pages** at:
`https://ydescieux2-del.github.io/meridian-demo/`

This means:
- It lives on **GitHub's servers** (the internet), not on your machine or Nicole's
- It is accessible from **any browser, any device, anywhere**
- Nicole never installs anything — she just bookmarks the URL

### The One Limitation Right Now
All data (campaigns, contacts, donors, grants) is stored in **browser localStorage** — meaning it lives inside whichever browser she uses on whichever device she opens it on. If she opens it in Chrome on her laptop, that's where her data lives. If she switches to Safari or a different computer, it starts fresh.

### What This Means for Nicole
Tell her: **always open MERIDIAN from the same browser on the same device** until we upgrade to a real database backend (Phase 2). Chrome on her Mac is the right call.

### Why It Lives Online, Not on Your Machine
- You built it, you own the GitHub repo — you can push updates, fixes, and new features at any time without touching her computer
- She never needs to update anything
- You maintain full control of the codebase
- Upgrades deploy automatically when you push to GitHub

---

## 3. How to Connect Real Financial Data

### 3a. QuickBooks Online (P&L, Expenses, Invoices)

**What it gives you:** Live income/expense data, invoice status, cash flow, payroll, vendor payments.

**How it works:** QuickBooks has an open API (OAuth 2.0). You build a connection that pulls data into the Finance tab in real time.

**What Nicole needs to do (herself — you never see credentials):**
1. Have an active QuickBooks Online subscription (she likely already does)
2. Authorize the MERIDIAN app through a standard QuickBooks login popup — same as logging into any app with Google
3. That's it. Connection is live.

**What you need to set up:**
- Register a free developer app at developer.intuit.com
- Get a Client ID + Client Secret (takes 10 min)
- Add OAuth flow to MERIDIAN backend (Phase 2 work — about 4–6 hrs)

**Cost:** Free. QuickBooks API access is included with her existing QB subscription.

---

### 3b. Bank Accounts & Credit Cards (via Plaid)

**What it gives you:** Live transaction data from checking, savings, credit cards, and investment accounts from 12,000+ institutions including Chase, BofA, Wells Fargo, AmEx, etc.

**How it works:** Plaid provides a secure connection widget called **Plaid Link**. Nicole clicks "Connect Bank," a Plaid-hosted window opens (Plaid's servers, not yours), she logs in with her bank credentials **directly to her bank** — you never see her username, password, or account numbers. Plaid handles everything and returns only the data you need (transactions, balances).

**What Nicole needs to do (herself — you never see anything):**
1. Click "Connect Account" inside MERIDIAN
2. Search for her bank in the Plaid window
3. Log in with her bank credentials in the Plaid window
4. Select which accounts to share
5. Done — transactions flow into MERIDIAN automatically

**What you need to set up:**
- Create a free Plaid developer account at plaid.com
- Get API keys (free)
- Add Plaid Link to MERIDIAN frontend (~3–5 hrs Phase 2 work)

**Cost:** See Section 4.

---

### 3c. What Nicole Needs to Provide to You (the short list)

She needs to provide **nothing sensitive.** The OAuth and Plaid flows are designed so that clients authorize connections themselves. Here's the full list of what you need from her:

| Item | Why You Need It | How Sensitive |
|---|---|---|
| QuickBooks company ID | To target the right QB account | Low — she gets it from her QB settings |
| Confirmation she's authorized the QB connection | You'll send her a link to click | None |
| Confirmation she's connected her bank via Plaid | You'll add a "Connect Bank" button she clicks | None |
| Her preferred domain name (e.g. meridian.dnaagency.com) | For Phase 2 hosting | Low |

**She never gives you:** bank logins, QB password, credit card numbers, SSNs, or any account credentials. All of that goes directly to Plaid/QuickBooks through their own secure portals.

---

## 4. Monthly Connector Costs

| Service | What It Connects | Monthly Cost |
|---|---|---|
| **Plaid** | Banks, credit cards, investment accounts | ~$0–$15/mo (1–5 accounts at ~$0.30/account/month after free tier) |
| **QuickBooks API** | P&L, invoices, expenses, payroll | Free (included with QB subscription she already pays) |
| **Gamma AI** | Deck generation | Free tier available; Gamma Pro $8/mo if she wants unlimited |
| **Anthropic API** (MERIDIAN AI) | Inline deck generation | ~$5–20/mo depending on usage (pay-per-use, ~$0.003/1K tokens) |
| **Custom domain** (e.g. meridian.dnaagency.com) | Branding | ~$15/year |
| **Hosting upgrade** (Vercel/Railway for backend) | Real database, persistent data | Free tier or $20/mo |
| **Make.com** (optional automation) | Auto-sync, reports, triggers | $9–29/mo |

**Realistic Phase 2 monthly stack: $30–80/mo total** depending on usage and whether she wants the automation layer.

Phase 1 (current build): **$0/mo.** GitHub Pages hosting is free.

---

## 5. The Data Flow — How It All Connects

```
Nicole's QuickBooks ──────────────────────────────────────┐
Nicole's Bank (via Plaid) ────────────────────────────────┤
Nicole's Credit Cards (via Plaid) ────────────────────────┤──► MERIDIAN Finance Tab
Donor CRM (manual + import) ──────────────────────────────┤    Live totals, pipeline,
Grant data (manual + import) ─────────────────────────────┘    drill-down, reporting

Campaign Ad Platforms (Meta, Google) ─────────────────────► MERIDIAN Campaign Tab
(Phase 2: Meta API + Google Ads API)                           Live spend, leads, CPL

CRM Contacts (manual + CSV import) ───────────────────────► MERIDIAN CRM Tab
                                                               Pipeline, edit, search

MERIDIAN AI / Gamma / Canva ──────────────────────────────► Creative Studio
                                                               On-demand deck generation
```

---

## 6. Creative Studio — Current State & Phase 2

**What works now:**
- **Gamma** — opens in new tab with your full brief pre-filled. She fills in company name, purpose, tone, key message, hits Generate, and Gamma builds the deck. Direct link appears in the output panel.
- **Canva** — same pattern, opens Canva with prompt pre-filled
- **MERIDIAN AI** — generates a 5-slide outline inline using Claude API (requires her Anthropic API key)

**Phase 2 additions (when ready):**
- More Gamma templates and visual themes
- Canva template library integration
- Auto-pull campaign data into deck (e.g. "Build a Q1 performance report" pulls real numbers from the Campaign tab)
- Export to Google Slides

---

## 7. Why Monthly Maintenance & Oversight by Von Is Non-Negotiable

---

### What Monthly Maintenance Covers

**Data integrity & synchronization**
Real financial connections don't maintain themselves. API tokens expire, bank connections need re-authorization, QuickBooks refreshes require monitoring. Someone has to watch the pipes. That's me.

**Platform updates**
Meta, Google, QuickBooks, Plaid — all update their APIs regularly. When they do, connectors break silently unless someone is monitoring. I push patches before Nicole ever notices a problem.

**Feature deployment**
MERIDIAN is a living system, not a finished product. New capabilities, new tabs, new integrations, new automations are added on a rolling basis. Monthly maintenance ensures the platform evolves with the business.

**Security monitoring**
API keys need rotation. Access logs need review. Data backups need to run. This is invisible work that matters enormously.

**Campaign data accuracy**
The numbers in Nicole's Campaign tab only mean something if they're right. Monthly oversight includes spot-checking that what MERIDIAN reports matches what the ad platforms report.

**Donor & grant pipeline hygiene**
Stale data is worse than no data. Monthly review ensures the Finance tab reflects current reality — not what was true three months ago.

---

### What Monthly Oversight Provides That No Tool Can Replace

**Strategic interpretation**
MERIDIAN shows Nicole what's happening. I explain what it means and what to do about it. A dashboard without a strategist is just numbers.

**Priority calls**
When three things need attention at once, someone with context decides what's urgent. That's a human judgment call, not a software function.

**Proactive catch**
I see things coming before they become problems — a campaign burning budget with declining returns, a grant deadline approaching, a donor in the Ask stage going cold. I flag it. Nicole acts.

**Institutional memory**
I know the history of every campaign, every donor relationship, every grant pursuit inside this platform. That context doesn't live in a database — it lives in the relationship.

**One point of contact**
Nicole doesn't call Plaid, Anthropic, QuickBooks, Meta, and Google when something breaks. She calls me. I own the entire stack.

---

### The Cost of Not Having It

Without monthly oversight:
- A broken API connection means financial data goes stale and she doesn't know it
- A campaign overspends because no one caught the pacing issue
- A donor goes cold because the CRM showed the wrong last-contact date
- A grant deadline is missed because no one was watching the tracker
- The platform stops evolving and becomes shelfware within 90 days

MERIDIAN is infrastructure. Infrastructure without maintenance fails. It's not a luxury — it's the operating cost of running a professional-grade system.

---

---

## 8. Privacy & Security — How Nicole's Financial Data Stays Safe

This is the right question to ask, and the answer is straightforward: Nicole's bank credentials and account numbers **never touch MERIDIAN, never touch your servers, and never pass through Von's hands.** Here is exactly why, and how to verify it.

---

### The Core Principle: MERIDIAN Never Sees Her Money

MERIDIAN is a **display layer.** It shows data — it never holds, transmits, or has access to credentials. Think of it like a dashboard on your car: it shows you the speed, but it doesn't control the engine. The actual financial connections run through regulated, audited third-party infrastructure that exists specifically to handle this safely.

---

### How Plaid Protects Her Bank Data

**Plaid is the industry standard for financial data connections.** It powers Chase, Venmo, Cash App, Robinhood, Betterment, and thousands of other fintech applications. It is regulated, audited, and subject to strict federal oversight.

**What happens when Nicole connects her bank:**

1. A **Plaid-hosted window** opens — this is Plaid's interface, not MERIDIAN's. It runs on Plaid's servers, encrypted end-to-end.
2. Nicole types her bank username and password **directly into Plaid's window** — the same way she'd log into her bank directly. That information goes from her keyboard to her bank's servers via Plaid's encrypted channel.
3. **Von never sees her credentials.** The MERIDIAN codebase never sees her credentials. Even Plaid doesn't store her raw password — they use tokenized connections.
4. What MERIDIAN receives is a **read-only data token** — a temporary key that says "this account has authorized read-only access to balance and transaction data." It cannot move money. It cannot make payments. It cannot modify anything.

**Plaid's security certifications:**
- SOC 2 Type II certified (independent annual security audit)
- 256-bit AES encryption at rest
- TLS 1.2+ encryption in transit
- Compliant with financial data regulations including GLBA and CCPA
- Registered with and monitored by the CFPB (Consumer Financial Protection Bureau)

**Nicole can verify this herself:** plaid.com/security — it's publicly documented.

---

### Read-Only Access — What That Means in Practice

The connection MERIDIAN establishes through Plaid is **read-only by design.** This is not a setting or a preference — it is a hard technical constraint built into how the token is issued.

With a read-only token, it is **technically impossible** to:
- Transfer money
- Make payments
- Create transactions
- Change account settings
- Access account numbers in full (only the last 4 digits are ever returned)

It can **only** do what a bank statement does: show balances and transaction history.

---

### What Von Can and Cannot See

This is worth being explicit about, because trust requires clarity.

| Data | Can Von See It? |
|---|---|
| Nicole's bank username / password | **No.** Never passes through any system Von controls. |
| Full account numbers | **No.** Plaid returns only the last 4 digits. |
| Social Security Number | **No.** Not involved in any connection. |
| Transaction history (amounts, merchants, dates) | **Yes** — this is the data that feeds the Finance tab. Nicole authorizes this explicitly. |
| Account balances | **Yes** — same authorization. |
| The ability to move money | **No.** Read-only token, technically impossible. |

Nicole controls the connection. She can **revoke access at any time** from her Plaid portal (my.plaid.com) without contacting Von — it disconnects instantly.

---

### QuickBooks Security

QuickBooks uses **OAuth 2.0** — the same security standard used by "Sign in with Google" and "Sign in with Apple." It is the gold standard for third-party app authorization.

When Nicole authorizes the QuickBooks connection:
- She logs in directly at Intuit's website (intuit.com) — not MERIDIAN
- Intuit issues a time-limited access token to MERIDIAN
- That token expires and rotates automatically
- Nicole's QuickBooks password is never seen or stored anywhere outside Intuit

**Intuit's security posture:**
- SOC 1 and SOC 2 Type II certified
- ISO 27001 certified
- 256-bit TLS encryption
- GDPR and CCPA compliant
- Multi-factor authentication supported

Nicole can revoke MERIDIAN's QuickBooks access at any time from her QuickBooks account settings → Connected Apps. One click, instant revocation.

---

### MERIDIAN Itself — What It Stores

Right now (Phase 1), MERIDIAN stores data in **browser localStorage** — a private storage area inside Nicole's own browser on her own device. This means:

- The data never leaves her computer
- It is not on Von's machine
- It is not on a server somewhere
- It cannot be accessed remotely by anyone
- It is isolated to her browser — other websites cannot read it

There is no database to breach because there is no database. Her CRM contacts, donor records, and campaign data live inside her own browser.

---

### Phase 2: When a Backend Database Is Added

When MERIDIAN upgrades to a real database (for cross-device sync), the security posture will include:

- **Encrypted database** (AES-256 at rest)
- **HTTPS-only** access (TLS in transit)
- **Authentication required** — Nicole logs in with a password or passkey
- **Hosting on Vercel or Railway** — both SOC 2 compliant platforms
- **No sensitive financial data stored** — only display-ready summaries pulled fresh from Plaid/QuickBooks at login

---

### The One-Sentence Reassurance

Nicole's bank credentials travel from her fingers to her bank. They do not stop at MERIDIAN, they do not stop at Von's machine, and no one in this chain has the technical ability to move her money — only to read her balances and transactions, with her explicit authorization, which she can revoke in 30 seconds at any time.

---

*MERIDIAN Product Guide v1.0 · March 2026 · Descieux Digital*
