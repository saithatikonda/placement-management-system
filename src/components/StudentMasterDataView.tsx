import React, { useState } from 'react';
import { GraduationCap, Search, FileCheck2, Filter, Award, CheckCircle2, ChevronRight, User } from 'lucide-react';
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
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>Institutional Student Database & Academic Registrar</span>
        </div>
        <h2 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">
          Student Master Registry (2026 Batch)
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Official verified university records, CGPA validations, backlog clearances, and portfolio dossiers.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="pms-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-[#1D362C]">
        <div className="flex items-center gap-2">
          {['All', 'CSE', 'IT', 'ECE', 'EEE'].map((br) => (
            <button
              key={br}
              onClick={() => setSelectedBranch(br)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedBranch === br
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
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
            className="pl-8 pr-3 py-1.5 bg-[#0B1612] border border-[#1D362C] focus:border-emerald-500/50 rounded-lg text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] w-64 outline-none"
          />
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="pms-card rounded-2xl p-4.5 border border-[#1D362C] hover:border-emerald-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${c.avatarColor}`}
                  >
                    {c.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9]">{c.name}</h3>
                    <span className="font-mono text-[11px] text-[#94A3B8]">{c.email}</span>
                  </div>
                </div>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0B1612] border border-[#1D362C] text-emerald-400 font-bold">
                  {c.rollNo}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#0B1612] border border-[#1D362C] rounded-xl text-center mb-3">
                <div>
                  <span className="text-[10px] text-[#94A3B8] uppercase">Branch</span>
                  <div className="font-bold text-xs text-[#F1F5F9]">{c.branch} ({c.section})</div>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] uppercase">CGPA</span>
                  <div className="font-mono font-bold text-xs text-emerald-400">
                    {c.cgpa.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-[#94A3B8] uppercase">Backlogs</span>
                  <div className="font-bold text-xs text-emerald-400">0 Active</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1D362C] flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified ERP
              </span>
              <button
                onClick={() => onViewResume(c)}
                className="px-3 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Dossier</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
