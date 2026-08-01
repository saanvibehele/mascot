from langchain.tools import tool
from langchain_community.tools import DuckDuckGoSearchResults

# Initialize the DuckDuckGo Search utility
# We use DuckDuckGoSearchResults because it returns snippets and links which are better for Agent context
search = DuckDuckGoSearchResults()

@tool
def yfinance_financials(ticker: str) -> str:
    """
    Fetch financial data (revenue, profit, market cap, etc.) for a specific ticker symbol using yfinance.
    Input MUST be a valid ticker symbol (e.g., 'AAPL', 'RELIANCE.NS').
    """
    try:
        import yfinance as yf
        stock = yf.Ticker(ticker)
        info = stock.info
        financials = stock.financials
        
        market_cap = info.get('marketCap', 'N/A')
        total_revenue = info.get('totalRevenue', 'N/A')
        gross_profits = info.get('grossProfits', 'N/A')
        ebitda = info.get('ebitda', 'N/A')
        
        summary = f"Ticker: {ticker}\nMarket Cap: {market_cap}\nTotal Revenue: {total_revenue}\nGross Profits: {gross_profits}\nEBITDA: {ebitda}\n"
        
        if financials is not None and not financials.empty:
            # Get the most recent 2 years of financial data
            summary += "\nRecent Financials (Top metrics):\n"
            summary += financials.head(10).to_string()
            
        return summary
    except Exception as e:
        return f"Error fetching data for {ticker}: {e}"

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

@tool
def google_news_search(query: str) -> str:
    """
    Search Google News for the latest articles about a specific company or topic.
    Input should be the search query, e.g. 'Lodha Group expansion'.
    """
    try:
        import requests
        import feedparser
        import urllib.parse
        
        # Build the Google News RSS URL
        encoded_query = urllib.parse.quote(query)
        print(encoded_query)
        url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
        
        # Google News blocks requests without a valid User-Agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        resp = requests.get(url, headers=headers)
        if resp.status_code != 200:
            return f"Failed to fetch Google News. HTTP Status: {resp.status_code}"
            
        feed = feedparser.parse(resp.content)
        
        if not feed.entries:
            return f"No news found for '{query}' on Google News."
            
        summary = f"--- Top Google News for '{query}' ---\n"
        for article in feed.entries[:5]:
            title = article.get('title', 'No Title')
            date = article.get('published', 'Unknown date')
            source = article.get('source', {}).get('title', 'Unknown Source')
            if isinstance(source, dict):
                source = source.get('title', 'Unknown Source')
            summary += f"- {title} (Source: {source} on {date})\n"
            
        return summary
    except Exception as e:
        return f"Error fetching Google News for '{query}': {e}"

# We can group them by agent if needed, or just provide them all.
def get_tools_for_agent(agent_type: str):
    if agent_type == "financial":
        return [financial_tender_search, yfinance_financials]
    elif agent_type == "news":
        return [market_news_search, google_news_search]
    elif agent_type == "social":
        return [social_sentiment_search]
    elif agent_type == "company":
        return [company_info_search]
    elif agent_type == "procurement":
        return [procurement_tender_search]
    else:
        return [market_news_search, financial_tender_search, social_sentiment_search, company_info_search, procurement_tender_search, yfinance_financials, google_news_search]
