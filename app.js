  // ── AUTH ───────────────────────────────────────────────
  const AUTH_KEY  = 'meridian_auth';
  const USER_KEY  = 'meridian_user';
  const ROLE_KEY  = 'meridian_role';
  
  // Credentials — change these to update access
  const USERS = {
    'nicole': 'meridian2026',
    'admin':  'apex2026'
  };
  
  // User roles: nicole & admin = admin (sees all tabs), others = employee (sees CRM, Campaign, Operations only)
  function getUserRole(username) {
    return (username === 'nicole' || username === 'admin') ? 'admin' : 'employee';
  }

  function checkAuth() {
    const ok = sessionStorage.getItem(AUTH_KEY) === 'true';
    const screen = document.getElementById('login-screen');

    // Check for auto-admin param (?admin=apex2026)
    const params = new URLSearchParams(window.location.search);
    const adminParam = params.get('admin');
    if (adminParam === 'apex2026') {
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(USER_KEY, 'admin');
      sessionStorage.setItem(ROLE_KEY, 'admin');
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      screen.classList.add('hidden');
      updateTabVisibility();
      return;
    }

    if (ok) {
      screen.classList.add('hidden');
      updateTabVisibility();
    } else {
      screen.classList.remove('hidden');
      setTimeout(() => document.getElementById('login-user').focus(), 80);
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim().toLowerCase();
    const pass = document.getElementById('login-pass').value;
    const err  = document.getElementById('login-error');
    if (USERS[user] && USERS[user] === pass) {
      const role = getUserRole(user);
      sessionStorage.setItem(AUTH_KEY, 'true');
      sessionStorage.setItem(USER_KEY, user);
      sessionStorage.setItem(ROLE_KEY, role);
      err.textContent = '';
      document.getElementById('login-screen').classList.add('hidden');
      updateTabVisibility();
    } else {
      err.textContent = 'Incorrect username or password.';
      document.getElementById('login-pass').value = '';
      document.getElementById('login-pass').focus();
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ROLE_KEY);
    document.getElementById('login-user').value = '';
    document.getElementById('login-pass').value = '';
    document.getElementById('login-error').textContent = '';
    document.getElementById('login-screen').classList.remove('hidden');
    setTimeout(() => document.getElementById('login-user').focus(), 80);
  }
  
  // ── ROLE-BASED TAB VISIBILITY ──────────────────────────
  function updateTabVisibility() {
    const role = sessionStorage.getItem(ROLE_KEY) || 'employee';
    const adminTabs = ['finance', 'studio', 'proposals', 'phase2'];
    
    document.querySelectorAll('.tab').forEach(tab => {
      const tabName = tab.dataset.tab;
      if (role === 'admin') {
        // Nicole sees all tabs
        tab.style.display = '';
      } else {
        // Employees see only campaign, crm, operations
        if (adminTabs.includes(tabName)) {
          tab.style.display = 'none';
        } else {
          tab.style.display = '';
        }
      }
    });
  }

  // Run auth check on load
  checkAuth();

  // ── TAB SWITCHING ──────────────────────────────────────
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(target).classList.add('active');

      // Render specific tabs when activated
      if (target === 'operations') renderOperations();
      if (target === 'crm') renderCRM();
      if (target === 'finance') renderFinance();
      if (target === 'proposals') initProposalProjectSelect();
    });
  });

  // ── CAMPAIGN DATA ──────────────────────────────────────
  const CAMPAIGNS_KEY = 'meridian_campaigns';
  const CAMPAIGNS_DATA_VERSION = 7; // Bumped: remove collapsible from labor section
  // Auto-clear stale localStorage when data version changes
  (function() {
    const storedVer = parseInt(localStorage.getItem('meridian_data_version') || '0');
    if (storedVer < CAMPAIGNS_DATA_VERSION) {
      // Clear all meridian keys to ensure clean seed data on every version bump
      Object.keys(localStorage)
        .filter(k => k.startsWith('meridian_') && k !== 'meridian_auth' && k !== 'meridian_user')
        .forEach(k => localStorage.removeItem(k));
      localStorage.setItem('meridian_data_version', String(CAMPAIGNS_DATA_VERSION));
    }
  })();
  const CAMPAIGNS_SEED = [
    {
      id: 1,
      name: "Momentum Fitness — Summer Drive",
      client: "Momentum Fitness",
      contactId: null,
      type: "Meta Ads",
      label: "Summer Campaign",
      status: "active",
      phase: "execution",
      budget: 6500,
      spent: 4200,
      revenue: 18900,
      leads: 312,
      cpl: 13.46,
      ctr: 4.2,
      roas: 4.5,
      cvr: 42,
      startDate: "2026-02-01",
      endDate: "2026-04-30",
      deadline: "2026-04-30",
      lastActivity: "2026-03-27",
      milestones: [
        {name:"Kickoff",date:"2026-02-01",status:"complete"},
        {name:"Creative Due",date:"2026-02-15",status:"complete"},
        {name:"Launch",date:"2026-03-01",status:"complete"},
        {name:"Mid-Campaign Review",date:"2026-03-20",status:"in-progress"},
        {name:"Final Report",date:"2026-04-30",status:"pending"}
      ],
      activities: [
        {id:1,name:"Campaign Strategy",assignee:"Nicole Feenstra",status:"done",dueDate:"2026-02-05",notes:"Q2 strategy finalized",category:"Strategy",teamWork:[{name:"Nicole Feenstra",phase:"Strategy & Planning",progress:100,lastWorked:"2026-02-05"}]},
        {id:2,name:"Ad Creative Production",assignee:"Jade Thompson",status:"done",dueDate:"2026-02-15",notes:"3 ad sets completed",category:"Design",teamWork:[{name:"Jade Thompson",phase:"Design & Production",progress:100,lastWorked:"2026-02-15"},{name:"Marcus Rivera",phase:"Asset Prep",progress:100,lastWorked:"2026-02-12"}]},
        {id:3,name:"Campaign Launch",assignee:"Marcus Rivera",status:"done",dueDate:"2026-03-01",notes:"All ads live",category:"Execution",teamWork:[{name:"Marcus Rivera",phase:"Platform Setup",progress:100,lastWorked:"2026-03-01"},{name:"Alex Kim",phase:"QA Testing",progress:100,lastWorked:"2026-02-28"}]},
        {id:4,name:"Weekly Performance Review",assignee:"Alex Kim",status:"in-progress",dueDate:"2026-04-01",notes:"Ongoing weekly cadence",category:"Analytics",teamWork:[{name:"Alex Kim",phase:"Analytics & Reporting",progress:65,lastWorked:"2026-04-07"},{name:"Nicole Feenstra",phase:"Strategic Review",progress:45,lastWorked:"2026-04-05"}]},
        {id:5,name:"Final Report & Wrap",assignee:"Nicole Feenstra",status:"not-started",dueDate:"2026-04-30",notes:"",category:"Reporting",teamWork:[{name:"Nicole Feenstra",phase:"Report Compilation",progress:0}]}
      ]
    },
    {
      id: 2,
      name: "Brand Identity Refresh",
      client: "Casa Verde Restaurant",
      contactId: null,
      type: "Meta Ads + Google",
      label: "Soft Launch",
      status: "active",
      phase: "review",
      budget: 12000,
      spent: 1850,
      revenue: 5920,
      leads: 89,
      cpl: 20.79,
      ctr: 3.8,
      roas: 3.2,
      cvr: 38,
      startDate: "2026-03-01",
      endDate: "2026-04-15",
      deadline: "2026-04-15",
      lastActivity: "2026-03-26",
      milestones: [
        {name:"Discovery",date:"2026-03-01",status:"complete"},
        {name:"Concepts",date:"2026-03-10",status:"complete"},
        {name:"Client Review",date:"2026-03-20",status:"complete"},
        {name:"Revisions",date:"2026-04-01",status:"in-progress"},
        {name:"Final Delivery",date:"2026-04-15",status:"pending"}
      ],
      activities: [
        {id:1,name:"Discovery & Brand Audit",assignee:"Nicole Feenstra",status:"done",dueDate:"2026-03-05",notes:"Brand audit complete",category:"Strategy"},
        {id:2,name:"Logo Design",assignee:"Jade Thompson",status:"done",dueDate:"2026-03-15",notes:"3 concepts delivered",category:"Design"},
        {id:3,name:"Color Palette & Typography",assignee:"Jade Thompson",status:"done",dueDate:"2026-03-20",notes:"",category:"Design"},
        {id:4,name:"Brand Guidelines Doc",assignee:"Jade Thompson",status:"in-progress",dueDate:"2026-04-05",notes:"Draft in progress",category:"Design"},
        {id:5,name:"Final Assets Package",assignee:"Sarah Chen",status:"not-started",dueDate:"2026-04-15",notes:"",category:"Development"}
      ]
    },
    {
      id: 3,
      name: "Website Redesign & Migration",
      client: "Pacific Legal Group",
      contactId: null,
      type: "Meta Ads",
      label: "Lead Generation",
      status: "active",
      phase: "execution",
      budget: 35000,
      spent: 6500,
      revenue: 25000,
      leads: 203,
      cpl: 32.02,
      ctr: 2.9,
      roas: 3.85,
      cvr: 51,
      startDate: "2026-01-15",
      endDate: "2026-05-31",
      deadline: "2026-05-31",
      lastActivity: "2026-03-28",
      milestones: [
        {name:"Audit",date:"2026-01-20",status:"complete"},
        {name:"Design Comps",date:"2026-03-15",status:"complete"},
        {name:"Development",date:"2026-04-30",status:"in-progress"},
        {name:"Migration & QA",date:"2026-05-15",status:"pending"},
        {name:"Launch",date:"2026-05-31",status:"pending"}
      ],
      activities: [
        {id:1,name:"Site Audit & Architecture",assignee:"Nicole Feenstra",status:"done",dueDate:"2026-01-25",notes:"Existing site documented",category:"Strategy"},
        {id:2,name:"UX Wireframes",assignee:"Jade Thompson",status:"done",dueDate:"2026-02-15",notes:"",category:"Design"},
        {id:3,name:"Design Comps",assignee:"Jade Thompson",status:"done",dueDate:"2026-03-15",notes:"Client approved",category:"Design"},
        {id:4,name:"Frontend Development",assignee:"Sarah Chen",status:"in-progress",dueDate:"2026-04-30",notes:"Sprint 2 of 3",category:"Development"},
        {id:5,name:"Content Migration",assignee:"Sarah Chen",status:"not-started",dueDate:"2026-05-15",notes:"",category:"Development"},
        {id:6,name:"QA & Launch",assignee:"Marcus Rivera",status:"not-started",dueDate:"2026-05-31",notes:"",category:"Execution"}
      ]
    },
    {
      id: 4,
      name: "Solara Skincare Reactivation",
      client: "Solara Skincare",
      contactId: null,
      type: "Meta Ads",
      label: "Reactivation",
      status: "complete",
      phase: "complete",
      budget: 2100,
      spent: 2100,
      revenue: 28000,
      leads: 445,
      cpl: 4.72,
      ctr: 5.1,
      roas: 13.33,
      cvr: 58,
      startDate: "2026-01-01",
      endDate: "2026-02-28",
      deadline: "2026-02-28",
      lastActivity: "2026-02-28",
      milestones: [
        {name:"Kickoff",date:"2026-01-01",status:"complete"},
        {name:"Launch",date:"2026-01-10",status:"complete"},
        {name:"Optimization",date:"2026-02-01",status:"complete"},
        {name:"Final Report",date:"2026-02-28",status:"complete"}
      ],
      activities: [
        {id:1,name:"Campaign Setup",assignee:"Marcus Rivera",status:"done",dueDate:"2026-01-05",notes:"",category:"Execution",teamWork:[{name:"Marcus Rivera",phase:"Setup & Config",progress:100,lastWorked:"2026-01-05"}]},
        {id:2,name:"Ad Creative",assignee:"Jade Thompson",status:"done",dueDate:"2026-01-08",notes:"",category:"Design",teamWork:[{name:"Jade Thompson",phase:"Design & Production",progress:100,lastWorked:"2026-01-08"}]},
        {id:3,name:"Optimization Pass",assignee:"Alex Kim",status:"done",dueDate:"2026-02-01",notes:"CPL improved 40%",category:"Analytics",teamWork:[{name:"Alex Kim",phase:"Testing & Optimization",progress:100,lastWorked:"2026-02-01"}]},
        {id:4,name:"Final Report",assignee:"Nicole Feenstra",status:"done",dueDate:"2026-02-28",notes:"Client thrilled",category:"Reporting",teamWork:[{name:"Nicole Feenstra",phase:"Analysis & Reporting",progress:100,lastWorked:"2026-02-28"}]}
      ]
    },
    {
      id: 5,
      name: "Rebuilding CA — Q2 Grant Push",
      client: "Rebuilding California",
      contactId: null,
      type: "Email + Events",
      label: "Nonprofit Outreach",
      status: "paused",
      phase: "review",
      budget: 8000,
      spent: 3200,
      revenue: 0,
      leads: 47,
      cpl: 68.09,
      ctr: 2.1,
      roas: 0,
      cvr: 15,
      startDate: "2026-03-01",
      endDate: "2026-06-30",
      deadline: "2026-06-30",
      lastActivity: "2026-03-22",
      milestones: [
        {name:"Prospect List",date:"2026-03-05",status:"complete"},
        {name:"Email Sequences",date:"2026-03-15",status:"complete"},
        {name:"First Event",date:"2026-04-10",status:"pending"},
        {name:"Follow-up Wave",date:"2026-05-01",status:"pending"},
        {name:"Grant Deadline",date:"2026-06-30",status:"pending"}
      ],
      activities: [
        {id:1,name:"Prospect Research",assignee:"Marcus Rivera",status:"done",dueDate:"2026-03-05",notes:"47 qualified prospects identified",category:"Strategy",teamWork:[{name:"Marcus Rivera",phase:"Research & Strategy",progress:100,lastWorked:"2026-03-05"}]},
        {id:2,name:"Email Sequence Build",assignee:"Sarah Chen",status:"done",dueDate:"2026-03-15",notes:"3-email nurture built in Mailchimp",category:"Development",teamWork:[{name:"Sarah Chen",phase:"Email Dev & Testing",progress:100,lastWorked:"2026-03-15"}]},
        {id:3,name:"Event Landing Page",assignee:"Jade Thompson",status:"in-progress",dueDate:"2026-04-05",notes:"Paused — waiting on venue confirmation",category:"Design",teamWork:[{name:"Jade Thompson",phase:"Design & Build",progress:40,lastWorked:"2026-03-22"}]},
        {id:4,name:"Donor Event Coordination",assignee:"Nicole Feenstra",status:"not-started",dueDate:"2026-04-10",notes:"On hold until venue confirmed",category:"Execution",teamWork:[{name:"Nicole Feenstra",phase:"Event Planning",progress:0}]},
        {id:5,name:"Grant Application Package",assignee:"Nicole Feenstra",status:"not-started",dueDate:"2026-06-15",notes:"",category:"Reporting",teamWork:[{name:"Nicole Feenstra",phase:"Grant Writing",progress:0}]}
      ]
    },
    {
      id: 6,
      name: "TechStart LA — Launch Campaign",
      client: "TechStart LA",
      contactId: null,
      type: "Google Ads + LinkedIn",
      label: "B2B Lead Gen",
      status: "draft",
      phase: "kickoff",
      budget: 15000,
      spent: 0,
      revenue: 0,
      leads: 0,
      cpl: 0,
      ctr: 0,
      roas: 0,
      cvr: 0,
      startDate: "2026-04-15",
      endDate: "2026-07-15",
      deadline: "2026-07-15",
      lastActivity: "2026-04-07",
      milestones: [
        {name:"Discovery Call",date:"2026-04-07",status:"complete"},
        {name:"Strategy Deck",date:"2026-04-15",status:"pending"},
        {name:"Creative Brief",date:"2026-04-22",status:"pending"},
        {name:"Campaign Launch",date:"2026-05-01",status:"pending"},
        {name:"Mid-Flight Review",date:"2026-06-01",status:"pending"}
      ],
      activities: [
        {id:1,name:"Discovery & Onboarding",assignee:"Nicole Feenstra",status:"done",dueDate:"2026-04-07",notes:"Kickoff call completed, SOW signed",category:"Strategy",teamWork:[{name:"Nicole Feenstra",phase:"Discovery",progress:100,lastWorked:"2026-04-07"}]},
        {id:2,name:"Competitive Analysis",assignee:"Alex Kim",status:"in-progress",dueDate:"2026-04-12",notes:"Analyzing 5 competitors in SoCal tech space",category:"Analytics",teamWork:[{name:"Alex Kim",phase:"Research & Analysis",progress:60,lastWorked:"2026-04-08"}]},
        {id:3,name:"Strategy Deck",assignee:"Marcus Rivera",status:"not-started",dueDate:"2026-04-15",notes:"",category:"Strategy",teamWork:[{name:"Marcus Rivera",phase:"Strategy Development",progress:0}]},
        {id:4,name:"Ad Creative Production",assignee:"Jade Thompson",status:"not-started",dueDate:"2026-04-22",notes:"",category:"Design",teamWork:[{name:"Jade Thompson",phase:"Creative Production",progress:0}]},
        {id:5,name:"Campaign Setup & Launch",assignee:"Marcus Rivera",status:"not-started",dueDate:"2026-05-01",notes:"",category:"Execution",teamWork:[{name:"Marcus Rivera",phase:"Platform Setup",progress:0}]},
        {id:6,name:"Analytics Dashboard Setup",assignee:"Alex Kim",status:"not-started",dueDate:"2026-05-05",notes:"",category:"Analytics",teamWork:[{name:"Alex Kim",phase:"Dashboard Build",progress:0}]}
      ]
    }
  ];
  // Keep SEED as alias for backward compat
  const SEED = CAMPAIGNS_SEED;

  function loadCampaigns() {
    try {
      const stored = JSON.parse(localStorage.getItem(CAMPAIGNS_KEY));
      if (!stored) return [...CAMPAIGNS_SEED];
      // Merge seed fields into stored campaigns (backfill startDate, endDate, activities, teamWork, etc.)
      return stored.map(c => {
        const seed = CAMPAIGNS_SEED.find(s => s.id === c.id);
        if (!seed) return c;
        if (!c.startDate && seed.startDate) c.startDate = seed.startDate;
        if (!c.endDate && seed.endDate) c.endDate = seed.endDate;
        if ((!c.activities || c.activities.length === 0) && seed.activities) c.activities = seed.activities;
        if (c.activities && seed.activities) {
          c.activities = c.activities.map((a, i) => {
            const sa = seed.activities[i];
            if (!sa) return a;
            if (!a.dueDate && sa.dueDate) a.dueDate = sa.dueDate;
            if (!a.teamWork && sa.teamWork) a.teamWork = sa.teamWork;
            return a;
          });
        }
        if (!c.phase && seed.phase) c.phase = seed.phase;
        if (!c.milestones && seed.milestones) c.milestones = seed.milestones;
        return c;
      });
      // Append any seed campaigns not in stored data (new campaigns added after initial save)
      CAMPAIGNS_SEED.forEach(seed => {
        if (!stored.find(c => c.id === seed.id)) {
          stored.push({...seed});
        }
      });
      return stored;
    }
    catch(e) { return [...CAMPAIGNS_SEED]; }
  }
  function saveCampaigns(data) { localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(data)); }

  function getFlags(c) {
    const flags = [];
    const today = new Date();
    const inactive = Math.floor((today - new Date(c.lastActivity)) / 86400000);
    if (c.status === 'active' && new Date(c.deadline) < today) flags.push('Past deadline');
    if (c.status === 'active' && c.spent / c.budget >= 0.9) flags.push('Budget nearly spent');
    if (c.status === 'active' && inactive >= 7) flags.push('No activity ' + inactive + 'd');
    return flags;
  }

  // ─ CAMPAIGN HEALTH & BURNRATE ─
  function getCampaignHealth(c) {
    if (c.status === 'complete') return {status: 'complete', label: '✓ Complete', color: '#2d6a4f'};
    if (c.status === 'paused') return {status: 'paused', label: '⊣ Paused', color: '#c4932a'};
    if (c.status === 'draft') return {status: 'draft', label: '○ Draft', color: '#999'};
    
    const today = new Date();
    const daysLeft = Math.ceil((new Date(c.deadline) - today) / 86400000);
    const budgetUsedPct = (c.spent / c.budget) * 100;
    const avgCpl = c.leads > 0 ? c.spent / c.leads : 0;
    
    let issues = [];
    if (daysLeft < 0) issues.push('Past deadline');
    if (daysLeft > 0 && daysLeft <= 3) issues.push('Deadline soon');
    if (budgetUsedPct >= 90) issues.push('Budget nearly exhausted');
    if (budgetUsedPct >= 100) issues.push('Over budget');
    
    if (issues.length > 0) return {status: 'critical', label: '⚠ ' + issues[0], color: '#e74c3c'};
    if (daysLeft <= 7 || budgetUsedPct >= 70) return {status: 'warn', label: '◐ Monitor', color: '#f39c12'};
    return {status: 'good', label: '◉ Healthy', color: '#27ae60'};
  }

  function getBurnrate(c) {
    const today = new Date();
    const campaignStart = new Date(c.startDate || c.deadline);
    const campaignEnd = new Date(c.deadline);
    const daysElapsed = Math.max(1, Math.ceil((today - campaignStart) / 86400000));
    const daysTotal = Math.max(1, Math.ceil((campaignEnd - campaignStart) / 86400000));
    const daysRemaining = Math.max(0, Math.ceil((campaignEnd - today) / 86400000));
    
    const dailyBurnRate = c.spent / daysElapsed;
    const budgetRemaining = Math.max(0, c.budget - c.spent);
    const projectedDaysAtRate = dailyBurnRate > 0 ? Math.ceil(budgetRemaining / dailyBurnRate) : daysRemaining;
    
    const paceSchedule = daysElapsed / daysTotal;
    const paceBudget = c.spent / c.budget;
    let paceStatus = 'on-track';
    if (paceBudget > paceSchedule * 1.2) paceStatus = 'ahead';
    else if (paceBudget < paceSchedule * 0.8) paceStatus = 'behind';
    
    return {
      daysRemaining,
      projectedDaysAtRate,
      dailyBurnRate,
      paceStatus,
      paceLabel: paceStatus === 'ahead' ? '⚠ Overspending (off pace)' : paceStatus === 'behind' ? '✓ Under budget (efficient spend)' : '→ On track'
    };
  }

  function renderCard(c) {
    const pct = Math.min(Math.round(c.spent / c.budget * 100), 100);
    const statusMap = {active:'badge-active',paused:'badge-paused',complete:'badge-warm',draft:'badge-draft'};
    const statusLabel = {active:'Active',paused:'Paused',complete:'Complete',draft:'Draft'};
    // Show consistent metrics across all campaigns: CTR, ROAS, CVR
    const metricsHtml = `
      <div class="stat-item"><div class="stat-val">${c.ctr || 0}%</div><div class="stat-lbl">CTR</div></div>
      <div class="stat-item"><div class="stat-val">${c.roas || 0}×</div><div class="stat-lbl">ROAS</div></div>
      <div class="stat-item"><div class="stat-val">${c.cvr || 0}%</div><div class="stat-lbl">CVR</div></div>
    `;
    
    // Health & Burnrate
    const health = getCampaignHealth(c);
    const burn = getBurnrate(c);
    const healthHtml = `<div style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;font-weight:700;color:${health.color}">${health.label}</div>`;
    const burnHtml = `<div style="display:flex;align-items:center;gap:0.4rem;font-size:0.75rem;color:var(--forest-mid)">
      <span style="font-weight:700" title="Days of budget remaining at current spending rate">${burn.projectedDaysAtRate}d remaining</span>
      <span style="font-size:0.7rem">${burn.paceLabel}</span>
    </div>`;
    
    // Activity progress
    const acts = c.activities || [];
    const actsDone = acts.filter(a => a.status === 'done').length;
    const actsTotal = acts.length;
    const actsPct = actsTotal ? Math.round((actsDone / actsTotal) * 100) : 0;
    const phaseColors = {kickoff:'var(--forest-mid)',strategy:'#7a8f6b',execution:'var(--gold)',review:'#c4932a',complete:'#2d6a4f'};
    const phaseColor = phaseColors[c.phase || 'execution'] || 'var(--forest-mid)';
    const phaseHtml = c.phase ? `<span style="font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${phaseColor};margin-left:0.5rem">${c.phase}</span>` : '';
    const actProgressHtml = actsTotal > 0 ? `<div style="margin-top:0.5rem;padding-top:0.5rem;border-top:1px solid var(--parchment)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem">
        <span style="font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Deliverables</span>
        <span style="font-size:0.72rem;color:var(--forest-mid)">${actsDone}/${actsTotal} done${phaseHtml}</span>
      </div>
      <div style="height:3px;background:var(--parchment);border-radius:1px;margin-bottom:0.5rem"><div style="height:3px;width:${actsPct}%;background:var(--forest);border-radius:1px"></div></div>
      <div style="display:flex;flex-direction:column;gap:0.3rem">${acts.slice(0,4).map(a => {
        const statusIcon = a.status === 'done' ? '<span style="color:#27AE60">&#10003;</span>' : a.status === 'in-progress' ? '<span style="color:var(--gold)">&#9679;</span>' : '<span style="color:#ccc">&#9675;</span>';
        const assignee = a.assignee ? a.assignee.split(' ')[0] : '';
        const tw = (a.teamWork && a.teamWork[0]) ? a.teamWork[0] : null;
        const progPct = tw ? tw.progress : (a.status === 'done' ? 100 : 0);
        return `<div style="display:flex;align-items:center;gap:0.4rem;font-size:0.78rem" onclick="event.stopPropagation()">
          ${statusIcon}
          <span style="flex:1;color:${a.status==='done'?'#999':'var(--forest)'};${a.status==='done'?'text-decoration:line-through;':''}">${a.name}</span>
          <span style="font-size:0.68rem;color:var(--forest-mid);font-weight:600;min-width:50px;text-align:right">${assignee}</span>
          <div style="width:40px;height:3px;background:var(--parchment);border-radius:1px;flex-shrink:0"><div style="height:3px;width:${progPct}%;background:${progPct===100?'#27AE60':progPct>0?'var(--gold)':'transparent'};border-radius:1px"></div></div>
        </div>`;
      }).join('')}${actsTotal > 4 ? `<div style="font-size:0.7rem;color:var(--forest-mid);text-align:center;margin-top:0.2rem">+${actsTotal-4} more deliverables</div>` : ''}</div>
    </div>` : '';
    return `<div class="card" onclick="openCampaign(${c.id})">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.5rem">
        <div class="card-info">
          <div class="card-title">${c.name}</div>
          <div class="card-meta">${c.type} · ${c.label}</div>
        </div>
        <div class="badge ${statusMap[c.status]||'badge-warm'}" style="cursor:pointer;flex-shrink:0" title="Click to cycle status" onclick="event.stopPropagation();cycleStatus(${c.id})">${statusLabel[c.status]||c.status}</div>
      </div>
      ${healthHtml}
      <div class="card-budget" style="margin-top:0.5rem">
        <div class="spend-bar"><div class="spend-fill" style="width:${pct}%"></div></div>
        <div class="card-budget-label">$${c.spent.toLocaleString()} of $${c.budget.toLocaleString()} budget</div>
      </div>
      ${burnHtml}
      <div class="card-stats" style="margin-top:0.5rem">
        <div class="stat-item"><div class="stat-val">${c.leads.toLocaleString()}</div><div class="stat-lbl">Leads</div></div>
        <div class="stat-item"><div class="stat-val">$${c.cpl > 0 ? c.cpl.toFixed(2) : '—'}</div><div class="stat-lbl">CPL</div></div>
        ${metricsHtml}
      </div>${renderMilestoneBar(c)}${actProgressHtml}</div>`;
  }

  function renderKPIs(data) {
    const spend = data.reduce((s,c)=>s+c.spent,0);
    const leads = data.reduce((s,c)=>s+c.leads,0);
    const cpl = leads > 0 ? spend/leads : 0;
    const revenue = data.reduce((s,c)=>s+c.revenue,0);
    const roas = spend > 0 ? (revenue/spend).toFixed(1) : 0;
    const active = data.filter(c=>c.status==='active').length;

    document.getElementById('kpi-spend').textContent = '$' + spend.toLocaleString();
    document.getElementById('kpi-leads').textContent = leads.toLocaleString();
    document.getElementById('kpi-cpl').textContent = '$' + cpl.toFixed(2);
    document.getElementById('camp-revenue').textContent = '$' + revenue.toLocaleString();

    // Trend badges
    const spTrend = document.getElementById('camp-spend-trend');
    if (spTrend) { spTrend.textContent = data.length + ' campaigns'; spTrend.className = 'fin-kpi-trend up'; }
    const ldTrend = document.getElementById('camp-leads-trend');
    if (ldTrend) { ldTrend.textContent = active + ' active'; ldTrend.className = 'fin-kpi-trend up'; }
    const cpTrend = document.getElementById('camp-cpl-trend');
    if (cpTrend) { cpTrend.textContent = 'improving'; cpTrend.className = 'fin-kpi-trend up'; }
    const roTrend = document.getElementById('camp-roas-trend');
    if (roTrend) { roTrend.textContent = roas + 'x ROAS'; roTrend.className = 'fin-kpi-trend up'; }

    renderCampStatusPipeline(data);
    renderCampSpendBars(data);
    renderCampPerfTable(data);
    renderCampDeliverablesOverview(data);
  }

  function renderCampStatusPipeline(data) {
    const el = document.getElementById('camp-status-pipeline');
    if (!el) return;
    const stages = [
      {key:'draft', label:'DRAFT', bg:'#f5f5f5', color:'#999', border:'#ccc'},
      {key:'active', label:'ACTIVE', bg:'#e8f5e9', color:'#27AE60', border:'#27AE60'},
      {key:'paused', label:'PAUSED', bg:'#fff8e1', color:'#F39C12', border:'#F39C12'},
      {key:'complete', label:'COMPLETE', bg:'#e3f2fd', color:'#2980B9', border:'#2980B9'}
    ];
    const counts = {};
    stages.forEach(s => counts[s.key] = 0);
    data.forEach(c => { if (counts[c.status] !== undefined) counts[c.status]++; });
    document.getElementById('camp-total-count').textContent = data.length + ' campaigns';
    el.innerHTML = `<div class="fin-pipeline">${stages.map(s => `
      <div class="fin-pipe-stage" style="background:${s.bg};border:1px solid ${s.border}30" onclick="drillCampaignStatus('${s.key}')">
        <div class="fin-pipe-count" style="color:${s.color}">${counts[s.key]}</div>
        <div class="fin-pipe-label" style="color:${s.color}">${s.label}</div>
      </div>`).join('')}</div>`;
  }

  function renderCampSpendBars(data) {
    const el = document.getElementById('camp-spend-bars');
    if (!el) return;
    const sorted = [...data].filter(c => c.spent > 0).sort((a,b) => b.spent - a.spent);
    const maxSpend = sorted.length ? sorted[0].spent : 1;
    const barColors = ['var(--forest)','var(--green)','var(--gold)','var(--blue)','#8E44AD','#E67E22'];
    el.innerHTML = sorted.map((c, i) => {
      const pct = (c.spent / maxSpend * 100).toFixed(0);
      const budgetPct = Math.round(c.spent / c.budget * 100);
      return `<div class="fin-bar-row" onclick="openCampaign(${c.id})">
        <div class="fin-bar-label" title="${c.client}">${c.client}</div>
        <div class="fin-bar-track">
          <div class="fin-bar-fill" style="width:${pct}%;background:${barColors[i%barColors.length]}">${pct > 30 ? budgetPct + '% used' : ''}</div>
        </div>
        <div class="fin-bar-amount">$${c.spent.toLocaleString()}</div>
      </div>`;
    }).join('') || '<div style="color:#999;text-align:center;padding:1rem">No spend data</div>';
  }

  function renderCampPerfTable(data) {
    const el = document.getElementById('camp-perf-table');
    if (!el) return;
    const active = data.filter(c => c.status !== 'draft');
    const thS = 'text-align:left;padding:0.4rem 0.5rem;font-size:0.68rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid);border-bottom:2px solid var(--parchment)';
    const tdS = 'padding:0.45rem 0.5rem;border-bottom:1px solid var(--cream);font-size:0.82rem';
    el.innerHTML = `<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse">
      <thead><tr><th style="${thS}">Campaign</th><th style="${thS};text-align:right">CTR</th><th style="${thS};text-align:right">ROAS</th><th style="${thS};text-align:right">CVR</th><th style="${thS};text-align:right">Leads</th></tr></thead>
      <tbody>${active.map(c => {
        const ctrColor = c.ctr >= 4 ? 'var(--green)' : c.ctr >= 2 ? 'var(--gold)' : 'var(--ember)';
        const roasColor = c.roas >= 4 ? 'var(--green)' : c.roas >= 2 ? 'var(--gold)' : 'var(--ember)';
        return `<tr style="cursor:pointer" onclick="openCampaign(${c.id})" onmouseover="this.style.background='var(--cream)'" onmouseout="this.style.background=''">
          <td style="${tdS};font-weight:600;color:var(--forest)">${c.client}</td>
          <td style="${tdS};text-align:right;font-weight:700;color:${ctrColor}">${c.ctr}%</td>
          <td style="${tdS};text-align:right;font-weight:700;color:${roasColor}">${c.roas}x</td>
          <td style="${tdS};text-align:right">${c.cvr}%</td>
          <td style="${tdS};text-align:right;font-weight:600">${c.leads.toLocaleString()}</td>
        </tr>`;
      }).join('')}</tbody></table></div>`;
  }

  function renderCampDeliverablesOverview(data) {
    const el = document.getElementById('camp-deliverables-overview');
    if (!el) return;
    let totalActs = 0, doneActs = 0, inProgActs = 0, notStartedActs = 0;
    data.forEach(c => {
      (c.activities || []).forEach(a => {
        totalActs++;
        if (a.status === 'done') doneActs++;
        else if (a.status === 'in-progress') inProgActs++;
        else notStartedActs++;
      });
    });
    const overallPct = totalActs > 0 ? Math.round((doneActs / totalActs) * 100) : 0;
    document.getElementById('camp-deliv-summary').textContent = doneActs + '/' + totalActs + ' done';

    // Per-campaign deliverable bars
    const campBars = data.filter(c => (c.activities||[]).length > 0).map(c => {
      const acts = c.activities || [];
      const done = acts.filter(a => a.status === 'done').length;
      const inProg = acts.filter(a => a.status === 'in-progress').length;
      const pctDone = Math.round((done / acts.length) * 100);
      const pctInProg = Math.round((inProg / acts.length) * 100);
      return `<div style="margin-bottom:0.6rem">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.2rem">
          <span style="font-size:0.78rem;font-weight:600;color:var(--forest)">${c.client}</span>
          <span style="font-size:0.7rem;color:var(--forest-mid)">${done}/${acts.length}</span>
        </div>
        <div style="height:8px;background:var(--parchment);border-radius:4px;overflow:hidden;display:flex">
          <div style="width:${pctDone}%;background:#27AE60;transition:width 400ms"></div>
          <div style="width:${pctInProg}%;background:var(--gold);transition:width 400ms"></div>
        </div>
      </div>`;
    }).join('');

    el.innerHTML = `
      <div style="display:flex;gap:1.5rem;margin-bottom:1rem">
        <div style="text-align:center;flex:1">
          <div style="font-size:1.6rem;font-weight:700;color:var(--green)">${doneActs}</div>
          <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--forest-mid)">Done</div>
        </div>
        <div style="text-align:center;flex:1">
          <div style="font-size:1.6rem;font-weight:700;color:var(--gold)">${inProgActs}</div>
          <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--forest-mid)">In Progress</div>
        </div>
        <div style="text-align:center;flex:1">
          <div style="font-size:1.6rem;font-weight:700;color:#999">${notStartedActs}</div>
          <div style="font-size:0.68rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--forest-mid)">Not Started</div>
        </div>
      </div>
      <div style="height:10px;background:var(--parchment);border-radius:5px;overflow:hidden;display:flex;margin-bottom:1rem">
        <div style="width:${overallPct}%;background:#27AE60"></div>
        <div style="width:${totalActs > 0 ? Math.round((inProgActs/totalActs)*100) : 0}%;background:var(--gold)"></div>
      </div>
      <div style="font-size:0.72rem;color:var(--forest-mid);text-align:center;margin-bottom:1rem;font-weight:600">${overallPct}% overall completion</div>
      ${campBars}`;
  }

  function drillCampaignStatus(status) {
    const camps = loadCampaigns().filter(c => c.status === status);
    const label = {draft:'Draft',active:'Active',paused:'Paused',complete:'Complete'}[status] || status;
    const rows = camps.map(c => `<tr style="border-bottom:1px solid var(--parchment);cursor:pointer" onclick="closeDrill();openCampaign(${c.id})">
      <td style="padding:0.5rem;font-weight:600;color:var(--forest)">${c.name}</td>
      <td style="padding:0.5rem">${c.client}</td>
      <td style="padding:0.5rem;text-align:right;font-weight:700">${c.leads.toLocaleString()}</td>
      <td style="padding:0.5rem;text-align:right">$${c.spent.toLocaleString()}</td>
    </tr>`).join('');
    openDrillOverlay(`<div class="drill-panel">
      <div class="drill-header"><div><div class="drill-title">${label} Campaigns</div><div class="drill-sub">${camps.length} campaigns</div></div>
      <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button></div>
      <table class="drill-table"><thead><tr><th>Campaign</th><th>Client</th><th style="text-align:right">Leads</th><th style="text-align:right">Spend</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`);
  }

  function renderBoard() {
    const data = loadCampaigns();
    document.getElementById('campaign-board').innerHTML = data.map(renderCard).join('');
    renderKPIs(data);
  }

  function cycleStatus(id) {
    const data = loadCampaigns();
    const c = data.find(x=>x.id===id);
    if (!c) return;
    const cycle = ['draft','active','paused','complete'];
    c.status = cycle[(cycle.indexOf(c.status)+1) % cycle.length];
    saveCampaigns(data);
    renderBoard();
  }

  function openAddModal() { document.getElementById('campaign-modal').style.display = 'flex'; }
  function closeAddModal() {
    document.getElementById('campaign-modal').style.display = 'none';
    document.getElementById('add-campaign-form').reset();
    const cid = document.getElementById('add-campaign-contactId');
    if (cid) cid.value = '';
  }
  function submitCampaign(e) {
    e.preventDefault();
    const f = e.target;
    const data = loadCampaigns();
    const today = new Date().toISOString().split('T')[0];
    // Parse milestones from textarea
    const milestonesRaw = (f.milestones?.value || '').trim();
    const milestones = milestonesRaw ? milestonesRaw.split('\n').filter(l=>l.trim()).map(l=>({name:l.trim(),date:'',status:'pending'})) : [];
    const campaignId = Math.max(0, ...data.map(c=>c.id)) + 1;
    const contactId = document.getElementById('add-campaign-contactId')?.value ? parseInt(document.getElementById('add-campaign-contactId').value) : null;
    data.push({
      id: campaignId,
      name: f.name.value,
      client: f.client.value,
      contactId: contactId,
      type: f.type.value,
      label: f.label.value || 'Campaign',
      status: 'active',
      phase: 'kickoff',
      budget: parseFloat(f.budget.value) || 0,
      spent: 0, revenue: 0, leads: 0, cpl: 0,
      startDate: today,
      endDate: f.deadline.value,
      deadline: f.deadline.value,
      lastActivity: today,
      milestones: milestones,
      activities: []
    });
    saveCampaigns(data);
    renderBoard();
    closeAddModal();
  }

  renderBoard();

  // ── CRM DATA ──────────────────────────────────────────
  const CRM_KEY = 'meridian_contacts';
  const CRM_SEED = [
    {id:1,firstName:"Sarah",lastName:"Kim",email:"sarah.kim@apexrealty.com",phone:"(310) 555-0182",address:"1234 Wilshire Blvd",city:"Los Angeles",state:"CA",zip:"90025",organization:"Apex Realty Group",title:"Principal Broker",stage:"new",value:8000,ranking:4,source:"prospect",nextAction:"Send capability deck",nextActionDue:"2026-04-18",media:{headshot:"",businessCard:"",noteCard:""},otterTranscripts:[],notes:"Interested in full digital marketing package. Met at LA Real Estate Summit. Follow up after Q1 closes.",website:"https://apexrealty.com",linkedin:"https://linkedin.com/in/sarahkim",twitter:"",instagram:"@apexrealtyla",facebook:"",lastContacted:"2026-03-20",tags:["real estate","high value"],createdAt:"2026-01-15"},
    {id:2,firstName:"Marcus",lastName:"Webb",email:"marcus@westcoastboxing.com",phone:"(213) 555-0394",address:"890 S Grand Ave",city:"Los Angeles",state:"CA",zip:"90015",organization:"WestCoast Boxing",title:"Owner & Head Coach",stage:"new",value:5000,ranking:3,source:"prospect",nextAction:"Follow up on quote",nextActionDue:"2026-04-20",headshot:"",notes:"Wants social media management + local Meta ads. Budget is flexible if we show results.",website:"https://westcoastboxing.com",linkedin:"",twitter:"@wcboxing",instagram:"@westcoastboxingla",facebook:"",lastContacted:"2026-03-18",tags:["fitness","local"],createdAt:"2026-02-01"},
    {id:3,firstName:"Jordan",lastName:"Elias",email:"jordan@thevaultgym.com",phone:"(323) 555-0271",address:"4501 Hollywood Blvd",city:"Los Angeles",state:"CA",zip:"90027",organization:"The Vault Gym",title:"CEO",stage:"warm",value:12000,ranking:5,source:"prospect",nextAction:"Deliver proposal",nextActionDue:"2026-04-14",headshot:"",notes:"Had second call on 3/15. Very interested in full funnel — Meta ads, email, landing pages. Wants proposal by April 1.",website:"https://thevaultgym.com",linkedin:"https://linkedin.com/in/jordanelias",twitter:"",instagram:"@thevaultgym",facebook:"https://facebook.com/thevaultgym",lastContacted:"2026-03-15",tags:["fitness","proposal ready","hot"],createdAt:"2026-01-20"},
    {id:4,firstName:"Priya",lastName:"Mehta",email:"priya@bloomwellness.co",phone:"(818) 555-0047",address:"2200 Ventura Blvd",city:"Studio City",state:"CA",zip:"91604",organization:"Bloom Wellness",title:"Founder",stage:"warm",value:7000,ranking:4,source:"prospect",nextAction:"Send price sheet",nextActionDue:"2026-04-16",headshot:"",notes:"Wellness spa — wants Google Ads + Instagram growth. Discussed brand voice. Needs price sheet.",website:"https://bloomwellness.co",linkedin:"",twitter:"",instagram:"@bloomwellnessla",facebook:"",lastContacted:"2026-03-12",tags:["wellness","instagram"],createdAt:"2026-02-10"},
    {id:5,firstName:"David",lastName:"Chen",email:"d.chen@pacificlegalgroup.com",phone:"(213) 555-0819",address:"633 W 5th St, Suite 2800",city:"Los Angeles",state:"CA",zip:"90071",organization:"Pacific Legal Group",title:"Managing Partner",stage:"active",value:18000,ranking:5,source:"client",nextAction:"Monthly reporting call",nextActionDue:"2026-04-15",headshot:"",notes:"Running Meta lead gen campaign. High intent leads coming in. Monthly reporting call scheduled for Apr 3.",website:"https://pacificlegalgroup.com",linkedin:"https://linkedin.com/in/davidchenlaw",twitter:"",instagram:"",facebook:"",lastContacted:"2026-04-07",tags:["legal","active campaign","high value"],createdAt:"2025-11-01"},
    {id:6,firstName:"Monica",lastName:"Torres",email:"monica@casaverdeLA.com",phone:"(323) 555-0562",address:"1456 Sunset Blvd",city:"Los Angeles",state:"CA",zip:"90026",organization:"Casa Verde Restaurant",title:"Owner",stage:"active",value:4500,ranking:3,source:"client",nextAction:"Budget review meeting",nextActionDue:"2026-04-17",headshot:"",notes:"Soft launch Meta + Google campaign live. ROAS tracking well. Monthly budget review next week.",website:"https://casaverdela.com",linkedin:"",twitter:"",instagram:"@casaverdeLA",facebook:"https://facebook.com/casaverdeLA",lastContacted:"2026-04-06",tags:["restaurant","food & bev"],createdAt:"2026-01-05"},
    {id:7,firstName:"Alex",lastName:"Rodriguez",email:"alex@sunsetauto.com",phone:"(310) 555-0334",address:"9200 Sepulveda Blvd",city:"Los Angeles",state:"CA",zip:"90045",organization:"Sunset Auto Group",title:"General Manager",stage:"closed",value:3000,ranking:2,source:"prospect",nextAction:"Re-engage with case study",nextActionDue:"2026-05-01",headshot:"",notes:"Went cold after initial quote. Follow up in Q2. May respond to a case study from a similar business.",website:"",linkedin:"",twitter:"",instagram:"",facebook:"https://facebook.com/sunsetautogroup",lastContacted:"2026-02-01",tags:["auto","re-engage Q2"],createdAt:"2025-12-10"},
    {id:8,firstName:"Kezia",lastName:"Okafor",email:"kezia@okaforbrands.com",phone:"(323) 555-0701",address:"800 W Olympic Blvd",city:"Los Angeles",state:"CA",zip:"90015",organization:"Okafor Brands",title:"Brand Director",stage:"new",value:9500,ranking:4,source:"prospect",nextAction:"Discovery call",nextActionDue:"2026-04-15",headshot:"",notes:"Brand strategy + paid media inquiry. Came in via referral from David Chen. First call scheduled Apr 5.",website:"https://okaforbrands.com",linkedin:"https://linkedin.com/in/keziaokafor",twitter:"@keziaokafor",instagram:"@okaforbrands",facebook:"",lastContacted:"2026-04-05",tags:["brand","referral"],createdAt:"2026-03-20"},
    {id:9,firstName:"Tariq",lastName:"Hasan",email:"tariq@labrickcoffee.com",phone:"(213) 555-0129",address:"1100 S Hope St",city:"Los Angeles",state:"CA",zip:"90015",organization:"LA Brick Coffee",title:"Co-Founder",stage:"warm",value:5500,ranking:3,source:"prospect",nextAction:"Follow up on content proposal",nextActionDue:"2026-04-19",headshot:"",notes:"Multi-location coffee brand. Wants full content strategy + Meta Ads for grand opening of 3rd location.",website:"https://labrickcoffee.com",linkedin:"",twitter:"",instagram:"@labrickcoffee",facebook:"https://facebook.com/labrickcoffee",lastContacted:"2026-03-10",tags:["food & bev","growth"],createdAt:"2026-02-25"},
    {id:10,firstName:"Simone",lastName:"Beaumont",email:"simone@beaumontatelier.com",phone:"(310) 555-0255",address:"434 N Rodeo Dr",city:"Beverly Hills",state:"CA",zip:"90210",organization:"Beaumont Atelier",title:"Creative Director",stage:"warm",value:22000,ranking:5,source:"prospect",nextAction:"Present editorial proposal",nextActionDue:"2026-04-20",headshot:"",notes:"Luxury fashion atelier. Wants luxury-tier digital ads and editorial-style content. Very brand-conscious — match the aesthetic.",website:"https://beaumontatelier.com",linkedin:"https://linkedin.com/in/simonebeaumont",twitter:"",instagram:"@beaumontatelier",facebook:"",lastContacted:"2026-03-22",tags:["luxury","fashion","editorial","high value"],createdAt:"2026-03-01"},
    {id:11,firstName:"DeShawn",lastName:"Watkins",email:"deshawn@elevateagency.co",phone:"(323) 555-0943",address:"3535 Cahuenga Blvd W",city:"Los Angeles",state:"CA",zip:"90068",organization:"Elevate Agency",title:"Founder",stage:"closed",value:6000,ranking:2,source:"prospect",nextAction:"White-label conversation Q3",nextActionDue:"2026-07-01",headshot:"",notes:"Competing agency — had conversation about white-labeling. Gone quiet. Worth revisiting in Q3.",website:"https://elevateagency.co",linkedin:"https://linkedin.com/in/deshawnwatkins",twitter:"",instagram:"",facebook:"",lastContacted:"2026-01-20",tags:["agency","white-label","Q3"],createdAt:"2025-11-15"},
    {id:12,firstName:"Nadia",lastName:"Petrov",email:"nadia@solarpeak.energy",phone:"(213) 555-0476",address:"444 S Flower St",city:"Los Angeles",state:"CA",zip:"90071",organization:"Solar Peak Energy",title:"VP Marketing",stage:"active",value:14000,ranking:4,source:"client",nextAction:"Expansion market briefing",nextActionDue:"2026-04-18",headshot:"",notes:"Running lead gen for residential solar. Strong CPL improvements over 60 days. Wants to expand to 3 new markets.",website:"https://solarpeak.energy",linkedin:"https://linkedin.com/in/nadiapetrov",twitter:"@solarpeak",instagram:"@solarpeak.energy",facebook:"",lastContacted:"2026-04-08",tags:["energy","active campaign","expansion"],createdAt:"2025-10-01"},
    {id:13,firstName:"Marcus",lastName:"Jensen",email:"m.jensen@elcamino.edu",phone:"(310) 660-3100",address:"16007 Crenshaw Blvd",city:"Torrance",state:"CA",zip:"90506",organization:"El Camino College",title:"Dean of Career Education",stage:"new",value:0,ranking:3,source:"apollo-cte",nextAction:"Initial outreach email",nextActionDue:"2026-04-22",headshot:"",notes:"CTE-tagged contact from Apollo export. Community college with active workforce programs.",website:"https://elcamino.edu",linkedin:"",twitter:"",instagram:"",facebook:"",lastContacted:"",tags:["higher-ed","CTE","apollo"],createdAt:"2026-04-13"},
    {id:14,firstName:"Rita",lastName:"Okonkwo",email:"r.okonkwo@riohondo.edu",phone:"(562) 908-3400",address:"3600 Workman Mill Rd",city:"Whittier",state:"CA",zip:"90601",organization:"Rio Hondo College",title:"VP of Workforce Development",stage:"new",value:0,ranking:3,source:"apollo-cte",nextAction:"Initial outreach email",nextActionDue:"2026-04-22",headshot:"",notes:"CTE-tagged contact from Apollo export. Strong WFD focus, potential enrollment marketing partner.",website:"https://riohondo.edu",linkedin:"",twitter:"",instagram:"",facebook:"",lastContacted:"",tags:["higher-ed","CTE","apollo"],createdAt:"2026-04-13"},
    {id:15,firstName:"Emilie",lastName:"Becker",email:"emilie@rebuildingrelay.org",phone:"",address:"",city:"Los Angeles",state:"CA",zip:"",organization:"Rebuilding California",title:"Producer",stage:"active",value:0,ranking:4,source:"event",nextAction:"Post-summit debrief",nextActionDue:"2026-04-21",headshot:"",notes:"Solution Summit producer. Key crew contact for future Rebuilding CA events.",website:"",linkedin:"",twitter:"",instagram:"",facebook:"",lastContacted:"2026-02-21",tags:["event","rebuilding-ca"],createdAt:"2026-01-10"}
  ];

  function loadContacts() {
    try { return JSON.parse(localStorage.getItem(CRM_KEY)) || [...CRM_SEED]; }
    catch(e) { return [...CRM_SEED]; }
  }
  function saveContacts(data) { localStorage.setItem(CRM_KEY, JSON.stringify(data)); }

  let crmView = 'kanban';
  function setCRMView(v) {
    crmView = v;
    document.getElementById('btn-view-kanban').classList.toggle('active', v === 'kanban');
    document.getElementById('btn-view-list').classList.toggle('active', v === 'list');
    renderCRM();
  }

  function getFilteredContacts() {
    const q = (document.getElementById('crm-search')?.value || '').toLowerCase();
    const stage = document.getElementById('crm-stage-filter')?.value || '';
    const source = document.getElementById('crm-source-filter')?.value || '';
    const rank = parseInt(document.getElementById('crm-rank-filter')?.value) || 0;
    return loadContacts().filter(c => {
      const hay = `${c.firstName} ${c.lastName} ${c.organization} ${c.email} ${(c.tags||[]).join(' ')}`.toLowerCase();
      return (!q || hay.includes(q)) && (!stage || c.stage === stage) && (!source || c.source === source) && (!rank || c.ranking >= rank);
    });
  }

  function daysSince(dateStr) {
    if (!dateStr) return 999;
    const last = new Date(dateStr);
    const now = new Date();
    return Math.floor((now - last) / (1000 * 60 * 60 * 24));
  }

  function staleBadge(lastContacted) {
    const d = daysSince(lastContacted);
    if (d >= 30) return `<span class="stale-badge stale-danger">&#9888; ${d}d no contact</span>`;
    if (d >= 14) return `<span class="stale-badge stale-warn">&#9679; ${d}d since contact</span>`;
    return '';
  }

  function stars(n, empty=false) {
    return '★'.repeat(n) + (empty ? '☆'.repeat(5-n) : '');
  }
  function initials(c) { return (c.firstName[0] + c.lastName[0]).toUpperCase(); }

  function triggerHeadshotUpload(contactId) {
    const input = document.getElementById('headshot-input-' + contactId);
    if (input) input.click();
  }

  function handleHeadshotUpload(event, contactId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result;
      const contacts = loadContacts();
      const contact = contacts.find(c => c.id === contactId);
      if (!contact) return;
      if (!contact.media) contact.media = {};
      contact.media.headshot = base64;
      saveContacts(contacts);
      const avatar = event.target.closest('.cm-left')?.querySelector('.cm-avatar');
      if (avatar) {
        avatar.innerHTML = `<img src="${base64}" alt=""><div class="cm-avatar-overlay">📷</div>`;
      }
    };
    reader.readAsDataURL(file);
  }

  const STAGE_BADGE = {new:'badge-new',warm:'badge-warm',active:'badge-active',closed:'badge-closed'};
  const STAGE_LABEL = {new:'New',warm:'Warm',active:'Active',closed:'Closed'};

  // ── CRM MODE (contacts / deals) ───────────────────────
  let crmMode = 'contacts';
  function setCRMMode(mode) {
    crmMode = mode;
    document.getElementById('crm-mode-contacts').classList.toggle('active', mode === 'contacts');
    document.getElementById('crm-mode-deals').classList.toggle('active', mode === 'deals');
    document.getElementById('crm-contacts-view').style.display = mode === 'contacts' ? '' : 'none';
    document.getElementById('crm-deals-view').style.display = mode === 'deals' ? '' : 'none';
    if (mode === 'deals') renderDeals();
  }

  // ── DEALS PIPELINE DATA ───────────────────────────────
  const DEALS_KEY = 'meridian_deals';
  const DEALS_SEED = [
    {id:'D001', name:'McGuire Law / CalFireLawyers.com', client:'McGuire Law', value:30000, stage:'proposal-sent',
     sentDate:'2026-03-01', lastActivity:'2026-03-20', nextAction:'Follow up on Phase 1 approval', nextActionDue:'2026-04-15',
     description:'Phase 1 landing page + booking ($7K), Phase 2 paid media ($15.5K), Phase 3 event-day ($7.5K)',
     notes:'Proposal covers 3 phases over 90 days. Awaiting signature.'},
    {id:'D002', name:'Gold Coast Co — Fire Recovery Campaign', client:'Gold Coast Co', value:49000, stage:'negotiating',
     sentDate:'2026-02-15', lastActivity:'2026-04-01', nextAction:'Confirm Phase 1 brand foundation scope', nextActionDue:'2026-04-17',
     description:'3-phase fire recovery campaign: brand foundation ($5K), content/video ($12.5K), ad campaign ($12.5K) + $10K media + $9K mgmt',
     notes:'Client wants to reduce Phase 2 budget. Hold firm on media min.'},
    {id:'D003', name:'CA Community Foundation — Stronger Together', client:'CA Community Foundation', value:25000, stage:'proposal-sent',
     sentDate:'2026-01-20', lastActivity:'2026-02-25', nextAction:'Post-event close conversation', nextActionDue:'2026-04-20',
     description:'Lead sponsor package for Stronger Together wildfire recovery event, Feb 21 Pasadena Convention Center',
     notes:'Event has passed. Following up on sponsorship conversion and next engagement.'},
    {id:'D004', name:'Flagstaff Academy — Enrollment Marketing', client:'Flagstaff Academy Charter School', value:99000, stage:'active',
     sentDate:'2026-01-10', lastActivity:'2026-04-08', nextAction:'Phase 2 milestone review', nextActionDue:'2026-04-22',
     description:'11-month enrollment marketing program: 3 phases, full-funnel lead→tour→enroll system, SmartSuite CRM integration',
     notes:'Largest active engagement. Running well — Phase 1 complete, Phase 2 underway.'},
    {id:'D005', name:'SDSU RFP #7060 — Recruitment Advertising', client:'San Diego State University', value:130000, stage:'proposal-sent',
     sentDate:'2026-03-15', lastActivity:'2026-03-15', nextAction:'RFP follow-up with procurement contact', nextActionDue:'2026-04-16',
     description:'Recruitment advertising services: Sports MBA program ($130K) + Global Campus option ($700K). 49-page response submitted.',
     notes:'Major RFP. DNA Agency qualified as woman-owned LLC. Needs persistent follow-through — procurement offices move slowly.'},
    {id:'D006', name:'Sierra Joint CCD — Digital Marketing', client:'Sierra Joint Community College District', value:46000, stage:'won',
     sentDate:'2025-10-01', lastActivity:'2026-04-01', nextAction:'Invoice #1138 — next billing cycle', nextActionDue:'2026-05-01',
     description:'BI/Mech/IT site management + BI/Mech/IT/ADVM media push. Invoice #1137 paid ($46K).',
     notes:'Ongoing retainer. Invoice #1137 paid. Active client.'}
  ];

  function loadDeals() {
    try { return JSON.parse(localStorage.getItem(DEALS_KEY)) || [...DEALS_SEED]; }
    catch(e) { return [...DEALS_SEED]; }
  }
  function saveDeals(d) { localStorage.setItem(DEALS_KEY, JSON.stringify(d)); }

  const DEAL_STAGES = [
    {key:'prospect',    label:'Prospect',      color:'#9B8EC4'},
    {key:'proposal-sent', label:'Proposal Sent', color:'#C9A84C'},
    {key:'negotiating', label:'Negotiating',   color:'#E07B39'},
    {key:'active',      label:'Active',        color:'#2C4A3E'},
    {key:'won',         label:'Won',           color:'#27AE60'},
    {key:'lost',        label:'Lost',          color:'#c0392b'}
  ];

  function renderDeals() {
    const deals = loadDeals();
    const today = new Date();
    const container = document.getElementById('deals-pipeline-container');
    if (!container) return;

    // KPI bar
    const totalVal = deals.filter(d => d.stage !== 'lost').reduce((s,d) => s+d.value, 0);
    const activeCount = deals.filter(d => ['proposal-sent','negotiating','active'].includes(d.stage)).length;
    const wonVal = deals.filter(d => d.stage === 'won').reduce((s,d) => s+d.value, 0);
    const staleDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost' && daysSince(d.lastActivity) >= 14);

    const fmt = (n) => '$' + (n >= 1000 ? Math.round(n/1000) + 'K' : n.toLocaleString());

    container.innerHTML = `
      <div class="kpi-bar" style="margin-bottom:1.5rem">
        <div class="kpi"><div class="kpi-value">${fmt(totalVal)}</div><div class="kpi-label">Pipeline Value</div></div>
        <div class="kpi"><div class="kpi-value">${activeCount}</div><div class="kpi-label">Open Deals</div></div>
        <div class="kpi"><div class="kpi-value">${fmt(wonVal)}</div><div class="kpi-label">Closed Won</div></div>
        <div class="kpi"><div class="kpi-value" style="color:${staleDeals.length > 0 ? '#c0392b' : 'var(--forest)'}">${staleDeals.length}</div><div class="kpi-label">Stale Deals</div></div>
      </div>
      <div class="deals-pipeline">
        ${DEAL_STAGES.map(s => {
          const stageDealsList = deals.filter(d => d.stage === s.key);
          const stageVal = stageDealsList.reduce((sum,d) => sum+d.value, 0);
          return `<div class="deal-col">
            <div class="deal-col-header" style="border-top:3px solid ${s.color}">
              <div class="deal-col-label">${s.label} <span style="font-size:0.72rem;color:var(--forest-mid);font-weight:400">(${stageDealsList.length})</span></div>
              ${stageVal > 0 ? `<div class="deal-col-value">${fmt(stageVal)}</div>` : ''}
            </div>
            <div class="deal-cards">
              ${stageDealsList.length ? stageDealsList.map(d => {
                const d_since = daysSince(d.lastActivity);
                const isStale = d_since >= 14 && !['won','lost'].includes(d.stage);
                return `<div class="deal-card" onclick="openDealDetail('${d.id}')">
                  <div class="deal-name">${d.name}</div>
                  <div class="deal-value">${fmt(d.value)}</div>
                  <div class="deal-meta">${d.client}</div>
                  ${d.nextAction ? `<div class="deal-next-action">
                    <span class="deal-next-label">Next Action</span>
                    ${d.nextAction}${d.nextActionDue ? ` <span style="color:var(--gold-deep);font-weight:700"> · ${d.nextActionDue}</span>` : ''}
                  </div>` : ''}
                  ${isStale ? `<span class="stale-badge ${d_since >= 30 ? 'stale-danger' : 'stale-warn'}">&#9888; ${d_since}d no activity</span>` : ''}
                </div>`;
              }).join('') : `<div style="padding:0.75rem;font-size:0.82rem;color:var(--forest-mid);font-style:italic">No deals</div>`}
            </div>
          </div>`;
        }).join('')}
      </div>`;
  }

  function openDealDetail(dealId) {
    const deals = loadDeals();
    const d = deals.find(x => x.id === dealId);
    if (!d) return;
    const fmt = (n) => '$' + (n >= 1000 ? Math.round(n/1000) + 'K' : n.toLocaleString());
    const stageLabel = DEAL_STAGES.find(s => s.key === d.stage)?.label || d.stage;
    openDrillOverlay(`
      <h2 style="font-family:'DM Serif Display',serif;color:var(--forest);margin-bottom:0.25rem">${d.name}</h2>
      <div style="font-size:0.85rem;color:var(--forest-mid);margin-bottom:1.5rem">${d.client} &nbsp;·&nbsp; ${stageLabel}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
        <div><div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-deep)">Deal Value</div><div style="font-size:1.8rem;font-weight:700;color:var(--forest)">${fmt(d.value)}</div></div>
        <div><div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-deep)">Last Activity</div><div style="font-size:1rem;font-weight:600;color:var(--forest)">${d.lastActivity || '—'}</div></div>
      </div>
      <div style="margin-bottom:1rem"><div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:0.4rem">Scope</div><div style="font-size:0.9rem;color:var(--charcoal);line-height:1.5">${d.description}</div></div>
      ${d.nextAction ? `<div style="background:var(--cream);border:1px solid var(--parchment);padding:0.75rem 1rem;margin-bottom:1rem"><div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:0.3rem">Next Action</div><div style="font-size:0.9rem;color:var(--charcoal)">${d.nextAction}${d.nextActionDue ? ` <span style="color:var(--gold-deep);font-weight:700">· Due ${d.nextActionDue}</span>` : ''}</div></div>` : ''}
      ${d.notes ? `<div style="font-size:0.85rem;color:var(--forest-mid);font-style:italic;line-height:1.5">${d.notes}</div>` : ''}
    `);
  }

  // ── NOTIFICATION DIGEST ───────────────────────────────
  let digestOpen = false;
  function toggleDigest() {
    digestOpen = !digestOpen;
    const panel = document.getElementById('digest-panel');
    if (digestOpen) {
      buildDigest();
      panel.style.display = '';
    } else {
      panel.style.display = 'none';
    }
    // close on outside click
    if (digestOpen) {
      setTimeout(() => {
        document.addEventListener('click', closeDigestOutside, {once:true});
      }, 50);
    }
  }
  function closeDigestOutside(e) {
    const panel = document.getElementById('digest-panel');
    const bell = document.getElementById('notif-bell-btn');
    if (panel && !panel.contains(e.target) && !bell.contains(e.target)) {
      panel.style.display = 'none';
      digestOpen = false;
    }
  }

  function buildDigest() {
    const today = new Date();
    const dateLabel = today.toLocaleDateString('en-US', {weekday:'long', month:'short', day:'numeric'});
    document.getElementById('digest-date').textContent = dateLabel;

    // Stale deals
    const deals = loadDeals();
    const staleDeals = deals.filter(d => !['won','lost'].includes(d.stage) && daysSince(d.lastActivity) >= 14);

    // Upcoming task deadlines (next 7 days)
    const campaigns = loadCampaigns();
    const soonTasks = [];
    campaigns.forEach(c => {
      (c.activities || []).forEach(a => {
        if (a.status !== 'done' && a.dueDate) {
          const diff = Math.ceil((new Date(a.dueDate) - today) / (1000 * 60 * 60 * 24));
          if (diff >= 0 && diff <= 7) soonTasks.push({campaign:c.name, task:a.name, dueDate:a.dueDate, diff});
        }
      });
    });
    soonTasks.sort((a,b) => a.diff - b.diff);

    // Grant deadlines (next 30 days)
    const grants = loadGrants ? loadGrants() : [];
    const urgentGrants = grants.filter(g => {
      if (!g.deadline || g.status === 'awarded' || g.status === 'declined') return false;
      const diff = Math.ceil((new Date(g.deadline) - today) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 30;
    });
    urgentGrants.sort((a,b) => new Date(a.deadline) - new Date(b.deadline));

    // Stale contacts (not deals) no contact in 30+ days, non-closed
    const contacts = loadContacts();
    const staleContacts = contacts.filter(c => c.stage !== 'closed' && daysSince(c.lastContacted) >= 21);

    // Update badge
    const totalAlerts = staleDeals.length + soonTasks.length + urgentGrants.length;
    const badge = document.getElementById('notif-count');
    badge.textContent = totalAlerts;
    badge.style.display = totalAlerts > 0 ? 'flex' : 'none';

    let html = '';

    if (staleDeals.length) {
      html += `<div class="digest-section">
        <div class="digest-section-label">&#9888; Stale Deals (${staleDeals.length})</div>
        ${staleDeals.map(d => `<div class="digest-item"><span class="digest-dot">&#9679;</span><span><strong>${d.name}</strong><br><span style="font-size:0.78rem;color:var(--forest-mid)">${daysSince(d.lastActivity)}d no activity · Next: ${d.nextAction || 'Not set'}</span></span></div>`).join('')}
      </div>`;
    }

    if (soonTasks.length) {
      html += `<div class="digest-section">
        <div class="digest-section-label">&#9200; Due This Week (${soonTasks.length})</div>
        ${soonTasks.map(t => `<div class="digest-item"><span class="digest-dot">&#9679;</span><span><strong>${t.task}</strong> &mdash; ${t.campaign}<br><span style="font-size:0.78rem;color:var(--forest-mid)">Due ${t.dueDate}${t.diff === 0 ? ' &mdash; <strong style="color:#c0392b">Today</strong>' : t.diff === 1 ? ' &mdash; Tomorrow' : ''}</span></span></div>`).join('')}
      </div>`;
    }

    if (urgentGrants.length) {
      html += `<div class="digest-section">
        <div class="digest-section-label">&#128196; Grant Deadlines (${urgentGrants.length})</div>
        ${urgentGrants.map(g => {
          const diff = Math.ceil((new Date(g.deadline) - today) / (1000 * 60 * 60 * 24));
          return `<div class="digest-item"><span class="digest-dot">&#9679;</span><span><strong>${g.name}</strong><br><span style="font-size:0.78rem;color:var(--forest-mid)">Due ${g.deadline} &mdash; ${diff}d remaining</span></span></div>`;
        }).join('')}
      </div>`;
    }

    if (staleContacts.length) {
      html += `<div class="digest-section">
        <div class="digest-section-label">&#128100; Contacts to Reconnect (${staleContacts.length})</div>
        ${staleContacts.slice(0,3).map(c => `<div class="digest-item"><span class="digest-dot">&#9679;</span><span><strong>${c.firstName} ${c.lastName}</strong> &mdash; ${c.organization}<br><span style="font-size:0.78rem;color:var(--forest-mid)">${daysSince(c.lastContacted)}d since last contact${c.nextAction ? ' · ' + c.nextAction : ''}</span></span></div>`).join('')}
        ${staleContacts.length > 3 ? `<div style="font-size:0.78rem;color:var(--forest-mid);padding:0.2rem 0">+${staleContacts.length - 3} more</div>` : ''}
      </div>`;
    }

    if (!html) {
      html = `<div class="digest-empty">All caught up. No urgent items today.</div>`;
    }

    document.getElementById('digest-content').innerHTML = html;
  }

  // ── GANTT SHORTCUT ────────────────────────────────────
  function switchToGantt() {
    // Switch to Operations tab and set gantt view
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const opsTab = document.querySelector('[data-tab="operations"]');
    if (opsTab) opsTab.classList.add('active');
    const opsContent = document.getElementById('operations');
    if (opsContent) opsContent.classList.add('active');
    switchOpsView('gantt');
  }

  function renderCRMKPIs() {
    const all = loadContacts();
    const val = all.reduce((s,c)=>s+c.value,0);
    const avg = all.length ? (all.reduce((s,c)=>s+c.ranking,0)/all.length).toFixed(1) : '—';
    document.getElementById('crm-kpi-total').textContent = all.length;
    document.getElementById('crm-kpi-active').textContent = all.filter(c=>c.stage==='active').length;
    document.getElementById('crm-kpi-value').textContent = '$' + (val >= 1000 ? Math.round(val/1000)+'K' : val);
    document.getElementById('crm-kpi-rank').textContent = avg + ' ★';
  }

  function renderCRM() {
    renderCRMKPIs();
    const data = getFilteredContacts();
    if (crmView === 'kanban') {
      document.getElementById('crm-kanban').style.display = '';
      document.getElementById('crm-list').style.display = 'none';
      renderKanbanCRM(data);
    } else {
      document.getElementById('crm-kanban').style.display = 'none';
      document.getElementById('crm-list').style.display = '';
      renderListCRM(data);
    }
  }

  function renderKanbanCRM(data) {
    const stages = ['new','warm','active','closed'];
    document.getElementById('crm-kanban').innerHTML = '<div class="pipeline">' +
      stages.map(stage => {
        const contacts = data.filter(c => c.stage === stage);
        return `<div class="pipeline-col">
          <div class="pipeline-col-header">
            <div class="pipeline-col-label">${STAGE_LABEL[stage]}</div>
            <div class="pipeline-count">${contacts.length}</div>
          </div>
          <div class="pipeline-cards">
            ${contacts.length ? contacts.map(c => `
              <div class="contact-card" onclick="openContact(${c.id})">
                <div class="contact-name">${c.firstName} ${c.lastName}</div>
                <div class="contact-co">${c.organization}</div>
                <div style="font-size:0.92rem;color:var(--gold);margin:0.25rem 0 0.3rem">${stars(c.ranking)}</div>
                ${c.nextAction ? `<div style="font-size:0.76rem;color:var(--forest-mid);margin-bottom:0.2rem;line-height:1.3"><span style="font-weight:700;color:var(--gold-deep);text-transform:uppercase;font-size:0.65rem;letter-spacing:0.08em">Next: </span>${c.nextAction}${c.nextActionDue ? ' <span style="color:var(--forest-mid)">· '+c.nextActionDue+'</span>' : ''}</div>` : ''}
                ${staleBadge(c.lastContacted)}
                <div class="contact-footer" style="margin-top:0.4rem">
                  ${c.value > 0 ? `<div class="contact-value">$${c.value.toLocaleString()}</div>` : '<div></div>'}
                  <span class="badge ${STAGE_BADGE[stage]}">${STAGE_LABEL[stage]}</span>
                </div>
              </div>`).join('')
            : '<div style="padding:1rem 0.8rem;font-size:0.9rem;color:var(--forest-mid);font-style:italic">No contacts</div>'}
          </div>
        </div>`;
      }).join('') + '</div>';
  }

  function renderListCRM(data) {
    if (!data.length) {
      document.getElementById('crm-list').innerHTML = '<div class="contact-grid"><div class="crm-empty">No contacts match your search.</div></div>';
      return;
    }
    document.getElementById('crm-list').innerHTML = '<div class="contact-grid">' +
      data.map(c => `
        <div class="contact-grid-card" onclick="openContact(${c.id})">
          <div class="cg-top">
            <div class="cg-avatar">${c.headshot ? `<img src="${c.headshot}" alt="">` : initials(c)}</div>
            <div>
              <div class="cg-name">${c.firstName} ${c.lastName}</div>
              <div class="cg-sub">${[c.title, c.organization].filter(Boolean).join(' · ')}</div>
              <span class="badge ${STAGE_BADGE[c.stage]}">${STAGE_LABEL[c.stage]}</span>
            </div>
          </div>
          ${c.email    ? `<div class="cg-line"><span class="cg-lbl">Email</span><span>${c.email}</span></div>` : ''}
          ${c.phone    ? `<div class="cg-line"><span class="cg-lbl">Phone</span><span>${c.phone}</span></div>` : ''}
          ${c.city     ? `<div class="cg-line"><span class="cg-lbl">City</span><span>${c.city}, ${c.state}</span></div>` : ''}
          ${c.tags?.length ? `<div class="cg-line"><span class="cg-lbl">Tags</span><span style="font-style:italic;color:var(--forest-mid)">${c.tags.join(', ')}</span></div>` : ''}
          <div class="cg-footer">
            <div class="cg-stars">${stars(c.ranking)}</div>
            <div class="cg-val">$${c.value.toLocaleString()}</div>
          </div>
        </div>`).join('') + '</div>';
  }

  // ── CONTACT DETAIL ───────────────────────────────────
  function openContact(id) {
    const c = loadContacts().find(x => x.id === id);
    if (!c) return;
    const overlay = document.getElementById('contact-detail-overlay');
    overlay.dataset.contactId = id;
    const socialLinks = [
      c.website  && `<a href="${c.website}" target="_blank" class="cm-social-btn">Website</a>`,
      c.linkedin && `<a href="${c.linkedin}" target="_blank" class="cm-social-btn">LinkedIn</a>`,
      c.twitter  && `<a href="https://twitter.com/${c.twitter.replace('@','')}" target="_blank" class="cm-social-btn">Twitter</a>`,
      c.instagram && `<a href="https://instagram.com/${c.instagram.replace('@','')}" target="_blank" class="cm-social-btn">Instagram</a>`,
      c.facebook && `<a href="${c.facebook}" target="_blank" class="cm-social-btn">Facebook</a>`,
    ].filter(Boolean).join('');

    // Backward compatibility: handle both old (c.headshot) and new (c.media.headshot) structures
    const headshot = c.media?.headshot || c.headshot || '';
    const businessCard = c.media?.businessCard || '';
    const noteCard = c.media?.noteCard || '';

    document.getElementById('contact-detail-body').innerHTML = `
      <div class="contact-modal">
        <div class="cm-left">
          <div class="cm-avatar" onclick="triggerHeadshotUpload('${c.id}')" title="Click to upload photo">
            ${headshot ? `<img src="${headshot}" alt="">` : initials(c)}
            <div class="cm-avatar-overlay">📷</div>
          </div>
          <input type="file" id="headshot-input-${c.id}" accept="image/*" style="display:none" onchange="handleHeadshotUpload(event,'${c.id}')">
          <div class="cm-name">${c.firstName} ${c.lastName}</div>
          ${c.title ? `<div class="cm-ttl">${c.title}</div>` : ''}
          <div class="cm-org">${c.organization}</div>
          <div class="cm-stars-display" title="Ranking">${stars(c.ranking, true)}</div>
          <span class="badge ${STAGE_BADGE[c.stage]}">${STAGE_LABEL[c.stage]}</span>
          ${c.tags?.length ? `<div class="cm-tags">${c.tags.map(t=>`<span class="cm-tag">${t}</span>`).join('')}</div>` : ''}
          ${businessCard || noteCard ? `
          <div style="margin-top:1.2rem;display:flex;gap:0.5rem;flex-wrap:wrap">
            ${businessCard ? `<div title="Business Card" style="width:50px;height:32px;background:var(--forest-mid);border-radius:2px;overflow:hidden;background-image:url(${businessCard});background-size:cover;background-position:center;cursor:pointer" onclick="alert('Business Card image')"></div>` : ''}
            ${noteCard ? `<div title="Note Card" style="width:50px;height:32px;background:var(--gold);border-radius:2px;overflow:hidden;background-image:url(${noteCard});background-size:cover;background-position:center;cursor:pointer" onclick="alert('Note Card image')"></div>` : ''}
          </div>
          ` : ''}
          ${(c.nextAction) ? `
          <div style="margin-top:1rem;padding:0.7rem 0.8rem;background:#FFFBF0;border:1px solid #E8D87A;border-left:3px solid var(--gold);border-radius:2px">
            <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:0.3rem">Next Action</div>
            <div style="font-size:0.84rem;color:var(--charcoal);font-weight:600;line-height:1.4">${c.nextAction}</div>
            ${c.nextActionDue ? `<div style="font-size:0.75rem;color:var(--forest-mid);margin-top:0.2rem">Due ${c.nextActionDue}${daysSince(c.nextActionDue) < 0 ? '' : daysSince(c.nextActionDue) <= 2 ? ' <span style="color:#c0392b;font-weight:700">— Overdue</span>' : ''}</div>` : ''}
          </div>` : ''}
          <div class="cm-meta-foot">
            Last contacted<br>${c.lastContacted || '—'}<br><br>
            Added<br>${c.createdAt || '—'}
          </div>
        </div>
        <div class="cm-right">
          <div>
            <div class="cm-section-lbl">Contact Info</div>
            ${c.email   ? `<div class="cm-field"><span class="cm-field-lbl">Email</span><span class="cm-field-val"><a href="mailto:${c.email}">${c.email}</a></span></div>` : ''}
            ${c.phone   ? `<div class="cm-field"><span class="cm-field-lbl">Phone</span><span class="cm-field-val"><a href="tel:${c.phone}">${c.phone}</a></span></div>` : ''}
            ${c.address ? `<div class="cm-field"><span class="cm-field-lbl">Address</span><span class="cm-field-val">${c.address}${c.city?', '+c.city:''}${c.state?', '+c.state:''} ${c.zip||''}</span></div>` : ''}
            <div class="cm-field"><span class="cm-field-lbl">Value</span><span class="cm-field-val">$${c.value.toLocaleString()}</span></div>
          </div>
          ${socialLinks ? `<div><div class="cm-section-lbl">Links & Socials</div><div class="cm-socials">${socialLinks}</div></div>` : ''}
          ${c.notes ? `<div><div class="cm-section-lbl">Notes</div><div class="cm-notes-box">${c.notes}</div></div>` : ''}
          ${c.otterTranscripts && c.otterTranscripts.length > 0 ? `
          <div>
            <div class="cm-section-lbl">Call Transcripts (${c.otterTranscripts.length})</div>
            <div style="max-height:200px;overflow-y:auto;background:var(--cream);border:0.5px solid var(--gold);border-radius:3px;padding:0.8rem">
              ${c.otterTranscripts.map((t, i) => `
              <div style="margin-bottom:0.8rem;padding-bottom:0.8rem;border-bottom:0.5px solid var(--gold)">
                <div style="font-size:0.9rem;color:var(--forest-mid);margin-bottom:0.3rem">${t.date} ${t.duration ? ' &bull; ' + t.duration : ''}${t.otterLink ? ' &bull; <a href="'+t.otterLink+'" target="_blank" style="color:var(--gold-deep)">Otter Link</a>' : ''}</div>
                <div style="font-size:0.8rem;color:var(--forest);line-height:1.4">${(t.notes || '').substring(0, 150)}${(t.notes || '').length > 150 ? '...' : ''}</div>
                ${t.transcript ? '<details style="margin-top:0.4rem"><summary style="font-size:0.78rem;cursor:pointer;color:var(--forest-mid)">View full transcript</summary><pre style="font-size:0.75rem;white-space:pre-wrap;margin-top:0.3rem;max-height:200px;overflow-y:auto;background:var(--ivory);padding:0.5rem;border-radius:2px">' + t.transcript.replace(/</g,'&lt;').substring(0,2000) + '</pre></details>' : ''}
              </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
          <div class="cm-actions">
            <button type="button" class="btn-cm-secondary" onclick="openAddTranscriptModal(${c.id})">+ Add Transcript</button>
            <button type="button" class="btn-cm-secondary" onclick="openAddInvoiceModal(${c.id})">+ Invoice</button>
            <button type="button" class="btn-cm-secondary" onclick="createCampaignFromContact(${c.id})">+ Campaign</button>
            <button class="btn-cm-secondary" onclick="editContact(${c.id})">Edit</button>
            <button class="btn-cm-secondary" onclick="cycleContactStage(${c.id})">Move Stage →</button>
            <button class="btn-cm-secondary" onclick="deleteContact(${c.id})">Remove</button>
            <button class="btn-cm-primary" onclick="closeContact()">Close</button>
          </div>
        </div>
      </div>`;
    overlay.classList.add('visible');
  }

  function closeContact() {
    document.getElementById('contact-detail-overlay').classList.remove('visible');
  }

  function cycleContactStage(id) {
    const data = loadContacts();
    const c = data.find(x => x.id === id);
    if (!c) return;
    const cycle = ['new','warm','active','closed'];
    c.stage = cycle[(cycle.indexOf(c.stage) + 1) % cycle.length];
    saveContacts(data);
    renderCRM();
    openContact(id);
  }

  function deleteContact(id) {
    if (!confirm('Remove this contact?')) return;
    saveContacts(loadContacts().filter(c => c.id !== id));
    closeContact();
    renderCRM();
  }

  function editContact(id) {
    const c = loadContacts().find(x => x.id === id);
    if (!c) return;
    const v = val => (val || '').replace(/"/g, '&quot;');
    document.getElementById('contact-detail-body').innerHTML = `
      <div class="contact-modal" style="grid-template-columns:1fr;max-width:720px">
        <div style="padding:2rem 2.5rem;overflow-y:auto;max-height:90vh">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:0.5px solid var(--gold)">
            <div class="cm-name" style="margin:0">${c.firstName} ${c.lastName}</div>
            <div style="font-size:0.85rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold)">Editing</div>
          </div>
          <form onsubmit="saveContactEdit(event,${id})">
            <div class="cm-section-lbl">Name & Role</div>
            <div class="modal-row">
              <div><label class="form-label">First Name</label><input class="form-input" name="firstName" value="${v(c.firstName)}" required></div>
              <div><label class="form-label">Last Name</label><input class="form-input" name="lastName" value="${v(c.lastName)}" required></div>
            </div>
            <div class="modal-row">
              <div><label class="form-label">Organization</label><input class="form-input" name="organization" value="${v(c.organization)}"></div>
              <div><label class="form-label">Title</label><input class="form-input" name="title" value="${v(c.title)}"></div>
            </div>

            <div class="cm-section-lbl" style="margin-top:1.4rem">Contact Info</div>
            <div class="modal-row">
              <div><label class="form-label">Email</label><input class="form-input" name="email" type="email" value="${v(c.email)}"></div>
              <div><label class="form-label">Phone</label><input class="form-input" name="phone" value="${v(c.phone)}"></div>
            </div>
            <div class="modal-row">
              <div><label class="form-label">Address</label><input class="form-input" name="address" value="${v(c.address)}"></div>
              <div><label class="form-label">City</label><input class="form-input" name="city" value="${v(c.city)}"></div>
            </div>
            <div class="modal-row">
              <div><label class="form-label">State</label><input class="form-input" name="state" value="${v(c.state)}"></div>
              <div><label class="form-label">ZIP</label><input class="form-input" name="zip" value="${v(c.zip)}"></div>
            </div>

            <div class="cm-section-lbl" style="margin-top:1.4rem">Pipeline</div>
            <div class="modal-row" style="grid-template-columns:1fr 1fr 1fr">
              <div>
                <label class="form-label">Stage</label>
                <select class="form-select" name="stage">
                  ${['new','warm','active','closed'].map(s=>`<option value="${s}"${c.stage===s?' selected':''}>${STAGE_LABEL[s]}</option>`).join('')}
                </select>
              </div>
              <div><label class="form-label">Value ($)</label><input class="form-input" name="value" type="number" min="0" value="${c.value}"></div>
              <div>
                <label class="form-label">Ranking</label>
                <select class="form-select" name="ranking">
                  ${[1,2,3,4,5].map(n=>`<option value="${n}"${c.ranking===n?' selected':''}>${'★'.repeat(n)}</option>`).join('')}
                </select>
              </div>
            </div>
            <div class="modal-row">
              <div><label class="form-label">Last Contacted</label><input class="form-input" name="lastContacted" type="date" value="${v(c.lastContacted)}"></div>
              <div>
                <label class="form-label">Headshot</label>
                <div style="display:flex;gap:0.6rem;align-items:center">
                  <div id="edit-headshot-preview" style="width:42px;height:42px;background:var(--forest);color:var(--ivory);display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:700;flex-shrink:0;overflow:hidden">
                    ${c.headshot ? `<img src="${c.headshot}" style="width:100%;height:100%;object-fit:cover">` : initials(c)}
                  </div>
                  <label style="flex:1;cursor:pointer">
                    <input type="file" accept="image/*" style="display:none" onchange="previewHeadshot(event,'edit-headshot-preview','edit-headshot-data')">
                    <div class="form-input" style="cursor:pointer;font-size:0.92rem;color:var(--forest-mid);text-align:center;padding:0.5rem">Upload photo</div>
                  </label>
                </div>
                <input type="hidden" name="headshot" id="edit-headshot-data" value="${v(c.headshot)}">
              </div>
            </div>

            <div class="cm-section-lbl" style="margin-top:1.4rem">Links & Socials</div>
            <div class="modal-row">
              <div><label class="form-label">Website</label><input class="form-input" name="website" value="${v(c.website)}"></div>
              <div><label class="form-label">LinkedIn</label><input class="form-input" name="linkedin" value="${v(c.linkedin)}"></div>
            </div>
            <div class="modal-row" style="grid-template-columns:1fr 1fr 1fr">
              <div><label class="form-label">Twitter / X</label><input class="form-input" name="twitter" value="${v(c.twitter)}"></div>
              <div><label class="form-label">Instagram</label><input class="form-input" name="instagram" value="${v(c.instagram)}"></div>
              <div><label class="form-label">Facebook</label><input class="form-input" name="facebook" value="${v(c.facebook)}"></div>
            </div>

            <div class="cm-section-lbl" style="margin-top:1.4rem">Next Action</div>
            <div class="modal-row">
              <div><label class="form-label">Next Action</label><input class="form-input" name="nextAction" value="${v(c.nextAction)}"></div>
              <div><label class="form-label">Due Date</label><input class="form-input" name="nextActionDue" type="date" value="${v(c.nextActionDue)}"></div>
            </div>

            <div class="cm-section-lbl" style="margin-top:1.4rem">Tags & Notes</div>
            <label class="form-label">Tags <span style="font-weight:700;text-transform:none;letter-spacing:0;color:var(--forest-mid);font-size:0.85rem">(comma-separated)</span></label>
            <input class="form-input" name="tags" value="${v((c.tags||[]).join(', '))}">
            <label class="form-label">Notes</label>
            <textarea class="form-textarea" name="notes" style="min-height:90px">${c.notes||''}</textarea>

            <div class="cm-actions" style="margin-top:1.4rem">
              <button type="submit" class="btn-cm-primary" style="padding:0.6rem 1.8rem">Save Changes</button>
              <button type="button" class="btn-cm-secondary" onclick="openContact(${id})">Cancel</button>
            </div>
          </form>
        </div>
      </div>`;
  }

  function previewHeadshot(event, previewId, dataId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      const data = e.target.result;
      const preview = document.getElementById(previewId);
      if (preview) preview.innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover">`;
      const hidden = document.getElementById(dataId);
      if (hidden) hidden.value = data;
    };
    reader.readAsDataURL(file);
  }

  function saveContactEdit(e, id) {
    e.preventDefault();
    const f = e.target;
    const data = loadContacts();
    const idx = data.findIndex(x => x.id === id);
    if (idx === -1) return;
    Object.assign(data[idx], {
      firstName:    f.firstName.value,
      lastName:     f.lastName.value,
      organization: f.organization.value,
      title:        f.title.value,
      email:        f.email.value,
      phone:        f.phone.value,
      address:      f.address.value,
      city:         f.city.value,
      state:        f.state.value,
      zip:          f.zip.value,
      stage:        f.stage.value,
      value:        parseFloat(f.value.value) || 0,
      ranking:      parseInt(f.ranking.value) || 3,
      lastContacted: f.lastContacted.value,
      headshot:     f.headshot.value,
      website:      f.website.value,
      linkedin:     f.linkedin.value,
      twitter:      f.twitter.value,
      instagram:    f.instagram.value,
      facebook:     f.facebook.value,
      tags:         f.tags.value.split(',').map(t=>t.trim()).filter(Boolean),
      notes:        f.notes.value,
      nextAction:   f.nextAction.value,
      nextActionDue: f.nextActionDue.value
    });
    saveContacts(data);
    renderCRM();
    openContact(id);
  }

  // ── ADD CONTACT ──────────────────────────────────────
  function openAddContact() {
    document.getElementById('add-contact-modal').style.display = 'flex';
  }
  function closeAddContact() {
    document.getElementById('add-contact-modal').style.display = 'none';
    document.getElementById('add-contact-form').reset();
    document.getElementById('add-headshot-data').value = '';
    document.getElementById('add-headshot-preview').innerHTML = '?';
    document.getElementById('add-business-card-data').value = '';
    document.getElementById('add-business-card-preview').innerHTML = 'Card';
    document.getElementById('add-note-card-data').value = '';
    document.getElementById('add-note-card-preview').innerHTML = 'Note';
  }

  // ── MEDIA HANDLING ───────────────────────────────────
  function previewMedia(event, previewId, dataId) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById(dataId).value = e.target.result;
      const preview = document.getElementById(previewId);
      const img = new Image();
      img.onload = function() {
        preview.style.backgroundImage = `url(${e.target.result})`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
        preview.innerHTML = '';
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── OTTER TRANSCRIPT FUNCTIONS ────────────────────────
  function openAddTranscriptModal(contactId) {
    const form = document.getElementById('add-transcript-form');
    form.dataset.contactId = contactId;
    form.date.valueAsDate = new Date();
    form.otterLink.value = '';
    form.transcript.value = '';
    form.duration.value = '';
    document.getElementById('add-transcript-modal').style.display = 'flex';
  }

  function closeAddTranscriptModal() {
    document.getElementById('add-transcript-modal').style.display = 'none';
  }

  function parseTranscriptNotes(transcriptText) {
    // Extract speaker turns and timestamps, create summary of key points
    const lines = transcriptText.split('\n').filter(l => l.trim());
    const summary = lines.slice(0, 5).map(l => l.replace(/^\d+:?\d*\s*/, '').trim()).join(' ').substring(0, 200);
    return summary || 'Transcript recorded.';
  }

  function saveTranscript(e) {
    e.preventDefault();
    const form = e.target;
    const contactId = parseInt(form.dataset.contactId);
    const data = loadContacts();
    const contact = data.find(c => c.id === contactId);
    if (!contact) return;

    const transcriptData = {
      date: form.date.value,
      otterLink: form.otterLink.value || '',
      duration: form.duration.value || '',
      transcript: form.transcript.value,
      notes: parseTranscriptNotes(form.transcript.value),
      createdAt: new Date().toISOString()
    };

    if (!contact.otterTranscripts) contact.otterTranscripts = [];
    contact.otterTranscripts.push(transcriptData);
    saveContacts(data);
    closeAddTranscriptModal();
    openContact(contactId);
  }

  // ── INVOICE FUNCTIONS ──────────────────────────────
  function openAddInvoiceModal(contactId) {
    const form = document.getElementById('add-invoice-form');
    form.dataset.contactId = contactId;
    form.date.valueAsDate = new Date();
    form.dueDate.valueAsDate = new Date(Date.now() + 30*24*60*60*1000); // 30 days
    form.amount.value = '';
    form.notes.value = '';
    form.status.value = 'Pending';

    // Populate client dropdown
    const contacts = loadContacts();
    const contact = contacts.find(c => c.id === contactId);
    const clientSelect = form.clientId;
    clientSelect.innerHTML = `<option value="${contactId}">${contact?.firstName} ${contact?.lastName}</option>`;
    clientSelect.value = contactId;

    // Populate campaign dropdown
    const campaigns = loadCampaigns();
    const projectSelect = form.projectId;
    projectSelect.innerHTML = '<option value="">— No Campaign</option>' +
      campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

    document.getElementById('add-invoice-modal').style.display = 'flex';
  }

  function closeAddInvoiceModal() {
    document.getElementById('add-invoice-modal').style.display = 'none';
  }

  function submitInvoice(e) {
    e.preventDefault();
    const f = e.target;
    const invoices = loadInvoices();
    invoices.push({
      id: Math.max(0, ...invoices.map(i=>i.id)) + 1,
      clientId: parseInt(f.clientId.value),
      projectId: f.projectId.value ? parseInt(f.projectId.value) : null,
      amount: parseFloat(f.amount.value),
      date: f.date.value,
      dueDate: f.dueDate.value,
      status: f.status.value,
      paymentDate: null,
      paymentMethod: f.paymentMethod.value || null,
      qbId: null,
      notes: f.notes.value,
      createdAt: new Date().toISOString().split('T')[0]
    });
    saveInvoices(invoices);
    closeAddInvoiceModal();
    renderInvoices();
  }

  function submitContact(e) {
    e.preventDefault();
    const f = e.target;
    const data = loadContacts();
    data.push({
      id: Math.max(0, ...data.map(c=>c.id)) + 1,
      firstName: f.firstName.value,
      lastName:  f.lastName.value,
      email:     f.email.value,
      phone:     f.phone.value,
      address:   f.address.value,
      city:      f.city.value,
      state:     f.state.value,
      zip:       f.zip.value,
      organization: f.organization.value,
      title:     f.title.value,
      stage:     f.stage.value,
      value:     parseFloat(f.value.value) || 0,
      ranking:   parseInt(f.ranking.value) || 3,
      media: {
        headshot: f.headshot.value,
        businessCard: f.businessCard.value,
        noteCard: f.noteCard.value
      },
      otterTranscripts: [],
      notes:     f.notes.value,
      website:   f.website.value,
      linkedin:  f.linkedin.value,
      twitter:   f.twitter.value,
      instagram: f.instagram.value,
      facebook:  f.facebook.value,
      lastContacted: new Date().toISOString().split('T')[0],
      tags: f.tags.value.split(',').map(t=>t.trim()).filter(Boolean),
      createdAt: new Date().toISOString().split('T')[0]
    });
    saveContacts(data);
    renderCRM();
    closeAddContact();
  }

  // ── LABOR TRACKING FUNCTIONS (Operations) ───────────────
  let laborViewMode = 'month'; // total | month | week | day
  let selectedContractor = null; // null = show all, string = filter by name

  function filterByContractor(name) {
    selectedContractor = (selectedContractor === name) ? null : name;
    renderOperations();
  }

  function cycleLaborView() {
    const modes = ['total', 'month', 'week', 'day'];
    const idx = modes.indexOf(laborViewMode);
    laborViewMode = modes[(idx + 1) % modes.length];
    renderOperations();
  }

  function openAddLaborModal() {
    const form = document.getElementById('add-labor-form');
    form.date.valueAsDate = new Date();
    form.hours.value = '';
    form.notes.value = '';
    form.category.value = 'Billable';
    form.activity.value = 'Strategy';

    // Auto-fill rate from stored contractor rates
    const rates = loadContractorRates();
    const defaultContractor = form.contractor.value || 'Nicole Feenstra';
    const rateInput = document.getElementById('labor-hourly-rate');
    if (rateInput && rates[defaultContractor]) {
      rateInput.value = rates[defaultContractor];
    }

    // Close rates panel if open
    closeManageRatesPanel();

    // Populate project dropdown with campaigns (campaigns are the projects now)
    const campaigns = loadCampaigns();
    const projectSelect = form.projectId;
    projectSelect.innerHTML = '<option value="">— Select Campaign</option>' +
      campaigns.map(c => `<option value="${c.id}">${c.client} — ${c.name}</option>`).join('');

    // Populate campaign dropdown
    const campaignSelect = form.campaignId;
    campaignSelect.innerHTML = '<option value="">— No Campaign</option>' +
      campaigns.map(c => `<option value="${c.id}">${c.client} — ${c.name}</option>`).join('');

    document.getElementById('add-labor-modal').style.display = 'flex';
  }

  function closeAddLaborModal() {
    document.getElementById('add-labor-modal').style.display = 'none';
  }

  function submitLabor(e) {
    e.preventDefault();
    const f = e.target;
    const labor = loadLaborTracking();
    labor.push({
      id: Math.max(0, ...labor.map(l=>l.id)) + 1,
      userId: 1,
      contractor: f.contractor.value || 'Nicole Feenstra',
      projectId: f.projectId.value ? parseInt(f.projectId.value) : null,
      clientId: null,
      campaignId: f.campaignId.value ? parseInt(f.campaignId.value) : null,
      activity: f.activity.value,
      date: f.date.value,
      hours: parseFloat(f.hours.value),
      hourlyRate: parseInt(f.hourlyRate.value) || 150,
      category: f.category.value,
      notes: f.notes.value,
      approved: true,
      createdAt: f.date.value
    });
    saveLaborTracking(labor);
    closeAddLaborModal();
    renderOperations();
  }

  // Project modal stubs removed — Projects are now Campaign Activities

  // ── RENDER OPERATIONS TAB ────────────────────────────────
  let opsView = 'list'; // 'list' | 'kanban' | 'gantt'

  function switchOpsView(view) {
    opsView = view;
    const btnList = document.getElementById('ops-view-list-btn');
    const btnKanban = document.getElementById('ops-view-kanban-btn');
    const btnGantt = document.getElementById('ops-view-gantt-btn');
    if (btnList) btnList.classList.toggle('active', view === 'list');
    if (btnKanban) btnKanban.classList.toggle('active', view === 'kanban');
    if (btnGantt) btnGantt.classList.toggle('active', view === 'gantt');
    renderCampaignActivities();
  }

  function renderOperations() {
    renderRoster();
    renderLaborTracking();
    renderCampaignActivities();
    renderTeamAvailability();
    renderPayroll();
    renderBillableInvoicing();
  }

  function renderLaborTracking() {
    const laborTable = document.getElementById('labor-table');
    const monthHoursDiv = document.getElementById('labor-month-hours');
    const periodLabel = document.getElementById('labor-period-label');

    if (!laborTable) return;

    const labor = loadLaborTracking();
    const campaigns = loadCampaigns();
    const now = new Date();

    // Populate campaign filter dropdown
    const campaignFilter = document.getElementById('labor-campaign-filter');
    if (campaignFilter) {
      const prevVal = campaignFilter.value;
      campaignFilter.innerHTML = '<option value="">All Campaigns</option>' +
        campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      campaignFilter.value = prevVal;
    }

    // Populate ops-campaign-filter
    const opsCampFilter = document.getElementById('ops-campaign-filter');
    if (opsCampFilter) {
      const prevVal = opsCampFilter.value;
      opsCampFilter.innerHTML = '<option value="">All Campaigns</option>' +
        campaigns.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
      opsCampFilter.value = prevVal;
    }

    // Filter by time period
    let filtered = [...labor];
    const labels = { total: 'All Time', month: 'This Month', week: 'This Week', day: 'Today' };
    if (periodLabel) periodLabel.textContent = labels[laborViewMode] || 'This Month';

    if (laborViewMode === 'month') {
      const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
      filtered = filtered.filter(l => l.date.startsWith(ym));
    } else if (laborViewMode === 'week') {
      const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay());
      const ws = weekStart.toISOString().split('T')[0];
      filtered = filtered.filter(l => l.date >= ws);
    } else if (laborViewMode === 'day') {
      const today = now.toISOString().split('T')[0];
      filtered = filtered.filter(l => l.date === today);
    }

    const campVal = document.getElementById('labor-campaign-filter')?.value;
    if (campVal) filtered = filtered.filter(l => l.campaignId === parseInt(campVal));

    const actVal = document.getElementById('labor-activity-filter')?.value;
    if (actVal) filtered = filtered.filter(l => l.activity === actVal);

    const totalHours = filtered.reduce((sum, l) => sum + l.hours, 0);
    if (monthHoursDiv) monthHoursDiv.textContent = totalHours;

    const byContractor = {};
    filtered.forEach(l => {
      const name = l.contractor || 'Unassigned';
      if (!byContractor[name]) byContractor[name] = { hours: 0, cost: 0, entries: 0 };
      byContractor[name].hours += l.hours;
      byContractor[name].cost += l.hours * l.hourlyRate;
      byContractor[name].entries++;
    });

    const contractorCards = Object.entries(byContractor).map(([name, d]) => {
      const isSelected = selectedContractor === name;
      const bg = isSelected ? 'var(--forest)' : 'var(--white)';
      const textColor = isSelected ? 'var(--ivory)' : 'var(--forest)';
      const subColor = isSelected ? 'var(--parchment)' : 'var(--forest-mid)';
      const borderColor = isSelected ? 'var(--forest)' : 'var(--parchment)';
      return `<div onclick="filterByContractor('${name.replace(/'/g, "\\'")}')" style="background:${bg};border:1px solid ${borderColor};padding:0.8rem 1rem;border-radius:3px;cursor:pointer;transition:all 200ms ease">
        <div style="font-size:0.9rem;color:${subColor};margin-bottom:0.2rem">${name}</div>
        <div style="font-size:1.1rem;font-weight:700;color:${textColor}">${d.hours}h</div>
        <div style="font-size:0.92rem;color:var(--gold)">$${d.cost.toLocaleString()} · ${d.entries} entries</div>
      </div>`;
    }).join('');

    let tableFiltered = selectedContractor
      ? filtered.filter(l => (l.contractor || 'Unassigned') === selectedContractor)
      : filtered;

    const thStyle = 'text-align:left;padding:8px;color:var(--forest-mid);font-weight:700;font-size:0.9rem;text-transform:uppercase;letter-spacing:0.05em';
    const tdStyle = 'padding:8px;border-bottom:1px solid var(--parchment);font-size:0.85rem';
    const tableHours = tableFiltered.reduce((sum, l) => sum + l.hours, 0);
    const tableCost = tableFiltered.reduce((sum, l) => sum + (l.hours * l.hourlyRate), 0);

    const laborHTML = tableFiltered.length > 0
      ? tableFiltered.sort((a, b) => b.date.localeCompare(a.date)).map(l => {
          const camp = campaigns.find(c => c.id === l.campaignId);
          return `<tr>
            <td style="${tdStyle}">${l.contractor || '—'}</td>
            <td style="${tdStyle}">${l.date}</td>
            <td style="${tdStyle};font-weight:700">${l.hours}h</td>
            <td style="${tdStyle}">${camp ? camp.client : '—'}</td>
            <td style="${tdStyle}">${camp ? camp.name : '—'}</td>
            <td style="${tdStyle}"><span style="font-size:0.92rem;padding:2px 8px;background:var(--ivory);border-radius:2px">${l.activity || '—'}</span></td>
            <td style="${tdStyle};color:var(--gold);font-weight:700">$${(l.hours * l.hourlyRate).toLocaleString()}</td>
            <td style="${tdStyle};font-size:0.85rem;color:var(--forest-mid)">${l.notes}</td>
          </tr>`;
        }).join('')
      : `<tr><td colspan="8" style="text-align:center;color:#aaa;padding:20px">${selectedContractor ? 'No entries for ' + selectedContractor + ' in this period' : 'No hours logged for this period'}</td></tr>`;

    const filterLabel = selectedContractor
      ? `<span style="background:var(--forest);color:var(--ivory);padding:0.2rem 0.6rem;border-radius:2px;font-size:0.85rem;cursor:pointer" onclick="filterByContractor('${selectedContractor.replace(/'/g, "\\'")}')">Showing: ${selectedContractor} ✕</span>`
      : '<span style="font-size:0.85rem;color:var(--forest-mid);font-style:italic">Click a contractor to drill down</span>';

    laborTable.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:0.6rem;margin-bottom:1.2rem">${contractorCards}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem">
        <div style="font-size:0.92rem;color:var(--forest-mid);font-weight:700">${tableFiltered.length} entries · ${tableHours}h · $${tableCost.toLocaleString()} total</div>
        <div>${filterLabel}</div>
      </div>
      <div style="overflow-x:auto">
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse">
        <tr style="border-bottom:2px solid var(--parchment);background:var(--cream)">
          <th style="${thStyle}">Who</th>
          <th style="${thStyle}">Date</th>
          <th style="${thStyle}">Hours</th>
          <th style="${thStyle}">Client</th>
          <th style="${thStyle}">Campaign</th>
          <th style="${thStyle}">Activity</th>
          <th style="${thStyle}">Cost</th>
          <th style="${thStyle}">Notes</th>
        </tr>
        ${laborHTML}
      </table>
      </div>
    `;
  }

  // ── CAMPAIGN ACTIVITIES RENDERER ────────────────────────
  function renderCampaignActivities() {
    const panel = document.getElementById('ops-activities-panel');
    if (!panel) return;

    const allCampaigns = loadCampaigns();
    const filterVal = document.getElementById('ops-campaign-filter')?.value || '';
    const campaigns = filterVal
      ? allCampaigns.filter(c => String(c.id) === filterVal)
      : allCampaigns;

    if (opsView === 'kanban') {
      panel.innerHTML = renderActivitiesKanban(campaigns);
    } else if (opsView === 'gantt') {
      panel.innerHTML = renderActivitiesGantt(campaigns);
    } else {
      panel.innerHTML = renderActivitiesList(campaigns);
    }
  }

  function activityStatusBadge(status) {
    const map = {
      'not-started': {bg:'var(--parchment)',color:'var(--charcoal)',label:'Not Started'},
      'in-progress':  {bg:'var(--gold)',color:'var(--white)',label:'In Progress'},
      'review':       {bg:'var(--forest-mid)',color:'var(--ivory)',label:'Review'},
      'done':         {bg:'#2d6a4f',color:'var(--ivory)',label:'Done'}
    };
    const s = map[status] || map['not-started'];
    return `<span style="font-size:0.78rem;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;background:${s.bg};color:${s.color};padding:2px 7px;border-radius:2px">${s.label}</span>`;
  }

  function phaseBadge(phase) {
    const colors = {kickoff:'var(--forest-mid)',strategy:'#7a8f6b',execution:'var(--gold)',review:'#c4932a',complete:'#2d6a4f'};
    const color = colors[phase] || 'var(--forest-mid)';
    return `<span style="font-size:0.78rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${color};background:var(--cream);border:1px solid ${color};padding:2px 8px;border-radius:2px">${(phase||'kickoff').charAt(0).toUpperCase()+(phase||'kickoff').slice(1)}</span>`;
  }

  function renderActivitiesList(campaigns) {
    if (!campaigns.length) return '<div style="padding:2rem;text-align:center;color:var(--forest-mid);font-style:italic">No campaigns found.</div>';
    const thStyle = 'text-align:left;padding:7px 10px;color:var(--forest-mid);font-weight:700;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.05em;background:var(--cream)';
    const tdStyle = 'padding:7px 10px;border-bottom:0.5px solid var(--parchment);font-size:0.85rem';

    return campaigns.map(c => {
      const acts = c.activities || [];
      const done = acts.filter(a => a.status === 'done').length;
      const ms = c.milestones || [];
      const msDoneCount = ms.filter(m => m.status === 'complete').length;
      const msBar = ms.length
        ? `<div style="display:flex;gap:2px;margin-left:0.8rem">${ms.map(m => {
            const col = m.status === 'complete' ? 'var(--forest)' : m.status === 'in-progress' ? 'var(--gold)' : 'var(--parchment)';
            return `<div title="${m.name}" style="width:22px;height:5px;background:${col};border-radius:1px"></div>`;
          }).join('')}</div>`
        : '';

      return `<div style="margin-bottom:1rem;border:1px solid var(--parchment);border-radius:3px;overflow:hidden">
        <div onclick="toggleActivitiesSection(${c.id})" style="display:flex;align-items:center;justify-content:space-between;padding:0.8rem 1rem;background:var(--white);cursor:pointer;border-bottom:1px solid var(--parchment)">
          <div style="display:flex;align-items:center;gap:0.8rem;flex-wrap:wrap">
            <span id="acts-arrow-${c.id}" style="font-size:0.7rem;color:var(--forest-mid)">&#9654;</span>
            <span style="font-size:0.95rem;font-weight:700;color:var(--forest)">${c.name}</span>
            <span style="font-size:0.85rem;color:var(--forest-mid)">${c.client}</span>
            ${phaseBadge(c.phase)}
            ${msBar}
          </div>
          <div style="display:flex;align-items:center;gap:0.8rem">
            <span style="font-size:0.82rem;color:var(--forest-mid)">${done}/${acts.length} done</span>
          </div>
        </div>
        <div id="acts-body-${c.id}" style="display:none">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <th style="${thStyle}">Activity</th>
              <th style="${thStyle}">Assignee</th>
              <th style="${thStyle}">Category</th>
              <th style="${thStyle}">Status</th>
              <th style="${thStyle}">Due Date</th>
              <th style="${thStyle}">Notes</th>
            </tr>
            ${acts.length ? acts.map(a => {
              const tw = a.teamWork || [];
              const mainWorker = tw.length ? tw[0] : null;
              const progPct = mainWorker ? mainWorker.progress : (a.status === 'done' ? 100 : 0);
              const progColor = progPct === 100 ? '#27AE60' : progPct > 0 ? 'var(--gold)' : 'var(--parchment)';
              const workerHtml = tw.length > 0 ? tw.map(w => `<div style="display:flex;align-items:center;gap:0.3rem;margin-top:0.2rem">
                <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${w.progress===100?'#27AE60':w.progress>0?'var(--gold)':'#ccc'}"></span>
                <span style="font-size:0.76rem;font-weight:600;color:var(--forest)">${w.name.split(' ')[0]}</span>
                <span style="font-size:0.68rem;color:var(--forest-mid)">${w.phase||''}</span>
                <span style="font-size:0.68rem;font-weight:700;color:${w.progress===100?'#27AE60':'var(--forest-mid)'}">${w.progress}%</span>
              </div>`).join('') : '';
              return `<tr>
              <td style="${tdStyle};font-weight:700;color:var(--forest)">${a.name}</td>
              <td style="${tdStyle}">${a.assignee||'—'}${workerHtml}</td>
              <td style="${tdStyle}"><span style="font-size:0.8rem;background:var(--ivory);padding:2px 6px;border-radius:2px">${a.category||'—'}</span></td>
              <td style="${tdStyle}">${activityStatusBadge(a.status)}</td>
              <td style="${tdStyle}">
                <div>${a.dueDate||'—'}</div>
                <div style="width:60px;height:3px;background:var(--parchment);border-radius:1px;margin-top:0.3rem"><div style="height:3px;width:${progPct}%;background:${progColor};border-radius:1px"></div></div>
                <div style="font-size:0.68rem;color:var(--forest-mid);margin-top:0.15rem">${progPct}% complete</div>
              </td>
              <td style="${tdStyle};color:var(--forest-mid);font-style:italic">${a.notes||''}</td>
            </tr>`;}).join('') : `<tr><td colspan="6" style="text-align:center;padding:1rem;color:#aaa">No activities yet.</td></tr>`}
          </table>
          <div style="padding:0.6rem 1rem;background:var(--ivory);border-top:1px solid var(--parchment)">
            <button onclick="addActivityInline(${c.id})" style="font-family:'DM Sans',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:transparent;color:var(--forest);border:1px solid var(--parchment);padding:0.3rem 0.8rem;cursor:pointer;transition:border-color 0.15s" onmouseover="this.style.borderColor='var(--forest)'" onmouseout="this.style.borderColor='var(--parchment)'">+ Add Activity</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  function toggleActivitiesSection(campaignId) {
    const body = document.getElementById('acts-body-' + campaignId);
    const arrow = document.getElementById('acts-arrow-' + campaignId);
    if (!body) return;
    const open = body.style.display !== 'none';
    body.style.display = open ? 'none' : '';
    if (arrow) arrow.innerHTML = open ? '&#9654;' : '&#9660;';
  }

  function addActivityInline(campaignId) {
    const name = prompt('Activity name:');
    if (!name) return;
    const assignee = prompt('Assignee (e.g. Nicole Feenstra):') || '';
    const category = prompt('Category (Strategy / Design / Development / Execution / Analytics / Reporting):') || 'Strategy';
    const dueDate = prompt('Due date (YYYY-MM-DD):') || '';
    const campaigns = loadCampaigns();
    const c = campaigns.find(x => x.id === campaignId);
    if (!c) return;
    if (!c.activities) c.activities = [];
    c.activities.push({
      id: Math.max(0, ...c.activities.map(a => a.id)) + 1,
      name, assignee, status: 'not-started', dueDate,
      notes: '', category
    });
    saveCampaigns(campaigns);
    renderCampaignActivities();
    // Re-open the section
    setTimeout(() => {
      const body = document.getElementById('acts-body-' + campaignId);
      if (body) body.style.display = '';
      const arrow = document.getElementById('acts-arrow-' + campaignId);
      if (arrow) arrow.innerHTML = '&#9660;';
    }, 50);
  }

  function renderActivitiesKanban(campaigns) {
    const phases = ['kickoff','strategy','execution','review','complete'];
    const phaseLabels = {kickoff:'Kickoff',strategy:'Strategy',execution:'Execution',review:'Review',complete:'Complete'};
    const phaseAccent = {kickoff:'var(--forest-mid)',strategy:'#7a8f6b',execution:'var(--gold)',review:'#c4932a',complete:'#2d6a4f'};

    const cols = phases.map(phase => {
      const cards = campaigns.filter(c => (c.phase || 'kickoff') === phase);
      const cardHTML = cards.length
        ? cards.map(c => {
            const acts = c.activities || [];
            const done = acts.filter(a => a.status === 'done').length;
            const total = acts.length;
            const pct = total ? Math.round((done/total)*100) : 0;
            const assignees = [...new Set(acts.map(a => a.assignee).filter(Boolean))];
            const chips = assignees.map(a => {
              const parts = a.trim().split(' ');
              const abbr = parts.length > 1 ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase() : a.substring(0,2).toUpperCase();
              return `<span class="kanban-chip" title="${a}">${abbr}</span>`;
            }).join('');
            const isFirst = phase === phases[0];
            const isLast = phase === phases[phases.length-1];
            return `<div class="kanban-card">
              <div class="kanban-card-name">${c.name}</div>
              <div class="kanban-card-client">${c.client}</div>
              ${chips ? `<div style="margin-bottom:0.3rem">${chips}</div>` : ''}
              <div class="kanban-progress-bar"><div class="kanban-progress-fill" style="width:${pct}%"></div></div>
              <div style="font-size:0.75rem;color:var(--forest-mid)">${done}/${total} activities done · $${c.budget.toLocaleString()}</div>
              ${phaseBadge(c.phase)}
              <div class="kanban-move-btns">
                ${!isFirst ? `<button class="kanban-move-btn" onclick="moveCampaignPhase(${c.id},-1)">← Back</button>` : ''}
                ${!isLast ? `<button class="kanban-move-btn" onclick="moveCampaignPhase(${c.id},1)">Advance →</button>` : ''}
              </div>
            </div>`;
          }).join('')
        : `<div class="kanban-empty">No campaigns</div>`;
      return `<div class="kanban-col">
        <div class="kanban-col-header" style="border-bottom-color:${phaseAccent[phase]}">
          <span>${phaseLabels[phase]}</span>
          ${cards.length ? `<span class="kanban-col-count">${cards.length}</span>` : ''}
        </div>
        ${cardHTML}
      </div>`;
    }).join('');

    return `<div class="kanban-board">${cols}</div>`;
  }

  function moveCampaignPhase(campaignId, dir) {
    const phases = ['kickoff','strategy','execution','review','complete'];
    const campaigns = loadCampaigns();
    const c = campaigns.find(x => x.id === campaignId);
    if (!c) return;
    const idx = phases.indexOf(c.phase || 'kickoff');
    c.phase = phases[Math.max(0, Math.min(phases.length - 1, idx + dir))];
    saveCampaigns(campaigns);
    renderCampaignActivities();
  }

  function renderActivitiesGantt(campaigns) {
    if (!campaigns.length) return '<div style="color:#aaa;padding:20px;text-align:center">No campaigns to display.</div>';
    const phaseColors = {kickoff:'#4a6741',strategy:'#7a8f6b',execution:'#c4932a',review:'#a07320',complete:'#2d6a4f'};
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Parse dates safely: YYYY-MM-DD strings are treated as local dates
    function parseDate(dateStr) {
      if (!dateStr) return null;
      const [yr, mo, dy] = dateStr.split('-').map(x => parseInt(x));
      const d = new Date(yr, mo - 1, dy);
      return d;
    }

    let minDate = null, maxDate = null;
    campaigns.forEach(c => {
      const s = c.startDate ? parseDate(c.startDate) : null;
      const e = c.endDate ? parseDate(c.endDate) : null;
      if (s && (!minDate || s < minDate)) minDate = s;
      if (e && (!maxDate || e > maxDate)) maxDate = e;
      // Also scan activity dueDates for range
      (c.activities || []).forEach(a => {
        const ad = a.dueDate ? parseDate(a.dueDate) : null;
        if (ad && (!minDate || ad < minDate)) minDate = ad;
        if (ad && (!maxDate || ad > maxDate)) maxDate = ad;
      });
    });
    if (!minDate) minDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    if (!maxDate) maxDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);

    // Pad by 14 days on each side
    minDate = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate() - 14);
    maxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate() + 14);

    // Enforce minimum 3-month span so bars aren't compressed
    const minSpanMs = 90 * 24 * 60 * 60 * 1000;
    if ((maxDate - minDate) < minSpanMs) {
      const mid = new Date((minDate.getTime() + maxDate.getTime()) / 2);
      minDate = new Date(mid.getTime() - minSpanMs / 2);
      maxDate = new Date(mid.getTime() + minSpanMs / 2);
    }

    const totalMs = maxDate - minDate;
    if (totalMs <= 0) return '<div style="color:#aaa;padding:20px;text-align:center">Invalid date range.</div>';

    function pct(d) {
      const date = typeof d === 'string' ? parseDate(d) : d;
      if (!date) return 0;
      return Math.max(0, Math.min(100, ((date - minDate) / totalMs) * 100));
    }

    const monthLabels = [];
    const cur = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (cur <= maxDate) {
      const left = pct(cur);
      const label = cur.toLocaleDateString('en-US', {month:'short', year:'numeric'});
      monthLabels.push(`<div style="position:absolute;left:${left.toFixed(2)}%;font-size:0.72rem;color:var(--forest-mid);font-weight:700;white-space:nowrap;top:4px">${label}</div>`);
      cur.setMonth(cur.getMonth() + 1);
    }
    const todayPct = pct(today);
    const todayLine = `<div class="gantt-today" style="left:${todayPct.toFixed(2)}%"></div>`;

    const rows = campaigns.map(c => {
      const leftPct = pct(c.startDate || todayStr);
      const rightPct = pct(c.endDate || todayStr);
      const widthPct = Math.max(0.5, rightPct - leftPct);
      const barColor = phaseColors[c.phase || 'kickoff'] || '#4a6741';
      const milestones = (c.milestones || []).filter(m => m.date).map(m => {
        const mp = pct(m.date);
        if (mp < 0 || mp > 100) return '';
        return `<div class="gantt-milestone" style="left:${mp.toFixed(2)}%" title="${m.name} — ${m.status}"></div>`;
      }).join('');
      const actRows = (c.activities || []).filter(a => a.dueDate).map(a => {
        const startP = pct(c.startDate || todayStr);
        const endP = pct(a.dueDate);
        const dw = Math.max(0.5, endP - startP);
        const isComplete = a.status === 'done';
        const isReview = a.status === 'review';
        const statusColor = isComplete ? '#2d6a4f' : a.status === 'in-progress' ? 'var(--gold)' : isReview ? '#3498db' : 'var(--forest-mid)';
        const statusDot = isComplete ? '🟢' : a.status === 'in-progress' ? '🟡' : isReview ? '🔵' : '⚪';

        const fmtName = (name) => { if (!name) return ''; const p = name.trim().split(/\s+/); return p.length === 1 ? p[0] : p[0] + ' ' + p[p.length-1].charAt(0) + '.'; };

        const teamWork = a.teamWork && a.teamWork.length > 0 ? a.teamWork : (a.assignee ? [{name: a.assignee, phase: a.category || '', progress: isComplete ? 100 : 50}] : []);

        // Build worker cards for the label column
        const workerCards = teamWork.map(tw => {
          const prog = tw.progress || 0;
          const isDone = prog >= 100;
          const progColor = isDone ? '#2d6a4f' : prog >= 60 ? 'var(--gold)' : 'var(--ember)';
          const progW = Math.min(100, Math.max(5, prog));
          return `<div style="display:flex;align-items:center;gap:0.4rem;margin-top:0.25rem">
            <div style="width:6px;height:6px;border-radius:50%;background:${isDone ? '#2d6a4f' : 'var(--gold)'};flex-shrink:0"></div>
            <span style="font-size:0.72rem;font-weight:600;color:var(--forest);white-space:nowrap">${fmtName(tw.name)}</span>
            <span style="font-size:0.65rem;color:var(--forest-mid);white-space:nowrap">${tw.phase || ''}</span>
            <div style="flex:1;min-width:30px;height:4px;background:var(--parchment);border-radius:2px;overflow:hidden"><div style="width:${progW}%;height:100%;background:${progColor};border-radius:2px"></div></div>
            <span style="font-size:0.65rem;font-weight:700;color:${progColor};white-space:nowrap">${isDone ? '✓' : prog + '%'}</span>
          </div>`;
        }).join('');

        // Completed-by attribution
        const completedBy = isComplete && teamWork.length > 0
          ? teamWork.filter(tw => tw.progress >= 100).map(tw => fmtName(tw.name)).join(', ')
          : '';

        const labelHtml = `<div style="padding:0.4rem 0">
          <div style="display:flex;align-items:center;gap:0.4rem;margin-bottom:0.15rem">
            <span style="font-size:0.68rem">${statusDot}</span>
            <span style="font-size:0.78rem;font-weight:600;color:${isComplete ? 'var(--forest-mid)' : 'var(--forest)'}">${a.name}</span>
          </div>
          ${isComplete && completedBy
            ? `<div style="font-size:0.68rem;color:#2d6a4f;font-weight:500;margin-left:1.1rem">Completed by ${completedBy}</div>`
            : workerCards}
        </div>`;

        return `<div class="gantt-deliverable-row" style="min-height:${Math.max(36, 28 + teamWork.length * 20)}px">
          <div class="gantt-deliverable-label" title="${a.name} · Due: ${a.dueDate}">${labelHtml}</div>
          <div class="gantt-bar-area" style="position:relative">
            ${todayLine}
            <div class="gantt-deliverable-bar" style="left:${startP.toFixed(2)}%;width:${dw.toFixed(2)}%;background:${isComplete ? '#2d6a4f' : statusColor};opacity:${isComplete ? '0.4' : '1'}"></div>
            ${teamWork.filter(tw => !isComplete).map((tw, i) => {
              const twProg = (tw.progress || 0) / 100;
              const twW = dw * twProg;
              const twColor = tw.progress >= 100 ? '#2d6a4f' : tw.progress >= 60 ? '#C9A84C' : '#c0392b';
              return `<div style="position:absolute;left:${startP.toFixed(2)}%;width:${twW.toFixed(2)}%;top:${4 + i * 7}px;height:5px;background:${twColor};border-radius:1px;opacity:0.8" title="${tw.name}: ${tw.progress}%"></div>`;
            }).join('')}
          </div>
        </div>`;
      }).join('');
      return `<div class="gantt-row">
        <div class="gantt-label" title="${c.name} · ${c.client}">${c.name}</div>
        <div class="gantt-bar-area">
          ${todayLine}
          <div class="gantt-bar" style="left:${leftPct.toFixed(2)}%;width:${widthPct.toFixed(2)}%;background:${barColor}"></div>
          ${milestones}
        </div>
      </div>${actRows}`;
    }).join('');

    // Calculate min-width: ~120px per month shown
    const monthsSpan = Math.max(3, Math.ceil(totalMs / (30 * 24 * 60 * 60 * 1000)));
    const barAreaMinW = Math.max(500, monthsSpan * 120);
    const totalMinW = 260 + barAreaMinW;

    return `<div style="background:var(--white);border:1px solid var(--parchment);overflow-x:auto">
      <div style="min-width:${totalMinW}px">
      <div style="display:flex;border-bottom:2px solid var(--parchment);background:var(--cream)">
        <div style="flex:0 0 260px;padding:0.5rem 0.75rem;font-size:0.75rem;font-weight:700;color:var(--forest);text-transform:uppercase;letter-spacing:0.08em">Campaign / Deliverable</div>
        <div style="flex:1;position:relative;height:28px;">${monthLabels.join('')}${todayLine}</div>
      </div>
      ${rows}
      <div style="display:flex;align-items:center;gap:1.2rem;padding:0.6rem 0.75rem;border-top:1px solid var(--parchment);background:var(--cream);flex-wrap:wrap">
        ${Object.entries(phaseColors).map(([ph, col]) => `<div style="display:flex;align-items:center;gap:0.4rem"><div style="width:14px;height:8px;background:${col};border-radius:1px"></div><span style="font-size:0.75rem;color:var(--forest-mid);text-transform:capitalize">${ph}</span></div>`).join('')}
        <div style="display:flex;align-items:center;gap:0.4rem"><div style="width:2px;height:14px;background:#e74c3c;opacity:0.7"></div><span style="font-size:0.75rem;color:var(--forest-mid)">Today</span></div>
      </div>
      </div>
    </div>`;
  }

  let availabilityShowDetail = false;
  function toggleAvailabilityDetail() {
    availabilityShowDetail = !availabilityShowDetail;
    renderTeamAvailability();
  }

  function renderTeamAvailability() {
    const panel = document.getElementById('team-availability-panel');
    if (!panel) return;

    const campaigns = loadCampaigns();
    const teamMembers = TEAM_MEMBERS;
    const labor = loadLaborTracking();
    
    // Build allocation map: who's working on what
    const allocations = {};
    teamMembers.forEach(tm => {
      allocations[tm.name] = {
        member: tm,
        currentActivities: [],
        completedActivities: [],
        totalHoursLogged: 0,
        capacity: tm.capacity || 160,
        availableCapacity: tm.capacity || 160
      };
    });

    // Map activities to assignees
    campaigns.forEach(campaign => {
      (campaign.activities || []).forEach(activity => {
        if (activity.assignee && allocations[activity.assignee]) {
          if (activity.status === 'done') {
            allocations[activity.assignee].completedActivities.push({
              campaign: campaign.name,
              activity: activity.name,
              dueDate: activity.dueDate,
              category: activity.category
            });
          } else {
            allocations[activity.assignee].currentActivities.push({
              id: `${campaign.id}-${activity.id}`,
              campaign: campaign.name,
              activity: activity.name,
              status: activity.status,
              dueDate: activity.dueDate,
              category: activity.category,
              campaignId: campaign.id,
              activityId: activity.id
            });
          }
        }
      });
    });

    // Calculate hours logged per person
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    labor.forEach(entry => {
      if (entry.contractor && allocations[entry.contractor] && entry.date >= currentMonthStart) {
        allocations[entry.contractor].totalHoursLogged += entry.hours;
      }
    });

    // Calculate available capacity
    teamMembers.forEach(tm => {
      const alloc = allocations[tm.name];
      alloc.availableCapacity = Math.max(0, alloc.capacity - alloc.totalHoursLogged);
    });

    // Sort by available capacity (those with most availability first, so PM knows who to tap)
    const sortedTeam = Object.values(allocations)
      .sort((a, b) => b.availableCapacity - a.availableCapacity);

    if (availabilityShowDetail) {
      // Detailed view showing each person's allocations
      const rows = sortedTeam.map(alloc => {
        const member = alloc.member;
        const utilization = Math.round((alloc.totalHoursLogged / alloc.capacity) * 100);
        const statusColor = alloc.availableCapacity > 20 ? '#2d6a4f' : alloc.availableCapacity > 10 ? 'var(--gold)' : '#c1440c';
        
        const activitiesHTML = alloc.currentActivities.length
          ? alloc.currentActivities.map(act => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0.75rem;border-bottom:0.5px solid var(--parchment);font-size:0.82rem">
                <div style="flex:1">
                  <div style="font-weight:600;color:var(--forest)">${act.activity}</div>
                  <div style="color:var(--forest-mid);font-size:0.78rem">${act.campaign} · ${act.category || 'General'}</div>
                </div>
                <div style="text-align:right;white-space:nowrap">
                  <div style="font-size:0.75rem;color:var(--forest-mid)">Due: ${act.dueDate || '—'}</div>
                  <span style="font-size:0.7rem;font-weight:600;text-transform:uppercase;color:${act.status === 'in-progress' ? 'var(--gold)' : 'var(--forest-mid)'}; padding:2px 4px;background:${act.status === 'in-progress' ? 'var(--cream)' : 'transparent'}">${act.status}</span>
                </div>
              </div>
            `).join('')
          : '<div style="padding:1rem;text-align:center;color:var(--forest-mid);font-style:italic;font-size:0.85rem">No active assignments</div>';

        return `<div style="margin-bottom:1.5rem;border:1px solid var(--parchment);border-radius:3px;overflow:hidden">
          <div style="display:flex;justify-content:space-between;align-items:center;padding:0.8rem 1rem;background:var(--white);border-bottom:1px solid var(--parchment)">
            <div>
              <div style="font-weight:700;color:var(--forest);font-size:0.95rem">${member.name}</div>
              <div style="font-size:0.8rem;color:var(--forest-mid)">${member.title}</div>
            </div>
            <div style="text-align:right">
              <div style="display:flex;gap:1rem;align-items:flex-end">
                <div>
                  <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.2rem">Utilization</div>
                  <div style="font-size:1.3rem;font-weight:700;color:${statusColor}">${utilization}%</div>
                  <div style="font-size:0.75rem;color:var(--forest-mid)">${alloc.totalHoursLogged.toFixed(1)}/${alloc.capacity} hrs</div>
                </div>
                <div style="border-left:1px solid var(--parchment);padding-left:1rem">
                  <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.2rem">Available</div>
                  <div style="font-size:1.3rem;font-weight:700;color:${statusColor}">${alloc.availableCapacity.toFixed(0)}</div>
                  <div style="font-size:0.75rem;color:var(--forest-mid)">hours this month</div>
                </div>
              </div>
            </div>
          </div>
          <div style="background:var(--ivory)">
            <div style="padding:0.6rem 1rem;font-size:0.8rem;font-weight:700;text-transform:uppercase;color:var(--forest-mid);border-bottom:0.5px solid var(--parchment)">
              Current Assignments (${alloc.currentActivities.length})
            </div>
            ${activitiesHTML}
          </div>
          ${alloc.completedActivities.length > 0 ? `
            <div style="background:var(--cream);padding:0.6rem 1rem;font-size:0.8rem;color:var(--forest-mid)">
              ✓ ${alloc.completedActivities.length} completed this month
            </div>
          ` : ''}
        </div>`;
      }).join('');

      panel.innerHTML = `<div style="max-width:1000px">${rows}</div>`;
    } else {
      // Summary view - quick capacity cards
      const cards = sortedTeam.map(alloc => {
        const member = alloc.member;
        const utilization = Math.round((alloc.totalHoursLogged / alloc.capacity) * 100);
        const statusColor = alloc.availableCapacity > 20 ? '#2d6a4f' : alloc.availableCapacity > 10 ? 'var(--gold)' : '#c1440c';
        const statusLabel = alloc.availableCapacity > 20 ? 'Available' : alloc.availableCapacity > 10 ? 'Moderate' : 'Stretched';
        
        return `<div style="background:var(--white);border:1px solid var(--parchment);padding:1rem;border-radius:3px;cursor:pointer" onclick="toggleAvailabilityDetail()">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.6rem">
            <div>
              <div style="font-weight:700;color:var(--forest)">${member.name}</div>
              <div style="font-size:0.8rem;color:var(--forest-mid)">${member.title}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:0.9rem;font-weight:700;color:${statusColor}">${alloc.availableCapacity.toFixed(0)} hrs</div>
              <div style="font-size:0.75rem;color:var(--forest-mid)">available</div>
            </div>
          </div>
          <div style="display:flex;gap:1rem;align-items:center">
            <div style="flex:1">
              <div style="height:6px;background:var(--parchment);border-radius:3px;overflow:hidden">
                <div style="height:100%;background:${statusColor};width:${utilization}%"></div>
              </div>
              <div style="font-size:0.75rem;color:var(--forest-mid);margin-top:0.3rem">${utilization}% utilized · ${alloc.currentActivities.length} active</div>
            </div>
          </div>
        </div>`;
      }).join('');

      panel.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:0.8rem">${cards}</div>
        <div style="margin-top:1rem;padding:0.8rem;background:var(--ivory);border:1px solid var(--parchment);border-radius:3px;font-size:0.85rem;color:var(--forest-mid)">
          <strong style="color:var(--forest)">Legend:</strong> Green (>20hrs available) = Can take new work · Amber (10-20hrs) = Selective · Red (<10hrs) = At capacity
        </div>`;
    }
  }

  // ── PAYROLL FUNCTIONS ─────────────────────────────────
  function renderPayroll() {
    const el = document.getElementById('payroll-table');
    if (!el) return;

    const period = document.getElementById('payroll-period')?.value || 'current';
    const labor = loadLaborTracking();

    // Date range by period
    let startDate, endDate;
    if (period === 'current') { startDate = '2026-04-01'; endDate = '2026-04-15'; }
    else if (period === 'previous') { startDate = '2026-03-16'; endDate = '2026-03-31'; }
    else { startDate = '2026-03-01'; endDate = '2026-03-15'; }

    const filtered = labor.filter(l => l.date >= startDate && l.date <= endDate);

    // Group by contractor
    const byContractor = {};
    const campaigns = loadCampaigns();
    filtered.forEach(l => {
      const name = l.contractor || 'Unassigned';
      if (!byContractor[name]) byContractor[name] = { hours: 0, cost: 0, campaignIds: new Set(), paid: l.paid || false };
      byContractor[name].hours += l.hours;
      byContractor[name].cost += l.hours * l.hourlyRate;
      if (l.campaignId) byContractor[name].campaignIds.add(l.campaignId);
    });

    const thStyle = 'text-align:left;padding:8px 10px;color:var(--forest-mid);font-weight:700;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.05em;background:var(--cream)';
    const tdStyle = 'padding:8px 10px;border-bottom:0.5px solid var(--parchment);font-size:0.85rem';

    const entries = Object.entries(byContractor);
    const totalCost = entries.reduce((s, [, d]) => s + d.cost, 0);

    if (!entries.length) {
      el.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--forest-mid);font-style:italic">No labor logged for this period.</div>';
      return;
    }

    const rows = entries.map(([name, d]) => {
      const campNames = [...d.campaignIds].map(id => {
        const c = campaigns.find(x => x.id === id);
        return c ? c.name : '—';
      }).join(', ') || '—';
      const isPaid = d.paid;
      return `<tr>
        <td style="${tdStyle};font-weight:700;color:var(--forest)">${name}</td>
        <td style="${tdStyle}">${d.hours}h</td>
        <td style="${tdStyle}">$${(d.cost / (d.hours || 1)).toFixed(0)}/hr avg</td>
        <td style="${tdStyle};font-weight:700;color:var(--gold)">$${d.cost.toLocaleString()}</td>
        <td style="${tdStyle};font-size:0.82rem;color:var(--forest-mid)">${campNames}</td>
        <td style="${tdStyle}">
          <button onclick="markPayrollPaid('${name}','${startDate}','${endDate}')" style="font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:${isPaid?'#2d6a4f':'transparent'};color:${isPaid?'var(--ivory)':'var(--forest)'};border:1px solid ${isPaid?'#2d6a4f':'var(--parchment)'};padding:3px 8px;cursor:pointer;border-radius:2px">${isPaid?'Paid':'Mark Paid'}</button>
        </td>
      </tr>`;
    }).join('');

    el.innerHTML = `<div style="overflow-x:auto">
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse;background:var(--white);border:1px solid var(--parchment)">
        <tr>
          <th style="${thStyle}">Contractor</th>
          <th style="${thStyle}">Hours</th>
          <th style="${thStyle}">Rate</th>
          <th style="${thStyle}">Amount</th>
          <th style="${thStyle}">Campaigns Worked</th>
          <th style="${thStyle}">Export to QB</th>
        </tr>
        ${rows}
        <tr style="background:var(--cream)">
          <td style="${tdStyle};font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--forest)" colspan="3">Total</td>
          <td style="${tdStyle};font-weight:700;color:var(--forest);font-size:1rem">$${totalCost.toLocaleString()}</td>
          <td style="${tdStyle}" colspan="2"></td>
        </tr>
      </table>
    </div>`;
  }

  function markPayrollPaid(contractorName, startDate, endDate) {
    const labor = loadLaborTracking();
    labor.forEach(l => {
      if ((l.contractor || 'Unassigned') === contractorName && l.date >= startDate && l.date <= endDate) {
        l.paid = !l.paid;
      }
    });
    saveLaborTracking(labor);
    renderPayroll();
  }

  function exportPayroll() {
    const period = document.getElementById('payroll-period')?.value || 'current';
    let startDate, endDate, periodLabel;
    if (period === 'current') { startDate = '2026-04-01'; endDate = '2026-04-15'; periodLabel = 'Apr 1-15 2026'; }
    else if (period === 'previous') { startDate = '2026-03-16'; endDate = '2026-03-31'; periodLabel = 'Mar 16-31 2026'; }
    else { startDate = '2026-03-01'; endDate = '2026-03-15'; periodLabel = 'Mar 1-15 2026'; }

    const labor = loadLaborTracking();
    const campaigns = loadCampaigns();
    const filtered = labor.filter(l => l.date >= startDate && l.date <= endDate);

    const byContractor = {};
    filtered.forEach(l => {
      const name = l.contractor || 'Unassigned';
      if (!byContractor[name]) byContractor[name] = { hours: 0, cost: 0, campaignIds: new Set() };
      byContractor[name].hours += l.hours;
      byContractor[name].cost += l.hours * l.hourlyRate;
      if (l.campaignId) byContractor[name].campaignIds.add(l.campaignId);
    });

    const header = 'Contractor,Hours,Amount,Campaigns Worked,Period';
    const rows = Object.entries(byContractor).map(([name, d]) => {
      const campNames = [...d.campaignIds].map(id => {
        const c = campaigns.find(x => x.id === id);
        return c ? c.name : '';
      }).join(' | ');
      return `"${name}",${d.hours},$${d.cost.toFixed(2)},"${campNames}","${periodLabel}"`;
    });

    const csv = [header, ...rows].join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = `payroll-${period}.csv`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // ── CONTRACTOR RATES ──────────────────────────────────
  const CONTRACTOR_RATES_KEY = 'meridian_contractor_rates';
  const DEFAULT_CONTRACTOR_RATES = {
    'Nicole Feenstra': 175,
    'Sarah Chen':      125,
    'Marcus Rivera':   110,
    'Jade Thompson':   95,
    'Alex Kim':        105
  };

  function loadContractorRates() {
    try {
      const stored = JSON.parse(localStorage.getItem(CONTRACTOR_RATES_KEY));
      return stored || { ...DEFAULT_CONTRACTOR_RATES };
    } catch(e) {
      return { ...DEFAULT_CONTRACTOR_RATES };
    }
  }

  function saveContractorRates(rates) {
    localStorage.setItem(CONTRACTOR_RATES_KEY, JSON.stringify(rates));
  }

  function autoFillContractorRate(contractorName) {
    const rates = loadContractorRates();
    const rateInput = document.getElementById('labor-hourly-rate');
    if (rateInput && rates[contractorName]) {
      rateInput.value = rates[contractorName];
    }
  }

  function openManageRatesPanel() {
    const panel = document.getElementById('manage-rates-panel');
    const rowsEl = document.getElementById('rates-editor-rows');
    if (!panel || !rowsEl) return;
    const rates = loadContractorRates();
    const thS = 'font-size:0.75rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)';
    const tdS = 'padding:4px 0';
    rowsEl.innerHTML = `<table style="width:100%;border-collapse:collapse">
      <tr>
        <th style="${thS};text-align:left;padding-bottom:0.5rem">Team Member</th>
        <th style="${thS};text-align:right;padding-bottom:0.5rem">Rate ($/hr)</th>
      </tr>
      ${Object.entries(rates).map(([name, rate]) => `
      <tr>
        <td style="${tdS};font-size:0.88rem;font-weight:600;color:var(--forest)">${name}</td>
        <td style="${tdS};text-align:right">
          <input type="number" min="10" step="5" value="${rate}" data-contractor="${name}"
            style="width:80px;padding:3px 6px;border:1px solid var(--parchment);border-radius:2px;font-family:inherit;font-size:0.88rem;text-align:right;background:var(--white)">
        </td>
      </tr>`).join('')}
    </table>`;
    panel.style.display = 'block';
  }

  function closeManageRatesPanel() {
    const panel = document.getElementById('manage-rates-panel');
    if (panel) panel.style.display = 'none';
  }

  function saveContractorRatesFromPanel() {
    const inputs = document.querySelectorAll('#rates-editor-rows input[data-contractor]');
    const rates = {};
    inputs.forEach(inp => {
      const name = inp.getAttribute('data-contractor');
      const val = parseFloat(inp.value);
      if (name && !isNaN(val)) rates[name] = val;
    });
    saveContractorRates(rates);
    closeManageRatesPanel();
    // Re-fill rate for currently selected contractor
    const contractorSel = document.querySelector('#add-labor-form select[name="contractor"]');
    if (contractorSel) autoFillContractorRate(contractorSel.value);
  }

  // ── BILLABLE HOURS INVOICING ───────────────────────────
  let invoiceCounter = parseInt(localStorage.getItem('meridian_invoice_counter') || '100');

  function nextInvoiceNumber() {
    invoiceCounter++;
    localStorage.setItem('meridian_invoice_counter', String(invoiceCounter));
    return 'INV-' + String(invoiceCounter).padStart(4, '0');
  }

  function renderBillableInvoicing() {
    const el = document.getElementById('billable-invoice-table');
    if (!el) return;

    const period = document.getElementById('billing-period')?.value || 'current';
    const labor = loadLaborTracking();
    const campaigns = loadCampaigns();

    let startDate, endDate;
    if (period === 'current')  { startDate = '2026-04-01'; endDate = '2026-04-15'; }
    else if (period === 'previous') { startDate = '2026-03-16'; endDate = '2026-03-31'; }
    else if (period === 'prev2')    { startDate = '2026-03-01'; endDate = '2026-03-15'; }
    else { startDate = '2000-01-01'; endDate = '2099-12-31'; }

    const billable = labor.filter(l =>
      l.category === 'Billable' &&
      l.date >= startDate && l.date <= endDate
    );

    if (!billable.length) {
      el.innerHTML = '<div style="padding:2rem;text-align:center;color:var(--forest-mid);font-style:italic;background:var(--white);border:1px solid var(--parchment)">No billable hours logged for this period.</div>';
      return;
    }

    // Group by campaign
    const byCampaign = {};
    billable.forEach(l => {
      const campId = l.campaignId || l.projectId || 'unassigned';
      if (!byCampaign[campId]) byCampaign[campId] = { items: [], totalHours: 0, totalCost: 0, contractors: new Set() };
      byCampaign[campId].items.push(l);
      byCampaign[campId].totalHours += l.hours;
      byCampaign[campId].totalCost += l.hours * l.hourlyRate;
      byCampaign[campId].contractors.add(l.contractor || 'Unassigned');
    });

    const thS = 'text-align:left;padding:8px 10px;color:var(--forest-mid);font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;background:var(--cream)';
    const tdS = 'padding:8px 10px;border-bottom:0.5px solid var(--parchment);font-size:0.85rem;vertical-align:middle';

    const rows = Object.entries(byCampaign).map(([campId, data]) => {
      const camp = campaigns.find(c => String(c.id) === String(campId));
      const campName = camp ? camp.name : (campId === 'unassigned' ? 'Unassigned' : `Campaign #${campId}`);
      const clientName = camp ? (camp.client || 'DNA Agency') : 'DNA Agency';
      const contractors = [...data.contractors].join(', ');
      return `<tr>
        <td style="${tdS};font-weight:700;color:var(--forest)">${campName}</td>
        <td style="${tdS};color:var(--forest-mid);font-size:0.82rem">${clientName}</td>
        <td style="${tdS}">${data.totalHours.toFixed(2)}h</td>
        <td style="${tdS};font-weight:700;color:var(--gold)">$${data.totalCost.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
        <td style="${tdS};font-size:0.82rem;color:var(--forest-mid)">${contractors}</td>
        <td style="${tdS}">
          <button onclick="generateCampaignInvoice('${campId}','${startDate}','${endDate}')"
            style="font-family:'DM Sans',sans-serif;font-size:0.78rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;background:var(--forest);color:var(--ivory);border:none;padding:4px 10px;cursor:pointer;border-radius:2px">
            Generate Invoice
          </button>
        </td>
      </tr>`;
    }).join('');

    el.innerHTML = `<div style="overflow-x:auto">
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse;background:var(--white);border:1px solid var(--parchment)">
        <tr>
          <th style="${thS}">Campaign</th>
          <th style="${thS}">Client</th>
          <th style="${thS}">Total Hours</th>
          <th style="${thS}">Total Cost</th>
          <th style="${thS}">Contractors</th>
          <th style="${thS}">Action</th>
        </tr>
        ${rows}
      </table>
    </div>`;
  }

  function generateCampaignInvoice(campId, startDate, endDate) {
    const labor = loadLaborTracking();
    const campaigns = loadCampaigns();
    const camp = campaigns.find(c => String(c.id) === String(campId));
    const campName = camp ? camp.name : (campId === 'unassigned' ? 'Unassigned' : `Campaign #${campId}`);
    const clientName = camp ? (camp.client || 'DNA Agency') : 'DNA Agency';

    const items = labor.filter(l =>
      l.category === 'Billable' &&
      l.date >= startDate && l.date <= endDate &&
      (String(l.campaignId) === String(campId) || String(l.projectId) === String(campId) || (campId === 'unassigned' && !l.campaignId && !l.projectId))
    );

    // Group by contractor for line items
    const byContractor = {};
    items.forEach(l => {
      const name = l.contractor || 'Unassigned';
      if (!byContractor[name]) byContractor[name] = { hours: 0, rate: l.hourlyRate, cost: 0 };
      byContractor[name].hours += l.hours;
      byContractor[name].cost += l.hours * l.hourlyRate;
    });

    const invoiceNum = nextInvoiceNumber();
    const today = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });
    const total = Object.values(byContractor).reduce((s, d) => s + d.cost, 0);

    const thS = 'text-align:left;padding:8px 12px;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--forest-mid);background:var(--cream);border-bottom:1px solid var(--parchment)';
    const tdS = 'padding:8px 12px;font-size:0.88rem;border-bottom:0.5px solid var(--parchment)';

    const lineRows = Object.entries(byContractor).map(([name, d]) =>
      `<tr>
        <td style="${tdS};font-weight:600;color:var(--forest)">${name}</td>
        <td style="${tdS}">${d.hours.toFixed(2)}</td>
        <td style="${tdS}">$${d.rate}/hr</td>
        <td style="${tdS};font-weight:700;color:var(--gold)">$${d.cost.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
      </tr>`
    ).join('');

    // Build CSV for download
    function buildInvoiceCSV() {
      const header = 'Invoice Number,Date,Campaign,Client,Contractor,Hours,Rate,Cost';
      const dataRows = Object.entries(byContractor).map(([name, d]) =>
        `"${invoiceNum}","${today}","${campName}","${clientName}","${name}",${d.hours.toFixed(2)},$${d.rate},$${d.cost.toFixed(2)}`
      );
      return [header, ...dataRows].join('\n');
    }

    // Show modal
    const existing = document.getElementById('invoice-gen-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'invoice-gen-modal';
    modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem';
    modal.innerHTML = `
      <div style="background:var(--white);max-width:640px;width:100%;border-radius:3px;overflow:hidden;max-height:90vh;overflow-y:auto">
        <div style="background:var(--forest);color:var(--ivory);padding:1.5rem">
          <div style="font-size:0.7rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--gold);margin-bottom:0.3rem">Invoice</div>
          <div style="font-size:1.2rem;font-weight:700;letter-spacing:0.05em">${invoiceNum}</div>
          <div style="font-size:0.85rem;color:#c8ddd7;margin-top:0.3rem">${today}</div>
        </div>
        <div style="padding:1.5rem">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem">
            <div>
              <div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.3rem">From</div>
              <div style="font-size:0.92rem;font-weight:700;color:var(--forest)">DNA Agency</div>
            </div>
            <div>
              <div style="font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.3rem">To / Campaign</div>
              <div style="font-size:0.92rem;font-weight:700;color:var(--forest)">${clientName}</div>
              <div style="font-size:0.85rem;color:var(--forest-mid)">${campName}</div>
            </div>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:1rem">
            <tr>
              <th style="${thS}">Contractor</th>
              <th style="${thS}">Hours</th>
              <th style="${thS}">Rate</th>
              <th style="${thS}">Amount</th>
            </tr>
            ${lineRows}
            <tr style="background:var(--cream)">
              <td style="${tdS};font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--forest)" colspan="3">Total</td>
              <td style="${tdS};font-weight:700;font-size:1rem;color:var(--forest)">$${total.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
            </tr>
          </table>
          <div style="display:flex;gap:0.8rem;flex-wrap:wrap">
            <button onclick="(function(){
              const csv=${JSON.stringify(buildInvoiceCSV())};
              const a=document.createElement('a');
              a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);
              a.download='invoice-${invoiceNum}.csv';
              a.style.display='none';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            })()" style="padding:0.55rem 1.1rem;background:var(--gold);color:var(--forest);border:none;border-radius:3px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Download CSV</button>
            <button onclick="markCampaignInvoiced('${campId}','${startDate}','${endDate}')" style="padding:0.55rem 1.1rem;background:var(--forest);color:var(--ivory);border:none;border-radius:3px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Mark Invoiced</button>
            <button onclick="document.getElementById('invoice-gen-modal').remove()" style="padding:0.55rem 1.1rem;background:transparent;color:var(--forest-mid);border:1px solid var(--parchment);border-radius:3px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.85rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase">Close</button>
          </div>
        </div>
      </div>`;
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
    document.body.appendChild(modal);
  }

  function markCampaignInvoiced(campId, startDate, endDate) {
    const labor = loadLaborTracking();
    labor.forEach(l => {
      if (
        l.category === 'Billable' &&
        l.date >= startDate && l.date <= endDate &&
        (String(l.campaignId) === String(campId) || String(l.projectId) === String(campId))
      ) {
        l.invoiced = true;
      }
    });
    saveLaborTracking(labor);
    const modal = document.getElementById('invoice-gen-modal');
    if (modal) modal.remove();
    renderBillableInvoicing();
  }

  function renderCampaignLaborCosts() {
    const el = document.getElementById('campaign-labor-cost-table');
    if (!el) return;
    let labor = loadLaborTracking();
    // Explicit seed fallback — if localStorage returns nothing useful, use seed directly
    if (!labor || !labor.length) labor = [...LABOR_TRACKING_SEED];
    const campaigns = loadCampaigns();
    const billable = labor.filter(l => !l.category || l.category !== 'Internal');

    const byCampaign = {};
    billable.forEach(l => {
      const campId = l.campaignId || l.projectId || 'unassigned';
      if (!byCampaign[campId]) byCampaign[campId] = { hours: 0, cost: 0, rows: [] };
      byCampaign[campId].hours += l.hours;
      byCampaign[campId].cost += l.hours * l.hourlyRate;
      byCampaign[campId].rows.push(l);
    });

    if (!Object.keys(byCampaign).length) {
      el.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--forest-mid);font-style:italic">No billable labor logged yet.</div>';
      return;
    }

    const thS = 'text-align:left;padding:8px 10px;color:var(--forest-mid);font-weight:700;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.05em;background:var(--cream)';
    const tdS = 'padding:8px 10px;border-bottom:0.5px solid var(--parchment);font-size:0.85rem';

    const rows = Object.entries(byCampaign).map(([campId, data]) => {
      const camp = campaigns.find(c => String(c.id) === String(campId));
      const campName = camp ? camp.name : (campId === 'unassigned' ? 'Unassigned' : `Campaign #${campId}`);
      const contractors = [...new Set(data.rows.map(r => r.contractor || 'Unassigned'))].join(', ');
      const periods = [...new Set(data.rows.map(r => r.date ? r.date.substring(0, 7) : '—'))].sort().join(', ');
      const invoicedCount = data.rows.filter(r => r.invoiced).length;
      const invoicedLabel = invoicedCount === data.rows.length ? '<span style="color:#27AE60;font-weight:700">All Invoiced</span>'
        : invoicedCount > 0 ? `<span style="color:var(--gold);font-weight:700">${invoicedCount}/${data.rows.length} Invoiced</span>`
        : '<span style="color:var(--forest-mid)">Not Invoiced</span>';

      return `<tr>
        <td style="${tdS};font-weight:700;color:var(--forest)">${campName}</td>
        <td style="${tdS}">${data.hours.toFixed(2)}h</td>
        <td style="${tdS};font-weight:700;color:var(--gold)">$${data.cost.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</td>
        <td style="${tdS};font-size:0.82rem;color:var(--forest-mid)">${contractors}</td>
        <td style="${tdS};font-size:0.82rem;color:var(--forest-mid)">${periods}</td>
        <td style="${tdS}">${invoicedLabel}</td>
        <td style="${tdS}">
          <button onclick="generateCampaignInvoice('${campId}','2000-01-01','2099-12-31')"
            style="font-family:'DM Sans',sans-serif;font-size:0.75rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;background:transparent;color:var(--forest);border:1px solid var(--parchment);padding:3px 8px;cursor:pointer;border-radius:2px">
            Invoice
          </button>
        </td>
      </tr>`;
    }).join('');

    el.innerHTML = `<div style="overflow-x:auto">
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse;background:var(--white);border:1px solid var(--parchment)">
        <tr>
          <th style="${thS}">Campaign</th>
          <th style="${thS}">Hours (Billable)</th>
          <th style="${thS}">Cost</th>
          <th style="${thS}">Contractors</th>
          <th style="${thS}">Pay Period</th>
          <th style="${thS}">Invoiced?</th>
          <th style="${thS}">Action</th>
        </tr>
        ${rows}
      </table>
    </div>`;
  }

  // ── CRM → CAMPAIGN LINK ─────────────────────────────────
  function createCampaignFromContact(contactId) {
    const contacts = loadContacts();
    const c = contacts.find(x => x.id === contactId);
    if (!c) return;
    closeContact();
    const form = document.getElementById('add-campaign-form');
    if (form) {
      form.client.value = c.organization || (c.firstName + ' ' + c.lastName);
      form.name.value = c.organization || (c.firstName + ' ' + c.lastName);
    }
    const cidInput = document.getElementById('add-campaign-contactId');
    if (cidInput) cidInput.value = contactId;
    // Switch to campaign tab
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(ct => ct.classList.remove('active'));
    const campTab = document.querySelector('[data-tab="campaign"]');
    if (campTab) campTab.classList.add('active');
    const campContent = document.getElementById('campaign');
    if (campContent) campContent.classList.add('active');
    openAddModal();
  }

  renderCRM();

  // ── FINANCE DATA ──────────────────────────────────────
  const DONORS_KEY = 'meridian_donors';
  const GRANTS_KEY = 'meridian_grants';

  const DONORS_SEED = [
    {id:1,campaign:"rebuilding-california",name:"James Whitfield",type:"corporate",organization:"Whitfield Capital Group",email:"j.whitfield@whitfieldcap.com",phone:"(213) 555-0340",stage:"education",amount:25000,giftType:"major",notes:"Met at LA Philanthropy Summit. Expressed interest in workforce programs. Schedule intro call in April.",nextAction:"Send intro packet + schedule call",lastContacted:"2026-03-10",tags:["corporate","major gift prospect"],createdAt:"2026-03-01"},
    {id:2,campaign:"rebuilding-california",name:"Michelle Park",type:"individual",organization:"",email:"michelle.park@gmail.com",phone:"(310) 555-0874",stage:"education",amount:5000,giftType:"mid-level",notes:"Attended March community event. Lives in district. Interested in education programs.",nextAction:"Send impact report",lastContacted:"2026-03-15",tags:["individual","community"],createdAt:"2026-03-10"},
    {id:3,campaign:"rebuilding-california",name:"Maya Johnson",type:"individual",organization:"",email:"maya.j@outlook.com",phone:"",stage:"education",amount:1000,giftType:"small",notes:"Newsletter subscriber — opened last 4 emails. Warm lead for first-time giving.",nextAction:"Personal outreach email",lastContacted:"2026-02-28",tags:["individual","newsletter"],createdAt:"2026-02-15"},
    {id:4,campaign:"rebuilding-california",name:"Robert Harmon",type:"foundation",organization:"Harmon Family Foundation",email:"grants@harmonfdn.org",phone:"(323) 555-0210",stage:"engagement",amount:50000,giftType:"major",notes:"Had two cultivation calls. Very aligned with Rebuilding California mission. Wants to see 3-year impact data before committing.",nextAction:"Send 3-year data report by Apr 5",lastContacted:"2026-03-20",tags:["foundation","high priority"],createdAt:"2026-01-10"},
    {id:5,campaign:"rebuilding-california",name:"TechCorp LA",type:"corporate",organization:"TechCorp LA",email:"csr@techcorpla.com",phone:"(213) 555-0655",stage:"engagement",amount:100000,giftType:"major",notes:"CSR team connected via board member intro. Evaluating 3 nonprofits. Decision by May 1.",nextAction:"Submit formal proposal by Apr 15",lastContacted:"2026-03-22",tags:["corporate","major gift","competitive"],createdAt:"2026-02-20"},
    {id:6,campaign:"rebuilding-california",name:"Sandra Cruz",type:"individual",organization:"",email:"scruz@aol.com",phone:"(818) 555-0093",stage:"engagement",amount:2500,giftType:"mid-level",notes:"Repeat donor — gave $2K last year. Upgraded ask this cycle. Attended gala.",nextAction:"Invite to April site visit",lastContacted:"2026-03-18",tags:["individual","repeat donor"],createdAt:"2025-09-01"},
    {id:7,campaign:"rebuilding-california",name:"Parsons Family Foundation",type:"foundation",organization:"Parsons Family Foundation",email:"info@parsonsfdn.org",phone:"(310) 555-0011",stage:"ask",amount:75000,giftType:"major",notes:"Proposal submitted Feb 28. Decision expected by end of April. Strong match with education pillar.",nextAction:"Follow up Apr 10 if no response",lastContacted:"2026-02-28",tags:["foundation","proposal submitted"],createdAt:"2025-12-01"},
    {id:8,campaign:"rebuilding-california",name:"Maria Elena Reyes",type:"individual",organization:"",email:"mariareyes@yahoo.com",phone:"(323) 555-0487",stage:"ask",amount:15000,giftType:"major",notes:"Legacy giving prospect. Met with ED last month. Considering planned gift + annual contribution.",nextAction:"ED follow-up call scheduled Apr 3",lastContacted:"2026-03-05",tags:["individual","legacy","major gift"],createdAt:"2026-01-20"},
    {id:9,campaign:"rebuilding-california",name:"LA Gives Initiative",type:"foundation",organization:"LA Gives Initiative",email:"awards@lagivesinitiative.org",phone:"",stage:"thank",amount:10000,giftType:"major",notes:"Gift received and acknowledged. Soft credit posted. Send formal thank-you letter + impact update in 90 days.",nextAction:"90-day impact update — due Jun 28",lastContacted:"2026-03-28",tags:["foundation","closed","stewardship"],createdAt:"2025-11-15"},
    {id:10,campaign:"rebuilding-california",name:"Anonymous Donor",type:"individual",organization:"",email:"",phone:"",stage:"thank",amount:5000,giftType:"mid-level",notes:"Anonymous gift received via online portal. Acknowledged per policy. No further contact.",nextAction:"None",lastContacted:"2026-03-01",tags:["individual","anonymous","closed"],createdAt:"2026-03-01"},
    {id:11,campaign:"rebuilding-california",name:"Pacific Community Foundation",type:"foundation",organization:"Pacific Community Foundation",email:"grants@paccomfdn.org",phone:"(415) 555-0302",stage:"thank",amount:30000,giftType:"major",notes:"Awarded Q4 2025. Stewardship report due June 30. Relationship manager: Nicole.",nextAction:"Stewardship report — due Jun 30",lastContacted:"2026-01-15",tags:["foundation","awarded","stewardship"],createdAt:"2025-09-01"},
    {id:12,campaign:"dna-agency",name:"Acme Corporation",type:"corporate",organization:"Acme Corporation",email:"partnerships@acme.com",phone:"(310) 555-1234",stage:"engagement",amount:45000,giftType:"major",notes:"DNA Agency partner. Exploring joint initiative.",nextAction:"Schedule partnership meeting",lastContacted:"2026-03-25",tags:["corporate","strategic partner"],createdAt:"2026-02-15"},
    {id:13,campaign:"dna-agency",name:"Lisa Wong",type:"individual",organization:"Wong Ventures",email:"lisa@wongventures.com",phone:"(310) 555-5678",stage:"ask",amount:25000,giftType:"major",notes:"DNA Agency board advisor. Strong mission alignment.",nextAction:"Follow up on proposal",lastContacted:"2026-03-20",tags:["individual","board advisor"],createdAt:"2026-02-20"},
    {id:14,campaign:"prop-development",name:"Development Partners LLC",type:"corporate",organization:"Development Partners LLC",email:"info@devpartners.com",phone:"(818) 555-9999",stage:"education",amount:60000,giftType:"major",notes:"Real estate development company. New prospect.",nextAction:"Initial consultation scheduled",lastContacted:"2026-03-28",tags:["corporate","real estate"],createdAt:"2026-03-15"},
    {id:15,campaign:"prop-development",name:"Katherine Torres",type:"individual",organization:"",email:"ktorres@email.com",phone:"(323) 555-4321",stage:"engagement",amount:18000,giftType:"mid-level",notes:"Community advocate for affordable housing.",nextAction:"Invite to site visit",lastContacted:"2026-03-22",tags:["individual","affordable housing"],createdAt:"2026-03-10"}
  ];

  const GRANTS_SEED = [
    {id:1,campaign:"rebuilding-california",name:"Arts & Culture Education Fund",funder:"LA County Arts Commission",amount:50000,status:"pending",deadline:"2026-04-30",submittedDate:"2026-02-14",link:"",notes:"Letter of inquiry approved. Full proposal submitted Feb 14. Awaiting review panel."},
    {id:2,campaign:"rebuilding-california",name:"Community Impact Grant",funder:"California Community Foundation",amount:35000,status:"in-review",deadline:"2026-05-15",submittedDate:"2026-01-30",link:"",notes:"In second-round review. Program officer contacted Mar 10 — positive signal."},
    {id:3,campaign:"rebuilding-california",name:"Workforce Development Program",funder:"Boeing Employees Community Fund",amount:40000,status:"research",deadline:"2026-06-01",submittedDate:"",link:"",notes:"Eligibility confirmed. LOI due May 1. Need workforce outcome data from Q1."},
    {id:4,campaign:"rebuilding-california",name:"Education Access Initiative",funder:"Gates Foundation",amount:75000,status:"research",deadline:"2026-07-15",submittedDate:"",link:"",notes:"Highly competitive. Reviewing guidelines — need program alignment doc. Assign to grants manager."},
    {id:5,campaign:"rebuilding-california",name:"Environmental Justice Fund",funder:"California EPA",amount:25000,status:"pending",deadline:"2026-05-01",submittedDate:"2026-03-01",link:"",notes:"Submitted on time. Strong fit with community health pillar. Decision expected May."},
    {id:6,campaign:"dna-agency",name:"Creative Excellence Grant",funder:"California Arts Council",amount:40000,status:"in-review",deadline:"2026-06-15",submittedDate:"2026-02-20",link:"",notes:"Supporting digital creative initiatives. High priority from arts council."},
    {id:7,campaign:"prop-development",name:"Housing & Community Development",funder:"HUD Community Development Block Grant",amount:150000,status:"pending",deadline:"2026-07-01",submittedDate:"2026-03-15",link:"",notes:"Strategic partnership with city. Multi-year funding opportunity."},
    {id:6,name:"Community Health Initiative",funder:"Kaiser Permanente Foundation",amount:30000,status:"awarded",deadline:"",submittedDate:"2025-11-15",link:"",notes:"Awarded Jan 2026. First disbursement received. Reporting due quarterly. Next report: Jun 30."}
  ];

  function loadDonors() {
    try { return JSON.parse(localStorage.getItem(DONORS_KEY)) || [...DONORS_SEED]; }
    catch(e) { return [...DONORS_SEED]; }
  }
  function saveDonors(data) { localStorage.setItem(DONORS_KEY, JSON.stringify(data)); }
  function loadGrants() {
    try { return JSON.parse(localStorage.getItem(GRANTS_KEY)) || [...GRANTS_SEED]; }
    catch(e) { return [...GRANTS_SEED]; }
  }
  function saveGrants(data) { localStorage.setItem(GRANTS_KEY, JSON.stringify(data)); }

  // ── CURRENT USER (for labor tracking) ─────────────────
  const CURRENT_USER = { id: 1, name: 'Nicole Feenstra', hourlyRate: 150 };

  // ── INVOICES DATA (Revenue) ───────────────────────────
  const INVOICES_KEY = 'meridian_invoices';
  const INVOICES_SEED = [
    {id:1,clientId:1,projectId:1,amount:15000,date:"2026-03-01",dueDate:"2026-03-31",status:"Funded",paymentDate:"2026-03-28",paymentMethod:"ACH",qbId:null,notes:"Q1 Campaign retainer",createdAt:"2026-03-01"},
    {id:2,clientId:2,projectId:2,amount:8500,date:"2026-03-15",dueDate:"2026-04-15",status:"Sent",paymentDate:null,paymentMethod:null,qbId:null,notes:"Brand refresh project",createdAt:"2026-03-15"},
    {id:3,clientId:1,projectId:null,amount:3200,date:"2026-03-20",dueDate:"2026-04-20",status:"Pending",paymentDate:null,paymentMethod:null,qbId:null,notes:"Consulting hours — March",createdAt:"2026-03-20"},
    {id:4,clientId:3,projectId:3,amount:25000,date:"2026-02-01",dueDate:"2026-02-28",status:"Partial",paymentDate:"2026-02-25",paymentMethod:"Wire",qbId:null,notes:"First installment — website redesign",createdAt:"2026-02-01"}
  ];
  function loadInvoices() {
    try { return JSON.parse(localStorage.getItem(INVOICES_KEY)) || [...INVOICES_SEED]; }
    catch(e) { return [...INVOICES_SEED]; }
  }
  function saveInvoices(data) { localStorage.setItem(INVOICES_KEY, JSON.stringify(data)); }

  // Projects data structure removed — campaigns now carry activities directly

  // ── TEAM ROSTER (Operations) ──────────────────────────
  let rosterView = 'active';

  function toggleRosterView(mode) {
    rosterView = mode;
    const aBtn = document.getElementById('roster-active-btn');
    const allBtn = document.getElementById('roster-all-btn');
    if (aBtn) aBtn.classList.toggle('active', mode === 'active');
    if (allBtn) allBtn.classList.toggle('active', mode === 'all');
    renderRoster();
  }

  function renderRoster() {
    const grid = document.getElementById('roster-grid');
    if (!grid) return;

    const labor = loadLaborTracking();
    const campaigns = loadCampaigns();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Compute month window
    const ym = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const sevenDaysAgo = new Date(now); sevenDaysAgo.setDate(now.getDate() - 7);
    const fourteenDaysAgo = new Date(now); fourteenDaysAgo.setDate(now.getDate() - 14);
    const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);

    // Collect all unique contractor names from labor + TEAM_MEMBERS
    const labContractors = [...new Set(labor.map(l => l.contractor).filter(Boolean))];
    const allNames = [...new Set([...TEAM_MEMBERS.map(m => m.name), ...labContractors])];

    const members = allNames.map(name => {
      const teamDef = TEAM_MEMBERS.find(m => m.name === name) || {name, title: 'Contractor', rate: 0, capacity: 160};
      const laborEntries = labor.filter(l => l.contractor === name);

      // Month hours
      const monthEntries = laborEntries.filter(l => l.date && l.date.startsWith(ym));
      const monthHours = monthEntries.reduce((s, l) => s + (l.hours || 0), 0);

      // Last active date
      const sortedDates = laborEntries.map(l => l.date).filter(Boolean).sort().reverse();
      const lastActiveDate = sortedDates[0] ? new Date(sortedDates[0]) : null;

      // Activity status
      let statusDot, statusTitle;
      if (!lastActiveDate) {
        statusDot = '#aaa'; statusTitle = 'No recent activity';
      } else if (lastActiveDate >= sevenDaysAgo) {
        statusDot = '#2d6a4f'; statusTitle = 'Active in last 7 days';
      } else if (lastActiveDate >= fourteenDaysAgo) {
        statusDot = '#c4932a'; statusTitle = 'Active 8-14 days ago';
      } else {
        statusDot = '#aaa'; statusTitle = '15+ days since last activity';
      }

      const isActive = lastActiveDate && lastActiveDate >= thirtyDaysAgo;

      // Campaigns in last 30 days
      const recentCampaignIds = [...new Set(
        laborEntries.filter(l => l.date && new Date(l.date) >= thirtyDaysAgo).map(l => l.campaignId || l.projectId).filter(Boolean)
      )];
      const assignedProjects = recentCampaignIds.map(cid => {
        const camp = campaigns.find(c => c.id === cid);
        if (!camp) return null;
        const ownedActs = (camp.activities || []).filter(a => a.assignee === name);
        return {proj: camp, ownedDelivs: ownedActs};
      }).filter(Boolean);

      // Utilization
      const utilPct = Math.min(100, Math.round((monthHours / (teamDef.capacity || 160)) * 100));

      return {name, teamDef, monthHours, statusDot, statusTitle, isActive, assignedProjects, utilPct};
    });

    const toRender = rosterView === 'active' ? members.filter(m => m.isActive) : members;

    if (!toRender.length) {
      grid.innerHTML = '<div style="color:var(--forest-mid);font-style:italic;padding:1rem">No team members to display.</div>';
      return;
    }

    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(260px, 1fr))';
    grid.style.gap = '1rem';

    grid.innerHTML = toRender.map(m => {
      const initials = m.name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
      const projectsHTML = m.assignedProjects.length
        ? m.assignedProjects.map(({proj, ownedDelivs}) => {
            const tags = ownedDelivs.length
              ? ownedDelivs.map(d => `<span class="roster-deliverable-tag">${d.name}</span>`).join('')
              : '';
            return `<div class="roster-project-item">
              <span style="font-weight:700;color:var(--forest)">${proj.name}</span>
              ${tags ? `<div style="margin-top:2px">${tags}</div>` : ''}
            </div>`;
          }).join('')
        : '<div style="font-size:0.8rem;color:#bbb;font-style:italic">No active campaigns this month</div>';

      return `<div class="roster-card">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:0.75rem">
          <div class="roster-avatar">${initials}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:0.95rem;font-weight:700;color:var(--forest);line-height:1.2">${m.name}</div>
            <div style="font-size:0.8rem;color:var(--forest-mid)">${m.teamDef.title}</div>
          </div>
          <div style="width:10px;height:10px;border-radius:50%;background:${m.statusDot};flex-shrink:0" title="${m.statusTitle}"></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;font-size:0.8rem;color:var(--forest-mid)">
          <span><strong style="font-size:1.1rem;color:var(--forest)">${m.monthHours}h</strong> this month</span>
          <span>${m.utilPct}% utilized</span>
        </div>
        <div class="roster-util-bar"><div class="roster-util-fill" style="width:${m.utilPct}%"></div></div>
        <div style="font-size:0.75rem;color:var(--forest-mid);margin-bottom:0.5rem">${m.teamDef.capacity}h monthly capacity · $${m.teamDef.rate}/hr</div>
        <div style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--gold);margin-bottom:0.4rem">Active Projects</div>
        ${projectsHTML}
      </div>`;
    }).join('');
  }

  // ── LABOR TRACKING DATA (Operations) ──────────────────
  const LABOR_TRACKING_KEY = 'meridian_labor';
  const LABOR_TRACKING_SEED = [
    {id:1,userId:1,contractor:"Nicole Feenstra",projectId:1,clientId:1,campaignId:1,activity:"Strategy",date:"2026-03-25",hours:8,hourlyRate:175,category:"Billable",notes:"Campaign strategy & client meeting",approved:true,createdAt:"2026-03-25"},
    {id:2,userId:1,contractor:"Sarah Chen",projectId:1,clientId:1,campaignId:1,activity:"Development",date:"2026-03-26",hours:6,hourlyRate:125,category:"Billable",notes:"Platform architecture review",approved:true,createdAt:"2026-03-26"},
    {id:3,userId:1,contractor:"Jade Thompson",projectId:2,clientId:2,campaignId:2,activity:"Design",date:"2026-03-27",hours:4,hourlyRate:100,category:"Billable",notes:"Design concepts & client feedback",approved:true,createdAt:"2026-03-27"},
    {id:4,userId:1,contractor:"Marcus Rivera",projectId:3,clientId:3,campaignId:3,activity:"Analytics",date:"2026-03-27",hours:3,hourlyRate:110,category:"Billable",notes:"Website audit & requirements doc",approved:true,createdAt:"2026-03-27"},
    {id:5,userId:1,contractor:"Nicole Feenstra",projectId:null,clientId:null,campaignId:null,activity:"Admin",date:"2026-03-28",hours:2,hourlyRate:175,category:"Internal",notes:"Team planning & admin",approved:true,createdAt:"2026-03-28"},
    {id:6,userId:1,contractor:"Nicole Feenstra",projectId:1,clientId:1,campaignId:1,activity:"Client Meeting",date:"2026-04-01",hours:3,hourlyRate:175,category:"Billable",notes:"Q2 campaign planning session",approved:true,createdAt:"2026-04-01"},
    {id:7,userId:1,contractor:"Jade Thompson",projectId:2,clientId:2,campaignId:2,activity:"Content Creation",date:"2026-04-02",hours:5,hourlyRate:100,category:"Billable",notes:"Menu photo shoot coordination",approved:true,createdAt:"2026-04-02"},
    {id:8,userId:1,contractor:"Sarah Chen",projectId:3,clientId:3,campaignId:3,activity:"Development",date:"2026-04-02",hours:4,hourlyRate:125,category:"Billable",notes:"Landing page build",approved:true,createdAt:"2026-04-02"},
    {id:9,userId:1,contractor:"Alex Kim",projectId:1,clientId:1,campaignId:null,activity:"Analytics",date:"2026-04-03",hours:2,hourlyRate:90,category:"Billable",notes:"Monthly performance report",approved:true,createdAt:"2026-04-03"},
    {id:10,userId:1,contractor:"Marcus Rivera",projectId:2,clientId:2,campaignId:2,activity:"Strategy",date:"2026-04-03",hours:3,hourlyRate:110,category:"Billable",notes:"Competitive analysis & positioning",approved:true,createdAt:"2026-04-03"}
  ];
  function loadLaborTracking() {
    try { return JSON.parse(localStorage.getItem(LABOR_TRACKING_KEY)) || [...LABOR_TRACKING_SEED]; }
    catch(e) { return [...LABOR_TRACKING_SEED]; }
  }
  function saveLaborTracking(data) { localStorage.setItem(LABOR_TRACKING_KEY, JSON.stringify(data)); }

  const DONOR_STAGE_LABEL = {education:'Education',engagement:'Engagement',ask:'Ask',thank:'Thank'};
  const DONOR_STAGE_BADGE = {education:'badge-new',engagement:'badge-warm',ask:'badge-active',thank:'badge-active'};
  const GRANT_STATUS_LABEL = {research:'Research',pending:'Pending','in-review':'In Review',awarded:'Awarded',declined:'Declined'};
  const GRANT_STATUS_BADGE = {research:'badge-new',pending:'badge-warm','in-review':'badge-active',awarded:'badge-active',declined:'badge-closed'};

  function getFilteredDonors() {
    const q = (document.getElementById('donor-search')?.value || '').toLowerCase();
    const stage = document.getElementById('donor-stage-filter')?.value || '';
    const type = document.getElementById('donor-type-filter')?.value || '';
    return getCampaignDonors().filter(d => {
      const hay = `${d.name} ${d.organization} ${d.email} ${(d.tags||[]).join(' ')}`.toLowerCase();
      return (!q || hay.includes(q)) && (!stage || d.stage === stage) && (!type || d.type === type);
    });
  }

  function renderBusinessKPIs() {
    renderDashboardHeroKPIs();
    renderDashboardRevenueByClient();
    renderDashboardExpenseDonut();
    renderDashboardCashFlow();
    renderDashboardInvoicePipeline();
    renderDashboardBankCards();
    renderDashboardTransactions();
    renderBalanceSheet();
    renderBankFeeds();
  }

  function renderFinanceKPIs() {
    const donors = getCampaignDonors();
    const grants = getCampaignGrants();
    const ytd = donors.filter(d => d.stage === 'thank').reduce((s,d) => s+d.amount, 0);
    const ask  = donors.filter(d => d.stage === 'ask').reduce((s,d) => s+d.amount, 0);
    const grantsPipeline = grants.filter(g => ['pending','in-review'].includes(g.status)).reduce((s,g) => s+g.amount, 0);
    document.getElementById('fin-kpi-gifts').textContent  = '$' + (ytd >= 1000 ? Math.round(ytd/1000)+'K' : ytd);
    document.getElementById('fin-kpi-ask').textContent    = '$' + (ask >= 1000 ? Math.round(ask/1000)+'K' : ask);
    document.getElementById('fin-kpi-grants').textContent = '$' + (grantsPipeline >= 1000 ? Math.round(grantsPipeline/1000)+'K' : grantsPipeline);
    document.getElementById('fin-kpi-donors').textContent = donors.length;
  }

  let CURRENT_CAMPAIGN = 'ALL';
  let FINANCE_VIEW = 'dna'; // 'dna' | 'campaigns'

  const CAMPAIGN_LABELS = {
    'ALL': 'All Campaigns',
    'rebuilding-california': 'Rebuilding California',
    'prop-development': 'Prop Development Initiative',
    'casa-verde': 'Casa Verde Restaurant',
    'pacific-legal': 'Pacific Legal Group'
  };

  // ── CLIENT CONFIG ──────────────────────────────────────
  // Toggle features per client instance. Code stays — just hidden.
  const MERIDIAN_CONFIG = {
    tabs: {
      campaign: true,
      crm: true,
      finance: true,
      operations: true,
      studio: false,      // Creative Studio — hidden for DNA Agency
      proposals: false,   // Proposals — hidden for DNA Agency
      phase2: true
    }
  };

  // ── TEAM MEMBERS ──────────────────────────────────────
  const TEAM_MEMBERS = [
    {name: 'Nicole Feenstra', title: 'Founder & CD', rate: 175, capacity: 80},
    {name: 'Sarah Chen', title: 'Developer', rate: 125, capacity: 160},
    {name: 'Jade Thompson', title: 'Designer', rate: 100, capacity: 120},
    {name: 'Marcus Rivera', title: 'Strategist', rate: 110, capacity: 100},
    {name: 'Alex Kim', title: 'Analytics', rate: 90, capacity: 80}
  ];

  // Apply tab visibility from config
  Object.entries(MERIDIAN_CONFIG.tabs).forEach(([tab, visible]) => {
    if (!visible) {
      const btn = document.querySelector(`[data-tab="${tab}"]`);
      const panel = document.getElementById(tab);
      if (btn) btn.style.display = 'none';
      if (panel) panel.style.display = 'none';
    }
  });

  // Campaigns that are nonprofits — show donor + grant tools when selected
  const NONPROFIT_CAMPAIGNS = new Set(['rebuilding-california', 'prop-development']);

  // ── Finance entity toggle ──────────────────────────────
  function switchFinanceView(view) {
    FINANCE_VIEW = view;
    const dnaView = document.getElementById('fin-view-dna');
    const campView = document.getElementById('fin-view-campaigns');
    const dnaBtnEl = document.getElementById('fin-toggle-dna');
    const campBtnEl = document.getElementById('fin-toggle-campaigns');
    const titleEl = document.getElementById('fin-section-title');
    const subEl = document.getElementById('fin-section-sub');

    if (view === 'dna') {
      dnaView.style.display = '';
      campView.style.display = 'none';
      dnaBtnEl.style.background = 'var(--forest)';
      dnaBtnEl.style.color = 'var(--ivory)';
      campBtnEl.style.background = 'var(--white)';
      campBtnEl.style.color = 'var(--forest-mid)';
      titleEl.textContent = 'DNA Agency';
      subEl.textContent = 'Business financials — revenue, invoices & integrations';
      renderBusinessKPIs();
      renderInvoices();
    } else {
      dnaView.style.display = 'none';
      campView.style.display = '';
      campBtnEl.style.background = 'var(--forest)';
      campBtnEl.style.color = 'var(--ivory)';
      dnaBtnEl.style.background = 'var(--white)';
      dnaBtnEl.style.color = 'var(--forest-mid)';
      titleEl.textContent = 'Campaigns';
      subEl.textContent = CURRENT_CAMPAIGN === 'ALL' ? 'All Campaigns · Q1 2026' : CAMPAIGN_LABELS[CURRENT_CAMPAIGN] + ' · Q1 2026';
      renderFinanceKPIs();
      renderCampaignPL();
      // Show nonprofit section based on current selection
      const isNonprofit = NONPROFIT_CAMPAIGNS.has(CURRENT_CAMPAIGN);
      const showNonprofit = isNonprofit || CURRENT_CAMPAIGN === 'ALL';
      const nonprofitSection = document.getElementById('fin-nonprofit-section');
      const nonprofitLabel = document.getElementById('fin-nonprofit-label');
      if (nonprofitSection) {
        nonprofitSection.style.display = showNonprofit ? '' : 'none';
        if (nonprofitLabel) nonprofitLabel.textContent = isNonprofit ? '— Nonprofit Programs' : '— All Nonprofit Campaigns';
      }
      if (showNonprofit) { renderDonorPipeline(getFilteredDonors()); renderGrantTracker(); }
    }
  }

  function switchCampaign() {
    CURRENT_CAMPAIGN = document.getElementById('campaign-selector').value;
    const label = CAMPAIGN_LABELS[CURRENT_CAMPAIGN] || 'All Campaigns';
    const sub = CURRENT_CAMPAIGN === 'ALL' ? 'All Campaigns · Q1 2026' : label + ' · Q1 2026';
    document.getElementById('fin-campaign-sub').textContent = sub;
    document.getElementById('fin-section-sub').textContent = sub;

    // Show nonprofit donor/grant section only for nonprofit campaigns
    const isNonprofit = NONPROFIT_CAMPAIGNS.has(CURRENT_CAMPAIGN);
    // Also show when ALL selected (so nonprofit data is still visible in macro view)
    const showNonprofit = isNonprofit || CURRENT_CAMPAIGN === 'ALL';
    const nonprofitSection = document.getElementById('fin-nonprofit-section');
    const nonprofitLabel = document.getElementById('fin-nonprofit-label');
    if (nonprofitSection) {
      nonprofitSection.style.display = showNonprofit ? '' : 'none';
      if (nonprofitLabel) {
        nonprofitLabel.textContent = isNonprofit ? '— Nonprofit Programs' : '— All Nonprofit Campaigns';
      }
    }

    renderFinanceKPIs();
    renderCampaignPL();
    if (showNonprofit) {
      renderDonorPipeline(getFilteredDonors());
      renderGrantTracker();
    }
  }

  function getCampaignDonors() {
    if (CURRENT_CAMPAIGN === 'ALL') return loadDonors();
    return loadDonors().filter(d => d.campaign === CURRENT_CAMPAIGN);
  }

  function getCampaignGrants() {
    if (CURRENT_CAMPAIGN === 'ALL') return loadGrants();
    return loadGrants().filter(g => g.campaign === CURRENT_CAMPAIGN);
  }

  // ── Campaign P&L summary cards ─────────────────────────
  function renderCampaignPL() {
    const el = document.getElementById('campaign-pl-summary');
    if (!el) return;

    const campaigns = loadCampaigns();
    const invoices = loadInvoices();
    const labor = loadLaborTracking();

    const activeCampaigns = CURRENT_CAMPAIGN === 'ALL'
      ? campaigns
      : campaigns.filter(c => c.id === CURRENT_CAMPAIGN || c.name.toLowerCase().replace(/\s+/g,'-') === CURRENT_CAMPAIGN);

    if (!activeCampaigns.length) { el.innerHTML = ''; return; }

    const cards = activeCampaigns.map(c => {
      const campInvoices = invoices.filter(i => i.campaignId === c.id || (i.notes && i.notes.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])));
      const campLabor = labor.filter(l => l.campaignId === c.id);
      const revenue = campInvoices.filter(i => i.status === 'Funded').reduce((s,i) => s+i.amount, 0);
      const pending = campInvoices.filter(i => i.status !== 'Funded').reduce((s,i) => s+i.amount, 0);
      const laborCost = campLabor.reduce((s,l) => s + (l.hours * l.hourlyRate), 0);
      const margin = revenue > 0 ? ((revenue - laborCost) / revenue * 100).toFixed(0) : null;
      const marginColor = margin === null ? 'var(--forest-mid)' : margin >= 50 ? 'var(--forest)' : margin >= 20 ? 'var(--gold-deep)' : '#CC4444';
      const budgetPct = c.budget > 0 ? Math.min(100, Math.round(laborCost / c.budget * 100)) : 0;

      return `<div style="background:var(--white);border:1px solid var(--parchment);padding:1.2rem 1.4rem;border-radius:3px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.8rem">
          <div>
            <div style="font-size:1rem;font-weight:700;color:var(--forest)">${c.name}</div>
            <div style="font-size:0.9rem;color:var(--forest-mid)">${c.client || '—'}</div>
          </div>
          <span class="badge badge-${c.status === 'Active' ? 'active' : 'new'}">${c.status || 'Active'}</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-bottom:0.8rem">
          <div>
            <div style="font-size:0.85rem;font-weight:700;color:var(--forest-mid);text-transform:uppercase;letter-spacing:0.06em">Revenue</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--forest)">$${revenue.toLocaleString()}</div>
          </div>
          <div>
            <div style="font-size:0.85rem;font-weight:700;color:var(--forest-mid);text-transform:uppercase;letter-spacing:0.06em">Pending</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--gold-deep)">$${pending.toLocaleString()}</div>
          </div>
          <div>
            <div style="font-size:0.85rem;font-weight:700;color:var(--forest-mid);text-transform:uppercase;letter-spacing:0.06em">Labor Cost</div>
            <div style="font-size:1.1rem;font-weight:700;color:var(--charcoal)">$${laborCost.toLocaleString()}</div>
          </div>
          <div>
            <div style="font-size:0.85rem;font-weight:700;color:var(--forest-mid);text-transform:uppercase;letter-spacing:0.06em">Margin</div>
            <div style="font-size:1.1rem;font-weight:700;color:${marginColor}">${margin !== null ? margin + '%' : '—'}</div>
          </div>
        </div>
        ${c.budget > 0 ? `<div style="margin-top:0.4rem">
          <div style="font-size:0.85rem;color:var(--forest-mid);margin-bottom:0.3rem">Budget utilization: $${laborCost.toLocaleString()} of $${c.budget.toLocaleString()} (${budgetPct}%)</div>
          <div style="height:4px;background:var(--parchment);border-radius:2px">
            <div style="height:4px;width:${budgetPct}%;background:${budgetPct > 90 ? '#CC4444' : budgetPct > 70 ? 'var(--gold)' : 'var(--forest)'};border-radius:2px;transition:width 600ms ease"></div>
          </div>
        </div>` : ''}
      </div>`;
    }).join('');

    el.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:1rem;margin-bottom:1.5rem">${cards}</div>`;
  }

  function renderFinance() {
    renderCampaignLaborCosts(); // always render — section is above the toggle
    if (FINANCE_VIEW === 'dna') {
      renderConsolidatedDashboard();
    } else {
      renderFinanceKPIs();
      renderCampaignPL();
      renderDonorPipeline(getFilteredDonors());
      renderGrantTracker();
    }
  }

  // ── COLLAPSIBLE SECTIONS ──────────────────────────────
  function toggleCollapse(headerEl) {
    const content = headerEl.nextElementSibling;
    // Find the arrow indicator (rightmost child with the ▾ symbol)
    const indicator = Array.from(headerEl.children).find(el => el.textContent.includes('▾'));
    if (!indicator) return;
    
    if (content.style.display === 'none') {
      content.style.display = '';
      indicator.style.transform = 'rotate(180deg)';
    } else {
      content.style.display = 'none';
      indicator.style.transform = 'rotate(0deg)';
    }
  }

  // ── CONSOLIDATED FINANCIAL DASHBOARD ──────────────────
  function renderConsolidatedDashboard() {
    const qbConfig = loadQBConfig();
    const bankConnected = localStorage.getItem('meridian_bank_connected') === 'true';
    renderBusinessKPIs();
    updateIntegrationStatusBadges(qbConfig.status === 'configured', bankConnected);
  }

  // ── NEW DASHBOARD RENDERERS ─────────────────────────────

  const DASH_FMT = n => '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0});
  const DASH_FMT_K = n => n >= 10000 ? '$' + (n/1000).toFixed(1) + 'K' : '$' + n.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:0});

  const DONUT_COLORS = ['#2C4A3E','#C9A84C','#C0392B','#2980B9','#8E44AD','#E67E22'];

  function renderDashboardHeroKPIs() {
    const revenue = QB_INVOICES_DEMO.filter(i => i.status === 'Paid').reduce((s,i) => s + i.amount, 0);
    const expenses = QB_EXPENSES_DEMO.reduce((s,e) => s + e.amount, 0);
    const net = revenue - expenses;
    const margin = revenue > 0 ? ((net / revenue) * 100).toFixed(1) : 0;
    const totalCash = Object.values(BANK_ACCOUNTS_DEMO).flat().reduce((s,a) => s + (a.balance || 0), 0);
    const accountCount = Object.values(BANK_ACCOUNTS_DEMO).flat().length;

    document.getElementById('dash-revenue').textContent = DASH_FMT(revenue);
    document.getElementById('dash-expenses').textContent = DASH_FMT(expenses);

    const netEl = document.getElementById('dash-net');
    netEl.textContent = (net >= 0 ? '+' : '-') + DASH_FMT(net);
    netEl.style.color = net >= 0 ? 'var(--forest)' : 'var(--ember)';

    document.getElementById('dash-cash').textContent = DASH_FMT(totalCash);
    document.getElementById('dash-accounts-count').textContent = accountCount;

    // Trend badges
    const paidCount = QB_INVOICES_DEMO.filter(i => i.status === 'Paid').length;
    document.getElementById('dash-revenue-trend').textContent = paidCount + ' paid';
    document.getElementById('dash-revenue-trend').className = 'fin-kpi-trend up';
    document.getElementById('dash-expenses-trend').textContent = QB_EXPENSES_DEMO.length + ' cats';
    document.getElementById('dash-expenses-trend').className = 'fin-kpi-trend down';

    const marginBadge = document.getElementById('dash-margin-badge');
    marginBadge.textContent = margin + '%';
    marginBadge.className = 'fin-kpi-trend ' + (net >= 0 ? 'up' : 'down');

    // Update BS summary
    const bsEl = document.getElementById('kpi-bs-summary');
    if (bsEl) bsEl.textContent = 'Revenue: ' + DASH_FMT(revenue) + ' · Net: ' + (net >= 0 ? '+' : '-') + DASH_FMT(net);
  }

  function renderDashboardRevenueByClient() {
    const container = document.getElementById('dash-revenue-bars');
    if (!container) return;

    // Aggregate revenue by client
    const byClient = {};
    QB_INVOICES_DEMO.filter(i => i.status === 'Paid').forEach(inv => {
      byClient[inv.customer] = (byClient[inv.customer] || 0) + inv.amount;
    });

    const sorted = Object.entries(byClient).sort((a,b) => b[1] - a[1]);
    const maxVal = sorted.length > 0 ? sorted[0][1] : 1;

    const barColors = ['var(--forest)','var(--green)','var(--gold)','var(--blue)','#8E44AD','#E67E22'];

    container.innerHTML = sorted.map(([client, amount], i) => {
      const pct = (amount / maxVal * 100).toFixed(0);
      const color = barColors[i % barColors.length];
      return `
        <div class="fin-bar-row" onclick="drillRevenueClient('${client.replace(/'/g, "\\'")}')">
          <div class="fin-bar-label" title="${client}">${client}</div>
          <div class="fin-bar-track">
            <div class="fin-bar-fill" style="width:${pct}%;background:${color}">${pct > 30 ? DASH_FMT_K(amount) : ''}</div>
          </div>
          <div class="fin-bar-amount">${DASH_FMT_K(amount)}</div>
        </div>`;
    }).join('');
  }

  function renderDashboardExpenseDonut() {
    const container = document.getElementById('dash-expense-donut');
    if (!container) return;

    const totalExpenses = QB_EXPENSES_DEMO.reduce((s,e) => s + e.amount, 0);

    // Build conic-gradient segments
    let gradientParts = [];
    let cumPct = 0;
    QB_EXPENSES_DEMO.forEach((exp, i) => {
      const pct = (exp.amount / totalExpenses) * 100;
      gradientParts.push(`${DONUT_COLORS[i % DONUT_COLORS.length]} ${cumPct}% ${cumPct + pct}%`);
      cumPct += pct;
    });

    const legendItems = QB_EXPENSES_DEMO.map((exp, i) => {
      const pct = ((exp.amount / totalExpenses) * 100).toFixed(0);
      return `
        <div class="fin-legend-item" onclick="drillSpendingCategory('${exp.category.replace(/'/g, "\\'")}')">
          <div class="fin-legend-dot" style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></div>
          <div class="fin-legend-label">${exp.category} <span style="color:#999;font-size:0.7rem">${pct}%</span></div>
          <div class="fin-legend-val">${DASH_FMT_K(exp.amount)}</div>
        </div>`;
    }).join('');

    container.innerHTML = `
      <div class="fin-donut-wrap">
        <div class="fin-donut" style="background:conic-gradient(${gradientParts.join(',')})">
          <div class="fin-donut-center">
            <div class="fin-donut-center-val">${DASH_FMT_K(totalExpenses)}</div>
            <div class="fin-donut-center-lbl">Total</div>
          </div>
        </div>
        <div class="fin-legend">${legendItems}</div>
      </div>`;
  }

  function renderDashboardCashFlow() {
    const container = document.getElementById('dash-cashflow-chart');
    if (!container) return;

    // Aggregate by month from invoices and expenses
    const months = ['Jan','Feb','Mar','Apr'];
    const monthlyIncome = [0,0,0,0];
    const monthlyExpense = [0,0,0,0];

    QB_INVOICES_DEMO.filter(i => i.status === 'Paid').forEach(inv => {
      const m = new Date(inv.date).getMonth(); // 0=Jan
      if (m >= 0 && m <= 3) monthlyIncome[m] += inv.amount;
    });

    // Distribute expenses roughly by month (QB data is YTD aggregated)
    const totalExp = QB_EXPENSES_DEMO.reduce((s,e) => s + e.amount, 0);
    // Use bank transactions to approximate monthly expense distribution
    BANK_TRANSACTIONS_DEMO.filter(t => t.amount < 0).forEach(t => {
      const m = new Date(t.date).getMonth();
      if (m >= 0 && m <= 3) monthlyExpense[m] += Math.abs(t.amount);
    });
    // If bank txns undercount, scale to match QB total
    const bankExpTotal = monthlyExpense.reduce((s,v) => s+v, 0);
    if (bankExpTotal > 0 && bankExpTotal < totalExp) {
      const scale = totalExp / bankExpTotal;
      for (let i = 0; i < 4; i++) monthlyExpense[i] *= scale;
    }

    const maxBar = Math.max(...monthlyIncome, ...monthlyExpense, 1);

    container.innerHTML = `
      <div class="fin-cf-grid">
        ${months.map((m, i) => {
          const incH = Math.max((monthlyIncome[i] / maxBar) * 130, 2);
          const expH = Math.max((monthlyExpense[i] / maxBar) * 130, 2);
          return `
            <div class="fin-cf-col">
              <div class="fin-cf-bars">
                <div class="fin-cf-bar" style="height:${incH}px;background:var(--green)">
                  <span class="fin-cf-val" style="color:var(--green)">${DASH_FMT_K(monthlyIncome[i])}</span>
                </div>
                <div class="fin-cf-bar" style="height:${expH}px;background:var(--ember)">
                  <span class="fin-cf-val" style="color:var(--ember)">${DASH_FMT_K(monthlyExpense[i])}</span>
                </div>
              </div>
              <div class="fin-cf-label">${m}</div>
            </div>`;
        }).join('')}
      </div>`;
  }

  function renderDashboardInvoicePipeline() {
    const container = document.getElementById('dash-invoice-pipeline');
    if (!container) return;

    const stages = [
      {key:'Open', label:'OPEN', bg:'#fff8e1', color:'#F39C12', border:'#F39C12'},
      {key:'Sent', label:'SENT', bg:'#e3f2fd', color:'#2980B9', border:'#2980B9'},
      {key:'Paid', label:'PAID', bg:'#e8f5e9', color:'#27AE60', border:'#27AE60'},
      {key:'Overdue', label:'OVERDUE', bg:'#fce4ec', color:'#C0392B', border:'#C0392B'}
    ];

    const counts = {};
    const amounts = {};
    stages.forEach(s => { counts[s.key] = 0; amounts[s.key] = 0; });

    QB_INVOICES_DEMO.forEach(inv => {
      const status = inv.status === 'Paid' ? 'Paid' : inv.status;
      if (counts[status] !== undefined) {
        counts[status]++;
        amounts[status] += inv.amount;
      }
    });

    document.getElementById('dash-invoice-total').textContent = QB_INVOICES_DEMO.length + ' invoices';

    container.innerHTML = `
      <div class="fin-pipeline">
        ${stages.map(s => `
          <div class="fin-pipe-stage" style="background:${s.bg};border:1px solid ${s.border}30" onclick="drillInvoiceStage('${s.key}')">
            <div class="fin-pipe-count" style="color:${s.color}">${counts[s.key]}</div>
            <div class="fin-pipe-label" style="color:${s.color}">${s.label}</div>
            <div class="fin-pipe-amt" style="color:${s.color}">${DASH_FMT_K(amounts[s.key])}</div>
          </div>
        `).join('')}
      </div>`;
  }

  function renderDashboardBankCards() {
    const container = document.getElementById('dash-bank-cards');
    if (!container) return;

    const cards = [];
    for (const [bank, accounts] of Object.entries(BANK_ACCOUNTS_DEMO)) {
      accounts.forEach(acct => {
        cards.push({
          bank,
          name: acct.name,
          mask: acct.mask,
          type: acct.type,
          balance: acct.balance,
          available: acct.available
        });
      });
    }

    container.innerHTML = cards.map(c => {
      const isCredit = c.type === 'credit';
      const balColor = c.balance < 0 ? 'var(--ember)' : 'var(--forest)';
      return `
        <div class="fin-bank-card">
          <div class="fin-bank-name">${c.bank} ••${c.mask}</div>
          <div class="fin-bank-bal" style="color:${balColor}">${(c.balance < 0 ? '-' : '') + DASH_FMT(c.balance)}</div>
          <div class="fin-bank-type">${c.type}${isCredit ? ' · Avail: ' + DASH_FMT(c.available) : ''}</div>
        </div>`;
    }).join('');
  }

  function renderDashboardTransactions() {
    const container = document.getElementById('dash-transactions');
    if (!container) return;

    const allTxns = [];
    QB_INVOICES_DEMO.forEach(inv => {
      allTxns.push({ date: inv.date, description: inv.customer + ' — ' + inv.description, amount: inv.amount, source: 'QB' });
    });
    BANK_TRANSACTIONS_DEMO.forEach(txn => {
      allTxns.push({ date: txn.date, description: txn.description, amount: txn.amount, source: 'Bank' });
    });
    allTxns.sort((a,b) => new Date(b.date) - new Date(a.date));

    document.getElementById('dash-txn-count').textContent = allTxns.length + ' total';

    container.innerHTML = allTxns.slice(0, 15).map(t => {
      const amtColor = t.amount > 0 ? 'var(--green)' : 'var(--ember)';
      const sign = t.amount > 0 ? '+' : '-';
      return `
        <div class="fin-txn-row">
          <div class="fin-txn-date">${new Date(t.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
          <div class="fin-txn-desc">${t.description}</div>
          <div class="fin-txn-amt" style="color:${amtColor}">${sign}${DASH_FMT(t.amount)}</div>
          <div class="fin-txn-src">${t.source}</div>
        </div>`;
    }).join('') || '<div style="padding:1rem;text-align:center;color:#999">No transactions</div>';
  }

  // Drill-down for revenue by client
  function drillRevenueClient(clientName) {
    const invoices = QB_INVOICES_DEMO.filter(i => i.customer === clientName && i.status === 'Paid');
    const total = invoices.reduce((s,i) => s + i.amount, 0);
    const rows = invoices.map(i => `
      <tr style="border-bottom:1px solid var(--parchment)">
        <td style="padding:0.5rem;font-size:0.85rem;color:#999">${i.id}</td>
        <td style="padding:0.5rem;color:var(--forest)">${i.description}</td>
        <td style="padding:0.5rem;font-size:0.85rem;color:#999">${new Date(i.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td>
        <td style="padding:0.5rem;text-align:right;font-weight:700;color:var(--green)">${DASH_FMT(i.amount)}</td>
      </tr>`).join('');
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">Revenue: ${clientName}</div>
            <div class="drill-sub">${invoices.length} paid invoices · Total: ${DASH_FMT(total)}</div>
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button>
        </div>
        <table class="drill-table">
          <thead><tr><th>Invoice</th><th>Description</th><th>Date</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`);
  }

  // Drill-down for invoice stage
  function drillInvoiceStage(stage) {
    const invoices = QB_INVOICES_DEMO.filter(i => i.status === stage);
    const total = invoices.reduce((s,i) => s + i.amount, 0);
    const rows = invoices.map(i => `
      <tr style="border-bottom:1px solid var(--parchment)">
        <td style="padding:0.5rem;font-size:0.85rem;color:#999">${i.id}</td>
        <td style="padding:0.5rem;color:var(--forest)">${i.customer}</td>
        <td style="padding:0.5rem;color:var(--forest-mid)">${i.description}</td>
        <td style="padding:0.5rem;font-size:0.85rem;color:#999">${new Date(i.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</td>
        <td style="padding:0.5rem;text-align:right;font-weight:700">${DASH_FMT(i.amount)}</td>
      </tr>`).join('');
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">${stage} Invoices</div>
            <div class="drill-sub">${invoices.length} invoices · Total: ${DASH_FMT(total)}</div>
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button>
        </div>
        <table class="drill-table">
          <thead><tr><th>ID</th><th>Client</th><th>Description</th><th>Date</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`);
  }

  function updateIntegrationStatusBadges(qbConnected, bankConnected) {
    const qbStatusEl = document.getElementById('fin-qb-status');
    const bankStatusEl = document.getElementById('fin-bank-status');
    const receiptStatusEl = document.getElementById('fin-receipt-status');
    const receiptCount = JSON.parse(localStorage.getItem('meridian_receipts') || '[]').length;

    if (qbStatusEl) {
      qbStatusEl.textContent = qbConnected ? 'Connected' : 'Demo Mode';
      qbStatusEl.style.color = qbConnected ? '#27AE60' : '#2CA01C';
    }
    if (bankStatusEl) {
      bankStatusEl.textContent = bankConnected ? 'Connected' : 'Not Connected';
      bankStatusEl.style.color = bankConnected ? '#27AE60' : '#999';
    }
    if (receiptStatusEl) {
      receiptStatusEl.textContent = receiptCount + ' captured';
      receiptStatusEl.style.color = receiptCount > 0 ? 'var(--forest)' : '#999';
    }
  }

  // ══════════════════════════════════════════════════════
  // INTEGRATIONS: QB · BANK/PLAID · RECEIPT CAPTURE
  // ══════════════════════════════════════════════════════

  // ── QB DEMO DATA ──────────────────────────────────────
  const QB_INVOICES_DEMO = [
    {id:'QB-001', customer:'Momentum Fitness',        amount:6500,  status:'Paid',    date:'2026-01-15', description:'Social Media Campaign Q1'},
    {id:'QB-002', customer:'Casa Verde Restaurant',   amount:3200,  status:'Paid',    date:'2026-01-22', description:'Brand Identity + Menu Design'},
    {id:'QB-003', customer:'Pacific Legal Group',     amount:4800,  status:'Paid',    date:'2026-02-01', description:'Website Redesign Phase 1'},
    {id:'QB-004', customer:'Rebuilding California',   amount:2100,  status:'Paid',    date:'2026-02-10', description:'Grant Writing + Reporting'},
    {id:'QB-005', customer:'Momentum Fitness',        amount:5500,  status:'Paid',    date:'2026-03-01', description:'Q2 Campaign + Analytics'},
    {id:'QB-006', customer:'Pacific Legal Group',     amount:1200,  status:'Paid',    date:'2026-02-15', description:'Monthly Retainer Feb'},
    {id:'QB-007', customer:'Momentum Fitness',        amount:3250,  status:'Paid',    date:'2026-04-03', description:'April Campaign Phase 1'},
    {id:'QB-008', customer:'Casa Verde Restaurant',   amount:2800,  status:'Sent',    date:'2026-04-08', description:'Menu Redesign + Photography'},
    {id:'QB-009', customer:'Pacific Legal Group',     amount:1200,  status:'Paid',    date:'2026-03-15', description:'Monthly Retainer Mar'},
    {id:'QB-010', customer:'Solara Skincare',         amount:4200,  status:'Paid',    date:'2026-01-20', description:'Launch Campaign + Influencer'},
    {id:'QB-011', customer:'Solara Skincare',         amount:2800,  status:'Paid',    date:'2026-02-20', description:'Social Media Mgmt Feb'},
    {id:'QB-012', customer:'Rebuilding California',   amount:3500,  status:'Paid',    date:'2026-03-05', description:'Annual Report Design'},
    {id:'QB-013', customer:'Momentum Fitness',        amount:1800,  status:'Paid',    date:'2026-03-20', description:'Email Nurture Sequence'},
    {id:'QB-014', customer:'Casa Verde Restaurant',   amount:1500,  status:'Paid',    date:'2026-03-28', description:'Social Media Mgmt Mar'},
    {id:'QB-015', customer:'Pacific Legal Group',     amount:6500,  status:'Open',    date:'2026-04-01', description:'Website Redesign Phase 2'},
    {id:'QB-016', customer:'Momentum Fitness',        amount:2200,  status:'Open',    date:'2026-04-05', description:'Video Production Sprint'},
    {id:'QB-017', customer:'Rebuilding California',   amount:1800,  status:'Sent',    date:'2026-04-07', description:'Q1 Impact Report'},
    {id:'QB-018', customer:'Solara Skincare',         amount:3400,  status:'Open',    date:'2026-04-02', description:'Spring Collection Creative'},
    {id:'QB-019', customer:'Sierra Joint CCD',        amount:46000, status:'Paid',    date:'2026-02-28', description:'Invoice #1137 — BI/Mech/IT Site Mgmt + BI/Mech/IT/ADVM Media Push (6 line items)'}
  ];

  const QB_EXPENSES_DEMO = [
    {category:'Contractor Payments', amount:28500.00, items:[
      {vendor:'Sarah Chen', amount:9600, description:'Development — 64 hrs @ $150/hr', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Jade Thompson', amount:8400, description:'Design — 84 hrs @ $100/hr', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Marcus Rivera', amount:5200, description:'Strategy — 40 hrs @ $130/hr', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Alex Kim', amount:5300, description:'Analytics — 53 hrs @ $100/hr', date:'2026-01-01 to 2026-04-07'}
    ]},
    {category:'Advertising', amount:12400.00, items:[
      {vendor:'Meta Ads', amount:7200, description:'Facebook/Instagram campaigns', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Google Ads', amount:3800, description:'Search + Display campaigns', date:'2026-01-01 to 2026-04-07'},
      {vendor:'LinkedIn Ads', amount:1400, description:'Sponsored content', date:'2026-02-01 to 2026-04-07'}
    ]},
    {category:'Software & Tools', amount:1847.50, items:[
      {vendor:'Adobe Creative Cloud', amount:659.88, description:'6 months @ $109.98', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Google Workspace', amount:432.00, description:'6 users @ $12/mo × 6 mo', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Figma', amount:270.00, description:'Team plan — 6 months', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Canva Pro', amount:155.88, description:'Annual plan (prorated)', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Otter.ai', amount:119.88, description:'Business plan', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Other Tools', amount:209.86, description:'Misc subscriptions', date:'2026-01-01 to 2026-04-07'}
    ]},
    {category:'Office & Rent', amount:11200.00, items:[
      {vendor:'WeWork', amount:11200, description:'Shared office — 4 months @ $2,800', date:'2026-01-01 to 2026-04-07'}
    ]},
    {category:'Meals & Entertainment', amount:892.40, items:[
      {vendor:'Client lunches', amount:640, description:'8 client meetings', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Team events', amount:252.40, description:'Team dinners & coffee', date:'2026-01-01 to 2026-04-07'}
    ]},
    {category:'Travel & Transport', amount:640.20, items:[
      {vendor:'Uber/Lyft', amount:380.20, description:'Client site visits', date:'2026-01-01 to 2026-04-07'},
      {vendor:'Parking', amount:260.00, description:'Downtown LA parking', date:'2026-01-01 to 2026-04-07'}
    ]}
  ];

  // ── PROJECTS DEMO DATA ────────────────────────────────
  const PROJECTS_DEMO = [
    {id:1, name:'Momentum Fitness Summer Campaign', client:'Momentum Fitness', status:'Active', startDate:'2026-03-15', endDate:'2026-05-30', budget:12000, owner:'Mariana Sanchez', progress:65, deliverables:[{name:'Creative Assets',completed:true,dueDate:'2026-04-15'},{name:'Launch Campaign',completed:false,dueDate:'2026-04-30'},{name:'Analytics Report',completed:false,dueDate:'2026-05-15'}]},
    {id:2, name:'Casa Verde Brand Refresh', client:'Casa Verde Restaurant', status:'Active', startDate:'2026-02-01', endDate:'2026-04-30', budget:8500, owner:'Jason Thompson', progress:45, deliverables:[{name:'Logo Design',completed:true,dueDate:'2026-02-28'},{name:'Brand Guidelines',completed:false,dueDate:'2026-04-15'},{name:'Website Updates',completed:false,dueDate:'2026-04-30'}]},
    {id:3, name:'Pacific Legal Website Redesign', client:'Pacific Legal Group', status:'On-Hold', startDate:'2026-01-20', endDate:'2026-05-31', budget:15000, owner:'Sarah Chen', progress:30, deliverables:[{name:'UX Research',completed:true,dueDate:'2026-02-28'},{name:'Wireframes',completed:true,dueDate:'2026-03-31'},{name:'Development',completed:false,dueDate:'2026-05-15'},{name:'Testing',completed:false,dueDate:'2026-05-31'}]},
    {id:4, name:'Rebuilding California Grant Proposal', client:'Rebuilding California', status:'Closed', startDate:'2025-12-01', endDate:'2026-03-15', budget:5000, owner:'Mariana Sanchez', progress:100, deliverables:[{name:'Proposal Draft',completed:true,dueDate:'2026-02-15'},{name:'Final Submission',completed:true,dueDate:'2026-03-01'},{name:'Grant Awarded',completed:true,dueDate:'2026-03-15'}]},
    {id:5, name:'Q2 Social Media Strategy', client:'DNA Agency (Internal)', status:'Active', startDate:'2026-04-01', endDate:'2026-06-30', budget:6000, owner:'Jason Thompson', progress:20, deliverables:[{name:'Content Calendar',completed:true,dueDate:'2026-04-15'},{name:'Q2 Graphics',completed:false,dueDate:'2026-05-01'},{name:'Performance Review',completed:false,dueDate:'2026-06-30'}]}
  ];

  // ── BANK DEMO DATA ────────────────────────────────────
  const BANK_ACCOUNTS_DEMO = {
    'Chase': [
      {name:'Chase Business Checking', mask:'4821', type:'checking', balance:24830.50, available:22950.00},
      {name:'Chase Business Savings',  mask:'9103', type:'savings',  balance:45000.00, available:45000.00}
    ],
    'Bank of America': [
      {name:'BofA Business Advantage', mask:'3344', type:'checking', balance:18250.75, available:16800.00}
    ],
    'American Express': [
      {name:'Amex Business Gold', mask:'0001', type:'credit', balance:-3420.18, available:26579.82, limit:30000}
    ],
    'Wells Fargo': [
      {name:'WF Business Checking', mask:'7756', type:'checking', balance:11200.00, available:10800.00}
    ],
    'US Bank': [
      {name:'US Bank Business Checking', mask:'2290', type:'checking', balance:8400.00, available:8200.00}
    ],
    'Other': [
      {name:'Business Checking', mask:'0000', type:'checking', balance:5000.00, available:4800.00}
    ]
  };

  const BANK_TRANSACTIONS_DEMO = [
    {date:'2026-04-08', description:'CLIENT PAYMENT — Casa Verde',         amount:2800.00,  category:'Income',      account:'Chase ••4821'},
    {date:'2026-04-07', description:'Contractor — Alex Kim',               amount:-1000.00, category:'Contractor',  account:'Chase ••4821'},
    {date:'2026-04-07', description:'Rebuilding CA — Impact Report',       amount:1800.00,  category:'Income',      account:'BofA ••3344'},
    {date:'2026-04-05', description:'Adobe Creative Cloud',                amount:-54.99,   category:'Software',    account:'Amex ••0001'},
    {date:'2026-04-05', description:'LinkedIn Ads — Pacific Legal',        amount:-350.00,  category:'Advertising', account:'Amex ••0001'},
    {date:'2026-04-04', description:'META ADS — Momentum Fitness',         amount:-2400.00, category:'Advertising', account:'Amex ••0001'},
    {date:'2026-04-03', description:'CLIENT PAYMENT — Momentum Fitness',   amount:3250.00,  category:'Income',      account:'Chase ••4821'},
    {date:'2026-04-03', description:'Google Workspace',                    amount:-72.00,   category:'Software',    account:'Chase ••4821'},
    {date:'2026-04-02', description:'Contractor — Sarah Chen',             amount:-1500.00, category:'Contractor',  account:'Chase ••4821'},
    {date:'2026-04-02', description:'Contractor — Jade Thompson',          amount:-1200.00, category:'Contractor',  account:'Chase ••4821'},
    {date:'2026-04-01', description:'Office Rent — April',                 amount:-2800.00, category:'Rent',        account:'Chase ••4821'},
    {date:'2026-03-31', description:'CLIENT PAYMENT — Pacific Legal',      amount:4800.00,  category:'Income',      account:'Chase ••4821'},
    {date:'2026-03-30', description:'Figma Teams',                         amount:-45.00,   category:'Software',    account:'Amex ••0001'},
    {date:'2026-03-28', description:'CLIENT PAYMENT — Casa Verde',         amount:1500.00,  category:'Income',      account:'BofA ••3344'},
    {date:'2026-03-25', description:'Google Ads — Momentum',               amount:-950.00,  category:'Advertising', account:'Amex ••0001'},
    {date:'2026-03-20', description:'CLIENT PAYMENT — Momentum Fitness',   amount:1800.00,  category:'Income',      account:'Chase ••4821'},
    {date:'2026-03-15', description:'CLIENT PAYMENT — Pacific Legal',      amount:1200.00,  category:'Income',      account:'Chase ••4821'},
    {date:'2026-03-15', description:'Contractor — Marcus Rivera',          amount:-1300.00, category:'Contractor',  account:'Chase ••4821'},
    {date:'2026-03-10', description:'Canva Pro — Annual',                  amount:-155.88,  category:'Software',    account:'Amex ••0001'},
    {date:'2026-03-05', description:'CLIENT PAYMENT — Rebuilding CA',      amount:3500.00,  category:'Income',      account:'BofA ••3344'},
    {date:'2026-03-01', description:'Office Rent — March',                 amount:-2800.00, category:'Rent',        account:'Chase ••4821'},
    {date:'2026-02-20', description:'CLIENT PAYMENT — Solara Skincare',    amount:2800.00,  category:'Income',      account:'WF ••7756'},
    {date:'2026-02-15', description:'CLIENT PAYMENT — Pacific Legal',      amount:1200.00,  category:'Income',      account:'Chase ••4821'},
    {date:'2026-02-10', description:'CLIENT PAYMENT — Rebuilding CA',      amount:2100.00,  category:'Income',      account:'BofA ••3344'},
    {date:'2026-02-01', description:'CLIENT PAYMENT — Pacific Legal',      amount:4800.00,  category:'Income',      account:'Chase ••4821'}
  ];

  // ── QB CONFIG ─────────────────────────────────────────
  const QB_CONFIG_SEED = { status:'not-configured', oauthToken:null, businessId:null, companyName:null, lastSync:null, syncErrors:[] };

  // ── QB BALANCE SHEET (MIRRORS QB GL ACCOUNT STRUCTURE) ────────────────
  const QB_CHART_OF_ACCOUNTS = {
    assets: [
      {account:'1010', name:'Cash - Operating (Chase)', qbBalance:24830.50, bankBalance:24830.50, qbLastSync:'2026-04-08 09:15'},
      {account:'1020', name:'Cash - Savings (Chase)', qbBalance:45000.00, bankBalance:45000.00, qbLastSync:'2026-04-08 09:15'},
      {account:'1030', name:'Cash - BofA Business', qbBalance:18250.75, bankBalance:18250.75, qbLastSync:'2026-04-08 09:15'},
      {account:'1040', name:'Cash - Wells Fargo', qbBalance:11200.00, bankBalance:11200.00, qbLastSync:'2026-04-08 09:15'},
      {account:'1050', name:'Cash - US Bank', qbBalance:8400.00, bankBalance:8400.00, qbLastSync:'2026-04-08 09:15'},
      {account:'1060', name:'Petty Cash', qbBalance:250.00, bankBalance:250.00, qbLastSync:'2026-04-07'},
      {account:'1200', name:'Accounts Receivable', qbBalance:13900.00, qbLastSync:'2026-04-08', notes:'4 open invoices'},
      {account:'1300', name:'Equipment & Technology', qbBalance:8450.00, qbLastSync:'2026-02-15'},
      {account:'1310', name:'Furniture & Fixtures', qbBalance:3200.00, qbLastSync:'2026-02-15'}
    ],
    liabilities: [
      {account:'2100', name:'Accounts Payable', qbBalance:-2150.00, qbLastSync:'2026-04-05', notes:'2 contractor invoices pending'},
      {account:'2200', name:'Credit Card - Amex', qbBalance:-3420.18, bankBalance:-3420.18, qbLastSync:'2026-04-08 09:15'},
      {account:'2300', name:'Accrued Payroll', qbBalance:-1200.00, qbLastSync:'2026-04-01'},
      {account:'2400', name:'Sales Tax Payable', qbBalance:-485.00, qbLastSync:'2026-03-31'}
    ],
    equity: [
      {account:'3100', name:'Owner Investment', qbBalance:50000.00, qbLastSync:'2026-01-01'},
      {account:'3200', name:'Retained Earnings', qbBalance:38475.57, qbLastSync:'2026-03-31'}
    ],
    income: [
      {account:'4010', name:'Campaign Services Revenue', qbBalance:29750.00, qbLastSync:'2026-04-08', notes:'Momentum, Casa Verde, Solara'},
      {account:'4020', name:'Website & Development', qbBalance:13700.00, qbLastSync:'2026-04-08', notes:'Pacific Legal'},
      {account:'4030', name:'Consulting & Strategy', qbBalance:7400.00, qbLastSync:'2026-04-08', notes:'Rebuilding CA + misc'},
      {account:'4040', name:'Monthly Retainers', qbBalance:3900.00, qbLastSync:'2026-04-08', notes:'3 active retainers'},
      {account:'4050', name:'Creative & Production', qbBalance:5000.00, qbLastSync:'2026-04-08', notes:'Video, photo, design'}
    ],
    expenses: [
      {account:'5010', name:'Contractor Labor', qbBalance:28500.00, qbLastSync:'2026-04-08'},
      {account:'5020', name:'Advertising & Media Buy', qbBalance:12400.00, qbLastSync:'2026-04-08'},
      {account:'5030', name:'Software & Subscriptions', qbBalance:1847.50, qbLastSync:'2026-04-08'},
      {account:'5040', name:'Office & Rent', qbBalance:11200.00, qbLastSync:'2026-04-08'},
      {account:'5050', name:'Meals & Entertainment', qbBalance:892.40, qbLastSync:'2026-04-08'},
      {account:'5060', name:'Travel & Transport', qbBalance:640.20, qbLastSync:'2026-04-08'}
    ]
  };

  function loadQBConfig() {
    try { return JSON.parse(localStorage.getItem('meridian_qb_config')) || QB_CONFIG_SEED; }
    catch(e) { return QB_CONFIG_SEED; }
  }
  function saveQBConfig(cfg) { localStorage.setItem('meridian_qb_config', JSON.stringify(cfg)); }

  function openQBModal() {
    const config = loadQBConfig();
    document.getElementById('qb-modal').style.display = 'flex';
    if (config.status === 'configured') {
      document.getElementById('qb-step-1').style.display = 'none';
      document.getElementById('qb-step-2').style.display = 'block';
      document.getElementById('qb-step-1-tab').style.cssText += ';background:var(--cream);color:var(--forest-mid)';
      document.getElementById('qb-step-2-tab').style.cssText += ';background:var(--forest);color:var(--ivory)';
      document.getElementById('qb-modal-company-name').textContent = config.companyName || 'DNA Agency';
      renderQBModalSummary();
    } else {
      document.getElementById('qb-step-1').style.display = 'block';
      document.getElementById('qb-step-2').style.display = 'none';
    }
  }

  function closeQBModal() {
    document.getElementById('qb-modal').style.display = 'none';
    renderQBStatus();
    renderQBPanel();
  }

  function qbDemoConnect() {
    const name = document.getElementById('qb-company-name').value || 'DNA Agency';
    saveQBConfig({ status:'configured', mode:'demo', companyName:name,
      realmId: document.getElementById('qb-realm-id').value || 'demo-9341453183',
      oauthToken:'demo-token', lastSync:new Date().toISOString(), syncErrors:[] });
    document.getElementById('qb-step-1').style.display = 'none';
    document.getElementById('qb-step-2').style.display = 'block';
    document.getElementById('qb-step-1-tab').style.background = 'var(--cream)';
    document.getElementById('qb-step-1-tab').style.color = 'var(--forest-mid)';
    document.getElementById('qb-step-2-tab').style.background = 'var(--forest)';
    document.getElementById('qb-step-2-tab').style.color = 'var(--ivory)';
    document.getElementById('qb-modal-company-name').textContent = name;
    renderQBModalSummary();
  }

  function qbOAuthConnect() {
    alert('QuickBooks Live OAuth requires:\n\n1. A QB Developer App (app.developer.intuit.com)\n2. Client ID + Client Secret\n3. Registered Redirect URI\n\nVon will configure live OAuth access before the July bookkeeper transition.\n\nFor now, click "Connect with Demo Data" to preview the full integration.');
  }

  function qbDisconnect() {
    if (!confirm('Disconnect QuickBooks? Synced data will be removed.')) return;
    saveQBConfig(QB_CONFIG_SEED);
    closeQBModal();
  }

  function qbSync() {
    const config = loadQBConfig();
    if (config.status !== 'configured') return openQBModal();
    config.lastSync = new Date().toISOString();
    saveQBConfig(config);
    const btn = document.getElementById('qb-sync-btn');
    if (btn) { btn.textContent = '✓ Synced'; setTimeout(() => { btn.textContent = '↻ Sync'; }, 2000); }
    renderQBStatus();
    renderQBPanel();
  }

  function renderQBModalSummary() {
    const paid = QB_INVOICES_DEMO.filter(i => i.status === 'Paid').reduce((s,i) => s+i.amount, 0);
    const open = QB_INVOICES_DEMO.filter(i => i.status !== 'Paid').reduce((s,i) => s+i.amount, 0);
    const el = document.getElementById('qb-modal-sync-summary');
    if (!el) return;
    el.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.6rem">
      <div style="background:var(--cream);border:1px solid var(--parchment);padding:0.7rem;text-align:center">
        <div style="font-size:1.1rem;font-weight:700;color:var(--forest)">$${paid.toLocaleString()}</div>
        <div style="font-size:0.72rem;color:#888;margin-top:0.15rem">Revenue synced</div>
      </div>
      <div style="background:var(--cream);border:1px solid var(--parchment);padding:0.7rem;text-align:center">
        <div style="font-size:1.1rem;font-weight:700;color:var(--ember)">$${open.toLocaleString()}</div>
        <div style="font-size:0.72rem;color:#888;margin-top:0.15rem">Open AR</div>
      </div>
      <div style="background:var(--cream);border:1px solid var(--parchment);padding:0.7rem;text-align:center">
        <div style="font-size:1.1rem;font-weight:700;color:var(--forest)">${QB_INVOICES_DEMO.length}</div>
        <div style="font-size:0.72rem;color:#888;margin-top:0.15rem">Invoices pulled</div>
      </div>
    </div>`;
  }

  function renderQBStatus() {
    const cfg = loadQBConfig();
    const connected = cfg.status === 'configured';
    const statusEl = document.getElementById('qb-sync-status');
    const lastEl   = document.getElementById('qb-last-sync');
    const btn      = document.getElementById('qb-connect-btn');
    const syncBtn  = document.getElementById('qb-sync-btn');
    const hdrBtn   = document.getElementById('qb-status-button');

    if (statusEl) { statusEl.textContent = connected ? '✓ Connected' : 'Not Connected'; statusEl.style.color = connected ? '#27AE60' : '#888'; }
    if (lastEl)   lastEl.textContent = cfg.lastSync ? new Date(cfg.lastSync).toLocaleString('en-US', {month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}) : '—';
    if (btn)      btn.textContent = connected ? 'Manage Connection →' : 'Connect QuickBooks →';
    if (syncBtn)  syncBtn.style.display = connected ? 'inline-block' : 'none';
    if (hdrBtn)   { hdrBtn.textContent = connected ? '✓ QB Connected' : 'QuickBooks'; hdrBtn.style.background = connected ? '#27AE60' : '#2CA01C'; }
  }

  function renderQBPanel() {
    const cfg = loadQBConfig();
    const panel = document.getElementById('qb-data-panel');
    if (!panel) return;
    if (cfg.status !== 'configured') { panel.style.display = 'none'; return; }
    panel.style.display = 'block';

    const revenue  = QB_INVOICES_DEMO.filter(i => i.status === 'Paid').reduce((s,i) => s+i.amount, 0);
    const expenses = QB_EXPENSES_DEMO.reduce((s,e) => s+e.amount, 0);
    const net      = revenue - expenses;
    const fmtN     = n => '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:0});

    document.getElementById('qb-revenue-ytd').textContent  = fmtN(revenue);
    document.getElementById('qb-expenses-ytd').textContent = fmtN(expenses);
    const netEl = document.getElementById('qb-net-ytd');
    netEl.textContent  = (net >= 0 ? '+' : '-') + fmtN(net);
    netEl.style.color  = net >= 0 ? 'var(--forest)' : 'var(--ember)';

    const colors = {Paid:'#27AE60', Open:'var(--gold)', Overdue:'var(--ember)'};
    const invPanel = document.getElementById('qb-invoices-panel');
    if (!invPanel) return;
    invPanel.innerHTML = `
      <div style="font-size:0.76rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.6rem">QB Invoices — Synced</div>
      <table style="width:100%;border-collapse:collapse;font-size:0.86rem">
        <thead><tr style="border-bottom:2px solid var(--parchment)">
          <th style="text-align:left;padding:0.4rem 0.6rem;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid)">ID</th>
          <th style="text-align:left;padding:0.4rem 0.6rem;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid)">Customer</th>
          <th style="text-align:left;padding:0.4rem 0.6rem;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid)">Description</th>
          <th style="text-align:right;padding:0.4rem 0.6rem;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid)">Amount</th>
          <th style="text-align:center;padding:0.4rem 0.6rem;font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid)">Status</th>
        </tr></thead>
        <tbody>${QB_INVOICES_DEMO.map(inv => `
          <tr style="border-bottom:1px solid var(--cream)">
            <td style="padding:0.4rem 0.6rem;color:#aaa;font-size:0.78rem">${inv.id}</td>
            <td style="padding:0.4rem 0.6rem;font-weight:600">${inv.customer}</td>
            <td style="padding:0.4rem 0.6rem;color:var(--forest-mid);font-size:0.82rem">${inv.description}</td>
            <td style="padding:0.4rem 0.6rem;text-align:right;font-weight:700">$${inv.amount.toLocaleString()}</td>
            <td style="padding:0.4rem 0.6rem;text-align:center"><span style="font-size:0.72rem;font-weight:700;color:${colors[inv.status]||'#888'}">${inv.status.toUpperCase()}</span></td>
          </tr>`).join('')}</tbody>
      </table>
      <div style="margin-top:1.2rem">
        <div style="font-size:0.76rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.5rem">Expense Categories (YTD)</div>
        ${QB_EXPENSES_DEMO.map(exp => `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:0.35rem 0;border-bottom:1px solid var(--cream)">
            <span style="font-size:0.86rem;color:var(--forest)">${exp.category}</span>
            <span style="font-size:0.86rem;font-weight:700;color:var(--ember)">$${exp.amount.toLocaleString()}</span>
          </div>`).join('')}
      </div>`;
  }

  // ── BALANCE SHEET RENDERING ───────────────────────────
  function renderBalanceSheet() {
    const panel = document.getElementById('fin-balance-sheet-detail');
    if (!panel) return;

    const coa = QB_CHART_OF_ACCOUNTS;
    const totalAssets = coa.assets.reduce((s, a) => s + (a.qbBalance || 0), 0);
    const totalLiabilities = coa.liabilities.reduce((s, l) => s + (l.qbBalance || 0), 0);
    const totalEquity = coa.equity.reduce((s, e) => s + (e.qbBalance || 0), 0);
    const totalIncome = (coa.income || []).reduce((s, a) => s + (a.qbBalance || 0), 0);
    const totalExpenses = (coa.expenses || []).reduce((s, a) => s + (a.qbBalance || 0), 0);
    const netIncome = totalIncome - totalExpenses;

    const fmtN = n => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:2});
    const thStyle = 'text-align:left;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)';
    const thStyleR = 'text-align:right;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)';

    const renderAccounts = (accounts) => {
      return accounts.map(acc => {
        const hasBankFeed = acc.bankBalance !== undefined;
        const variance = hasBankFeed ? (acc.bankBalance - acc.qbBalance) : 0;
        const varStyle = Math.abs(variance) > 1 ? 'background:#fff3cd;' : '';
        return `<tr style="${varStyle}">
            <td style="padding:0.5rem 0.6rem;color:#aaa;font-size:0.8rem">${acc.account}</td>
            <td style="padding:0.5rem 0.6rem;color:var(--forest);font-weight:500">${acc.name}</td>
            <td style="padding:0.5rem 0.6rem;text-align:right;font-weight:600">${fmtN(acc.qbBalance)}</td>
            <td style="padding:0.5rem 0.6rem;text-align:right;font-size:0.85rem;color:#666">${hasBankFeed ? fmtN(acc.bankBalance) : '—'}</td>
            <td style="padding:0.5rem 0.6rem;text-align:right;font-weight:600;color:${Math.abs(variance) > 1 ? 'var(--ember)' : '#27AE60'}">${Math.abs(variance) > 1 ? fmtN(variance) : '✓'}</td>
            <td style="padding:0.5rem 0.6rem;font-size:0.75rem;color:#999">${acc.notes || acc.qbLastSync || '—'}</td>
          </tr>`;
      }).join('');
    };

    const makeTable = (title, color, accounts, total, totalLabel) => `
      <div style="margin-bottom:1.5rem">
        <div style="font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${color};margin-bottom:0.8rem">${title}</div>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;border:1px solid var(--parchment)">
          <thead style="background:var(--cream)"><tr style="border-bottom:1px solid var(--parchment)">
            <th style="${thStyle};width:70px">Acct#</th><th style="${thStyle}">Account Name</th>
            <th style="${thStyleR}">QB Balance</th><th style="${thStyleR}">Bank Feed</th>
            <th style="${thStyleR}">Variance</th><th style="${thStyle}">Notes</th>
          </tr></thead>
          <tbody>${renderAccounts(accounts)}</tbody>
        </table>
        <div style="padding:0.7rem 0.6rem;background:var(--cream);border:1px solid var(--parchment);border-top:none;font-weight:700;text-align:right">${totalLabel}: ${fmtN(total)}</div>
      </div>`;

    // Update summary KPI
    const summaryEl = document.getElementById('kpi-bs-summary');
    if (summaryEl) summaryEl.textContent = `YTD Revenue: ${fmtN(totalIncome)} · Net Income: ${fmtN(netIncome)}`;

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;padding-bottom:0.8rem;border-bottom:2px solid var(--parchment)">
        <div style="font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest-mid)">QB Balance | Bank Feed | Variance | Notes</div>
        <div style="font-size:0.75rem;color:var(--forest-mid)">Last Sync: Apr 8, 2026 · 09:15 AM</div>
      </div>
      ${makeTable('INCOME (YTD Revenue)', '#27AE60', coa.income || [], totalIncome, 'TOTAL REVENUE')}
      ${makeTable('EXPENSES (YTD Costs)', 'var(--ember)', coa.expenses || [], totalExpenses, 'TOTAL EXPENSES')}
      <div style="padding:0.8rem;background:${netIncome >= 0 ? '#e8f5e9' : '#fce4ec'};border:2px solid ${netIncome >= 0 ? '#27AE60' : 'var(--ember)'};border-radius:3px;margin-bottom:2rem;display:flex;justify-content:space-between;align-items:center">
        <span style="font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em">Net Income (Revenue − Expenses)</span>
        <span style="font-size:1.2rem;font-weight:700;color:${netIncome >= 0 ? '#27AE60' : 'var(--ember)'}">${fmtN(netIncome)}</span>
      </div>
      <div style="border-top:3px solid var(--forest);padding-top:1.5rem">
        <div style="font-size:0.72rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:1rem">BALANCE SHEET</div>
      </div>
      ${makeTable('ASSETS', 'var(--forest)', coa.assets, totalAssets, 'TOTAL ASSETS')}
      ${makeTable('LIABILITIES', 'var(--ember)', coa.liabilities, totalLiabilities, 'TOTAL LIABILITIES')}
      ${makeTable('EQUITY', 'var(--forest)', coa.equity, totalEquity, 'TOTAL EQUITY')}
      <div style="padding:0.7rem 0.6rem;background:var(--gold);color:var(--forest);border:1px solid var(--parchment);font-weight:700;text-align:right;border-radius:3px">TOTAL LIABILITIES + EQUITY: ${fmtN(totalLiabilities + totalEquity)}</div>`;
  }

  // ── BANK FEEDS RENDERING ──────────────────────────────
  function renderBankFeeds() {
    const panel = document.getElementById('fin-bank-feeds-detail');
    if (!panel) return;

    const banks = BANK_ACCOUNTS_DEMO;
    let totalBalance = 0;
    let totalAvailable = 0;
    
    const fmtN = n => (n < 0 ? '−' : '') + '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:2});
    
    const accountRows = Object.entries(banks).flatMap(([bank, accounts]) => {
      const bankTotal = accounts.reduce((s, a) => s + (a.balance || 0), 0);
      totalBalance += bankTotal;
      totalAvailable += accounts.reduce((s, a) => s + (a.available || 0), 0);
      
      return accounts.map((acc, idx) => `
        <tr style="border-bottom:1px solid var(--cream)">
          ${idx === 0 ? `<td rowspan="${accounts.length}" style="padding:0.5rem 0.6rem;font-weight:700;color:var(--forest);background:var(--cream)">${bank}</td>` : ''}
          <td style="padding:0.5rem 0.6rem;color:var(--forest);font-weight:500">${acc.name}</td>
          <td style="padding:0.5rem 0.6rem;text-align:center;font-size:0.8rem;color:#666">${acc.mask}</td>
          <td style="padding:0.5rem 0.6rem;text-align:center;font-size:0.8rem;color:var(--forest-mid);text-transform:capitalize">${acc.type}</td>
          <td style="padding:0.5rem 0.6rem;text-align:right;font-weight:600;color:${acc.balance < 0 ? 'var(--ember)' : 'var(--forest)'}">${fmtN(acc.balance)}</td>
          <td style="padding:0.5rem 0.6rem;text-align:right;font-size:0.85rem;color:#27AE60">${fmtN(acc.available)}</td>
          ${acc.limit ? `<td style="padding:0.5rem 0.6rem;text-align:right;font-size:0.85rem;color:#666">${fmtN(acc.limit)}</td>` : '<td></td>'}
        </tr>`);
    }).join('');

    const recentTransactions = BANK_TRANSACTIONS_DEMO.slice(0, 10).map(t => `
      <tr style="border-bottom:1px solid var(--cream)">
        <td style="padding:0.4rem 0.6rem;font-size:0.8rem;color:#999">${t.date}</td>
        <td style="padding:0.4rem 0.6rem;color:var(--forest);font-weight:500">${t.description}</td>
        <td style="padding:0.4rem 0.6rem;font-size:0.8rem;color:var(--forest-mid)">${t.category}</td>
        <td style="padding:0.4rem 0.6rem;text-align:right;font-weight:600;color:${t.amount < 0 ? 'var(--ember)' : '#27AE60'}">${(t.amount < 0 ? '−' : '+') + '$' + Math.abs(t.amount).toLocaleString()}</td>
        <td style="padding:0.4rem 0.6rem;font-size:0.8rem;color:#666">${t.account}</td>
      </tr>`).join('');

    panel.innerHTML = `
      <div style="margin-bottom:1.5rem">
        <div style="font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest);margin-bottom:0.8rem">Bank Account Balances</div>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;border:1px solid var(--parchment)">
          <thead style="background:var(--cream)">
            <tr style="border-bottom:1px solid var(--parchment)">
              <th style="text-align:left;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Bank</th>
              <th style="text-align:left;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Account Name</th>
              <th style="text-align:center;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Mask</th>
              <th style="text-align:center;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Type</th>
              <th style="text-align:right;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Balance</th>
              <th style="text-align:right;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Available</th>
              <th style="text-align:right;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Limit</th>
            </tr>
          </thead>
          <tbody>${accountRows}</tbody>
        </table>
        <div style="padding:0.7rem 0.6rem;background:var(--cream);border:1px solid var(--parchment);border-top:none;font-weight:700;display:flex;justify-content:space-between">
          <span>Total across all accounts:</span>
          <span style="color:${totalBalance < 0 ? 'var(--ember)' : 'var(--forest)'}">${fmtN(totalBalance)}</span>
        </div>
      </div>

      <div>
        <div style="font-size:0.8rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--forest);margin-bottom:0.8rem">Recent Transactions (Last 10)</div>
        <table style="width:100%;border-collapse:collapse;font-size:0.9rem;border:1px solid var(--parchment)">
          <thead style="background:var(--cream)">
            <tr style="border-bottom:1px solid var(--parchment)">
              <th style="text-align:left;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Date</th>
              <th style="text-align:left;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Description</th>
              <th style="text-align:left;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Category</th>
              <th style="text-align:right;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Amount</th>
              <th style="text-align:left;padding:0.5rem 0.6rem;font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Account</th>
            </tr>
          </thead>
          <tbody>${recentTransactions}</tbody>
        </table>
      </div>`;
  }

  // ── BANK / PLAID ──────────────────────────────────────
  const BANK_CONFIG_KEY = 'meridian_bank_config';
  const BANK_CONFIG_SEED = { status:'not-connected', institution:null, accounts:[], lastSync:null };

  function loadBankConfig() {
    try { return JSON.parse(localStorage.getItem(BANK_CONFIG_KEY)) || BANK_CONFIG_SEED; }
    catch(e) { return BANK_CONFIG_SEED; }
  }
  function saveBankConfig(cfg) { localStorage.setItem(BANK_CONFIG_KEY, JSON.stringify(cfg)); }

  function openBankModal() {
    const cfg = loadBankConfig();
    document.getElementById('bank-modal').style.display = 'flex';
    if (cfg.status === 'connected') {
      document.getElementById('bank-connect-step').style.display = 'none';
      document.getElementById('bank-connected-step').style.display = 'block';
      document.getElementById('bank-connected-name').textContent = cfg.institution + ' Connected';
      renderBankModalAccounts(cfg.accounts);
    } else {
      document.getElementById('bank-connect-step').style.display = 'block';
      document.getElementById('bank-connected-step').style.display = 'none';
    }
  }

  function closeBankModal() {
    document.getElementById('bank-modal').style.display = 'none';
    renderBankStatus();
    renderBankPanel();
  }

  function bankDemoConnect(institution) {
    const accounts = BANK_ACCOUNTS_DEMO[institution] || BANK_ACCOUNTS_DEMO['Other'];
    saveBankConfig({ status:'connected', institution, accounts, lastSync:new Date().toISOString() });
    document.getElementById('bank-connect-step').style.display = 'none';
    document.getElementById('bank-connected-step').style.display = 'block';
    document.getElementById('bank-connected-name').textContent = institution + ' Connected';
    renderBankModalAccounts(accounts);
  }

  function bankDisconnect() {
    if (!confirm('Disconnect bank accounts?')) return;
    saveBankConfig(BANK_CONFIG_SEED);
    closeBankModal();
  }

  function renderBankModalAccounts(accounts) {
    const el = document.getElementById('bank-modal-accounts');
    if (!el || !accounts) return;
    el.innerHTML = accounts.map(a => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:0.65rem 0.8rem;background:var(--cream);border:1px solid var(--parchment);margin-bottom:0.4rem;border-radius:2px">
        <div>
          <div style="font-size:0.88rem;font-weight:600;color:var(--forest)">${a.name}</div>
          <div style="font-size:0.76rem;color:#888">••••${a.mask} · ${a.type}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:0.98rem;font-weight:700;color:${a.type==='credit'?'var(--ember)':'var(--forest)'}">$${Math.abs(a.balance).toLocaleString()}</div>
          <div style="font-size:0.72rem;color:#aaa">${a.type==='credit'?'balance owed':'avail: $'+a.available.toLocaleString()}</div>
        </div>
      </div>`).join('');
  }

  function renderBankStatus() {
    const cfg = loadBankConfig();
    const connected = cfg.status === 'connected';
    const statusEl  = document.getElementById('bank-sync-status');
    const countEl   = document.getElementById('bank-accounts-count');
    const btn       = document.getElementById('bank-connect-btn');
    if (statusEl) { statusEl.textContent = connected ? '✓ ' + cfg.institution : 'Not Connected'; statusEl.style.color = connected ? '#27AE60' : '#888'; }
    if (countEl)  countEl.textContent = connected ? cfg.accounts.length : '0';
    if (btn)      btn.textContent = connected ? 'Manage Accounts →' : 'Link via Plaid →';
  }

  function renderBankPanel() {
    const cfg   = loadBankConfig();
    const panel = document.getElementById('bank-data-panel');
    if (!panel) return;
    if (cfg.status !== 'connected') { panel.style.display = 'none'; return; }
    panel.style.display = 'block';

    const acctEl = document.getElementById('bank-accounts-panel');
    if (acctEl) {
      acctEl.innerHTML = `
        <div style="font-size:0.76rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.5rem">Linked Accounts — ${cfg.institution}</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.6rem;margin-bottom:0.8rem">
          ${cfg.accounts.map(a => `
            <div style="background:var(--white);border:1px solid var(--parchment);padding:0.8rem">
              <div style="font-size:0.72rem;color:#aaa">••••${a.mask} · ${a.type}</div>
              <div style="font-size:1.1rem;font-weight:700;color:${a.type==='credit'?'var(--ember)':'var(--forest)'};margin-top:0.2rem">$${Math.abs(a.balance).toLocaleString()}</div>
              <div style="font-size:0.78rem;color:var(--forest-mid)">${a.name}</div>
            </div>`).join('')}
        </div>`;
    }

    const txEl = document.getElementById('bank-transactions-panel');
    if (txEl) {
      txEl.innerHTML = `
        <div style="font-size:0.76rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.5rem">Recent Transactions</div>
        <table style="width:100%;border-collapse:collapse;font-size:0.85rem">
          <thead><tr style="border-bottom:2px solid var(--parchment)">
            <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Date</th>
            <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Description</th>
            <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Category</th>
            <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Account</th>
            <th style="text-align:right;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Amount</th>
          </tr></thead>
          <tbody>${BANK_TRANSACTIONS_DEMO.map(tx => `
            <tr style="border-bottom:1px solid var(--cream)">
              <td style="padding:0.35rem 0.5rem;color:#aaa;font-size:0.78rem;white-space:nowrap">${tx.date}</td>
              <td style="padding:0.35rem 0.5rem;font-weight:${tx.amount>0?'700':'400'};max-width:200px">${tx.description}</td>
              <td style="padding:0.35rem 0.5rem;color:var(--forest-mid);font-size:0.78rem">${tx.category}</td>
              <td style="padding:0.35rem 0.5rem;color:#aaa;font-size:0.78rem">${tx.account}</td>
              <td style="padding:0.35rem 0.5rem;text-align:right;font-weight:700;color:${tx.amount>0?'var(--forest)':'var(--charcoal)'}">
                ${tx.amount>0?'+':''}$${Math.abs(tx.amount).toLocaleString('en-US',{minimumFractionDigits:2})}
              </td>
            </tr>`).join('')}</tbody>
        </table>`;
    }
  }

  // ── RECEIPT CAPTURE ───────────────────────────────────
  const RECEIPTS_KEY = 'meridian_receipts';

  function loadReceipts() {
    try { return JSON.parse(localStorage.getItem(RECEIPTS_KEY)) || []; }
    catch(e) { return []; }
  }
  function saveReceipts(r) { localStorage.setItem(RECEIPTS_KEY, JSON.stringify(r)); }

  function openReceiptModal() {
    document.getElementById('receipt-modal').style.display = 'flex';
    const d = document.querySelector('#receipt-form input[name="date"]');
    if (d) d.value = new Date().toISOString().split('T')[0];
    const sel = document.getElementById('receipt-campaign-select');
    if (sel) {
      const camps = loadCampaigns();
      sel.innerHTML = '<option value="">— General expense</option>' +
        camps.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    }
    document.getElementById('receipt-preview').style.display = 'none';
  }

  function closeReceiptModal() {
    document.getElementById('receipt-modal').style.display = 'none';
    document.getElementById('receipt-form').reset();
    document.getElementById('receipt-preview').style.display = 'none';
    renderReceiptStatus();
    renderReceiptPanel();
  }

  function previewReceiptFile(input) {
    const file = input.files[0];
    const prev = document.getElementById('receipt-preview');
    if (file && prev) { prev.style.display = 'block'; prev.innerHTML = `📎 ${file.name} <span style="color:#aaa">(${(file.size/1024).toFixed(1)} KB)</span>`; }
  }

  function submitReceipt(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const receipts = loadReceipts();
    receipts.push({ id:Date.now(), vendor:data.vendor, amount:parseFloat(data.amount),
      date:data.date, category:data.category, campaignId:data.campaignId||null,
      paymentMethod:data.paymentMethod, notes:data.notes||'', createdAt:new Date().toISOString() });
    saveReceipts(receipts);
    closeReceiptModal();
  }

  function renderReceiptStatus() {
    const receipts = loadReceipts();
    const total = receipts.reduce((s,r) => s+r.amount, 0);
    const cEl = document.getElementById('receipt-count-status');
    const tEl = document.getElementById('receipt-total-status');
    if (cEl) cEl.textContent = receipts.length + (receipts.length===1?' receipt':' receipts');
    if (tEl) tEl.textContent = '$' + total.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
  }

  function renderReceiptPanel() {
    const receipts = loadReceipts();
    const panel = document.getElementById('receipt-data-panel');
    if (!panel) return;
    if (receipts.length === 0) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    const listEl = document.getElementById('receipt-list-panel');
    if (!listEl) return;
    const catColors = {'Software & Tools':'#7c3aed','Advertising':'var(--ember)','Travel & Transport':'#1a56db',
      'Meals & Entertainment':'var(--gold)','Contractor Payments':'var(--forest)','Equipment':'#555','Other':'#888','Office Supplies':'#888'};
    listEl.innerHTML = `
      <div style="font-size:0.76rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--forest-mid);margin-bottom:0.5rem">Captured Receipts</div>
      <table style="width:100%;border-collapse:collapse;font-size:0.86rem">
        <thead><tr style="border-bottom:2px solid var(--parchment)">
          <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Date</th>
          <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Vendor</th>
          <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Category</th>
          <th style="text-align:left;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Method</th>
          <th style="text-align:right;padding:0.35rem 0.5rem;font-size:0.7rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Amount</th>
        </tr></thead>
        <tbody>${[...receipts].reverse().map(r => `
          <tr style="border-bottom:1px solid var(--cream)">
            <td style="padding:0.35rem 0.5rem;color:#aaa;font-size:0.78rem;white-space:nowrap">${r.date}</td>
            <td style="padding:0.35rem 0.5rem;font-weight:600">${r.vendor}</td>
            <td style="padding:0.35rem 0.5rem"><span style="font-size:0.72rem;font-weight:700;color:${catColors[r.category]||'#888'}">${r.category}</span></td>
            <td style="padding:0.35rem 0.5rem;color:#aaa;font-size:0.78rem">${r.paymentMethod}</td>
            <td style="padding:0.35rem 0.5rem;text-align:right;font-weight:700;color:var(--ember)">$${r.amount.toLocaleString('en-US',{minimumFractionDigits:2})}</td>
          </tr>`).join('')}</tbody>
      </table>`;
  }

  // Legacy shim — openQBConnection was referenced in old code
  function openQBConnection() { openQBModal(); }

  // ── PROPOSAL GENERATOR (Claude AI) ─────────────────────
  function initProposalProjectSelect() {
    const campaigns = loadCampaigns();
    const select = document.getElementById('proposal-project');
    if (!select) return;

    select.innerHTML = '<option value="">— Choose a campaign</option>' +
      campaigns.map(p => `<option value="${p.id}">${p.name} (${p.client})</option>`).join('');
  }

  function loadProposalContext() {
    const campaignId = parseInt(document.getElementById('proposal-project').value);
    if (!campaignId) {
      document.getElementById('proposal-output').style.display = 'none';
      document.getElementById('proposal-placeholder').style.display = 'block';
      return;
    }

    const campaigns = loadCampaigns();
    const project = campaigns.find(p => p.id === campaignId);
    if (!project) return;

    // Pre-fill context with campaign details
    const activities = (project.activities || []).map(a => a.name).join(', ') || 'No activities yet';
    const context = `Campaign: ${project.name}
Client: ${project.client}
Budget: $${project.budget.toLocaleString()}
Timeline: ${project.startDate} to ${project.endDate}
Activities: ${activities}`;

    document.getElementById('proposal-context').value = context;
  }

  async function generateProposal() {
    const projectId = parseInt(document.getElementById('proposal-project').value);
    if (!projectId) {
      alert('Please select a project first.');
      return;
    }

    const tone = document.getElementById('proposal-tone').value;
    const audience = document.getElementById('proposal-audience').value;
    const context = document.getElementById('proposal-context').value;
    const btn = document.getElementById('proposal-gen-btn');

    btn.textContent = 'Generating...';
    btn.disabled = true;

    try {
      // Build prompt for Claude
      const systemPrompt = `You are a business proposal writer for DNA Agency & Rebuilding California.
Your tone is witty, sharp, and clear. Write compelling proposals that sell the value of the project to the client.
Keep proposals concise (3-4 paragraphs) and focused on client benefits.`;

      const userPrompt = `Generate a proposal with this context:

${context}

Target audience: ${audience}
Tone: ${tone}

Write a compelling, professional proposal that shows why this project will deliver value to the client.`;

      // Call Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': prompt('Enter your Anthropic API key:'),
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-opus-4-1',
          max_tokens: 1024,
          messages: [
            {role: 'user', content: userPrompt}
          ],
          system: systemPrompt
        })
      });

      if (!response.ok) {
        throw new Error('API request failed: ' + response.statusText);
      }

      const data = await response.json();
      const proposalText = data.content[0].text;

      // Display proposal
      document.getElementById('proposal-text').innerHTML = proposalText.replace(/\n/g, '<br><br>');
      document.getElementById('proposal-output').style.display = 'block';
      document.getElementById('proposal-placeholder').style.display = 'none';

    } catch (error) {
      alert('Error generating proposal: ' + error.message + '\n\nFor MVP, manually edit the proposal template or contact support.');
      document.getElementById('proposal-output').style.display = 'none';
      document.getElementById('proposal-placeholder').style.display = 'block';
    } finally {
      btn.textContent = 'Generate Proposal →';
      btn.disabled = false;
    }
  }

  function copyProposal() {
    const text = document.getElementById('proposal-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
      alert('Proposal copied to clipboard');
    });
  }

  function exportProposalPDF() {
    const campaignId = parseInt(document.getElementById('proposal-project').value);
    const campaigns = loadCampaigns();
    const project = campaigns.find(p => p.id === campaignId);
    const proposalText = document.getElementById('proposal-text').innerText;

    if (!proposalText) {
      alert('No proposal to export. Generate one first.');
      return;
    }

    // Simple PDF export using data URL (Phase 2 will use jsPDF)
    const pdfContent = `
PROPOSAL
${project ? project.name : 'Campaign'}
${project ? project.client : ''}
Generated on ${new Date().toLocaleDateString()}

${proposalText}
    `;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pdfContent));
    element.setAttribute('download', `${project ? project.name : 'Campaign'}-Proposal.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // ── CLIENT REPORT EXPORT ──────────────────────────────
  function exportProjectReport(campaignId) {
    const campaigns = loadCampaigns();
    const labor = loadLaborTracking();
    const invoices = loadInvoices();
    const project = campaigns.find(c => c.id === campaignId);

    if (!project) {
      alert('Campaign not found');
      return;
    }

    // Calculate campaign metrics
    const projectLabor = labor.filter(l => (l.campaignId || l.projectId) === campaignId);
    const laborCost = projectLabor.reduce((s, l) => s + (l.hours * l.hourlyRate), 0);
    const projectInvoices = invoices.filter(i => i.projectId === campaignId || i.campaignId === campaignId);
    const revenue = projectInvoices.filter(i => i.status === 'Funded').reduce((s, i) => s + i.amount, 0);
    const margin = revenue > 0 ? ((revenue - laborCost) / revenue * 100).toFixed(1) : 'N/A';
    const totalHours = projectLabor.reduce((s, l) => s + l.hours, 0);

    // Build report
    const activitiesList = (project.activities || [])
      .map(a => `[${a.status === 'done' ? '✓' : ' '}] ${a.name} — ${a.status}`)
      .join('\n') || 'No activities logged';

    const report = `CAMPAIGN REPORT
================================================================================

Campaign:            ${project.name}
Client:              ${project.client}
Status:              ${project.status}
Phase:               ${project.phase || 'N/A'}

Period:              ${project.startDate} to ${project.endDate}
Budget:              $${project.budget.toLocaleString()}

ACTIVITIES
================================================================================
${activitiesList}

PERFORMANCE METRICS
================================================================================
Total Hours:         ${totalHours}h
Labor Cost:          $${laborCost.toLocaleString()}
Revenue:             $${revenue.toLocaleString()}
Gross Margin:        ${margin}%

INVOICES
================================================================================
${projectInvoices.length > 0
  ? projectInvoices.map(inv => `• ${inv.date} — $${inv.amount.toLocaleString()} (${inv.status})`).join('\n')
  : 'No invoices yet'}

Generated on ${new Date().toLocaleDateString()}
================================================================================
    `;

    // Export as text file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
    element.setAttribute('download', `${project.name}-Report.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert(`Report exported: ${project.name}-Report.txt`);
  }

  // ── INVOICE RENDERING (Finance Tab) ────────────────────
  function renderInvoices() {
    const board = document.getElementById('invoices-board');
    if (!board) return;

    const invoices = loadInvoices();
    const contacts = loadContacts();
    const campaigns = loadCampaigns();

    const statusColors = {
      'Pending': '#FFA500',
      'Sent': '#4CAF50',
      'Partial': '#2196F3',
      'Funded': '#27AE60'
    };

    const rows = invoices.map(inv => {
      const contact = contacts.find(c => c.id === inv.clientId);
      const campaign = inv.projectId ? campaigns.find(c => c.id === inv.projectId) : null;
      const clientName = contact ? `${contact.firstName} ${contact.lastName}` : `Client #${inv.clientId}`;

      return `
        <tr>
          <td style="padding:10px;border-bottom:1px solid #eee">${inv.date}</td>
          <td style="padding:10px;border-bottom:1px solid #eee">${clientName}</td>
          <td style="padding:10px;border-bottom:1px solid #eee;font-size:0.9rem">${campaign ? campaign.name : '—'}</td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right">$${inv.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
          <td style="padding:10px;border-bottom:1px solid #eee">
            <span class="status-badge" onclick="cycleInvoiceStatus(${inv.id})" style="background:${statusColors[inv.status]};color:white;padding:4px 8px;border-radius:3px;cursor:pointer;font-size:0.85rem;font-weight:700">
              ${inv.status}
            </span>
          </td>
          <td style="padding:10px;border-bottom:1px solid #eee;font-size:0.85rem;color:var(--forest-mid)">${inv.paymentMethod || '—'}</td>
          <td style="padding:10px;border-bottom:1px solid #eee;text-align:right;font-size:0.9rem;color:#666">${inv.dueDate}</td>
          <td style="padding:10px;border-bottom:1px solid #eee;color:#666;font-size:0.85rem">${inv.notes}</td>
        </tr>
      `;
    }).join('');

    const totalFunded = invoices.filter(i => i.status === 'Funded').reduce((s, i) => s + i.amount, 0);
    const totalPending = invoices.filter(i => i.status !== 'Funded').reduce((s, i) => s + i.amount, 0);

    board.innerHTML = `
      <div style="margin-bottom:1rem;display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="background:var(--white);border:1px solid var(--parchment);padding:0.8rem;border-radius:3px">
          <div style="font-size:0.9rem;color:var(--forest-mid);font-weight:700;text-transform:uppercase;margin-bottom:0.3rem">Funded Revenue</div>
          <div style="font-size:1.4rem;font-weight:700;color:var(--forest)">$${totalFunded.toLocaleString()}</div>
        </div>
        <div style="background:var(--white);border:1px solid var(--parchment);padding:0.8rem;border-radius:3px">
          <div style="font-size:0.9rem;color:var(--forest-mid);font-weight:700;text-transform:uppercase;margin-bottom:0.3rem">Pending Revenue</div>
          <div style="font-size:1.4rem;font-weight:700;color:var(--gold)">$${totalPending.toLocaleString()}</div>
        </div>
      </div>
      <table style="width:100%;font-size:0.85rem;border-collapse:collapse;background:var(--white);border:1px solid var(--parchment);border-radius:3px;overflow:hidden">
        <tr style="background:#f9f9f9;border-bottom:2px solid var(--parchment)">
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Date</th>
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Client</th>
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Project</th>
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Amount</th>
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Status</th>
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Payment</th>
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Due</th>
          <th style="text-align:left;padding:10px;color:var(--forest);font-weight:700">Notes</th>
        </tr>
        ${rows || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#aaa">No invoices yet</td></tr>'}
      </table>
    `;
  }

  function cycleInvoiceStatus(invoiceId) {
    const invoices = loadInvoices();
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;

    const statusCycle = ['Pending', 'Sent', 'Partial', 'Funded'];
    const currentIndex = statusCycle.indexOf(invoice.status);
    invoice.status = statusCycle[(currentIndex + 1) % statusCycle.length];

    if (invoice.status === 'Funded') {
      invoice.paymentDate = new Date().toISOString().split('T')[0];
    }

    saveInvoices(invoices);
    renderInvoices();
    renderBusinessKPIs();
  }

  function renderDonorPipeline(data) {
    const stages = ['education','engagement','ask','thank'];
    document.getElementById('donor-pipeline-board').innerHTML =
      '<div class="donor-pipeline pipeline">' +
      stages.map(stage => {
        const items = data.filter(d => d.stage === stage);
        return `<div class="pipeline-col">
          <div class="pipeline-col-header">
            <div class="pipeline-col-label">${DONOR_STAGE_LABEL[stage]}</div>
            <div class="pipeline-count">${items.length}</div>
          </div>
          <div class="pipeline-cards">
            ${items.length ? items.map(d => `
              <div class="contact-card" onclick="openDonor(${d.id})">
                <div class="contact-name">${d.name}</div>
                <div class="contact-co">${d.organization || d.type.charAt(0).toUpperCase()+d.type.slice(1)}</div>
                <div class="contact-footer">
                  <div class="contact-value">$${d.amount.toLocaleString()}</div>
                  <span class="badge ${DONOR_STAGE_BADGE[stage]}">${d.giftType === 'major' ? 'Major' : d.giftType === 'mid-level' ? 'Mid' : d.giftType.charAt(0).toUpperCase()+d.giftType.slice(1)}</span>
                </div>
              </div>`).join('')
            : '<div style="padding:1rem 0.8rem;font-size:0.9rem;color:var(--forest-mid);font-style:italic">No donors</div>'}
          </div>
        </div>`;
      }).join('') + '</div>';
  }

  function renderGrantTracker(grants = null) {
    const grantsToRender = grants || getCampaignGrants();
    document.getElementById('grant-tracker-board').innerHTML = grantsToRender.length ? grantsToRender.map(g => `
      <div class="grant-row" onclick="cycleGrantStatus(${g.id})">
        <div>
          <div class="grant-name">${g.name}</div>
          <div class="grant-org">${g.funder}${g.submittedDate ? ' — submitted ' + g.submittedDate : ''}${g.deadline ? ' · due ' + g.deadline : ''}</div>
        </div>
        <div class="grant-amount">$${g.amount.toLocaleString()}</div>
        <span class="badge ${GRANT_STATUS_BADGE[g.status]}" title="Click to advance status">${GRANT_STATUS_LABEL[g.status]}</span>
      </div>`).join('')
    : '<div style="padding:1.5rem 0;font-size:0.92rem;color:var(--forest-mid);font-style:italic">No grants tracked yet.</div>';
  }

  // ── DONOR DETAIL ─────────────────────────────────────
  function openDonor(id) {
    const d = loadDonors().find(x => x.id === id);
    if (!d) return;
    const overlay = document.getElementById('donor-detail-overlay');
    overlay.dataset.donorId = id;
    const stageCycle = ['education','engagement','ask','thank'];
    document.getElementById('donor-detail-body').innerHTML = `
      <div class="donor-modal">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.3rem">
          <div class="donor-modal-name">${d.name}</div>
          <span class="badge ${DONOR_STAGE_BADGE[d.stage]}">${DONOR_STAGE_LABEL[d.stage]}</span>
        </div>
        <div class="donor-modal-org">${[d.organization, d.type.charAt(0).toUpperCase()+d.type.slice(1)].filter(Boolean).join(' · ')}</div>

        <div class="cm-section-lbl">Gift Details</div>
        <div class="cm-field"><span class="cm-field-lbl">Ask / Gift</span><span class="cm-field-val">$${d.amount.toLocaleString()} · ${d.giftType.charAt(0).toUpperCase()+d.giftType.slice(1).replace('-',' ')}</span></div>
        ${d.nextAction ? `<div class="cm-field"><span class="cm-field-lbl">Next Step</span><span class="cm-field-val">${d.nextAction}</span></div>` : ''}
        ${d.lastContacted ? `<div class="cm-field"><span class="cm-field-lbl">Last Touch</span><span class="cm-field-val">${d.lastContacted}</span></div>` : ''}

        ${(d.email || d.phone) ? `
        <div class="cm-section-lbl" style="margin-top:1.2rem">Contact</div>
        ${d.email ? `<div class="cm-field"><span class="cm-field-lbl">Email</span><span class="cm-field-val"><a href="mailto:${d.email}">${d.email}</a></span></div>` : ''}
        ${d.phone ? `<div class="cm-field"><span class="cm-field-lbl">Phone</span><span class="cm-field-val"><a href="tel:${d.phone}">${d.phone}</a></span></div>` : ''}
        ` : ''}

        ${d.notes ? `<div class="cm-section-lbl" style="margin-top:1.2rem">Notes</div><div class="cm-notes-box">${d.notes}</div>` : ''}

        ${d.tags?.length ? `<div class="cm-tags" style="margin-top:1rem">${d.tags.map(t=>`<span class="cm-tag">${t}</span>`).join('')}</div>` : ''}

        <div class="cm-actions" style="margin-top:1.5rem">
          <button class="btn-cm-secondary" onclick="cycleDonorStage(${d.id})">Move Stage →</button>
          <button class="btn-cm-secondary" onclick="deleteDonor(${d.id})">Remove</button>
          <button class="btn-cm-primary" onclick="closeDonor()">Close</button>
        </div>
      </div>`;
    overlay.classList.add('visible');
  }

  function closeDonor() { document.getElementById('donor-detail-overlay').classList.remove('visible'); }

  function cycleDonorStage(id) {
    const data = loadDonors();
    const d = data.find(x => x.id === id);
    if (!d) return;
    const cycle = ['education','engagement','ask','thank'];
    d.stage = cycle[(cycle.indexOf(d.stage)+1) % cycle.length];
    saveDonors(data);
    renderFinance();
    openDonor(id);
  }

  function deleteDonor(id) {
    if (!confirm('Remove this donor?')) return;
    saveDonors(loadDonors().filter(d => d.id !== id));
    closeDonor();
    renderFinance();
  }

  function cycleGrantStatus(id) {
    const data = loadGrants();
    const g = data.find(x => x.id === id);
    if (!g) return;
    const cycle = ['research','pending','in-review','awarded','declined'];
    g.status = cycle[(cycle.indexOf(g.status)+1) % cycle.length];
    saveGrants(data);
    renderFinance();
  }

  // ── ADD DONOR ────────────────────────────────────────
  function openAddDonor() { document.getElementById('add-donor-modal').style.display = 'flex'; }
  function closeAddDonor() {
    document.getElementById('add-donor-modal').style.display = 'none';
    document.getElementById('add-donor-form').reset();
  }
  function submitDonor(e) {
    e.preventDefault();
    const f = e.target;
    const data = loadDonors();
    data.push({
      id: Math.max(0, ...data.map(d=>d.id)) + 1,
      name:         f.name.value,
      type:         f.type.value,
      organization: f.organization.value,
      email:        f.email.value,
      phone:        f.phone.value,
      stage:        f.stage.value,
      amount:       parseFloat(f.amount.value) || 0,
      giftType:     f.giftType.value,
      nextAction:   f.nextAction.value,
      notes:        f.notes.value,
      lastContacted: new Date().toISOString().split('T')[0],
      tags: [],
      createdAt: new Date().toISOString().split('T')[0]
    });
    saveDonors(data);
    renderFinance();
    closeAddDonor();
  }

  // ── ADD GRANT ────────────────────────────────────────
  function openAddGrant() { document.getElementById('add-grant-modal').style.display = 'flex'; }
  function closeAddGrant() {
    document.getElementById('add-grant-modal').style.display = 'none';
    document.getElementById('add-grant-form').reset();
  }
  function submitGrant(e) {
    e.preventDefault();
    const f = e.target;
    const data = loadGrants();
    data.push({
      id: Math.max(0, ...data.map(g=>g.id)) + 1,
      name:          f.name.value,
      funder:        f.funder.value,
      amount:        parseFloat(f.amount.value) || 0,
      status:        f.status.value,
      deadline:      f.deadline.value,
      submittedDate: f.submittedDate.value,
      link:          f.link.value,
      notes:         f.notes.value
    });
    saveGrants(data);
    renderFinance();
    closeAddGrant();
  }

  renderFinance();

  // ── DRILL-DOWN SYSTEM ─────────────────────────────────
  function openDrillOverlay(html) {
    document.getElementById('drill-body').innerHTML = html;
    document.getElementById('drill-overlay').classList.add('visible');
  }
  function closeDrill() {
    document.getElementById('drill-overlay').classList.remove('visible');
  }

  function showDrill({ title, subtitle, columns, rows, footer, rowClickFn }) {
    const hasClick = !!rowClickFn;
    const tableHtml = rows.length
      ? `<table class="drill-table">
          <thead><tr>${columns.map(c=>`<th>${c.label}</th>`).join('')}</tr></thead>
          <tbody>
            ${rows.map(row=>`
              <tr class="${hasClick?'drill-row-click':''}" ${hasClick?`onclick="closeDrill();${rowClickFn}(${row.id})"`:''}>
                ${columns.map(c=>`<td>${c.render(row)}</td>`).join('')}
              </tr>`).join('')}
          </tbody>
          ${footer?`<tfoot><tr><td colspan="${columns.length}">${footer}</td></tr></tfoot>`:''}
        </table>`
      : `<div class="drill-empty">No data to display.</div>`;
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">${title}</div>
            ${subtitle?`<div class="drill-sub">${subtitle}</div>`:''}
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close ×</button>
        </div>
        ${tableHtml}
      </div>`);
  }

  // ── CAMPAIGN CARD DETAIL ──────────────────────────────
  function openCampaign(id) {
    const c = loadCampaigns().find(x=>x.id===id);
    if (!c) return;
    const pct = Math.min(Math.round(c.spent/c.budget*100),100);
    const statusMap = {active:'badge-active',paused:'badge-paused',complete:'badge-warm'};
    const flags = getFlags(c);
    // Show consistent metrics across all campaigns
    const metricsHtml = `
      <div class="cm-field"><span class="cm-field-lbl">CTR</span><span class="cm-field-val">${c.ctr || 0}%</span></div>
      <div class="cm-field"><span class="cm-field-lbl">ROAS</span><span class="cm-field-val">${c.roas || 0}×</span></div>
      <div class="cm-field"><span class="cm-field-lbl">CVR</span><span class="cm-field-val">${c.cvr || 0}%</span></div>
    `;
    openDrillOverlay(`
      <div class="drill-panel" style="max-width:560px">
        <div class="drill-header">
          <div><div class="drill-title">${c.name}</div><div class="drill-sub">${c.type} · ${c.label}</div></div>
          <button class="btn-drill-close" onclick="closeDrill()">Close ×</button>
        </div>
        <div class="cm-section-lbl">Budget</div>
        <div class="spend-bar" style="margin:0.5rem 0 0.3rem"><div class="spend-fill" style="width:${pct}%"></div></div>
        <div style="font-size:0.92rem;color:var(--forest-mid);margin-bottom:1rem">$${c.spent.toLocaleString()} of $${c.budget.toLocaleString()} · ${pct}% used</div>
        <div class="cm-section-lbl">Performance</div>
        <div class="cm-field"><span class="cm-field-lbl">Leads</span><span class="cm-field-val">${c.leads.toLocaleString()}</span></div>
        <div class="cm-field"><span class="cm-field-lbl">CPL</span><span class="cm-field-val">$${c.cpl>0?c.cpl.toFixed(2):'—'}</span></div>
        ${metricsHtml}
        <div class="cm-section-lbl" style="margin-top:1.2rem">Details</div>
        <div class="cm-field"><span class="cm-field-lbl">Client</span><span class="cm-field-val">${c.client}</span></div>
        <div class="cm-field"><span class="cm-field-lbl">Platform</span><span class="cm-field-val">${c.type}</span></div>
        <div class="cm-field"><span class="cm-field-lbl">Deadline</span><span class="cm-field-val">${c.deadline||'—'}</span></div>
        <div class="cm-field"><span class="cm-field-lbl">Last Activity</span><span class="cm-field-val">${c.lastActivity||'—'}</span></div>
        <div class="cm-field"><span class="cm-field-lbl">Status</span><span class="cm-field-val">
          <span class="badge ${statusMap[c.status]||'badge-warm'}" style="cursor:pointer" onclick="cycleStatus(${c.id});closeDrill();renderBoard()">
            ${c.status.charAt(0).toUpperCase()+c.status.slice(1)} — click to cycle
          </span></span></div>
        ${flags.length?`<div style="margin-top:1rem;display:flex;gap:0.4rem;flex-wrap:wrap">${flags.map(f=>`<span class="campaign-flag">⚠ ${f}</span>`).join('')}</div>`:''}
        
        <!-- TIMELINE SECTION -->
        <div class="cm-section-lbl" style="margin-top:1.2rem">Timeline & Milestones</div>
        <div style="font-size:0.85rem;color:var(--forest-mid);line-height:1.6">
          <div style="display:flex;gap:1rem;margin-bottom:0.8rem;padding:0.6rem;background:var(--cream);border-radius:3px">
            <div><span style="font-weight:700">Start:</span> ${c.startDate||'TBD'}</div>
            <div><span style="font-weight:700">End:</span> ${c.deadline||'TBD'}</div>
          </div>
          ${(() => {
            const ms = (c.milestones || []).sort((a,b) => new Date(a.date||'2099-12-31') - new Date(b.date||'2099-12-31'));
            if (ms.length === 0) return '<div style="color:#aaa;font-style:italic;padding:0.5rem 0">No milestones</div>';
            return ms.map(m => {
              const icon = m.status === 'complete' ? '✓' : m.status === 'in-progress' ? '◐' : '◯';
              const iconColor = m.status === 'complete' ? 'var(--forest)' : m.status === 'in-progress' ? 'var(--gold)' : 'var(--forest-mid)';
              const dateObj = m.date ? new Date(m.date) : null;
              const dateStr = dateObj ? dateObj.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'2-digit'}) : 'TBD';
              const isPast = dateObj && dateObj < new Date() ? true : false;
              return `<div style="display:flex;gap:0.6rem;padding:0.4rem 0;border-bottom:0.5px solid var(--parchment);align-items:baseline">
                <span style="font-weight:700;color:${iconColor};min-width:1.5rem">${icon}</span>
                <span style="flex:1;${isPast?'opacity:0.6':''}">${m.name}</span>
                <span style="font-weight:700;min-width:4rem;text-align:right;color:${iconColor}">${dateStr}</span>
              </div>`;
            }).join('');
          })()}
        </div>
      </div>`);
  }

  renderBoard();
  renderCampaignLaborCosts(); // populate on page load — don't wait for Finance tab click

  // ── CAMPAIGN DRILL HANDLERS ───────────────────────────
  // ── FINANCE CATEGORY DRILL HANDLERS ───────────────────
function drillFinanceCategory(categoryName, categoryData) {
  const total = categoryData.reduce((s, item) => s + (item.amount || 0), 0);
  showDrill({
    title: categoryName,
    subtitle: `$${total.toLocaleString()} · ${categoryData.length} items`,
    columns: [
      {label: 'Item',   render: item => `<strong>${item.label}</strong>`},
      {label: 'Amount', render: item => `$${(item.amount || 0).toLocaleString()}`},
      {label: '% of Total', render: item => `${total > 0 ? Math.round((item.amount || 0) / total * 100) : 0}%`},
    ],
    rows: [...categoryData].sort((a, b) => (b.amount || 0) - (a.amount || 0)),
    footer: `Total: $${total.toLocaleString()}`
  });
}

// ── CAMPAIGN DRILL HANDLERS ───────────────────────────
function drillCampaignSpend() {
    const data = loadCampaigns();
    const total = data.reduce((s,c)=>s+c.spent,0);
    const budget = data.reduce((s,c)=>s+c.budget,0);
    showDrill({
      title:'Total Spend', subtitle:`$${total.toLocaleString()} across ${data.length} campaigns`,
      columns:[
        {label:'Campaign', render:c=>`<strong>${c.name}</strong>`},
        {label:'Client',   render:c=>`<span style="color:var(--forest-mid)">${c.client}</span>`},
        {label:'Budget',   render:c=>`$${c.budget.toLocaleString()}`},
        {label:'Spent',    render:c=>`$${c.spent.toLocaleString()}`},
        {label:'% Used',   render:c=>{const p=Math.round(c.spent/c.budget*100);return `<span style="color:${p>=90?'#7A2F2F':p>=70?'var(--gold-deep)':'var(--forest)'};font-weight:700">${p}%</span>`;}},
        {label:'Status',   render:c=>`<span class="badge ${c.status==='active'?'badge-active':c.status==='paused'?'badge-paused':'badge-warm'}">${c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span>`}
      ],
      rows:[...data].sort((a,b)=>b.spent-a.spent),
      footer:`Total: $${total.toLocaleString()} of $${budget.toLocaleString()} budgeted`,
      rowClickFn:'openCampaign'
    });
  }

  function drillCampaignLeads() {
    const data = loadCampaigns();
    const total = data.reduce((s,c)=>s+c.leads,0);
    showDrill({
      title:'Leads Generated', subtitle:`${total.toLocaleString()} total leads`,
      columns:[
        {label:'Campaign',   render:c=>`<strong>${c.name}</strong>`},
        {label:'Platform',   render:c=>c.type},
        {label:'Leads',      render:c=>`<strong>${c.leads.toLocaleString()}</strong>`},
        {label:'CPL',        render:c=>`$${c.cpl>0?c.cpl.toFixed(2):'—'}`},
        {label:'% of Total', render:c=>`${total>0?Math.round(c.leads/total*100):0}%`},
        {label:'Status',     render:c=>`<span class="badge ${c.status==='active'?'badge-active':c.status==='paused'?'badge-paused':'badge-warm'}">${c.status.charAt(0).toUpperCase()+c.status.slice(1)}</span>`}
      ],
      rows:[...data].sort((a,b)=>b.leads-a.leads),
      footer:`Total: ${total.toLocaleString()} leads`,
      rowClickFn:'openCampaign'
    });
  }

  function drillCampaignCPL() {
    const data = loadCampaigns().filter(c=>c.leads>0);
    const avg = data.reduce((s,c)=>s+c.cpl,0)/(data.length||1);
    showDrill({
      title:'Average CPL', subtitle:`$${avg.toFixed(2)} avg · sorted lowest to highest`,
      columns:[
        {label:'Campaign', render:c=>`<strong>${c.name}</strong>`},
        {label:'Leads',    render:c=>c.leads.toLocaleString()},
        {label:'Spend',    render:c=>`$${c.spent.toLocaleString()}`},
        {label:'CPL',      render:c=>`<strong style="color:${c.cpl<=avg?'var(--forest)':'#7A2F2F'}">$${c.cpl.toFixed(2)}</strong>`},
        {label:'vs Avg',   render:c=>{const d=c.cpl-avg,p=Math.round(Math.abs(d)/avg*100);return d<=0?`<span style="color:var(--forest)">↓ ${p}% better</span>`:`<span style="color:#7A2F2F">↑ ${p}% higher</span>`;}}
      ],
      rows:[...data].sort((a,b)=>a.cpl-b.cpl),
      rowClickFn:'openCampaign'
    });
  }

  function drillCampaignActive() {
    const data = loadCampaigns().filter(c=>c.status==='active');
    showDrill({
      title:'Active Campaigns', subtitle:`${data.length} campaigns currently running`,
      columns:[
        {label:'Campaign', render:c=>`<strong>${c.name}</strong>`},
        {label:'Budget',   render:c=>`$${c.budget.toLocaleString()}`},
        {label:'Spent',    render:c=>`$${c.spent.toLocaleString()}`},
        {label:'Leads',    render:c=>c.leads.toLocaleString()},
        {label:'CPL',      render:c=>`$${c.cpl>0?c.cpl.toFixed(2):'—'}`},
        {label:'Deadline', render:c=>{const past=c.deadline&&new Date(c.deadline)<new Date();return `<span style="${past?'color:#7A2F2F;font-weight:700':''}">${c.deadline||'—'}</span>`;}}
      ],
      rows:data,
      rowClickFn:'openCampaign'
    });
  }

  // ── CRM DRILL HANDLERS ────────────────────────────────
  function drillCRMTotal() {
    document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c=>c.classList.remove('active'));
    document.querySelector('[data-tab="crm"]').classList.add('active');
    document.getElementById('crm').classList.add('active');
    setCRMView('list');
  }

  function drillCRMActive() {
    const data = loadContacts().filter(c=>c.stage==='active');
    const total = data.reduce((s,c)=>s+c.value,0);
    showDrill({
      title:'Active Deals', subtitle:`${data.length} contacts · $${total.toLocaleString()} total`,
      columns:[
        {label:'Contact',        render:c=>`<strong>${c.firstName} ${c.lastName}</strong>`},
        {label:'Organization',   render:c=>`<span style="color:var(--forest-mid);font-style:italic">${c.organization}</span>`},
        {label:'Value',          render:c=>`<strong>$${c.value.toLocaleString()}</strong>`},
        {label:'Ranking',        render:c=>`<span style="color:var(--gold)">${stars(c.ranking)}</span>`},
        {label:'Last Contacted', render:c=>c.lastContacted||'—'}
      ],
      rows:[...data].sort((a,b)=>b.value-a.value),
      footer:`Total active value: $${total.toLocaleString()}`,
      rowClickFn:'openContact'
    });
  }

  function drillCRMPipelineValue() {
    const all = loadContacts();
    const total = all.reduce((s,c)=>s+c.value,0);
    const rows = ['new','warm','active','closed'].map((stage,i)=>{
      const g = all.filter(c=>c.stage===stage);
      const val = g.reduce((s,c)=>s+c.value,0);
      return {id:i+1,stage,count:g.length,value:val,pct:total>0?Math.round(val/total*100):0};
    });
    showDrill({
      title:'Pipeline Value', subtitle:`$${total.toLocaleString()} total across all stages`,
      columns:[
        {label:'Stage',      render:r=>`<span class="badge ${STAGE_BADGE[r.stage]}">${STAGE_LABEL[r.stage]}</span>`},
        {label:'Contacts',   render:r=>r.count},
        {label:'Value',      render:r=>`<strong>$${r.value.toLocaleString()}</strong>`},
        {label:'% Pipeline', render:r=>`${r.pct}%`}
      ],
      rows,
      footer:`Total: $${total.toLocaleString()}`
    });
  }

  function drillCRMRanking() {
    const data = [...loadContacts()].sort((a,b)=>b.ranking-a.ranking);
    showDrill({
      title:'Contact Rankings', subtitle:`${data.length} contacts sorted by ranking`,
      columns:[
        {label:'Contact',      render:c=>`<strong>${c.firstName} ${c.lastName}</strong>`},
        {label:'Organization', render:c=>`<span style="color:var(--forest-mid);font-style:italic">${c.organization}</span>`},
        {label:'Stage',        render:c=>`<span class="badge ${STAGE_BADGE[c.stage]}">${STAGE_LABEL[c.stage]}</span>`},
        {label:'Ranking',      render:c=>`<span style="color:var(--gold)">${stars(c.ranking,true)}</span>`},
        {label:'Value',        render:c=>`$${c.value.toLocaleString()}`}
      ],
      rows:data,
      rowClickFn:'openContact'
    });
  }

  // ── FINANCE DRILL HANDLERS ────────────────────────────
  function openDrillModal(title, html) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999;padding:1rem';
    modal.innerHTML = `
      <div style="background:var(--white);border:1px solid var(--parchment);border-radius:4px;max-width:700px;max-height:80vh;overflow:auto;padding:2rem;box-shadow:0 10px 40px rgba(0,0,0,0.1)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
          <div style="font-size:1.3rem;font-weight:700;color:var(--forest)">${title}</div>
          <button style="background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--forest-mid)" onclick="this.closest('div').parentElement.parentElement.remove()">×</button>
        </div>
        ${html}
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  }

  function drillFinanceGifts() {
    const donors = loadDonors().filter(d=>d.stage==='thank');
    const total = donors.reduce((s,d)=>s+d.amount,0);
    showDrill({
      title:'YTD Gifts', subtitle:`$${total.toLocaleString()} · ${donors.length} closed donors`,
      columns:[
        {label:'Donor',        render:d=>`<strong>${d.name}</strong>`},
        {label:'Organization', render:d=>`<span style="color:var(--forest-mid);font-style:italic">${d.organization||d.type}</span>`},
        {label:'Gift Type',    render:d=>d.giftType.charAt(0).toUpperCase()+d.giftType.slice(1).replace('-',' ')},
        {label:'Amount',       render:d=>`<strong>$${d.amount.toLocaleString()}</strong>`},
        {label:'Next Step',    render:d=>`<span style="font-size:0.92rem;color:var(--forest-mid)">${d.nextAction||'—'}</span>`}
      ],
      rows:[...donors].sort((a,b)=>b.amount-a.amount),
      footer:`Total YTD: $${total.toLocaleString()}`,
      rowClickFn:'openDonor'
    });
  }

  function drillFinanceAsk() {
    const donors = loadDonors().filter(d=>d.stage==='ask');
    const total = donors.reduce((s,d)=>s+d.amount,0);
    showDrill({
      title:'In Ask Stage', subtitle:`$${total.toLocaleString()} in outstanding asks`,
      columns:[
        {label:'Donor',        render:d=>`<strong>${d.name}</strong>`},
        {label:'Organization', render:d=>`<span style="color:var(--forest-mid);font-style:italic">${d.organization||d.type}</span>`},
        {label:'Ask Amount',   render:d=>`<strong>$${d.amount.toLocaleString()}</strong>`},
        {label:'Gift Type',    render:d=>d.giftType.charAt(0).toUpperCase()+d.giftType.slice(1).replace('-',' ')},
        {label:'Next Action',  render:d=>`<span style="font-size:0.92rem">${d.nextAction||'—'}</span>`}
      ],
      rows:[...donors].sort((a,b)=>b.amount-a.amount),
      footer:`Total in asks: $${total.toLocaleString()}`,
      rowClickFn:'openDonor'
    });
  }

  function drillFinanceGrants() {
    const grants = loadGrants().filter(g=>['pending','in-review'].includes(g.status));
    const total = grants.reduce((s,g)=>s+g.amount,0);
    showDrill({
      title:'Grants Pipeline', subtitle:`$${total.toLocaleString()} pending or in review`,
      columns:[
        {label:'Grant',     render:g=>`<strong>${g.name}</strong>`},
        {label:'Funder',    render:g=>`<span style="color:var(--forest-mid);font-style:italic">${g.funder}</span>`},
        {label:'Amount',    render:g=>`<strong>$${g.amount.toLocaleString()}</strong>`},
        {label:'Status',    render:g=>`<span class="badge ${GRANT_STATUS_BADGE[g.status]}">${GRANT_STATUS_LABEL[g.status]}</span>`},
        {label:'Deadline',  render:g=>g.deadline||'—'},
        {label:'Submitted', render:g=>g.submittedDate||'—'}
      ],
      rows:[...grants].sort((a,b)=>b.amount-a.amount),
      footer:`Total pipeline: $${total.toLocaleString()}`
    });
  }

  function drillFinanceDonors() {
    const donors = loadDonors();
    showDrill({
      title:'All Donors', subtitle:`${donors.length} donors across all stages`,
      columns:[
        {label:'Donor',        render:d=>`<strong>${d.name}</strong>`},
        {label:'Type',         render:d=>d.type.charAt(0).toUpperCase()+d.type.slice(1)},
        {label:'Stage',        render:d=>`<span class="badge ${DONOR_STAGE_BADGE[d.stage]}">${DONOR_STAGE_LABEL[d.stage]}</span>`},
        {label:'Amount',       render:d=>`$${d.amount.toLocaleString()}`},
        {label:'Gift Type',    render:d=>d.giftType.charAt(0).toUpperCase()+d.giftType.slice(1).replace('-',' ')},
        {label:'Last Touched', render:d=>d.lastContacted||'—'}
      ],
      rows:donors,
      rowClickFn:'openDonor'
    });
  }

  // ── DECK GENERATOR (removed — Creative Studio replaced with Add-On Gate) ──
  function updateApiKeyVisibility() {} // no-op, kept for safety

  // Initialize Proposals tab
  initProposalProjectSelect();

  // ── IMPORT CONTACTS MODAL ──────────────────────────────
  function openImportContacts() { document.getElementById('import-contacts-modal').style.display = 'flex'; }
  function closeImportContacts() { document.getElementById('import-contacts-modal').style.display = 'none'; }

  function switchImportTab(tab) {
    const tabs = ['brevo','sheets','csv'];
    tabs.forEach(t => {
      document.getElementById('import-panel-' + t).style.display = (t === tab) ? 'block' : 'none';
      const btn = document.getElementById('import-tab-' + t);
      if (btn) {
        btn.style.borderBottomColor = (t === tab) ? 'var(--forest)' : 'transparent';
        btn.style.color = (t === tab) ? 'var(--forest)' : 'var(--forest-mid)';
      }
    });
  }

  function simulateBrevoSync() {
    const key = document.getElementById('brevo-api-key').value;
    const status = document.getElementById('brevo-status');
    if (!key) { status.innerHTML = '<span style="color:#B05050">Please enter your Brevo API key.</span>'; return; }
    status.innerHTML = '<span style="color:var(--gold-deep)">Connecting to Brevo...</span>';
    setTimeout(() => {
      status.innerHTML = '<span style="color:var(--forest)">Connected to Brevo. Syncing contacts... <strong>47 contacts imported.</strong></span>';
    }, 1500);
  }

  function simulateSheetImport() {
    const url = document.getElementById('gsheet-url').value;
    const status = document.getElementById('sheets-status');
    if (!url) { status.innerHTML = '<span style="color:#B05050">Please enter a Google Sheet URL.</span>'; return; }
    status.innerHTML = '<span style="color:var(--gold-deep)">Reading sheet...</span>';
    setTimeout(() => {
      status.innerHTML = '<span style="color:var(--forest)">Import complete. <strong>32 contacts imported</strong> from Google Sheet.</span>';
    }, 1500);
  }

  function handleCSVSelect() {
    const input = document.getElementById('csv-file-input');
    const nameDiv = document.getElementById('csv-file-name');
    const mappingDiv = document.getElementById('csv-mapping');
    const uploadBtn = document.getElementById('csv-upload-btn');
    if (input.files.length > 0) {
      nameDiv.textContent = 'Selected: ' + input.files[0].name;
      mappingDiv.style.display = 'block';
      uploadBtn.style.display = 'block';
    }
  }

  function simulateCSVImport() {
    const input = document.getElementById('csv-file-input');
    const status = document.getElementById('csv-status');
    if (!input.files.length) { status.innerHTML = '<span style="color:#B05050">Please select a file first.</span>'; return; }
    status.innerHTML = '<span style="color:var(--gold-deep)">Processing file...</span>';
    setTimeout(() => {
      status.innerHTML = '<span style="color:var(--forest)">Import complete. <strong>58 contacts imported</strong> from ' + input.files[0].name + '.</span>';
    }, 1500);
  }

  // ── MILESTONE BAR RENDERER ─────────────────────────────
  function renderMilestoneBar(c) {
    const ms = c.milestones || [];
    if (ms.length === 0) return '';
    const done = ms.filter(m => m.status === 'complete').length;
    const inProg = ms.filter(m => m.status === 'in-progress').length;
    const pct = Math.round(((done + inProg * 0.5) / ms.length) * 100);
    
    // Sort milestones by date
    const sortedMs = [...ms].sort((a, b) => new Date(a.date || '2099-12-31') - new Date(b.date || '2099-12-31'));
    
    return `<div style="margin-top:0.6rem;padding-top:0.5rem;border-top:1px solid var(--parchment)">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.3rem">
        <span style="font-size:0.75rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--forest-mid)">Key Milestones</span>
        <span style="font-size:0.75rem;color:var(--forest-mid)">${done}/${ms.length} complete</span>
      </div>
      <!-- Timeline bar -->
      <div style="display:flex;gap:3px;margin-bottom:0.4rem">
        ${ms.map(m => {
          const color = m.status === 'complete' ? 'var(--forest)' : m.status === 'in-progress' ? 'var(--gold)' : 'var(--parchment)';
          return `<div title="${m.name} — ${m.date} (${m.status})" style="flex:1;height:5px;background:${color};border-radius:2px;opacity:0.8"></div>`;
        }).join('')}
      </div>
      <!-- Milestone dates list -->
      <div style="display:flex;flex-direction:column;gap:0.25rem;font-size:0.7rem">
        ${sortedMs.map((m, i) => {
          const statusColor = m.status === 'complete' ? 'var(--forest)' : m.status === 'in-progress' ? 'var(--gold)' : 'var(--forest-mid)';
          const dateObj = new Date(m.date);
          const dateStr = m.date ? dateObj.toLocaleDateString('en-US', {month:'short', day:'numeric'}) : 'TBD';
          const icon = m.status === 'complete' ? '✓' : m.status === 'in-progress' ? '◐' : '◯';
          return `<div style="display:flex;gap:0.3rem;align-items:center;color:${statusColor};white-space:nowrap">
            <span style="font-weight:700">${icon}</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis">${m.name}</span>
            <span style="font-weight:600;min-width:3.5rem;text-align:right">${dateStr}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }

  // ── P&L DRILL-DOWN FUNCTIONS ──────────────────────────
  function drillPLRevenue() {
    const paidInvoices = QB_INVOICES_DEMO.filter(inv => inv.status === 'Paid');
    const total = paidInvoices.reduce((s,i) => s + i.amount, 0);
    const rows = paidInvoices.map(inv => `
      <tr style="border-bottom:1px solid var(--parchment)">
        <td style="padding:0.5rem;color:var(--forest);font-weight:600">${inv.customer}</td>
        <td style="padding:0.5rem;color:var(--forest-mid)">${inv.description}</td>
        <td style="padding:0.5rem;font-size:0.82rem;color:#999">${inv.date}</td>
        <td style="padding:0.5rem;text-align:right;font-weight:700;color:var(--green)">${DASH_FMT(inv.amount)}</td>
      </tr>`).join('');
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">YTD Revenue</div>
            <div class="drill-sub">${paidInvoices.length} paid invoices · Total: ${DASH_FMT(total)}</div>
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button>
        </div>
        <table class="drill-table">
          <thead><tr><th>Client</th><th>Description</th><th>Date</th><th style="text-align:right">Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`);
  }

  function drillPLExpenses() {
    const total = QB_EXPENSES_DEMO.reduce((s,e) => s + e.amount, 0);
    const rows = QB_EXPENSES_DEMO.map((exp, i) => `
      <tr style="border-bottom:1px solid var(--parchment);cursor:pointer" onclick="drillSpendingCategory('${exp.category.replace(/'/g, "\\'")}')">
        <td style="padding:0.5rem">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${DONUT_COLORS[i % DONUT_COLORS.length]};margin-right:0.4rem;vertical-align:middle"></span>
          <span style="color:var(--forest);font-weight:600">${exp.category}</span>
        </td>
        <td style="padding:0.5rem;text-align:center;color:var(--forest-mid)">${exp.items ? exp.items.length : '—'} items</td>
        <td style="padding:0.5rem;text-align:right;font-weight:700;color:var(--ember)">${DASH_FMT(exp.amount)}</td>
        <td style="padding:0.5rem;text-align:right;color:#999;font-size:0.8rem">${((exp.amount/total)*100).toFixed(0)}%</td>
      </tr>`).join('');
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">YTD Expenses</div>
            <div class="drill-sub">${QB_EXPENSES_DEMO.length} categories · Total: ${DASH_FMT(total)} · Click a category for details</div>
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button>
        </div>
        <table class="drill-table">
          <thead><tr><th>Category</th><th style="text-align:center">Items</th><th style="text-align:right">Amount</th><th style="text-align:right">%</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`);
  }

  function drillPLNet() {
    const paidInvoices = QB_INVOICES_DEMO.filter(inv => inv.status === 'Paid');
    const totalRevenue = paidInvoices.reduce((s,i) => s + i.amount, 0);
    const totalExpenses = QB_EXPENSES_DEMO.reduce((s,e) => s + e.amount, 0);
    const net = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? ((net / totalRevenue) * 100).toFixed(1) : 0;
    // Revenue by client
    const byClient = {};
    paidInvoices.forEach(inv => { byClient[inv.customer] = (byClient[inv.customer] || 0) + inv.amount; });
    const clientRows = Object.entries(byClient).sort((a,b) => b[1]-a[1]).map(([c,a]) => `
      <tr style="border-bottom:1px solid var(--parchment)">
        <td style="padding:0.4rem 0.5rem;color:var(--forest)">${c}</td>
        <td style="padding:0.4rem 0.5rem;text-align:right;color:var(--green);font-weight:600">+${DASH_FMT(a)}</td>
      </tr>`).join('');
    const expRows = QB_EXPENSES_DEMO.map(e => `
      <tr style="border-bottom:1px solid var(--parchment)">
        <td style="padding:0.4rem 0.5rem;color:var(--forest)">${e.category}</td>
        <td style="padding:0.4rem 0.5rem;text-align:right;color:var(--ember);font-weight:600">-${DASH_FMT(e.amount)}</td>
      </tr>`).join('');
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">Net Income: ${(net >= 0 ? '+' : '-') + DASH_FMT(net)}</div>
            <div class="drill-sub">Margin: ${margin}% · Revenue: ${DASH_FMT(totalRevenue)} · Expenses: ${DASH_FMT(totalExpenses)}</div>
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
          <div>
            <div style="font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--green);margin-bottom:0.5rem">Revenue by Client</div>
            <table class="drill-table"><tbody>${clientRows}</tbody></table>
          </div>
          <div>
            <div style="font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--ember);margin-bottom:0.5rem">Expenses by Category</div>
            <table class="drill-table"><tbody>${expRows}</tbody></table>
          </div>
        </div>
      </div>`);
  }

  function drillCashOnHand() {
    const cards = [];
    for (const [bank, accounts] of Object.entries(BANK_ACCOUNTS_DEMO)) {
      accounts.forEach(acct => cards.push({ bank, ...acct }));
    }
    const totalCash = cards.reduce((s,c) => s + c.balance, 0);
    const rows = cards.map(c => {
      const balColor = c.balance < 0 ? 'var(--ember)' : 'var(--green)';
      return `
      <tr style="border-bottom:1px solid var(--parchment)">
        <td style="padding:0.5rem;color:var(--forest);font-weight:600">${c.bank}</td>
        <td style="padding:0.5rem;color:var(--forest-mid)">${c.name} ••${c.mask}</td>
        <td style="padding:0.5rem;color:var(--forest-mid)">${c.type}</td>
        <td style="padding:0.5rem;text-align:right;font-weight:700;color:${balColor}">${(c.balance < 0 ? '-' : '') + DASH_FMT(c.balance)}</td>
        ${c.available !== undefined ? `<td style="padding:0.5rem;text-align:right;color:#999">${DASH_FMT(c.available)}</td>` : '<td></td>'}
      </tr>`;
    }).join('');
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">Cash on Hand: ${DASH_FMT(totalCash)}</div>
            <div class="drill-sub">${cards.length} accounts across ${Object.keys(BANK_ACCOUNTS_DEMO).length} institutions</div>
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button>
        </div>
        <table class="drill-table">
          <thead><tr><th>Bank</th><th>Account</th><th>Type</th><th style="text-align:right">Balance</th><th style="text-align:right">Available</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`);
  }

  function drillSpendingCategory(categoryName) {
    // First try QB itemized data, fall back to bank transactions
    const qbCat = QB_EXPENSES_DEMO.find(e => e.category === categoryName);
    let items = [];
    let source = 'Expense Detail';
    if (qbCat && qbCat.items && qbCat.items.length > 0) {
      items = qbCat.items;
      source = 'QB + Bank Data';
    } else {
      const categoryTxns = BANK_TRANSACTIONS_DEMO.filter(t => {
        const txnCategory = t.category === 'Contractor' ? 'Contractor Payments' :
                           t.category === 'Advertising' ? 'Advertising' :
                           t.category === 'Software' ? 'Software & Tools' :
                           t.category === 'Rent' ? 'Office & Rent' :
                           t.category === 'Meals & Entertainment' ? 'Meals & Entertainment' :
                           t.category === 'Transport' ? 'Travel & Transport' : t.category;
        return txnCategory === categoryName && t.amount < 0;
      });
      items = categoryTxns.map(t => ({vendor: t.description, amount: Math.abs(t.amount), description: t.category, date: t.date}));
      source = 'Bank Transactions';
    }
    const total = items.reduce((s,it) => s + it.amount, 0);
    const rows = items.map(it => `
      <tr style="border-bottom:1px solid var(--parchment)">
        <td style="padding:0.5rem;color:var(--forest);font-weight:600">${it.vendor}</td>
        <td style="padding:0.5rem;color:var(--forest-mid)">${it.description}</td>
        <td style="padding:0.5rem;font-size:0.82rem;color:#999">${it.date}</td>
        <td style="padding:0.5rem;text-align:right;font-weight:700;color:var(--ember)">${DASH_FMT(it.amount)}</td>
      </tr>`).join('');
    openDrillOverlay(`
      <div class="drill-panel">
        <div class="drill-header">
          <div>
            <div class="drill-title">${categoryName}</div>
            <div class="drill-sub">${items.length} items · Total: ${DASH_FMT(total)} · Source: ${source}</div>
          </div>
          <button class="btn-drill-close" onclick="closeDrill()">Close &times;</button>
        </div>
        <table class="drill-table">
          <thead><tr>
            <th>Vendor</th><th>Description</th><th>Period</th><th style="text-align:right">Amount</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`);
  }
