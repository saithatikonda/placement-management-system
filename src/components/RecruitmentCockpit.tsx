import React, { useState, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Building2, 
  Clock, 
  Coins, 
  FileSpreadsheet, 
  RefreshCw, 
  PlusCircle, 
  SlidersHorizontal, 
  RotateCcw, 
  BookmarkCheck, 
  Check, 
  Search, 
  Mail, 
  Zap, 
  ArrowRightCircle, 
  XCircle, 
  MoreVertical, 
  ChevronDown, 
  Sparkles,
  FileCheck2
} from 'lucide-react';
import { CandidateEntry, KPIMetrics, JobDrive } from '../types/pms';

interface RecruitmentCockpitProps {
  candidates: CandidateEntry[];
  setCandidates: React.Dispatch<React.SetStateAction<CandidateEntry[]>>;
  kpis: KPIMetrics;
  activeDrive: JobDrive;
  onPostNewDrive: () => void;
  onExportCsv: () => void;
  onSyncErp: () => void;
  onGenerateFormalShortlist: (selectedCount: number) => void;
  onViewResume: (candidate: CandidateEntry) => void;
  onEmailRoster: () => void;
}

export const RecruitmentCockpit: React.FC<RecruitmentCockpitProps> = ({
  candidates,
  setCandidates,
  kpis,
  activeDrive,
  onPostNewDrive,
  onExportCsv,
  onSyncErp,
  onGenerateFormalShortlist,
  onViewResume,
  onEmailRoster,
}) => {
  // Filter States
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [backlogFilter, setBacklogFilter] = useState<'zero' | 'history' | 'all'>('zero');
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['CSE', 'IT', 'ECE']);
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male'>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Branch options
  const allBranches = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical'];

  const toggleBranch = (br: string) => {
    if (selectedBranches.includes(br)) {
      if (selectedBranches.length > 1) {
        setSelectedBranches(selectedBranches.filter(b => b !== br));
      }
    } else {
      setSelectedBranches([...selectedBranches, br]);
    }
  };

  // Filter computation
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // CGPA Check
      if (c.cgpa < minCgpa) return false;

      // Backlog Check
      if (backlogFilter === 'zero' && c.backlogs > 0) return false;

      // Branch Check
      if (!selectedBranches.includes(c.branch)) return false;

      // Gender Check
      if (genderFilter !== 'All' && c.gender !== genderFilter) return false;

      // Stage Check
      if (stageFilter !== 'All') {
        if (stageFilter === 'OA Cleared' && c.driveStage !== 'OA Cleared') return false;
        if (stageFilter === 'Tech Interview' && !c.driveStage.includes('Tech')) return false;
        if (stageFilter === 'HR Round' && c.driveStage !== 'HR Interview') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesRoll = c.rollNo.toLowerCase().includes(q);
        const matchesEmail = c.email.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesEmail) return false;
      }

      return true;
    });
  }, [candidates, minCgpa, backlogFilter, selectedBranches, stageFilter, searchQuery, genderFilter]);

  // Bulk Selection Handlers
  const selectedCount = filteredCandidates.filter((c) => c.selected).length;
  const isAllSelected = filteredCandidates.length > 0 && selectedCount === filteredCandidates.length;

  const toggleSelectAll = () => {
    const nextState = !isAllSelected;
    const filteredIds = new Set(filteredCandidates.map(c => c.id));
    setCandidates((prev) =>
      prev.map((c) => (filteredIds.has(c.id) ? { ...c, selected: nextState } : c))
    );
  };

  const toggleCandidateSelect = (id: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  // Candidate action: Promote stage
  const promoteCandidate = (id: string, name: string) => {
    const stageFlow: Record<string, CandidateEntry['driveStage']> = {
      'Online Assessment': 'OA Cleared',
      'OA Cleared': 'Tech Round 1',
      'Tech Round 1': 'Tech Round 2',
      'Tech Round 2': 'HR Interview',
      'HR Interview': 'Offered',
      'Offered': 'Offered',
      'Shortlisted': 'Online Assessment',
    };

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStage = stageFlow[c.driveStage] || 'Tech Round 1';
          return { ...c, driveStage: nextStage };
        }
        return c;
      })
    );
    showToast(`✓ Promoted ${name} to next interview round`);
  };

  // Candidate action: Reject candidate
  const rejectCandidate = (id: string, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    showToast(`Candidate ${name} archived from shortlist`);
  };

  // Bulk action: Mark OA Passed
  const bulkMarkOaPassed = () => {
    setCandidates((prev) =>
      prev.map((c) => (c.selected ? { ...c, driveStage: 'OA Cleared' } : c))
    );
    showToast(`✓ Marked ${selectedCount} candidates as OA Cleared`);
  };

  // Reset Filters
  const resetFilters = () => {
    setMinCgpa(7.5);
    setBacklogFilter('zero');
    setSelectedBranches(['CSE', 'IT', 'ECE']);
    setStageFilter('All');
    setSearchQuery('');
    setGenderFilter('All');
    showToast('Filters reset to default');
  };

  return (
    <div className="flex flex-col w-full pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-xl border border-black/[0.08] text-[#1D1D1F] px-4 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] flex items-center gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#0071E3]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Action Header & Drive Switcher Bar */}
      <div className="flex flex-col gap-2 pt-2 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumb & Context Flag */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#86868B]">
              <span className="font-semibold text-[#0071E3]">
                Academic Year 2025–26
              </span>
              <span>•</span>
              <span>Campus Recruitment Division</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-full bg-black/[0.04] text-[#1D1D1F] font-semibold text-[11px]">
                Cohort A-1
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-[#1D1D1F] tracking-tight leading-tight">
                Recruitment Operations Cockpit{' '}
                <span className="text-xl font-normal text-[#86868B]">(Class of 2026)</span>
              </h1>

              {/* Drive Quick Switcher Pill */}
              <div className="flex items-center gap-2 bg-white border border-black/[0.08] px-3.5 py-1.5 rounded-full shadow-2xs transition-all cursor-pointer group">
                <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider text-[#86868B] font-semibold">
                  Active Drive:
                </span>
                <span className="font-semibold text-[#0071E3] text-xs">
                  {activeDrive ? `${activeDrive.companyName} — ${activeDrive.role?.split('(')[0]?.trim() || ''}` : 'No Active Drives'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6E6E73] mt-0.5">
              Real-time shortlisting engine, eligibility cutoffs, and applicant pipeline management across all departments.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Export Button */}
            <button
              onClick={onExportCsv}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-black/[0.02] text-[#1D1D1F] border border-black/[0.08] font-semibold text-xs rounded-xl shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#0071E3]" />
              <span>Export CSV</span>
            </button>

            {/* ERP Batch Sync */}
            <button
              onClick={onSyncErp}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-black/[0.02] text-[#1D1D1F] border border-black/[0.08] font-semibold text-xs rounded-xl shadow-2xs active:scale-[0.98] transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-[#86868B]" />
              <span>ERP Sync</span>
            </button>

            {/* Primary Create Drive Button */}
            <button
              onClick={onPostNewDrive}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white font-semibold text-xs rounded-xl shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>+ Post New Job Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards (4-Column Apple Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI Card 1: Eligible Students */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
                Total Cohort Enrolled
              </span>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl font-bold font-mono text-[#1D1D1F] tracking-tight">
                  {kpis.totalEligible}
                </span>
                <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-[#34C759]/10 text-[#28A745]">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.yoyGrowth}
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.06]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#6E6E73] text-[11px]">
                Placement Ready ({kpis.enrolledStudents} Enrolled)
              </span>
              <span className="font-mono font-semibold text-[#0071E3]">
                {kpis.cohortReadinessPercent}%
              </span>
            </div>
            <div className="w-full bg-[#F2F2F7] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#0071E3] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${kpis.cohortReadinessPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI Card 2: Placed Students */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
                Placed Students
              </span>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl font-bold font-mono text-[#1D1D1F] tracking-tight">
                  {kpis.placedStudents}
                </span>
                <span className="text-xs font-semibold text-[#34C759]">
                  {kpis.placementRate}% Overall
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#34C759]/10 text-[#34C759] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.06]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#6E6E73] text-[11px]">
                {kpis.uniquePlaced} Unique • Target {kpis.dreamTarget}%
              </span>
              <span className="text-[#34C759] font-semibold text-[11px]">{kpis.placementRate}%</span>
            </div>
            <div className="w-full bg-[#F2F2F7] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#34C759] h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${kpis.placementRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI Card 3: Companies Visited */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
                Companies Visited
              </span>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl font-bold font-mono text-[#1D1D1F] tracking-tight">
                  {kpis.companiesVisited}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3] animate-pulse"></span>
                  {kpis.onSiteToday} Today
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] text-[11px]">{kpis.tier1Day1s} Tier-1 Day 1s</span>
            <span className="inline-flex items-center gap-1 font-semibold text-[#0071E3] text-xs">
              <Clock className="w-3.5 h-3.5" /> {kpis.inProgressDrives} Drives Active
            </span>
          </div>
        </div>

        {/* KPI Card 4: CTC Compensation Metrics */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
                Compensation Metrics
              </span>
              <div className="flex items-baseline gap-4 mt-1.5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#86868B] font-medium">Highest</span>
                  <span className="text-2xl font-bold font-mono text-[#0071E3]">
                    {kpis.highestCtc.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-[#86868B]">LPA</span>
                  </span>
                </div>
                <div className="w-px h-8 bg-black/[0.06]"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#86868B] font-medium">Average</span>
                  <span className="text-2xl font-bold font-mono text-[#1D1D1F]">
                    {kpis.averageCtc.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-[#86868B]">LPA</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#6E6E73] text-[11px]">
              Median: {kpis.medianCtc} LPA • Top 10%: {kpis.top10Ctc} LPA
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-semibold text-[10px] uppercase">
              Super Dream: {kpis.superDreamCount}
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Shortlisting Filter Engine - Apple Card */}
      <div className="apple-card p-5 mb-5 flex flex-col gap-4">
        {/* Filter Bar Header & Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-[#1D1D1F]">
              Shortlisting Filter Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/[0.05] text-[#1D1D1F] font-mono text-xs font-semibold">
              Showing {filteredCandidates.length} of {candidates.length} Registered Candidates
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={resetFilters}
              className="text-[#86868B] hover:text-[#1D1D1F] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={() => showToast('Shortlist parameters synchronized')}
              className="text-[#0071E3] hover:text-[#0077ED] transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
              type="button"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Save Preset</span>
            </button>
          </div>
        </div>

        {/* Filter Form Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
          {/* 1. CGPA Slider & Indicator */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
                Min Cumulative CGPA
              </label>
              <span className="font-mono font-bold text-[#0071E3] px-2 py-0.5 rounded-md bg-[#0071E3]/10 text-xs">
                ≥ {minCgpa.toFixed(2)} / 10.0
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                className="w-full cursor-pointer"
                max="9.5"
                min="6.0"
                step="0.25"
                type="range"
                value={minCgpa}
                onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
              />
              <span className="text-xs font-mono text-[#1D1D1F] font-semibold w-8">
                {minCgpa.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-[#86868B] font-mono">
              <span>6.0</span>
              <span>7.0</span>
              <span className="text-[#0071E3] font-bold">7.5</span>
              <span>8.5</span>
              <span>9.5</span>
            </div>
          </div>

          {/* 2. Backlog Status Pills */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
              Backlog Eligibility
            </label>
            <div className="bg-black/[0.05] p-1 rounded-full flex items-center gap-1 mt-1">
              <button
                type="button"
                onClick={() => setBacklogFilter('zero')}
                className={`flex-1 inline-flex items-center justify-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  backlogFilter === 'zero'
                    ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>0 Active</span>
              </button>
              <button
                type="button"
                onClick={() => setBacklogFilter('history')}
                className={`flex-1 inline-flex items-center justify-center gap-1 py-1 px-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  backlogFilter === 'history'
                    ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                    : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                }`}
              >
                History Clear
              </button>
            </div>
          </div>

          {/* 3. Branch Multi-select Pills */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
              Eligible Branches
            </label>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              {allBranches.map((br) => {
                const isSelected = selectedBranches.includes(br);
                return (
                  <button
                    key={br}
                    type="button"
                    onClick={() => toggleBranch(br)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0071E3] text-white shadow-2xs'
                        : 'bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F]'
                    }`}
                  >
                    {br}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Gender & Demographics */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
              Gender Diversity
            </label>
            <div className="bg-black/[0.05] p-1 rounded-full flex items-center gap-1 mt-1">
              {(['All', 'Female', 'Male'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderFilter(g)}
                  className={`flex-1 py-1 px-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    genderFilter === g
                      ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Round / Pipeline Phase Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/[0.06]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold mr-1">
              Stage:
            </span>
            <div className="bg-black/[0.05] p-1 rounded-full flex items-center gap-1">
              {[
                { id: 'All', label: 'All Qualified' },
                { id: 'OA Cleared', label: 'OA Cleared' },
                { id: 'Tech Interview', label: 'Tech Round' },
                { id: 'HR Round', label: 'HR Round' },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStageFilter(st.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    stageFilter === st.id
                      ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                  type="button"
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                className="pl-8 pr-3 py-1.5 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] placeholder:text-[#A1A1A6] outline-none w-64 transition-all"
                placeholder="Search candidate name or roll..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar - Apple Light Pill */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 px-5 apple-card mb-4 bg-[#FBFBFC]">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 text-[#0071E3] rounded cursor-pointer"
              type="checkbox"
            />
            <span className="font-bold text-xs text-[#1D1D1F]">
              {selectedCount} Candidates Selected
            </span>
          </label>

          <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-black/[0.08]">
            <button
              onClick={bulkMarkOaPassed}
              className="px-2.5 py-1 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-[11px] font-semibold text-[#1D1D1F] transition-colors cursor-pointer"
              type="button"
            >
              Mark OA Passed
            </button>
            <button
              onClick={() => showToast(`Dispatched interview slot invitations to ${selectedCount} candidates`)}
              className="px-2.5 py-1 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-[11px] font-semibold text-[#6E6E73] hover:text-[#1D1D1F] transition-colors cursor-pointer"
              type="button"
            >
              Send Slot Invite
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onEmailRoster}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            type="button"
          >
            <Mail className="w-3.5 h-3.5 text-[#0071E3]" />
            <span>Email Roster</span>
          </button>
          <button
            onClick={() => onGenerateFormalShortlist(selectedCount)}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] transition-all cursor-pointer"
            type="button"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Generate Shortlist ({selectedCount})</span>
          </button>
        </div>
      </div>

      {/* Candidate Table Card */}
      <div
        id="candidateTableContainer"
        className="apple-card overflow-hidden flex flex-col"
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FBFBFC] h-10 text-[#86868B] text-[11px] uppercase tracking-wider border-b border-black/[0.06]">
                <th className="w-10 px-4 text-center">
                  <input
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 text-[#0071E3] rounded cursor-pointer"
                    type="checkbox"
                  />
                </th>
                <th className="px-4 py-1.5 font-bold">Candidate Name</th>
                <th className="px-4 py-1.5 font-bold">Roll No</th>
                <th className="px-4 py-1.5 font-bold">Branch</th>
                <th className="px-4 py-1.5 font-bold">CGPA</th>
                <th className="px-4 py-1.5 font-bold">Backlogs</th>
                <th className="px-4 py-1.5 font-bold">Drive Stage</th>
                <th className="px-4 py-1.5 font-bold">Resume Dossier</th>
                <th className="px-4 py-1.5 font-bold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-xs text-[#1D1D1F]">
              {filteredCandidates.map((cand) => (
                <tr
                  key={cand.id}
                  data-student-id={cand.rollNo}
                  data-stage={cand.driveStage}
                  className={`h-13 hover:bg-black/[0.02] transition-colors group ${
                    cand.selected ? 'bg-[#0071E3]/[0.03]' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="px-4 text-center">
                    <input
                      checked={cand.selected}
                      onChange={() => toggleCandidateSelect(cand.id)}
                      className="w-3.5 h-3.5 text-[#0071E3] rounded cursor-pointer"
                      type="checkbox"
                    />
                  </td>

                  {/* Student Name & Email */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs flex items-center justify-center shrink-0">
                        {cand.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#1D1D1F] truncate group-hover:text-[#0071E3] transition-colors">
                          {cand.name}
                        </span>
                        <span className="text-[11px] text-[#6E6E73] truncate">
                          {cand.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="px-4 py-2 font-mono font-medium text-[#1D1D1F]">
                    {cand.rollNo}
                  </td>

                  {/* Branch & Sec */}
                  <td className="px-4 py-2">
                    <span className="inline-flex px-2 py-0.5 rounded-md bg-black/[0.04] font-mono text-xs text-[#1D1D1F] font-semibold">
                      {cand.branch} ({cand.section})
                    </span>
                  </td>

                  {/* CGPA */}
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-xs font-bold ${
                        cand.cgpa >= 9.0
                          ? 'bg-[#34C759]/10 text-[#28A745]'
                          : cand.cgpa >= 8.0
                          ? 'bg-[#0071E3]/10 text-[#0071E3]'
                          : 'bg-[#FF9500]/10 text-[#D97706]'
                      }`}
                    >
                      {cand.cgpa.toFixed(2)}
                    </span>
                  </td>

                  {/* Backlogs */}
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-black/[0.04] text-[#6E6E73] font-medium">
                      {cand.backlogs} Active
                    </span>
                  </td>

                  {/* Drive Stage Badge */}
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        cand.driveStage === 'Offered'
                          ? 'bg-[#34C759]/10 text-[#28A745]'
                          : cand.driveStage.includes('Tech')
                          ? 'bg-[#0071E3]/10 text-[#0071E3]'
                          : cand.driveStage === 'HR Interview'
                          ? 'bg-purple-50 text-purple-600'
                          : cand.driveStage === 'OA Cleared'
                          ? 'bg-[#FF9500]/10 text-[#D97706]'
                          : 'bg-black/[0.05] text-[#6E6E73]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {cand.driveStage}
                    </span>
                  </td>

                  {/* Resume Status Button */}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => onViewResume(cand)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-xs text-[#1D1D1F] transition-colors font-semibold cursor-pointer"
                      type="button"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>View Dossier</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => promoteCandidate(cand.id, cand.name)}
                        className="p-1.5 rounded-lg text-[#0071E3] hover:bg-[#0071E3]/10 transition-colors cursor-pointer"
                        title="Promote to Next Round"
                        type="button"
                      >
                        <ArrowRightCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectCandidate(cand.id, cand.name)}
                        className="p-1.5 rounded-lg text-[#86868B] hover:text-[#FF3B30] hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Archive candidate"
                        type="button"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-[#FBFBFC] border-t border-black/[0.06]">
          <div className="flex items-center gap-4 text-xs text-[#6E6E73]">
            <span>
              Showing <strong className="text-[#1D1D1F] font-bold">1</strong> to{' '}
              <strong className="text-[#1D1D1F] font-bold">
                {Math.min(filteredCandidates.length, 10)}
              </strong>{' '}
              of <strong className="text-[#1D1D1F] font-bold">{filteredCandidates.length}</strong>{' '}
              candidates
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#86868B]">
            <span className="w-2 h-2 rounded-full bg-[#34C759]"></span>
            <span>Synchronized with University ERP • Verified Registry</span>
          </div>
        </div>
      </div>
    </div>
  );
};
