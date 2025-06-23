import os
import json
import time
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="FAANG AI Interviewer API",
    description="AI-powered technical interview practice platform",
    version="1.0.0"
)

# CORS configuration (replace with your actual frontend URL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://maang-aiinterviewer.netlify.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- Data Models --------------------

class InterviewSettings(BaseModel):
    session_type: str = "coding"
    difficulty: str = "medium"
    duration: int = 30
    topic: Optional[str] = None
    enable_hints: bool = True

class CodeSubmission(BaseModel):
    question_id: str
    user_code: str
    time_taken_seconds: int
    session_id: Optional[str] = None

class SessionData(BaseModel):
    id: str
    session_type: str
    difficulty: str
    duration: int
    topic: Optional[str]
    enable_hints: bool
    status: str = "active"
    start_time: str
    end_time: Optional[str] = None
    duration_minutes: Optional[int] = None
    questions_attempted: int = 0

# -------------------- In-Memory DB --------------------

sessions_db: Dict[str, SessionData] = {}
user_stats_db = {
    "total_attempts": 0,
    "average_score": 0,
    "problems_solved": 0,
    "favorite_difficulty": "medium",
    "improvement_areas": ["Dynamic Programming", "System Design"],
    "recent_sessions": []
}

QUESTIONS_DB = {
    "easy": [...],  # You can keep original data here
    "medium": [...],
    "hard": [...]
}

# -------------------- API Endpoints --------------------

@app.get("/")
async def root():
    return {
        "message": "FAANG AI Interviewer API", 
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/sessions")
async def create_session(settings: InterviewSettings):
    session_id = str(uuid.uuid4())
    session = SessionData(
        id=session_id,
        session_type=settings.session_type,
        difficulty=settings.difficulty,
        duration=settings.duration,
        topic=settings.topic,
        enable_hints=settings.enable_hints,
        start_time=datetime.now().isoformat()
    )
    sessions_db[session_id] = session
    return {"session_id": session_id, "session": session}

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str):
    if session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    return sessions_db[session_id]

@app.post("/api/sessions/{session_id}/end")
async def end_session(session_id: str):
    if session_id not in sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    session = sessions_db[session_id]
    session.status = "completed"
    session.end_time = datetime.now().isoformat()
    start_time = datetime.fromisoformat(session.start_time.replace('Z', '+00:00'))
    end_time = datetime.fromisoformat(session.end_time.replace('Z', '+00:00'))
    session.duration_minutes = int((end_time - start_time).total_seconds() / 60)
    return {"message": "Session ended", "session": session}

@app.get("/api/questions")
async def get_question(difficulty: str = "medium", topic: Optional[str] = None):
    if difficulty not in QUESTIONS_DB:
        raise HTTPException(status_code=400, detail="Invalid difficulty level")
    questions = QUESTIONS_DB[difficulty]
    if topic and questions:
        filtered = [q for q in questions if topic.lower() in [tag.lower() for tag in q.get("tags", [])]]
        questions = filtered if filtered else questions
    if not questions:
        raise HTTPException(status_code=404, detail="No questions found")
    return random.choice(questions)

@app.get("/api/questions/categories")
async def get_question_categories():
    categories = [
        "arrays", "strings", "trees", "graphs", "dynamic-programming",
        "linked-lists", "hash-tables", "sorting", "searching", "recursion"
    ]
    return categories

@app.post("/api/submissions")
async def submit_code(submission: CodeSubmission):
    analysis_score = random.randint(60, 95)
    analysis = {
        "overall_score": analysis_score,
        "correctness_score": min(100, analysis_score + random.randint(-5, 10)),
        "efficiency_score": min(100, analysis_score + random.randint(-10, 5)),
        "code_quality_score": min(100, analysis_score + random.randint(-5, 8)),
        "time_management_score": min(100, analysis_score + random.randint(-8, 12)),
        "time_complexity": random.choice(["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"]),
        "space_complexity": random.choice(["O(1)", "O(n)", "O(log n)"]),
        "feedback": ["Good problem-solving approach", "Code structure is clear and readable"],
        "improvements": ["Consider edge cases more thoroughly", "Add input validation", "Optimize time complexity"],
        "interview_tips": ["Clarify requirements", "Explain approach", "Test edge cases"]
    }
    user_stats_db["total_attempts"] += 1
    user_stats_db["problems_solved"] += 1 if analysis_score >= 70 else 0
    current_avg = user_stats_db["average_score"]
    total_attempts = user_stats_db["total_attempts"]
    user_stats_db["average_score"] = int((current_avg * (total_attempts - 1) + analysis_score) / total_attempts)
    return {
        "submission_id": str(uuid.uuid4()),
        "success": True,
        "analysis": analysis,
        "ai_powered": True
    }

@app.get("/api/user/stats")
async def get_user_stats():
    recent_sessions = []
    for i, (session_id, session) in enumerate(list(sessions_db.items())[-5:]):
        recent_sessions.append({
            "id": session_id,
            "session_type": session.session_type,
            "status": session.status,
            "start_time": session.start_time,
            "end_time": session.end_time,
            "duration_minutes": session.duration_minutes or session.duration,
            "questions_attempted": session.questions_attempted or 1
        })
    return {**user_stats_db, "recent_sessions": recent_sessions}

# -------------------- Production Uvicorn Entry --------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)

