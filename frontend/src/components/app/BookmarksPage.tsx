import React, { useState } from 'react';
import { Bookmark, Search, Building2, ExternalLink } from 'lucide-react';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

const BOOKMARKS = [
  { name: 'Tesla, Inc.', ticker: 'TSLA', sector: 'Automotive', valuation: '$750.4B', category: 'Automotive' },
  { name: 'Apple Inc.', ticker: 'AAPL', sector: 'Tech', valuation: '$2.89T', category: 'Tech' },
  { name: 'Nvidia Corp.', ticker: 'NVDA', sector: 'AI & Chips', valuation: '$2.15T', category: 'AI' },
  { name: 'Microsoft Corp.', ticker: 'MSFT', sector: 'Software', valuation: '$3.02T', category: 'Tech' },
];

export const BookmarksPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Tech', 'Automotive', 'AI', 'Finance'];

  const filtered = BOOKMARKS.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.ticker.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827]">Bookmarked Intelligence</h1>
          <p className="text-sm text-[#6B7280]">Access your saved company dossiers and lead portfolios.</p>
        </div>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search bookmarks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-[#0EA5E9] text-white shadow-xs'
                : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b, idx) => (
            <Card key={idx} hoverable className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#F0F9FF] text-[#0EA5E9] font-bold flex items-center justify-center">
                    {b.ticker.slice(0, 2)}
                  </div>
                  <Badge variant="primary">{b.ticker}</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-[#111827] text-lg">{b.name}</h3>
                  <p className="text-xs text-[#6B7280]">{b.sector}</p>
                </div>
                <div className="p-3 bg-[#F8FAFC] border border-[#E5E7EB] rounded-2xl flex justify-between items-center text-xs">
                  <span className="text-[#6B7280]">Valuation</span>
                  <span className="font-bold text-[#111827]">{b.valuation}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                <Badge variant="success" size="sm">Saved</Badge>
                <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                  View Dossier
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Bookmarks Found"
          description="You haven't bookmarked any companies matching your search filters yet."
          icon={<Bookmark className="w-7 h-7" />}
        />
      )}
    </div>
  );
};
