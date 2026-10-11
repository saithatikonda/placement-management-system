import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Sparkles, 
  Filter, 
  Search,
  ExternalLink,
  Layers,
  ChevronRight
} from 'lucide-react';
import { JobDrive, StudentProfile } from '../types/pms';

interface JobCardsGridProps {
  drives: JobDrive[];
  student: StudentProfile;
  onApplyJob: (drive: JobDrive) => void;
  onViewDetails: (drive: JobDrive) => void;
}

export const JobCardsGrid: React.FC<JobCardsGridProps> = ({
  drives,
  student,
  onApplyJob,
  onViewDetails,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterEligibleOnly, setFilterEligibleOnly] = useState<boolean>(false);

  // Filter logic
  const filteredDrives = drives.filter((drive) => {
    const matchesCategory =
      selectedCategory === 'All' || drive.category === selectedCategory;
    const matchesSearch =
      drive.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drive.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const isEligible =
      student.cgpa >= drive.minCgpa &&
      drive.eligibleBranches.includes(student.branch) &&
      student.backlogs <= drive.maxBacklogs;

    if (filterEligibleOnly && !isEligible) return false;

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Filter and Search Bar for Job Drives */}
      <div className="flex flex-wrap items-center justify-between gap-4 pms-card rounded-xl p-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mr-1">
            Category:
          </span>
          {['All', 'Super Dream', 'Dream', 'Tier-1 Core'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-semibold'
                  : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs text-[#94A3B8] cursor-pointer hover:text-[#F1F5F9] select-none">
            <input
              type="checkbox"
              checked={filterEligibleOnly}
              onChange={(e) => setFilterEligibleOnly(e.target.checked)}
              className="accent-emerald-500 w-3.5 h-3.5 rounded cursor-pointer"
            />
            <span>Show Only Eligible</span>
          </label>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role, skills, company..."
              className="pl-8 pr-3 py-1.5 bg-[#0B1612] border border-[#1D362C] focus:border-emerald-500/40 rounded-lg text-xs text-[#F1F5F9] placeholder:text-[#94A3B8] w-64 outline-none transition-colors"
            />
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Main Job Cards Grid with required ID for Spring Boot REST API fetch */}
      <div
        id="jobListContainer"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {filteredDrives.map((drive) => {
          const isEligible =
            student.cgpa >= drive.minCgpa &&
            drive.eligibleBranches.includes(student.branch) &&
            student.backlogs <= drive.maxBacklogs;

          return (
            <div
              key={drive.id}
              data-drive-id={drive.id}
              data-job-id={drive.id}
              className="pms-card-interactive rounded-2xl p-5 flex flex-col justify-between relative group border border-[#1D362C]"
            >
              {/* Urgent deadline glow badge if closing soon */}
              {drive.isUrgent && (
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F97316]/15 border border-[#F97316]/30 text-[#FB923C] text-[11px] font-semibold animate-pulse shadow-[0_0_12px_rgba(249,115,22,0.2)]">
                  <Clock className="w-3 h-3 text-[#F97316]" />
                  <span>{drive.closesInText}</span>
                </div>
              )}

              <div>
                {/* Company Header */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-sm tracking-wider shrink-0 shadow-sm ${drive.logoBg}`}
                  >
                    {drive.companyLogo}
                  </div>
                  <div className="min-w-0 pr-16">
                    <h3 className="font-bold text-base text-[#F1F5F9] group-hover:text-emerald-300 transition-colors truncate">
                      {drive.companyName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mt-0.5">
                      <MapPin className="w-3 h-3 text-[#94A3B8]" />
                      <span className="truncate">{drive.location}</span>
                      <span>•</span>
                      <span className="font-medium text-emerald-400/90">{drive.workMode}</span>
                    </div>
                  </div>
                </div>

                {/* Role Title */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-[#F1F5F9] line-clamp-1">
                    {drive.role}
                  </h4>
                  <p className="text-xs text-[#94A3B8] line-clamp-2 mt-1">
                    {drive.description}
                  </p>
                </div>

                {/* Key CTC Callout with Warm Amber Accent */}
                <div className="p-3 bg-[#0B1612]/90 border border-[#1D362C] rounded-xl mb-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Compensation Package
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-bold font-mono text-[#F97316] tracking-tight drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
                        {drive.ctc}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                      Tier Classification
                    </span>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      {drive.category}
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria Tags */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">Min CGPA Required:</span>
                    <span className="font-mono font-semibold text-[#F1F5F9]">
                      ≥ {drive.minCgpa.toFixed(1)} / 10.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">Eligible Branches:</span>
                    <span className="text-[#F1F5F9] font-medium">
                      {drive.eligibleBranches.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Eligibility Status */}
              <div className="pt-3 border-t border-[#1D362C] flex items-center justify-between gap-3">
                {/* Eligibility Tag */}
                <div>
                  {isEligible ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      Eligible to Apply
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3 text-rose-400" />
                      Criteria Locked
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(drive)}
                    className="p-2 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1D362C] rounded-lg transition-colors"
                    title="View Rounds & Syllabus"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {/* Apply Button with explicit spring-boot class hook */}
                  {drive.hasApplied ? (
                    <button
                      disabled
                      className="px-3.5 py-1.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{drive.applicationStage || 'Applied'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onApplyJob(drive)}
                      disabled={!isEligible}
                      data-drive-id={drive.id}
                      data-job-id={drive.id}
                      className={`apply-btn px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98] flex items-center gap-1.5 ${
                        isEligible
                          ? 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_0_16px_rgba(249,115,22,0.35)] hover:shadow-[0_0_24px_rgba(249,115,22,0.5)]'
                          : 'bg-[#182C24] text-[#94A3B8] border border-[#1D362C] cursor-not-allowed opacity-60'
                      }`}
                    >
                      <span>Apply Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDrives.length === 0 && (
        <div className="pms-card rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-50" />
          <h3 className="text-base font-bold text-[#F1F5F9]">No recruitment drives match your query</h3>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-sm mx-auto">
            Try adjusting your category filter, clearing your search term, or toggling eligibility criteria.
          </p>
        </div>
      )}
    </div>
  );
};
