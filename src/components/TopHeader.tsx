import React, { useState } from 'react';
import { Search, Bell, ChevronDown, CheckCircle2, Clock, Sparkles } from 'lucide-react';

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
    <header className="fixed top-0 left-64 right-0 h-16 bg-white/85 backdrop-blur-xl border-b border-black/[0.06] z-40 flex items-center justify-between px-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {/* Left Search & Cohort Context */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 bg-[#FBFBFC] border border-black/[0.08] hover:border-[#0071E3]/40 rounded-xl text-xs text-[#6E6E73] hover:text-[#1D1D1F] transition-all group w-72 text-left cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
          <span className="truncate">Search cohort, roll no, drive ID...</span>
          <kbd className="ml-auto font-mono text-[10px] bg-white border border-black/[0.1] px-1.5 py-0.2 rounded text-[#86868B]">
            ⌘K
          </kbd>
        </button>

        <span className="text-[11px] font-semibold text-[#0071E3] bg-[#0071E3]/10 px-2.5 py-1 rounded-full tracking-wide">
          AY 2025–26 Batch
        </span>

        {/* Quick Drive Switcher Dropdown in Header */}
        <div className="relative hidden xl:block">
          <button
            onClick={() => setShowDriveDropdown(!showDriveDropdown)}
            className="flex items-center gap-2 bg-[#FBFBFC] border border-black/[0.08] hover:border-[#0071E3]/40 px-3 py-1 rounded-full text-xs transition-colors cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"></span>
            <span className="text-[#86868B] font-semibold text-[11px] uppercase tracking-wider">Drive:</span>
            <span className="text-[#1D1D1F] font-semibold text-xs max-w-[200px] truncate">
              {selectedDriveTitle}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#86868B]" />
          </button>

          {showDriveDropdown && (
            <div className="absolute left-0 mt-2 w-72 apple-card shadow-[0_12px_32px_rgba(0,0,0,0.12)] py-1.5 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#86868B] uppercase tracking-wider border-b border-black/[0.06]">
                Switch Active Recruitment Drive
              </div>
              {drivesList.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    onDriveSwitch(d.id);
                    setShowDriveDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#1D1D1F] hover:bg-[#0071E3]/10 hover:text-[#0071E3] transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{d.title}</span>
                  {d.title === selectedDriveTitle && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3] shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Action & Notifications */}
      <div className="flex items-center gap-3">
        {/* Notification Pill */}
        <button
          onClick={() => setShowNotificationModal(!showNotificationModal)}
          className="relative flex items-center gap-2 px-3 py-1.5 bg-[#FBFBFC] border border-black/[0.08] hover:border-[#0071E3]/40 text-[#1D1D1F] rounded-full transition-all group cursor-pointer"
        >
          <Bell className="w-3.5 h-3.5 text-[#0071E3]" />
          <span className="text-xs font-semibold text-[#1D1D1F]">4 Drives Today</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071E3]"></span>
        </button>

        {showNotificationModal && (
          <div className="absolute right-6 top-16 w-80 apple-card shadow-[0_16px_36px_rgba(0,0,0,0.14)] p-3 z-50">
            <div className="flex items-center justify-between pb-2 border-b border-black/[0.06] mb-2">
              <span className="text-xs font-bold text-[#1D1D1F]">Today's Recruitment Schedule</span>
              <span className="text-[10px] text-[#34C759] font-semibold">Live Sync</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#FBFBFC] border border-black/[0.06] rounded-xl flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1D1D1F]">Microsoft IDC — Technical Round 2</div>
                  <div className="text-[11px] text-[#6E6E73]">10:00 AM • Lab 4 & Hybrid Teams • 42 Candidates</div>
                </div>
              </div>
              <div className="p-2.5 bg-[#FBFBFC] border border-black/[0.06] rounded-xl flex items-start gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#0071E3] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1D1D1F]">Google India — OA Slot Confirmation</div>
                  <div className="text-[11px] text-[#6E6E73]">02:00 PM • HackerEarth Link Dispatched</div>
                </div>
              </div>
              <div className="p-2.5 bg-[#FBFBFC] border border-black/[0.06] rounded-xl flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#1D1D1F]">Goldman Sachs — Roster Approval</div>
                  <div className="text-[11px] text-[#6E6E73]">Shortlist of 142 candidates synchronized</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Identity Chip */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-black/[0.06]">
          <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center text-xs font-bold">
            {activeRole === 'tpo' ? 'TPO' : 'STU'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#1D1D1F] leading-tight">
              {activeRole === 'tpo' ? 'TPO Directorate' : 'Student Portal'}
            </span>
            <span className="text-[10px] text-[#34C759] font-medium leading-tight">
              {activeRole === 'tpo' ? 'Administrative Access' : 'Verified Student'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
