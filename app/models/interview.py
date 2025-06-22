from sqlalchemy import Column, Integer, String, DateTime, Text, Float, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional
from pydantic import BaseModel

Base = declarative_base()

class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_type = Column(String(50))  # "coding", "system_design", "behavioral"
    duration_minutes = Column(Integer, default=45)
    start_time = Column(DateTime, default=func.now())
    end_time = Column(DateTime, nullable=True)
    status = Column(String(20), default="in_progress")  # "in_progress", "completed", "paused"
    questions_data = Column(JSON)  # Store questions and responses
    ai_analysis = Column(Text, nullable=True)
    overall_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=func.now())