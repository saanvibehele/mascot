import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { OpportunityData } from "../data/mockOpportunity";

export default function OpportunityDetails() {
    const { id } = useParams();
    const [data, setData] = useState<OpportunityData | null>(null);
    const [loading, setLoading] = useState(true);

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
                    <section className="bg-primary-container/20 rounded-xl p-lg relative overflow-hidden shadow-sm border border-outline-variant flex-1 h-full">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <span className="material-symbols-outlined text-[120px] text-primary">
                                smart_toy
                            </span>
                        </div>
                        <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-lg">
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
                            <div className="space-y-md flex-1">
                                <div className="bg-surface-container-lowest p-md rounded-lg border border-powder-sky">
                                    <p className="font-label-caps text-label-caps text-primary uppercase mb-xs">
                                        Mascot Recommendation
                                    </p>
                                    <p className="font-body-md text-ink-dark leading-relaxed">
                                        {data.aiStrategyBrief.recommendation}
                                    </p>
                                </div>
                                <div className="grid grid-cols-2 gap-md">
                                    {data.aiStrategyBrief.riskFactors.map(
                                        (risk, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-surface-container-lowest p-md rounded-lg border border-powder-sky"
                                            >
                                                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs">
                                                    {risk.label}
                                                </p>
                                                <div className="flex items-center gap-sm">
                                                    <span
                                                        className={`font-data-lg ${risk.colorClass}`}
                                                    >
                                                        {risk.value}
                                                    </span>
                                                    <span
                                                        className={`material-symbols-outlined ${risk.colorClass}`}
                                                    >
                                                        {risk.trendIcon
                                                            .toLowerCase()
                                                            .replace(/-/g, "_")}
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Vision, Financials, and Twitter Sentiment (6 columns) */}
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
                                    Social Sentiment (Twitter)
                                </h5>
                            </div>
                            <span className="px-3 py-1 bg-success-green/20 text-success-green text-[12px] rounded-full font-bold uppercase">
                                {data.twitterAnalysis.trend}
                            </span>
                        </div>
                        <div className="flex items-center gap-md mb-md">
                            <div
                                className="w-16 h-16 rounded-full circular-progress relative flex items-center justify-center"
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
                        <ul className="text-[12px] text-on-surface-variant list-disc pl-4 space-y-1">
                            {data.twitterAnalysis.recentMentions.map(
                                (mention, i) => (
                                    <li key={i}>{mention}</li>
                                ),
                            )}
                        </ul>
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
            </div>
        </div>
    );
}
