import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Video, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { JobDrive } from '../types/pms';

interface ApplicationPipelineTrackerProps {
  appliedDrives: JobDrive[];
}

export const ApplicationPipelineTracker: React.FC<ApplicationPipelineTrackerProps> = ({
  appliedDrives,
}) => {
  const [selectedDriveId, setSelectedDriveId] = useState<string>(
    appliedDrives[0]?.id || 'drive-msft-01'
  );

  const currentDrive = appliedDrives.find((d) => d.id === selectedDriveId) || appliedDrives[0];

  const pipelineStages = [
    {
      id: 'step-1',
      title: 'Shortlist & Verification',
      subtitle: 'CGPA & ERP records verified by TPO',
      date: 'Oct 08, 2026',
      status: 'completed',
      score: 'Verified • 9.42 CGPA',
    },
    {
      id: 'step-2',
      title: 'Online Assessment (OA)',
      subtitle: '90-min Algorithmic coding & system invariants',
      date: 'Oct 10, 2026',
      status: 'completed',
      score: '2/2 Solved • 98th Percentile',
    },
    {
      id: 'step-3',
      title: 'Technical Round 1',
      subtitle: 'Distributed Data Structures & Memory Hierarchy',
      date: 'Oct 12, 2026',
      status: 'completed',
      score: 'Passed (Strong Hire)',
    },
    {
      id: 'step-4',
      title: 'Technical Round 2',
      subtitle: 'Large Scale System Design & Microservices',
      date: 'Oct 14, 2026 • 10:00 AM IST',
      status: 'active',
      score: 'Scheduled Today',
      meetingUrl: 'https://teams.microsoft.com',
    },
    {
      id: 'step-5',
      title: 'HR & As-Appropriate (AA)',
      subtitle: 'Behavioral competencies & compensation discussion',
      date: 'Pending Tech-2',
      status: 'upcoming',
      score: 'Awaiting Schedule',
    },
    {
      id: 'step-6',
      title: 'Offer Letter & Rollout',
      subtitle: 'Formal institutional letter of intent & verification',
      date: 'Post AA',
      status: 'upcoming',
      score: 'Pending Decision',
    },
  ];

  if (!currentDrive) {
    return (
      <div className="apple-card p-8 text-center">
        <Clock className="w-10 h-10 text-[#0071E3] mx-auto mb-2 opacity-60" />
        <h3 className="text-base font-bold text-[#1D1D1F]">No active applications in pipeline</h3>
        <p className="text-xs text-[#6E6E73] mt-1">
          Apply to an open recruitment drive to start tracking your rounds.
        </p>
      </div>
    );
  }

  return (
    <div className="apple-card p-6 mb-8 relative overflow-hidden">
      {/* Header and Drive Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#1D1D1F] tracking-tight">
              Application Pipeline Tracker
            </h3>
            <p className="text-xs text-[#6E6E73]">
              Live interview stages, slot invitations, and real-time round evaluations
            </p>
          </div>
        </div>

        {/* Drive selector tabs */}
        <div className="bg-black/[0.05] p-1 rounded-full flex items-center gap-1">
          {appliedDrives.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDriveId(d.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                selectedDriveId === d.id
                  ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                  : 'text-[#6E6E73] hover:text-[#1D1D1F]'
              }`}
            >
              <span>{d.companyName}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/[0.05] text-[#86868B] font-mono">
                {d.ctc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Phase Callout Banner */}
      <div className="mt-5 p-4 bg-[#FBFBFC] border border-black/[0.06] rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center font-bold">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0071E3]">
                Current Actionable Stage:
              </span>
              <span className="text-xs font-bold text-[#1D1D1F]">
                Technical Round 2 (System Design)
              </span>
            </div>
            <div className="text-xs text-[#6E6E73] mt-0.5 flex items-center gap-2">
              <span>Date: Oct 14, 2026 • 10:00 AM IST</span>
              <span>•</span>
              <span className="text-[#34C759] font-medium">Interviewer: Principal SDE, Azure Core</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://teams.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Join Teams Interview</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>

      {/* Stepper Pipeline Timeline */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
        {pipelineStages.map((stage, idx) => {
          const isCompleted = stage.status === 'completed';
          const isActive = stage.status === 'active';
          const isUpcoming = stage.status === 'upcoming';

          return (
            <div
              key={stage.id}
              className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all relative ${
                isActive
                  ? 'bg-white border-[#0071E3] shadow-[0_4px_16px_rgba(0,113,227,0.12)] ring-2 ring-[#0071E3]/20'
                  : isCompleted
                  ? 'bg-[#FBFBFC] border-black/[0.06]'
                  : 'bg-[#F5F5F7] border-black/[0.04] opacity-60'
              }`}
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#86868B]">
                    0{idx + 1}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-[#34C759]" />
                  )}
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0071E3] animate-pulse"></span>
                  )}
                  {isUpcoming && (
                    <Clock className="w-3.5 h-3.5 text-[#86868B]" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-[#1D1D1F] leading-tight">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-[#6E6E73] mt-1 leading-snug line-clamp-2">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-black/[0.06]">
                <div className="text-[10px] font-mono text-[#86868B]">{stage.date}</div>
                <div
                  className={`text-[11px] font-semibold mt-0.5 ${
                    isCompleted
                      ? 'text-[#34C759]'
                      : isActive
                      ? 'text-[#0071E3]'
                      : 'text-[#86868B]'
                  }`}
                >
                  {stage.score}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
