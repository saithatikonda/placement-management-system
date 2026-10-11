/**
 * Placement Command - Centralized API Layer
 * Target: Spring Boot Backend (http://localhost:8080/api)
 * Architecture: Async/await fetch wrapper with automatic fallback to persistent mock data
 */

const API_BASE_URL = 'http://localhost:8080/api';
const LOCAL_STORAGE_KEY_PREFIX = 'pms_data_';

// Initial Seed Data for Instant Mock Execution & Offline Fallback
const DEFAULT_STUDENT_PROFILE = {
  id: 'STU-22CS104',
  name: 'Aarav Patel',
  rollNo: '22CS104',
  email: 'aarav.p@univ.edu.in',
  avatar: 'AP',
  cgpa: 9.42,
  branch: 'CSE',
  section: 'A',
  backlogs: 0,
  historyBacklogs: 0,
  gender: 'Male',
  dreamStatus: 'Eligible for Super-Dream',
  currentOffers: 1,
  maxOffersAllowed: 2,
  resumeStatus: 'Verified PDF',
  resumeUrl: '#',
  skills: ['Distributed Systems', 'C++', 'Java Spring Boot', 'Kafka', 'System Design', 'PostgreSQL'],
};

const DEFAULT_KPIS = {
  totalEligible: 850,
  yoyGrowth: '+4.2% YoY',
  cohortReadinessPercent: 83.0,
  enrolledStudents: 1024,
  placedStudents: 612,
  placementRate: 72.0,
  uniquePlaced: 489,
  dreamTarget: 85,
  companiesVisited: 48,
  onSiteToday: 3,
  tier1Day1s: 14,
  inProgressDrives: 6,
  highestCtc: 44.0,
  averageCtc: 9.2,
  medianCtc: 8.4,
  top10Ctc: 24.5,
  superDreamCount: 42,
};

const DEFAULT_JOBS = [
  {
    id: 'drive-msft-01',
    companyName: 'Microsoft IDC',
    companyLogo: 'MSFT',
    logoColor: '#00A4EF',
    role: 'Software Development Engineer I (SDE I)',
    ctc: '44.0 LPA',
    ctcNumeric: 44.0,
    category: 'Super Dream',
    location: 'Hyderabad / Bengaluru',
    workMode: 'Hybrid',
    minCgpa: 7.5,
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    maxBacklogs: 0,
    deadlineHoursRemaining: 18,
    closesInText: 'Closes in 18 hrs',
    isUrgent: true,
    totalApplicants: 380,
    driveDate: 'Oct 14, 2026',
    status: 'Interviews',
    tags: ['Full Time', 'Day-1 Tier 1', 'Product Engineering'],
    description: 'Core Cloud + AI platform engineering team. Developing highly reliable distributed microservices in Azure and Core Windows.',
    rounds: ['Online Assessment', 'Tech Round 1 (DS/Algo)', 'Tech Round 2 (System Design)', 'AA / HR Interview'],
    hasApplied: true,
    applicationStage: 'Tech Round 2',
    appliedAt: '2026-10-09'
  },
  {
    id: 'drive-goog-02',
    companyName: 'Google India',
    companyLogo: 'GOOG',
    logoColor: '#EA4335',
    role: 'Associate Software Engineer - Core Systems',
    ctc: '42.5 LPA',
    ctcNumeric: 42.5,
    category: 'Super Dream',
    location: 'Bengaluru / Hyderabad',
    workMode: 'On-Campus',
    minCgpa: 8.0,
    eligibleBranches: ['CSE', 'IT'],
    maxBacklogs: 0,
    deadlineHoursRemaining: 24,
    closesInText: 'Closes in 24 hrs',
    isUrgent: true,
    totalApplicants: 420,
    driveDate: 'Oct 18, 2026',
    status: 'OA Phase',
    tags: ['Super Dream', 'C++ / Go', 'Distributed Computing'],
    description: 'Large-scale distributed infrastructure engineering, high-throughput storage, search backend, and developer tooling.',
    rounds: ['Coding Challenge (2 Qs)', 'Tech Round 1', 'Tech Round 2', 'Googliness & Leadership'],
    hasApplied: true,
    applicationStage: 'OA Cleared',
    appliedAt: '2026-10-08'
  },
  {
    id: 'drive-amzn-03',
    companyName: 'Amazon AWS',
    companyLogo: 'AWS',
    logoColor: '#FF9900',
    role: 'Cloud Support & Backend Engineer',
    ctc: '32.0 LPA',
    ctcNumeric: 32.0,
    category: 'Super Dream',
    location: 'Hyderabad / Chennai',
    workMode: 'On-Campus',
    minCgpa: 7.0,
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'],
    maxBacklogs: 0,
    deadlineHoursRemaining: 36,
    closesInText: 'Closes in 36 hrs',
    isUrgent: false,
    totalApplicants: 310,
    driveDate: 'Oct 20, 2026',
    status: 'Active',
    tags: ['AWS Services', 'Leadership Principles', 'Full Time'],
    description: 'Building world-class scalable serverless and cloud compute services supporting hundreds of millions of global customers.',
    rounds: ['Work Style & Coding OA', 'Tech Interview 1', 'Tech Interview 2', 'Bar Raiser Round'],
    hasApplied: false,
    applicationStage: null,
    appliedAt: null
  },
  {
    id: 'drive-orcl-04',
    companyName: 'Oracle Cloud (OCI)',
    companyLogo: 'OCI',
    logoColor: '#F80000',
    role: 'Member of Technical Staff - Cloud Infra',
    ctc: '24.5 LPA',
    ctcNumeric: 24.5,
    category: 'Dream',
    location: 'Bengaluru',
    workMode: 'Hybrid',
    minCgpa: 7.0,
    eligibleBranches: ['CSE', 'IT', 'ECE'],
    maxBacklogs: 0,
    deadlineHoursRemaining: 72,
    closesInText: 'Closes in 3 days',
    isUrgent: false,
    totalApplicants: 290,
    driveDate: 'Oct 23, 2026',
    status: 'Active',
    tags: ['Cloud Platform', 'Kubernetes', 'Go / Java'],
    description: 'Next-generation cloud architecture, kernel networking, hypervisor development, and zero-trust security infrastructure.',
    rounds: ['Cognitive & Coding Test', 'Technical Round 1', 'Technical Round 2', 'Managerial Round'],
    hasApplied: false,
    applicationStage: null,
    appliedAt: null
  },
  {
    id: 'drive-gs-05',
    companyName: 'Goldman Sachs',
    companyLogo: 'GS',
    logoColor: '#1A73E8',
    role: 'Engineering Analyst - Global Markets Tech',
    ctc: '31.5 LPA',
    ctcNumeric: 31.5,
    category: 'Super Dream',
    location: 'Bengaluru',
    workMode: 'On-Campus',
    minCgpa: 7.5,
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical'],
    maxBacklogs: 0,
    deadlineHoursRemaining: 96,
    closesInText: 'Closes in 4 days',
    isUrgent: false,
    totalApplicants: 350,
    driveDate: 'Oct 25, 2026',
    status: 'Active',
    tags: ['FinTech', 'High-Frequency', 'Data Engineering'],
    description: 'Ultra low-latency trading infrastructure, risk models, quantitative engines, and secure algorithmic transactions.',
    rounds: ['Aptitude + Math + Coding', 'Technical Round 1', 'Technical Round 2', 'Managing Director Interview'],
    hasApplied: false,
    applicationStage: null,
    appliedAt: null
  },
  {
    id: 'drive-nvda-06',
    companyName: 'NVIDIA Graphics',
    companyLogo: 'NVDA',
    logoColor: '#76B900',
    role: 'System Software Engineer - CUDA & AI Tooling',
    ctc: '36.0 LPA',
    ctcNumeric: 36.0,
    category: 'Super Dream',
    location: 'Pune / Bengaluru',
    workMode: 'Hybrid',
    minCgpa: 8.0,
    eligibleBranches: ['CSE', 'ECE'],
    maxBacklogs: 0,
    deadlineHoursRemaining: 48,
    closesInText: 'Closes in 48 hrs',
    isUrgent: true,
    totalApplicants: 210,
    driveDate: 'Oct 27, 2026',
    status: 'Active',
    tags: ['CUDA', 'GPU Architecture', 'AI Acceleration'],
    description: 'Work on CUDA drivers, deep learning compiler optimizations, accelerated graphics pipelines, and TensorRT runtime.',
    rounds: ['Hardware & C++ OA', 'Deep Systems Tech Round', 'Architecture Round', 'HR & Culture'],
    hasApplied: false,
    applicationStage: null,
    appliedAt: null
  },
  {
    id: 'drive-csco-07',
    companyName: 'Cisco Systems',
    companyLogo: 'CSCO',
    logoColor: '#00BCEB',
    role: 'Network Software Engineer (Core OS)',
    ctc: '18.5 LPA',
    ctcNumeric: 18.5,
    category: 'Tier-1 Core',
    location: 'Bengaluru',
    workMode: 'On-Campus',
    minCgpa: 7.0,
    eligibleBranches: ['CSE', 'IT', 'ECE', 'EEE'],
    maxBacklogs: 0,
    deadlineHoursRemaining: 140,
    closesInText: 'Closes in 6 days',
    isUrgent: false,
    totalApplicants: 410,
    driveDate: 'Nov 02, 2026',
    status: 'Active',
    tags: ['Networking', 'Linux Kernels', 'TCP/IP'],
    description: 'Enterprise routing and switching firmware, software-defined networking (SDN), and enterprise cybersecurity routers.',
    rounds: ['Aptitude + Networking OA', 'Technical Round 1', 'Technical Round 2', 'HR Round'],
    hasApplied: false,
    applicationStage: null,
    appliedAt: null
  }
];

const DEFAULT_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Aarav Patel',
    email: 'aarav.p@univ.edu.in',
    initials: 'AP',
    avatarColor: 'emerald',
    rollNo: '22CS104',
    branch: 'CSE',
    section: 'A',
    cgpa: 9.42,
    backlogs: 0,
    driveStage: 'Tech Round 2',
    resumeStatus: 'Verified PDF',
    gender: 'Male',
    selected: true,
  },
  {
    id: 'cand-2',
    name: 'Sneha R. Kulkarni',
    email: 'sneha.k@univ.edu.in',
    initials: 'SK',
    avatarColor: 'purple',
    rollNo: '22IT038',
    branch: 'IT',
    section: 'B',
    cgpa: 8.86,
    backlogs: 0,
    driveStage: 'Tech Round 2',
    resumeStatus: 'Verified PDF',
    gender: 'Female',
    selected: true,
  },
  {
    id: 'cand-3',
    name: 'Rohan Verma',
    email: 'rohan.v@univ.edu.in',
    initials: 'RV',
    avatarColor: 'amber',
    rollNo: '22EC081',
    branch: 'ECE',
    section: 'A',
    cgpa: 8.15,
    backlogs: 0,
    driveStage: 'OA Cleared',
    resumeStatus: 'Verified PDF',
    gender: 'Male',
    selected: true,
  },
  {
    id: 'cand-4',
    name: 'Ananya Iyer',
    email: 'ananya.i@univ.edu.in',
    initials: 'AI',
    avatarColor: 'indigo',
    rollNo: '22CS219',
    branch: 'CSE',
    section: 'C',
    cgpa: 9.10,
    backlogs: 0,
    driveStage: 'HR Interview',
    resumeStatus: 'Verified PDF',
    gender: 'Female',
    selected: true,
  },
  {
    id: 'cand-5',
    name: 'Vikramaditya Rao',
    email: 'vikram.r@univ.edu.in',
    initials: 'VR',
    avatarColor: 'emerald',
    rollNo: '22CS014',
    branch: 'CSE',
    section: 'A',
    cgpa: 7.92,
    backlogs: 0,
    driveStage: 'OA Cleared',
    resumeStatus: 'Verified PDF',
    gender: 'Male',
    selected: true,
  },
  {
    id: 'cand-6',
    name: 'Pooja Sundaram',
    email: 'pooja.s@univ.edu.in',
    initials: 'PS',
    avatarColor: 'cyan',
    rollNo: '22IT102',
    branch: 'IT',
    section: 'A',
    cgpa: 8.65,
    backlogs: 0,
    driveStage: 'Tech Round 1',
    resumeStatus: 'Verified PDF',
    gender: 'Female',
    selected: true,
  },
  {
    id: 'cand-7',
    name: 'Aditya Sengupta',
    email: 'aditya.s@univ.edu.in',
    initials: 'AS',
    avatarColor: 'blue',
    rollNo: '22EC045',
    branch: 'ECE',
    section: 'B',
    cgpa: 7.68,
    backlogs: 0,
    driveStage: 'Online Assessment',
    resumeStatus: 'Verified PDF',
    gender: 'Male',
    selected: true,
  },
  {
    id: 'cand-8',
    name: 'Meera Nambiar',
    email: 'meera.n@univ.edu.in',
    initials: 'MN',
    avatarColor: 'rose',
    rollNo: '22CS088',
    branch: 'CSE',
    section: 'B',
    cgpa: 9.35,
    backlogs: 0,
    driveStage: 'Offered',
    resumeStatus: 'Verified PDF',
    gender: 'Female',
    selected: false,
  },
  {
    id: 'cand-9',
    name: 'Devansh Khurana',
    email: 'devansh.k@univ.edu.in',
    initials: 'DK',
    avatarColor: 'orange',
    rollNo: '22IT052',
    branch: 'IT',
    section: 'A',
    cgpa: 8.40,
    backlogs: 0,
    driveStage: 'Tech Round 1',
    resumeStatus: 'Verified PDF',
    gender: 'Male',
    selected: false,
  },
  {
    id: 'cand-10',
    name: 'Tanvi Deshmukh',
    email: 'tanvi.d@univ.edu.in',
    initials: 'TD',
    avatarColor: 'teal',
    rollNo: '22EE019',
    branch: 'EEE',
    section: 'A',
    cgpa: 8.12,
    backlogs: 0,
    driveStage: 'OA Cleared',
    resumeStatus: 'Verified PDF',
    gender: 'Female',
    selected: false,
  }
];

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
