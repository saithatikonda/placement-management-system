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
    <aside className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl border-r border-black/[0.06] z-50 flex flex-col justify-between shadow-[0_4px_24px_rgba(0,0,0,0.04)] select-none">
      <div className="flex flex-col">
        {/* Brand & Portal Identification */}
        <div className="h-16 px-4 flex items-center gap-3 border-b border-black/[0.06]">
          <div className="w-9 h-9 rounded-xl bg-[#0071E3] flex items-center justify-center text-white font-bold shrink-0 shadow-[0_2px_8px_rgba(0,113,227,0.25)]">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm text-[#1D1D1F] tracking-tight truncate leading-tight">
              Placement Command
            </span>
            <span className="text-[10px] font-semibold text-[#86868B] tracking-wider truncate uppercase">
              Univ. TPO Portal
            </span>
          </div>
        </div>

        {/* Perspective Switcher (TPO vs Student) */}
        <div className="px-3 pt-3">
          <div className="p-1 bg-black/[0.05] rounded-full flex items-center gap-1">
            <button
              onClick={() => setActiveRole('tpo')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'tpo'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>TPO Officer</span>
            </button>
            <button
              onClick={() => setActiveRole('student')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Student View</span>
            </button>
          </div>
        </div>

        {/* Section Heading */}
        <div className="px-4 py-3">
          <div className="text-[11px] uppercase tracking-wider text-[#86868B] font-semibold">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-[#0071E3]/10 text-[#0071E3] font-semibold'
                    : 'text-[#6E6E73] hover:bg-black/[0.04] hover:text-[#1D1D1F]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#0071E3]' : 'text-[#86868B] group-hover:text-[#1D1D1F]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.id === 'drives' && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-mono font-semibold">
                    8 Live
                  </span>
                )}
                {item.id === 'shortlist' && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-[#34C759]/10 text-[#28A745] font-mono font-semibold">
                    142
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Session Footer Badge */}
      <div className="p-3 m-3 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center text-xs font-bold">
                {activeRole === 'tpo' ? 'TP' : 'ST'}
              </div>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#34C759] ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-[#1D1D1F] truncate leading-tight">
                {activeRole === 'tpo' ? 'TPO Administrator' : 'Student Portal'}
              </span>
              <span className="text-[10px] text-[#86868B] truncate leading-tight">
                {activeRole === 'tpo' ? 'Corporate Relations Directorate' : 'Class of 2026'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveRole(activeRole === 'tpo' ? 'student' : 'tpo')}
            title="Toggle user session"
            className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
