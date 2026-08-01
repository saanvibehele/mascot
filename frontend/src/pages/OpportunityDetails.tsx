import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { OpportunityData } from "../data/mockOpportunity";

export default function OpportunityDetails() {
    const { id } = useParams();
    const [data, setData] = useState<OpportunityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeStrategyTab, setActiveStrategyTab] = useState<'overview' | 'pitch'>('overview');

    useEffect(() => {
        async function fetchOpportunity() {
            try {
                const response = await fetch(
                    `http://localhost:8000/api/opportunities/${id}`,
                );
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    console.error("Failed to fetch data");
                }
            } catch (error) {
                console.error("Error fetching opportunity data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOpportunity();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-md">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    <p className="font-label-caps text-outline uppercase tracking-wider animate-pulse">
                        AI Agent generating insights...
                    </p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-xl">
                Failed to load opportunity data. Ensure backend is running.
            </div>
        );
    }

    return (
        <div className="p-xl space-y-lg animate-in fade-in duration-500 overflow-y-auto h-full">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-xs text-on-surface-variant">
                <Link
                    to="/"
                    className="font-label-caps text-label-caps hover:text-primary transition-colors cursor-pointer"
                >
                    Dashboard
                </Link>
                <span className="material-symbols-outlined text-[16px]">
                    chevron_right
                </span>
                <Link
                    to="/market-intelligence"
                    className="font-label-caps text-label-caps hover:text-primary transition-colors cursor-pointer"
                >
                    Market Intelligence
                </Link>
                <span className="material-symbols-outlined text-[16px]">
                    chevron_right
                </span>
                <span className="font-label-caps text-label-caps text-primary font-bold">
                    {data.companyName}
                </span>
            </nav>

            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="font-headline-lg text-ink-dark">
                        {data.companyName}
                    </h2>
                    <div className="flex items-center gap-md mt-sm">
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-bold rounded-full text-label-caps">
                            {data.phase}
                        </span>
                        <span className="flex items-center gap-xs text-on-surface-variant font-body-sm">
                            <span className="material-symbols-outlined text-[18px]">
                                location_on
                            </span>
                            {data.location}
                        </span>
                        <span className="flex items-center gap-xs text-on-surface-variant font-body-sm">
                            <span className="material-symbols-outlined text-[18px]">
                                domain
                            </span>
                            {data.industryLocation}
                        </span>
                        <span className="flex items-center gap-xs text-on-surface-variant font-body-sm">
                            <span className="material-symbols-outlined text-[18px]">
                                calendar_today
                            </span>
                            {data.lastUpdated}
                        </span>
                    </div>
                </div>
                <div className="flex gap-md">
                    <button className="px-lg py-sm border border-outline-variant text-on-surface-variant font-bold rounded-lg hover:bg-surface-container-low transition-colors">
                        Save Draft
                    </button>
                    <button className="px-lg py-sm bg-primary text-on-primary font-bold rounded-lg shadow-md hover:bg-primary/90 transition-all flex items-center gap-md">
                        Submit Quotation
                        <span className="material-symbols-outlined text-[18px]">
                            send
                        </span>
                    </button>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-12 gap-lg">
                {/* AI Strategy Brief (6 columns) */}
                <div className="col-span-12 lg:col-span-6 flex flex-col">
                    <section className="bg-primary-container/20 rounded-xl p-lg relative overflow-hidden shadow-sm border border-outline-variant flex-1 flex flex-col">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-[120px] text-primary">
                                smart_toy
                            </span>
                        </div>
                        <div className="relative z-10 flex-1 flex flex-col min-h-0">
                            <div className="flex items-center justify-between mb-lg shrink-0">
                                <h3 className="font-headline-md text-primary flex items-center gap-sm">
                                    <span
                                        className="material-symbols-outlined"
                                        style={{
                                            fontVariationSettings: "'FILL' 1",
                                        }}
                                    >
                                        auto_awesome
                                    </span>
                                    AI Strategy Brief
                                </h3>
                                <div className="flex flex-col items-end">
                                    <span className="font-data-lg text-primary">
                                        {data.aiStrategyBrief.confidenceScore}%
                                    </span>
                                    <span className="font-label-caps text-label-caps text-on-surface-variant">
                                        Confidence
                                    </span>
                                </div>
                            </div>
                            
                            {/* Tabs Header */}
                            <div className="flex items-center gap-md border-b border-outline-variant mb-md pb-xs shrink-0">
                                <button
                                    onClick={() => setActiveStrategyTab('overview')}
                                    className={`font-label-caps text-label-caps uppercase pb-xs border-b-2 transition-colors ${activeStrategyTab === 'overview' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-ink-dark'}`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setActiveStrategyTab('pitch')}
                                    className={`font-label-caps text-label-caps uppercase pb-xs border-b-2 transition-colors ${activeStrategyTab === 'pitch' ? 'border-primary text-primary font-bold' : 'border-transparent text-on-surface-variant hover:text-ink-dark'}`}
                                >
                                    Pitch Strategy
                                </button>
                            </div>

                            <div className="flex-1 grid grid-cols-1">
                                {/* Overview Tab */}
                                <div className={`col-start-1 row-start-1 flex flex-col gap-md transition-all duration-300 ease-out transform ${activeStrategyTab === 'overview' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-2 z-0 pointer-events-none'}`}>
                                    <div className="bg-surface-container-lowest p-md rounded-lg border border-powder-sky flex flex-col shrink-0 w-full">
                                        <p className="font-label-caps text-label-caps text-primary uppercase mb-xs">
                                            Mascot Recommendation
                                        </p>
                                        <p className="font-body-md text-ink-dark leading-relaxed">
                                            {data.aiStrategyBrief.recommendation}
                                        </p>
                                    </div>
                                    <div className="bg-surface-container-lowest p-md rounded-lg border border-powder-sky flex flex-col shrink-0 w-full">
                                        <p className="font-label-caps text-label-caps text-primary uppercase mb-xs flex items-center gap-xs">
                                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                            Key Selling Points
                                        </p>
                                        <ul className="list-disc pl-5 mt-2 space-y-1">
                                            {data.aiStrategyBrief.keySellingPoints.map((point, idx) => (
                                                <li key={idx} className="font-body-md text-ink-dark">{point}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                
                                {/* Pitch Strategy Tab */}
                                <div className={`col-start-1 row-start-1 flex flex-col transition-all duration-300 ease-out transform ${activeStrategyTab === 'pitch' ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-2 z-0 pointer-events-none'}`}>
                                    <div className="bg-surface-container-lowest p-md rounded-lg border border-powder-sky flex flex-col h-full w-full">
                                        <p className="font-label-caps text-label-caps text-primary uppercase mb-xs shrink-0">
                                            Pitch Strategy
                                        </p>
                                        <div className="flex-1 overflow-y-auto pr-2 min-h-0" style={{ scrollbarWidth: 'thin' }}>
                                            <p className="font-body-md text-ink-dark leading-relaxed">
                                                {data.aiStrategyBrief.pitchStrategy}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Context Cards Column (6 columns) */}
                <div className="col-span-12 lg:col-span-6 space-y-lg flex flex-col">
                    {/* Vision & Strategy */}
                    <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant flex-1">
                        <div className="flex items-center gap-xs mb-md">
                            <span className="material-symbols-outlined text-primary">
                                lightbulb
                            </span>
                            <h5 className="font-label-caps text-label-caps uppercase">
                                Vision & Strategy
                            </h5>
                        </div>
                        <div className="flex flex-col gap-sm">
                            <p className="font-body-md text-ink-dark leading-relaxed">
                                "{data.visionStrategy.statement}"
                            </p>
                            <p className="text-[12px] text-on-surface-variant font-bold uppercase tracking-wider">
                                — {data.visionStrategy.attribution}
                            </p>
                        </div>
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant flex-1">
                        <div className="flex items-center gap-xs mb-md">
                            <span className="material-symbols-outlined text-primary">
                                account_balance
                            </span>
                            <h5 className="font-label-caps text-label-caps uppercase">
                                Financials
                            </h5>
                        </div>
                        <div className="grid grid-cols-2 gap-md">
                            <div>
                                <p className="text-on-surface-variant text-[12px] uppercase">
                                    Revenue
                                </p>
                                <p className="font-data-lg text-ink-dark">
                                    {data.financials.revenue}
                                </p>
                            </div>
                            <div>
                                <p className="text-on-surface-variant text-[12px] uppercase">
                                    Profit Margin
                                </p>
                                <p className="font-data-lg text-ink-dark">
                                    {data.financials.profitMargin}
                                </p>
                            </div>
                        </div>
                        <p className="text-[12px] text-on-surface-variant mt-sm">
                            Source: {data.financials.source}
                        </p>
                    </div>

                    <div className="bg-surface-container-low rounded-xl p-lg border border-outline-variant flex-1">
                        <div className="flex items-center justify-between mb-md">
                            <div className="flex items-center gap-xs">
                                <span className="material-symbols-outlined text-primary">
                                    forum
                                </span>
                                <h5 className="font-label-caps text-label-caps uppercase">
                                    Social Sentiment
                                </h5>
                            </div>
                            <span className="px-3 py-1 bg-success-green/20 text-success-green text-[12px] rounded-full font-bold uppercase">
                                {data.twitterAnalysis.trend}
                            </span>
                        </div>
                        <div className="flex items-center gap-md mb-md">
                            <div
                                className="w-16 h-16 rounded-full circular-progress relative flex items-center justify-center shrink-0"
                                style={
                                    {
                                        "--progress": `${(data.twitterAnalysis.sentimentScore / 100) * 360}deg`,
                                        "--tw-primary": "#2E7D32",
                                    } as React.CSSProperties
                                }
                            >
                                <div className="absolute inset-2 bg-surface-container-low rounded-full flex items-center justify-center font-bold text-success-green">
                                    {data.twitterAnalysis.sentimentScore}
                                </div>
                            </div>
                            <p className="font-body-md text-on-surface-variant">
                                Overall positive brand perception detected based
                                on recent sentiment tracking.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Signals row (12 columns) */}
                <div className="col-span-12">
                    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg shadow-sm">
                        <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-md">
                            <span
                                className="material-symbols-outlined text-primary text-[24px]"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                sensors
                            </span>
                            <h4 className="font-headline-sm text-ink-dark">
                                Market Signals
                            </h4>
                            <span className="bg-primary/10 text-primary px-3 py-0.5 rounded-full text-sm font-bold ml-2">
                                {data.signals.length} Active
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                            {data.signals.map((signal) => (
                                <div
                                    key={signal.id}
                                    className="border border-outline-variant rounded-lg p-md hover:shadow-md transition-all bg-surface-container-low"
                                >
                                    <div className="flex items-center gap-sm mb-sm">
                                        <span
                                            className={`material-symbols-outlined ${signal.colorClass}`}
                                        >
                                            {signal.icon
                                                .toLowerCase()
                                                .replace(/-/g, "_")}
                                        </span>
                                        <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                                            {signal.type}
                                        </span>
                                    </div>
                                    <p className="font-body-md font-bold text-ink-dark">
                                        {signal.title}
                                    </p>
                                    <p className="text-[14px] text-on-surface-variant mt-sm">
                                        {signal.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* News & Updates (6 columns) */}
                <div className="col-span-12 lg:col-span-6 space-y-lg">
                    <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm h-full">
                        <div className="flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-secondary text-[24px]">
                                newspaper
                            </span>
                            <h4 className="font-headline-sm text-ink-dark">
                                News & Updates
                            </h4>
                        </div>

                        <div className="space-y-lg">
                            {data.latestNews.map((news, i) => (
                                <div
                                    key={i}
                                    className="border-l-4 border-secondary pl-4"
                                >
                                    <p className="font-body-md font-bold text-ink-dark">
                                        {news.headline}
                                    </p>
                                    <p className="text-[14px] text-on-surface-variant mt-2">
                                        {news.summary}
                                    </p>
                                    <p className="text-[12px] text-outline mt-2 italic">
                                        Source: {news.source}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-xl pt-lg border-t border-outline-variant">
                            <div className="flex items-center gap-xs mb-md">
                                <span className="material-symbols-outlined text-tertiary">
                                    update
                                </span>
                                <h5 className="font-label-caps text-label-caps uppercase text-on-surface-variant">
                                    Recent Updates
                                </h5>
                            </div>
                            <div className="space-y-md">
                                {data.latestUpdates.map((update, i) => (
                                    <div
                                        key={i}
                                        className="bg-surface-container-low p-md rounded border border-outline-variant"
                                    >
                                        <p className="font-body-sm text-ink-dark">
                                            {update.updateText}
                                        </p>
                                        <p className="text-[12px] text-outline mt-1">
                                            Source: {update.source}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contracts (6 columns) */}
                <div className="col-span-12 lg:col-span-6">
                    <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm h-full">
                        <div className="flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-warning-orange text-[24px]">
                                assignment
                            </span>
                            <h4 className="font-headline-sm text-ink-dark">
                                Previous Contracts
                            </h4>
                        </div>
                        <div className="space-y-md">
                            {data.previousContracts.map((contract, i) => (
                                <div
                                    key={i}
                                    className="bg-surface-container-low p-lg rounded-lg border border-outline-variant flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-body-md font-bold text-ink-dark">
                                            {contract.projectName}
                                        </p>
                                        <p className="text-[12px] text-outline mt-1">
                                            Source: {contract.source}
                                        </p>
                                    </div>
                                    <p className="font-headline-sm text-primary font-bold">
                                        {contract.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Key Decision Makers */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm h-full">
                        <div className="flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-primary text-[24px]">
                                group
                            </span>
                            <h4 className="font-headline-sm text-ink-dark">
                                Key Decision Makers
                            </h4>
                        </div>
                        <ul className="space-y-sm">
                            {data.keyDecisionMakers?.map((maker, i) => (
                                <li key={i} className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">person</span>
                                    <span className="font-body-md text-ink-dark">{maker}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Vendor Ecosystem */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm h-full">
                        <div className="flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-secondary text-[24px]">
                                handshake
                            </span>
                            <h4 className="font-headline-sm text-ink-dark">
                                Vendor Ecosystem
                            </h4>
                        </div>
                        <ul className="space-y-md">
                            {data.vendorEcosystem?.map((vendor, i) => (
                                <li key={i} className="flex items-start gap-sm bg-surface-container-low p-sm rounded border border-outline-variant">
                                    <span className="material-symbols-outlined text-[20px] text-primary mt-0.5 shrink-0">storefront</span>
                                    <div className="flex flex-col">
                                        <span className="font-body-md font-bold text-ink-dark">{vendor.name}</span>
                                        <span className="text-[13px] text-on-surface-variant leading-tight mt-0.5">{vendor.relation}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Upcoming Projects */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm h-full">
                        <div className="flex items-center gap-xs mb-lg">
                            <span className="material-symbols-outlined text-tertiary text-[24px]">
                                construction
                            </span>
                            <h4 className="font-headline-sm text-ink-dark">
                                Upcoming Projects
                            </h4>
                        </div>
                        <ul className="space-y-sm">
                            {data.upcomingProjects?.map((project, i) => (
                                <li key={i} className="flex items-start gap-sm">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant mt-0.5">architecture</span>
                                    <span className="font-body-md text-ink-dark">{project}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
