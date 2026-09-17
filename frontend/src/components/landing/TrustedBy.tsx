import React from 'react';

const LOGOS = ['Tesla', 'Microsoft', 'Amazon', 'Adobe', 'HubSpot', 'Nvidia'];

export const TrustedBy: React.FC = () => {
  return (
    <section className="py-12 border-y border-[#E5E7EB] bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-8">
          Trusted by Modern Sales Teams
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
          {LOGOS.map((name) => (
            <div
              key={name}
              className="bg-white border border-[#E5E7EB] rounded-2xl py-4 px-6 text-slate-800 font-extrabold text-lg tracking-tight hover:border-slate-300 transition-all shadow-xs"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
