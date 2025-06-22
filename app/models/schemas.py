from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class InterviewSessionCreate(BaseModel):
    session_type: str  # "coding", "system_design", "behavioral"
    duration_minutes: int = 45

class InterviewSessionResponse(BaseModel):
    id: int
    session_type: str
    duration_minutes: int
    start_time: datetime
    end_time: Optional[datetime]
    status: str
    overall_score: Optional[float]
    
    class Config:
        from_attributes = True

class QuestionSubmission(BaseModel):
    question_id: str
    user_code: Optional[str] = None
    user_answer: Optional[str] = None
    time_taken_seconds: int