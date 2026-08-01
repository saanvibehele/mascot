from pydantic import BaseModel
from typing import List, Optional

class RiskFactor(BaseModel):
    label: str
    value: str
    trendIcon: str
    colorClass: str

class AIStrategyBrief(BaseModel):
    confidenceScore: int
    recommendation: str
    riskFactors: List[RiskFactor]


class VisionStrategy(BaseModel):
    statement: str
    attribution: str

class Signal(BaseModel):
    id: str
    type: str
    icon: str
    title: str
    description: str
    colorClass: str

class LatestNews(BaseModel):
    headline: str
    summary: str
    details: str
    source: str

class Financials(BaseModel):
    revenue: str
    profitMargin: str
    source: str

class Contract(BaseModel):
    projectName: str
    value: str
    source: str

class TwitterSensitivity(BaseModel):
    sentimentScore: int
    trend: str
    recentMentions: List[str]


class LatestUpdate(BaseModel):
    updateText: str
    source: str

class OpportunityData(BaseModel):
    id: str
    companyName: str
    phase: str
    location: str
    industryLocation: str
    lastUpdated: str
    
    visionStrategy: VisionStrategy
    aiStrategyBrief: AIStrategyBrief
    
    signals: List[Signal]
    
    latestNews: List[LatestNews]
    financials: Financials
    previousContracts: List[Contract]
    latestUpdates: List[LatestUpdate]
    twitterAnalysis: TwitterSensitivity

class Prospect(BaseModel):
    id: str
    companyName: str
    projectDescription: str
    value: str
    phase: str
    aiScore: int

class ProspectList(BaseModel):
    prospects: List[Prospect]
