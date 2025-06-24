from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.database import get_db
from app.services.ai_service import ai_service
from app.models.schemas import QuestionSubmission
from app.config import settings
from datetime import datetime

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/generate/{difficulty}")
async def generate_question(
    difficulty: str = "medium", 
    topic: Optional[str] = None
) -> Dict[str, Any]:
    """Generate a coding question based on difficulty and optional topic"""
    
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Invalid difficulty. Use: easy, medium, or hard")
    
    # Use AI generation if available, otherwise fallback
    if settings.AI_ANALYSIS_ENABLED:
        question = await ai_service.generate_coding_question_with_ai(difficulty, topic)
    else:
        question = ai_service.generate_coding_question(difficulty)
    
    return {
        "success": True,
        "question": question,
        "ai_generated": settings.AI_ANALYSIS_ENABLED,
        "generated_at": datetime.now().isoformat()
    }

@router.post("/submit")
async def submit_solution(submission: QuestionSubmission, db: Session = Depends(get_db)):
    """Submit and analyze a coding solution"""
    
    # Mock question data for analysis
    mock_question = {
        "title": "Sample Problem",
        "description": "Sample coding problem",
        "time_limit_minutes": 20,
        "difficulty": "medium"
    }
    
    # Use AI analysis if available
    if settings.AI_ANALYSIS_ENABLED and submission.user_code:
        analysis = await ai_service.analyze_code_with_ai(
            question=mock_question,
            user_code=submission.user_code,
            time_taken=submission.time_taken_seconds
        )
    else:
        analysis = ai_service.analyze_code_solution(
            question=mock_question,
            user_code=submission.user_code or "",
            time_taken=submission.time_taken_seconds
        )
    
    return {
        "success": True,
        "analysis": analysis,
        "ai_powered": settings.AI_ANALYSIS_ENABLED,
        "submission_id": f"sub_{submission.question_id}_{int(datetime.now().timestamp())}"
    }

@router.get("/categories")
async def get_question_categories():
    """Get available question categories"""
    return {
        "categories": [
            {"name": "Array", "count": 150, "difficulty_distribution": {"easy": 50, "medium": 70, "hard": 30}},
            {"name": "String", "count": 120, "difficulty_distribution": {"easy": 40, "medium": 60, "hard": 20}},
            {"name": "Hash Table", "count": 80, "difficulty_distribution": {"easy": 30, "medium": 35, "hard": 15}},
            {"name": "Dynamic Programming", "count": 200, "difficulty_distribution": {"easy": 20, "medium": 100, "hard": 80}},
            {"name": "Tree", "count": 100, "difficulty_distribution": {"easy": 25, "medium": 50, "hard": 25}},
            {"name": "Graph", "count": 90, "difficulty_distribution": {"easy": 15, "medium": 45, "hard": 30}}
        ],
        "total_questions": 740
    }

@router.get("/stats")
async def get_system_stats():
    """Get system statistics"""
    return {
        "ai_enabled": settings.AI_ANALYSIS_ENABLED,
        "total_sessions_today": 0,  # We'll implement this with real data later
        "average_session_duration": "23 minutes",
        "most_popular_difficulty": "medium",
        "success_rate": "68%"
    }