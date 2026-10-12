/**
 * Placement Command - Centralized API Layer
 * Target: Spring Boot Backend (http://localhost:8080/api)
 * Architecture: Async/await fetch wrapper with automatic fallback to persistent mock data
 */

const API_BASE_URL = 'http://localhost:8080/api';
const LOCAL_STORAGE_KEY_PREFIX = 'pms_data_';

// Initial Seed Data for Instant Mock Execution & Offline Fallback
const DEFAULT_STUDENT_PROFILE = {
  id: '',
  name: '',
  rollNo: '',
  email: '',
  avatar: '',
  cgpa: 0,
  branch: '',
  section: '',
  backlogs: 0,
  historyBacklogs: 0,
  gender: 'Other',
  dreamStatus: 'Open Tier',
  currentOffers: 0,
  maxOffersAllowed: 2,
  resumeStatus: 'Pending Verification',
  resumeUrl: '#',
  skills: [],
};

const DEFAULT_KPIS = {
  totalEligible: 0,
  yoyGrowth: '0%',
  cohortReadinessPercent: 0,
  enrolledStudents: 0,
  placedStudents: 0,
  placementRate: 0,
  uniquePlaced: 0,
  dreamTarget: 0,
  companiesVisited: 0,
  onSiteToday: 0,
  tier1Day1s: 0,
  inProgressDrives: 0,
  highestCtc: 0,
  averageCtc: 0,
  medianCtc: 0,
  top10Ctc: 0,
  superDreamCount: 0,
};

const DEFAULT_JOBS = [];

const DEFAULT_CANDIDATES = [];

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
    this.isBackendLive = false;
    this._initLocalStorage();
  }

  _initLocalStorage() {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'jobs')) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'jobs', JSON.stringify(DEFAULT_JOBS));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'student')) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'student', JSON.stringify(DEFAULT_STUDENT_PROFILE));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'candidates')) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'candidates', JSON.stringify(DEFAULT_CANDIDATES));
    }
    if (!localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + 'kpis')) {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + 'kpis', JSON.stringify(DEFAULT_KPIS));
    }
  }

  _getMock(key) {
    try {
      const item = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  _setMock(key, data) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  /**
   * Health Check: Quickly tests if Spring Boot server at :8080 is reachable.
   */
  async checkBackendHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${this.baseUrl}/health`, { credentials: 'omit', signal: controller.signal });
      clearTimeout(timeoutId);
      this.isBackendLive = res.ok;
      return this.isBackendLive;
    } catch {
      this.isBackendLive = false;
      return false;
    }
  }

  /**
   * GET /api/jobs
   * Fetches all recruitment drives.
   */
  async getJobs() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${this.baseUrl}/jobs`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        this.isBackendLive = true;
        const data = await res.json();
        return { data, isLive: true };
      }
    } catch (err) {
      // Backend offline: gracefully fall back to local store
    }
    this.isBackendLive = false;
    const fallback = this._getMock('jobs') || DEFAULT_JOBS;
    return { data: fallback, isLive: false };
  }

  /**
   * POST /api/jobs
   * Recruiter posts a new recruitment drive.
   */
  async createJob(newDrive) {
    try {
      const res = await fetch(`${this.baseUrl}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDrive),
      });
      if (res.ok) {
        const created = await res.json();
        return { data: created, isLive: true };
      }
    } catch (err) {
      // Fallback
    }

    // Local Mock update
    const jobs = this._getMock('jobs') || DEFAULT_JOBS;
    const driveWithId = {
      ...newDrive,
      id: newDrive.id || `drive-${Date.now()}`,
      totalApplicants: 0,
      hasApplied: false,
      applicationStage: null,
      status: 'Active',
      deadlineHoursRemaining: 72,
      closesInText: 'Closes in 3 days',
      driveDate: newDrive.driveDate || 'Upcoming',
    };
    jobs.unshift(driveWithId);
    this._setMock('jobs', jobs);

    // Increment KPIs
    const kpis = this._getMock('kpis') || DEFAULT_KPIS;
    kpis.companiesVisited += 1;
    kpis.inProgressDrives += 1;
    this._setMock('kpis', kpis);

    return { data: driveWithId, isLive: false };
  }

  /**
   * POST /api/applications/apply
   * Student applies to a recruitment drive.
   */
  async applyJob(applicationPayload) {
    try {
      const res = await fetch(`${this.baseUrl}/applications/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationPayload),
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, data, isLive: true };
      }
    } catch (err) {
      // Fallback
    }

    // Local Mock update
    const jobs = this._getMock('jobs') || DEFAULT_JOBS;
    const updatedJobs = jobs.map((d) => {
      if (d.id === applicationPayload.driveId) {
        return {
          ...d,
          hasApplied: true,
          applicationStage: 'Applied',
          totalApplicants: (d.totalApplicants || 0) + 1,
          appliedAt: new Date().toISOString().split('T')[0],
        };
      }
      return d;
    });
    this._setMock('jobs', updatedJobs);

    return {
      success: true,
      data: {
        applicationId: `APP-${Date.now()}`,
        status: 'Applied',
        message: 'Application recorded successfully in Placement Registry',
      },
      isLive: false,
    };
  }

  /**
   * GET /api/students/profile
   * Fetch verified student academic profile and dream status.
   */
  async getStudentProfile() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${this.baseUrl}/students/profile`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return { data, isLive: true };
      }
    } catch (err) {
      // Fallback
    }
    const data = this._getMock('student') || DEFAULT_STUDENT_PROFILE;
    return { data, isLive: false };
  }

  /**
   * PUT /api/students/profile
   * Update student CGPA or simulation details
   */
  async updateStudentProfile(updatedProfile) {
    this._setMock('student', updatedProfile);
    return { data: updatedProfile, isLive: false };
  }

  /**
   * GET /api/candidates
   */
  async getCandidates() {
    try {
      const res = await fetch(`${this.baseUrl}/candidates`);
      if (res.ok) {
        const data = await res.json();
        return { data, isLive: true };
      }
    } catch {
      // Fallback
    }
    return { data: this._getMock('candidates') || DEFAULT_CANDIDATES, isLive: false };
  }

  /**
   * PUT /api/candidates/:id/stage
   */
  async updateCandidateStage(candidateId, newStage) {
    try {
      const res = await fetch(`${this.baseUrl}/candidates/${candidateId}/stage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        return { success: true, isLive: true };
      }
    } catch {
      // Fallback
    }

    const cands = this._getMock('candidates') || DEFAULT_CANDIDATES;
    const updated = cands.map((c) => (c.id === candidateId ? { ...c, driveStage: newStage } : c));
    this._setMock('candidates', updated);
    return { success: true, isLive: false };
  }

  /**
   * GET /api/kpi
   */
  async getKpis() {
    try {
      const res = await fetch(`${this.baseUrl}/kpi`);
      if (res.ok) {
        const data = await res.json();
        return { data, isLive: true };
      }
    } catch {
      // Fallback
    }
    return { data: this._getMock('kpis') || DEFAULT_KPIS, isLive: false };
  }

  /**
   * Reset local storage back to defaults
   */
  resetToDefaults() {
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'jobs');
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'student');
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'candidates');
    localStorage.removeItem(LOCAL_STORAGE_KEY_PREFIX + 'kpis');
    this._initLocalStorage();
  }
}

export const api = new ApiClient();
