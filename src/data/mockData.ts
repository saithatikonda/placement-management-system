import { JobDrive, CandidateEntry, StudentProfile, KPIMetrics } from '../types/pms';

/**
 * Initial empty structures for clean production state.
 * All mock records removed in favor of live Supabase PostgreSQL database data.
 */

export const initialStudentProfile: StudentProfile = {
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
  skills: [],
};

export const initialKPIs: KPIMetrics = {
  totalEligible: 0,
  yoyGrowth: '0% YoY',
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

export const initialCandidates: CandidateEntry[] = [];

export const initialJobDrives: JobDrive[] = [];
