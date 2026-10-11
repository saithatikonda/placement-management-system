import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  GraduationCap, 
  Filter, 
  ShieldCheck, 
  BarChart3, 
  LogOut, 
  Briefcase,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: 'tpo' | 'student';
  setActiveRole: (role: 'tpo' | 'student') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'drives', label: 'Company Drives', icon: Building2 },
    { id: 'students', label: 'Student Master Data', icon: GraduationCap },
    { id: 'shortlist', label: 'Shortlist Engine', icon: Filter },
    { id: 'policy', label: 'Policy & Quotas', icon: ShieldCheck },
    { id: 'analytics', label: 'Analytics Reports', icon: BarChart3 },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0B1612] border-r border-[#1D362C] z-50 flex flex-col justify-between shadow-[0_12px_32px_-4px_rgba(0,0,0,0.8)] select-none">
      <div className="flex flex-col">
        {/* Brand & Portal Identification */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-[#1D362C]">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-[#F1F5F9] tracking-tight truncate leading-tight">
              Placement Command
            </span>
            <span className="text-[11px] font-medium text-emerald-400/80 tracking-wider truncate uppercase">
              Univ. TPO Portal
            </span>
          </div>
        </div>

        {/* Perspective Switcher (TPO vs Student) */}
        <div className="px-3 pt-3">
          <div className="p-1 bg-[#13221C] border border-[#1D362C] rounded-lg flex items-center gap-1">
            <button
              onClick={() => setActiveRole('tpo')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-semibold transition-all ${
                activeRole === 'tpo'
                  ? 'bg-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.35)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182C24]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>TPO Officer</span>
            </button>
            <button
              onClick={() => setActiveRole('student')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded text-xs font-semibold transition-all ${
                activeRole === 'student'
                  ? 'bg-[#F97316] text-white shadow-[0_2px_8px_rgba(249,115,22,0.35)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182C24]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <div className="px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-[#94A3B8]/70 font-semibold">
            Operations Engine
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_14px_rgba(16,185,129,0.15)] font-semibold'
                    : 'text-[#94A3B8] hover:bg-[#13221C] hover:text-[#F1F5F9]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-[#94A3B8] group-hover:text-[#F1F5F9]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'drives' && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                    8 Live
                  </span>
                )}
                {item.id === 'shortlist' && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                    142
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer Badge */}
      <div className="p-3 m-3 bg-[#13221C] border border-[#1D362C] rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-bold text-emerald-300">
                {activeRole === 'tpo' ? 'AS' : 'AP'}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#13221C]"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-[#F1F5F9] truncate leading-tight">
                {activeRole === 'tpo' ? 'Dr. Arjun Sharma' : 'Aarav Patel'}
              </span>
              <span className="text-[10px] text-[#94A3B8] truncate leading-tight">
                {activeRole === 'tpo' ? 'Head Corporate Relations' : '22CS104 (CSE - A)'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveRole(activeRole === 'tpo' ? 'student' : 'tpo')}
            title="Toggle user session"
            className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1D362C] rounded-lg transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
