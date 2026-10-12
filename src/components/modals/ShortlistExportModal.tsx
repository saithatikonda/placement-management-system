import React, { useState } from 'react';
import { X, Zap, Copy, Check, FileSpreadsheet, Mail } from 'lucide-react';
import { CandidateEntry, JobDrive } from '../../types/pms';

interface ShortlistExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCandidates: CandidateEntry[];
  activeDrive: JobDrive;
}

export const ShortlistExportModal: React.FC<ShortlistExportModalProps> = ({
  isOpen,
  onClose,
  selectedCandidates,
  activeDrive,
}) => {
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  if (!isOpen) return null;

  const exportPayload = {
    recruitmentDriveId: activeDrive.id,
    company: activeDrive.companyName,
    role: activeDrive.role,
    ctc: activeDrive.ctc,
    generatedAt: new Date().toISOString(),
    totalCandidates: selectedCandidates.length,
    candidates: selectedCandidates.map((c) => ({
      rollNo: c.rollNo,
      name: c.name,
      email: c.email,
      branch: c.branch,
      section: c.section,
      cgpa: c.cgpa,
      stage: c.driveStage,
      resumeStatus: c.resumeStatus,
    })),
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(exportPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const headers = ['Roll No', 'Name', 'Email', 'Branch', 'Section', 'CGPA', 'Stage', 'Resume Status'];
    const rows = selectedCandidates.map((c) => [
      c.rollNo,
      `"${c.name}"`,
      c.email,
      c.branch,
      c.section,
      c.cgpa,
      c.driveStage,
      c.resumeStatus,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shortlist_${activeDrive.companyName.toLowerCase().replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDispatch = () => {
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
      <div className="apple-card w-full max-w-xl shadow-[0_24px_64px_rgba(0,0,0,0.16)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-[#FBFBFC]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Formal Shortlist Dossier ({selectedCandidates.length} Selected)
              </h3>
              <p className="text-xs text-[#6E6E73]">
                {activeDrive.companyName} • {activeDrive.role} ({activeDrive.ctc})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl">
              <span className="text-[10px] uppercase font-semibold text-[#86868B]">Roster Count</span>
              <div className="text-xl font-bold font-mono text-[#1D1D1F] mt-0.5">
                {selectedCandidates.length}
              </div>
            </div>
            <div className="p-3 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl">
              <span className="text-[10px] uppercase font-semibold text-[#86868B]">Avg CGPA</span>
              <div className="text-xl font-bold font-mono text-[#0071E3] mt-0.5">
                {(
                  selectedCandidates.reduce((acc, c) => acc + c.cgpa, 0) /
                  (selectedCandidates.length || 1)
                ).toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl">
              <span className="text-[10px] uppercase font-semibold text-[#86868B]">Offer Package</span>
              <div className="text-xl font-bold font-mono text-[#34C759] mt-0.5">
                {activeDrive.ctc}
              </div>
            </div>
          </div>

          {/* Candidate Preview List */}
          <div className="p-3 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl max-h-48 overflow-y-auto space-y-1.5">
            <div className="text-[11px] font-semibold uppercase text-[#86868B] px-1 mb-1">
              Included Candidate Profiles
            </div>
            {selectedCandidates.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-xs p-2.5 bg-white border border-black/[0.06] rounded-xl shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#0071E3] font-semibold">{c.rollNo}</span>
                  <span className="text-[#1D1D1F] font-semibold">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#86868B] font-mono">{c.branch}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#0071E3]/10 text-[#0071E3] font-mono font-bold text-[11px]">
                    {c.cgpa.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {selectedCandidates.length > 5 && (
              <div className="text-center text-xs text-[#86868B] py-1">
                + {selectedCandidates.length - 5} more qualified candidates
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-black/[0.06] flex items-center justify-between bg-[#FBFBFC]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 bg-white hover:bg-black/[0.03] border border-black/[0.08] text-[#1D1D1F] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#34C759]" /> : <Copy className="w-3.5 h-3.5 text-[#86868B]" />}
              <span>{copied ? 'Copied JSON!' : 'Copy API JSON'}</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 bg-white hover:bg-black/[0.03] border border-black/[0.08] text-[#1D1D1F] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#0071E3]" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#6E6E73] hover:text-[#1D1D1F] transition-colors font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>{dispatched ? 'Dispatching...' : 'Dispatch to HR'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
