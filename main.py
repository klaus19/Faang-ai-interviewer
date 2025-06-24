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

# Environment setup
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(
    title="FAANG AI Interviewer API",
    description="AI-powered technical interview practice platform",
    version="1.0.0"
)

# CORS configuration for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000", 
        "https://*.netlify.app",
        "https://*.vercel.app",
        "https://*.surge.sh",
        os.getenv("FRONTEND_URL", "http://localhost:3000")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
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

# In-memory storage (replace with database in production)
sessions_db: Dict[str, SessionData] = {}
user_stats_db = {
    "total_attempts": 0,
    "average_score": 0,
    "problems_solved": 0,
    "favorite_difficulty": "medium",
    "improvement_areas": ["Dynamic Programming", "System Design"],
    "recent_sessions": []
}

# Mock Questions Database
QUESTIONS_DB = {
    "easy": [
        {
            "id": "two-sum",
            "title": "Two Sum",
            "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            "difficulty": "easy",
            "time_limit_minutes": 15,
            "examples": [
                {
                    "input": "nums = [2,7,11,15], target = 9",
                    "output": "[0,1]",
                    "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
                }
            ],
            "constraints": [
                "2 <= nums.length <= 10^4",
                "-10^9 <= nums[i] <= 10^9",
                "-10^9 <= target <= 10^9"
            ],
            "tags": ["Array", "Hash Table"],
            "hints": ["Try using a hash map to store values and their indices"]
        }
    ],
    "medium": [
        {
            "id": "longest-substring",
            "title": "Longest Substring Without Repeating Characters",
            "description": "Given a string s, find the length of the longest substring without repeating characters.",
            "difficulty": "medium",
            "time_limit_minutes": 25,
            "examples": [
                {
                    "input": 's = "abcabcbb"',
                    "output": "3",
                    "explanation": 'The answer is "abc", with the length of 3.'
                }
            ],
            "constraints": [
                "0 <= s.length <= 5 * 10^4",
                "s consists of English letters, digits, symbols and spaces."
            ],
            "tags": ["Hash Table", "String", "Sliding Window"],
            "hints": ["Use sliding window technique", "Keep track of character positions"]
        }
    ],
    "hard": [
        {
            "id": "median-sorted-arrays",
            "title": "Median of Two Sorted Arrays",
            "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
            "difficulty": "hard",
            "time_limit_minutes": 35,
            "examples": [
                {
                    "input": "nums1 = [1,3], nums2 = [2]",
                    "output": "2.00000",
                    "explanation": "merged array = [1,2,3] and median is 2."
                }
            ],
            "constraints": [
                "nums1.length == m",
                "nums2.length == n",
                "0 <= m <= 1000",
                "0 <= n <= 1000"
            ],
            "tags": ["Array", "Binary Search", "Divide and Conquer"],
            "hints": ["Think about binary search", "Consider the smaller array"]
        }
    ]
}

# API Endpoints
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
        # Filter by topic if specified
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
    # Simulate AI analysis
    analysis_score = random.randint(60, 95)
    
    analysis = {
        "overall_score": analysis_score,
        "correctness_score": min(100, analysis_score + random.randint(-5, 10)),
        "efficiency_score": min(100, analysis_score + random.randint(-10, 5)),
        "code_quality_score": min(100, analysis_score + random.randint(-5, 8)),
        "time_management_score": min(100, analysis_score + random.randint(-8, 12)),
        "time_complexity": random.choice(["O(1)", "O(log n)", "O(n)", "O(n log n)", "O(n²)"]),
        "space_complexity": random.choice(["O(1)", "O(n)", "O(log n)"]),
        "feedback": [
            "Good problem-solving approach",
            "Code structure is clear and readable",
            "Appropriate use of data structures"
        ],
        "improvements": [
            "Consider edge cases more thoroughly",
            "Add input validation",
            "Optimize for better time complexity"
        ],
        "interview_tips": [
            "Always clarify requirements before coding",
            "Think about edge cases early",
            "Explain your approach before implementation",
            "Test with multiple examples"
        ]
    }
    
    # Update user stats
    user_stats_db["total_attempts"] += 1
    user_stats_db["problems_solved"] += 1 if analysis_score >= 70 else 0
    
    # Calculate new average
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
    # Add some recent sessions
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
    
    return {
        **user_stats_db,
        "recent_sessions": recent_sessions
    }

# Production server configuration
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)