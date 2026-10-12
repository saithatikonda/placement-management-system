import React, { useState } from 'react';
import { GraduationCap, Search, FileCheck2, CheckCircle2 } from 'lucide-react';
import { CandidateEntry, StudentProfile } from '../types/pms';

interface StudentMasterDataViewProps {
  candidates: CandidateEntry[];
  student: StudentProfile;
  onViewResume: (candidate: CandidateEntry | StudentProfile) => void;
}

export const StudentMasterDataView: React.FC<StudentMasterDataViewProps> = ({
  candidates,
  student,
  onViewResume,
}) => {
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('All');

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchBranch = selectedBranch === 'All' || c.branch === selectedBranch;
    return matchSearch && matchBranch;
  });

  return (
    <div className="flex flex-col gap-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-[#0071E3] font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Institutional Student Database & Academic Registrar</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
          Student Master Registry (2026 Batch)
        </h2>
        <p className="text-xs text-[#6E6E73]">
          Official verified university records, CGPA validations, backlog clearances, and portfolio dossiers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="apple-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="bg-black/[0.05] p-1 rounded-full flex items-center gap-1">
          {['All', 'CSE', 'IT', 'ECE', 'EEE'].map((br) => (
            <button
              key={br}
              onClick={() => setSelectedBranch(br)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedBranch === br
                  ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {br}
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or roll..."
            className="pl-8 pr-3 py-1.5 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] placeholder:text-[#A1A1A6] w-64 outline-none transition-all"
          />
          <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="apple-card-hover p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs flex items-center justify-center shrink-0">
                    {c.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1D1D1F]">{c.name}</h3>
                    <span className="font-mono text-[11px] text-[#6E6E73]">{c.email}</span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-black/[0.04] text-[#1D1D1F] font-semibold">
                  {c.rollNo}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#FBFBFC] border border-black/[0.06] rounded-xl text-center mb-3.5">
                <div>
                  <span className="text-[10px] text-[#86868B] uppercase font-semibold">Branch</span>
                  <div className="font-semibold text-xs text-[#1D1D1F] mt-0.5">{c.branch} ({c.section})</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#86868B] uppercase font-semibold">CGPA</span>
                  <div className="font-mono font-bold text-xs text-[#0071E3] mt-0.5">
                    {c.cgpa.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#86868B] uppercase font-semibold">Backlogs</span>
                  <div className="font-semibold text-xs text-[#34C759] mt-0.5">0 Active</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-[#34C759] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#34C759]" />
                Verified ERP
              </span>
              <button
                onClick={() => onViewResume(c)}
                className="px-3 py-1.5 bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>View Dossier</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
