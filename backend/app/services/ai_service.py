import openai
import json
from typing import Dict, List, Any
from datetime import datetime
from app.config import settings

class AIInterviewService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
        else:
            self.client = None
            print("Warning: OpenAI API key not provided. Using mock responses.")
    
    async def generate_coding_question_with_ai(self, difficulty: str, topic: str = None) -> Dict[str, Any]:
        """Generate a coding question using OpenAI API"""
        
        if not self.client:
            return self.generate_coding_question(difficulty)  # Fallback to mock
        
        try:
            prompt = f"""
            Generate a {difficulty} level coding interview question suitable for FAANG companies.
            {f"Focus on {topic} if provided." if topic else ""}
            
            Return a JSON object with this exact structure:
            {{
                "id": "unique_question_id",
                "title": "Question Title",
                "description": "Detailed problem description",
                "examples": [
                    {{
                        "input": "example input",
                        "output": "example output",
                        "explanation": "explanation of the example"
                    }}
                ],
                "constraints": ["constraint1", "constraint2"],
                "difficulty": "{difficulty}",
                "tags": ["tag1", "tag2"],
                "time_limit_minutes": {15 if difficulty == 'easy' else 25 if difficulty == 'medium' else 35},
                "hints": ["hint1", "hint2"]
            }}
            
            Make sure the question is original, challenging, and tests algorithmic thinking.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            
            question_data = json.loads(response.choices[0].message.content)
            return question_data
            
        except Exception as e:
            print(f"Error generating AI question: {e}")
            return self.generate_coding_question(difficulty)  # Fallback
    
    async def analyze_code_with_ai(self, question: Dict, user_code: str, time_taken: int) -> Dict[str, Any]:
        """Analyze code solution using OpenAI API"""
        
        if not self.client:
            return self.analyze_code_solution(question, user_code, time_taken)  # Fallback
        
        try:
            prompt = f"""
            Analyze this coding interview solution:
            
            Question: {question.get('title', 'Unknown')}
            Description: {question.get('description', 'No description')}
            
            User's Code:
            {user_code}
            
            Time taken: {time_taken} seconds (limit was {question.get('time_limit_minutes', 20) * 60} seconds)
            
            Provide analysis in this JSON format:
            {{
                "correctness_score": 0-100,
                "efficiency_score": 0-100,
                "code_quality_score": 0-100,
                "time_management_score": 0-100,
                "overall_score": 0-100,
                "feedback": ["positive feedback point 1", "positive feedback point 2"],
                "improvements": ["improvement suggestion 1", "improvement suggestion 2"],
                "time_complexity": "O(?)",
                "space_complexity": "O(?)",
                "interview_tips": ["tip1", "tip2"]
            }}
            
            Be constructive but honest in your assessment.
            """
            
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3
            )
            
            analysis = json.loads(response.choices[0].message.content)
            return analysis
            
        except Exception as e:
            print(f"Error in AI analysis: {e}")
            return self.analyze_code_solution(question, user_code, time_taken)  # Fallback
    
    def generate_coding_question(self, difficulty: str = "medium") -> Dict[str, Any]:
        """Fallback method with predefined questions"""
        # (Keep the existing implementation from before)
        questions_bank = {
            "easy": [
                {
                    "id": "two_sum",
                    "title": "Two Sum",
                    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    "examples": [
                        {
                            "input": "nums = [2,7,11,15], target = 9",
                            "output": "[0,1]",
                            "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
                        }
                    ],
                    "difficulty": "easy",
                    "tags": ["Array", "Hash Table"],
                    "time_limit_minutes": 15
                }
            ],
            "medium": [
                {
                    "id": "longest_substring",
                    "title": "Longest Substring Without Repeating Characters",
                    "description": "Given a string s, find the length of the longest substring without repeating characters.",
                    "examples": [
                        {
                            "input": 's = "abcabcbb"',
                            "output": "3",
                            "explanation": 'The answer is "abc", with the length of 3.'
                        }
                    ],
                    "difficulty": "medium",
                    "tags": ["Hash Table", "String", "Sliding Window"],
                    "time_limit_minutes": 25
                }
            ]
        }
        
        import random
        return random.choice(questions_bank.get(difficulty, questions_bank["medium"]))
    
    def analyze_code_solution(self, question: Dict, user_code: str, time_taken: int) -> Dict[str, Any]:
        """Fallback analysis method"""
        # (Keep the existing implementation from before)
        analysis = {
            "correctness_score": 75,
            "efficiency_score": 70,
            "code_quality_score": 80,
            "time_management_score": 85,
            "overall_score": 77,
            "feedback": ["Code structure looks good", "Solution appears to work"],
            "improvements": ["Consider edge cases", "Add more comments"],
            "time_complexity": "O(n)",
            "space_complexity": "O(1)"
        }
        return analysis

# Initialize the service
ai_service = AIInterviewService()