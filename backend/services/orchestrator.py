import json
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from services.llm_factory import get_llm
from models.schemas import ProspectList
from services.market_researcher import find_prospective_leads
from services.ai_agent import generate_opportunity_insights

def run_market_analysis_pipeline() -> dict:
    """
    Orchestrator for the Market Analysis Phase.
    Runs the market researcher to find and rank prospects.
    """
    print("Orchestrator: Starting Market Analysis Pipeline")
    return find_prospective_leads()

def run_sales_strategy_pipeline(company_name: str) -> dict:
    """
    Orchestrator for the Deep Dive & Sales Strategy Phase.
    Runs the parallel research nodes and generates the final Sales Strategy.
    """
    print(f"Orchestrator: Starting Sales Strategy Pipeline for {company_name}")
    return generate_opportunity_insights(company_name)
