import React, { useState, useEffect } from 'react';
import { Search, Building2, User, X } from 'lucide-react';
import { JobDrive, CandidateEntry } from '../../types/pms';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  drives: JobDrive[];
  candidates: CandidateEntry[];
  onSelectDrive: (drive: JobDrive) => void;
  onSelectCandidate: (candidate: CandidateEntry) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  drives,
  candidates,
  onSelectDrive,
  onSelectCandidate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDrives = drives.filter(
    (d) =>
      d.companyName.toLowerCase().includes(query.toLowerCase()) ||
      d.role.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.rollNo.toLowerCase().includes(query.toLowerCase()) ||
      c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/20 backdrop-blur-md">
      <div className="apple-card w-full max-w-xl shadow-[0_24px_64px_rgba(0,0,0,0.16)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Spotlight Search Bar */}
        <div className="px-4 py-3.5 border-b border-black/[0.06] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#0071E3] shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search drives, candidate names, roll numbers..."
            className="w-full bg-transparent text-sm text-[#1D1D1F] placeholder:text-[#A1A1A6] outline-none font-medium"
          />
          <button
            onClick={onClose}
            className="px-2 py-0.5 text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] rounded-md text-xs font-mono transition-colors cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3">
          {/* Drives Section */}
          {filteredDrives.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-[#86868B] px-2 py-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#0071E3]" />
                <span>Recruitment Drives ({filteredDrives.length})</span>
              </div>
              <div className="space-y-1">
                {filteredDrives.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDrive(d);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-black/[0.04] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <span className="font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">
                        {d.companyName}
                      </span>
                      <span className="text-[#6E6E73] ml-2">{d.role}</span>
                    </div>
                    <span className="font-mono font-bold text-[#0071E3] text-[11px]">
                      {d.ctc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Candidates Section */}
          {filteredCandidates.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-[#86868B] px-2 py-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#34C759]" />
                <span>Candidates & Students ({filteredCandidates.length})</span>
              </div>
              <div className="space-y-1">
                {filteredCandidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCandidate(c);
                      onClose();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-black/[0.04] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#0071E3] font-semibold">{c.rollNo}</span>
                      <span className="font-semibold text-[#1D1D1F]">{c.name}</span>
                      <span className="text-[#86868B] text-[11px]">({c.branch})</span>
                    </div>
                    <span className="font-mono text-[#1D1D1F] font-semibold text-[11px]">
                      {c.cgpa.toFixed(2)} CGPA
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredDrives.length === 0 && filteredCandidates.length === 0 && (
            <div className="p-8 text-center text-xs text-[#86868B]">
              No results found for "{query}". Try searching by roll number or company name.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-black/[0.06] bg-[#FBFBFC] text-[11px] text-[#86868B] flex items-center justify-between">
          <span>Click to select or view details</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
