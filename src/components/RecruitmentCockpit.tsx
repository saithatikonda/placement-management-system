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
  Award,
  Filter,
  FileCheck2,
  AlertTriangle
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
    showToast(`✓ Promoted ${name} to the next recruitment evaluation round!`);
  };

  // Candidate action: Reject candidate
  const rejectCandidate = (id: string, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    showToast(`Candidate ${name} archived from current drive shortlist.`);
  };

  // Bulk action: Mark OA Passed
  const bulkMarkOaPassed = () => {
    setCandidates((prev) =>
      prev.map((c) => (c.selected ? { ...c, driveStage: 'OA Cleared' } : c))
    );
    showToast(`✓ Marked ${selectedCount} candidates as OA Cleared!`);
  };

  // Reset Filters
  const resetFilters = () => {
    setMinCgpa(7.5);
    setBacklogFilter('zero');
    setSelectedBranches(['CSE', 'IT', 'ECE']);
    setStageFilter('All');
    setSearchQuery('');
    setGenderFilter('All');
    showToast('Filters reset to default institutional profile.');
  };

  return (
    <div className="flex flex-col w-full pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#13221C] border border-emerald-500/50 text-[#F1F5F9] px-4 py-3 rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Action Header & Drive Switcher Bar */}
      <div className="flex flex-col gap-2 pt-2 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Breadcrumb & Context Flag */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                Academic Year 2025–26
              </span>
              <span>•</span>
              <span>Campus Recruitment Division</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-[#13221C] border border-[#1D362C] text-[#F1F5F9] font-medium text-[11px]">
                Cohort A-1
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-1">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[#F1F5F9] tracking-tight leading-tight">
                Active Recruitment Drives{' '}
                <span className="text-xl font-normal text-[#94A3B8]">(2026 Batch)</span>
              </h1>

              {/* Drive Quick Switcher Pill with Warm Luminous Accent */}
              <div className="flex items-center gap-2 bg-[#13221C] border border-[#1D362C] hover:border-emerald-500/40 px-3.5 py-1.5 rounded-full shadow-sm transition-all cursor-pointer group">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold">
                  Drive:
                </span>
                <span className="font-bold text-emerald-400 text-xs">
                  {activeDrive.companyName} — {activeDrive.role.split('(')[0].trim()}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#F1F5F9] transition-transform group-hover:rotate-180" />
              </div>
            </div>

            <p className="text-xs text-[#94A3B8] mt-0.5">
              Real-time overview of current candidate pipelines, eligibility filters, and drive progress across university departments.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Export Button */}
            <button
              onClick={onExportCsv}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#13221C] hover:bg-[#182C24] text-[#F1F5F9] border border-[#1D362C] font-semibold text-xs rounded-xl shadow-sm active:scale-[0.98] transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export to Excel / CSV</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {/* ERP Batch Sync */}
            <button
              onClick={onSyncErp}
              type="button"
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#13221C] hover:bg-[#182C24] text-[#F1F5F9] border border-[#1D362C] font-semibold text-xs rounded-xl shadow-sm active:scale-[0.98] transition-all"
            >
              <RefreshCw className="w-4 h-4 text-[#94A3B8]" />
              <span>ERP Batch Sync</span>
            </button>

            {/* Primary Create Drive Button with Warm Orange Glow Accent */}
            <button
              onClick={onPostNewDrive}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>+ Post New Job Drive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric KPI Cards (4-Column Enterprise Cockpit Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* KPI Card 1: Eligible Students */}
        <div className="pms-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
                Total Eligible Students
              </span>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl font-extrabold font-mono text-[#F1F5F9] tracking-tight">
                  {kpis.totalEligible}
                </span>
                <span className="inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {kpis.yoyGrowth}
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1D362C]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#94A3B8] text-[11px]">
                Cohort Readiness ({kpis.enrolledStudents} Enrolled)
              </span>
              <span className="font-mono font-semibold text-emerald-400">
                {kpis.cohortReadinessPercent}%
              </span>
            </div>
            <div className="w-full bg-[#0B1612] rounded-full h-1.5 overflow-hidden border border-[#1D362C]/40">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${kpis.cohortReadinessPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI Card 2: Placed Students */}
        <div className="pms-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
                Placed Students
              </span>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl font-extrabold font-mono text-[#F1F5F9] tracking-tight">
                  {kpis.placedStudents}
                </span>
                <span className="text-xs font-bold text-emerald-400">
                  {kpis.placementRate}% Overall Rate
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1D362C]">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#94A3B8] text-[11px]">
                {kpis.uniquePlaced} Unique • 123 Dream
              </span>
              <span className="text-[#94A3B8] text-[11px]">Target {kpis.dreamTarget}%</span>
            </div>
            <div className="w-full bg-[#0B1612] rounded-full h-1.5 overflow-hidden relative border border-[#1D362C]/40">
              <div
                className="bg-emerald-400 h-1.5 rounded-full"
                style={{ width: `${kpis.placementRate}%` }}
              ></div>
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-[#F97316] z-10"
                style={{ left: `${kpis.dreamTarget}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* KPI Card 3: Companies Visited */}
        <div className="pms-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
                Companies Visited
              </span>
              <div className="flex items-baseline gap-2.5 mt-1.5">
                <span className="text-3xl font-extrabold font-mono text-[#F1F5F9] tracking-tight">
                  {kpis.companiesVisited}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {kpis.onSiteToday} On-Site Today
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1D362C] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] text-[11px]">{kpis.tier1Day1s} Tier-1 Day 1s</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 text-xs">
              <Clock className="w-3.5 h-3.5" /> {kpis.inProgressDrives} In Progress
            </span>
          </div>
        </div>

        {/* KPI Card 4: CTC Compensation Metrics with Warm Luminous Orange Accent */}
        <div className="pms-card rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden border border-[#F97316]/30 shadow-[0_12px_32px_rgba(249,115,22,0.1)]">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-[#FB923C] font-bold">
                CTC Compensation Metrics
              </span>
              <div className="flex items-baseline gap-4 mt-1.5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] font-medium">Highest</span>
                  <span className="text-2xl font-black font-mono text-[#F97316] drop-shadow-[0_0_12px_rgba(249,115,22,0.3)]">
                    {kpis.highestCtc.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-[#94A3B8]">LPA</span>
                  </span>
                </div>
                <div className="w-px h-8 bg-[#1D362C]"></div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#94A3B8] font-medium">Average</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {kpis.averageCtc.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-[#94A3B8]">LPA</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] shrink-0">
              <Coins className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1D362C] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8] text-[11px]">
              Median: {kpis.medianCtc} LPA • Top 10%: {kpis.top10Ctc} LPA
            </span>
            <span className="px-2 py-0.5 rounded bg-[#F97316]/15 border border-[#F97316]/30 text-[#FB923C] font-bold text-[10px] uppercase tracking-wide">
              Super Dream: {kpis.superDreamCount}
            </span>
          </div>
        </div>
      </div>

      {/* Automated Candidate Filtering Engine Container */}
      <div className="pms-card rounded-2xl p-5 mb-5 flex flex-col gap-4 border border-[#1D362C]">
        {/* Filter Bar Header & Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1D362C]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-[#F1F5F9]">
              Active Candidate Filter Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              Showing {filteredCandidates.length} of {candidates.length} Registered Candidates
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={resetFilters}
              className="text-[#94A3B8] hover:text-[#F1F5F9] transition-colors flex items-center gap-1.5 font-medium"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
            <button
              onClick={() => showToast('Preset rule saved to University Placement Engine!')}
              className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 font-bold"
              type="button"
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Save as Preset Rule</span>
            </button>
          </div>
        </div>

        {/* Filter Form Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-end">
          {/* 1. CGPA Slider & Indicator */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
                Min Cumulative CGPA
              </label>
              <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-xs">
                ≥ {minCgpa.toFixed(2)} / 10.0
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <input
                className="w-full accent-emerald-500 h-1.5 bg-[#0B1612] rounded cursor-pointer"
                max="9.5"
                min="6.0"
                step="0.25"
                type="range"
                value={minCgpa}
                onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
              />
              <span className="text-xs font-mono text-[#94A3B8] font-medium w-8">
                {minCgpa.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-[#94A3B8]/80 font-mono">
              <span>6.0</span>
              <span>7.0</span>
              <span className="text-emerald-400 font-bold">7.5</span>
              <span>8.5</span>
              <span>10.0</span>
            </div>
          </div>

          {/* 2. Backlog Status Pills */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
              Backlog Eligibility
            </label>
            <div className="flex items-center gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => setBacklogFilter('zero')}
                className={`flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  backlogFilter === 'zero'
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>0 Active</span>
              </button>
              <button
                type="button"
                onClick={() => setBacklogFilter('history')}
                className={`flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  backlogFilter === 'history'
                    ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                    : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
                }`}
              >
                History Cleared
              </button>
            </div>
          </div>

          {/* 3. Branch Multi-select Dropdown / Pills */}
          <div className="lg:col-span-3 flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
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
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
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
            <label className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold">
              Gender Quota View
            </label>
            <div className="flex items-center gap-1 mt-1">
              {(['All', 'Female', 'Male'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderFilter(g)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    genderFilter === g
                      ? 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                      : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
                  }`}
                >
                  {g === 'All' ? 'All (68 F / 74 M)' : g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Round / Pipeline Phase Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1D362C]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mr-1">
              Stage Filter:
            </span>
            {[
              { id: 'All', label: `All Qualified (${candidates.length})` },
              { id: 'OA Cleared', label: 'OA Cleared (88)' },
              { id: 'Tech Interview', label: 'Tech Interview (42)' },
              { id: 'HR Round', label: 'HR Round (12)' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStageFilter(st.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                  stageFilter === st.id
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
                }`}
                type="button"
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                className="pl-7 pr-3 py-1.5 bg-[#0B1612] border border-[#1D362C] focus:border-emerald-500/40 rounded-lg text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] outline-none w-64 transition-all"
                placeholder="Filter candidate name or roll..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bulk Shortlist Action Banner with High Contrast Dark Theme */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 px-5 bg-[#182C24] border border-[#1D362C] text-[#F1F5F9] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.6)] mb-4">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              checked={isAllSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              type="checkbox"
            />
            <span className="font-bold text-xs text-[#F1F5F9]">
              {selectedCount} Candidates Selected (Active Filter)
            </span>
          </label>

          <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-[#1D362C]">
            <button
              onClick={bulkMarkOaPassed}
              className="px-2.5 py-1 rounded bg-[#0B1612] hover:bg-[#13221C] border border-[#1D362C] text-[11px] font-semibold text-emerald-300 transition-colors"
              type="button"
            >
              Mark OA Passed
            </button>
            <button
              onClick={() => showToast(`Sent interview slot invites to ${selectedCount} candidates!`)}
              className="px-2.5 py-1 rounded bg-[#0B1612] hover:bg-[#13221C] border border-[#1D362C] text-[11px] font-semibold text-[#94A3B8] hover:text-[#F1F5F9] transition-colors"
              type="button"
            >
              Send Slot Invite
            </button>
            <button
              onClick={() => showToast(`Checked candidate placement caps. All within quota.`)}
              className="px-2.5 py-1 rounded bg-[#0B1612] hover:bg-rose-950/40 border border-rose-900/40 text-[11px] font-semibold text-rose-400 transition-colors"
              type="button"
            >
              Exclude Quota Exceeded
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onEmailRoster}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#0B1612] hover:bg-[#13221C] border border-[#1D362C] text-[#F1F5F9] rounded-lg text-xs font-semibold transition-colors"
            type="button"
          >
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            <span>Email Roster to HR</span>
          </button>
          <button
            onClick={() => onGenerateFormalShortlist(selectedCount)}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-xs font-bold shadow-[0_0_16px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all"
            type="button"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Generate Formal Shortlist ({selectedCount})</span>
          </button>
        </div>
      </div>

      {/* High-Density Data Table Card with Spring Boot Placeholder Container ID */}
      <div
        id="candidateTableContainer"
        className="pms-card rounded-2xl overflow-hidden flex flex-col border border-[#1D362C]"
      >
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1612] h-10 text-[#94A3B8] text-[11px] uppercase tracking-wider border-b border-[#1D362C]">
                <th className="w-10 px-4 text-center">
                  <input
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                    type="checkbox"
                  />
                </th>
                <th className="px-4 py-1.5 font-bold">Student Name & Institutional Email</th>
                <th className="px-4 py-1.5 font-bold">Roll No</th>
                <th className="px-4 py-1.5 font-bold">Branch & Sec</th>
                <th className="px-4 py-1.5 font-bold">CGPA</th>
                <th className="px-4 py-1.5 font-bold">Backlogs</th>
                <th className="px-4 py-1.5 font-bold">Drive Stage</th>
                <th className="px-4 py-1.5 font-bold">Resume Status</th>
                <th className="px-4 py-1.5 font-bold text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D362C]/70 text-xs text-[#F1F5F9]">
              {filteredCandidates.map((cand) => (
                <tr
                  key={cand.id}
                  data-student-id={cand.rollNo}
                  data-stage={cand.driveStage}
                  className={`h-13 hover:bg-[#182C24]/70 transition-colors group ${
                    cand.selected ? 'bg-emerald-950/20' : ''
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="px-4 text-center">
                    <input
                      checked={cand.selected}
                      onChange={() => toggleCandidateSelect(cand.id)}
                      className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                      type="checkbox"
                    />
                  </td>

                  {/* Student Name & Email */}
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${cand.avatarColor}`}
                      >
                        {cand.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#F1F5F9] truncate group-hover:text-emerald-300 transition-colors">
                          {cand.name}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] truncate">
                          {cand.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="px-4 py-2 font-mono font-medium text-[#F1F5F9]">
                    {cand.rollNo}
                  </td>

                  {/* Branch & Sec */}
                  <td className="px-4 py-2">
                    <span className="inline-flex px-2 py-0.5 rounded bg-[#0B1612] border border-[#1D362C] font-mono text-xs text-[#F1F5F9] font-bold">
                      {cand.branch} ({cand.section})
                    </span>
                  </td>

                  {/* CGPA with Emerald or Orange Highlight */}
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono text-xs font-bold ${
                        cand.cgpa >= 9.0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                          : cand.cgpa >= 8.0
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {cand.cgpa.toFixed(2)}
                    </span>
                  </td>

                  {/* Backlogs */}
                  <td className="px-4 py-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-[#0B1612] border border-[#1D362C] text-[#94A3B8] font-medium">
                      {cand.backlogs} Active
                    </span>
                  </td>

                  {/* Drive Stage Badge */}
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cand.driveStage === 'Offered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : cand.driveStage.includes('Tech')
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : cand.driveStage === 'HR Interview'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : cand.driveStage === 'OA Cleared'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
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
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B1612] border border-[#1D362C] hover:border-emerald-500/40 text-xs text-[#F1F5F9] hover:text-emerald-300 transition-colors font-semibold"
                      type="button"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Verified PDF</span>
                    </button>
                  </td>

                  {/* Actions: Promote, Reject, More */}
                  <td className="px-4 py-2 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => promoteCandidate(cand.id, cand.name)}
                        className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        title="Promote to Next Stage"
                        type="button"
                      >
                        <ArrowRightCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectCandidate(cand.id, cand.name)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Archive candidate"
                        type="button"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => showToast(`Candidate details for ${cand.name} loaded.`)}
                        className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1D362C] transition-colors"
                        type="button"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination & Sync Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5 bg-[#0B1612] border-t border-[#1D362C]">
          <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
            <span>
              Showing <strong className="text-[#F1F5F9] font-bold">1</strong> to{' '}
              <strong className="text-[#F1F5F9] font-bold">
                {Math.min(filteredCandidates.length, 7)}
              </strong>{' '}
              of <strong className="text-[#F1F5F9] font-bold">{filteredCandidates.length}</strong>{' '}
              candidate profiles
            </span>
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select className="bg-[#13221C] border border-[#1D362C] text-xs rounded px-2 py-0.5 text-[#F1F5F9] outline-none cursor-pointer">
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled
              className="px-3 py-1 rounded bg-[#13221C] border border-[#1D362C] text-[#94A3B8] text-xs disabled:opacity-40 font-medium cursor-not-allowed"
              type="button"
            >
              Previous
            </button>
            <button
              className="px-3 py-1 rounded bg-emerald-600 text-white text-xs font-bold shadow-sm"
              type="button"
            >
              1
            </button>
            <button
              className="px-3 py-1 rounded bg-[#13221C] border border-[#1D362C] text-[#F1F5F9] text-xs hover:bg-[#182C24] font-medium"
              type="button"
            >
              2
            </button>
            <button
              className="px-3 py-1 rounded bg-[#13221C] border border-[#1D362C] text-[#F1F5F9] text-xs hover:bg-[#182C24] font-medium"
              type="button"
            >
              3
            </button>
            <span className="px-1 text-[#94A3B8] text-xs">...</span>
            <button
              className="px-3 py-1 rounded bg-[#13221C] border border-[#1D362C] text-[#F1F5F9] text-xs hover:bg-[#182C24] font-medium"
              type="button"
            >
              Next
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Last synced with University ERP database 3 mins ago • Auto-validation active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
