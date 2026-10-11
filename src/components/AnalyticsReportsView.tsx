import React from 'react';
import { BarChart3, TrendingUp, Award, Coins, Building2, Users } from 'lucide-react';
import { KPIMetrics } from '../types/pms';

interface AnalyticsReportsViewProps {
  kpis: KPIMetrics;
}

export const AnalyticsReportsView: React.FC<AnalyticsReportsViewProps> = ({ kpis }) => {
  const salaryBrackets = [
    { range: '≥ 40 LPA (Super Dream)', count: 42, percentage: 6.8, color: 'bg-[#F97316]' },
    { range: '25 – 39.9 LPA (Dream+)', count: 86, percentage: 14.0, color: 'bg-emerald-400' },
    { range: '14 – 24.9 LPA (High Core)', count: 184, percentage: 30.0, color: 'bg-emerald-500' },
    { range: '8 – 13.9 LPA (Standard)', count: 210, percentage: 34.3, color: 'bg-emerald-600' },
    { range: '< 8 LPA (Foundation)', count: 90, percentage: 14.7, color: 'bg-slate-600' },
  ];

  const topRecruiters = [
    { name: 'Microsoft IDC', hired: 28, ctc: '44.0 LPA', domain: 'Cloud & AI' },
    { name: 'Google India', hired: 14, ctc: '42.5 LPA', domain: 'Core Systems' },
    { name: 'Amazon AWS', hired: 42, ctc: '32.0 LPA', domain: 'Cloud & Distributed' },
    { name: 'Oracle Cloud OCI', hired: 35, ctc: '24.5 LPA', domain: 'Enterprise Cloud' },
    { name: 'Goldman Sachs', hired: 22, ctc: '31.5 LPA', domain: 'FinTech & Markets' },
    { name: 'Nvidia', hired: 18, ctc: '36.0 LPA', domain: 'Hardware / CUDA' },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
          <BarChart3 className="w-4 h-4" />
          <span>Institutional Intelligence & Compensation Analysis</span>
        </div>
        <h2 className="text-2xl font-bold text-[#F1F5F9] tracking-tight">
          Executive Placement Analytics (2026 Batch)
        </h2>
        <p className="text-xs text-[#94A3B8]">
          Detailed compensation bell curves, tier progression, and corporate recruiter retention statistics.
        </p>
      </div>

      {/* Top 3 Summary Stat Strips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="pms-card rounded-2xl p-5 border border-[#F97316]/30">
          <span className="text-[11px] uppercase font-bold text-[#FB923C]">Highest Compensation</span>
          <div className="text-3xl font-extrabold font-mono text-[#F97316] mt-1 drop-shadow-[0_0_12px_rgba(249,115,22,0.3)]">
            44.0 <span className="text-sm font-normal text-[#94A3B8]">LPA</span>
          </div>
          <span className="text-xs text-[#94A3B8] mt-1 block">Offered by Microsoft IDC & Google</span>
        </div>

        <div className="pms-card rounded-2xl p-5 border border-emerald-500/30">
          <span className="text-[11px] uppercase font-bold text-emerald-400">Cohort Average Package</span>
          <div className="text-3xl font-extrabold font-mono text-emerald-300 mt-1">
            9.2 <span className="text-sm font-normal text-[#94A3B8]">LPA</span>
          </div>
          <span className="text-xs text-[#94A3B8] mt-1 block">+18.4% growth compared to 2025 batch</span>
        </div>

        <div className="pms-card rounded-2xl p-5 border border-[#1D362C]">
          <span className="text-[11px] uppercase font-bold text-[#94A3B8]">Super-Dream Unlocks</span>
          <div className="text-3xl font-extrabold font-mono text-[#F1F5F9] mt-1">
            42 <span className="text-sm font-normal text-[#94A3B8]">Offers</span>
          </div>
          <span className="text-xs text-[#94A3B8] mt-1 block">Package exceeding 25 LPA threshold</span>
        </div>
      </div>

      {/* CTC Bracket Distribution */}
      <div className="pms-card rounded-2xl p-6 border border-[#1D362C]">
        <h3 className="font-bold text-sm text-[#F1F5F9] mb-4 flex items-center justify-between">
          <span>Compensation Package Bracket Distribution</span>
          <span className="text-xs font-mono text-emerald-400">612 Placed Students Total</span>
        </h3>
        <div className="space-y-4">
          {salaryBrackets.map((bracket) => (
            <div key={bracket.range} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#F1F5F9]">{bracket.range}</span>
                <span className="font-mono text-[#94A3B8]">
                  <strong className="text-emerald-400">{bracket.count} students</strong> ({bracket.percentage}%)
                </span>
              </div>
              <div className="w-full bg-[#0B1612] h-2.5 rounded-full overflow-hidden border border-[#1D362C]/60">
                <div
                  className={`h-2.5 rounded-full ${bracket.color} transition-all duration-700`}
                  style={{ width: `${bracket.percentage * 2.5}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Recruiting Partners Table */}
      <div className="pms-card rounded-2xl overflow-hidden border border-[#1D362C]">
        <div className="px-6 py-4 border-b border-[#1D362C] flex items-center justify-between bg-[#0B1612]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-[#F1F5F9]">Marquee Corporate Partners</h3>
          </div>
          <span className="text-[11px] text-[#94A3B8]">Class of 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0B1612] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#1D362C]">
                <th className="px-6 py-2.5 font-bold">Partner Company</th>
                <th className="px-6 py-2.5 font-bold">Domain</th>
                <th className="px-6 py-2.5 font-bold">Students Recruited</th>
                <th className="px-6 py-2.5 font-bold text-right">Max CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D362C]/60 text-[#F1F5F9]">
              {topRecruiters.map((rec) => (
                <tr key={rec.name} className="hover:bg-[#182C24]/60 transition-colors">
                  <td className="px-6 py-3 font-bold text-[#F1F5F9]">{rec.name}</td>
                  <td className="px-6 py-3 text-[#94A3B8]">{rec.domain}</td>
                  <td className="px-6 py-3 font-mono text-emerald-400 font-bold">{rec.hired} Offers</td>
                  <td className="px-6 py-3 text-right font-mono font-bold text-[#F97316]">{rec.ctc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
