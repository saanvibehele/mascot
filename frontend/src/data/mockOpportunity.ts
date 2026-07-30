export interface Prospect {
    id: string;
    companyName: string;
    projectDescription: string;
    value: string;
    phase: string;
    aiScore: number;
}

export interface AIStrategyBrief {
    confidenceScore: number;
    recommendation: string;
    riskFactors: {
        label: string;
        value: string;
        trendIcon: string;
        colorClass: string;
    }[];
}

export interface Signal {
    id: string;
    type: string;
    icon: string;
    title: string;
    description: string;
    colorClass: string;
}

export interface LatestNews {
    headline: string;
    summary: string;
    details: string;
    source: string;
}

export interface Financials {
    revenue: string;
    profitMargin: string;
    source: string; // MO Corporate Affairs, NSE, BSE, etc.
}

export interface Contract {
    projectName: string;
    value: string;
    source: string; // RERA, Gov tender portals, gem
}

export interface TwitterSensitivity {
    sentimentScore: number; // 0 to 100
    trend: "positive" | "negative" | "neutral";
    recentMentions: string[];
}

export interface OpportunityData {
    id: string;
    companyName: string;
    phase: string;
    location: string;
    industryLocation: string; // Location of industry/office
    lastUpdated: string;

    aiStrategyBrief: AIStrategyBrief;

    signals: Signal[];

    // New AI fields
    latestNews: LatestNews[];
    financials: Financials;
    previousContracts: Contract[];
    latestUpdates: {
        updateText: string;
        source: string; // Their own website, DGFT, Volza, Zauba
    }[];
    twitterAnalysis: TwitterSensitivity;
}

export const mockOpportunityData: OpportunityData = {
    id: "1",
    companyName: "Lodha Group",
    phase: "RFQ PHASE",
    location: "Upper Worli, Mumbai",
    industryLocation: "Lower Parel, Mumbai (HQ)",
    lastUpdated: "Updated 2 hours ago",
    aiStrategyBrief: {
        confidenceScore: 94,
        recommendation:
            "Prioritize WeatherShield Ultra due to forecasted monsoon intensity in Worli. Competitor AkzoNobel is struggling with inventory on high-durability primers. Emphasize logistics speed.",
        riskFactors: [
            {
                label: "Humidity Risk",
                value: "82%",
                trendIcon: "humidity_percentage",
                colorClass: "text-alert-coral",
            },
            {
                label: "Pricing Delta",
                value: "-4.2%",
                trendIcon: "trending_down",
                colorClass: "text-success-green",
            },
        ],
    },
    signals: [
        {
            id: "s1",
            type: "WEATHER TREND",
            icon: "wb_sunny",
            title: "Unexpected Dry Spell Forecast",
            description:
                "Next 14 days optimal for external coating. Advantageous for quick curing.",
            colorClass: "text-warning-orange",
        },
        {
            id: "s2",
            type: "COMPETITOR MOVE",
            icon: "analytics",
            title: "AkzoNobel Bulk Discount",
            description:
                "Competitor offering 5% off on orders above 1000L. Counter-strategy advised.",
            colorClass: "text-primary",
        },
        {
            id: "s3",
            type: "LOGISTICS",
            icon: "local_shipping",
            title: "Route Congestion: Mumbai Entry",
            description:
                "Expect 4-hour delay at Thane terminal. Advise dispatch by 05:00 AM.",
            colorClass: "text-secondary",
        },
    ],
    latestNews: [
        {
            headline: "Lodha acquires new land parcel in Worli",
            summary: "Expansion of premium residential portfolio",
            details:
                "The company plans to develop a 2-million sq.ft luxury project.",
            source: "Bloomberg Quint",
        },
    ],
    financials: {
        revenue: "₹9,473 Cr (FY23)",
        profitMargin: "14.2%",
        source: "NSE / BSE Filings",
    },
    previousContracts: [
        {
            projectName: "Lodha World Towers",
            value: "₹2,500 Cr",
            source: "RERA",
        },
        {
            projectName: "Palava City Phase 2",
            value: "₹4,100 Cr",
            source: "RERA",
        },
    ],
    latestUpdates: [
        {
            updateText: "Import of high-grade construction steel from Japan",
            source: "Zauba Trade Data",
        },
    ],
    twitterAnalysis: {
        sentimentScore: 82,
        trend: "positive",
        recentMentions: [
            "@LodhaGroup launching new sustainable living project",
            "Competitors feeling the heat from new launch",
        ],
    },
};
