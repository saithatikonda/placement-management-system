import React from 'react';
import { BarChart3, Building2 } from 'lucide-react';
import { KPIMetrics } from '../types/pms';

interface AnalyticsReportsViewProps {
  kpis: KPIMetrics;
}

export const AnalyticsReportsView: React.FC<AnalyticsReportsViewProps> = ({ kpis }) => {
  const salaryBrackets = [
    { range: '≥ 40 LPA (Super Dream)', count: 42, percentage: 6.8, color: 'bg-[#AF52DE]' },
    { range: '25 – 39.9 LPA (Dream+)', count: 86, percentage: 14.0, color: 'bg-[#0071E3]' },
    { range: '14 – 24.9 LPA (High Core)', count: 184, percentage: 30.0, color: 'bg-[#34C759]' },
    { range: '8 – 13.9 LPA (Standard)', count: 210, percentage: 34.3, color: 'bg-[#FF9500]' },
    { range: '< 8 LPA (Foundation)', count: 90, percentage: 14.7, color: 'bg-[#8E8E93]' },
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
        <div className="flex items-center gap-2 text-xs text-[#0071E3] font-semibold">
          <BarChart3 className="w-4 h-4" />
          <span>Institutional Intelligence & Compensation Analysis</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">
          Executive Placement Analytics (2026 Batch)
        </h2>
        <p className="text-xs text-[#6E6E73]">
          Detailed compensation bell curves, tier progression, and corporate recruiter retention statistics.
        </p>
      </div>

      {/* Top 3 Summary Stat Strips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="apple-card p-5">
          <span className="text-[11px] uppercase font-semibold text-[#86868B]">Highest Compensation</span>
          <div className="text-3xl font-bold font-mono text-[#0071E3] mt-1">
            44.0 <span className="text-sm font-normal text-[#86868B]">LPA</span>
          </div>
          <span className="text-xs text-[#6E6E73] mt-1 block">Offered by Microsoft IDC & Google</span>
        </div>

        <div className="apple-card p-5">
          <span className="text-[11px] uppercase font-semibold text-[#86868B]">Cohort Average Package</span>
          <div className="text-3xl font-bold font-mono text-[#1D1D1F] mt-1">
            9.2 <span className="text-sm font-normal text-[#86868B]">LPA</span>
          </div>
          <span className="text-xs text-[#34C759] font-medium mt-1 block">+18.4% growth compared to 2025 batch</span>
        </div>

        <div className="apple-card p-5">
          <span className="text-[11px] uppercase font-semibold text-[#86868B]">Super-Dream Unlocks</span>
          <div className="text-3xl font-bold font-mono text-[#AF52DE] mt-1">
            42 <span className="text-sm font-normal text-[#86868B]">Offers</span>
          </div>
          <span className="text-xs text-[#6E6E73] mt-1 block">Package exceeding 25 LPA threshold</span>
        </div>
      </div>

      {/* CTC Bracket Distribution */}
      <div className="apple-card p-6">
        <h3 className="font-bold text-sm text-[#1D1D1F] mb-4 flex items-center justify-between">
          <span>Compensation Package Bracket Distribution</span>
          <span className="text-xs font-mono text-[#0071E3] font-semibold">612 Placed Students Total</span>
        </h3>
        <div className="space-y-4">
          {salaryBrackets.map((bracket) => (
            <div key={bracket.range} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1D1D1F]">{bracket.range}</span>
                <span className="font-mono text-[#6E6E73]">
                  <strong className="text-[#1D1D1F]">{bracket.count} students</strong> ({bracket.percentage}%)
                </span>
              </div>
              <div className="w-full bg-[#F2F2F7] h-2.5 rounded-full overflow-hidden">
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
      <div className="apple-card overflow-hidden">
        <div className="px-6 py-4 border-b border-black/[0.06] flex items-center justify-between bg-[#FBFBFC]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0071E3]" />
            <h3 className="font-bold text-sm text-[#1D1D1F]">Marquee Corporate Partners</h3>
          </div>
          <span className="text-[11px] text-[#86868B]">Class of 2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FBFBFC] text-[#86868B] uppercase text-[10px] tracking-wider border-b border-black/[0.06]">
                <th className="px-6 py-2.5 font-bold">Partner Company</th>
                <th className="px-6 py-2.5 font-bold">Domain</th>
                <th className="px-6 py-2.5 font-bold">Students Recruited</th>
                <th className="px-6 py-2.5 font-bold text-right">Max CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] text-[#1D1D1F]">
              {topRecruiters.map((rec) => (
                <tr key={rec.name} className="hover:bg-black/[0.02] transition-colors">
                  <td className="px-6 py-3 font-semibold text-[#1D1D1F]">{rec.name}</td>
                  <td className="px-6 py-3 text-[#6E6E73]">{rec.domain}</td>
                  <td className="px-6 py-3 font-mono text-[#0071E3] font-semibold">{rec.hired} Offers</td>
                  <td className="px-6 py-3 text-right font-mono font-bold text-[#1D1D1F]">{rec.ctc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
