from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from .llm_factory import get_llm
from .tools import market_news_search, financial_tender_search, social_sentiment_search

# We will need the pydantic model for structured output
from models.schemas import OpportunityData

class AgentState(TypedDict):
    company_name: str
    financial_context: str
    news_context: str
    social_context: str
    final_json: dict

def financial_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    # Direct tool invocation for robustness
    search_results = financial_tender_search.invoke(f"{company} revenue profit RERA tenders")
    
    prompt = f"You are a sales intelligence agent in the commercial painting and coatings industry. Summarize the financial and contract information for {company} based on this search data: {search_results}. Highlight any details relevant to large construction or painting contracts."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"financial_context": res.content if hasattr(res, 'content') else str(res)}

def news_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = market_news_search.invoke(f"{company} latest news market updates real estate construction")
    
    prompt = f"You are a sales intelligence agent in the commercial painting and coatings industry. Summarize the latest news and market updates for {company} based on this search data: {search_results}. Focus on new projects or expansions where paint suppliers might be needed."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"news_context": res.content if hasattr(res, 'content') else str(res)}

def social_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = social_sentiment_search.invoke(f"{company} customer reviews PR sentiment Twitter opinion")
    
    prompt = f"You are a sales intelligence agent in the commercial painting and coatings industry. Summarize the public sentiment and social media opinion for {company} based on this search data: {search_results}."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"social_context": res.content if hasattr(res, 'content') else str(res)}

def master_node(state: AgentState):
    llm = get_llm()
    
    parser = JsonOutputParser(pydantic_object=OpportunityData)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert B2B Sales AI Agent in the commercial painting, coatings, and sealants industry. Your job is to synthesize research into a strict JSON payload matching the OpportunityData schema for a sales representative preparing to pitch to this company. Generate ALL required fields logically based on the provided context. Use current dates where needed. For any 'icon' or 'trendIcon' fields, strictly use lowercase snake_case Material Symbol names (e.g. 'trending_up', 'arrow_upward', 'business_center', 'warning'). Do NOT include any markdown formatting like ```json, just output the raw JSON object."),
        ("human", "Company: {company_name}\n\nFinancial Context:\n{financial_context}\n\nNews Context:\n{news_context}\n\nSocial Context:\n{social_context}\n\n{format_instructions}")
    ])
    
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "company_name": state["company_name"],
        "financial_context": state["financial_context"],
        "news_context": state["news_context"],
        "social_context": state["social_context"],
        "format_instructions": parser.get_format_instructions()
    })
    
    return {"final_json": result}

# Build the Graph
workflow = StateGraph(AgentState)

workflow.add_node("financial_agent", financial_node)
workflow.add_node("news_agent", news_node)
workflow.add_node("social_agent", social_node)
workflow.add_node("master_agent", master_node)

workflow.add_edge(START, "financial_agent")
workflow.add_edge(START, "news_agent")
workflow.add_edge(START, "social_agent")

workflow.add_edge("financial_agent", "master_agent")
workflow.add_edge("news_agent", "master_agent")
workflow.add_edge("social_agent", "master_agent")

workflow.add_edge("master_agent", END)

app = workflow.compile()

def generate_opportunity_insights(company_name: str) -> dict:
    """
    Kicks off the Multi-Agent research workflow and returns the final JSON.
    """
    initial_state = {
        "company_name": company_name,
        "financial_context": "",
        "news_context": "",
        "social_context": "",
        "final_json": {}
    }
    
    # Run the graph
    result = app.invoke(initial_state)
    return result["final_json"]
