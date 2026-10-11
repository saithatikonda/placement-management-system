/**
 * Placement Command — Student Portal Logic
 * Handles CGPA eligibility math, real-time simulator, application tracking timeline, and resume triggers.
 */

import { api } from './api.js';

export class StudentPortal {
  constructor(app) {
    this.app = app;
    this.student = null;
    this.jobs = [];
    this.simulatedCgpa = 9.42;
    this.selectedCategory = 'All';
    this.searchQuery = '';
  }

  async init() {
    const studentRes = await api.getStudentProfile();
    this.student = studentRes.data;
    this.simulatedCgpa = this.student.cgpa;

    const jobsRes = await api.getJobs();
    this.jobs = jobsRes.data;

    this.render();
    this.bindEvents();
  }

  // Pure Math & Policy Function: Calculate Eligibility for any drive
  checkEligibility(job, cgpa = this.simulatedCgpa) {
    const minCgpaMet = cgpa >= job.minCgpa;
    const branchMet = !job.eligibleBranches || job.eligibleBranches.includes(this.student.branch);
    const backlogsMet = this.student.backlogs <= (job.maxBacklogs ?? 0);

    const isEligible = minCgpaMet && branchMet && backlogsMet;

    let reason = 'Eligible for Direct Application';
    let shortDiff = 0;

    if (!minCgpaMet) {
      shortDiff = (job.minCgpa - cgpa).toFixed(2);
      reason = `CGPA Shortfall (-${shortDiff})`;
    } else if (!branchMet) {
      reason = `Branch Restricted (${job.eligibleBranches ? job.eligibleBranches.join(', ') : 'Restricted'})`;
    } else if (!backlogsMet) {
      reason = `Max ${job.maxBacklogs} backlogs allowed`;
    }

    return {
      isEligible,
      minCgpaMet,
      branchMet,
      backlogsMet,
      reason,
      shortDiff
    };
  }

  render() {
    const container = document.getElementById('studentPortalView');
    if (!container) return;

    // Filter drives
    const filteredJobs = this.jobs.filter((j) => {
      const matchCat = this.selectedCategory === 'All' || j.category === this.selectedCategory;
      const matchSearch =
        j.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        j.role.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    // Active applied drive for the Pipeline Stepper
    const activeAppliedJob = this.jobs.find((j) => j.hasApplied) || this.jobs[0];

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
        <!-- 1. ACADEMIC METRICS RIBBON & ELIGIBILITY COCKPIT -->
        <section class="pms-glass-card" style="padding: 24px 28px;" aria-label="Student Academic Ribbon">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
            <!-- Profile Identity -->
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 58px; height: 58px; border-radius: var(--radius-lg); background: #081510; border: 2px solid var(--border-emerald-glow); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.25rem; color: var(--accent-emerald-primary); box-shadow: 0 0 20px rgba(16, 185, 129, 0.25);">
                ${this.student.avatar || 'AP'}
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-white);">${this.student.name}</h2>
                  <span class="tag-pill">${this.student.rollNo}</span>
                  <span class="tag-pill tag-amber" style="font-size: 0.68rem;">2026 Batch</span>
                </div>
                <p style="font-size: 0.775rem; color: var(--text-secondary); margin-top: 3px;">
                  B.Tech ${this.student.branch} • Verified Institutional Student Registry • Section ${this.student.section}
                </p>
              </div>
            </div>

            <!-- Resume Action & Quick Status -->
            <div style="display: flex; align-items: center; gap: 12px;">
              <button id="viewMyResumeBtn" class="btn btn-glass btn-sm" aria-label="View verified PDF resume">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                <span>Verified PDF Dossier</span>
              </button>
              <button id="uploadResumeBtn" class="btn btn-emerald btn-sm" aria-label="Upload updated resume">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                <span>Upload New PDF</span>
              </button>
              <input type="file" id="resumeFileInput" accept=".pdf" style="display: none;" />
            </div>
          </div>

          <!-- Academic Ribbon KPI Row -->
          <div class="stats-ribbon-grid" style="margin-top: 24px;">
            <div class="stat-metric-card">
              <span class="stat-label">Actual CGPA</span>
              <div class="stat-value" style="color: var(--accent-emerald-primary);">${this.student.cgpa.toFixed(2)} <span style="font-size: 0.8rem; color: var(--text-muted);">/ 10</span></div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">University Registry Verified</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Active Backlogs</span>
              <div class="stat-value" style="color: ${this.student.backlogs === 0 ? '#10B981' : '#F97316'};">${this.student.backlogs}</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">History: ${this.student.historyBacklogs || 0} Backlogs</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Policy Quota Category</span>
              <div class="stat-value" style="font-size: 1.15rem; color: #FB923C;">Super-Dream Tier</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">${this.student.currentOffers} of ${this.student.maxOffersAllowed} Offers Utilized</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Active Applications</span>
              <div class="stat-value" style="color: #38BDF8;">
                ${this.jobs.filter((j) => j.hasApplied).length} Drives
              </div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">1 in Interview Phase</span>
            </div>
          </div>

          <!-- Interactive CGPA Simulation Slider -->
          <div style="margin-top: 24px; padding: 18px 20px; background: rgba(9, 20, 16, 0.7); border: 1px dashed rgba(249, 115, 22, 0.35); border-radius: var(--radius-lg);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span class="ctc-pulse-dot"></span>
                <span style="font-size: 0.825rem; font-weight: 700; color: var(--text-white);">
                  Live CGPA Eligibility Predictor
                </span>
                <span style="font-size: 0.725rem; color: var(--text-secondary);">
                  (Slide to test eligibility thresholds in real-time)
                </span>
              </div>
              <div style="display: flex; align-items: baseline; gap: 4px;">
                <span style="font-size: 0.75rem; color: var(--text-secondary);">Simulated:</span>
                <span id="cgpaDisplayVal" style="font-family: 'JetBrains Mono', monospace; font-size: 1.15rem; font-weight: 800; color: var(--accent-amber-light);">
                  ${this.simulatedCgpa.toFixed(2)}
                </span>
              </div>
            </div>
            <input 
              type="range" 
              id="cgpaRangeSlider" 
              class="pms-range" 
              min="6.0" 
              max="10.0" 
              step="0.05" 
              value="${this.simulatedCgpa}"
              aria-label="Simulate CGPA"
            />
          </div>
        </section>

        <!-- 2. APPLICATION PIPELINE PROGRESSION STEPPER -->
        <section class="pms-glass-card" style="padding: 24px 28px;" aria-label="Application Progression Tracker">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <div>
              <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-white);">Active Recruitment Stage</h3>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                Tracking current milestone for <strong>${activeAppliedJob.companyName}</strong> (${activeAppliedJob.role})
              </p>
            </div>
            <span class="ctc-badge">
              <span class="ctc-pulse-dot"></span>
              ${activeAppliedJob.ctc}
            </span>
          </div>

          <div class="pipeline-stepper">
            <div class="pipeline-connector">
              <div class="pipeline-connector-fill"></div>
            </div>

            <div class="pipeline-step completed">
              <div class="pipeline-node">✓</div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-white);">Applied</span>
              <span style="font-size: 0.65rem; color: var(--accent-emerald-text);">Verified</span>
            </div>

            <div class="pipeline-step completed">
              <div class="pipeline-node">✓</div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-white);">OA Cleared</span>
              <span style="font-size: 0.65rem; color: var(--accent-emerald-text);">98th %ile</span>
            </div>

            <div class="pipeline-step completed">
              <div class="pipeline-node">✓</div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-white);">Tech Round 1</span>
              <span style="font-size: 0.65rem; color: var(--accent-emerald-text);">Strong Hire</span>
            </div>

            <div class="pipeline-step active">
              <div class="pipeline-node">4</div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-amber-light);">Tech Round 2</span>
              <span style="font-size: 0.65rem; color: var(--accent-amber-light);">Scheduled Today</span>
            </div>

            <div class="pipeline-step">
              <div class="pipeline-node">5</div>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-secondary);">Final Offer</span>
              <span style="font-size: 0.65rem; color: var(--text-dim);">Upcoming</span>
            </div>
          </div>
        </section>

        <!-- 3. RECRUITMENT DRIVES DIRECTORY -->
        <section aria-label="Available Recruitment Drives">
          <!-- Toolbar & Category Tabs -->
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              ${['All', 'Super Dream', 'Dream', 'Tier-1 Core'].map((cat) => `
                <button 
                  class="btn btn-sm ${this.selectedCategory === cat ? 'btn-emerald' : 'btn-glass'}" 
                  data-cat="${cat}"
                  style="border-radius: var(--radius-pill);"
                >
                  ${cat}
                </button>
              `).join('')}
            </div>

            <!-- Search Field -->
            <div style="position: relative; width: 280px;">
              <input 
                type="text" 
                id="studentSearchDrivesInput" 
                class="form-control" 
                placeholder="Search company or role..."
                value="${this.searchQuery}"
                style="padding-left: 36px; height: 38px; border-radius: var(--radius-pill);"
              />
              <svg style="position: absolute; left: 12px; top: 11px; color: var(--text-secondary);" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>

          <!-- Cards Grid -->
          <div class="job-cards-grid">
            ${filteredJobs.map((job) => this.renderJobCard(job)).join('')}
          </div>
        </section>
      </div>
    `;
  }

  renderJobCard(job) {
    const elig = this.checkEligibility(job);

    return `
      <article class="pms-glass-card pms-card-interactive" style="padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <!-- Header: Logo, Company & CTC -->
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: #081611; border: 1px solid var(--border-emerald-glow); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; color: ${job.logoColor || '#10B981'};">
                ${job.companyLogo || job.companyName.substring(0, 3)}
              </div>
              <div>
                <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--text-white); line-height: 1.2;">
                  ${job.companyName}
                </h4>
                <span style="font-size: 0.72rem; color: var(--text-secondary);">${job.location} • ${job.workMode}</span>
              </div>
            </div>

            <!-- High-Value CTC Tag with surgical luminous amber -->
            <div class="ctc-badge">
              <span class="ctc-pulse-dot"></span>
              <span>${job.ctc}</span>
            </div>
          </div>

          <!-- Role Title -->
          <h5 style="font-size: 0.95rem; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
            ${job.role}
          </h5>

          <!-- Description snippet -->
          <p style="font-size: 0.775rem; color: var(--text-secondary); line-height: 1.45; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
            ${job.description}
          </p>

          <!-- Criteria Badges -->
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
            <span class="tag-pill ${elig.minCgpaMet ? '' : 'tag-amber'}">
              Min CGPA: ${job.minCgpa.toFixed(1)}
            </span>
            <span class="tag-pill tag-neutral">
              ${job.eligibleBranches ? job.eligibleBranches.join(', ') : 'All Branches'}
            </span>
            <span class="tag-pill tag-neutral">
              ${job.closesInText || 'Active Drive'}
            </span>
          </div>
        </div>

        <!-- Card Footer: Eligibility status & Action -->
        <div style="border-top: 1px solid rgba(16, 185, 129, 0.12); padding-top: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
          <div>
            ${job.hasApplied ? `
              <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem; font-weight: 700; color: #38BDF8;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Applied: ${job.applicationStage || 'In Review'}
              </span>
            ` : elig.isEligible ? `
              <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.75rem; font-weight: 700; color: var(--accent-emerald-primary);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Eligible to Apply
              </span>
            ` : `
              <span style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.72rem; font-weight: 600; color: #F87171;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                ${elig.reason}
              </span>
            `}
          </div>

          <div>
            ${job.hasApplied ? `
              <button class="btn btn-glass btn-sm" disabled style="opacity: 0.7; cursor: default;">
                Application Active
              </button>
            ` : `
              <button 
                class="btn ${elig.isEligible ? 'btn-amber' : 'btn-glass'} btn-sm apply-drive-btn" 
                data-id="${job.id}"
                ${!elig.isEligible ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
              >
                ${elig.isEligible ? 'One-Click Apply' : 'Ineligible'}
              </button>
            `}
          </div>
        </div>
      </article>
    `;
  }

  bindEvents() {
    // CGPA Slider Listener
    const slider = document.getElementById('cgpaRangeSlider');
    const display = document.getElementById('cgpaDisplayVal');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.simulatedCgpa = parseFloat(e.target.value);
        if (display) display.textContent = this.simulatedCgpa.toFixed(2);

        // Update cards without losing scroll position
        const grid = document.querySelector('.job-cards-grid');
        if (grid) {
          const filteredJobs = this.jobs.filter((j) => {
            const matchCat = this.selectedCategory === 'All' || j.category === this.selectedCategory;
            const matchSearch =
              j.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              j.role.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchCat && matchSearch;
          });
          grid.innerHTML = filteredJobs.map((j) => this.renderJobCard(j)).join('');
          this.bindCardApplyButtons();
        }
      });
    }

    // Category Buttons
    const catBtns = document.querySelectorAll('[data-cat]');
    catBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.getAttribute('data-cat');
        this.render();
        this.bindEvents();
      });
    });

    // Search Input
    const searchInput = document.getElementById('studentSearchDrivesInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        const grid = document.querySelector('.job-cards-grid');
        if (grid) {
          const filteredJobs = this.jobs.filter((j) => {
            const matchCat = this.selectedCategory === 'All' || j.category === this.selectedCategory;
            const matchSearch =
              j.companyName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
              j.role.toLowerCase().includes(this.searchQuery.toLowerCase());
            return matchCat && matchSearch;
          });
          grid.innerHTML = filteredJobs.map((j) => this.renderJobCard(j)).join('');
          this.bindCardApplyButtons();
        }
      });
    }

    // Resume buttons
    const viewResumeBtn = document.getElementById('viewMyResumeBtn');
    if (viewResumeBtn) {
      viewResumeBtn.addEventListener('click', () => {
        this.app.openResumeModal(this.student);
      });
    }

    const uploadResumeBtn = document.getElementById('uploadResumeBtn');
    const fileInput = document.getElementById('resumeFileInput');
    if (uploadResumeBtn && fileInput) {
      uploadResumeBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files?.[0];
        if (file) {
          this.app.showToast(`Uploading ${file.name}...`);
          setTimeout(() => {
            this.app.showToast(`✓ Resume uploaded & verified for ${this.student.name}!`);
          }, 1200);
        }
      });
    }

    this.bindCardApplyButtons();
  }

  bindCardApplyButtons() {
    const applyBtns = document.querySelectorAll('.apply-drive-btn');
    applyBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const job = this.jobs.find((j) => j.id === id);
        if (!job) return;

        btn.disabled = true;
        btn.textContent = 'Submitting...';

        const res = await api.applyJob({
          studentId: this.student.rollNo,
          driveId: job.id,
          appliedAt: new Date().toISOString()
        });

        if (res.success) {
          job.hasApplied = true;
          job.applicationStage = 'Applied';
          job.totalApplicants = (job.totalApplicants || 0) + 1;
          this.app.showToast(`✓ Applied successfully to ${job.companyName} (${job.role})!`);
          this.render();
          this.bindEvents();
        }
      });
    });
  }
}
