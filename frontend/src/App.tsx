import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Sidebar, TabType } from './components/app/Sidebar';
import { Topbar } from './components/app/Topbar';
import { DashboardPage } from './components/app/DashboardPage';
import { CompanySearchPage } from './components/app/CompanySearchPage';
import { LeadFinderPage } from './components/app/LeadFinderPage';
import { PeopleLookupPage } from './components/app/PeopleLookupPage';
import { BookmarksPage } from './components/app/BookmarksPage';
import { SettingsPage } from './components/app/SettingsPage';

export const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  if (viewMode === 'landing') {
    return <LandingPage onLaunchDashboard={() => setViewMode('app')} />;
  }

  return (
    <div className="flex h-screen bg-[#FFFFFF] text-[#111827] font-sans selection:bg-[#0EA5E9]/20 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        onReturnHome={() => setViewMode('landing')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Topbar onReturnHome={() => setViewMode('landing')} />

        <main className="flex-1 overflow-y-auto p-8 bg-[#FFFFFF]">
          {currentTab === 'dashboard' && <DashboardPage onNavigate={setCurrentTab} />}
          {currentTab === 'company' && <CompanySearchPage />}
          {currentTab === 'lead' && <LeadFinderPage />}
          {currentTab === 'people' && <PeopleLookupPage />}
          {currentTab === 'bookmarks' && <BookmarksPage />}
          {currentTab === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

export default App;
