import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const CHECKLIST = [
  'Company Dossiers',
  'Executive Lookup',
  'Financial Analytics',
  'SEC Filings',
  'AI News Intelligence',
  'CSV Export',
];

export const WhyZuntra: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight leading-tight">
            One Workspace. Complete Lead Intelligence.
          </h2>
          <p className="text-base text-[#6B7280] leading-relaxed">
            Replace fragmented research tools with Lead Intelligence. Consolidate company analysis, executive discovery, market news, and financial intelligence into one unified platform.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {CHECKLIST.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Realistic Dashboard Preview */}
        <div className="lg:col-span-6">
          <Card className="bg-[#F8FAFC] border border-[#E5E7EB] p-8 space-y-6 shadow-soft">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center font-bold">
                  N
                </div>
                <div>
                  <h4 className="font-bold text-[#111827]">Nvidia Corp. (NVDA)</h4>
                  <p className="text-xs text-[#6B7280]">Semiconductors & AI • NASDAQ</p>
                </div>
              </div>
              <Badge variant="success">Market Cap: $2.15T</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl">
                <p className="text-xs text-[#6B7280]">P/E Ratio</p>
                <p className="text-sm font-bold text-[#111827] mt-1">68.4</p>
              </div>
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl">
                <p className="text-xs text-[#6B7280]">AI Score</p>
                <p className="text-sm font-bold text-[#16A34A] mt-1">99/100</p>
              </div>
              <div className="p-3 bg-white border border-[#E5E7EB] rounded-2xl">
                <p className="text-xs text-[#6B7280]">Decision Makers</p>
                <p className="text-sm font-bold text-[#111827] mt-1">18 Verified</p>
              </div>
            </div>

            <div className="p-4 bg-white border border-[#E5E7EB] rounded-2xl text-xs space-y-2">
              <p className="font-bold text-[#111827]">Chief Executive Officer</p>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">Jensen Huang</span>
                <span className="text-[#0EA5E9] font-semibold">LinkedIn Enriched</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
