from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from .llm_factory import get_llm
from .tools import (
    market_news_search, 
    financial_tender_search, 
    social_sentiment_search,
    company_info_search,
    procurement_tender_search
)

from models.schemas import OpportunityData

class AgentState(TypedDict):
    company_name: str
    company_context: str
    financial_context: str
    news_context: str
    social_context: str
    procurement_context: str
    final_json: dict

def company_research_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = company_info_search.invoke(f"{company} company profile leadership operations")
    prompt = f"You are a sales intelligence agent. Summarize the general background, leadership, and core business of {company} based on this data: {search_results}. Keep it focused on factors relevant for B2B sales."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"company_context": res.content if hasattr(res, 'content') else str(res)}

def financial_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = financial_tender_search.invoke(f"{company} revenue profit growth financial report")
    prompt = f"You are a sales intelligence agent. Summarize the financial health and scale of operations for {company} based on this data: {search_results}. Highlight details relevant to large infrastructure investments."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"financial_context": res.content if hasattr(res, 'content') else str(res)}

def news_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = market_news_search.invoke(f"{company} latest news market updates real estate construction")
    prompt = f"You are a sales intelligence agent. Summarize the latest news and market updates for {company} based on this data: {search_results}. Focus on new projects or expansions."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"news_context": res.content if hasattr(res, 'content') else str(res)}

def social_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = social_sentiment_search.invoke(f"{company} customer reviews PR sentiment Twitter")
    prompt = f"You are a sales intelligence agent. Summarize the public sentiment and social media opinion for {company} based on this data: {search_results}."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"social_context": res.content if hasattr(res, 'content') else str(res)}

def procurement_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = procurement_tender_search.invoke(f"{company} procurement vendor registration supply chain tenders bids")
    prompt = f"You are a sales intelligence agent. Summarize the procurement processes, active tenders, or vendor criteria for {company} based on this data: {search_results}. Focus on how they buy materials and select suppliers."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"procurement_context": res.content if hasattr(res, 'content') else str(res)}

def sales_strategy_node(state: AgentState):
    llm = get_llm()
    
    parser = JsonOutputParser(pydantic_object=OpportunityData)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert B2B Sales Strategy AI Agent in the commercial painting, coatings, and sealants industry. Your job is to synthesize all research into a highly actionable, strict JSON payload matching the OpportunityData schema for a sales representative preparing to pitch to this company.\n\nCRITICAL INSTRUCTION: The 'aiStrategyBrief' MUST be elaborate and heavily focused on giving the sales team a direct strategy to win the deal. It should contain:\n1. 'recommendation': A high-level summary.\n2. 'pitchStrategy': A detailed, multi-paragraph script/strategy on exactly how to position the product, what pain points to target, and how to outmaneuver competitors based on the research.\n3. 'keySellingPoints': An array of specific features/benefits to emphasize to this specific buyer.\n\nGenerate ALL required fields logically based on the provided context. Use current dates where needed. For any 'icon' or 'trendIcon' fields, strictly use lowercase snake_case Material Symbol names (e.g. 'trending_up', 'arrow_upward', 'business_center', 'warning'). Do NOT include any markdown formatting like ```json, just output the raw JSON object."),
        ("human", "Company: {company_name}\n\nCompany Background:\n{company_context}\n\nFinancial Context:\n{financial_context}\n\nNews Context:\n{news_context}\n\nSocial Context:\n{social_context}\n\nProcurement Context:\n{procurement_context}\n\n{format_instructions}")
    ])
    
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "company_name": state["company_name"],
        "company_context": state["company_context"],
        "financial_context": state["financial_context"],
        "news_context": state["news_context"],
        "social_context": state["social_context"],
        "procurement_context": state["procurement_context"],
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"final_json": result}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("company_agent", company_research_node)
workflow.add_node("financial_agent", financial_node)
workflow.add_node("news_agent", news_node)
workflow.add_node("social_agent", social_node)
workflow.add_node("procurement_agent", procurement_node)
workflow.add_node("sales_strategy_agent", sales_strategy_node)

workflow.add_edge(START, "company_agent")
workflow.add_edge(START, "financial_agent")
workflow.add_edge(START, "news_agent")
workflow.add_edge(START, "social_agent")
workflow.add_edge(START, "procurement_agent")

workflow.add_edge("company_agent", "sales_strategy_agent")
workflow.add_edge("financial_agent", "sales_strategy_agent")
workflow.add_edge("news_agent", "sales_strategy_agent")
workflow.add_edge("social_agent", "sales_strategy_agent")
workflow.add_edge("procurement_agent", "sales_strategy_agent")

workflow.add_edge("sales_strategy_agent", END)

app = workflow.compile()

def generate_opportunity_insights(company_name: str) -> dict:
    """
    Kicks off the Multi-Agent parallel research workflow and returns the final JSON.
    """
    initial_state = {
        "company_name": company_name,
        "company_context": "",
        "financial_context": "",
        "news_context": "",
        "social_context": "",
        "procurement_context": "",
        "final_json": {}
    }
    
    # Run the graph
    result = app.invoke(initial_state)
    return result["final_json"]
