import React from 'react';
import { ShieldCheck, Award, AlertTriangle, BookOpen, CheckCircle, Scale, Sparkles } from 'lucide-react';

export const PolicyQuotasView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Institutional Placement Governance</span>
        </div>
        <h2 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">
          University Placement Policy & Student Quota Framework
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Codified rules governing Dream company eligibility, multi-offer acceptance limits, and branch parity quotas.
        </p>
      </div>

      {/* 3 Core Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Policy 1: 2x Offer Cap */}
        <div className="pms-card rounded-2xl p-5 border border-[#1D362C]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F1F5F9]">2x Maximum Offer Cap</h3>
              <span className="text-[10px] text-emerald-400 font-mono font-semibold">RULE #P-101</span>
            </div>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Every candidate is entitled to a maximum of 2 placement offers: one Regular/Tier-1 offer, and one Super-Dream offer (≥ 20 LPA). Once a Super-Dream offer is accepted, the candidate is automatically de-listed from further campus drives to protect cohort equity.
          </p>
          <div className="mt-4 pt-3 border-t border-[#1D362C] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Enforcement:</span>
            <span className="text-emerald-400 font-bold">Automated Lock</span>
          </div>
        </div>

        {/* Policy 2: Dream & Super-Dream Tiers */}
        <div className="pms-card rounded-2xl p-5 border border-[#F97316]/30 shadow-[0_8px_24px_rgba(249,115,22,0.08)]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F1F5F9]">Dream Package Thresholds</h3>
              <span className="text-[10px] text-[#FB923C] font-mono font-semibold">RULE #P-102</span>
            </div>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Packages are categorized into three institutional brackets:
            <br />• <strong className="text-emerald-400">Regular Core:</strong> Up to 11.9 LPA
            <br />• <strong className="text-emerald-400">Dream Tier:</strong> 12.0 LPA to 24.9 LPA
            <br />• <strong className="text-[#F97316]">Super-Dream:</strong> 25.0 LPA and above.
            Students holding regular offers may attempt Dream drives provided CGPA ≥ 7.5.
          </p>
          <div className="mt-4 pt-3 border-t border-[#1D362C] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Threshold Check:</span>
            <span className="text-[#F97316] font-bold">Dynamic CTC Evaluator</span>
          </div>
        </div>

        {/* Policy 3: Attendance & Ethics */}
        <div className="pms-card rounded-2xl p-5 border border-[#1D362C]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F1F5F9]">90% Drive Attendance</h3>
              <span className="text-[10px] text-purple-400 font-mono font-semibold">RULE #P-103</span>
            </div>
          </div>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Shortlisted candidates who fail to attend scheduled interviews without a verified medical or Dean emergency approval will receive an immediate 14-day suspension from company recruitment rosters.
          </p>
          <div className="mt-4 pt-3 border-t border-[#1D362C] flex items-center justify-between text-xs">
            <span className="text-[#94A3B8]">Penalty Status:</span>
            <span className="text-rose-400 font-bold">Automated Roster Freeze</span>
          </div>
        </div>
      </div>

      {/* Branch Representation & Gender Parity Quotas */}
      <div className="pms-card rounded-2xl p-6 border border-[#1D362C]">
        <h3 className="font-bold text-sm text-[#F1F5F9] mb-4">
          Departmental Hiring Quotas & Diversity Targets (2026 Batch)
        </h3>
        <div className="space-y-4">
          {[
            { branch: 'Computer Science (CSE)', enrolled: 320, placed: 298, target: '95%', rate: 93.1 },
            { branch: 'Information Technology (IT)', enrolled: 180, placed: 162, target: '92%', rate: 90.0 },
            { branch: 'Electronics & Communication (ECE)', enrolled: 240, placed: 198, target: '85%', rate: 82.5 },
            { branch: 'Electrical & Electronics (EEE)', enrolled: 160, placed: 118, target: '80%', rate: 73.7 },
          ].map((item) => (
            <div key={item.branch} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#F1F5F9]">{item.branch}</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {item.placed} / {item.enrolled} ({item.rate}% Placed • Target {item.target})
                </span>
              </div>
              <div className="w-full bg-[#0B1612] h-2 rounded-full overflow-hidden border border-[#1D362C]/50">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.rate}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
