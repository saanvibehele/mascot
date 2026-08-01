from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchResults

# Initialize the DuckDuckGo Search utility
# We use DuckDuckGoSearchResults because it returns snippets and links which are better for Agent context
search = DuckDuckGoSearchResults()

@tool
def market_news_search(query: str) -> str:
    """
    Search the web for the latest news, product launches, or market updates about a specific company.
    Input should be a search query string, e.g. 'Lodha Group latest news 2024'.
    """
    return search.run(query)

@tool
def financial_tender_search(query: str) -> str:
    """
    Search the web specifically for financial reports (revenue, profit) or government tenders/contracts.
    Input should be a targeted search query, e.g. 'site:nseindia.com Lodha Group financials' or 'RERA Lodha Group projects'.
    """
    return search.run(query)

@tool
def social_sentiment_search(query: str) -> str:
    """
    Search the web for recent public opinion, Twitter sentiment, PR backlash, or customer complaints about a company.
    Input should be a search query, e.g. 'Lodha Group customer complaints' or 'Lodha Group Twitter sentiment'.
    """
    return search.run(query)

@tool
def company_info_search(query: str) -> str:
    """
    Search the web for general company information, leadership, recent acquisitions, and overall business strategy.
    Input should be a search query string, e.g. 'Lodha Group company profile leadership'.
    """
    return search.run(query)

@tool
def procurement_tender_search(query: str) -> str:
    """
    Search the web specifically for procurement processes, supply chain details, or active tenders and bids for a company.
    Input should be a search query string, e.g. 'Lodha Group procurement vendor registration tenders'.
    """
    return search.run(query)

# We can group them by agent if needed, or just provide them all.
def get_tools_for_agent(agent_type: str):
    if agent_type == "financial":
        return [financial_tender_search]
    elif agent_type == "news":
        return [market_news_search]
    elif agent_type == "social":
        return [social_sentiment_search]
    elif agent_type == "company":
        return [company_info_search]
    elif agent_type == "procurement":
        return [procurement_tender_search]
    else:
        return [market_news_search, financial_tender_search, social_sentiment_search, company_info_search, procurement_tender_search]
