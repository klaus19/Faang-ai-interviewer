from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.interview import Base

# SQLite database (for development)
DATABASE_URL = "sqlite:///./faang_interviewer.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()