import os
from typing import List
from dotenv import load_dotenv
from pydantic_settings import BaseSettings
# Load environment variables from backend/.env or root ../.env
backend_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(backend_dir, ".env"))
load_dotenv(os.path.join(backend_dir, "..", ".env"))
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = "SugarSense AI Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # LLM Configuration (Groq API)
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    # Database Configuration (Supabase PostgreSQL)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://sugarsense.vercel.app",
        "*"
    ]
    
    PORT: int = int(os.getenv("PORT", "8000"))

settings = Settings()
