import React from 'react';
import { ShieldCheck, Award, Scale, Sparkles } from 'lucide-react';

export const PolicyQuotasView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-[#0071E3] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Institutional Placement Governance</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
          University Placement Policy & Student Quota Framework
        </h2>
        <p className="text-xs text-[#6E6E73]">
          Codified rules governing Dream company eligibility, multi-offer acceptance limits, and branch parity quotas.
        </p>
      </div>

      {/* 3 Core Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Policy 1: 2x Offer Cap */}
        <div className="apple-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3.5">
              <div className="p-2.5 rounded-xl bg-[#0071E3]/10 text-[#0071E3]">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1D1D1F]">2x Maximum Offer Cap</h3>
                <span className="text-[10px] text-[#0071E3] font-mono font-semibold">RULE #P-101</span>
              </div>
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Every candidate is entitled to a maximum of 2 placement offers: one Regular/Tier-1 offer, and one Super-Dream offer (≥ 20 LPA). Once a Super-Dream offer is accepted, the candidate is automatically de-listed from further campus drives to protect cohort equity.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#86868B]">Enforcement:</span>
            <span className="text-[#34C759] font-semibold">Automated Lock</span>
          </div>
        </div>

        {/* Policy 2: Dream & Super-Dream Tiers */}
        <div className="apple-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3.5">
              <div className="p-2.5 rounded-xl bg-[#FF9500]/10 text-[#FF9500]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1D1D1F]">Dream Package Thresholds</h3>
                <span className="text-[10px] text-[#D97706] font-mono font-semibold">RULE #P-102</span>
              </div>
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Packages are categorized into three institutional brackets:
              <br />• <strong className="text-[#1D1D1F]">Regular Core:</strong> Up to 11.9 LPA
              <br />• <strong className="text-[#0071E3]">Dream Tier:</strong> 12.0 LPA to 24.9 LPA
              <br />• <strong className="text-[#AF52DE]">Super-Dream:</strong> 25.0 LPA and above.
              Students holding regular offers may attempt Dream drives provided CGPA ≥ 7.5.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#86868B]">Threshold Check:</span>
            <span className="text-[#0071E3] font-semibold">Dynamic CTC Evaluator</span>
          </div>
        </div>

        {/* Policy 3: Attendance & Ethics */}
        <div className="apple-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3.5">
              <div className="p-2.5 rounded-xl bg-[#AF52DE]/10 text-[#AF52DE]">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#1D1D1F]">90% Drive Attendance</h3>
                <span className="text-[10px] text-[#AF52DE] font-mono font-semibold">RULE #P-103</span>
              </div>
            </div>
            <p className="text-xs text-[#6E6E73] leading-relaxed">
              Shortlisted candidates who fail to attend scheduled interviews without a verified medical or Dean emergency approval will receive an immediate 14-day suspension from company recruitment rosters.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#86868B]">Penalty Status:</span>
            <span className="text-[#FF3B30] font-semibold">Automated Freeze</span>
          </div>
        </div>
      </div>

      {/* Branch Representation & Gender Parity Quotas */}
      <div className="apple-card p-6">
        <h3 className="font-bold text-sm text-[#1D1D1F] mb-4">
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
                <span className="font-semibold text-[#1D1D1F]">{item.branch}</span>
                <span className="font-mono text-[#0071E3] font-semibold">
                  {item.placed} / {item.enrolled} ({item.rate}% Placed • Target {item.target})
                </span>
              </div>
              <div className="w-full bg-[#F2F2F7] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0071E3] h-2 rounded-full transition-all duration-500"
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
