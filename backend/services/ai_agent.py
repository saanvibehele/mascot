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
    
    queries = [
        f"{company} company",
        f"{company} latest projects",
        f"{company} annual report",
        f"{company} site:linkedin.com",
        f"{company} site:wikipedia.com",
        f"{company} site:inc42.com",
        f"{company} site:zaubacorp.com"
    ]
    
    combined_results = []
    for query in queries:
        try:
            result = company_info_search.invoke(query)
            combined_results.append(f"--- Results for '{query}' ---\n{result}")
        except Exception as e:
            pass
            
    search_results = "\n\n".join(combined_results)
    with open("company_context.txt", "w", encoding="utf-8") as file:
        file.write(search_results)
    
    prompt = f"You are a sales intelligence agent. Goal: Understand the company {company}. Based on this data:\n{search_results}\n\nExplicitly extract the following: Company description, Industry, latest projects. Prioritize information from Google Search, the Company Website, Wikipedia, LinkedIn Company Page, and Annual Reports."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"company_context": res.content if hasattr(res, 'content') else str(res)}

def financial_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]

    queries = [
        f"{company} revenue",
        f"{company} profit growth",
        f"{company} NSE",
        f"{company} BSE",
        f"{company} MO Corporate Affairs",
        f"{company} Audit firm reports PWC",
        f"{company} Audit firm reports BCG",
        f"{company} site:companiesmarketcap.com",
        f"{company} SEC filings",
        f"{company} capital expenditure OR new investments",
        f"{company} previous contracts OR factory expansion",

    ]
    
    combined_results = []
    
    # Try to fetch yfinance data
    ticker_prompt = f"What is the Yahoo Finance ticker symbol for {company}? If it's an Indian company on NSE, append '.NS'. Reply ONLY with the ticker symbol (e.g. RELIANCE.NS, TCS.NS, AAPL). If it is not a publicly traded company or you don't know, reply 'NONE'."
    ticker_res = llm.invoke([HumanMessage(content=ticker_prompt)])
    
    ticker_content = ticker_res.content
    if isinstance(ticker_content, list):
        # Extract text from blocks if it's a list
        ticker_str = " ".join([block.get("text", "") for block in ticker_content if isinstance(block, dict) and "text" in block])
    else:
        ticker_str = str(ticker_content)
        
    ticker = ticker_str.strip().strip("'").strip('"')
    print(ticker)
    
    if ticker.upper() != "NONE":
        try:
            from .tools import yfinance_financials
            yf_result = yfinance_financials.invoke(ticker)
            combined_results.append(f"--- YFinance Data for {ticker} ---\n{yf_result}")
        except Exception as e:
            pass

    for query in queries:
        try:
            result = financial_tender_search.invoke(query)
            combined_results.append(f"--- Results for '{query}' ---\n{result}")
        except Exception as e:
            pass
            
    search_results = "\n\n".join(combined_results)
    with open("financial_context.txt", "w", encoding="utf-8") as file:
        file.write(search_results)
    
    prompt = f"You are a sales intelligence agent. Summarize the financial health and scale of operations for {company} based on this data:\n{search_results}\n\nExplicitly extract the following if available: Revenue, Profit, Capital expenditure, New investments, previous contracts, and Factory expansion. Prioritize extracting data from authentic sources like Annual Reports, Yahoo Finance, NSE/BSE, CompaniesMarketCap, and SEC filings. Highlight details relevant to large infrastructure investments."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"financial_context": res.content if hasattr(res, 'content') else str(res)}

def news_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]

    queries = [
        f"{company} latest news",
        f"{company} market updates",
        f"{company} site:volza.com",
        f"{company} site:dgft.gov.in",
        f"{company} site:reuters.com",
        f"{company} site:economictimes.indiatimes.com",
        f"{company} site:business-standard.com",
    ]
    
    combined_results = []
    
    # Try fetching Google News using gnews
    try:
        from .tools import google_news_search
        gnews_query = f"{company} expansion OR new projects OR facility"
        gnews_result = google_news_search.invoke(gnews_query)
        combined_results.append(gnews_result)
    except Exception as e:
        pass
        
    for query in queries:
        try:
            result = market_news_search.invoke(query)
            combined_results.append(f"--- Results for '{query}' ---\n{result}")
        except Exception as e:
            pass
            
    search_results = "\n\n".join(combined_results)
    with open("news_context.txt", "w", encoding="utf-8") as file:
        file.write(search_results)
    
    prompt = f"You are a sales intelligence agent. Goal: Find recent developments for {company}. Based on this data:\n{search_results}\n\nExplicitly extract the following if available: acquisitions, mergers, expansion, partnerships, product launches, and sustainability initiatives. Prioritize information from Google News, Reuters, Economic Times, Business Standard, and Company press releases."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"news_context": res.content if hasattr(res, 'content') else str(res)}

def social_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]
    
    search_results = social_sentiment_search.invoke(f"{company} customer reviews PR sentiment Twitter")
    with open("social_context.txt", "w", encoding="utf-8") as file:
        file.write(search_results)
    prompt = f"You are a sales intelligence agent. Summarize the public sentiment and social media opinion for {company} based on this data: {search_results}."
    res = llm.invoke([HumanMessage(content=prompt)])
    
    return {"social_context": res.content if hasattr(res, 'content') else str(res)}

def procurement_node(state: AgentState):
    llm = get_llm()
    company = state["company_name"]

    queries = [
        f"{company} procurement",
        f"{company} previous contracts",
        f"{company} rera",
        f"{company} government tender portals",
        f"{company} GEM",
    ]
    combined_results = []
    for query in queries:
        try:
            result = procurement_tender_search.invoke(query)
            combined_results.append(f"--- Results for '{query}' ---\n{result}")
        except Exception as e:
            pass
    
    search_results = "\n\n".join(combined_results)
    with open("procurement_context.txt", "w", encoding="utf-8") as file:
        file.write(search_results)
    
    prompt = f"You are a sales intelligence agent. Summarize the procurement processes, active tenders, and previous contracts built by {company} based on this data: {search_results}. Prioritize data from authentic sources like RERA, Gov tender portals, and GeM. Focus on how they buy materials and what large projects they have built."
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
