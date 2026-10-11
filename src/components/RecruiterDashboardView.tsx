import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Award, 
  PlusCircle, 
  Download, 
  ArrowRight, 
  XCircle, 
  ArrowRightCircle, 
  FileCheck2, 
  Search, 
  Filter, 
  Sparkles, 
  Briefcase,
  ChevronDown,
  Calendar,
  Send
} from 'lucide-react';
import { CandidateEntry, JobDrive } from '../types/pms';

interface RecruiterDashboardViewProps {
  candidates: CandidateEntry[];
  setCandidates: React.Dispatch<React.SetStateAction<CandidateEntry[]>>;
  companyName?: string;
  onPostNewDrive: () => void;
  onViewResume: (candidate: CandidateEntry) => void;
}

export const RecruiterDashboardView: React.FC<RecruiterDashboardViewProps> = ({
  candidates,
  setCandidates,
  companyName = 'Microsoft IDC',
  onPostNewDrive,
  onViewResume,
}) => {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered applicants
  const filteredApplicants = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());

    const matchStage =
      selectedStage === 'All' ||
      (selectedStage === 'Shortlisted' && c.driveStage === 'OA Cleared') ||
      (selectedStage === 'Interview' && c.driveStage.includes('Tech')) ||
      (selectedStage === 'Offered' && c.driveStage === 'Offered');

    return matchSearch && matchStage;
  });

  // Action: Move candidate to next interview stage
  const handleAdvanceStage = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const flow: Record<string, CandidateEntry['driveStage']> = {
            'Online Assessment': 'OA Cleared',
            'OA Cleared': 'Tech Round 1',
            'Tech Round 1': 'Tech Round 2',
            'Tech Round 2': 'HR Interview',
            'HR Interview': 'Offered',
            'Offered': 'Offered',
            'Shortlisted': 'Tech Round 1',
          };
          const next = flow[c.driveStage] || 'Tech Round 1';
          return { ...c, driveStage: next };
        }
        return c;
      })
    );
    showToast(`✓ Advanced ${name} to next interview round!`);
  };

  // Action: Shortlist candidate
  const handleShortlist = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, driveStage: 'OA Cleared' } : c))
    );
    showToast(`✓ Candidate ${name} added to company shortlist!`);
  };

  // Action: Roll Offer
  const handleRollOffer = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, driveStage: 'Offered' } : c))
    );
    showToast(`🎉 Formal Job Offer rolled out to ${name}!`);
  };

  // Action: Reject candidate
  const handleReject = (id: string, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    showToast(`Candidate ${name} archived from applicant roster.`);
  };

  // Download all resumes mock
  const handleBulkDownloadResumes = () => {
    showToast(`Archiving and downloading ${filteredApplicants.length} verified candidate resumes (.ZIP)...`);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#11231B] border border-emerald-500/50 text-[#F1F5F9] px-4 py-3 rounded-2xl shadow-[0_16px_36px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Recruiter Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pms-card rounded-3xl p-6 border border-emerald-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#070F0C] border-2 border-[#F97316]/40 flex items-center justify-center font-extrabold text-sm text-[#F97316] shadow-[0_0_20px_rgba(249,115,22,0.25)]">
            MSFT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-[#F1F5F9] tracking-tight">
                {companyName} Talent Acquisition Console
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
                Tier-1 Day 1
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              University Campus Recruitment Drive (Class of 2026) • Connected to ATS API
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkDownloadResumes}
            className="px-4 py-2 bg-[#070F0C] hover:bg-[#162E23] border border-[#162E23] text-[#F1F5F9] rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download All Resumes (.ZIP)</span>
          </button>

          <button
            onClick={onPostNewDrive}
            className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ Create Job Drive</span>
          </button>
        </div>
      </div>

      {/* 4 RECRUITER METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="pms-card rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#94A3B8]">Total Active Drives</span>
              <div className="text-3xl font-extrabold font-mono text-[#F1F5F9] mt-1">3</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-[#94A3B8] mt-3">SDE-1, Cloud Infra, AI Systems</span>
        </div>

        {/* Metric 2 */}
        <div className="pms-card rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#94A3B8]">Applicants Received</span>
              <div className="text-3xl font-extrabold font-mono text-[#F1F5F9] mt-1">380</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 mt-3 font-medium">100% ERP Verified Records</span>
        </div>

        {/* Metric 3 */}
        <div className="pms-card rounded-2xl p-5 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#94A3B8]">Shortlisted Candidates</span>
              <div className="text-3xl font-extrabold font-mono text-[#F1F5F9] mt-1">142</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-[#94A3B8] mt-3">Cleared Online Assessment</span>
        </div>

        {/* Metric 4 with Warm Orange Accent */}
        <div className="pms-card rounded-2xl p-5 border border-[#F97316]/30 flex flex-col justify-between shadow-[0_8px_24px_rgba(249,115,22,0.1)]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-bold text-[#FB923C]">Offers Released</span>
              <div className="text-3xl font-extrabold font-mono text-[#F97316] mt-1 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                18
              </div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-[#94A3B8] mt-3">44.0 LPA Compensation Package</span>
        </div>
      </div>

      {/* APPLICANT REVIEW TABLE CARD */}
      <div className="pms-card rounded-3xl overflow-hidden border border-emerald-500/20">
        {/* Table Filter Header */}
        <div className="px-6 py-4 border-b border-[#162E23] flex flex-wrap items-center justify-between gap-4 bg-[#070F0C]">
          <div className="flex items-center gap-3">
            <h3 className="font-extrabold text-base text-[#F1F5F9]">
              Applicant Review & Pipeline Advancement
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
              {filteredApplicants.length} Candidates
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Stage filter */}
            <div className="flex items-center gap-1.5">
              {['All', 'Shortlisted', 'Interview', 'Offered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedStage === st
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#11231B] text-[#94A3B8] border border-[#162E23] hover:text-[#F1F5F9]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate name or roll..."
                className="pl-8 pr-3 py-1.5 bg-[#11231B] border border-[#162E23] focus:border-emerald-500/50 rounded-xl text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] w-56 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#070F0C] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#162E23] h-10">
                <th className="px-6 py-2.5 font-bold">Candidate Name</th>
                <th className="px-6 py-2.5 font-bold">Roll No</th>
                <th className="px-6 py-2.5 font-bold">Branch</th>
                <th className="px-6 py-2.5 font-bold">CGPA</th>
                <th className="px-6 py-2.5 font-bold">Application Stage</th>
                <th className="px-6 py-2.5 font-bold">Resume Dossier</th>
                <th className="px-6 py-2.5 font-bold text-right pr-6">Recruiter Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#162E23] text-[#F1F5F9]">
              {filteredApplicants.map((cand) => (
                <tr key={cand.id} className="hover:bg-[#162E23]/60 transition-colors h-14">
                  {/* Name */}
                  <td className="px-6 py-3 font-semibold">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${cand.avatarColor}`}>
                        {cand.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[#F1F5F9]">{cand.name}</div>
                        <div className="text-[11px] text-[#94A3B8]">{cand.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="px-6 py-3 font-mono font-medium text-emerald-400">
                    {cand.rollNo}
                  </td>

                  {/* Branch */}
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded bg-[#070F0C] border border-[#162E23] font-mono text-[11px] font-bold">
                      {cand.branch}
                    </span>
                  </td>

                  {/* CGPA */}
                  <td className="px-6 py-3 font-mono font-extrabold text-emerald-300">
                    {cand.cgpa.toFixed(2)}
                  </td>

                  {/* Stage */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        cand.driveStage === 'Offered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : cand.driveStage.includes('Tech')
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {cand.driveStage}
                    </span>
                  </td>

                  {/* Resume */}
                  <td className="px-6 py-3">
                    <button
                      onClick={() => onViewResume(cand)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#070F0C] border border-[#162E23] hover:border-emerald-500/40 text-emerald-400 hover:text-emerald-300 transition-colors text-xs font-semibold"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>Verified PDF</span>
                    </button>
                  </td>

                  {/* Actions: Shortlist, Move to Interview, Roll Offer, Reject */}
                  <td className="px-6 py-3 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Shortlist */}
                      <button
                        onClick={() => handleShortlist(cand.id, cand.name)}
                        className="px-2.5 py-1 rounded-lg bg-[#070F0C] hover:bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold transition-colors"
                      >
                        Shortlist
                      </button>

                      {/* Move to Interview */}
                      <button
                        onClick={() => handleAdvanceStage(cand.id, cand.name)}
                        className="px-2.5 py-1 rounded-lg bg-[#070F0C] hover:bg-blue-950/40 border border-blue-500/30 text-blue-300 text-[11px] font-bold transition-colors flex items-center gap-1"
                      >
                        <span>Move Round</span>
                        <ArrowRightCircle className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      {/* Roll Offer */}
                      <button
                        onClick={() => handleRollOffer(cand.id, cand.name)}
                        className="px-2.5 py-1 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] font-extrabold transition-all shadow-[0_0_12px_rgba(249,115,22,0.35)] flex items-center gap-1"
                      >
                        <span>Roll Offer</span>
                      </button>

                      {/* Reject */}
                      <button
                        onClick={() => handleReject(cand.id, cand.name)}
                        className="p-1 rounded-lg text-[#94A3B8] hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                        title="Reject candidate"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
