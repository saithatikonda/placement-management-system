import React, { useState } from 'react';
import { X, Zap, Download, Copy, Check, FileSpreadsheet, Mail, Sparkles } from 'lucide-react';
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
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#13221C] border border-[#1D362C] rounded-2xl w-full max-w-xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1D362C] flex items-center justify-between bg-[#0B1612]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F5F9]">
                Formal Shortlist Dossier ({selectedCandidates.length} Selected)
              </h3>
              <p className="text-xs text-[#94A3B8]">
                {activeDrive.companyName} • {activeDrive.role} ({activeDrive.ctc})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#182C24] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-[#0B1612] border border-[#1D362C] rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Roster Count</span>
              <div className="text-xl font-bold font-mono text-[#F1F5F9] mt-0.5">
                {selectedCandidates.length}
              </div>
            </div>
            <div className="p-3 bg-[#0B1612] border border-[#1D362C] rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#94A3B8]">Avg CGPA</span>
              <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">
                {(
                  selectedCandidates.reduce((acc, c) => acc + c.cgpa, 0) /
                  (selectedCandidates.length || 1)
                ).toFixed(2)}
              </div>
            </div>
            <div className="p-3 bg-[#0B1612] border border-[#1D362C] rounded-xl">
              <span className="text-[10px] uppercase font-bold text-[#FB923C]">Offer Package</span>
              <div className="text-xl font-bold font-mono text-[#F97316] mt-0.5">
                {activeDrive.ctc}
              </div>
            </div>
          </div>

          {/* Candidate Preview List */}
          <div className="p-3 bg-[#0B1612] border border-[#1D362C] rounded-xl max-h-48 overflow-y-auto space-y-2">
            <div className="text-[11px] font-bold uppercase text-[#94A3B8] px-1">
              Included Candidate Profiles
            </div>
            {selectedCandidates.slice(0, 5).map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-xs p-2 bg-[#13221C] border border-[#1D362C] rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-emerald-400 font-bold">{c.rollNo}</span>
                  <span className="text-[#F1F5F9] font-medium">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#94A3B8] font-mono">{c.branch}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                    {c.cgpa.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
            {selectedCandidates.length > 5 && (
              <div className="text-center text-xs text-[#94A3B8] py-1">
                + {selectedCandidates.length - 5} more qualified candidates
              </div>
            )}
          </div>

          {/* Spring Boot REST API integration callout */}
          <div className="p-3 bg-[#0B1612] border border-[#1D362C] rounded-xl flex items-center justify-between text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Spring Boot REST Endpoint:</span>
            </div>
            <code className="text-emerald-400 font-mono text-[11px]">
              POST /api/v1/shortlists/dispatch
            </code>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#1D362C] flex items-center justify-between bg-[#0B1612]">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 bg-[#13221C] hover:bg-[#182C24] border border-[#1D362C] text-[#F1F5F9] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#94A3B8]" />}
              <span>{copied ? 'Copied JSON!' : 'Copy API JSON'}</span>
            </button>
            <button
              onClick={handleDownloadCsv}
              className="px-3 py-1.5 bg-[#13221C] hover:bg-[#182C24] border border-[#1D362C] text-[#F1F5F9] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#94A3B8] hover:text-[#F1F5F9] transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-[0_0_16px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>{dispatched ? 'Dispatching...' : 'Dispatch Roster to HR'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
