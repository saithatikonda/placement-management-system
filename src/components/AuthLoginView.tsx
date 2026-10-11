import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Key, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Zap,
  Briefcase
} from 'lucide-react';

export type UserRole = 'student' | 'recruiter' | 'tpo';

interface AuthLoginViewProps {
  onLogin: (role: UserRole, credentials: any) => void;
}

export const AuthLoginView: React.FC<AuthLoginViewProps> = ({ onLogin }) => {
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [studentIdentifier, setStudentIdentifier] = useState('22CS104');
  const [studentPassword, setStudentPassword] = useState('••••••••••••');

  const [recruiterEmail, setRecruiterEmail] = useState('recruiter.campus@microsoft.com');
  const [companyId, setCompanyId] = useState('MSFT-CAMPUS-2026');
  const [recruiterPassword, setRecruiterPassword] = useState('••••••••••••');

  const [tpoKey, setTpoKey] = useState('TPO-MASTER-KEY-8840');
  const [tpoOfficerId, setTpoOfficerId] = useState('TPO-DIR-001');

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    /* 
     * Spring Boot REST API Integration Placeholder:
     * 
     * fetch('http://localhost:8080/api/v1/auth/login', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({
     *     role: activeRole,
     *     credentials: activeRole === 'student' 
     *       ? { rollNo: studentIdentifier, password: studentPassword }
     *       : activeRole === 'recruiter'
     *       ? { email: recruiterEmail, companyId, password: recruiterPassword }
     *       : { adminKey: tpoKey, officerId: tpoOfficerId }
     *   })
     * })
     * .then(res => res.json())
     * .then(data => onLogin(activeRole, data))
     * .catch(err => console.error(err));
     */

    setTimeout(() => {
      setLoading(false);
      onLogin(activeRole, {
        role: activeRole,
        identifier: activeRole === 'student' ? studentIdentifier : activeRole === 'recruiter' ? recruiterEmail : tpoOfficerId,
      });
    }, 600);
  };

  // 1-Click Demo Logins
  const handleQuickDemo = (role: UserRole) => {
    setActiveRole(role);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(role, {
        role,
        isDemo: true,
      });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#070F0C] text-[#F1F5F9] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient radial flares: warm orange backlight and deep forest glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#F97316]/10 via-[#10B981]/5 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassy Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Lockup Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#11231B] border border-emerald-500/30 shadow-[0_0_24px_rgba(16,185,129,0.25)] text-emerald-400 mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F1F5F9] tracking-tight">
            Placement Command
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 font-medium">
            Campus Placement Management System • Multi-Role Access Gateway
          </p>
        </div>

        {/* Central Glassy Card */}
        <div className="pms-card rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border border-emerald-500/20 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden">
          {/* Subtle Orange Glow Rim */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#F97316]/15 rounded-full blur-2xl pointer-events-none"></div>

          {/* Role Switcher Tabs */}
          <div className="p-1 bg-[#070F0C] border border-[#162E23] rounded-2xl flex items-center mb-6">
            <button
              type="button"
              onClick={() => setActiveRole('student')}
              className={`flex-1 py-2 px-1 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'student'
                  ? 'bg-emerald-600 text-white shadow-[0_2px_12px_rgba(16,185,129,0.35)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('recruiter')}
              className={`flex-1 py-2 px-1 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'recruiter'
                  ? 'bg-[#F97316] text-white shadow-[0_2px_12px_rgba(249,115,22,0.35)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveRole('tpo')}
              className={`flex-1 py-2 px-1 text-center text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeRole === 'tpo'
                  ? 'bg-emerald-600 text-white shadow-[0_2px_12px_rgba(16,185,129,0.35)]'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9]'
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
                  <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
                    Roll Number or University Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={studentIdentifier}
                      onChange={(e) => setStudentIdentifier(e.target.value)}
                      placeholder="e.g. 22CS104 or student@univ.edu.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#070F0C] border border-[#162E23] focus:border-emerald-500/60 rounded-xl text-xs text-[#F1F5F9] outline-none transition-all placeholder:text-[#94A3B8]/60"
                    />
                    <User className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
                    Account Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#070F0C] border border-[#162E23] focus:border-emerald-500/60 rounded-xl text-xs text-[#F1F5F9] outline-none transition-all placeholder:text-[#94A3B8]/60 font-mono"
                    />
                    <Lock className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            {/* Recruiter / Company Role Form */}
            {activeRole === 'recruiter' && (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
                    Corporate Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      placeholder="e.g. recruiter@microsoft.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#070F0C] border border-[#162E23] focus:border-[#F97316]/60 rounded-xl text-xs text-[#F1F5F9] outline-none transition-all placeholder:text-[#94A3B8]/60"
                    />
                    <Mail className="w-4 h-4 text-[#F97316] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
                    Registered Company ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={companyId}
                      onChange={(e) => setCompanyId(e.target.value)}
                      placeholder="e.g. MSFT-CAMPUS-2026"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#070F0C] border border-[#162E23] focus:border-[#F97316]/60 rounded-xl text-xs text-[#F1F5F9] outline-none transition-all placeholder:text-[#94A3B8]/60 font-mono"
                    />
                    <Building2 className="w-4 h-4 text-[#F97316] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
                    Portal Access Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={recruiterPassword}
                      onChange={(e) => setRecruiterPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#070F0C] border border-[#162E23] focus:border-[#F97316]/60 rounded-xl text-xs text-[#F1F5F9] outline-none transition-all placeholder:text-[#94A3B8]/60 font-mono"
                    />
                    <Lock className="w-4 h-4 text-[#F97316] absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            {/* TPO Admin Role Form */}
            {activeRole === 'tpo' && (
              <>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
                    Officer / Director ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={tpoOfficerId}
                      onChange={(e) => setTpoOfficerId(e.target.value)}
                      placeholder="e.g. TPO-DIR-001"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#070F0C] border border-[#162E23] focus:border-emerald-500/60 rounded-xl text-xs text-[#F1F5F9] outline-none transition-all placeholder:text-[#94A3B8]/60 font-mono"
                    />
                    <ShieldCheck className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
                    Administrative Cryptographic Master Key
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={tpoKey}
                      onChange={(e) => setTpoKey(e.target.value)}
                      placeholder="TPO-MASTER-KEY-••••"
                      className="w-full pl-9 pr-3 py-2.5 bg-[#070F0C] border border-[#162E23] focus:border-emerald-500/60 rounded-xl text-xs text-[#F1F5F9] outline-none transition-all placeholder:text-[#94A3B8]/60 font-mono"
                    />
                    <Key className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button with Warm Glow */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${
                activeRole === 'recruiter'
                  ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.35)]'
              }`}
            >
              {loading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>
                    {activeRole === 'student' && 'Enter Student Portal'}
                    {activeRole === 'recruiter' && 'Access Recruiter Console'}
                    {activeRole === 'tpo' && 'Unlock TPO Administration'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Section */}
          <div className="mt-6 pt-5 border-t border-[#162E23]">
            <span className="block text-[10px] uppercase tracking-wider text-[#94A3B8] font-bold text-center mb-2.5">
              Instant 1-Click Demo Evaluation Profiles
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="w-full py-2 px-3 bg-[#070F0C] hover:bg-[#162E23] border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-300 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student: Aarav Patel (CSE, 8.42 CGPA)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('recruiter')}
                className="w-full py-2 px-3 bg-[#070F0C] hover:bg-[#162E23] border border-[#F97316]/30 rounded-xl text-xs font-semibold text-[#FB923C] flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>Recruiter: Microsoft IDC Campus Team</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('tpo')}
                className="w-full py-2 px-3 bg-[#070F0C] hover:bg-[#162E23] border border-emerald-500/30 rounded-xl text-xs font-semibold text-emerald-300 flex items-center justify-between transition-all group"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>TPO Admin: Dr. Arjun Sharma (Director)</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6 text-[11px] text-[#94A3B8]">
          <span>Protected by Institutional Spring Boot Security Gateway • SSL 256-bit</span>
        </div>
      </div>
    </div>
  );
};
