import React from 'react';
import { Building2, Users, TrendingUp, Download } from 'lucide-react';
import { Card } from '../ui/Card';

const FEATURES = [
  {
    icon: <Building2 className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Company Intelligence',
    description: 'Generate complete company dossiers including industry, market cap, SEC filings, competitors, and business overview.',
  },
  {
    icon: <Users className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Executive Discovery',
    description: 'Identify founders, CEOs, HR leaders, and decision makers through intelligent LinkedIn enrichment.',
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Financial Research',
    description: 'Access revenue, valuation, market performance, company news, and AI-generated business summaries.',
  },
  {
    icon: <Download className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Lead Export',
    description: 'Export clean, structured prospect lists into CSV for outreach and CRM workflows.',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 px-6 bg-white border-t border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Everything You Need to Scale Prospecting
          </h2>
          <p className="text-base text-[#6B7280]">
            An intelligent workspace built for deep company research and decision-maker lead discovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feat, idx) => (
            <Card key={idx} hoverable className="space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F9FF] border border-sky-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-xl font-bold text-[#111827]">{feat.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{feat.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
