import json
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
from services.llm_factory import get_llm
from models.schemas import ProspectList

def get_products_data() -> str:
    products_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "mock_products.json")
    with open(products_file_path, "r") as f:
        products_data = json.load(f)
    return json.dumps(products_data, indent=2)

def get_company_image(company_name: str) -> str:
    import urllib.parse
    from ddgs import DDGS
    
    try:
        query = f"{company_name} headquarters building"
        results = DDGS().images(query, max_results=1)
        if results and len(results) > 0:
            return results[0].get("image")
    except Exception as e:
        print(f"DDGS Image Search Error for {company_name}: {e}")
    
    # Fallback to Clearbit logo if no web image found
    clean_name = urllib.parse.quote(company_name.split()[0].lower().replace(",", "").replace(".", ""))
    return f"https://logo.clearbit.com/{clean_name}.com"

def find_prospective_leads() -> dict:
    """
    Market Analysis Agent Pipeline
    Step 1: Identify Industries & Trends based on products
    Step 2: Find Companies & Rank them
    """
    products_str = get_products_data()
    llm = get_llm()
    
    # --- Step 1 & 2 combined into a single prompt for efficiency but following the logic ---
    parser = JsonOutputParser(pydantic_object=ProspectList)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert B2B Market Researcher and Data Analyst for a commercial paints and coatings manufacturer. Your task is to identify prospective clients based on the company's product catalog. You must follow a multi-step analytical process: First, identify the industries that match the products. Second, analyze current market trends in those industries. Third, find specific real-world companies that fit this profile. Fourth, rank these companies by potential value. Do NOT use markdown code blocks like ```json. Return raw JSON matching the schema."),
        ("human", "Here is our product catalog:\n{products}\n\nBased on these products, follow the analytical process to identify and rank 5 real, well-known companies in India (e.g., massive real estate developers, top logistics firms, large infrastructure companies) that would be ideal high-volume buyers for these products.\n\nMake sure the 'projectDescription' sounds like a realistic ongoing or upcoming project. The 'phase' should be realistic sales pipeline phases like 'Tender Alert', 'RFQ Phase', 'Growth Signal', etc. The 'aiScore' should be an integer between 70 and 99 reflecting their rank (highest score = best prospect).\n\n{format_instructions}")
    ])
    
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "products": products_str,
        "format_instructions": parser.get_format_instructions()
    })
    
    # Ensure they are sorted by aiScore descending (Ranking) and fetch images
    if "prospects" in result:
        result["prospects"] = sorted(result["prospects"], key=lambda x: x.get("aiScore", 0), reverse=True)
        for p in result["prospects"]:
            p["imageUrl"] = get_company_image(p.get("companyName", ""))
        
    return result
