import os
from dotenv import load_dotenv

load_dotenv()

def get_llm():
    """
    Returns a LangChain LLM instance depending on the USE_GEMINI environment variable.
    """
    use_gemini = os.getenv("USE_GEMINI", "false").lower() == "true"
    
    if use_gemini:
        from langchain_google_genai import ChatGoogleGenerativeAI
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY environment variable is missing.")
            
        print("🤖 Using Gemini 1.5 Flash (Production Mode)")
        return ChatGoogleGenerativeAI(
            model="gemini-3.1-flash-lite",
            google_api_key=gemini_api_key,
            temperature=0,
            # We use flash as it's faster and free tier handles it well. 
            # Can swap to gemini-1.5-pro if higher reasoning is needed.
        )
    else:
        from langchain_community.llms import LlamaCpp
        from langchain_core.language_models.chat_models import BaseChatModel
        
        # We need a chat-compatible wrapper for LlamaCpp if we're using it in LangGraph
        model_path = os.path.join(os.path.dirname(__file__), "..", "models", "weights", "Llama-3.2-1B-Instruct-Q4_K_M.gguf")
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Local model not found at {model_path}. Please run download_model.py")
            
        print(f"🤖 Using Local LLM: {model_path} (Testing Mode)")
        
        # Instantiate LlamaCpp
        # We set n_ctx high enough for complex context
        llm = LlamaCpp(
            model_path=model_path,
            temperature=0,
            max_tokens=2048,
            n_ctx=4096,
            echo=False,
            verbose=False,
        )
        return llm
