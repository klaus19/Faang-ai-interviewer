import openai
import json
from typing import Dict, List, Any
from datetime import datetime

class AIInterviewService:
    def __init__(self, api_key: str = None):
        # We'll set this up with environment variables later
        self.client = openai.OpenAI(api_key=api_key) if api_key else None
        
    def generate_coding_question(self, difficulty: str = "medium") -> Dict[str, Any]:
        """Generate a coding question based on difficulty"""
        
        # For now, let's use a predefined question bank
        # Later we'll integrate with OpenAI API
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
            ],
            "hard": [
                {
                    "id": "median_sorted_arrays",
                    "title": "Median of Two Sorted Arrays",
                    "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
                    "examples": [
                        {
                            "input": "nums1 = [1,3], nums2 = [2]",
                            "output": "2.00000",
                            "explanation": "merged array = [1,2,3] and median is 2."
                        }
                    ],
                    "difficulty": "hard",
                    "tags": ["Array", "Binary Search", "Divide and Conquer"],
                    "time_limit_minutes": 35
                }
            ]
        }
        
        import random
        return random.choice(questions_bank.get(difficulty, questions_bank["medium"]))
    
    def analyze_code_solution(self, question: Dict, user_code: str, time_taken: int) -> Dict[str, Any]:
        """Analyze user's code solution"""
        
        # Basic analysis (we'll enhance this with AI later)
        analysis = {
            "correctness_score": 0,
            "efficiency_score": 0,
            "code_quality_score": 0,
            "time_management_score": 0,
            "feedback": [],
            "suggestions": []
        }
        
        # Time management analysis
        expected_time = question.get("time_limit_minutes", 20) * 60
        time_ratio = time_taken / expected_time
        
        if time_ratio <= 0.7:
            analysis["time_management_score"] = 100
            analysis["feedback"].append("Excellent time management!")
        elif time_ratio <= 1.0:
            analysis["time_management_score"] = 80
            analysis["feedback"].append("Good time management.")
        else:
            analysis["time_management_score"] = 50
            analysis["feedback"].append("Consider optimizing your approach for better time management.")
        
        # Basic code quality checks
        if user_code:
            if len(user_code.split('\n')) > 50:
                analysis["suggestions"].append("Consider breaking down your solution into smaller functions.")
            
            if "def " in user_code or "class " in user_code:
                analysis["code_quality_score"] += 20
                
            if any(keyword in user_code.lower() for keyword in ["#", "//", '"""']):
                analysis["code_quality_score"] += 10
                analysis["feedback"].append("Good job adding comments!")
        
        return analysis

# Initialize the service
ai_service = AIInterviewService()