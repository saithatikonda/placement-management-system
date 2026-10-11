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
  Check
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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadSuccess, setResumeUploadSuccess] = useState(false);
  const [simulatedCgpa, setSimulatedCgpa] = useState<number>(student.cgpa || 8.4);

  // Resume Upload Handler (Simulates Spring Boot POST /api/v1/resumes/upload)
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploadingResume(true);
      setTimeout(() => {
        setIsUploadingResume(false);
        setResumeUploadSuccess(true);
        setTimeout(() => setResumeUploadSuccess(false), 3500);
      }, 1200);
    }
  };

  const filteredDrives = drives.filter((d) => {
    if (selectedCategory === 'All') return true;
    return d.category === selectedCategory;
  });

  // Calculate active pipeline stage for student's primary application
  const primaryAppliedDrive = drives.find((d) => d.hasApplied) || drives[0];

  const pipelineSteps = [
    { id: 1, name: 'Applied', status: 'completed', desc: 'Dossier Received' },
    { id: 2, name: 'OA Shortlisted', status: 'completed', desc: '98th Percentile' },
    { id: 3, name: 'Tech Interview 1', status: 'completed', desc: 'Strong Hire' },
    { id: 4, name: 'HR Round', status: 'current', desc: 'Scheduled Today' },
    { id: 5, name: 'Offer Accepted', status: 'upcoming', desc: 'Pending AA' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. TOP ACADEMIC METRIC RIBBON */}
      <div className="pms-card rounded-3xl p-6 relative overflow-hidden border border-emerald-500/20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.85)]">
        {/* Subtle radial glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Student Identity */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#070F0C] border-2 border-emerald-500/40 flex items-center justify-center font-extrabold text-lg text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                {student.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full ring-2 ring-[#11231B]">
                <CheckCircle className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold text-[#F1F5F9] tracking-tight">
                  {student.name}
                </h2>
                <span className="font-mono text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold">
                  {student.rollNo}
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                B.Tech {student.branch} • Verified Institutional Student Registry • 2026 Batch
              </p>
            </div>
          </div>

          {/* Academic Metric Ribbon Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#070F0C]/80 border border-[#162E23] p-3 rounded-2xl">
            {/* CGPA */}
            <div className="flex flex-col px-3 py-1 border-r border-[#162E23] last:border-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Cumulative CGPA
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold font-mono text-emerald-400">
                  {simulatedCgpa.toFixed(2)}
                </span>
                <span className="text-[10px] text-[#94A3B8]">/ 10.0</span>
              </div>
            </div>

            {/* Backlogs */}
            <div className="flex flex-col px-3 py-1 border-r border-[#162E23] last:border-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Active Backlogs
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-bold text-emerald-400 font-mono">
                  {student.backlogs} Active
                </span>
                <span className="text-[10px] text-emerald-400/80 font-medium">Clear</span>
              </div>
            </div>

            {/* Branch */}
            <div className="flex flex-col px-3 py-1 border-r border-[#162E23] last:border-none">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Department
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xs font-bold text-[#F1F5F9]">
                  {student.branch} ({student.section})
                </span>
              </div>
            </div>

            {/* Dream Offer Status with Warm Orange Glow */}
            <div className="flex flex-col px-3 py-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#FB923C]">
                Dream Offer Status
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F97316] font-mono">
                  <Sparkles className="w-3 h-3 text-[#F97316]" />
                  Super Dream
                </span>
              </div>
            </div>
          </div>

          {/* Quick CGPA Simulator Toggle */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#070F0C] border border-[#162E23] rounded-xl flex items-center gap-2 text-xs">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-[#94A3B8] font-bold uppercase">Test CGPA:</span>
              <input
                type="range"
                min="6.5"
                max="9.8"
                step="0.1"
                value={simulatedCgpa}
                onChange={(e) => setSimulatedCgpa(parseFloat(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer h-1"
              />
              <span className="font-mono text-emerald-400 font-bold text-xs">{simulatedCgpa.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. APPLICATION PIPELINE TRACKER & RESUME HEALTH CARD (GRID SPLIT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Horizontal Pipeline Tracker (8 cols) */}
        <div className="lg:col-span-8 pms-card rounded-3xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between pb-4 border-b border-[#162E23] mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F1F5F9]">
                  Live Application Pipeline Tracker
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  Tracking: {primaryAppliedDrive.companyName} — {primaryAppliedDrive.role}
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#F97316]/15 border border-[#F97316]/30 text-[#FB923C] text-xs font-bold font-mono">
              {primaryAppliedDrive.ctc}
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative">
            <div className="overflow-hidden mb-2">
              <div className="grid grid-cols-5 gap-2 relative">
                {pipelineSteps.map((step, idx) => {
                  const isDone = step.status === 'completed';
                  const isCurrent = step.status === 'current';
                  return (
                    <div key={step.id} className="flex flex-col items-center text-center relative">
                      {/* Step Node */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs mb-2 transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                            : isCurrent
                            ? 'bg-[#F97316] text-white shadow-[0_0_16px_rgba(249,115,22,0.5)] ring-4 ring-[#F97316]/20'
                            : 'bg-[#070F0C] border border-[#162E23] text-[#94A3B8]'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4" /> : `0${step.id}`}
                      </div>

                      <div className="font-bold text-xs text-[#F1F5F9] leading-tight">
                        {step.name}
                      </div>
                      <div
                        className={`text-[10px] mt-0.5 ${
                          isCurrent
                            ? 'text-[#FB923C] font-semibold'
                            : isDone
                            ? 'text-emerald-400'
                            : 'text-[#94A3B8]'
                        }`}
                      >
                        {step.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-full bg-[#070F0C] h-1 rounded-full mt-4 overflow-hidden border border-[#162E23]">
              <div className="bg-emerald-500 h-1 rounded-full w-[70%]"></div>
            </div>
          </div>
        </div>

        {/* Resume Health Card (4 cols) */}
        <div className="lg:col-span-4 pms-card rounded-3xl p-6 border border-emerald-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-[#F1F5F9]">Resume Health Card</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                ATS: 94/100
              </span>
            </div>

            <div className="p-3.5 bg-[#070F0C] border border-[#162E23] rounded-2xl mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-[#F1F5F9] truncate">
                  Resume_AaravPatel_2026.pdf
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Stamped with verified CGPA ({simulatedCgpa.toFixed(2)}) and 0 Backlog clearance.
              </p>
            </div>

            {resumeUploadSuccess && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2 mb-3 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Uploaded & parsed new PDF successfully!</span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-[#162E23]">
            {/* Upload New PDF Button */}
            <label className="w-full py-2.5 px-4 bg-[#162E23] hover:bg-[#1D3D30] border border-emerald-500/30 text-[#F1F5F9] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isUploadingResume ? 'Parsing PDF...' : 'Upload New PDF'}</span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={() => onViewResume(student)}
              className="w-full py-2 px-3 text-xs text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Verified PDF Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. JOB OPENINGS GRID */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#F1F5F9] tracking-tight">
              Campus Recruitment Feed
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Automated eligibility engine calculated based on your simulated CGPA ({simulatedCgpa.toFixed(2)})
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2">
            {['All', 'Super Dream', 'Dream', 'Tier-1 Core'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-[#11231B] text-[#94A3B8] border border-[#162E23] hover:text-[#F1F5F9]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards Grid with required ID and Class for Spring Boot REST calls */}
        <div id="jobListContainer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDrives.map((drive) => {
            const isEligible = simulatedCgpa >= drive.minCgpa;

            return (
              <div
                key={drive.id}
                data-drive-id={drive.id}
                data-job-id={drive.id}
                className="pms-card-interactive rounded-3xl p-5 border border-emerald-500/20 flex flex-col justify-between relative group"
              >
                {/* Urgent Deadline Glow */}
                {drive.isUrgent && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F97316]/15 border border-[#F97316]/30 text-[#FB923C] text-[10px] font-bold font-mono">
                    <Clock className="w-3 h-3 text-[#F97316]" />
                    <span>{drive.closesInText}</span>
                  </div>
                )}

                <div>
                  {/* Company Header */}
                  <div className="flex items-start gap-3.5 mb-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-xs tracking-wider shrink-0 ${drive.logoBg}`}
                    >
                      {drive.companyLogo}
                    </div>
                    <div className="min-w-0 pr-12">
                      <h4 className="font-extrabold text-base text-[#F1F5F9] group-hover:text-emerald-300 transition-colors truncate">
                        {drive.companyName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{drive.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Role Title */}
                  <h5 className="font-bold text-sm text-[#F1F5F9] mb-1">
                    {drive.role}
                  </h5>
                  <p className="text-xs text-[#94A3B8] line-clamp-2 mb-4 leading-relaxed">
                    {drive.description}
                  </p>

                  {/* CTC Callout with Warm Orange Highlight */}
                  <div className="p-3 bg-[#070F0C] border border-[#162E23] rounded-2xl mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Compensation</span>
                      <div className="text-xl font-black font-mono text-[#F97316] drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                        {drive.ctc}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Min CGPA Cutoff</span>
                      <div className="text-xs font-mono font-bold text-emerald-400">
                        ≥ {drive.minCgpa.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions and Dynamic Eligibility */}
                <div className="pt-3.5 border-t border-[#162E23] flex items-center justify-between gap-3">
                  {/* Dynamic Eligibility Badge */}
                  <div>
                    {isEligible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Eligible ({simulatedCgpa.toFixed(1)} ≥ {drive.minCgpa})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                        <span>Cutoff Locked</span>
                      </span>
                    )}
                  </div>

                  {/* Apply CTA Button */}
                  {drive.hasApplied ? (
                    <button
                      disabled
                      className="px-3.5 py-1.5 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{drive.applicationStage || 'Applied'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onApplyJob(drive)}
                      disabled={!isEligible}
                      data-drive-id={drive.id}
                      data-job-id={drive.id}
                      className={`apply-btn px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-[0.98] flex items-center gap-1.5 ${
                        isEligible
                          ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_0_16px_rgba(249,115,22,0.4)]'
                          : 'bg-[#162E23] text-[#94A3B8] border border-[#162E23] cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span>One-Click Apply</span>
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
  );
};
