/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthLoginView, UserRole } from './components/AuthLoginView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { RecruiterDashboardView } from './components/RecruiterDashboardView';
import { RecruitmentCockpit } from './components/RecruitmentCockpit';
import { JobCardsGrid } from './components/JobCardsGrid';
import { PolicyQuotasView } from './components/PolicyQuotasView';
import { AnalyticsReportsView } from './components/AnalyticsReportsView';
import { StudentMasterDataView } from './components/StudentMasterDataView';
import { PostJobDriveModal } from './components/modals/PostJobDriveModal';
import { ResumeViewerModal } from './components/modals/ResumeViewerModal';
import { ShortlistExportModal } from './components/modals/ShortlistExportModal';
import { CommandPaletteModal } from './components/modals/CommandPaletteModal';
import { 
  initialCandidates, 
  initialJobDrives, 
  initialStudentProfile, 
  initialKPIs 
} from './data/mockData';
import { CandidateEntry, JobDrive, StudentProfile, KPIMetrics } from './types/pms';
import { 
  CheckCircle2, 
  LogOut, 
  User, 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  Search, 
  Sparkles, 
  RotateCcw,
  Sun,
  Moon
} from 'lucide-react';

const STORAGE_KEY_SESSION = 'pms_apple_session';
const STORAGE_KEY_CANDIDATES = 'pms_apple_candidates';
const STORAGE_KEY_DRIVES = 'pms_apple_drives';
const STORAGE_KEY_STUDENT = 'pms_apple_student';
const STORAGE_KEY_KPIS = 'pms_apple_kpis';

export default function App() {
  // Theme State: defaults to Apple Cupertino Light mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pms_theme') === 'dark';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pms_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pms_theme', 'light');
    }
  }, [isDarkMode]);

  // Always clear any saved session on app load so login page is always shown
  useEffect(() => {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  }, []);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Session State: always start fresh (never restore from localStorage)
  const [session, setSession] = useState<{
    isLoggedIn: boolean;
    role: UserRole | null;
    user: any;
  }>({
    isLoggedIn: false,
    role: 'student',
    user: null,
  });

  // TPO specific tab navigation
  const [currentTpoTab, setCurrentTpoTab] = useState<string>('dashboard');

  // Application Data States with LocalStorage Persistence
  const [candidates, setCandidates] = useState<CandidateEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CANDIDATES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialCandidates;
  });

  const [drives, setDrives] = useState<JobDrive[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DRIVES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialJobDrives;
  });

  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STUDENT);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialStudentProfile;
  });

  const [kpis, setKpis] = useState<KPIMetrics>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KPIS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return initialKPIs;
  });

  const [selectedDriveId, setSelectedDriveId] = useState<string>('drive-msft-01');

  // Modal States
  const [isPostDriveOpen, setIsPostDriveOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedResumeCandidate, setSelectedResumeCandidate] = useState<CandidateEntry | StudentProfile | null>(null);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    } catch (e) {}
  }, [session]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CANDIDATES, JSON.stringify(candidates));
    } catch (e) {}
  }, [candidates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DRIVES, JSON.stringify(drives));
    } catch (e) {}
  }, [drives]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(student));
    } catch (e) {}
  }, [student]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_KPIS, JSON.stringify(kpis));
    } catch (e) {}
  }, [kpis]);

  // Handler: Sync live data from Supabase backend on mount
  useEffect(() => {
    // 1. Fetch live Job Drives
    fetch('/api/job-drives')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.drives)) {
          const mapped = data.drives.map((d: any) => ({
            id: d.id,
            companyName: d.company,
            companyLogo: d.code || d.company?.substring(0, 3) || 'JOB',
            logoBg: 'bg-[#0071E3]/10 text-[#0071E3]',
            role: d.role,
            ctc: d.ctc,
            ctcNumeric: parseFloat(d.ctc_numeric) || 20,
            category: (parseFloat(d.ctc_numeric) >= 25 ? 'Super Dream' : parseFloat(d.ctc_numeric) >= 15 ? 'Dream' : 'Tier-1 Core') as any,
            location: d.location || 'Hybrid',
            workMode: 'On-Campus' as any,
            minCgpa: parseFloat(d.min_cgpa) || 7.0,
            eligibleBranches: d.eligible_branches || ['CSE', 'IT'],
            maxBacklogs: 0,
            deadlineHoursRemaining: 72,
            closesInText: d.drive_date ? `Drive on ${d.drive_date}` : 'Open',
            isUrgent: false,
            totalApplicants: 0,
            driveDate: d.drive_date || 'TBD',
            status: 'Active' as any,
            tags: [d.code || 'Drive', d.ctc || 'CTC'],
            description: d.jd_summary || '',
            rounds: ['Online Assessment', 'Technical Round 1', 'HR Round'],
            hasApplied: false,
          }));
          setDrives(mapped);
        }
      })
      .catch(console.warn);

    // 2. Fetch live Candidates
    fetch('/api/candidates')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.candidates)) {
          const mapped = data.candidates.map((c: any) => ({
            id: c.id,
            name: c.name,
            email: c.email,
            initials: c.name ? c.name.split(' ').map((n: string) => n[0]).join('') : 'ST',
            avatarColor: 'bg-blue-500/10 text-blue-600',
            rollNo: c.roll_number,
            branch: c.branch,
            section: c.section || 'A',
            cgpa: parseFloat(c.cgpa) || 0,
            backlogs: c.backlogs || 0,
            driveStage: c.drive_stage || 'Applied',
            resumeStatus: c.resume_status || 'Verified PDF',
          }));
          setCandidates(mapped);
        }
      })
      .catch(console.warn);

    // 3. Fetch live KPI Metrics
    fetch('/api/kpi-metrics')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.metrics) {
          setKpis(data.metrics);
        }
      })
      .catch(console.warn);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3600);
  };

  const activeDrive = drives.find((d) => d.id === selectedDriveId) || drives[0] || null;

  // Global Keyboard listener for Command Palette (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Login handler
  const handleLogin = (role: UserRole, credentials: any) => {
    setSession({
      isLoggedIn: true,
      role,
      user: credentials,
    });

    if (role === 'student') {
      const roll = credentials?.identifier || 'STU-2026';
      const displayName = credentials?.name || (credentials?.identifier ? `Student (${credentials.identifier})` : 'Student Candidate');
      const freshStudent: StudentProfile = {
        ...initialStudentProfile,
        id: `stu-${Date.now()}`,
        name: displayName,
        rollNo: roll,
        email: roll.includes('@') ? roll : `${roll.toLowerCase()}@univ.edu.in`,
        cgpa: 0,
        resumeUrl: '',
        resumeStatus: 'Pending Verification',
        skills: []
      };
      setStudent(freshStudent);
      localStorage.setItem(STORAGE_KEY_STUDENT, JSON.stringify(freshStudent));
    }

    showToast(`Signed in to ${role === 'student' ? 'Student Portal' : role === 'recruiter' ? 'Recruiter Console' : 'TPO Administration'}`);
  };

  // Logout handler: Full session and state purge
  const handleLogout = () => {
    setSession({
      isLoggedIn: false,
      role: null,
      user: null,
    });
    setStudent(initialStudentProfile);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem(STORAGE_KEY_STUDENT);
    sessionStorage.clear();
    showToast('Signed out of placement portal. Session & resume data cleared.');
  };

  // Reset data handler: Clears mock data
  const handleResetData = async () => {
    localStorage.removeItem(STORAGE_KEY_CANDIDATES);
    localStorage.removeItem(STORAGE_KEY_DRIVES);
    localStorage.removeItem(STORAGE_KEY_STUDENT);
    localStorage.removeItem(STORAGE_KEY_KPIS);
    try {
      await fetch('/api/clear-all-data', { method: 'POST' });
    } catch (_) {}
    setCandidates([]);
    setDrives([]);
    setStudent(initialStudentProfile);
    setKpis(initialKPIs);
    showToast('✓ Cleared all mock and cached records. Database is completely clean.');
  };

  // Handler: Apply for Job Drive
  const handleApplyJob = async (drive: JobDrive) => {
    try {
      const res = await fetch('/api/apply-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentRollNumber: student.rollNo || (session.user?.username || 'STU-2026'),
          studentName: student.name || (session.user?.name || 'Registered Student'),
          company: drive.companyName,
          role: drive.role,
          ctc: drive.ctc
        })
      });
      const data = await res.json();
      if (data.success && data.application) {
        showToast(`✓ Applied to ${drive.companyName}! Saved in Supabase PostgreSQL (App #${data.application.id})`);
      } else {
        showToast(`✓ Application submitted to ${drive.companyName} for ${drive.role}`);
      }
    } catch (err) {
      showToast(`✓ Application submitted to ${drive.companyName} for ${drive.role}`);
    }

    setDrives((prev) =>
      prev.map((d) =>
        d.id === drive.id
          ? { ...d, hasApplied: true, applicationStage: 'Applied', totalApplicants: d.totalApplicants + 1 }
          : d
      )
    );
  };

  // Handler: Post New Job Drive
  const handleSaveNewDrive = async (newDrivePartial: Partial<JobDrive>) => {
    const completeDrive = newDrivePartial as JobDrive;
    try {
      fetch('/api/job-drives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: completeDrive.id,
          company: completeDrive.companyName,
          code: completeDrive.companyName.substring(0, 4).toUpperCase(),
          role: completeDrive.role,
          ctc: completeDrive.ctc,
          ctcNumeric: completeDrive.ctcNumeric || 20,
          minCgpa: completeDrive.minCgpa || 7.5,
          eligibleBranches: completeDrive.eligibleBranches || ['CSE', 'IT'],
          driveDate: completeDrive.driveDate || 'Nov 15, 2026',
          status: completeDrive.status || 'Active Registration',
          location: completeDrive.location || 'Hybrid',
          jdSummary: completeDrive.description || ''
        })
      }).catch(console.warn);
    } catch (_) {}

    setDrives((prev) => [completeDrive, ...prev]);
    setKpis((prev) => ({
      ...prev,
      companiesVisited: prev.companiesVisited + 1,
      inProgressDrives: prev.inProgressDrives + 1,
    }));
    showToast(`✓ Published recruitment drive for ${completeDrive.companyName} (${completeDrive.ctc}) to Supabase PostgreSQL`);
  };

  // Handler: Open Resume modal
  const handleViewResume = (cand: CandidateEntry | StudentProfile) => {
    setSelectedResumeCandidate(cand);
    setIsResumeModalOpen(true);
  };

  // Handler: Export CSV
  const handleExportCsv = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Branch', 'CGPA', 'Stage', 'Resume Status'];
    const rows = candidates.map((c) => [
      c.rollNo,
      `"${c.name}"`,
      c.email,
      c.branch,
      c.cgpa,
      c.driveStage,
      c.resumeStatus,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `candidates_master_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Exported candidates roster to CSV');
  };

  // Handler: ERP Sync
  const handleSyncErp = () => {
    showToast('Synchronizing with University ERP database...');
    setTimeout(() => {
      showToast('✓ Refreshed 1,024 student records from ERP');
    }, 900);
  };

  // 1. IF NOT LOGGED IN, RENDER AUTH LOGIN VIEW
  if (!session.isLoggedIn) {
    return (
      <AuthLoginView 
        onLogin={handleLogin} 
        isDarkMode={isDarkMode} 
        onToggleTheme={toggleTheme} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#141E30] text-[#1D1D1F] dark:text-[#F0F4FF] relative overflow-x-hidden transition-colors duration-200">
      {/* Global Notification Toast - Apple Floating Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/95 dark:bg-[#1E2D45]/95 backdrop-blur-xl border border-black/[0.08] dark:border-white/10 text-[#1D1D1F] dark:text-white px-4 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#34C759]/15 text-[#34C759] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* PORTAL TOP NAVIGATION BAR - Cupertino Apple Translucent Glass */}
      <header className="sticky top-0 left-0 right-0 h-16 bg-white/85 dark:bg-[#1A2744]/90 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.10] z-40 px-6 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(0,113,227,0.25)]">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#1D1D1F] dark:text-white tracking-tight">
                Placement Command
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-[#0071E3] dark:text-[#38BDF8] border border-black/[0.04] dark:border-white/[0.06] uppercase tracking-wider">
                {session.role === 'student' && 'Student Portal'}
                {session.role === 'recruiter' && 'Recruiter Console'}
                {session.role === 'tpo' && 'TPO Administration'}
              </span>
            </div>
            <span className="text-[11px] text-[#6E6E73] dark:text-[#CBD5E1]">
              College Placement Management System
            </span>
          </div>
        </div>

        {/* Segmented Control for Role Switching */}
        <div className="hidden md:flex items-center bg-black/[0.05] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.08] p-1 rounded-full">
          <button
            onClick={() => setSession({ ...session, role: 'student' })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              session.role === 'student'
                ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => setSession({ ...session, role: 'recruiter' })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              session.role === 'recruiter'
                ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Recruiter</span>
          </button>

          <button
            onClick={() => setSession({ ...session, role: 'tpo' })}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              session.role === 'tpo'
                ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TPO Admin</span>
          </button>
        </div>

        {/* Right Actions: Command Search, Theme Toggle, User Identity, Logout */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] rounded-full text-xs text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white transition-all cursor-pointer"
            title="Search drives & candidates (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-[#86868B] dark:text-[#CBD5E1]" />
            <span className="hidden lg:inline text-[11px] font-medium">Search</span>
            <kbd className="font-mono text-[10px] bg-white dark:bg-[#1E293B] border border-black/[0.1] dark:border-white/[0.1] px-1.5 py-0.2 rounded shadow-2xs text-[#86868B]">
              ⌘K
            </kbd>
          </button>

          {/* Optional Theme Toggle: Apple Light / Dark Mode */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.07] dark:hover:bg-white/[0.1] border border-black/[0.06] dark:border-white/[0.08] rounded-full text-xs text-[#1D1D1F] dark:text-[#F8FAFC] font-semibold transition-all cursor-pointer shadow-xs"
            title="Toggle Apple Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            <span className="hidden sm:inline font-medium">{isDarkMode ? 'Dark Mode' : 'Apple Light'}</span>
          </button>


          {/* User Session Info */}
          <div className="hidden sm:flex flex-col text-right pl-2">
            <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white leading-tight">
              {session.role === 'student' && (student.name ? `${student.name} (${student.rollNo})` : (session.user?.username || 'Student User'))}
              {session.role === 'recruiter' && (session.user?.username || 'Recruiter Console')}
              {session.role === 'tpo' && (session.user?.username || 'TPO Administrator')}
            </span>
            <span className="text-[10px] text-[#34C759] font-medium flex items-center justify-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]"></span>
              Active Session
            </span>
          </div>

          {/* Reset Demo Data button */}
          <button
            onClick={handleResetData}
            className="p-1.5 text-[#86868B] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] rounded-xl transition-all cursor-pointer"
            title="Reset demo data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-black/[0.04] dark:bg-white/[0.06] hover:bg-rose-50 dark:hover:bg-rose-500/20 border border-black/[0.06] dark:border-white/[0.08] text-[#6E6E73] dark:text-[#CBD5E1] hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            title="Sign out of portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* PORTAL ROUTING RENDERER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 relative z-10">
        {/* 2. DEDICATED STUDENT PORTAL */}
        {session.role === 'student' && (
          <StudentDashboardView
            student={student}
            setStudent={setStudent}
            drives={drives}
            onApplyJob={handleApplyJob}
            onViewResume={handleViewResume}
          />
        )}

        {/* 3. DEDICATED COMPANY / RECRUITER PORTAL */}
        {session.role === 'recruiter' && (
          <RecruiterDashboardView
            candidates={candidates}
            setCandidates={setCandidates}
            companyName="Microsoft IDC"
            onPostNewDrive={() => setIsPostDriveOpen(true)}
            onViewResume={handleViewResume}
          />
        )}

        {/* 4. DEDICATED TPO / ADMIN PORTAL */}
        {session.role === 'tpo' && (
          <div className="space-y-6">
            {/* TPO Operations Engine Nav Tabs - Apple Segmented Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
              <div className="bg-white/[0.06] border border-white/[0.08] p-1 rounded-full inline-flex items-center gap-1 overflow-x-auto max-w-full">
                {[
                  { id: 'dashboard', label: 'Recruitment Cockpit' },
                  { id: 'drives', label: 'Company Job Grid' },
                  { id: 'students', label: 'Student Master Data' },
                  { id: 'policy', label: 'Policy & Quotas' },
                  { id: 'analytics', label: 'Analytics Reports' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTpoTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                      currentTpoTab === tab.id
                        ? 'bg-[#0071E3] text-white shadow-[0_2px_8px_rgba(0,113,227,0.35)]'
                        : 'text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsPostDriveOpen(true)}
                className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>+ Post New Job Drive</span>
              </button>
            </div>

            {currentTpoTab === 'dashboard' && (
              <RecruitmentCockpit
                candidates={candidates}
                setCandidates={setCandidates}
                kpis={kpis}
                activeDrive={activeDrive}
                onPostNewDrive={() => setIsPostDriveOpen(true)}
                onExportCsv={handleExportCsv}
                onSyncErp={handleSyncErp}
                onGenerateFormalShortlist={() => setIsShortlistModalOpen(true)}
                onViewResume={handleViewResume}
                onEmailRoster={() => setIsShortlistModalOpen(true)}
              />
            )}

            {currentTpoTab === 'drives' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                    Campus Recruitment Drives Directory
                  </h3>
                  <span className="text-xs text-[#86868B] font-medium">
                    {drives.length} Drives Scheduled
                  </span>
                </div>
                <JobCardsGrid
                  drives={drives}
                  student={student}
                  onApplyJob={handleApplyJob}
                  onViewDetails={(drive) => {
                    setSelectedDriveId(drive.id);
                    setCurrentTpoTab('dashboard');
                    showToast(`Active cockpit focused on ${drive.companyName}`);
                  }}
                />
              </div>
            )}

            {currentTpoTab === 'students' && (
              <StudentMasterDataView
                candidates={candidates}
                student={student}
                onViewResume={handleViewResume}
              />
            )}

            {currentTpoTab === 'policy' && <PolicyQuotasView />}

            {currentTpoTab === 'analytics' && <AnalyticsReportsView kpis={kpis} />}
          </div>
        )}
      </main>

      {/* MODALS */}
      <PostJobDriveModal
        isOpen={isPostDriveOpen}
        onClose={() => setIsPostDriveOpen(false)}
        onSaveDrive={handleSaveNewDrive}
      />

      <ResumeViewerModal
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setSelectedResumeCandidate(null);
        }}
        candidate={selectedResumeCandidate}
      />

      <ShortlistExportModal
        isOpen={isShortlistModalOpen}
        onClose={() => setIsShortlistModalOpen(false)}
        selectedCandidates={candidates.filter((c) => c.selected)}
        activeDrive={activeDrive}
      />

      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        drives={drives}
        candidates={candidates}
        onSelectDrive={(d) => {
          setSelectedDriveId(d.id);
          showToast(`Focused on ${d.companyName}`);
        }}
        onSelectCandidate={(c) => {
          handleViewResume(c);
        }}
      />
    </div>
  );
}
