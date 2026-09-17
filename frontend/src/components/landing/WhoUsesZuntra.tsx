import React from 'react';
import { Target, UserCheck, Compass, BarChart3 } from 'lucide-react';
import { Card } from '../ui/Card';

const AUDIENCES = [
  {
    icon: <Target className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Sales Teams',
    description: 'Build highly qualified prospect lists.',
  },
  {
    icon: <UserCheck className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Recruiters',
    description: 'Discover hiring companies and key decision makers.',
  },
  {
    icon: <Compass className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Founders',
    description: 'Research competitors and investors.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-[#0EA5E9]" />,
    title: 'Market Researchers',
    description: 'Analyze industries with real-time business intelligence.',
  },
];

export const WhoUsesZuntra: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-[#F8FAFC] border-y border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Built for Modern Business Teams
          </h2>
          <p className="text-base text-[#6B7280]">
            Empowering professionals across sales, talent acquisition, leadership, and market analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {AUDIENCES.map((aud, idx) => (
            <Card key={idx} hoverable className="space-y-4 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F9FF] border border-sky-100 flex items-center justify-center">
                {aud.icon}
              </div>
              <h3 className="text-xl font-bold text-[#111827]">{aud.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{aud.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
