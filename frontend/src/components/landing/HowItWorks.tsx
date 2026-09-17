import React from 'react';

const STEPS = [
  { step: 'Step 1', title: 'Search a company or email', desc: 'Enter any target corporate email domain, company name, or stock ticker.' },
  { step: 'Step 2', title: 'AI generates a complete business profile', desc: 'Lead Intelligence compiles financials, SEC EDGAR filings, market cap, and business news.' },
  { step: 'Step 3', title: 'Find executives and verified contacts', desc: 'Identify verified decision makers, CEOs, VPs, and executive roles.' },
  { step: 'Step 4', title: 'Export leads and start outreach', desc: 'Download clean, structured prospect lists in CSV format for CRM workflows.' },
];

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] tracking-tight">
            Research to Lead in Four Steps
          </h2>
          <p className="text-base text-[#6B7280]">
            A seamless, automated pipeline from initial query to qualified B2B outreach.
          </p>
        </div>

        {/* Clean Horizontal Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {STEPS.map((s, i) => (
            <div key={i} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl p-6 space-y-4 hover:border-slate-300 hover:shadow-soft transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9] text-white font-bold flex items-center justify-center text-lg shadow-sm">
                {i + 1}
              </div>
              <div>
                <span className="text-xs font-bold text-[#0EA5E9] uppercase tracking-wider">{s.step}</span>
                <h3 className="text-lg font-bold text-[#111827] mt-1">{s.title}</h3>
                <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
