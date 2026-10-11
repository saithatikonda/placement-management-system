export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  email: string;
  avatar: string;
  cgpa: number;
  branch: string;
  section: string;
  backlogs: number;
  historyBacklogs: number;
  gender: 'Male' | 'Female' | 'Other';
  dreamStatus: 'Eligible for Super-Dream' | 'Dream Unlocked' | 'Tier-1 Placed' | 'Open Tier';
  currentOffers: number;
  maxOffersAllowed: number;
  resumeStatus: 'Verified PDF' | 'Pending Verification' | 'Needs Update';
  resumeUrl?: string;
  skills: string[];
}

export interface JobDrive {
  id: string;
  companyName: string;
  companyLogo: string;
  logoBg: string;
  role: string;
  ctc: string; // e.g. "44.0 LPA"
  ctcNumeric: number;
  category: 'Super Dream' | 'Dream' | 'Tier-1 Core' | 'Mass High-Growth';
  location: string;
  workMode: 'On-Campus' | 'Hybrid' | 'Remote';
  minCgpa: number;
  eligibleBranches: string[];
  maxBacklogs: number;
  deadlineHoursRemaining: number;
  closesInText: string;
  isUrgent: boolean;
  totalApplicants: number;
  driveDate: string;
  status: 'Active' | 'OA Phase' | 'Interviews' | 'Completed';
  tags: string[];
  description: string;
  rounds: string[];
  hasApplied?: boolean;
  applicationStage?: 'Applied' | 'OA Cleared' | 'Tech Round 1' | 'Tech Round 2' | 'HR Interview' | 'Offered';
}

export interface CandidateEntry {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  rollNo: string;
  branch: string;
  section: string;
  cgpa: number;
  backlogs: number;
  driveStage: 'Online Assessment' | 'OA Cleared' | 'Tech Round 1' | 'Tech Round 2' | 'HR Interview' | 'Offered' | 'Shortlisted';
  resumeStatus: 'Verified PDF' | 'Pending';
  gender: 'Female' | 'Male';
  selected: boolean;
}

export interface KPIMetrics {
  totalEligible: number;
  yoyGrowth: string;
  cohortReadinessPercent: number;
  enrolledStudents: number;
  placedStudents: number;
  placementRate: number;
  uniquePlaced: number;
  dreamTarget: number;
  companiesVisited: number;
  onSiteToday: number;
  tier1Day1s: number;
  inProgressDrives: number;
  highestCtc: number;
  averageCtc: number;
  medianCtc: number;
  top10Ctc: number;
  superDreamCount: number;
}
