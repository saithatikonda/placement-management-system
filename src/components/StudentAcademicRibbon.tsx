import React from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  FileCheck2, 
  TrendingUp, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { StudentProfile } from '../types/pms';

interface StudentAcademicRibbonProps {
  student: StudentProfile;
  onViewResume: (student: StudentProfile) => void;
}

export const StudentAcademicRibbon: React.FC<StudentAcademicRibbonProps> = ({
  student,
  onViewResume,
}) => {
  return (
    <div className="pms-card rounded-2xl p-5 mb-6 relative overflow-hidden">
      {/* Background radial flares */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#F97316]/10 to-transparent pointer-events-none rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none rounded-full blur-3xl"></div>

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Student Identity & Academic Profile */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-[#0B1612] border-2 border-emerald-500/40 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.25)] flex items-center justify-center">
              <span className="font-extrabold text-lg text-emerald-400">
                {student.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full ring-2 ring-[#13221C]">
              <CheckCircle className="w-2.5 h-2.5 text-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#F1F5F9] tracking-tight">
                {student.name}
              </h2>
              <span className="font-mono text-xs text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded">
                {student.rollNo}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              B.Tech Computer Science & Engineering • Class of 2026 • Verified Institutional Registry
            </p>
          </div>
        </div>

        {/* Center: Academic Metrics Ribbon Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0B1612]/70 border border-[#1D362C] p-2.5 rounded-xl">
          {/* CGPA Stat */}
          <div className="flex flex-col px-3 py-1 border-r border-[#1D362C]/60 last:border-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Cumulative CGPA
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono text-emerald-400 tracking-tight">
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#94A3B8]">/ 10.0</span>
            </div>
          </div>

          {/* Branch & Sec */}
          <div className="flex flex-col px-3 py-1 border-r border-[#1D362C]/60 last:border-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Branch & Section
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-sm font-bold text-[#F1F5F9]">
                {student.branch} ({student.section})
              </span>
            </div>
          </div>

          {/* Backlogs */}
          <div className="flex flex-col px-3 py-1 border-r border-[#1D362C]/60 last:border-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Backlog Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-emerald-400 font-mono">
                0 Active
              </span>
              <span className="text-[10px] text-emerald-400/80">Clean Track</span>
            </div>
          </div>

          {/* Dream Tier Status with warm orange highlight */}
          <div className="flex flex-col px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#FB923C]">
              Dream Policy
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F97316] font-mono">
                <Sparkles className="w-3 h-3 text-[#F97316]" />
                Super Dream
              </span>
            </div>
          </div>
        </div>

        {/* Right: Resume & Offer Quota Action */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden xl:block">
            <div className="text-xs font-semibold text-[#F1F5F9]">
              Offer Cap: {student.currentOffers}/{student.maxOffersAllowed} Max
            </div>
            <div className="text-[11px] text-emerald-400">
              1 Slot Reserved for ≥ 25 LPA
            </div>
          </div>

          <button
            onClick={() => onViewResume(student)}
            data-student-id={student.rollNo}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-300 rounded-xl text-xs font-bold shadow-[0_0_16px_rgba(16,185,129,0.15)] active:scale-[0.98] transition-all"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Verified PDF Resume</span>
            <ExternalLink className="w-3 h-3 text-emerald-400/80" />
          </button>
        </div>
      </div>
    </div>
  );
};
