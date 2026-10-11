/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthLoginView, UserRole } from './components/AuthLoginView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { RecruiterDashboardView } from './components/RecruiterDashboardView';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
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
import { CandidateEntry, JobDrive, StudentProfile } from './types/pms';
import { 
  Sparkles, 
  LogOut, 
  User, 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Session State: starts at login screen unless user logs in
  const [session, setSession] = useState<{
    isLoggedIn: boolean;
    role: UserRole | null;
    user: any;
  }>({
    isLoggedIn: false, // Default to login screen so user sees Student Login page first
    role: 'student',   // Initial role set to student
    user: null,
  });

  // TPO specific tab navigation
  const [currentTpoTab, setCurrentTpoTab] = useState<string>('dashboard');

  // Application Data States
  const [candidates, setCandidates] = useState<CandidateEntry[]>(initialCandidates);
  const [drives, setDrives] = useState<JobDrive[]>(initialJobDrives);
  const [student, setStudent] = useState<StudentProfile>(initialStudentProfile);
  const [kpis, setKpis] = useState(initialKPIs);
  const [selectedDriveId, setSelectedDriveId] = useState<string>('drive-msft-01');

  // Modal States
  const [isPostDriveOpen, setIsPostDriveOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [selectedResumeCandidate, setSelectedResumeCandidate] = useState<CandidateEntry | StudentProfile | null>(null);
  const [isShortlistModalOpen, setIsShortlistModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeDrive = drives.find((d) => d.id === selectedDriveId) || drives[0];

  // Global Keyboard listener for Command Palette (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
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
    showToast(`✓ Welcome! Logged in to ${role.toUpperCase()} Portal.`);
  };

  // Logout handler
  const handleLogout = () => {
    setSession({
      isLoggedIn: false,
      role: null,
      user: null,
    });
    showToast('Logged out of placement portal.');
  };

  // Handler: Apply for Job Drive
  const handleApplyJob = (drive: JobDrive) => {
    /* 
     * Spring Boot REST call placeholder:
     * fetch('http://localhost:8080/api/v1/student/apply', {
     *   method: 'POST',
     *   body: JSON.stringify({ studentId: student.rollNo, driveId: drive.id })
     * })
     */
    setDrives((prev) =>
      prev.map((d) =>
        d.id === drive.id
          ? { ...d, hasApplied: true, applicationStage: 'Applied', totalApplicants: d.totalApplicants + 1 }
          : d
      )
    );
    showToast(`✓ One-Click Application submitted to ${drive.companyName} for ${drive.role}!`);
  };

  // Handler: Post New Job Drive
  const handleSaveNewDrive = (newDrivePartial: Partial<JobDrive>) => {
    /* 
     * Spring Boot REST call placeholder:
     * fetch('http://localhost:8080/api/v1/recruiter/drives', {
     *   method: 'POST',
     *   body: JSON.stringify(newDrivePartial)
     * })
     */
    const completeDrive = newDrivePartial as JobDrive;
    setDrives((prev) => [completeDrive, ...prev]);
    setKpis((prev) => ({
      ...prev,
      companiesVisited: prev.companiesVisited + 1,
      inProgressDrives: prev.inProgressDrives + 1,
    }));
    showToast(`✓ Published recruitment drive for ${completeDrive.companyName} (${completeDrive.ctc})!`);
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
    showToast('✓ Exported candidates roster to CSV file.');
  };

  // Handler: ERP Sync
  const handleSyncErp = () => {
    showToast('Synchronizing with University ERP database...');
    setTimeout(() => {
      showToast('✓ Successfully refreshed 1,024 student records from ERP database!');
    }, 1200);
  };

  // 1. IF NOT LOGGED IN, RENDER AUTH LOGIN VIEW
  if (!session.isLoggedIn) {
    return <AuthLoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#070F0C] text-[#F1F5F9] relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient radial flares */}
      <div className="fixed top-0 right-0 w-[650px] h-[650px] ambient-orange-flare pointer-events-none z-0"></div>
      <div className="fixed bottom-0 left-0 w-[650px] h-[650px] ambient-emerald-flare pointer-events-none z-0"></div>

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#11231B] border border-emerald-500/50 text-[#F1F5F9] px-4 py-3 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* PORTAL TOP NAVIGATION BAR */}
      <header className="sticky top-0 left-0 right-0 h-16 bg-[#070F0C]/90 backdrop-blur-xl border-b border-emerald-500/20 z-40 px-6 flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#11231B] border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-extrabold shadow-[0_0_14px_rgba(16,185,129,0.2)]">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-[#F1F5F9] tracking-tight">
                Placement Command
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold uppercase">
                {session.role === 'student' && 'Student Portal'}
                {session.role === 'recruiter' && 'Recruiter Console'}
                {session.role === 'tpo' && 'TPO Administration'}
              </span>
            </div>
            <span className="text-[11px] text-[#94A3B8]">
              University Campus Placement Management System
            </span>
          </div>
        </div>

        {/* Global Role Switcher Pill Bar for Quick Review */}
        <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#11231B] border border-[#162E23] rounded-xl">
          <button
            onClick={() => setSession({ ...session, role: 'student' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              session.role === 'student'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student</span>
          </button>

          <button
            onClick={() => setSession({ ...session, role: 'recruiter' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              session.role === 'recruiter'
                ? 'bg-[#F97316] text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Recruiter</span>
          </button>

          <button
            onClick={() => setSession({ ...session, role: 'tpo' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              session.role === 'tpo'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>TPO Admin</span>
          </button>
        </div>

        {/* User Session & Logout Action */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-bold text-[#F1F5F9]">
              {session.role === 'student' && 'Aarav Patel (22CS104)'}
              {session.role === 'recruiter' && 'Microsoft Campus Lead'}
              {session.role === 'tpo' && 'Dr. Arjun Sharma (Director)'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              Session Authenticated
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#11231B] hover:bg-rose-950/40 border border-[#162E23] hover:border-rose-900/40 text-[#94A3B8] hover:text-rose-300 rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
            title="Sign out of portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
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
            {/* TPO Operations Engine Nav Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-[#162E23] overflow-x-auto">
              <div className="flex items-center gap-2">
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
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      currentTpoTab === tab.id
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-[#11231B] text-[#94A3B8] border border-[#162E23] hover:text-[#F1F5F9]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsPostDriveOpen(true)}
                className="px-4 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-[0_0_16px_rgba(249,115,22,0.35)] transition-all whitespace-nowrap"
              >
                + Post New Job Drive
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
                <h3 className="text-xl font-extrabold text-[#F1F5F9]">
                  Institutional Recruitment Drives Directory
                </h3>
                <JobCardsGrid
                  drives={drives}
                  student={student}
                  onApplyJob={handleApplyJob}
                  onViewDetails={(drive) => {
                    setSelectedDriveId(drive.id);
                    setCurrentTpoTab('dashboard');
                    showToast(`Switched active cockpit drive to ${drive.companyName}`);
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
