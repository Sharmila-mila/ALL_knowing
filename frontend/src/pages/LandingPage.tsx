import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { WhoUsesZuntra } from '../components/landing/WhoUsesZuntra';
import { HowItWorks } from '../components/landing/HowItWorks';
import { WhyZuntra } from '../components/landing/WhyZuntra';
import { CTA } from '../components/landing/CTA';
import { Engineering } from '../components/landing/Engineering';
import { About } from '../components/landing/About';
import { Blog } from '../components/landing/Blog';
import { Footer } from '../components/landing/Footer';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  return (
    <div className="min-h-screen bg-white text-[#111827] font-sans selection:bg-[#0EA5E9]/20 flex flex-col justify-between">
      <div>
        <Navbar onLaunchDashboard={onLaunchDashboard} />
        <main>
          <Hero onLaunchDashboard={onLaunchDashboard} />
          <Features />
          <WhoUsesZuntra />
          <HowItWorks />
          <WhyZuntra />
          <Engineering />
          <About />
          <Blog />
          <CTA onLaunchDashboard={onLaunchDashboard} />
        </main>
      </div>
      <Footer onLaunchDashboard={onLaunchDashboard} />
    </div>
  );
};
