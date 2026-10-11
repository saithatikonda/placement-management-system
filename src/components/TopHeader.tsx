import React, { useState } from 'react';
import { Search, Bell, Sparkles, ChevronDown, CheckCircle2, Clock } from 'lucide-react';

interface TopHeaderProps {
  onOpenSearch: () => void;
  selectedDriveTitle: string;
  onDriveSwitch: (driveId: string) => void;
  activeRole: 'tpo' | 'student';
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenSearch,
  selectedDriveTitle,
  onDriveSwitch,
  activeRole,
}) => {
  const [showDriveDropdown, setShowDriveDropdown] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const drivesList = [
    { id: 'drive-msft-01', title: 'Microsoft IDC — SDE I (On-Campus)' },
    { id: 'drive-goog-02', title: 'Google India — Core Systems' },
    { id: 'drive-amzn-03', title: 'Amazon AWS — Cloud Support & Backend' },
    { id: 'drive-orcl-04', title: 'Oracle Cloud (OCI) — MTS Cloud Infra' },
    { id: 'drive-gs-05', title: 'Goldman Sachs — Global Markets Tech' },
  ];

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-[#0B1612]/90 backdrop-blur-xl border-b border-[#1D362C] z-40 flex items-center justify-between px-6">
      {/* Left Search & Cohort Context */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[#13221C] border border-[#1D362C] hover:border-emerald-500/40 rounded-lg text-xs text-[#94A3B8] hover:text-[#F1F5F9] transition-all group w-72 text-left"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="truncate">Search cohort, roll no, drive ID...</span>
          <kbd className="ml-auto font-mono text-[10px] bg-[#182C24] border border-[#1D362C] px-1.5 py-0.5 rounded text-[#94A3B8]">
            ⌘K
          </kbd>
        </button>

        <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md tracking-wide">
          AY 2025–26 Batch
        </span>

        {/* Quick Drive Switcher Dropdown in Header */}
        <div className="relative hidden xl:block">
          <button
            onClick={() => setShowDriveDropdown(!showDriveDropdown)}
            className="flex items-center gap-2 bg-[#13221C] border border-[#1D362C] hover:border-emerald-500/40 px-3 py-1 rounded-full text-xs transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[#94A3B8] font-medium text-[11px] uppercase tracking-wider">Drive:</span>
            <span className="text-[#F1F5F9] font-semibold text-xs max-w-[200px] truncate">
              {selectedDriveTitle}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
          </button>

          {showDriveDropdown && (
            <div className="absolute left-0 mt-2 w-72 bg-[#13221C] border border-[#1D362C] rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] py-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider border-b border-[#1D362C]">
                Switch Active Recruitment Drive
              </div>
              {drivesList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onDriveSwitch(d.id);
                    setShowDriveDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#F1F5F9] hover:bg-emerald-500/10 hover:text-emerald-300 transition-colors flex items-center justify-between"
                >
                  <span className="truncate">{d.title}</span>
                  {d.title === selectedDriveTitle && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Action & Notifications */}
      <div className="flex items-center gap-3">
        {/* Urgent Alert Pill with Warm Amber Glow */}
        <button
          onClick={() => setShowNotificationModal(!showNotificationModal)}
          className="relative flex items-center gap-2 px-3 py-1.5 bg-[#13221C] border border-[#F97316]/40 hover:border-[#F97316] text-[#F1F5F9] rounded-lg transition-all shadow-[0_0_16px_rgba(249,115,22,0.15)] group"
        >
          <Bell className="w-3.5 h-3.5 text-[#F97316] group-hover:scale-110 transition-transform" />
          <span className="text-xs font-semibold text-[#FB923C]">4 Drives Today</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-ping"></span>
        </button>

        {showNotificationModal && (
          <div className="absolute right-6 top-16 w-80 bg-[#13221C] border border-[#1D362C] rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] p-3 z-50">
            <div className="flex items-center justify-between pb-2 border-b border-[#1D362C] mb-2">
              <span className="text-xs font-bold text-[#F1F5F9]">Today's Recruitment Schedule</span>
              <span className="text-[10px] text-emerald-400 font-mono">Live Sync</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2 bg-[#0B1612] border border-amber-500/20 rounded-lg flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#F1F5F9]">Microsoft IDC — Technical Round 2</div>
                  <div className="text-[11px] text-[#94A3B8]">10:00 AM • Lab 4 & Hybrid Teams • 42 Candidates</div>
                </div>
              </div>
              <div className="p-2 bg-[#0B1612] border border-emerald-500/20 rounded-lg flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#F1F5F9]">Google India — OA Slot Confirmation</div>
                  <div className="text-[11px] text-[#94A3B8]">02:00 PM • HackerEarth Link Dispatched</div>
                </div>
              </div>
              <div className="p-2 bg-[#0B1612] border border-[#1D362C] rounded-lg flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#F1F5F9]">Goldman Sachs — Roster Approval</div>
                  <div className="text-[11px] text-[#94A3B8]">Shortlist of 142 candidates synchronized</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Identity Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[#1D362C]">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-300">
            {activeRole === 'tpo' ? 'TPO' : 'STU'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-[#F1F5F9] leading-tight">
              {activeRole === 'tpo' ? 'TPO Command' : 'Aarav Patel'}
            </span>
            <span className="text-[10px] text-emerald-400 leading-tight">
              {activeRole === 'tpo' ? 'Authority v4.2' : 'Eligible (9.42 CGPA)'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
