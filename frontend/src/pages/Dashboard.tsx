import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Prospect } from "../data/mockOpportunity";

export default function Dashboard() {
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
    <div className="p-xl space-y-xl animate-in fade-in duration-500">
      {/* Quick Stats */}
      <section className="grid grid-cols-4 gap-lg">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-powder-sky shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="font-label-caps text-outline uppercase mb-xs">Total Opportunities</p>
            <h2 className="font-headline-lg text-ink-dark">1,284</h2>
            <p className="text-[12px] font-bold text-success-green flex items-center mt-xs">
              <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span> +12% from last month
            </p>
          </div>
          <div className="p-md bg-primary-container/10 rounded-full">
            <span className="material-symbols-outlined text-primary text-[32px]">assignment</span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-powder-sky shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="font-label-caps text-outline uppercase mb-xs">Meetings Today</p>
            <h2 className="font-headline-lg text-ink-dark">8</h2>
            <p className="text-[12px] font-bold text-secondary flex items-center mt-xs">
              <span className="material-symbols-outlined text-[16px] mr-1">schedule</span> Next: AkzoNobel (2PM)
            </p>
          </div>
          <div className="p-md bg-secondary-container/10 rounded-full">
            <span className="material-symbols-outlined text-secondary text-[32px]">calendar_today</span>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-powder-sky shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="font-label-caps text-outline uppercase mb-xs">Pipeline Value (₹ Cr)</p>
            <h2 className="font-headline-lg text-ink-dark">₹42.5</h2>
            <p className="text-[12px] font-bold text-warning-orange flex items-center mt-xs">
              <span className="material-symbols-outlined text-[16px] mr-1">pending</span> 15 pending closure
            </p>
          </div>
          <div className="p-md bg-warning-orange/10 rounded-full">
            <span className="material-symbols-outlined text-warning-orange text-[32px]">payments</span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-surface-container-lowest p-lg rounded-xl border border-powder-sky shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <p className="font-label-caps text-outline uppercase mb-xs">Conversion Rate</p>
            <h2 className="font-headline-lg text-ink-dark">24.2%</h2>
            <p className="text-[12px] font-bold text-primary flex items-center mt-xs">
              <span className="material-symbols-outlined text-[16px] mr-1">auto_graph</span> AI-optimized target
            </p>
          </div>
          <div className="p-md bg-tertiary-container/10 rounded-full">
            <span className="material-symbols-outlined text-tertiary text-[32px]">hub</span>
          </div>
        </div>
      </section>

      {/* Middle Section */}
      <section className="grid grid-cols-12 gap-lg">
        {/* Left: Top Opportunities */}
        <div className="col-span-8 bg-surface-container-lowest rounded-xl border border-powder-sky shadow-sm overflow-hidden flex flex-col">
          <div className="px-lg py-md border-b border-powder-sky flex justify-between items-center bg-surface-container-lowest">
            <h3 className="font-headline-md text-ink-dark">Top Opportunities</h3>
            <button className="text-primary font-body-sm font-bold flex items-center gap-xs hover:underline">
              View Full Pipeline <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-powder-sky">
                <tr>
                  <th className="px-lg py-md font-label-caps text-outline uppercase text-left">Company Name</th>
                  <th className="px-lg py-md font-label-caps text-outline uppercase text-left">Project description</th>
                  <th className="px-lg py-md font-label-caps text-outline uppercase">Stage</th>
                  <th className="px-lg py-md font-label-caps text-outline uppercase text-center">AI Score</th>
                  <th className="px-lg py-md font-label-caps text-outline uppercase">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-powder-sky">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-lg py-xl text-center text-on-surface-variant">
                      <div className="flex flex-col items-center justify-center gap-sm">
                        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        <p className="font-label-caps uppercase text-sm animate-pulse">Market Researcher Agent scanning for prospects...</p>
                      </div>
                    </td>
                  </tr>
                ) : prospects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-lg py-xl text-center text-on-surface-variant">
                      No prospects found.
                    </td>
                  </tr>
                ) : (
                  prospects.map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-surface-container-low/50 transition-colors cursor-pointer" onClick={() => window.location.href=`/opportunities/${prospect.id}`}>
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-sm">
                          <div className="w-8 h-8 rounded bg-ink-dark text-on-primary flex items-center justify-center font-bold text-[10px]">
                            {prospect.companyName.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-body-md font-semibold text-on-surface hover:text-primary transition-colors">{prospect.companyName}</span>
                        </div>
                      </td>
                      <td className="px-lg py-md font-body-md text-on-surface-variant max-w-md truncate">{prospect.projectDescription}</td>
                      <td className="px-lg py-md">
                        <span className="px-md py-1 bg-secondary-container/20 text-secondary rounded-full text-[12px] font-bold whitespace-nowrap inline-block text-center">{prospect.phase}</span>
                      </td>
                      <td className="px-lg py-md text-center">
                        <div className="relative inline-flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full circular-progress" style={{ '--progress': `${(prospect.aiScore / 100) * 360}deg`, '--tw-primary': '#0b2447' } as React.CSSProperties}></div>
                          <div className="absolute inset-1 bg-surface-container-lowest rounded-full flex items-center justify-center">
                            <span className="text-[10px] font-bold text-on-surface">{prospect.aiScore}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md">
                        <span className={`px-md py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider ${prospect.aiScore > 90 ? 'bg-primary/10 text-primary' : prospect.aiScore > 80 ? 'bg-secondary/10 text-secondary' : 'bg-outline-variant/30 text-on-surface-variant'}`}>
                          {prospect.aiScore > 90 ? 'High' : prospect.aiScore > 80 ? 'Medium' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Priority Alerts */}
        <div className="col-span-4 flex flex-col gap-lg">
          <div className="bg-surface-container-lowest rounded-xl border border-powder-sky shadow-sm flex flex-col h-full overflow-hidden">
            <div className="px-lg py-md border-b border-powder-sky flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-headline-md text-ink-dark">Priority Alerts</h3>
              <span className="bg-primary text-on-primary text-[10px] px-2 py-1 rounded-full font-bold">2 NEW</span>
            </div>
            <div className="p-lg space-y-md flex-1 overflow-y-auto max-h-110">
              {/* Alert 1 */}
              <div className="p-md rounded-lg bg-primary/5 border-l-4 border-primary flex gap-md group hover:bg-primary/10 transition-all cursor-pointer">
                <div className="shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md font-bold text-ink-dark">New Warehouse Construction</p>
                  <p className="font-body-sm text-on-surface-variant mt-xs">A new logistics center is under construction by delhivery</p>
                  <p className="text-[10px] text-outline mt-sm font-bold uppercase">2 hours ago</p>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-md rounded-lg bg-secondary/5 border-l-4 border-secondary flex gap-md group hover:bg-secondary/10 transition-all cursor-pointer">
                <div className="shrink-0">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>event_busy</span>
                </div>
                <div className="flex-1">
                  <p className="font-body-md font-bold text-ink-dark">RFQ Deadline Move</p>
                  <p className="font-body-sm text-on-surface-variant mt-xs">Tata Projects moved 'Project Neptune' deadline to Friday.</p>
                  <p className="text-[10px] text-outline mt-sm font-bold uppercase">4 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Row: Smart Insights Engine */}
      <section className="bg-surface-container-lowest rounded-xl border border-powder-sky shadow-sm overflow-hidden flex flex-col ai-glow">
        <div className="px-lg py-md border-b border-powder-sky flex items-center gap-sm bg-primary-container/5">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h3 className="font-headline-md text-ink-dark">Smart Insights Engine</h3>
          <div className="ml-auto flex items-center gap-md">
            <span className="px-md py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full animate-pulse">LIVE ANALYSIS</span>
            <button className="material-symbols-outlined text-outline hover:text-primary transition-colors">refresh</button>
          </div>
        </div>
        <div className="p-xl grid grid-cols-3 gap-xxl">
          {/* Insight 1 */}
          <div className="space-y-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">trending_up</span>
              <h4 className="font-body-md font-bold text-ink-dark">Market Trend: Eco-Sustainability</h4>
            </div>
            <p className="font-body-sm text-on-surface-variant">AI models detect a 35% increase in Low-VOC requirement mentions.</p>
            <div className="bg-surface-container-low p-md rounded-lg border border-powder-sky/50">
              <p className="text-[12px] font-bold text-primary mb-xs uppercase">Recommendation</p>
              <p className="font-body-sm text-on-surface">Highlight 'EverGreen Series' in upcoming negotiations.</p>
            </div>
          </div>

          {/* Insight 2 */}
          <div className="space-y-md border-x border-powder-sky px-xl">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-secondary">analytics</span>
              <h4 className="font-body-md font-bold text-ink-dark">Competitor Movement</h4>
            </div>
            <p className="font-body-sm text-on-surface-variant">Primary competitor 'Spectra Paints' reduced turnaround time by 40%.</p>
            <div className="bg-surface-container-low p-md rounded-lg border border-powder-sky/50">
              <p className="text-[12px] font-bold text-primary mb-xs uppercase">Strategy Pivot</p>
              <p className="font-body-sm text-on-surface">Use Mascot.AI to lead speed delivery.</p>
            </div>
          </div>

          {/* Insight 3 */}
          <div className="space-y-md">
            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">radar</span>
              <h4 className="font-body-md font-bold text-ink-dark">Regional Growth Corridor</h4>
            </div>
            <p className="font-body-sm text-on-surface-variant">Predictive analysis suggests a cluster of high-value industrial projects.</p>
            <div className="bg-surface-container-low p-md rounded-lg border border-powder-sky/50">
              <p className="text-[12px] font-bold text-primary mb-xs uppercase">Action Item</p>
              <p className="font-body-sm text-on-surface">Allocate 15% more outbound sales to Western Region tier-2.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
