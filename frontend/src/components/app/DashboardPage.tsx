import React from 'react';
import { Building2, Users, Bookmark, Sparkles, ArrowUpRight, TrendingUp, Search, Target } from 'lucide-react';
import { StatCard } from '../ui/StatCard';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { TabType } from './Sidebar';

interface DashboardPageProps {
  onNavigate: (tab: TabType) => void;
}

const RECENT_COMPANIES = [
  { name: 'Tesla, Inc.', ticker: 'TSLA', industry: 'Automotive & Clean Energy', valuation: '$750.4B', score: '98/100' },
  { name: 'Apple Inc.', ticker: 'AAPL', industry: 'Consumer Electronics', valuation: '$2.89T', score: '96/100' },
  { name: 'Nvidia Corp.', ticker: 'NVDA', industry: 'Semiconductors & AI', valuation: '$2.15T', score: '99/100' },
  { name: 'Microsoft Corp.', ticker: 'MSFT', industry: 'Enterprise Software', valuation: '$3.02T', score: '97/100' },
  { name: 'Amazon.com Inc.', ticker: 'AMZN', industry: 'E-Commerce & Cloud', valuation: '$1.85T', score: '94/100' },
];

const RECENT_ACTIVITY = [
  { text: 'Investigated lead satya.nadella@microsoft.com', time: '10 mins ago', type: 'lead' },
  { text: 'Generated full dossier for Nvidia Corp (NVDA)', time: '25 mins ago', type: 'company' },
  { text: 'Scraped 5 executive profiles for Tesla Motors', time: '1 hour ago', type: 'people' },
  { text: 'Bookmarked Microsoft Corp to portfolio', time: '2 hours ago', type: 'bookmark' },
];

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F8FAFC] border border-[#E5E7EB] rounded-3xl p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Sales Intelligence Dashboard</h1>
          <p className="text-sm text-[#6B7280] mt-1">Real-time company analysis, executive research, and B2B lead generation.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary" icon={<Search className="w-4 h-4" />} onClick={() => onNavigate('company')}>
            New Company Search
          </Button>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Companies Tracked"
          value="128"
          change="12%"
          icon={<Building2 className="w-6 h-6" />}
        />
        <StatCard
          title="People Found"
          value="1,420"
          change="18%"
          icon={<Users className="w-6 h-6" />}
        />
        <StatCard
          title="Bookmarks"
          value="24"
          change="5%"
          icon={<Bookmark className="w-6 h-6" />}
        />
        <StatCard
          title="AI Searches"
          value="384"
          change="24%"
          icon={<Sparkles className="w-6 h-6" />}
        />
      </div>

      {/* Main Grid: Companies Table & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Companies Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#111827]">Recently Analyzed Companies</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('company')}>
              View All <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB] text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                    <th className="py-3.5 px-6">Company</th>
                    <th className="py-3.5 px-6">Industry</th>
                    <th className="py-3.5 px-6">Valuation</th>
                    <th className="py-3.5 px-6">AI Score</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] text-sm">
                  {RECENT_COMPANIES.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#111827] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#F0F9FF] text-[#0EA5E9] font-bold flex items-center justify-center text-xs">
                          {c.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <div>{c.name}</div>
                          <div className="text-xs text-[#6B7280] font-normal">{c.ticker}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[#6B7280] font-medium">{c.industry}</td>
                      <td className="py-4 px-6 text-[#111827] font-semibold">{c.valuation}</td>
                      <td className="py-4 px-6">
                        <Badge variant="success" size="sm">{c.score}</Badge>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Button variant="outline" size="sm" onClick={() => onNavigate('company')}>
                          Dossier
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Side: Quick Actions & Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Card */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-[#111827]">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('company')}
                className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] hover:border-slate-300 rounded-2xl text-left space-y-2 group transition-all"
              >
                <Building2 className="w-5 h-5 text-[#0EA5E9]" />
                <div className="text-xs font-bold text-[#111827]">Company Search</div>
              </button>
              <button
                onClick={() => onNavigate('lead')}
                className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] hover:border-slate-300 rounded-2xl text-left space-y-2 group transition-all"
              >
                <Target className="w-5 h-5 text-[#0EA5E9]" />
                <div className="text-xs font-bold text-[#111827]">Lead Finder</div>
              </button>
              <button
                onClick={() => onNavigate('people')}
                className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] hover:border-slate-300 rounded-2xl text-left space-y-2 group transition-all"
              >
                <Users className="w-5 h-5 text-[#0EA5E9]" />
                <div className="text-xs font-bold text-[#111827]">People Lookup</div>
              </button>
              <button
                onClick={() => onNavigate('bookmarks')}
                className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] hover:border-slate-300 rounded-2xl text-left space-y-2 group transition-all"
              >
                <Bookmark className="w-5 h-5 text-[#0EA5E9]" />
                <div className="text-xs font-bold text-[#111827]">Bookmarks</div>
              </button>
            </div>
          </Card>

          {/* Activity Feed */}
          <Card className="space-y-4">
            <h3 className="text-base font-bold text-[#111827]">Recent Activity</h3>
            <div className="space-y-3">
              {RECENT_ACTIVITY.map((act, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#0EA5E9] mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-[#111827]">{act.text}</p>
                    <p className="text-[10px] text-[#6B7280]">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
