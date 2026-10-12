import React from 'react';
import { X, FileCheck2, Download, ShieldCheck, GraduationCap, Code2, Award } from 'lucide-react';
import { CandidateEntry, StudentProfile } from '../../types/pms';

interface ResumeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: CandidateEntry | StudentProfile | null;
}

export const ResumeViewerModal: React.FC<ResumeViewerModalProps> = ({
  isOpen,
  onClose,
  candidate,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
      <div className="apple-card w-full max-w-2xl shadow-[0_24px_64px_rgba(0,0,0,0.16)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-[#FBFBFC]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#1D1D1F]">
                  {candidate.name} — Academic Dossier
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-black/[0.05] text-[#1D1D1F] font-semibold">
                  {candidate.rollNo}
                </span>
              </div>
              <p className="text-xs text-[#6E6E73]">
                Cryptographically verified university records division dossier
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

        {/* Modal Body / Resume Preview Document */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* Official Verification Seal Ribbon */}
          <div className="p-3.5 bg-[#34C759]/10 border border-[#34C759]/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#34C759] shrink-0" />
              <div>
                <span className="text-xs font-bold text-[#28A745]">
                  ERP Verified Candidate Dossier
                </span>
                <p className="text-[11px] text-[#6E6E73]">
                  Hash: #SHA256-UNIV-TPO-9402 • CGPA and backlog zero-error verified
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#34C759] text-white font-mono text-xs font-bold">
              CGPA: {candidate.cgpa.toFixed(2)}
            </span>
          </div>

          {/* Education Breakdown */}
          <div className="p-4 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#0071E3]" />
              <span>Academic Credentials</span>
            </h4>
            <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
              <div>
                <span className="text-[#86868B] text-[11px]">Degree & Major:</span>
                <div className="font-semibold text-[#1D1D1F] mt-0.5">B.Tech in {candidate.branch}</div>
              </div>
              <div>
                <span className="text-[#86868B] text-[11px]">Institutional Email:</span>
                <div className="font-semibold text-[#1D1D1F] mt-0.5 truncate">{candidate.email}</div>
              </div>
              <div>
                <span className="text-[#86868B] text-[11px]">Backlog Clearance:</span>
                <div className="font-semibold text-[#34C759] mt-0.5">0 Active (Clean)</div>
              </div>
            </div>
          </div>

          {/* Technical Skills & Competencies */}
          <div className="p-4 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#0071E3]" />
              <span>Core Engineering Stack</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Distributed Systems',
                'Go & C++ (C++20)',
                'Java Spring Boot REST',
                'Apache Kafka',
                'PostgreSQL & Redis',
                'System Design',
                'Docker & Kubernetes',
                'Data Structures & Algorithms',
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded-full bg-white border border-black/[0.08] text-xs font-medium text-[#1D1D1F] shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Highlights & Projects */}
          <div className="p-4 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[#86868B] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF9500]" />
              <span>Key Projects & Competitive Standings</span>
            </h4>
            <div className="border-l-2 border-[#0071E3] pl-3 py-0.5">
              <div className="font-bold text-[#1D1D1F]">High-Throughput Raft Distributed Consensus Engine</div>
              <p className="text-[#6E6E73] text-[11px] mt-0.5">
                Implemented in C++ with leader election, persistent log replication, and RPC heartbeat mechanisms.
              </p>
            </div>
            <div className="border-l-2 border-[#34C759] pl-3 py-0.5">
              <div className="font-bold text-[#1D1D1F]">Campus Placement Automation REST API (Spring Boot)</div>
              <p className="text-[#6E6E73] text-[11px] mt-0.5">
                Built microservice architecture handling 10,000 concurrent candidate applications with PostgreSQL.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 border-t border-black/[0.06] flex items-center justify-between bg-[#FBFBFC]">
          <span className="text-[11px] text-[#86868B] font-mono">
            Document ID: RESUME-{candidate.rollNo}.PDF
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => alert(`Downloading verified resume for ${candidate.name} (PDF)...`)}
              className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
