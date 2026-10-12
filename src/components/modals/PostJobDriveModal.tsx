import React, { useState } from 'react';
import { X, Building2, Sparkles } from 'lucide-react';
import { JobDrive } from '../../types/pms';

interface PostJobDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDrive: (newDrive: Partial<JobDrive>) => void;
}

export const PostJobDriveModal: React.FC<PostJobDriveModalProps> = ({
  isOpen,
  onClose,
  onSaveDrive,
}) => {
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [ctc, setCtc] = useState('32.0');
  const [minCgpa, setMinCgpa] = useState('7.5');
  const [category, setCategory] = useState<JobDrive['category']>('Super Dream');
  const [location, setLocation] = useState('Bengaluru / Hyderabad');
  const [workMode, setWorkMode] = useState<JobDrive['workMode']>('Hybrid');
  const [branches, setBranches] = useState<string[]>(['CSE', 'IT', 'ECE']);
  const [deadlineHours, setDeadlineHours] = useState('48');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !role.trim()) return;

    const numericCtc = parseFloat(ctc) || 20;

    const newDrive: Partial<JobDrive> = {
      id: `drive-${Date.now()}`,
      companyName,
      companyLogo: companyName.substring(0, 4).toUpperCase(),
      logoBg: 'bg-[#0071E3]/10 text-[#0071E3]',
      role,
      ctc: `${numericCtc.toFixed(1)} LPA`,
      ctcNumeric: numericCtc,
      category,
      location,
      workMode,
      minCgpa: parseFloat(minCgpa) || 7.0,
      eligibleBranches: branches,
      maxBacklogs: 0,
      deadlineHoursRemaining: parseInt(deadlineHours) || 48,
      closesInText: `Closes in ${deadlineHours} hrs`,
      isUrgent: parseInt(deadlineHours) <= 24,
      totalApplicants: 0,
      driveDate: 'Oct 28, 2026',
      status: 'Active',
      tags: ['On-Campus', category, 'Full Time'],
      description: description || 'Recruiting high-caliber engineering graduates for core product development.',
      rounds: ['Online Assessment', 'Tech Round 1', 'Tech Round 2', 'HR Interview'],
      hasApplied: false,
    };

    onSaveDrive(newDrive);
    onClose();
  };

  const branchOptions = ['CSE', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil'];

  const toggleBranch = (b: string) => {
    if (branches.includes(b)) {
      setBranches(branches.filter((item) => item !== b));
    } else {
      setBranches([...branches, b]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
      <div className="apple-card w-full max-w-xl shadow-[0_24px_64px_rgba(0,0,0,0.16)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-[#FBFBFC]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1D1D1F]">
                Post New Campus Recruitment Drive
              </h3>
              <p className="text-xs text-[#6E6E73]">
                Publish drive to student portals and initialize shortlisting filters
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Apple, Microsoft"
                className="w-full px-3 py-2 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer I"
                className="w-full px-3 py-2 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0071E3] mb-1">
                CTC (LPA) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="32.0"
                className="w-full px-3 py-2 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs font-mono font-bold text-[#0071E3] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                Min CGPA Cutoff
              </label>
              <input
                type="number"
                step="0.1"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                placeholder="7.5"
                className="w-full px-3 py-2 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs font-mono text-[#1D1D1F] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-[#FBFBFC] border border-black/[0.08] rounded-xl text-xs text-[#1D1D1F] outline-none cursor-pointer"
              >
                <option value="Super Dream">Super Dream (&ge; 25 LPA)</option>
                <option value="Dream">Dream (12 - 24 LPA)</option>
                <option value="Tier-1 Core">Tier-1 Core (&lt; 12 LPA)</option>
              </select>
            </div>
          </div>

          {/* Eligible Branches */}
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1.5">
              Eligible Engineering Branches
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {branchOptions.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => toggleBranch(b)}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all cursor-pointer ${
                    branches.includes(b)
                      ? 'bg-[#0071E3] text-white shadow-2xs'
                      : 'bg-black/[0.04] text-[#6E6E73] hover:text-[#1D1D1F]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-semibold text-[#1D1D1F] mb-1">
              Role Summary & Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsibilities, tech stack, key requirements..."
              className="w-full px-3 py-2 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] outline-none transition-all leading-relaxed"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-black/[0.06]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-black/[0.04] hover:bg-black/[0.08] text-[#1D1D1F] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Publish Drive</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
