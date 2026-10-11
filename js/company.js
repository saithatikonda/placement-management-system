/**
 * Placement Command — Company / Recruiter Portal Logic
 * Handles recruitment drive creation modal, applicant stage transitions, shortlisting, and candidate actions.
 */

import { api } from './api.js';

export class CompanyPortal {
  constructor(app) {
    this.app = app;
    this.candidates = [];
    this.jobs = [];
    this.searchQuery = '';
    this.selectedStage = 'All';
    this.activeJobId = 'drive-msft-01';
  }

  async init() {
    const candRes = await api.getCandidates();
    this.candidates = candRes.data;

    const jobsRes = await api.getJobs();
    this.jobs = jobsRes.data;

    this.render();
    this.bindEvents();
  }

  render() {
    const container = document.getElementById('companyPortalView');
    if (!container) return;

    const activeJob = this.jobs.find((j) => j.id === this.activeJobId) || this.jobs[0] || {
      companyName: 'Microsoft IDC',
      role: 'SDE I',
      ctc: '44.0 LPA',
      totalApplicants: 380,
    };

    // Filter candidates
    const filteredCandidates = this.candidates.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.rollNo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(this.searchQuery.toLowerCase());

      let matchStage = true;
      if (this.selectedStage === 'OA Cleared') matchStage = c.driveStage === 'OA Cleared';
      else if (this.selectedStage === 'Tech') matchStage = c.driveStage.includes('Tech');
      else if (this.selectedStage === 'HR') matchStage = c.driveStage.includes('HR');
      else if (this.selectedStage === 'Offered') matchStage = c.driveStage === 'Offered';

      return matchSearch && matchStage;
    });

    const offeredCount = this.candidates.filter((c) => c.driveStage === 'Offered').length;
    const interviewCount = this.candidates.filter((c) => c.driveStage.includes('Tech') || c.driveStage.includes('HR')).length;
    const oaClearedCount = this.candidates.filter((c) => c.driveStage === 'OA Cleared').length;

    container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px;">
        <!-- RECRUITER HEADER & ACTIONS -->
        <section class="pms-glass-card" style="padding: 24px 28px;" aria-label="Recruiter Cockpit Header">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 54px; height: 54px; border-radius: var(--radius-lg); background: #081611; border: 2px solid var(--border-amber-bright); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.15rem; color: var(--accent-amber-light); box-shadow: 0 0 20px rgba(249, 115, 22, 0.25);">
                🏢
              </div>
              <div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-white);">
                    ${activeJob.companyName}
                  </h2>
                  <span class="tag-pill tag-amber">Recruiter Console</span>
                </div>
                <p style="font-size: 0.775rem; color: var(--text-secondary); margin-top: 2px;">
                  Managing Active Drive: <strong>${activeJob.role}</strong> (${activeJob.ctc})
                </p>
              </div>
            </div>

            <!-- Create New Drive Action Button -->
            <button id="openPostDriveModalBtn" class="btn btn-amber">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
              <span>+ Post New Recruitment Drive</span>
            </button>
          </div>

          <!-- Quick Metrics Banner -->
          <div class="stats-ribbon-grid" style="margin-top: 24px;">
            <div class="stat-metric-card">
              <span class="stat-label">Total Applicants</span>
              <div class="stat-value" style="color: var(--text-white);">${activeJob.totalApplicants || this.candidates.length * 38}</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">Direct Campus Dossiers</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">OA Shortlisted</span>
              <div class="stat-value" style="color: var(--accent-emerald-primary);">${oaClearedCount}</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">Eligible for Tech Rounds</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Active Interviews</span>
              <div class="stat-value" style="color: #38BDF8;">${interviewCount}</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">Tech 1 & Tech 2 in Progress</span>
            </div>

            <div class="stat-metric-card">
              <span class="stat-label">Offers Rolled</span>
              <div class="stat-value" style="color: #FB923C;">${offeredCount}</div>
              <span style="font-size: 0.7rem; color: var(--text-secondary);">Verified Candidates</span>
            </div>
          </div>
        </section>

        <!-- APPLICANTS MANAGEMENT ROSTER -->
        <section class="pms-glass-card" style="padding: 24px 28px;" aria-label="Applicant Roster">
          <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px;">
            <div>
              <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-white);">Candidate Evaluation Board</h3>
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                Review academic credentials, view verified resumes, and advance candidates through interview loops.
              </p>
            </div>

            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 10px;">
              <!-- Stage Filter -->
              <div style="display: flex; align-items: center; gap: 6px;">
                ${['All', 'OA Cleared', 'Tech', 'HR', 'Offered'].map((st) => `
                  <button 
                    class="btn btn-sm ${this.selectedStage === st ? 'btn-amber' : 'btn-glass'}" 
                    data-stage="${st}"
                    style="border-radius: var(--radius-pill);"
                  >
                    ${st}
                  </button>
                `).join('')}
              </div>

              <!-- Search -->
              <div style="position: relative; width: 240px;">
                <input 
                  type="text" 
                  id="recruiterSearchInput" 
                  class="form-control" 
                  placeholder="Search candidate..." 
                  value="${this.searchQuery}"
                  style="padding-left: 36px; height: 36px; border-radius: var(--radius-pill);"
                />
                <svg style="position: absolute; left: 12px; top: 10px; color: var(--text-secondary);" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
            </div>
          </div>

          <!-- Table -->
          <div class="pms-table-container">
            <table class="pms-table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Roll No</th>
                  <th>Branch</th>
                  <th>CGPA</th>
                  <th>Stage</th>
                  <th>Dossier</th>
                  <th style="text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${filteredCandidates.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-secondary);">
                      No candidates matched current filters.
                    </td>
                  </tr>
                ` : filteredCandidates.map((cand) => `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; border-radius: 50%; background: #0B1914; border: 1px solid var(--border-emerald-glow); display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: var(--accent-emerald-primary);">
                          ${cand.initials || cand.name.substring(0, 2)}
                        </div>
                        <div>
                          <div style="font-weight: 700; color: var(--text-white); font-size: 0.85rem;">${cand.name}</div>
                          <div style="font-size: 0.7rem; color: var(--text-secondary);">${cand.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.8rem;">${cand.rollNo}</td>
                    <td><span class="tag-pill tag-neutral">${cand.branch} - Sec ${cand.section || 'A'}</span></td>
                    <td>
                      <span style="font-family: 'JetBrains Mono', monospace; font-weight: 700; color: var(--accent-emerald-primary); font-size: 0.85rem;">
                        ${cand.cgpa.toFixed(2)}
                      </span>
                    </td>
                    <td>
                      <span class="tag-pill ${cand.driveStage === 'Offered' ? 'tag-amber' : ''}">
                        ${cand.driveStage}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-glass btn-sm view-cand-resume-btn" data-id="${cand.id}">
                        📄 View PDF
                      </button>
                    </td>
                    <td style="text-align: right;">
                      <div style="display: inline-flex; align-items: center; gap: 6px;">
                        ${cand.driveStage !== 'Offered' ? `
                          <button class="btn btn-emerald btn-sm advance-stage-btn" data-id="${cand.id}" data-name="${cand.name}">
                            Advance Round →
                          </button>
                          <button class="btn btn-amber btn-sm roll-offer-btn" data-id="${cand.id}" data-name="${cand.name}">
                            Roll Offer 🎉
                          </button>
                        ` : `
                          <span style="font-size: 0.75rem; font-weight: 700; color: var(--accent-amber-light); padding: 4px 10px; background: rgba(249, 115, 22, 0.12); border-radius: var(--radius-pill); border: 1px solid rgba(249, 115, 22, 0.3);">
                            ✓ Offer Extended
                          </span>
                        `}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
  }

  bindEvents() {
    // Open Post Drive Modal
    const postDriveBtn = document.getElementById('openPostDriveModalBtn');
    if (postDriveBtn) {
      postDriveBtn.addEventListener('click', () => {
        this.openPostDriveModal();
      });
    }

    // Stage Filter Buttons
    const stageBtns = document.querySelectorAll('[data-stage]');
    stageBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedStage = btn.getAttribute('data-stage');
        this.render();
        this.bindEvents();
      });
    });

    // Search
    const searchInput = document.getElementById('recruiterSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render();
        this.bindEvents();
      });
    }

    // View Resume
    const resumeBtns = document.querySelectorAll('.view-cand-resume-btn');
    resumeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const cand = this.candidates.find((c) => c.id === id);
        if (cand) this.app.openResumeModal(cand);
      });
    });

    // Advance Stage
    const advanceBtns = document.querySelectorAll('.advance-stage-btn');
    advanceBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const cand = this.candidates.find((c) => c.id === id);
        if (!cand) return;

        const stageFlow = {
          'Online Assessment': 'OA Cleared',
          'OA Cleared': 'Tech Round 1',
          'Tech Round 1': 'Tech Round 2',
          'Tech Round 2': 'HR Interview',
          'HR Interview': 'Offered',
          'Offered': 'Offered',
        };
        const nextStage = stageFlow[cand.driveStage] || 'Tech Round 1';

        await api.updateCandidateStage(id, nextStage);
        cand.driveStage = nextStage;

        this.app.showToast(`✓ Candidate ${name} advanced to ${nextStage}!`);
        this.render();
        this.bindEvents();
      });
    });

    // Roll Offer
    const offerBtns = document.querySelectorAll('.roll-offer-btn');
    offerBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const cand = this.candidates.find((c) => c.id === id);
        if (!cand) return;

        await api.updateCandidateStage(id, 'Offered');
        cand.driveStage = 'Offered';

        this.app.showToast(`🎉 Formal Job Offer rolled out to ${name}!`);
        this.render();
        this.bindEvents();
      });
    });
  }

  openPostDriveModal() {
    const modalOverlay = document.getElementById('postJobModalOverlay');
    if (modalOverlay) {
      modalOverlay.classList.add('open');
    }
  }
}
