import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Video, 
  FileText, 
  AlertCircle, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck
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
      meetingUrl: 'https://teams.microsoft.com/meet/recruitment-sde-402',
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
      <div className="pms-card rounded-2xl p-8 text-center">
        <Clock className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-60" />
        <h3 className="text-base font-bold text-[#F1F5F9]">No active applications in pipeline</h3>
        <p className="text-xs text-[#94A3B8] mt-1">
          Apply to an open recruitment drive from the Job Grid to start tracking your rounds.
        </p>
      </div>
    );
  }

  return (
    <div className="pms-card rounded-2xl p-6 mb-8 relative overflow-hidden">
      {/* Background ambient subtle glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#F97316]/5 pointer-events-none rounded-full blur-3xl"></div>

      {/* Header and Drive Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#1D362C]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#F1F5F9] tracking-tight">
              Application Pipeline Tracker
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Live interview stages, slot invitations, and real-time round evaluations
            </p>
          </div>
        </div>

        {/* Drive selector tabs */}
        <div className="flex items-center gap-2">
          {appliedDrives.map((d) => (
            <button
              key={d.id}
              onClick={() => setSelectedDriveId(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                selectedDriveId === d.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[#0B1612] text-[#94A3B8] border border-[#1D362C] hover:text-[#F1F5F9]'
              }`}
            >
              <span>{d.companyName}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-black/40 text-[#94A3B8] font-mono">
                {d.ctc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Phase Callout Banner with Warm Amber Highlights */}
      <div className="mt-5 p-4 bg-[#0B1612] border border-[#F97316]/30 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-[0_0_20px_rgba(249,115,22,0.1)]">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F97316]/15 border border-[#F97316]/40 flex items-center justify-center text-[#F97316]">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FB923C]">
                Current Actionable Stage:
              </span>
              <span className="text-xs font-bold text-[#F1F5F9]">
                Technical Round 2 (System Design)
              </span>
            </div>
            <div className="text-xs text-[#94A3B8] mt-0.5 flex items-center gap-2">
              <span>Date: Oct 14, 2026 • 10:00 AM IST</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Interviewer: Principal SDE, Azure Core</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://teams.microsoft.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-[0_0_16px_rgba(249,115,22,0.35)] active:scale-[0.98] transition-all"
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
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all relative ${
                isActive
                  ? 'bg-[#182C24] border-[#F97316]/60 shadow-[0_0_16px_rgba(249,115,22,0.15)] ring-1 ring-[#F97316]/40'
                  : isCompleted
                  ? 'bg-[#0B1612] border-emerald-500/30'
                  : 'bg-[#0B1612]/60 border-[#1D362C]/60 opacity-60'
              }`}
            >
              <div>
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-[#94A3B8]">
                    0{idx + 1}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse shadow-[0_0_8px_#F97316]"></span>
                  )}
                  {isUpcoming && (
                    <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-[#F1F5F9] leading-tight">
                  {stage.title}
                </h4>
                <p className="text-[11px] text-[#94A3B8] mt-1 leading-snug line-clamp-2">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1D362C]/60">
                <div className="text-[10px] font-mono text-[#94A3B8]">{stage.date}</div>
                <div
                  className={`text-[11px] font-semibold mt-0.5 ${
                    isCompleted
                      ? 'text-emerald-400'
                      : isActive
                      ? 'text-[#FB923C]'
                      : 'text-[#94A3B8]'
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
