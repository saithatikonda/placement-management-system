import React, { useState } from 'react';
import { X, Building2, Plus, Sparkles, AlertCircle } from 'lucide-react';
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
      logoBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#13221C] border border-[#1D362C] rounded-2xl w-full max-w-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1D362C] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F1F5F9]">
                Post New Campus Recruitment Drive
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Publish drive to student portals and initialize automated shortlisting filters
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Stripe, Palantir, Cisco"
                className="w-full px-3 py-2 bg-[#0B1612] border border-[#1D362C] focus:border-emerald-500/50 rounded-xl text-xs text-[#F1F5F9] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">
                Role Title *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE-1, Cloud Engineer"
                className="w-full px-3 py-2 bg-[#0B1612] border border-[#1D362C] focus:border-emerald-500/50 rounded-xl text-xs text-[#F1F5F9] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#FB923C] font-bold mb-1">
                CTC (LPA) *
              </label>
              <input
                type="number"
                step="0.5"
                required
                value={ctc}
                onChange={(e) => setCtc(e.target.value)}
                placeholder="44.0"
                className="w-full px-3 py-2 bg-[#0B1612] border border-[#F97316]/40 focus:border-[#F97316] rounded-xl text-xs font-mono font-bold text-[#F97316] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">
                Min CGPA
              </label>
              <input
                type="number"
                step="0.1"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                placeholder="7.5"
                className="w-full px-3 py-2 bg-[#0B1612] border border-[#1D362C] focus:border-emerald-500/50 rounded-xl text-xs font-mono text-emerald-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-[#0B1612] border border-[#1D362C] rounded-xl text-xs text-[#F1F5F9] outline-none cursor-pointer"
              >
                <option value="Super Dream">Super Dream (&ge; 25 LPA)</option>
                <option value="Dream">Dream (12 - 24 LPA)</option>
                <option value="Tier-1 Core">Tier-1 Core (&lt; 12 LPA)</option>
              </select>
            </div>
          </div>

          {/* Eligible Branches */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1.5">
              Eligible Engineering Branches
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {branchOptions.map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => toggleBranch(b)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                    branches.includes(b)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#94A3B8] font-bold mb-1">
              Role Summary & Requirements
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Responsibilities, tech stack, key requirements..."
              className="w-full px-3 py-2 bg-[#0B1612] border border-[#1D362C] focus:border-emerald-500/50 rounded-xl text-xs text-[#F1F5F9] outline-none"
            />
          </div>

          {/* Spring Boot REST API note */}
          <div className="p-3 bg-[#0B1612] border border-[#1D362C] rounded-xl flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span>Spring Boot REST hook:</span>
            <code className="text-emerald-400 font-mono">POST /api/v1/recruitment-drives</code>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#0B1612] hover:bg-[#182C24] border border-[#1D362C] text-[#94A3B8] hover:text-[#F1F5F9] rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-xl text-xs font-bold shadow-[0_0_16px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all flex items-center gap-1.5"
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
