import React from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle, 
  Sparkles, 
  FileCheck2, 
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
    <div className="apple-card p-5 mb-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Student Identity & Academic Profile */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 border border-[#0071E3]/20 flex items-center justify-center font-bold text-lg text-[#0071E3]">
              {student.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="absolute -bottom-1 -right-1 p-1 bg-[#34C759] rounded-full ring-2 ring-white">
              <CheckCircle className="w-2.5 h-2.5 text-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                {student.name}
              </h2>
              <span className="font-mono text-xs text-[#0071E3] bg-[#0071E3]/10 border border-[#0071E3]/20 px-2 py-0.5 rounded-md font-semibold">
                {student.rollNo}
              </span>
              <span className="text-[11px] text-[#28A745] bg-[#34C759]/10 px-2 py-0.5 rounded-full font-medium">
                Verified ERP
              </span>
            </div>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              B.Tech Computer Science & Engineering • Class of 2026 • Verified University Registry
            </p>
          </div>
        </div>

        {/* Center: Academic Metrics Ribbon Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#FBFBFC] border border-black/[0.06] p-2.5 rounded-2xl">
          {/* CGPA Stat */}
          <div className="flex flex-col px-3 py-1 border-r border-black/[0.06] last:border-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
              Cumulative CGPA
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono text-[#1D1D1F]">
                {student.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] text-[#86868B]">/ 10.0</span>
            </div>
          </div>

          {/* Branch & Sec */}
          <div className="flex flex-col px-3 py-1 border-r border-black/[0.06] last:border-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
              Branch & Section
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xs font-bold text-[#1D1D1F]">
                {student.branch} ({student.section})
              </span>
            </div>
          </div>

          {/* Backlogs */}
          <div className="flex flex-col px-3 py-1 border-r border-black/[0.06] last:border-none">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
              Backlog Status
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-[#34C759] font-mono">
                0 Active
              </span>
              <span className="text-[10px] text-[#34C759] font-medium">Clear</span>
            </div>
          </div>

          {/* Dream Tier Status */}
          <div className="flex flex-col px-3 py-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#D97706]">
              Dream Policy
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#D97706] font-mono">
                <Sparkles className="w-3 h-3 text-[#FF9500]" />
                Super Dream
              </span>
            </div>
          </div>
        </div>

        {/* Right: Resume & Offer Quota Action */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden xl:block">
            <div className="text-xs font-semibold text-[#1D1D1F]">
              Offer Cap: {student.currentOffers}/{student.maxOffersAllowed} Max
            </div>
            <div className="text-[11px] text-[#0071E3] font-medium">
              1 Slot Reserved for ≥ 25 LPA
            </div>
          </div>

          <button
            onClick={() => onViewResume(student)}
            data-student-id={student.rollNo}
            className="flex items-center gap-2 px-3.5 py-2 bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] text-[#1D1D1F] rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-[#0071E3]" />
            <span>Verified PDF Resume</span>
            <ExternalLink className="w-3 h-3 text-[#86868B]" />
          </button>
        </div>
      </div>
    </div>
  );
};
