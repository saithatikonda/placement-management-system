import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Key, 
  ArrowRight, 
  Sun, 
  Moon 
} from 'lucide-react';

export type UserRole = 'student' | 'recruiter' | 'tpo';

interface AuthLoginViewProps {
  onLogin: (role: UserRole, credentials: any) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const AuthLoginView: React.FC<AuthLoginViewProps> = ({ 
  onLogin, 
  isDarkMode = false, 
  onToggleTheme 
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [studentPassword, setStudentPassword] = useState('');

  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [recruiterPassword, setRecruiterPassword] = useState('');

  const [tpoKey, setTpoKey] = useState('');
  const [tpoOfficerId, setTpoOfficerId] = useState('');

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onLogin(activeRole, {
        role: activeRole,
        identifier: activeRole === 'student' ? (studentIdentifier || 'STU-2026') : activeRole === 'recruiter' ? (recruiterEmail || 'recruiter@company.com') : (tpoOfficerId || 'TPO-DIR-001'),
      });
    }, 450);
  };

  // 1-Click Demo Logins
  const handleQuickDemo = (role: UserRole) => {
    setActiveRole(role);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const demoIdentifier = role === 'student' ? '22CS104' : role === 'recruiter' ? 'recruiter.campus@microsoft.com' : 'TPO-DIR-001';
      onLogin(role, {
        role,
        identifier: demoIdentifier,
        isDemo: true,
      });
    }, 350);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#141E30] text-[#1D1D1F] dark:text-[#F0F4FF] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden transition-colors duration-200">
      {/* Top Bar with Optional Theme Toggle */}
      {onToggleTheme && (
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-[#1D1D1F] dark:text-[#F8FAFC] border border-black/[0.08] dark:border-white/[0.08] shadow-xs cursor-pointer transition-all"
            title="Toggle Apple Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            <span className="font-medium">{isDarkMode ? 'Dark Mode' : 'Apple Light'}</span>
          </button>
        </div>
      )}

      {/* Subtle Apple-style diffuse backdrop lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#0071E3]/8 dark:from-[#0071E3]/15 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Lockup */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0071E3] text-white shadow-[0_8px_20px_rgba(0,113,227,0.25)] mb-3 transition-transform hover:scale-105 duration-200">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
            Placement Command
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-1 font-medium">
            College Placement Management System • Sign In (Step 1)
          </p>
        </div>

        {/* Central Apple Card */}
        <div className="apple-card p-7 sm:p-8 relative overflow-hidden bg-white dark:bg-[#1C2D4A] border border-black/[0.06] dark:border-white/[0.12] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-2xl">
          {/* Apple Segmented Control */}
          <div className="bg-black/[0.05] dark:bg-white/[0.06] border border-black/[0.05] dark:border-white/[0.08] p-1 rounded-full flex items-center mb-6">
            <button
              type="button"
              onClick={() => setActiveRole('student')}
              className={`flex-1 py-1.5 px-3 text-center text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'student'
                  ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('recruiter')}
              className={`flex-1 py-1.5 px-3 text-center text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'recruiter'
                  ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('tpo')}
              className={`flex-1 py-1.5 px-3 text-center text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRole === 'tpo'
                  ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TPO Admin</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Role Form */}
            {activeRole === 'student' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                    Roll Number or University Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(e.target.value)}
                      placeholder="e.g. 22CS104 or student@univ.edu.in"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.1] dark:border-white/[0.15] focus:bg-white dark:focus:bg-[#1A2D4A] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#A1A1A6] dark:placeholder:text-[#8BA3C7]"
                    />
                    <User className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                    Account Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.1] dark:border-white/[0.1] focus:bg-white dark:focus:bg-[#1A2D4A] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#A1A1A6] dark:placeholder:text-[#8BA3C7] font-mono"
                    />
                    <Lock className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            {/* Recruiter / Company Role Form */}
            {activeRole === 'recruiter' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      placeholder="e.g. recruiter@microsoft.com"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.1] dark:border-white/[0.15] focus:bg-white dark:focus:bg-[#1A2D4A] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#A1A1A6] dark:placeholder:text-[#8BA3C7]"
                    />
                    <Mail className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                    Registered Company ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      placeholder="e.g. MSFT-CAMPUS-2026"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.1] dark:border-white/[0.1] focus:bg-white dark:focus:bg-[#1A2D4A] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#A1A1A6] dark:placeholder:text-[#8BA3C7] font-mono"
                    />
                    <Building2 className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                    Portal Access Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={recruiterPassword}
                      onChange={(e) => setRecruiterPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.1] dark:border-white/[0.1] focus:bg-white dark:focus:bg-[#1A2D4A] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#A1A1A6] dark:placeholder:text-[#8BA3C7] font-mono"
                    />
                    <Lock className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            {/* TPO Admin Role Form */}
            {activeRole === 'tpo' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                    Officer / Director ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={tpoOfficerId}
                      onChange={(e) => setTpoOfficerId(e.target.value)}
                      placeholder="e.g. TPO-DIR-001"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.1] dark:border-white/[0.1] focus:bg-white dark:focus:bg-[#1A2D4A] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#A1A1A6] dark:placeholder:text-[#8BA3C7] font-mono"
                    />
                    <ShieldCheck className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1D1D1F] dark:text-white mb-1.5">
                    Administrative Master Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={tpoKey}
                      onChange={(e) => setTpoKey(e.target.value)}
                      placeholder="TPO-MASTER-KEY-••••"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.1] dark:border-white/[0.1] focus:bg-white dark:focus:bg-[#1A2D4A] focus:border-[#0071E3] focus:ring-4 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#A1A1A6] dark:placeholder:text-[#8BA3C7] font-mono"
                    />
                    <Key className="w-4 h-4 text-[#86868B] absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-[0_2px_8px_rgba(0,113,227,0.25)] cursor-pointer mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>
                    {activeRole === 'student' && 'Sign In to Student Portal'}
                    {activeRole === 'recruiter' && 'Access Recruiter Console'}
                    {activeRole === 'tpo' && 'Unlock TPO Cockpit'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Evaluation Profiles */}
          <div className="mt-6 pt-5 border-t border-black/[0.06] dark:border-white/[0.08]">
            <span className="block text-[11px] font-semibold text-[#86868B] dark:text-[#CBD5E1] text-center mb-2.5">
              Instant 1-Click Demo Profiles
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="w-full py-2 px-3 bg-black/[0.03] dark:bg-white/[0.03] hover:bg-[#0071E3]/10 border border-black/[0.06] dark:border-white/[0.06] hover:border-[#0071E3]/30 rounded-xl text-xs font-medium text-[#1D1D1F] dark:text-white hover:text-[#0071E3] dark:hover:text-[#38BDF8] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#34C759]/15 text-[#28A745] flex items-center justify-center font-bold text-[10px]">
                    ST
                  </span>
                  <span className="font-semibold">Student Portal Access</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="w-full py-2 px-3 bg-black/[0.03] dark:bg-white/[0.03] hover:bg-[#0071E3]/10 border border-black/[0.06] dark:border-white/[0.06] hover:border-[#0071E3]/30 rounded-xl text-xs font-medium text-[#1D1D1F] dark:text-white hover:text-[#0071E3] dark:hover:text-[#38BDF8] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#FF9500]/15 text-[#D97706] flex items-center justify-center font-bold text-[10px]">
                    RC
                  </span>
                  <span className="font-semibold">Corporate Recruiter Console</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('tpo')}
                className="w-full py-2 px-3 bg-black/[0.03] dark:bg-white/[0.03] hover:bg-[#0071E3]/10 border border-black/[0.06] dark:border-white/[0.06] hover:border-[#0071E3]/30 rounded-xl text-xs font-medium text-[#1D1D1F] dark:text-white hover:text-[#0071E3] dark:hover:text-[#38BDF8] flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-[#0071E3]/15 text-[#0071E3] flex items-center justify-center font-bold text-[10px]">
                    TP
                  </span>
                  <span className="font-semibold">TPO Admin Directorate</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#86868B] group-hover:text-[#0071E3] transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-xs text-[#86868B]">
          <span>Institutional Placement Operations • Official University Gateway</span>
        </div>
      </div>
    </div>
  );
};
