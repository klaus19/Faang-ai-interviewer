from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routes.interview import router as interview_router

app = FastAPI(
    title="FAANG AI Interviewer",
    description="AI-powered interview preparation system",
    version="1.0.0"
)

# Add CORS middleware for React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # We'll restrict this later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(interview_router)

@app.get("/")
async def root():
    return {"message": "FAANG AI Interviewer API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "faang-ai-interviewer"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)