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
    pitchStrategy: string;
    keySellingPoints: string[];
}

export interface VisionStrategy {
    statement: string;
    attribution: string;
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

    visionStrategy: VisionStrategy;
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
    visionStrategy: {
        statement: "Sustainability-first expansion across South India, focusing on green building certifications and long-term asset durability for luxury residential segments.",
        attribution: "Lodha Group 2025 Vision Statement"
    },
    aiStrategyBrief: {
        confidenceScore: 94,
        recommendation:
            "Prioritize WeatherShield Ultra due to forecasted monsoon intensity in Worli. Competitor AkzoNobel is struggling with inventory on high-durability primers. Emphasize logistics speed. Additionally, recent developments indicate a strong preference for green building certifications, so position the eco-friendly sealants as a core value proposition. Ensure that the sales team highlights the long-term asset durability and reduced maintenance costs associated with our premium tier products. Early engagement with the project architects could yield a significant competitive advantage.",
        pitchStrategy: "Lead with the WeatherShield Ultra's rapid-curing capabilities to address timeline concerns caused by the approaching monsoon. Position our premium line as the only viable option for luxury durability, countering competitor bulk discounts.",
        keySellingPoints: [
            "Rapid 12-hour curing time",
            "10-year durability guarantee",
            "Eco-friendly certification ready"
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
