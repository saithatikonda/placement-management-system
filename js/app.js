/**
 * Placement Command — Main Application Orchestrator
 * Route handling, portal switching, modal managers, TPO administration, command palette, and event listeners.
 */

import { api } from './api.js';
import { StudentPortal } from './student.js';
import { CompanyPortal } from './company.js';

class PlacementCommandApp {
  constructor() {
    this.currentPortal = 'student'; // 'student' | 'company' | 'admin'
    this.studentPortal = new StudentPortal(this);
    this.companyPortal = new CompanyPortal(this);
    this.candidates = [];
    this.jobs = [];
    this.kpis = {};
    this.adminFilters = {
      minCgpa: 7.5,
      backlog: 'zero', // 'zero' | 'all'
      branches: ['CSE', 'IT', 'ECE'],
      search: '',
    };
  }

  async init() {
    // Check Spring Boot status
    await this.checkBackendStatus();

    // Fetch initial global data
    const kpiRes = await api.getKpis();
    this.kpis = kpiRes.data;

    const candRes = await api.getCandidates();
    this.candidates = candRes.data;

    const jobRes = await api.getJobs();
    this.jobs = jobRes.data;

    // Setup global listeners
    this.bindGlobalNavigation();
    this.bindModals();
    this.bindCommandPalette();

    // Initialize sub-portals
    await this.studentPortal.init();
    await this.companyPortal.init();
    this.renderAdminView();

    // Set initial view
    this.switchPortal('student');

    console.log('⚡ Placement Command System Initialized in Obsidian & Emerald Theme.');
  }

  async checkBackendStatus() {
    const isLive = await api.checkBackendHealth();
    const statusPill = document.getElementById('backendStatusPill');
    if (statusPill) {
      if (isLive) {
        statusPill.className = 'status-pill';
        statusPill.innerHTML = '<span class="ctc-pulse-dot" style="background:#10B981;box-shadow:0 0 8px #10B981;"></span> Spring Boot Live';
      } else {
        statusPill.className = 'status-pill mock';
        statusPill.innerHTML = '<span class="ctc-pulse-dot"></span> Mock Mode (Auto Fallback)';
      }
    }
  }

  switchPortal(portalName) {
    this.currentPortal = portalName;

    // Toggle Tab Button States
    const studentBtn = document.getElementById('portalTabStudent');
    const companyBtn = document.getElementById('portalTabCompany');
    const adminBtn = document.getElementById('portalTabAdmin');

    if (studentBtn) studentBtn.className = `role-tab-btn ${portalName === 'student' ? 'active-student' : ''}`;
    if (companyBtn) companyBtn.className = `role-tab-btn ${portalName === 'company' ? 'active-company' : ''}`;
    if (adminBtn) adminBtn.className = `role-tab-btn ${portalName === 'admin' ? 'active-admin' : ''}`;

    // Switch View containers with smooth fade/slide keyframe
    const studentView = document.getElementById('studentPortalView');
    const companyView = document.getElementById('companyPortalView');
    const adminView = document.getElementById('adminPortalView');

    if (studentView) studentView.className = `portal-view ${portalName === 'student' ? 'active' : ''}`;
    if (companyView) companyView.className = `portal-view ${portalName === 'company' ? 'active' : ''}`;
    if (adminView) adminView.className = `portal-view ${portalName === 'admin' ? 'active' : ''}`;

    // Update active badge in header
    const portalNameBadge = document.getElementById('activePortalLabel');
    if (portalNameBadge) {
      if (portalName === 'student') portalNameBadge.textContent = 'Student Portal';
      else if (portalName === 'company') portalNameBadge.textContent = 'Company Recruiter Console';
      else if (portalName === 'admin') portalNameBadge.textContent = 'TPO Institutional Cockpit';
    }
  }

  bindGlobalNavigation() {
    const studentBtn = document.getElementById('portalTabStudent');
    const companyBtn = document.getElementById('portalTabCompany');
    const adminBtn = document.getElementById('portalTabAdmin');

    if (studentBtn) studentBtn.addEventListener('click', () => this.switchPortal('student'));
    if (companyBtn) companyBtn.addEventListener('click', () => this.switchPortal('company'));
    if (adminBtn) adminBtn.addEventListener('click', () => this.switchPortal('admin'));

    // Command palette trigger button in header
    const openCmdPaletteBtn = document.getElementById('openCmdPaletteBtn');
    if (openCmdPaletteBtn) {
      openCmdPaletteBtn.addEventListener('click', () => this.openCommandPalette());
    }
  }

  // --- TPO / ADMIN COCKPIT RENDERER ---
  renderAdminView() {
    const container = document.getElementById('adminPortalView');
    if (!container) return;

    const filteredCandidates = this.candidates.filter((c) => {
      const matchCgpa = c.cgpa >= this.adminFilters.minCgpa;
      const matchBacklog = this.adminFilters.backlog === 'all' || c.backlogs === 0;
      const matchBranch = this.adminFilters.branches.includes(c.branch);
      const matchSearch =
        c.name.toLowerCase().includes(this.adminFilters.search.toLowerCase()) ||
        c.rollNo.toLowerCase().includes(this.adminFilters.search.toLowerCase());
      return matchCgpa && matchBacklog && matchBranch && matchSearch;
    });

    const selectedCount = filteredCandidates.filter((c) => c.selected).length;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
        <!-- 1. TPO EXECUTIVE COCKPIT RIBBON -->
        <section class="pms-glass-card" style="padding: 24px 28px;" aria-label="TPO Administration KPIs">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 54px; height: 54px; border-radius: var(--radius-lg); background: #081611; border: 2px solid var(--border-emerald-glow); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; color: var(--accent-emerald-primary);">
                🏛️
              </div>
              <div>
                <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-white);">
                  Training & Placement Operations Cockpit
                </h2>
                <p style="font-size: 0.775rem; color: var(--text-secondary); margin-top: 2px;">
                  Real-time Candidate Shortlisting Engine & Enterprise University Records
                </p>
              </div>
            </div>

            <!-- TPO Utility Actions -->
            <div style="display: flex; align-items: center; gap: 10px;">
              <button id="adminSyncErpBtn" class="btn btn-glass btn-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                <span>Sync University ERP</span>
              </button>
              <button id="adminExportCsvBtn" class="btn btn-emerald btn-sm">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                <span>Export Shortlist CSV</span>
              </button>
            </div>
          </div>

          <!-- KPI Cards -->
          <div class="stats-ribbon-grid" style="margin-top: 24px;">
            <div class="stat-metric-card">
              <span class="stat-label">Total Cohort Enrolled</span>
              <div class="stat-value" style="color: var(--text-white);">${this.kpis.enrolledStudents || 1024}</div>
              <span style="font-size: 0.7rem; color: var(--accent-emerald-text);">${this.kpis.totalEligible || 850} Placement Ready</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Placement Conversion</span>
              <div class="stat-value" style="color: var(--accent-emerald-primary);">${this.kpis.placementRate || 72.0}%</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">${this.kpis.placedStudents || 612} Unique Students Placed</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Companies Visited</span>
              <div class="stat-value" style="color: #38BDF8;">${this.kpis.companiesVisited || 48}</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">${this.kpis.inProgressDrives || 6} Drives in Progress</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Highest Package</span>
              <div class="stat-value" style="color: #FB923C;">${this.kpis.highestCtc || 44.0} LPA</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">Avg: ${this.kpis.averageCtc || 9.2} LPA</span>
            </div>
          </div>
        </section>

        <!-- 2. SHORTLISTING FILTER CONSOLE & ROSTER -->
        <section class="pms-glass-card" style="padding: 24px 28px;" aria-label="Candidate Shortlisting Filters">
          <div style="display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 24px;">
            <!-- Criteria controls -->
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 18px;">
              <!-- Min CGPA slider -->
              <div style="min-width: 220px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                  <span class="form-label" style="margin: 0;">Min CGPA Filter</span>
                  <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--accent-emerald-primary); font-size: 0.85rem;">
                    ≥ ${this.adminFilters.minCgpa.toFixed(1)}
                  </span>
                </div>
                <input 
                  type="range" 
                  id="adminCgpaFilterSlider" 
                  class="pms-range" 
                  min="6.0" 
                  max="9.5" 
                  step="0.1" 
                  value="${this.adminFilters.minCgpa}" 
                />
              </div>

              <!-- Backlog Toggle -->
              <div>
                <span class="form-label">Backlogs</span>
                <div style="display: flex; gap: 6px;">
                  <button 
                    class="btn btn-sm ${this.adminFilters.backlog === 'zero' ? 'btn-emerald' : 'btn-glass'}" 
                    id="adminZeroBacklogsBtn"
                  >
                    Zero Backlogs
                  </button>
                  <button 
                    class="btn btn-sm ${this.adminFilters.backlog === 'all' ? 'btn-emerald' : 'btn-glass'}" 
                    id="adminAllBacklogsBtn"
                  >
                    All Allowed
                  </button>
                </div>
              </div>

              <!-- Branches -->
              <div>
                <span class="form-label">Branches</span>
                <div style="display: flex; gap: 6px;">
                  ${['CSE', 'IT', 'ECE', 'EEE', 'Mechanical'].map((br) => `
                    <button 
                      class="btn btn-sm admin-branch-btn ${this.adminFilters.branches.includes(br) ? 'btn-emerald' : 'btn-glass'}" 
                      data-branch="${br}"
                      style="padding: 4px 10px; font-size: 0.75rem;"
                    >
                      ${br}
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Search Field -->
            <div style="position: relative; width: 260px;">
              <input 
                type="text" 
                id="adminSearchInput" 
                class="form-control" 
                placeholder="Search candidates..." 
                value="${this.adminFilters.search}"
                style="padding-left: 36px; height: 38px; border-radius: var(--radius-pill);"
              />
              <svg style="position: absolute; left: 12px; top: 11px; color: var(--text-secondary);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          <!-- Table Header Ribbon -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <span style="font-size: 0.8rem; color: var(--text-secondary);">
              Showing <strong>${filteredCandidates.length}</strong> eligible candidates (${selectedCount} shortlisted)
            </span>
            <div style="display: flex; gap: 8px;">
              <button id="adminSelectAllBtn" class="btn btn-glass btn-sm" style="font-size: 0.72rem;">
                Select All
              </button>
              <button id="adminDeselectAllBtn" class="btn btn-glass btn-sm" style="font-size: 0.72rem;">
                Deselect All
              </button>
            </div>
          </div>

          <!-- Roster Table -->
          <div class="pms-table-container">
            <table class="pms-table">
              <thead>
                <tr>
                  <th style="width: 40px;">Select</th>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Active Backlogs</th>
                  <th>Stage Status</th>
                  <th style="text-align: right;">Dossier</th>
                </tr>
              </thead>
              <tbody>
                ${filteredCandidates.length === 0 ? `
                  <tr>
                    <td colspan="8" style="text-align: center; padding: 36px; color: var(--text-secondary);">
                      No candidates match the selected criteria.
                    </td>
                  </tr>
                ` : filteredCandidates.map((c) => `
                  <tr>
                    <td>
                      <input 
                        type="checkbox" 
                        class="admin-cand-checkbox" 
                        data-id="${c.id}" 
                        ${c.selected ? 'checked' : ''}
                        style="cursor: pointer; width: 16px; height: 16px; accent-color: #10B981;"
                      />
                    </td>
                    <td>
                      <div style="font-weight: 700; color: var(--text-white);">${c.name}</div>
                      <div style="font-size: 0.7rem; color: var(--text-secondary);">${c.email}</div>
                    </td>
                    <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.825rem;">${c.rollNo}</td>
                    <td><span class="tag-pill tag-neutral">${c.branch} - Sec ${c.section || 'A'}</span></td>
                    <td>
                      <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--accent-emerald-primary); font-size: 0.85rem;">
                        ${c.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span style="color: ${c.backlogs === 0 ? '#10B981' : '#F97316'}; font-weight: 700; font-family: 'JetBrains Mono', monospace;">
                        ${c.backlogs}
                      </span>
                    </td>
                    <td><span class="tag-pill">${c.driveStage}</span></td>
                    <td style="text-align: right;">
                      <button class="btn btn-glass btn-sm admin-view-resume-btn" data-id="${c.id}">
                        View Dossier
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;

    this.bindAdminEvents();
  }

  bindAdminEvents() {
    // Slider
    const slider = document.getElementById('adminCgpaFilterSlider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.adminFilters.minCgpa = parseFloat(e.target.value);
        this.renderAdminView();
      });
    }

    // Backlog toggles
    const zeroBtn = document.getElementById('adminZeroBacklogsBtn');
    const allBtn = document.getElementById('adminAllBacklogsBtn');
    if (zeroBtn) {
      zeroBtn.addEventListener('click', () => {
        this.adminFilters.backlog = 'zero';
        this.renderAdminView();
      });
    }
    if (allBtn) {
      allBtn.addEventListener('click', () => {
        this.adminFilters.backlog = 'all';
        this.renderAdminView();
      });
    }

    // Branches
    const branchBtns = document.querySelectorAll('.admin-branch-btn');
    branchBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const br = btn.getAttribute('data-branch');
        if (this.adminFilters.branches.includes(br)) {
          if (this.adminFilters.branches.length > 1) {
            this.adminFilters.branches = this.adminFilters.branches.filter((b) => b !== br);
          }
        } else {
          this.adminFilters.branches.push(br);
        }
        this.renderAdminView();
      });
    });

    // Search
    const searchInput = document.getElementById('adminSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.adminFilters.search = e.target.value;
        this.renderAdminView();
      });
    }

    // Checkbox toggles
    const checkboxes = document.querySelectorAll('.admin-cand-checkbox');
    checkboxes.forEach((cb) => {
      cb.addEventListener('change', () => {
        const id = cb.getAttribute('data-id');
        const c = this.candidates.find((cand) => cand.id === id);
        if (c) c.selected = cb.checked;
      });
    });

    // Select all / Deselect all
    const selectAllBtn = document.getElementById('adminSelectAllBtn');
    const deselectAllBtn = document.getElementById('adminDeselectAllBtn');
    if (selectAllBtn) {
      selectAllBtn.addEventListener('click', () => {
        this.candidates.forEach((c) => (c.selected = true));
        this.renderAdminView();
      });
    }
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener('click', () => {
        this.candidates.forEach((c) => (c.selected = false));
        this.renderAdminView();
      });
    }

    // Export CSV
    const exportCsvBtn = document.getElementById('adminExportCsvBtn');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => this.exportShortlistCsv());
    }

    // ERP Sync
    const syncErpBtn = document.getElementById('adminSyncErpBtn');
    if (syncErpBtn) {
      syncErpBtn.addEventListener('click', () => {
        this.showToast('Synchronizing with University ERP database...');
        setTimeout(() => {
          this.showToast('✓ Successfully synced 1,024 student records from ERP database!');
        }, 1200);
      });
    }

    // View resume
    const resumeBtns = document.querySelectorAll('.admin-view-resume-btn');
    resumeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const c = this.candidates.find((cand) => cand.id === id);
        if (c) this.openResumeModal(c);
      });
    });
  }

  exportShortlistCsv() {
    const selected = this.candidates.filter((c) => c.selected);
    const list = selected.length > 0 ? selected : this.candidates;

    const headers = ['Roll No', 'Name', 'Email', 'Branch', 'CGPA', 'Backlogs', 'Stage'];
    const rows = list.map((c) => [
      c.rollNo,
      `"${c.name}"`,
      c.email,
      c.branch,
      c.cgpa,
      c.backlogs,
      c.driveStage
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `campus_shortlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast(`✓ Exported ${list.length} candidate records to CSV!`);
  }

  // --- MODALS IMPLEMENTATION ---
  bindModals() {
    // Post Drive Modal
    const postModalOverlay = document.getElementById('postJobModalOverlay');
    const closePostModalBtn = document.getElementById('closePostJobModalBtn');
    const cancelPostModalBtn = document.getElementById('cancelPostJobModalBtn');
    const postJobForm = document.getElementById('postJobForm');

    const closePostModal = () => postModalOverlay?.classList.remove('open');

    if (closePostModalBtn) closePostModalBtn.addEventListener('click', closePostModal);
    if (cancelPostModalBtn) cancelPostModalBtn.addEventListener('click', closePostModal);

    if (postJobForm) {
      postJobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const companyName = document.getElementById('jobCompanyNameInput')?.value || 'Tech Corp';
        const role = document.getElementById('jobRoleInput')?.value || 'Software Engineer';
        const ctc = document.getElementById('jobCtcInput')?.value || '28.0 LPA';
        const minCgpa = parseFloat(document.getElementById('jobMinCgpaInput')?.value || '7.5');
        const category = document.getElementById('jobCategorySelect')?.value || 'Super Dream';
        const workMode = document.getElementById('jobWorkModeSelect')?.value || 'Hybrid';
        const location = document.getElementById('jobLocationInput')?.value || 'Bengaluru';
        const description = document.getElementById('jobDescriptionInput')?.value || 'Full stack engineering drive.';

        const newDrive = {
          companyName,
          companyLogo: companyName.substring(0, 4).toUpperCase(),
          role,
          ctc,
          ctcNumeric: parseFloat(ctc) || 20.0,
          category,
          minCgpa,
          maxBacklogs: 0,
          workMode,
          location,
          description,
          eligibleBranches: ['CSE', 'IT', 'ECE'],
        };

        const res = await api.createJob(newDrive);
        this.jobs.unshift(res.data);

        closePostModal();
        postJobForm.reset();

        this.showToast(`✓ Created recruitment drive for ${companyName} (${ctc})!`);

        // Refresh subportals
        await this.studentPortal.init();
        await this.companyPortal.init();
        this.renderAdminView();
      });
    }

    // Resume Modal close
    const resumeModalOverlay = document.getElementById('resumeModalOverlay');
    const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
    if (closeResumeModalBtn && resumeModalOverlay) {
      closeResumeModalBtn.addEventListener('click', () => resumeModalOverlay.classList.remove('open'));
    }
  }

  openResumeModal(candidate) {
    const resumeModalOverlay = document.getElementById('resumeModalOverlay');
    const container = document.getElementById('resumeModalBody');
    if (!resumeModalOverlay || !container) return;

    container.innerHTML = `
      <div style="background: #091410; border: 1px solid rgba(16, 185, 129, 0.2); border-radius: var(--radius-lg); padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(16, 185, 129, 0.15); padding-bottom: 18px; margin-bottom: 20px;">
          <div>
            <h3 style="font-size: 1.35rem; font-weight: 800; color: #FFFFFF;">${candidate.name}</h3>
            <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">
              ${candidate.rollNo} • B.Tech ${candidate.branch} • ${candidate.email}
            </p>
          </div>
          <span class="tag-pill tag-amber" style="font-size: 0.75rem;">
            Institutional Verified Dossier
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
          <div style="background: rgba(17, 37, 30, 0.6); padding: 12px 16px; border-radius: var(--radius-md);">
            <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Verified CGPA</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--accent-emerald-primary); font-family: 'JetBrains Mono', monospace;">
              ${candidate.cgpa.toFixed(2)} / 10.0
            </div>
          </div>
          <div style="background: rgba(17, 37, 30, 0.6); padding: 12px 16px; border-radius: var(--radius-md);">
            <div style="font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 700;">Active Backlogs</div>
            <div style="font-size: 1.4rem; font-weight: 800; color: ${candidate.backlogs === 0 ? '#10B981' : '#F97316'}; font-family: 'JetBrains Mono', monospace;">
              ${candidate.backlogs || 0}
            </div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 0.825rem; font-weight: 700; color: var(--text-white); margin-bottom: 8px;">Key Technical Competencies</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 6px;">
            ${(candidate.skills || ['Distributed Systems', 'C++', 'Java Spring Boot', 'Kafka', 'System Design', 'PostgreSQL']).map(s => `
              <span class="tag-pill tag-neutral">${s}</span>
            `).join('')}
          </div>
        </div>

        <div>
          <h4 style="font-size: 0.825rem; font-weight: 700; color: var(--text-white); margin-bottom: 8px;">Academic Record Highlights</h4>
          <p style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.5;">
            Consistent top 5% cohort academic percentile. Cleared pre-placement qualification with zero active backlogs. Completed Capstone project in high-throughput distributed microservices.
          </p>
        </div>
      </div>
    `;

    resumeModalOverlay.classList.add('open');
  }

  // --- COMMAND PALETTE (CMD+K / CTRL+K) ---
  bindCommandPalette() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openCommandPalette();
      }
      if (e.key === 'Escape') {
        const cmdOverlay = document.getElementById('commandPaletteOverlay');
        cmdOverlay?.classList.remove('open');
      }
    });

    const closeBtn = document.getElementById('closeCommandPaletteBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('commandPaletteOverlay')?.classList.remove('open');
      });
    }

    const input = document.getElementById('commandPaletteInput');
    if (input) {
      input.addEventListener('input', (e) => {
        this.renderCommandPaletteResults(e.target.value);
      });
    }
  }

  openCommandPalette() {
    const overlay = document.getElementById('commandPaletteOverlay');
    const input = document.getElementById('commandPaletteInput');
    if (!overlay || !input) return;

    overlay.classList.add('open');
    input.value = '';
    input.focus();
    this.renderCommandPaletteResults('');
  }

  renderCommandPaletteResults(query) {
    const list = document.getElementById('commandPaletteResultsList');
    if (!list) return;

    const lower = query.toLowerCase();

    const matchedJobs = this.jobs.filter((j) =>
      j.companyName.toLowerCase().includes(lower) || j.role.toLowerCase().includes(lower)
    );
    const matchedCands = this.candidates.filter((c) =>
      c.name.toLowerCase().includes(lower) || c.rollNo.toLowerCase().includes(lower)
    );

    list.innerHTML = `
      <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px;">
        Recruitment Drives (${matchedJobs.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
        ${matchedJobs.slice(0, 4).map((j) => `
          <div class="cmd-item" data-action="job" data-id="${j.id}" style="padding: 10px 14px; background: rgba(17, 37, 30, 0.6); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-weight: 700; color: #FFFFFF; font-size: 0.85rem;">${j.companyName} — ${j.role}</div>
              <div style="font-size: 0.72rem; color: var(--text-secondary);">${j.location} • ${j.category}</div>
            </div>
            <span class="ctc-badge">${j.ctc}</span>
          </div>
        `).join('')}
      </div>

      <div style="font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 8px;">
        Candidate Roster (${matchedCands.length})
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        ${matchedCands.slice(0, 4).map((c) => `
          <div class="cmd-item" data-action="candidate" data-id="${c.id}" style="padding: 10px 14px; background: rgba(17, 37, 30, 0.6); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
            <div>
              <div style="font-weight: 700; color: #FFFFFF; font-size: 0.85rem;">${c.name} (${c.rollNo})</div>
              <div style="font-size: 0.72rem; color: var(--text-secondary);">${c.branch} • CGPA ${c.cgpa.toFixed(2)}</div>
            </div>
            <span class="tag-pill">${c.driveStage}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Item click
    const items = list.querySelectorAll('.cmd-item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        const id = item.getAttribute('data-id');
        document.getElementById('commandPaletteOverlay')?.classList.remove('open');

        if (action === 'job') {
          this.switchPortal('student');
          this.showToast(`Focused on recruitment drive.`);
        } else if (action === 'candidate') {
          const cand = this.candidates.find((c) => c.id === id);
          if (cand) this.openResumeModal(cand);
        }
      });
    });
  }

  // --- NOTIFICATION TOAST ---
  showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastText = document.getElementById('toastNotificationText');
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add('show');

    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

// Instantiate and start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new PlacementCommandApp();
  app.init();
});
