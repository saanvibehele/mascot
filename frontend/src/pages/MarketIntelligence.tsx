import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Prospect } from "../data/mockOpportunity";

export default function MarketIntelligence() {
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProspects() {
      try {
        const response = await fetch("http://localhost:8000/api/prospects");
        if (response.ok) {
          const result = await response.json();
          setProspects(result.prospects || []);
        } else {
          console.error("Failed to fetch prospects");
        }
      } catch (error) {
        console.error("Error fetching prospects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProspects();
  }, []);
  return (
    <div className="p-xl overflow-y-auto no-scrollbar animate-in fade-in duration-500">
      {/* Dashboard Header */}
      <div className="mb-xl flex items-end justify-between">
        <div>
          <h1 className="font-headline-lg text-primary mb-xs">Market Intelligence</h1>
          <p className="text-on-surface-variant font-body-md">Identify companies likely to need paints and detect early project signals through real-time market intelligence.</p>
        </div>
        <div className="flex items-center gap-md">
          <button className="flex items-center gap-xs px-md py-sm bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors">
            <span className="material-symbols-outlined text-sm">bolt</span>
            <span className="font-label-caps text-label-caps uppercase">High-Intent Signals</span>
          </button>
          <button className="flex items-center gap-xs px-md py-sm border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span className="font-label-caps text-label-caps uppercase">Filter</span>
          </button>
          <button className="flex items-center gap-xs px-md py-sm bg-surface-container-high rounded-xl hover:bg-surface-dim transition-colors">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span className="font-label-caps text-label-caps uppercase">Past 30 Days</span>
          </button>
        </div>
      </div>

      {/* Top Row: KPI Cards */}
      <div className="grid grid-cols-3 gap-lg mb-xl">
        {/* New Projects Card */}
        <div className="bg-surface-container-lowest shadow-sm p-xl rounded-xl relative overflow-hidden group hover:border-primary transition-all duration-300 border border-transparent hover:shadow-md">
          <div className="flex items-start justify-between mb-md">
            <div>
              <p className="font-label-caps text-label-caps text-tertiary uppercase mb-xs">New Projects Identified</p>
              <p className="font-data-lg text-data-lg text-primary">142</p>
            </div>
            <div className="bg-primary/10 text-primary p-md rounded-xl">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_business</span>
            </div>
          </div>
          <div className="flex items-center gap-xs text-success-green font-body-sm font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12.4% vs last week</span>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[120px]">architecture</span>
          </div>
        </div>

        {/* Active Tenders Card */}
        <div className="bg-surface-container-lowest shadow-sm p-xl rounded-xl relative overflow-hidden group hover:border-tertiary transition-all duration-300 border border-transparent hover:shadow-md">
          <div className="flex items-start justify-between mb-md">
            <div>
              <p className="font-label-caps text-label-caps text-tertiary uppercase mb-xs">Active Tenders (Paint)</p>
              <p className="font-data-lg text-data-lg text-primary">86</p>
            </div>
            <div className="bg-tertiary/10 text-tertiary p-md rounded-xl">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            </div>
          </div>
          <div className="flex items-center gap-xs text-tertiary font-body-sm font-semibold">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>14 expiring this week</span>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[120px]">assignment</span>
          </div>
        </div>

        {/* Pipeline Value Card */}
        <div className="bg-surface-container-lowest shadow-sm p-xl rounded-xl relative overflow-hidden group hover:border-secondary transition-all duration-300 border border-transparent hover:shadow-md">
          <div className="flex items-start justify-between mb-md">
            <div>
              <p className="font-label-caps text-label-caps text-tertiary uppercase mb-xs">Total Pipeline Value</p>
              <p className="font-data-lg text-data-lg text-primary">₹12.4 Cr</p>
            </div>
            <div className="bg-secondary/10 text-secondary p-md rounded-xl">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            </div>
          </div>
          <div className="flex items-center gap-xs text-success-green font-body-sm font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>Potential 1.2k KL Volume</span>
          </div>
          <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-xl">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-md"></div>
            <p className="font-label-caps text-outline uppercase tracking-wider animate-pulse">Market Researcher Agent scanning for prospects...</p>
          </div>
        ) : prospects.length === 0 ? (
          <div className="col-span-full text-center py-xl text-on-surface-variant font-body-md">
            No prospects found.
          </div>
        ) : (
          prospects.map((prospect) => (
            <div key={prospect.id} className="bg-surface-container-lowest shadow-sm rounded-xl overflow-hidden group flex flex-col h-full hover:shadow-lg transition-shadow border border-transparent">
              <div className="h-32 bg-primary/10 relative overflow-hidden flex items-center justify-center">
                {prospect.imageUrl ? (
                  <img src={prospect.imageUrl} alt={prospect.companyName} className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
                ) : null}
                <span className={`material-symbols-outlined text-[64px] text-primary/20 ${prospect.imageUrl ? 'hidden' : ''}`}>business</span>
                <div className="absolute top-md left-md z-10">
                  <span className="bg-primary/90 text-on-primary px-sm py-1 rounded-full text-label-caps font-label-caps uppercase backdrop-blur-sm">{prospect.phase}</span>
                </div>
              </div>
              <div className="p-md flex-1 flex flex-col">
                <h3 className="font-headline-md text-primary mb-sm">{prospect.companyName}</h3>
                <p className="text-on-surface-variant font-body-sm line-clamp-3 mb-md">{prospect.projectDescription}</p>
                <div className="mt-auto pt-md border-t border-outline-variant flex items-center justify-between">
                  <div className="flex items-center gap-md">
                  </div>
                  <Link to={`/opportunities/${prospect.id}`} className="text-primary font-bold font-label-caps text-label-caps flex items-center gap-1 hover:gap-2 transition-all">
                    Read Insight <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
