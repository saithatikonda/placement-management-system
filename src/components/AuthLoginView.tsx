import React, { useState } from 'react';
import {
  GraduationCap,
  Building2,
  ShieldCheck,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle2,
  Phone,
  BookOpen,
} from 'lucide-react';

export type UserRole = 'student' | 'recruiter' | 'tpo';

interface AuthLoginViewProps {
  onLogin: (role: UserRole, credentials: any) => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

const INPUT_CLASS =
  'w-full pl-10 pr-4 py-3 bg-[#F5F7FA] dark:bg-[#1E3050] border border-black/[0.08] dark:border-white/[0.12] focus:bg-white dark:focus:bg-[#243554] focus:border-[#0071E3] dark:focus:border-[#38BDF8] focus:ring-4 focus:ring-[#0071E3]/10 rounded-xl text-sm text-[#1D1D1F] dark:text-white outline-none transition-all placeholder:text-[#ABABAB] dark:placeholder:text-[#6A90BB]';

const LABEL_CLASS = 'block text-xs font-semibold text-[#1D1D1F] dark:text-[#D0E4FF] mb-1.5';

export const AuthLoginView: React.FC<AuthLoginViewProps> = ({
  onLogin,
  isDarkMode = false,
  onToggleTheme,
}) => {
  // Toggle between sign-in and sign-up
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [activeRole, setActiveRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ── Sign In fields ──────────────────────────
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // ── Sign Up fields ──────────────────────────
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpRollOrId, setSignUpRollOrId] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirm, setSignUpConfirm] = useState('');
  const [signUpRole, setSignUpRole] = useState<UserRole>('student');

  const switchMode = (m: 'signin' | 'signup') => {
    setError('');
    setSuccess('');
    setMode(m);
  };

  // ── Sign In submit ───────────────────────────
  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signInEmail.trim() || !signInPassword.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(activeRole, {
        role: activeRole,
        identifier: signInEmail,
        name:
          activeRole === 'student'
            ? `Student (${signInEmail.split('@')[0]})`
            : activeRole === 'recruiter'
            ? `Recruiter (${signInEmail.split('@')[0]})`
            : `TPO Admin`,
      });
    }, 500);
  };

  // ── Sign Up submit ───────────────────────────
  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (signUpPassword !== signUpConfirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Account created! Signing you in…');
      setTimeout(() => {
        onLogin(signUpRole, {
          role: signUpRole,
          identifier: signUpRollOrId || signUpEmail,
          name: signUpName,
          email: signUpEmail,
        });
      }, 800);
    }, 600);
  };

  const roles: { key: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'student', label: 'Student', icon: <User className="w-4 h-4" />, color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
    { key: 'recruiter', label: 'Recruiter', icon: <Building2 className="w-4 h-4" />, color: 'bg-orange-500/15 text-orange-600 dark:text-orange-400' },
    { key: 'tpo', label: 'TPO Admin', icon: <ShieldCheck className="w-4 h-4" />, color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF3FB] via-[#F5F5F7] to-[#E8F0FE] dark:from-[#0D1829] dark:via-[#141E30] dark:to-[#0E1F38] flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden transition-colors duration-300">

      {/* Background glow blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0071E3]/10 dark:bg-[#0071E3]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/8 dark:bg-purple-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Theme toggle */}
      {onToggleTheme && (
        <div className="absolute top-5 right-5 z-20">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 text-[#1D1D1F] dark:text-white border border-black/[0.08] dark:border-white/[0.12] shadow-sm cursor-pointer transition-all backdrop-blur-sm"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            <span>{isDarkMode ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-md relative z-10">

        {/* Logo + Brand */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0071E3] text-white shadow-[0_8px_24px_rgba(0,113,227,0.35)] mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
            Placement Command
          </h1>
          <p className="text-xs text-[#6E6E73] dark:text-[#8AAFD4] mt-1">
            College Placement Management System
          </p>
        </div>

        {/* Sign In / Sign Up Toggle */}
        <div className="flex p-1 mb-6 bg-black/[0.05] dark:bg-white/[0.07] rounded-2xl border border-black/[0.05] dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => switchMode('signin')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-md'
                : 'text-[#6E6E73] dark:text-[#8AAFD4] hover:text-[#1D1D1F] dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white dark:bg-[#0071E3] text-[#1D1D1F] dark:text-white shadow-md'
                : 'text-[#6E6E73] dark:text-[#8AAFD4] hover:text-[#1D1D1F] dark:hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-[#1A2C44] rounded-2xl border border-black/[0.07] dark:border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-7">

          {/* Error / Success banners */}
          {error && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 dark:bg-red-500/15 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
            </div>
          )}

          {/* ══════════════ SIGN IN ══════════════ */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <p className="text-base font-bold text-[#1D1D1F] dark:text-white mb-1">Welcome back 👋</p>
              <p className="text-xs text-[#6E6E73] dark:text-[#8AAFD4] mb-4">Sign in to your placement portal account</p>

              {/* Role Selector */}
              <div>
                <label className={LABEL_CLASS}>I am a</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setActiveRole(r.key)}
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        activeRole === r.key
                          ? 'bg-[#0071E3]/10 dark:bg-[#0071E3]/25 border-[#0071E3] dark:border-[#38BDF8] text-[#0071E3] dark:text-[#38BDF8]'
                          : 'bg-transparent border-black/[0.08] dark:border-white/[0.10] text-[#6E6E73] dark:text-[#8AAFD4] hover:border-[#0071E3]/40 dark:hover:border-[#38BDF8]/40'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={LABEL_CLASS}>
                  {activeRole === 'student' ? 'Roll Number / Email' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder={activeRole === 'student' ? '22CS104 or you@univ.edu.in' : 'you@company.com'}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={LABEL_CLASS + ' mb-0'}>Password</label>
                  <button type="button" className="text-[11px] text-[#0071E3] dark:text-[#38BDF8] font-semibold hover:underline cursor-pointer">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={INPUT_CLASS + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] dark:text-[#6A90BB] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,113,227,0.3)] active:scale-[0.98] cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#6E6E73] dark:text-[#8AAFD4] pt-1">
                Don't have an account?{' '}
                <button type="button" onClick={() => switchMode('signup')} className="text-[#0071E3] dark:text-[#38BDF8] font-semibold hover:underline cursor-pointer">
                  Sign Up
                </button>
              </p>
            </form>
          )}

          {/* ══════════════ SIGN UP ══════════════ */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <p className="text-base font-bold text-[#1D1D1F] dark:text-white mb-1">Create your account ✨</p>
              <p className="text-xs text-[#6E6E73] dark:text-[#8AAFD4] mb-4">Join the placement portal today</p>

              {/* Role Selector */}
              <div>
                <label className={LABEL_CLASS}>Register as</label>
                <div className="grid grid-cols-3 gap-2">
                  {roles.map((r) => (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setSignUpRole(r.key)}
                      className={`flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        signUpRole === r.key
                          ? 'bg-[#0071E3]/10 dark:bg-[#0071E3]/25 border-[#0071E3] dark:border-[#38BDF8] text-[#0071E3] dark:text-[#38BDF8]'
                          : 'bg-transparent border-black/[0.08] dark:border-white/[0.10] text-[#6E6E73] dark:text-[#8AAFD4] hover:border-[#0071E3]/40'
                      }`}
                    >
                      {r.icon}
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className={LABEL_CLASS}>Full Name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="Your full name"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={LABEL_CLASS}>Email Address <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="you@university.edu.in"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Roll No / ID - contextual */}
              <div>
                <label className={LABEL_CLASS}>
                  {signUpRole === 'student' ? 'Roll Number' : signUpRole === 'recruiter' ? 'Company ID' : 'Officer ID'}
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signUpRollOrId}
                    onChange={(e) => setSignUpRollOrId(e.target.value)}
                    placeholder={
                      signUpRole === 'student'
                        ? 'e.g. 22CS104'
                        : signUpRole === 'recruiter'
                        ? 'e.g. MSFT-CAMPUS-2026'
                        : 'e.g. TPO-DIR-001'
                    }
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className={LABEL_CLASS}>Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={LABEL_CLASS}>Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className={INPUT_CLASS + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] dark:text-[#6A90BB] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className={LABEL_CLASS}>Confirm Password <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868B] dark:text-[#6A90BB] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={signUpConfirm}
                    onChange={(e) => setSignUpConfirm(e.target.value)}
                    placeholder="Re-enter your password"
                    className={INPUT_CLASS + ' pr-10'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868B] dark:text-[#6A90BB] cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signUpConfirm && signUpPassword && (
                  <p className={`text-[11px] mt-1 font-medium ${signUpPassword === signUpConfirm ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {signUpPassword === signUpConfirm ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,113,227,0.3)] active:scale-[0.98] cursor-pointer mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-[#6E6E73] dark:text-[#8AAFD4] pt-1">
                Already have an account?{' '}
                <button type="button" onClick={() => switchMode('signin')} className="text-[#0071E3] dark:text-[#38BDF8] font-semibold hover:underline cursor-pointer">
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#A1A1A6] dark:text-[#4A6A8A] mt-5">
          Institutional Placement Operations • Official University Gateway
        </p>
      </div>
    </div>
  );
};
