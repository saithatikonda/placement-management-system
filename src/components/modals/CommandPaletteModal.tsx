import React, { useState, useEffect } from 'react';
import { Search, Building2, User, Sparkles, Filter, X } from 'lucide-react';
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled in parent
      }
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#13221C] border border-[#1D362C] rounded-2xl w-full max-w-xl shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="px-4 py-3.5 border-b border-[#1D362C] flex items-center gap-3 bg-[#0B1612]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a student roll no, company drive, or command..."
            className="w-full bg-transparent text-sm text-[#F1F5F9] placeholder:text-[#94A3B8] outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-[#94A3B8] hover:text-[#F1F5F9] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-4">
          {/* Drives Section */}
          {filteredDrives.length > 0 && (
            <div>
              <div className="text-[10px] uppercase font-bold text-[#94A3B8] px-2 py-1 flex items-center gap-1.5">
                <Building2 className="w-3 h-3 text-emerald-400" />
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
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#182C24] transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-[#F1F5F9] group-hover:text-emerald-300">
                        {d.companyName}
                      </span>
                      <span className="text-[#94A3B8] ml-2">{d.role}</span>
                    </div>
                    <span className="font-mono font-bold text-[#F97316] text-[11px]">
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
              <div className="text-[10px] uppercase font-bold text-[#94A3B8] px-2 py-1 flex items-center gap-1.5">
                <User className="w-3 h-3 text-emerald-400" />
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
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-[#182C24] transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-emerald-400 font-bold">{c.rollNo}</span>
                      <span className="font-semibold text-[#F1F5F9]">{c.name}</span>
                      <span className="text-[#94A3B8] text-[11px]">({c.branch})</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-bold text-[11px]">
                      {c.cgpa.toFixed(2)} CGPA
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredDrives.length === 0 && filteredCandidates.length === 0 && (
            <div className="p-8 text-center text-xs text-[#94A3B8]">
              No results found for "{query}". Try searching by roll number or company name.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#1D362C] bg-[#0B1612] text-[10px] text-[#94A3B8] flex items-center justify-between">
          <span>Navigate with mouse or arrow keys</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
