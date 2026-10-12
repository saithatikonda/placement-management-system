import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Sparkles, 
  Search,
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
      {/* Filter and Search Bar for Job Drives - Apple Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 apple-card p-4">
        <div className="bg-black/[0.05] p-1 rounded-full flex items-center gap-1 flex-wrap">
          {['All', 'Super Dream', 'Dream', 'Tier-1 Core'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="flex items-center gap-2 text-xs text-[#6E6E73] cursor-pointer hover:text-[#1D1D1F] select-none font-medium">
            <input
              type="checkbox"
              checked={filterEligibleOnly}
              onChange={(e) => setFilterEligibleOnly(e.target.checked)}
              className="w-4 h-4 rounded text-[#0071E3] focus:ring-[#0071E3] cursor-pointer"
            />
            <span>Show Only Eligible</span>
          </label>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role, company, skills..."
              className="pl-8 pr-3 py-1.5 bg-[#FBFBFC] border border-black/[0.08] focus:bg-white focus:border-[#0071E3] focus:ring-2 focus:ring-[#0071E3]/15 rounded-xl text-xs text-[#1D1D1F] placeholder:text-[#A1A1A6] w-64 outline-none transition-all"
            />
            <Search className="w-3.5 h-3.5 text-[#86868B] absolute left-2.5 top-2.5" />
          </div>
        </div>
      </div>

      {/* Main Job Cards Grid */}
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
              className="apple-card-hover p-5 flex flex-col justify-between relative group"
            >
              {/* Urgent deadline pill */}
              {drive.isUrgent && (
                <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF9500]/10 text-[#D97706] text-[11px] font-bold">
                  <Clock className="w-3 h-3 text-[#FF9500]" />
                  <span>{drive.closesInText}</span>
                </div>
              )}

              <div>
                {/* Company Header */}
                <div className="flex items-start gap-3.5 mb-3">
                  <div
                    className="w-12 h-12 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold text-sm tracking-wider shrink-0"
                  >
                    {drive.companyLogo}
                  </div>
                  <div className="min-w-0 pr-16">
                    <h3 className="font-bold text-base text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors truncate">
                      {drive.companyName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#6E6E73] mt-0.5">
                      <MapPin className="w-3 h-3 text-[#86868B]" />
                      <span className="truncate">{drive.location}</span>
                      <span>•</span>
                      <span className="font-medium text-[#0071E3]">{drive.workMode}</span>
                    </div>
                  </div>
                </div>

                {/* Role Title */}
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-[#1D1D1F] line-clamp-1">
                    {drive.role}
                  </h4>
                  <p className="text-xs text-[#6E6E73] line-clamp-2 mt-1 leading-relaxed">
                    {drive.description}
                  </p>
                </div>

                {/* Key CTC Callout */}
                <div className="p-3 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl mb-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
                      Compensation Package
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xl font-bold font-mono text-[#0071E3] tracking-tight">
                        {drive.ctc}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#86868B]">
                      Tier
                    </span>
                    <div className="text-xs font-semibold text-[#1D1D1F] mt-0.5 flex items-center justify-end gap-1">
                      <Sparkles className="w-3 h-3 text-[#FF9500]" />
                      {drive.category}
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria Tags */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6E6E73]">Min CGPA Required:</span>
                    <span className="font-mono font-semibold text-[#1D1D1F]">
                      ≥ {drive.minCgpa.toFixed(1)} / 10.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#6E6E73]">Eligible Branches:</span>
                    <span className="text-[#1D1D1F] font-medium">
                      {drive.eligibleBranches.join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions & Eligibility Status */}
              <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between gap-3">
                {/* Eligibility Tag */}
                <div>
                  {isEligible ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#28A745] bg-[#34C759]/10 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-[#34C759]" />
                      Eligible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E11D48] bg-[#FF3B30]/10 px-2.5 py-0.5 rounded-full">
                      <AlertCircle className="w-3 h-3 text-[#FF3B30]" />
                      Criteria Locked
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewDetails(drive)}
                    className="p-2 text-[#86868B] hover:text-[#1D1D1F] hover:bg-black/[0.05] rounded-xl transition-colors cursor-pointer"
                    title="View Cockpit Details"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  {/* Apply Button */}
                  {drive.hasApplied ? (
                    <button
                      disabled
                      className="px-3.5 py-1.5 bg-[#0071E3]/10 text-[#0071E3] rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-default"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0071E3]" />
                      <span>{drive.applicationStage || 'Applied'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onApplyJob(drive)}
                      disabled={!isEligible}
                      data-drive-id={drive.id}
                      data-job-id={drive.id}
                      className={`apply-btn px-4 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer ${
                        isEligible
                          ? 'bg-[#0071E3] hover:bg-[#0077ED] text-white shadow-[0_2px_8px_rgba(0,113,227,0.25)]'
                          : 'bg-black/[0.05] text-[#86868B] cursor-not-allowed opacity-50'
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
        <div className="apple-card p-12 text-center">
          <Building2 className="w-12 h-12 text-[#86868B] mx-auto mb-3 opacity-40" />
          <h3 className="text-base font-bold text-[#1D1D1F]">No recruitment drives match your query</h3>
          <p className="text-xs text-[#6E6E73] mt-1 max-w-sm mx-auto">
            Try adjusting your category filter, clearing your search term, or toggling eligibility criteria.
          </p>
        </div>
      )}
    </div>
  );
};
