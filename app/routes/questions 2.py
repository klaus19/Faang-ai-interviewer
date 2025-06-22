from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime
from app.database import get_db
from app.services.ai_service import ai_service
from app.models.schemas import QuestionSubmission

router = APIRouter(prefix="/questions", tags=["questions"])

@router.get("/generate/{difficulty}")
async def generate_question(difficulty: str = "medium") -> Dict[str, Any]:
    """Generate a coding question based on difficulty"""
    
    if difficulty not in ["easy", "medium", "hard"]:
        raise HTTPException(status_code=400, detail="Invalid difficulty. Use: easy, medium, or hard")
    
    question = ai_service.generate_coding_question(difficulty)
    return {
        "success": True,
        "question": question,
        "generated_at": "2025-06-21T10:00:00Z"
    }

@router.post("/submit")
async def submit_solution(submission: QuestionSubmission, db: Session = Depends(get_db)):
    """Submit and analyze a coding solution"""
    
    # For now, we'll create a mock question for analysis
    mock_question = {
        "time_limit_minutes": 20,
        "difficulty": "medium"
    }
    
    analysis = ai_service.analyze_code_solution(
        question=mock_question,
        user_code=submission.user_code or "",
        time_taken=submission.time_taken_seconds
    )
    
    return {
        "success": True,
        "analysis": analysis,
        "submission_id": f"sub_{submission.question_id}_{int(datetime.now().timestamp())}"
    }

@router.get("/categories")
async def get_question_categories():
    """Get available question categories"""
    return {
        "categories": [
            {"name": "Array", "count": 150},
            {"name": "String", "count": 120},
            {"name": "Hash Table", "count": 80},
            {"name": "Dynamic Programming", "count": 200},
            {"name": "Tree", "count": 100},
            {"name": "Graph", "count": 90}
        ]
    }