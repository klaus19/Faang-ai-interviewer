from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.interview import InterviewSession
from app.models.schemas import InterviewSessionCreate, InterviewSessionResponse, QuestionSubmission

router = APIRouter(prefix="/interview", tags=["interview"])

@router.post("/start", response_model=InterviewSessionResponse)
async def start_interview_session(
    session_data: InterviewSessionCreate,
    db: Session = Depends(get_db)
):
    """Start a new interview session"""
    new_session = InterviewSession(
        session_type=session_data.session_type,
        duration_minutes=session_data.duration_minutes,
        status="in_progress"
    )
    
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    
    return new_session

@router.get("/sessions", response_model=List[InterviewSessionResponse])
async def get_all_sessions(db: Session = Depends(get_db)):
    """Get all interview sessions"""
    sessions = db.query(InterviewSession).all()
    return sessions

@router.get("/session/{session_id}", response_model=InterviewSessionResponse)
async def get_session(session_id: int, db: Session = Depends(get_db)):
    """Get specific interview session"""
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.post("/session/{session_id}/end")
async def end_interview_session(session_id: int, db: Session = Depends(get_db)):
    """End an interview session"""
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session.end_time = datetime.now()
    session.status = "completed"
    db.commit()
    
    return {"message": "Interview session ended successfully"}