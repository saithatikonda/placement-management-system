import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  FileCheck2, 
  TrendingUp, 
  ExternalLink,
  ShieldCheck,
  Upload,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Building2,
  Calendar,
  Check,
  RotateCcw,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  PhoneOff,
  Download,
  Key,
  Mail,
  User,
  Bell,
  Code2,
  Play,
  Briefcase,
  Target,
  ArrowRight
} from 'lucide-react';
import { StudentProfile, JobDrive } from '../types/pms';

interface StudentDashboardViewProps {
  student: StudentProfile;
  setStudent: React.Dispatch<React.SetStateAction<StudentProfile>>;
  drives: JobDrive[];
  onApplyJob: (drive: JobDrive) => void;
  onViewResume: (student: StudentProfile) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  student,
  setStudent,
  drives,
  onApplyJob,
  onViewResume,
}) => {
  // Active Student Tab: 'resume' | 'analysis' | 'drives' | 'offers' | 'meetings' | 'settings'
  const [activeTab, setActiveTab] = useState<'resume' | 'analysis' | 'drives' | 'offers' | 'meetings' | 'settings'>('drives');

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);
  const [simulatedCgpa, setSimulatedCgpa] = useState<number>(student.cgpa || 9.42);

  // Dream Job & Resume Analyzer States
  const [targetDreamJob, setTargetDreamJob] = useState('Senior Cloud & Distributed Systems Engineer');
  const [targetDreamCtc, setTargetDreamCtc] = useState(32);
  const [uploadedFileName, setUploadedFileName] = useState(student.resumeUrl || 'Official_Resume_2026.pdf');
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(true);

  // Offer Letter States
  const [offerStatuses, setOfferStatuses] = useState<Record<string, 'pending' | 'accepted'>>({
    'Amazon AWS': 'pending',
    'Oracle Cloud': 'pending',
  });
  const [previewOffer, setPreviewOffer] = useState<{
    company: string;
    role: string;
    ctc: string;
    base: string;
    bonus: string;
    rsu: string;
    deadline: string;
    accepted: boolean;
  } | null>(null);

  // Video Meeting Room Modal State
  const [activeMeeting, setActiveMeeting] = useState<{
    title: string;
    company: string;
    interviewer: string;
    roomCode: string;
    time: string;
  } | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [codeSnippet, setCodeSnippet] = useState(
`// Candidate Live Coding Solution
// Problem: Design an LRU Cache with O(1) operations

class LRUCache {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
    }

    get(key) {
        if (!this.cache.has(key)) return -1;
        const val = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, val); // Refresh order
        return val;
    }

    put(key, value) {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }
        this.cache.set(key, value);
    }
}`
  );
  const [codeExecutionResult, setCodeExecutionResult] = useState<string | null>(null);

  // Student Settings States
  const [settingsDreamCtc, setSettingsDreamCtc] = useState<number>(30);
  const [settingsDomains, setSettingsDomains] = useState<string[]>([
    'Cloud Architecture & Distributed Systems',
    'Generative AI & Machine Learning',
    'Full-Stack Systems'
  ]);
  const [settingsNotifications, setSettingsNotifications] = useState({
    sms: true,
    whatsapp: true,
    email: true,
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Resume Upload Handler
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingResume(true);
      setUploadedFileName(file.name);
      setTimeout(() => {
        setIsUploadingResume(false);
        setResumeUploadSuccess(true);
        setStudent((prev) => ({
          ...prev,
          resumeUrl: file.name,
          resumeStatus: 'Verified PDF',
        }));
        setTimeout(() => setResumeUploadSuccess(false), 3500);
      }, 900);
    }
  };

  // Trigger AI Analysis and navigate to analysis tab
  const handleTriggerAiAnalysis = () => {
    setIsAnalyzingAi(true);
    setTimeout(() => {
      setIsAnalyzingAi(false);
      setAiAnalysisComplete(true);
      setActiveTab('analysis');
    }, 1200);
  };

  const filteredDrives = drives.filter((d) => {
    if (selectedCategory === 'All') return true;
    return d.category === selectedCategory;
  });

  const primaryAppliedDrive = drives.find((d) => d.hasApplied) || drives[0] || null;

  const pipelineSteps = [
    { id: 1, name: 'Applied', status: primaryAppliedDrive ? 'completed' : 'upcoming', desc: primaryAppliedDrive ? 'Dossier Received' : 'Not Applied' },
    { id: 2, name: 'OA Shortlisted', status: primaryAppliedDrive ? 'completed' : 'upcoming', desc: 'Eligibility Match' },
    { id: 3, name: 'Tech Round 1', status: primaryAppliedDrive ? 'completed' : 'upcoming', desc: 'Technical Evaluation' },
    { id: 4, name: 'Tech Round 2', status: primaryAppliedDrive ? 'current' : 'upcoming', desc: 'Advanced Architecture' },
    { id: 5, name: 'HR & Final Offer', status: 'upcoming', desc: 'Final Verification' },
  ];

  const offerList = [
    {
      id: 'amz-offer-01',
      company: 'Amazon AWS',
      role: 'Software Development Engineer - I (SDE 1)',
      category: 'Super Dream',
      ctc: '₹32.0 LPA',
      base: '₹18,50,000',
      bonus: '₹5,50,000 (1st Year Joining)',
      rsu: '₹8,00,000 (Vesting Over 4 Yrs)',
      location: 'Hyderabad / Bangalore',
      deadline: '48 Hours Remaining',
      logo: 'AMZ',
      accepted: offerStatuses['Amazon AWS'] === 'accepted',
    },
    {
      id: 'oracle-offer-02',
      company: 'Oracle Cloud',
      role: 'Member of Technical Staff (MTS Cloud)',
      category: 'Dream',
      ctc: '₹18.0 LPA',
      base: '₹14,00,000',
      bonus: '₹2,00,000 Sign-on',
      rsu: '₹2,00,000 Stock Grant',
      location: 'Bangalore IDC',
      deadline: '5 Days Remaining',
      logo: 'ORCL',
      accepted: offerStatuses['Oracle Cloud'] === 'accepted',
    },
  ];

  const meetingList = [
    {
      id: 'meet-amz-01',
      title: 'Amazon AWS — Bar Raiser Technical Round',
      company: 'Amazon AWS',
      round: 'Final Interview Panel',
      time: 'Today • 04:00 PM – 05:30 PM IST',
      interviewer: 'Arun K. (Principal Engineer & AWS Bar Raiser)',
      roomCode: 'AMZ-BAR-992',
      format: 'Video Conference + Live Shared Algorithmic Scratchpad',
      badge: 'URGENT TODAY',
      isLiveNow: true,
    },
    {
      id: 'meet-cisco-02',
      title: 'Cisco Systems — Technical Architecture Round 2',
      company: 'Cisco Systems',
      round: 'Round 2 Virtual',
      time: 'Tomorrow • 11:30 AM – 12:45 PM IST',
      interviewer: 'Sarah Jenkins (Lead Systems Architect, Core Routing)',
      roomCode: 'CSCO-SYS-412',
      format: 'Google Meet Virtual Board',
      badge: 'TOMORROW',
      isLiveNow: false,
    },
    {
      id: 'meet-tpo-03',
      title: 'College TPO Office — 1-on-1 Pre-Placement Advisory',
      company: 'University TPO Directorate',
      round: 'Institutional Advisory',
      time: 'Oct 15, 2026 • 02:00 PM – 02:30 PM IST',
      interviewer: 'Prof. Ramesh Rao (Head of Training & Placements)',
      roomCode: 'TPO-ADVISORY-101',
      format: 'Career Directorate Consultation',
      badge: 'ADVISORY',
      isLiveNow: false,
    },
  ];

  const handleAcceptOffer = (companyName: string) => {
    setOfferStatuses((prev) => ({ ...prev, [companyName]: 'accepted' }));
    if (previewOffer && previewOffer.company === companyName) {
      setPreviewOffer({ ...previewOffer, accepted: true });
    }
  };

  const handleDownloadOfferPdf = (companyName: string, role: string) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Official Placement Offer Letter - ${companyName}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #1D1D1F; line-height: 1.6; }
              .header { border-bottom: 2px solid #0071E3; padding-bottom: 15px; margin-bottom: 25px; }
              .title { font-size: 24px; font-weight: bold; color: #0071E3; margin: 0; }
              .subtitle { font-size: 13px; color: #6E6E73; }
              .table { width: 100%; border-collapse: collapse; margin: 25px 0; }
              .table th, .table td { border: 1px solid #E5E5EA; padding: 12px; text-align: left; }
              .table th { background: #F5F5F7; }
              .badge { display: inline-block; padding: 4px 10px; background: #e6f4ea; color: #137333; font-weight: bold; border-radius: 6px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">${companyName} — LETTER OF EMPLOYMENT OFFER</h1>
              <p class="subtitle">Campus Recruitment Class of 2026 • Ref: PLACEMENT-CONTRACT-2026-${Date.now().toString().slice(-6)}</p>
            </div>
            <p><strong>Candidate Name:</strong> ${student.name}</p>
            <p><strong>Roll Number:</strong> ${student.rollNo}</p>
            <p><strong>Academic Department:</strong> B.Tech ${student.branch} (Section ${student.section})</p>
            <p><strong>Offered Role:</strong> ${role}</p>
            
            <p>We are delighted to extend this formal offer of full-time employment following the rigorous on-campus selection process.</p>
            
            <table class="table">
              <tr><th>Component</th><th>Annual Value</th></tr>
              <tr><td>Guaranteed Base Salary</td><td>₹18,50,000 per annum</td></tr>
              <tr><td>First-Year Performance & Joining Bonus</td><td>₹5,50,000</td></tr>
              <tr><td>Restricted Stock Units (RSUs)</td><td>₹8,00,000 (Vesting schedule)</td></tr>
              <tr style="font-weight:bold; background:#fafafa;"><td>Total Cost to Company (CTC)</td><td>₹32,00,000 per annum</td></tr>
            </table>

            <p><strong>Status:</strong> <span class="badge">OFFICIALLY COUNTERSIGNED & SECURED</span></p>
            <p style="margin-top: 40px; font-size: 11px; color: #86868B;">Cryptographically verified through Institutional TPO Command System.</p>
            <script>window.onload = function() { window.print(); };</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleRunCodeSnippet = () => {
    setCodeExecutionResult('Running test suite in sandbox...\n✓ Test Case 1: get(1) -> 1 [PASSED in 0.8ms]\n✓ Test Case 2: put(3, 3) evicted key 2 [PASSED in 0.4ms]\n✓ Test Case 3: get(2) -> -1 [PASSED in 0.3ms]\n\nAll 15 Unit Tests Passed! Time Complexity: O(1) Verified.');
  };

  const handleSaveSettings = () => {
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6 pb-16 text-[#1D1D1F] dark:text-[#F8FAFC]">
      {/* ========================================================================= */}
      {/* 1. TOP ACADEMIC METRIC RIBBON & ERP IDENTITY (Apple Cupertino Light Card) */}
      {/* ========================================================================= */}
      <div className="apple-card p-6 relative overflow-hidden bg-white dark:bg-[#1E2D45]/85 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Student Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 dark:bg-[#0071E3]/20 border border-[#0071E3]/20 dark:border-[#0071E3]/40 flex items-center justify-center font-bold text-lg text-[#0071E3] dark:text-[#38BDF8]">
                {student.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-[#34C759] rounded-full ring-2 ring-white dark:ring-[#0F172A]">
                <CheckCircle className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                  {student.name}
                </h2>
                <span className="font-mono text-xs text-[#0071E3] dark:text-[#38BDF8] bg-[#0071E3]/10 dark:bg-[#0071E3]/15 border border-[#0071E3]/20 dark:border-[#38BDF8]/30 px-2 py-0.5 rounded-md font-semibold">
                  {student.rollNo}
                </span>
                <span className="text-[11px] text-[#28A745] dark:text-[#10B981] bg-[#34C759]/10 dark:bg-[#10B981]/15 border border-[#34C759]/20 px-2 py-0.5 rounded-full font-medium">
                  Verified ERP
                </span>
              </div>
              <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-0.5">
                B.Tech {student.branch} (Section {student.section}) • University Registrar • Class of 2026
              </p>
            </div>
          </div>

          {/* Academic Metric Ribbon Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] p-3 rounded-2xl">
            {/* CGPA */}
            <div className="flex flex-col px-3 py-1 border-r border-black/[0.06] dark:border-white/[0.06] last:border-none">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#CBD5E1]">
                Cumulative CGPA
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1D1D1F] dark:text-white">
                  {simulatedCgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#86868B] dark:text-[#94A3B8]">/ 10.0</span>
              </div>
            </div>

            {/* Backlogs */}
            <div className="flex flex-col px-3 py-1 border-r border-black/[0.06] dark:border-white/[0.06] last:border-none">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#CBD5E1]">
                Active Backlogs
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-[#34C759] font-mono">
                  {student.backlogs} Active
                </span>
                <span className="text-[10px] text-[#34C759] font-medium">Clean</span>
              </div>
            </div>

            {/* Department */}
            <div className="flex flex-col px-3 py-1 border-r border-black/[0.06] dark:border-white/[0.06] last:border-none">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#CBD5E1]">
                Department
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-bold text-[#1D1D1F] dark:text-white">
                  {student.branch} ({student.section})
                </span>
              </div>
            </div>

            {/* Dream Offer Status */}
            <div className="flex flex-col px-3 py-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D97706] dark:text-[#F59E0B]">
                Dream Policy
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706] dark:text-[#F59E0B]">
                  <Sparkles className="w-3 h-3 text-[#FF9500]" />
                  Super Dream
                </span>
              </div>
            </div>
          </div>

          {/* Interactive CGPA Simulator Slider */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl flex items-center gap-2.5 text-xs">
              <Sliders className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#38BDF8]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-[#86868B] dark:text-[#CBD5E1] font-semibold uppercase">Simulate CGPA:</span>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="range"
                    min="6.0"
                    max="10.0"
                    step="0.1"
                    value={simulatedCgpa}
                    onChange={(e) => setSimulatedCgpa(parseFloat(e.target.value))}
                    className="w-24 cursor-pointer"
                  />
                  <span className="font-mono text-[#0071E3] dark:text-[#38BDF8] font-bold text-xs">{simulatedCgpa.toFixed(2)}</span>
                  {simulatedCgpa !== student.cgpa && (
                    <button
                      onClick={() => setSimulatedCgpa(student.cgpa)}
                      title="Reset to actual CGPA"
                      className="text-[10px] text-[#86868B] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white p-1 rounded hover:bg-black/[0.05]"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED SEQUENTIAL PLACEMENT FLOW NAVIGATION (Apple Segmented Bar)  */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.03)] backdrop-blur-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
          {/* Step 2: Resume & Dream Job */}
          <button
            onClick={() => setActiveTab('resume')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'resume'
                ? 'bg-[#0071E3] text-white shadow-[0_2px_10px_rgba(0,113,227,0.3)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>2. Resume & Dream Job</span>
          </button>

          {/* Step 3: AI Scanner & Analysis */}
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'analysis'
                ? 'bg-[#0071E3] text-white shadow-[0_2px_10px_rgba(0,113,227,0.3)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#38BDF8]" />
            <span>3. AI Scanner</span>
          </button>

          {/* Step 4: Matched Roles & Drives */}
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'drives'
                ? 'bg-[#0071E3] text-white shadow-[0_2px_10px_rgba(0,113,227,0.3)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>4. Matched Roles</span>
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${
              activeTab === 'drives' ? 'bg-white/20 text-white' : 'bg-black/[0.06] dark:bg-white/[0.08] text-[#6E6E73] dark:text-[#CBD5E1]'
            }`}>
              {drives.length}
            </span>
          </button>

          {/* Step 5: Offer Letters */}
          <button
            onClick={() => setActiveTab('offers')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'offers'
                ? 'bg-[#0071E3] text-white shadow-[0_2px_10px_rgba(0,113,227,0.3)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-[#34C759]" />
            <span>5. Offer Letters</span>
            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-[#34C759]/15 text-[#28A745] dark:text-[#34D399] border border-[#34C759]/20">
              2 Offers
            </span>
          </button>

          {/* Step 6: Meetings & Interviews */}
          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'meetings'
                ? 'bg-[#0071E3] text-white shadow-[0_2px_10px_rgba(0,113,227,0.3)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#38BDF8]" />
            <span>6. Meetings</span>
            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-[#0071E3]/15 text-[#0071E3] dark:text-[#38BDF8] border border-[#0071E3]/20">
              3 Live
            </span>
          </button>

          {/* Step 7: Student Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#0071E3] text-white shadow-[0_2px_10px_rgba(0,113,227,0.3)]'
                : 'text-[#6E6E73] dark:text-[#CBD5E1] hover:text-[#1D1D1F] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#FF9500]" />
            <span>7. Settings</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* STEP 2 VIEW: RESUME UPLOAD & DREAM JOB ASPIRATION                         */}
      {/* ========================================================================= */}
      {activeTab === 'resume' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="apple-card p-6 bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-[#0071E3] uppercase tracking-wider">Step 2 of Placement Pipeline</span>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mt-0.5">
                  Resume Upload & Dream Job Aspiration
                </h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-1">
                  Upload your verified resume PDF to analyze with Groq LLaMA 3.1 AI, specify your target role, and match real-time eligibility cutoffs.
                </p>
              </div>

              <div className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl text-right">
                <span className="text-[10px] text-[#86868B] dark:text-[#CBD5E1] font-semibold uppercase block">Selected File</span>
                <span className="text-xs font-bold font-mono text-[#0071E3] dark:text-[#38BDF8] truncate max-w-[200px] block">{uploadedFileName}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Drag & Drop Resume Upload Box */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#1D1D1F] dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#0071E3]" />
                  <span>Official Resume Document</span>
                </h4>

                <div className="border-2 border-dashed border-black/[0.1] dark:border-white/[0.15] hover:border-[#0071E3] rounded-2xl p-6 text-center bg-[#FBFBFC] dark:bg-[#243554]/50 transition-all flex flex-col items-center justify-center min-h-[220px]">
                  <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h5 className="font-semibold text-sm text-[#1D1D1F] dark:text-white mb-1">
                    Upload Your Resume PDF
                  </h5>
                  <p className="text-xs text-[#86868B] dark:text-[#CBD5E1] max-w-xs mb-4">
                    Drag and drop your resume file here or click below to browse (PDF, DOCX supported up to 10MB)
                  </p>

                  <label className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-sm">
                    <span>{isUploadingResume ? 'Uploading...' : 'Browse Computer Files'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeFileChange}
                      className="hidden"
                    />
                  </label>

                  {resumeUploadSuccess && (
                    <span className="text-xs font-bold text-[#34C759] mt-3 flex items-center gap-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{uploadedFileName} uploaded & verified</span>
                    </span>
                  )}
                </div>

                {/* THE ANALYZE BUTTON - PLACED DIRECTLY BELOW UPLOAD OPTION AS REQUESTED */}
                <button
                  onClick={handleTriggerAiAnalysis}
                  disabled={isAnalyzingAi}
                  className="w-full py-3.5 px-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-[0_4px_14px_rgba(0,113,227,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>{isAnalyzingAi ? 'Analyzing Resume with LLaMA 3.1 AI...' : 'Analyze Resume with AI'}</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Right Column: Dream Job Target Inputs */}
              <div className="space-y-4">
                <h4 className="font-bold text-sm text-[#1D1D1F] dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#FF9500]" />
                  <span>Dream Job Career Aspirations</span>
                </h4>

                <div className="p-5 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white block mb-1.5">
                      Target Dream Role / Specialization
                    </label>
                    <input
                      type="text"
                      value={targetDreamJob}
                      onChange={(e) => setTargetDreamJob(e.target.value)}
                      placeholder="e.g. SDE 1, Distributed Cloud Architect, AI Systems Engineer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#1E2D45] border border-black/[0.1] dark:border-white/[0.1] text-xs font-medium text-[#1D1D1F] dark:text-white outline-none focus:border-[#0071E3]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-[#1D1D1F] dark:text-white">
                        Target Compensation (Dream CTC)
                      </label>
                      <span className="font-bold font-mono text-sm text-[#0071E3] dark:text-[#38BDF8]">
                        ₹{targetDreamCtc}.0 LPA
                      </span>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="50"
                      step="1"
                      value={targetDreamCtc}
                      onChange={(e) => setTargetDreamCtc(parseInt(e.target.value))}
                      className="w-full cursor-pointer mt-2"
                    />
                    <div className="flex justify-between text-[10px] text-[#86868B] mt-1 font-mono">
                      <span>₹12 LPA (Core)</span>
                      <span>₹25 LPA (Dream)</span>
                      <span>₹50 LPA (Super Dream)</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white block mb-2">
                      Target Domain Focus
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Cloud & Microservices',
                        'Generative AI / ML',
                        'Full Stack React + Node',
                        'Distributed Systems'
                      ].map((tag) => (
                        <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#0071E3]/10 text-[#0071E3] dark:text-[#38BDF8] border border-[#0071E3]/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3 VIEW: AI SCANNER & ATS FITMENT BREAKDOWN                           */}
      {/* ========================================================================= */}
      {activeTab === 'analysis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="apple-card p-6 bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-black/[0.06] dark:border-white/[0.08] mb-6">
              <div>
                <span className="text-xs font-bold text-[#0071E3] uppercase tracking-wider">Step 3 of Placement Pipeline</span>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight mt-0.5">
                  AI Fitment Analysis & ATS Scorecard
                </h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-1">
                  Evaluated using Groq LLaMA 3.1 Neural Parser against {targetDreamJob} job benchmarks.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('drives')}
                  className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>View Matched Jobs (Step 4)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* ATS Gauge Scorecard (4 cols) */}
              <div className="md:col-span-4 p-6 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full border-8 border-black/[0.06] dark:border-white/[0.06]" />
                  <div className="absolute inset-0 rounded-full border-8 border-[#34C759] border-t-transparent border-l-transparent -rotate-45" />
                  <div className="text-center">
                    <span className="text-3xl font-extrabold font-mono text-[#1D1D1F] dark:text-white block">94</span>
                    <span className="text-[10px] text-[#86868B] uppercase font-bold tracking-wider">ATS Score</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#34C759]/15 text-[#28A745] dark:text-[#34D399] border border-[#34C759]/30 mb-2">
                  Tier-1 Super Dream Qualified
                </span>
                <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1]">
                  Resume exceeds cutoffs for 85% of institutional recruitment drives.
                </p>
              </div>

              {/* Competencies & Skill Breakdown (8 cols) */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#86868B] dark:text-[#CBD5E1] mb-2">
                    Verified Competencies Detected
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Distributed Architecture', 'TypeScript / ES6', 'PostgreSQL Optimization',
                      'React & State Redux', 'Microservices & Docker', 'Redis Caching',
                      'High-Throughput APIs', 'Git Flow CI/CD'
                    ].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-[#34C759]/10 text-[#28A745] dark:text-[#34D399] border border-[#34C759]/20 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                        <Check className="w-3 h-3" />
                        <span>{skill}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#86868B] dark:text-[#CBD5E1] mb-2">
                    Recommended Polish for ₹30+ LPA Roles
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-white dark:bg-[#1E2D45] border border-black/[0.06] dark:border-white/[0.08] rounded-xl flex items-center justify-between">
                      <span className="text-[#1D1D1F] dark:text-white font-medium">Add production benchmarks (e.g. TPS, latency reduction %)</span>
                      <span className="text-[10px] text-[#0071E3] font-bold">+4 ATS pts</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-[#1E2D45] border border-black/[0.06] dark:border-white/[0.08] rounded-xl flex items-center justify-between">
                      <span className="text-[#1D1D1F] dark:text-white font-medium">Include distributed consensus concepts (Raft, Paxos) for AWS bar raiser</span>
                      <span className="text-[10px] text-[#0071E3] font-bold">+3 ATS pts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 4 VIEW: MATCHED ROLES & CAMPUS PIPELINE TRACKER                      */}
      {/* ========================================================================= */}
      {activeTab === 'drives' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Horizontal Pipeline Tracker (8 cols) */}
            <div className="lg:col-span-8 apple-card p-6 flex flex-col justify-between bg-white dark:bg-[#1E2D45]/85 border border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08] mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1D1D1F] dark:text-white">
                        Live Application Pipeline Tracker
                      </h3>
                      <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1]">
                        Tracking: {primaryAppliedDrive ? `${primaryAppliedDrive.companyName} — ${primaryAppliedDrive.role}` : 'No active application'}
                      </p>
                    </div>
                  </div>

                  {primaryAppliedDrive && (
                    <span className="px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] border border-[#0071E3]/20 text-xs font-bold font-mono">
                      {primaryAppliedDrive.ctc}
                    </span>
                  )}
                </div>

                {/* Stepper Progress Bar */}
                <div className="py-2">
                  <div className="grid grid-cols-5 gap-2 relative">
                    {pipelineSteps.map((step) => {
                      const isDone = step.status === 'completed';
                      const isCurrent = step.status === 'current';
                      return (
                        <div key={step.id} className="flex flex-col items-center text-center relative">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs mb-2 transition-all ${
                              isDone
                                ? 'bg-[#34C759] text-white shadow-[0_2px_8px_rgba(52,199,89,0.3)]'
                                : isCurrent
                                ? 'bg-[#0071E3] text-white shadow-[0_2px_12px_rgba(0,113,227,0.35)] ring-4 ring-[#0071E3]/15'
                                : 'bg-[#F2F2F7] dark:bg-[#1E293B] text-[#86868B] dark:text-[#94A3B8]'
                            }`}
                          >
                            {isDone ? <Check className="w-4 h-4" /> : `0${step.id}`}
                          </div>

                          <div className="font-semibold text-xs text-[#1D1D1F] dark:text-white leading-tight">
                            {step.name}
                          </div>
                          <div
                            className={`text-[10px] mt-0.5 ${
                              isCurrent
                                ? 'text-[#0071E3] font-semibold'
                                : isDone
                                ? 'text-[#34C759]'
                                : 'text-[#86868B]'
                            }`}
                          >
                            {step.desc}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status footer pill */}
              <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#6E6E73] dark:text-[#CBD5E1]">
                  <Clock className="w-4 h-4 text-[#FF9500]" />
                  <span>Next scheduled milestone: <strong>Tech Round 2 Architecture Review (Today 4:00 PM)</strong></span>
                </div>
                <button
                  onClick={() => setActiveTab('meetings')}
                  className="text-xs text-[#0071E3] dark:text-[#38BDF8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Meeting Room</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Resume Health Card (4 cols) */}
            <div className="lg:col-span-4 apple-card p-6 flex flex-col justify-between bg-white dark:bg-[#1E2D45]/85 border border-black/[0.06] dark:border-white/[0.08]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/[0.08] mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#34C759]/10 text-[#34C759]">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#1D1D1F] dark:text-white">
                        Resume Dossier Status
                      </h4>
                      <span className="text-[10px] text-[#6E6E73] dark:text-[#CBD5E1]">
                        ATS Compatibility 94%
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#34C759] bg-[#34C759]/10 px-2 py-0.5 rounded-full border border-[#34C759]/20">
                    Active
                  </span>
                </div>

                <div className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0071E3]" />
                      <span className="font-mono text-xs text-[#1D1D1F] dark:text-white truncate max-w-[170px]">
                        {student.resumeUrl}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewResume(student)}
                      className="text-xs text-[#0071E3] dark:text-[#38BDF8] hover:underline font-semibold cursor-pointer"
                    >
                      View PDF
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#6E6E73] dark:text-[#CBD5E1]">
                  <div className="flex items-center justify-between">
                    <span>Target Fitment (Super Dream):</span>
                    <span className="font-bold text-[#1D1D1F] dark:text-white">96% Fit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ATS Keyword Match:</span>
                    <span className="font-bold text-[#34C759]">34 Detected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Formatting Score:</span>
                    <span className="font-bold text-[#1D1D1F] dark:text-white">100/100</span>
                  </div>
                </div>
              </div>

              {/* Upload New Version */}
              <div className="pt-4 mt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  onClick={() => setActiveTab('resume')}
                  className="w-full py-2 px-3 bg-[#0071E3]/10 hover:bg-[#0071E3]/20 border border-[#0071E3]/20 text-[#0071E3] dark:text-[#38BDF8] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Open Resume & Dream Job (Step 2)</span>
                </button>
              </div>
            </div>
          </div>

          {/* CAMPUS RECRUITMENT DRIVES GRID */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                  Active Campus Recruitment Drives
                </h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1]">
                  Showing placement drives filtered by real-time eligibility (CGPA cutoff: ≥ {simulatedCgpa.toFixed(2)})
                </p>
              </div>

              {/* Category Segmented Filter */}
              <div className="apple-segmented-control self-start sm:self-auto">
                {['All', 'Super Dream', 'Dream', 'Tier-1 Core'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`apple-segmented-btn cursor-pointer ${
                      selectedCategory === cat ? 'active' : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDrives.map((drive) => {
                const isEligible = simulatedCgpa >= drive.minCgpa;
                return (
                  <div
                    key={drive.id}
                    className="apple-card-hover p-5 flex flex-col justify-between relative group bg-white dark:bg-[#1E2D45]/85 border border-black/[0.06] dark:border-white/[0.08]"
                  >
                    {/* Urgent Deadline Pill */}
                    {drive.isUrgent && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FF9500]/10 text-[#D97706] text-[10px] font-bold font-mono">
                        <Clock className="w-3 h-3 text-[#FF9500]" />
                        <span>{drive.closesInText}</span>
                      </div>
                    )}

                    <div>
                      {/* Company Header */}
                      <div className="flex items-start gap-3.5 mb-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-xs tracking-wider shrink-0">
                          {drive.companyLogo}
                        </div>
                        <div className="min-w-0 pr-12">
                          <h4 className="font-bold text-base text-[#1D1D1F] dark:text-white group-hover:text-[#0071E3] transition-colors truncate">
                            {drive.companyName}
                          </h4>
                          <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{drive.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Role Title */}
                      <h5 className="font-semibold text-sm text-[#1D1D1F] dark:text-white mb-1">
                        {drive.role}
                      </h5>
                      <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] line-clamp-2 mb-4 leading-relaxed">
                        {drive.description}
                      </p>

                      {/* CTC Callout */}
                      <div className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl mb-4 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-semibold text-[#86868B] dark:text-[#CBD5E1]">Compensation</span>
                          <div className="text-xl font-bold font-mono text-[#0071E3] dark:text-[#38BDF8]">
                            {drive.ctc}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-semibold text-[#86868B] dark:text-[#CBD5E1]">Min CGPA Cutoff</span>
                          <div className="text-xs font-mono font-bold text-[#1D1D1F] dark:text-white">
                            ≥ {drive.minCgpa.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions and Dynamic Eligibility */}
                    <div className="pt-3.5 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-3">
                      <div>
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#28A745] dark:text-[#10B981] bg-[#34C759]/10 px-2.5 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-[#34C759]" />
                            <span>Eligible ({simulatedCgpa.toFixed(1)} ≥ {drive.minCgpa})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FF3B30] bg-[#FF3B30]/10 px-2.5 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3 text-[#FF3B30]" />
                            <span>Cutoff Shortfall</span>
                          </span>
                        )}
                      </div>

                      {drive.hasApplied ? (
                        <button
                          disabled
                          className="px-3.5 py-1.5 bg-[#0071E3]/10 text-[#0071E3] rounded-xl text-xs font-semibold flex items-center gap-1 cursor-default"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3]" />
                          <span>{drive.applicationStage || 'Applied'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onApplyJob(drive)}
                          disabled={!isEligible}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer ${
                            isEligible
                              ? 'bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_2px_8px_rgba(0,113,227,0.25)]'
                              : 'bg-black/[0.05] dark:bg-white/[0.05] text-[#86868B] cursor-not-allowed opacity-50'
                          }`}
                        >
                          <span>1-Click Apply</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 5 VIEW: DEDICATED OFFER LETTERS & COMPENSATION CONTRACTS             */}
      {/* ========================================================================= */}
      {activeTab === 'offers' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="apple-card p-6 bg-white dark:bg-[#1E2D45] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#34C759]/15 text-[#28A745] dark:text-[#34D399] text-xs font-bold mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>2 Active Employment Offers Received</span>
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                  Official Placement Contracts & Compensation
                </h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-1 max-w-2xl">
                  Formal campus placement offers with legally binding salary breakups, sign-on equity grants, and acceptance deadlines.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl text-right">
                  <span className="text-[10px] text-[#86868B] dark:text-[#CBD5E1] font-semibold uppercase tracking-wider block">Highest CTC Offer</span>
                  <span className="text-xl font-bold font-mono text-[#28A745] dark:text-[#34D399]">₹32.0 LPA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Offer Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerList.map((offer) => (
              <div
                key={offer.id}
                className="apple-card p-6 flex flex-col justify-between bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08] relative group hover:border-[#0071E3] transition-all shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
              >
                {/* Acceptance Ribbon */}
                {offer.accepted ? (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#34C759]/15 text-[#28A745] dark:text-[#34D399] text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                    <span>Accepted & Countersigned</span>
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF9500]/10 text-[#D97706] dark:text-[#F59E0B] text-xs font-bold font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#FF9500]" />
                    <span>{offer.deadline}</span>
                  </div>
                )}

                <div>
                  {/* Company & Role Header */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] dark:text-[#38BDF8] flex items-center justify-center font-bold text-sm tracking-wider">
                      {offer.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-[#1D1D1F] dark:text-white">
                        {offer.company}
                      </h4>
                      <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1]">
                        {offer.role}
                      </p>
                    </div>
                  </div>

                  {/* CTC Banner */}
                  <div className="p-4 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl mb-5">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-xs text-[#86868B] dark:text-[#CBD5E1] font-semibold uppercase">Total CTC Package</span>
                      <span className="text-2xl font-bold font-mono text-[#0071E3] dark:text-[#38BDF8]">{offer.ctc}</span>
                    </div>

                    {/* Breakdown Details */}
                    <div className="space-y-1.5 text-xs border-t border-black/[0.06] dark:border-white/[0.06] pt-3 text-[#6E6E73] dark:text-[#CBD5E1]">
                      <div className="flex justify-between">
                        <span>Base Compensation:</span>
                        <span className="font-mono font-semibold text-[#1D1D1F] dark:text-white">{offer.base}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Performance / Sign-on Bonus:</span>
                        <span className="font-mono font-semibold text-[#1D1D1F] dark:text-white">{offer.bonus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equity RSUs Stock Grant:</span>
                        <span className="font-mono font-semibold text-[#1D1D1F] dark:text-white">{offer.rsu}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Office Location:</span>
                        <span className="font-semibold text-[#1D1D1F] dark:text-white">{offer.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Offer Action Buttons */}
                <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3">
                  <button
                    onClick={() => setPreviewOffer(offer)}
                    className="flex-1 py-2.5 px-4 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(0,113,227,0.25)] cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Review & Sign Contract</span>
                  </button>

                  <button
                    onClick={() => handleDownloadOfferPdf(offer.company, offer.role)}
                    className="py-2.5 px-3.5 bg-black/[0.05] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[#1D1D1F] dark:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Download printable PDF offer letter"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0071E3] dark:text-[#38BDF8]" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 6 VIEW: LIVE INTERVIEW MEETINGS & VIRTUAL ROUNDS                     */}
      {/* ========================================================================= */}
      {activeTab === 'meetings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="apple-card p-6 bg-white dark:bg-[#1E2D45] border border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071E3]/10 text-[#0071E3] dark:text-[#38BDF8] text-xs font-bold mb-2">
                  <Video className="w-3.5 h-3.5" />
                  <span>3 Virtual Technical & Advisory Meetings</span>
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                  Virtual Interview Panels & Room Schedule
                </h3>
                <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-1 max-w-2xl">
                  Join secure company technical rounds with integrated live video conferencing, shared code scratchpads, and TPO-monitored recording streams.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-2xl text-right">
                  <span className="text-[10px] text-[#86868B] dark:text-[#CBD5E1] font-semibold uppercase tracking-wider block">Next Scheduled Round</span>
                  <span className="text-sm font-bold font-mono text-[#D97706] dark:text-[#F59E0B]">Today @ 04:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Panels */}
          <div className="space-y-4">
            {meetingList.map((m) => (
              <div
                key={m.id}
                className="apple-card p-5 bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08] hover:border-[#0071E3] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-[#1D1D1F] dark:text-white tracking-tight">
                      {m.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      m.isLiveNow 
                        ? 'bg-rose-50 dark:bg-[#EF4444]/20 text-rose-600 dark:text-[#F87171] border-rose-200 dark:border-[#EF4444]/40 animate-pulse' 
                        : 'bg-black/[0.05] dark:bg-white/[0.06] text-[#6E6E73] dark:text-[#CBD5E1] border-black/[0.06] dark:border-white/[0.1]'
                    }`}>
                      {m.badge}
                    </span>
                    <span className="font-mono text-[10px] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#38BDF8] border border-[#0071E3]/20 px-2 py-0.5 rounded-md">
                      Room: {m.roomCode}
                    </span>
                  </div>

                  <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1]">
                    <span className="text-[#1D1D1F] dark:text-white font-medium">Interviewer:</span> {m.interviewer}
                  </p>
                  <p className="text-xs text-[#86868B] dark:text-[#94A3B8]">
                    <span className="text-[#6E6E73] dark:text-[#CBD5E1] font-medium">Format:</span> {m.format}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-semibold text-[#1D1D1F] dark:text-white block">{m.time}</span>
                    <span className="text-[10px] text-[#34C759] font-medium">Audio/Video Verified</span>
                  </div>

                  <button
                    onClick={() => setActiveMeeting(m)}
                    className="py-2.5 px-4 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-[0_2px_8px_rgba(0,113,227,0.25)] cursor-pointer whitespace-nowrap"
                  >
                    <Video className="w-4 h-4 text-white" />
                    <span>Launch Interview Room</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 7 VIEW: STUDENT SETTINGS & CONFIGURATION                             */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="apple-card p-6 bg-white dark:bg-[#1E2D45] border border-black/[0.06] dark:border-white/[0.08]">
            <h3 className="text-xl font-bold text-[#1D1D1F] dark:text-white tracking-tight">
              Student Placement Dossier & Preferences
            </h3>
            <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1] mt-1 max-w-2xl">
              Configure your career threshold targets, preferred industry sectors, and campus notification channels. All settings sync with the institutional TPO database.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Academic Dossier Card */}
            <div className="apple-card p-6 bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08] space-y-4">
              <h4 className="font-bold text-sm text-[#1D1D1F] dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-[#0071E3]" />
                <span>Verified Academic Credentials</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] text-[#86868B] dark:text-[#CBD5E1] font-semibold block mb-1">Full Student Name</label>
                  <input
                    type="text"
                    disabled
                    value={student.name}
                    className="w-full px-3 py-2 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-xl text-[#1D1D1F] dark:text-white font-medium opacity-80 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-[#86868B] dark:text-[#CBD5E1] font-semibold block mb-1">University Roll Number</label>
                    <input
                      type="text"
                      disabled
                      value={student.rollNo}
                      className="w-full px-3 py-2 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-xl text-[#1D1D1F] dark:text-white font-mono opacity-80 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#86868B] dark:text-[#CBD5E1] font-semibold block mb-1">Cumulative CGPA</label>
                    <input
                      type="text"
                      disabled
                      value={`${student.cgpa.toFixed(2)} / 10.0`}
                      className="w-full px-3 py-2 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-xl text-[#1D1D1F] dark:text-white font-mono opacity-80 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-[#86868B] dark:text-[#CBD5E1] font-semibold block mb-1">Official University Email</label>
                  <input
                    type="email"
                    disabled
                    value={`${student.rollNo.toLowerCase()}@university.edu.in`}
                    className="w-full px-3 py-2 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.08] rounded-xl text-[#1D1D1F] dark:text-white font-medium opacity-80 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Target CTC & Dream Job Rules */}
            <div className="apple-card p-6 bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08] space-y-4">
              <h4 className="font-bold text-sm text-[#1D1D1F] dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF9500]" />
                <span>Dream Job CTC Threshold Policy</span>
              </h4>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] text-[#86868B] dark:text-[#CBD5E1] font-semibold">Minimum Dream CTC Target:</span>
                    <span className="font-bold font-mono text-base text-[#0071E3] dark:text-[#38BDF8]">₹{settingsDreamCtc}.0 LPA</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="1"
                    value={settingsDreamCtc}
                    onChange={(e) => setSettingsDreamCtc(parseInt(e.target.value))}
                    className="w-full cursor-pointer mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-[#86868B] mt-1 font-mono">
                    <span>₹10 LPA</span>
                    <span>₹30 LPA</span>
                    <span>₹50 LPA</span>
                  </div>
                </div>

                {/* Domain Checkboxes */}
                <div>
                  <span className="text-[11px] text-[#86868B] dark:text-[#CBD5E1] font-semibold block mb-2">Preferred Domain Specializations:</span>
                  <div className="space-y-2">
                    {[
                      'Cloud Architecture & Distributed Systems',
                      'Generative AI & Machine Learning',
                      'Full-Stack Systems',
                      'DevOps, SRE & Kubernetes',
                      'Cybersecurity & Network Defense'
                    ].map((dom) => (
                      <label key={dom} className="flex items-center gap-2.5 cursor-pointer text-xs text-[#1D1D1F] dark:text-[#CBD5E1]">
                        <input
                          type="checkbox"
                          checked={settingsDomains.includes(dom)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSettingsDomains([...settingsDomains, dom]);
                            } else {
                              setSettingsDomains(settingsDomains.filter((d) => d !== dom));
                            }
                          }}
                          className="w-4 h-4 rounded text-[#0071E3] focus:ring-0"
                        />
                        <span>{dom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Notifications Dispatch Configuration */}
            <div className="apple-card p-6 bg-white dark:bg-[#1E2D45]/90 border border-black/[0.06] dark:border-white/[0.08] space-y-4 md:col-span-2">
              <h4 className="font-bold text-sm text-[#1D1D1F] dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#34C759]" />
                <span>Instant Notification Dispatch Rules</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <label className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-[#1D1D1F] dark:text-white block">SMS Shortlist Alerts</span>
                    <span className="text-[10px] text-[#86868B] dark:text-[#CBD5E1]">Immediate text for round clears</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsNotifications.sms}
                    onChange={(e) => setSettingsNotifications({ ...settingsNotifications, sms: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0071E3]"
                  />
                </label>

                <label className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-[#1D1D1F] dark:text-white block">WhatsApp OA Links</span>
                    <span className="text-[10px] text-[#86868B] dark:text-[#CBD5E1]">Direct test URLs & reminders</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsNotifications.whatsapp}
                    onChange={(e) => setSettingsNotifications({ ...settingsNotifications, whatsapp: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0071E3]"
                  />
                </label>

                <label className="p-3 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/[0.06] rounded-xl flex items-center justify-between cursor-pointer">
                  <div>
                    <span className="font-bold text-[#1D1D1F] dark:text-white block">Email Dossier Digests</span>
                    <span className="text-[10px] text-[#86868B] dark:text-[#CBD5E1]">Weekly drive status reports</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settingsNotifications.email}
                    onChange={(e) => setSettingsNotifications({ ...settingsNotifications, email: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0071E3]"
                  />
                </label>
              </div>

              <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
                {settingsSavedToast ? (
                  <span className="text-xs text-[#34C759] font-bold flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dossier preferences successfully synchronized with database!</span>
                  </span>
                ) : (
                  <span className="text-xs text-[#86868B]">All changes take effect immediately on active drives.</span>
                )}

                <button
                  onClick={handleSaveSettings}
                  className="py-2.5 px-6 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-bold transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] cursor-pointer"
                >
                  Save Profile Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: INTERACTIVE OFFER LETTER CONTRACT & DIGITAL SIGNATURE            */}
      {/* ========================================================================= */}
      {previewOffer && (
        <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1E2D45] border border-black/[0.08] dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-black/[0.06] dark:border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] dark:text-[#38BDF8] flex items-center justify-center font-bold text-sm">
                  {previewOffer.company.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1D1D1F] dark:text-white">
                    {previewOffer.company} — Employment Contract
                  </h3>
                  <p className="text-xs text-[#6E6E73] dark:text-[#CBD5E1]">
                    Class of 2026 Campus Placement • Reference #{previewOffer.company.replace(/\s+/g, '')}-2026
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPreviewOffer(null)}
                className="text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-[#FBFBFC] dark:bg-[#243554] border border-black/[0.06] dark:border-white/10 rounded-2xl mb-6 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#86868B] dark:text-[#CBD5E1]">Appointee:</span>
                <span className="font-bold text-[#1D1D1F] dark:text-white">{student.name} ({student.rollNo})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868B] dark:text-[#CBD5E1]">Department:</span>
                <span className="font-bold text-[#1D1D1F] dark:text-white">B.Tech {student.branch} (Section {student.section})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#86868B] dark:text-[#CBD5E1]">Designation:</span>
                <span className="font-bold text-[#0071E3] dark:text-[#38BDF8]">{previewOffer.role}</span>
              </div>
            </div>

            <h4 className="font-bold text-xs uppercase tracking-wider text-[#86868B] dark:text-[#CBD5E1] mb-2">Compensation Schedule Breakdown</h4>
            <div className="border border-black/[0.08] dark:border-white/10 rounded-2xl overflow-hidden mb-6 text-xs">
              <div className="bg-[#F5F5F7] dark:bg-[#1E293B] p-3 flex justify-between font-bold text-[#1D1D1F] dark:text-white border-b border-black/[0.06] dark:border-white/10">
                <span>Salary Component</span>
                <span>Annual Valuation</span>
              </div>
              <div className="p-3 flex justify-between border-b border-black/[0.06] dark:border-white/10 text-[#1D1D1F] dark:text-[#CBD5E1]">
                <span>Guaranteed Base Pay</span>
                <span className="font-mono font-semibold">{previewOffer.base}</span>
              </div>
              <div className="p-3 flex justify-between border-b border-black/[0.06] dark:border-white/10 text-[#1D1D1F] dark:text-[#CBD5E1]">
                <span>Joining & First-Year Bonus</span>
                <span className="font-mono font-semibold">{previewOffer.bonus}</span>
              </div>
              <div className="p-3 flex justify-between border-b border-black/[0.06] dark:border-white/10 text-[#1D1D1F] dark:text-[#CBD5E1]">
                <span>Restricted Stock Units (RSUs Equity)</span>
                <span className="font-mono font-semibold">{previewOffer.rsu}</span>
              </div>
              <div className="bg-[#0071E3]/10 dark:bg-[#0071E3]/20 p-3.5 flex justify-between font-bold text-[#0071E3] dark:text-white">
                <span>Total Cost to Company (CTC)</span>
                <span className="font-mono text-base text-[#34C759]">{previewOffer.ctc}</span>
              </div>
            </div>

            <div className="p-3 bg-[#34C759]/10 border border-[#34C759]/20 rounded-xl mb-6 flex items-center gap-3 text-xs text-[#28A745] dark:text-[#34D399]">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Cryptographic Seal Verified: SHA256:{Math.random().toString(36).substring(2, 15)} (Institutional TPO Counter-signed)</span>
            </div>

            <div className="flex items-center gap-3">
              {previewOffer.accepted ? (
                <div className="flex-1 py-3 bg-[#34C759]/15 border border-[#34C759]/30 text-[#28A745] dark:text-[#34D399] rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                  <span>Offer Accepted & Recorded on Placement Ledger</span>
                </div>
              ) : (
                <button
                  onClick={() => handleAcceptOffer(previewOffer.company)}
                  className="flex-1 py-3 px-4 bg-[#34C759] hover:bg-[#28A745] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Digitally Sign Employment Offer</span>
                </button>
              )}

              <button
                onClick={() => handleDownloadOfferPdf(previewOffer.company, previewOffer.role)}
                className="py-3 px-5 bg-black/[0.05] dark:bg-white/10 hover:bg-black/[0.08] dark:hover:bg-white/20 text-[#1D1D1F] dark:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#0071E3] dark:text-[#38BDF8]" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INTERACTIVE VIDEO INTERVIEW ROOM & LIVE CODING SCRATCHPAD       */}
      {/* ========================================================================= */}
      {activeMeeting && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-5xl bg-white dark:bg-[#1A2744] border border-black/[0.08] dark:border-white/10 rounded-3xl p-5 shadow-2xl relative max-h-[95vh] flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#FF3B30] animate-ping" />
                <div>
                  <h3 className="font-bold text-sm text-[#1D1D1F] dark:text-white flex items-center gap-2">
                    <span>{activeMeeting.title}</span>
                    <span className="font-mono text-[10px] bg-[#0071E3]/10 text-[#0071E3] dark:text-[#38BDF8] border border-[#0071E3]/20 px-2 py-0.5 rounded-md">
                      {activeMeeting.roomCode}
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#6E6E73] dark:text-[#CBD5E1]">
                    Interviewer: {activeMeeting.interviewer} • Encrypted TLS Stream
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveMeeting(null)}
                className="text-[#86868B] hover:text-[#1D1D1F] dark:hover:text-white p-2 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/10 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 overflow-y-auto">
              {/* Left Column: Video Feeds (5 cols) */}
              <div className="lg:col-span-5 space-y-3 flex flex-col">
                <div className="relative rounded-2xl overflow-hidden bg-[#1E293B] border border-black/[0.08] dark:border-white/10 h-44 sm:h-48 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-14 h-14 rounded-full bg-[#0071E3]/30 border border-[#0071E3]/50 mx-auto flex items-center justify-center text-white font-bold text-lg mb-2">
                      AK
                    </div>
                    <span className="text-xs font-semibold text-white block">{activeMeeting.interviewer}</span>
                    <span className="text-[10px] text-[#34C759] font-mono flex items-center justify-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                      Live Feed (HD 1080p)
                    </span>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                    Interviewer
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden bg-[#0F172A] border border-black/[0.08] dark:border-white/10 h-40 sm:h-44 flex items-center justify-center">
                  {isCamOn ? (
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-[#34C759]/30 border border-[#34C759]/50 mx-auto flex items-center justify-center text-white font-bold text-sm mb-2">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <span className="text-xs font-semibold text-white block">{student.name}</span>
                      <span className="text-[10px] text-[#38BDF8] font-mono">Self Camera (Ready)</span>
                    </div>
                  ) : (
                    <div className="text-center text-[#94A3B8] text-xs">
                      <VideoOff className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span>Camera Paused</span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-mono">
                    Candidate ({student.rollNo})
                  </div>
                </div>

                <div className="p-2.5 bg-[#F5F5F7] dark:bg-[#1E2D45] border border-black/[0.06] dark:border-white/10 rounded-2xl flex items-center justify-around">
                  <button
                    onClick={() => setIsMicOn(!isMicOn)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                      isMicOn ? 'bg-white dark:bg-white/10 text-[#1D1D1F] dark:text-white shadow-xs' : 'bg-[#FF3B30] text-white'
                    }`}
                    title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                  >
                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsCamOn(!isCamOn)}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all ${
                      isCamOn ? 'bg-white dark:bg-white/10 text-[#1D1D1F] dark:text-white shadow-xs' : 'bg-[#FF3B30] text-white'
                    }`}
                    title={isCamOn ? 'Turn Camera Off' : 'Turn Camera On'}
                  >
                    {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>

                  <button
                    className="p-2.5 rounded-xl bg-white dark:bg-white/10 text-[#0071E3] dark:text-[#38BDF8] shadow-xs cursor-pointer transition-all"
                    title="Screen Share Active"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveMeeting(null)}
                    className="p-2.5 rounded-xl bg-[#FF3B30] text-white hover:bg-[#E02B20] cursor-pointer transition-all shadow-xs"
                    title="Leave Room"
                  >
                    <PhoneOff className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Live Coding Scratchpad (7 cols) */}
              <div className="lg:col-span-7 bg-[#FBFBFC] dark:bg-[#1E2D45] border border-black/[0.08] dark:border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-black/[0.06] dark:border-white/10 mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1D1D1F] dark:text-white">
                      <Code2 className="w-4 h-4 text-[#0071E3] dark:text-[#38BDF8]" />
                      <span>Shared Technical Code Editor (JavaScript / ES6)</span>
                    </div>

                    <button
                      onClick={handleRunCodeSnippet}
                      className="py-1 px-3 bg-[#34C759] hover:bg-[#28A745] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Run Sandbox Tests</span>
                    </button>
                  </div>

                  <div className="text-[11px] text-[#6E6E73] dark:text-[#CBD5E1] mb-2 bg-white dark:bg-[#243554] p-2.5 rounded-xl border border-black/[0.05] dark:border-white/5 font-mono">
                    <strong>Challenge:</strong> Design a Least Recently Used (LRU) Cache in O(1) time complexity. Ensure both get() and put() meet optimal constraints.
                  </div>

                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={12}
                    className="w-full p-3 bg-white dark:bg-[#1E2D45] border border-black/[0.1] dark:border-white/10 rounded-xl text-xs font-mono text-[#0071E3] dark:text-[#38BDF8] outline-none focus:border-[#0071E3] transition-all resize-none shadow-xs"
                    spellCheck={false}
                  />
                </div>

                {codeExecutionResult && (
                  <div className="mt-3 p-3 bg-white dark:bg-[#1E2D45] border border-[#34C759]/30 rounded-xl text-[11px] font-mono text-[#28A745] dark:text-[#34D399] whitespace-pre-line animate-in fade-in">
                    {codeExecutionResult}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
