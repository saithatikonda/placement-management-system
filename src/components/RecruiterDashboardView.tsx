import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Award, 
  PlusCircle, 
  Download, 
  ArrowRightCircle, 
  FileCheck2, 
  Search, 
  XCircle,
  Briefcase
} from 'lucide-react';
import { CandidateEntry } from '../types/pms';

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
    showToast(`✓ Advanced ${name} to next round`);
  };

  // Action: Shortlist candidate
  const handleShortlist = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, driveStage: 'OA Cleared' } : c))
    );
    showToast(`✓ Added ${name} to shortlist`);
  };

  // Action: Roll Offer
  const handleRollOffer = (id: string, name: string) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, driveStage: 'Offered' } : c))
    );
    showToast(`🎉 Offer rolled out to ${name}!`);
  };

  // Action: Reject candidate
  const handleReject = (id: string, name: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    showToast(`Candidate ${name} archived from roster`);
  };

  // Download all resumes mock
  const handleBulkDownloadResumes = () => {
    showToast(`Downloading ${filteredApplicants.length} candidate dossiers (.ZIP)...`);
  };

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white/95 backdrop-blur-xl border border-black/[0.08] text-[#1D1D1F] px-4 py-3 rounded-2xl shadow-[0_12px_32px_rgba(0,0,0,0.12)] flex items-center gap-2.5 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#0071E3]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Recruiter Header Bar - Apple Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 apple-card p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-base">
            MSFT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">
                {companyName} Talent Acquisition Console
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-mono text-xs font-semibold">
                Tier-1 Day 1
              </span>
            </div>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              University Campus Recruitment Drive • Class of 2026 • ATS Real-Time Sync
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkDownloadResumes}
            className="px-4 py-2 bg-black/[0.04] hover:bg-black/[0.08] border border-black/[0.06] text-[#1D1D1F] rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0071E3]" />
            <span>Download All Dossiers (.ZIP)</span>
          </button>

          <button
            onClick={onPostNewDrive}
            className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>+ Create Job Drive</span>
          </button>
        </div>
      </div>

      {/* 4 RECRUITER METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#86868B]">Active Drives</span>
              <div className="text-3xl font-bold font-mono text-[#1D1D1F] mt-1">3</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-[#6E6E73] mt-3 font-medium">SDE-1, Cloud Infra, AI Core</span>
        </div>

        {/* Metric 2 */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#86868B]">Applicants Received</span>
              <div className="text-3xl font-bold font-mono text-[#1D1D1F] mt-1">380</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-[#34C759] mt-3 font-semibold">100% ERP Verified Candidates</span>
        </div>

        {/* Metric 3 */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#86868B]">Shortlisted</span>
              <div className="text-3xl font-bold font-mono text-[#1D1D1F] mt-1">142</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#34C759]/10 text-[#34C759] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-[#6E6E73] mt-3 font-medium">Cleared Online Assessment</span>
        </div>

        {/* Metric 4 */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] uppercase font-semibold text-[#86868B]">Offers Rolled</span>
              <div className="text-3xl font-bold font-mono text-[#0071E3] mt-1">18</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <span className="text-[11px] text-[#6E6E73] mt-3 font-medium">44.0 LPA Compensation Package</span>
        </div>
      </div>

      {/* APPLICANT REVIEW TABLE CARD */}
      <div className="apple-card overflow-hidden">
        {/* Table Filter Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] flex flex-wrap items-center justify-between gap-4 bg-[#FBFBFC]">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-base text-[#1D1D1F]">
              Applicant Review & Round Advancement
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-black/[0.05] text-[#1D1D1F] font-mono text-xs font-semibold">
              {filteredApplicants.length} Candidates
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Stage filter - Apple Segmented Control */}
            <div className="bg-black/[0.05] p-1 rounded-full flex items-center gap-1">
              {['All', 'Shortlisted', 'Interview', 'Offered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStage(st)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedStage === st
                      ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                      : 'text-[#6E6E73] hover:text-[#1D1D1F]'
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
                className="pl-8 pr-3 py-1.5 bg-white border border-black/[0.08] focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] placeholder:text-[#A1A1A6] w-56 outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FBFBFC] text-[#86868B] uppercase text-[10px] tracking-wider border-b border-black/[0.06] h-10">
                <th className="px-6 py-2.5 font-bold">Candidate Name</th>
                <th className="px-6 py-2.5 font-bold">Roll No</th>
                <th className="px-6 py-2.5 font-bold">Branch</th>
                <th className="px-6 py-2.5 font-bold">CGPA</th>
                <th className="px-6 py-2.5 font-bold">Current Stage</th>
                <th className="px-6 py-2.5 font-bold">Dossier</th>
                <th className="px-6 py-2.5 font-bold text-right pr-6">Recruiter Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-[#1D1D1F]">
              {filteredApplicants.map((cand) => (
                <tr key={cand.id} className="hover:bg-black/[0.02] transition-colors h-14">
                  {/* Name */}
                  <td className="px-6 py-3 font-semibold">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#0071E3]/10 text-[#0071E3] font-bold text-xs flex items-center justify-center shrink-0">
                        {cand.initials}
                      </div>
                      <div>
                        <div className="font-bold text-[#1D1D1F]">{cand.name}</div>
                        <div className="text-[11px] text-[#6E6E73]">{cand.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Roll No */}
                  <td className="px-6 py-3 font-mono font-medium text-[#1D1D1F]">
                    {cand.rollNo}
                  </td>

                  {/* Branch */}
                  <td className="px-6 py-3">
                    <span className="px-2 py-0.5 rounded-md bg-black/[0.04] text-[#1D1D1F] font-mono text-[11px] font-semibold">
                      {cand.branch}
                    </span>
                  </td>

                  {/* CGPA */}
                  <td className="px-6 py-3 font-mono font-bold text-[#1D1D1F]">
                    {cand.cgpa.toFixed(2)}
                  </td>

                  {/* Stage */}
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        cand.driveStage === 'Offered'
                          ? 'bg-[#34C759]/10 text-[#28A745]'
                          : cand.driveStage.includes('Tech')
                          ? 'bg-[#0071E3]/10 text-[#0071E3]'
                          : 'bg-[#FF9500]/10 text-[#D97706]'
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] transition-colors text-xs font-semibold cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>View Dossier</span>
                    </button>
                  </td>

                  {/* Actions: Shortlist, Move to Interview, Roll Offer, Reject */}
                  <td className="px-6 py-3 text-right pr-6">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Shortlist */}
                      {cand.driveStage !== 'OA Cleared' && (
                        <button
                          onClick={() => handleShortlist(cand.id, cand.name)}
                          className="px-2.5 py-1 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Shortlist
                        </button>
                      )}

                      {/* Move to Interview */}
                      {cand.driveStage !== 'Offered' && (
                        <button
                          onClick={() => handleAdvanceStage(cand.id, cand.name)}
                          className="px-2.5 py-1 rounded-lg bg-[#0071E3]/10 hover:bg-[#0071E3]/20 text-[#0071E3] text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>Advance</span>
                          <ArrowRightCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Roll Offer */}
                      {cand.driveStage !== 'Offered' ? (
                        <button
                          onClick={() => handleRollOffer(cand.id, cand.name)}
                          className="px-2.5 py-1 rounded-lg bg-[#34C759] hover:bg-[#28A745] text-white text-[11px] font-semibold transition-all shadow-[0_2px_6px_rgba(52,199,89,0.3)] flex items-center gap-1 cursor-pointer"
                        >
                          <span>Roll Offer</span>
                        </button>
                      ) : (
                        <span className="text-[11px] font-bold text-[#34C759] px-2 py-0.5">
                          ✓ Offered
                        </span>
                      )}

                      {/* Reject */}
                      <button
                        onClick={() => handleReject(cand.id, cand.name)}
                        className="p-1 rounded-lg text-[#86868B] hover:text-[#FF3B30] hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Archive candidate"
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
