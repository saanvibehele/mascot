import json
import os
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from services.llm_factory import get_llm
from models.schemas import ProspectList

def find_prospective_leads() -> dict:
    """
    Reads the mock_products.json file and uses an LLM to generate a list
    of high-profile prospective companies that would be ideal clients.
    """
    # 1. Read the products data
    products_file_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "mock_products.json")
    
    with open(products_file_path, "r") as f:
        products_data = json.load(f)
        
    products_str = json.dumps(products_data, indent=2)
    
    # 2. Setup the LLM and Parser
    llm = get_llm()
    parser = JsonOutputParser(pydantic_object=ProspectList)
    
    # 3. Create the Prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert B2B Market Researcher for a commercial paints and coatings manufacturer. Your task is to identify prospective clients based on the company's product catalog. Do NOT use markdown code blocks like ```json. Return raw JSON matching the schema."),
        ("human", "Here is our product catalog:\n{products}\n\nBased on these products, identify 5 real, well-known companies in India (e.g., massive real estate developers, top logistics firms, large infrastructure companies) that would be ideal high-volume buyers for these products.\n\nMake sure the 'projectDescription' sounds like a realistic ongoing or upcoming project. The 'phase' should be realistic sales pipeline phases like 'Tender Alert', 'RFQ Phase', 'Growth Signal', etc. The 'value' should be in Crores (e.g., '₹4.2 Cr'). The 'aiScore' should be an integer between 70 and 99.\n\n{format_instructions}")
    ])
    
    # 4. Invoke the chain
    chain = prompt | llm | parser
    
    result = chain.invoke({
        "products": products_str,
        "format_instructions": parser.get_format_instructions()
    })
    
    return result
