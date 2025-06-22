import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./faang_interviewer.db")
    APP_SECRET_KEY: str = os.getenv("APP_SECRET_KEY", "dev-secret-key")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # Interview settings
    DEFAULT_SESSION_DURATION: int = 45  # minutes
    MAX_QUESTIONS_PER_SESSION: int = 3
    
    # AI Analysis settings
    AI_ANALYSIS_ENABLED: bool = bool(OPENAI_API_KEY)

settings = Settings()