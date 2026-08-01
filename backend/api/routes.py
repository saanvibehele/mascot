from fastapi import APIRouter, HTTPException
import os
import json
from models.schemas import OpportunityData, ProspectList
from services.orchestrator import run_market_analysis_pipeline, run_sales_strategy_pipeline

router = APIRouter()

PROSPEcripts_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "prospective_leads.json")
PROSPECTS_FILE = PROSPEcripts_FILE

# Intelligent Mock Data
MOCK_OPPORTUNITY = {
  "id": "1",
  "companyName": "Lodha Group",
  "phase": "Tender Released",
  "location": "Mumbai, MH",
  "industryLocation": "Commercial Real Estate",
  "lastUpdated": "2 hours ago",
  "visionStrategy": {
      "statement": "Sustainability-first expansion across South India, focusing on green building certifications and long-term asset durability for luxury residential segments.",
      "attribution": "Lodha Group 2025 Vision Statement"
  },
  "aiStrategyBrief": {
    "confidenceScore": 88,
    "recommendation": "Pitch premium exterior emulsions immediately. The client has a history of prioritizing durability over cost for coastal projects. Highlight the 10-year weather protection warranty of our new APEX line. Additionally, recent developments indicate a strong preference for green building certifications, so position the eco-friendly sealants as a core value proposition. Ensure that the sales team highlights the long-term asset durability and reduced maintenance costs associated with our premium tier products. Early engagement with the project architects could yield a significant competitive advantage.",
    "pitchStrategy": "Pitch premium exterior emulsions immediately. Emphasize the 10-year weather protection warranty of our new APEX line to address coastal weather concerns.",
    "keySellingPoints": [
      "10-year weather protection warranty",
      "Green building certified sealants",
      "Reduced long-term maintenance costs"
    ]
  },
  "signals": [
    { "id": "s1", "type": "WEATHER TREND", "icon": "wb_sunny", "title": "Unexpected Dry Spell Forecast", "description": "Next 14 days optimal for external coating. Advantageous for quick curing.", "colorClass": "text-warning-orange" },
    { "id": "s2", "type": "COMPETITOR MOVE", "icon": "analytics", "title": "AkzoNobel Bulk Discount", "description": "Competitor offering 5% off on orders above 1000L. Counter-strategy advised.", "colorClass": "text-primary" },
    { "id": "s3", "type": "LOGISTICS", "icon": "local_shipping", "title": "Route Congestion: Mumbai Entry", "description": "Expect 4-hour delay at Thane terminal. Advise dispatch by 05:00 AM.", "colorClass": "text-secondary" }
  ],
  "latestNews": [
    { "headline": "Lodha acquires new land parcel in Worli", "summary": "Expansion of premium residential portfolio", "details": "The company plans to develop a 2-million sq.ft luxury project.", "source": "Bloomberg Quint" }
  ],
  "financials": {
    "revenue": "₹9,473 Cr (FY23)",
    "profitMargin": "14.2%",
    "source": "NSE / BSE Filings"
  },
  "previousContracts": [
    { "projectName": "Lodha World Towers", "value": "₹2,500 Cr", "source": "RERA" },
    { "projectName": "Palava City Phase 2", "value": "₹4,100 Cr", "source": "RERA" }
  ],
  "latestUpdates": [
    { "updateText": "Import of high-grade construction steel from Japan", "source": "Zauba Trade Data" }
  ],
  "twitterAnalysis": {
    "sentimentScore": 82,
    "trend": "positive",
    "recentMentions": ["@LodhaGroup launching new sustainable living project", "Competitors feeling the heat from new launch"]
  }
}

@router.get("/prospects", response_model=ProspectList)
def get_prospects():
    """
    Returns the list of prospective clients. Uses cache if available,
    otherwise runs the Market Researcher agent.
    """
    try:
        # Check cache
        if os.path.exists(PROSPECTS_FILE):
            with open(PROSPECTS_FILE, "r") as f:
                data = json.load(f)
                return data
                
        # Cache miss, run the agent
        print("Orchestrator: Running Market Analysis Pipeline...")
        result = run_market_analysis_pipeline()
        
        # Save to cache
        with open(PROSPECTS_FILE, "w") as f:
            json.dump(result, f, indent=2)
            
        return result
    except Exception as e:
        print(f"Error fetching prospects: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch prospects")

@router.get("/opportunities/{opportunity_id}", response_model=OpportunityData)
def get_opportunity(opportunity_id: str):
    # Lookup the company name from the cached prospects
    company = "Kumar Properties" # Default fallback
    
    if os.path.exists(PROSPECTS_FILE):
        try:
            with open(PROSPECTS_FILE, "r") as f:
                data = json.load(f)
                prospects = data.get("prospects", [])
                for p in prospects:
                    if p["id"] == opportunity_id:
                        company = p["companyName"]
                        break
        except Exception as e:
            print(f"Error reading prospects cache: {e}")
            
    # Cache file for this specific opportunity insight
    cache_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), f"insights_{opportunity_id}.json")
    
    # Return from cache if it exists
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r") as f:
                data = json.load(f)
                return data
        except Exception as e:
            print(f"Error reading insight cache: {e}")
            
    print(f"Generating insights for: {company}")
        
    try:
        # Call the Orchestrator Sales Strategy Pipeline
        ai_generated_data = run_sales_strategy_pipeline(company)
        ai_generated_data["id"] = opportunity_id
        
        # Save generated insights to cache
        try:
            with open(cache_file, "w") as f:
                json.dump(ai_generated_data, f, indent=2)
        except Exception as e:
            print(f"Error writing insight cache: {e}")
            
        return ai_generated_data
    except Exception as e:
        print(f"Error generating AI insights: {e}")
        # Fallback to mock data if AI fails
        data = dict(MOCK_OPPORTUNITY)
        data["id"] = opportunity_id
        return data
