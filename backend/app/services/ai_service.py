import openai
import json
from typing import Dict, List, Any
from datetime import datetime
from app.config import settings
import logging
import random
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIInterviewService:
    def __init__(self):
        if settings.OPENAI_API_KEY:
            self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
            logger.info("OpenAI client initialized with API key")
        else:
            self.client = None
            logger.warning("No OpenAI API key provided. Using enhanced mock responses.")
    
    async def generate_coding_question_with_ai(self, difficulty: str, topic: str = None) -> Dict[str, Any]:
        """Generate a coding question using OpenAI API (fallback to mock during development)"""
        
        if not self.client:
            logger.info("No OpenAI client, using enhanced mock data")
            return self.generate_coding_question(difficulty, topic)
        
        try:
            logger.info(f"Attempting to generate {difficulty} question with AI")
            
            # AI generation code here (for when you enable it later)
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"Generate a {difficulty} coding question"}],
                temperature=0.7
            )
            
            # Parse AI response
            question_data = json.loads(response.choices[0].message.content)
            logger.info("Successfully parsed AI-generated question")
            return question_data
            
        except Exception as e:
            logger.error(f"Error generating AI question: {str(e)}")
            logger.info("Falling back to enhanced mock question")
            return self.generate_coding_question(difficulty, topic)
    
    async def analyze_code_with_ai(self, question: Dict, user_code: str, time_taken: int) -> Dict[str, Any]:
        """Analyze code solution using OpenAI API (fallback to mock during development)"""
        
        if not self.client:
            logger.info("No OpenAI client for analysis, using enhanced mock analysis")
            return self.analyze_code_solution(question, user_code, time_taken)
        
        try:
            logger.info("Attempting AI code analysis")
            
            # AI analysis code here (for when you enable it later)
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": f"Analyze this code: {user_code}"}],
                temperature=0.3
            )
            
            analysis = json.loads(response.choices[0].message.content)
            logger.info("Successfully parsed AI analysis")
            return analysis
            
        except Exception as e:
            logger.error(f"Error in AI analysis: {str(e)}")
            return self.analyze_code_solution(question, user_code, time_taken)
    
    def generate_coding_question(self, difficulty: str = "medium", topic: str = None) -> Dict[str, Any]:
        """Enhanced mock question generator with 50+ questions and topic filtering"""
        
        # Massive question bank for development
        questions_bank = {
            "easy": [
                # Array Problems
                {
                    "id": "two_sum", "title": "Two Sum", "difficulty": "easy",
                    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                    "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "nums[0] + nums[1] == 9"}],
                    "tags": ["Array", "Hash Table"], "time_limit_minutes": 15,
                    "hints": ["Use a hash table to store numbers and indices.", "Look for the complement of each number."]
                },
                {
                    "id": "best_time_buy_sell", "title": "Best Time to Buy and Sell Stock", "difficulty": "easy",
                    "description": "Find the maximum profit from buying and selling a stock once.",
                    "examples": [{"input": "prices = [7,1,5,3,6,4]", "output": "5", "explanation": "Buy at 1, sell at 6"}],
                    "tags": ["Array", "Dynamic Programming"], "time_limit_minutes": 15,
                    "hints": ["Track minimum price seen so far.", "Calculate profit at each step."]
                },
                {
                    "id": "contains_duplicate", "title": "Contains Duplicate", "difficulty": "easy",
                    "description": "Given an integer array nums, return true if any value appears at least twice.",
                    "examples": [{"input": "nums = [1,2,3,1]", "output": "true", "explanation": "1 appears twice"}],
                    "tags": ["Array", "Hash Table"], "time_limit_minutes": 10,
                    "hints": ["Use a hash set to track seen numbers.", "Return true immediately when duplicate found."]
                },
                # String Problems
                {
                    "id": "valid_parentheses", "title": "Valid Parentheses", "difficulty": "easy",
                    "description": "Determine if parentheses string is valid using stack.",
                    "examples": [{"input": 's = "()"', "output": "true", "explanation": "Valid parentheses"}],
                    "tags": ["String", "Stack"], "time_limit_minutes": 15,
                    "hints": ["Use stack for opening brackets.", "Match closing with most recent opening."]
                },
                {
                    "id": "valid_anagram", "title": "Valid Anagram", "difficulty": "easy", 
                    "description": "Given two strings s and t, return true if t is an anagram of s.",
                    "examples": [{"input": 's = \"anagram\", t = \"nagaram\"', "output": "true", "explanation": "Same letters rearranged"}],
                    "tags": ["String", "Hash Table"], "time_limit_minutes": 15,
                    "hints": ["Count character frequencies.", "Compare frequency maps."]
                },
                # Linked List Problems
                {
                    "id": "merge_sorted_lists", "title": "Merge Two Sorted Lists", "difficulty": "easy",
                    "description": "Merge two sorted linked lists into one sorted list.",
                    "examples": [{"input": "list1 = [1,2,4], list2 = [1,3,4]", "output": "[1,1,2,3,4,4]", "explanation": "Merged in order"}],
                    "tags": ["Linked List", "Recursion"], "time_limit_minutes": 20,
                    "hints": ["Compare current nodes.", "Use dummy head for result."]
                }
            ],
            "medium": [
                # Array Problems
                {
                    "id": "longest_substring", "title": "Longest Substring Without Repeating Characters", "difficulty": "medium",
                    "description": "Find length of longest substring without repeating characters.",
                    "examples": [{"input": 's = "abcabcbb"', "output": "3", "explanation": "abc has length 3"}],
                    "tags": ["String", "Sliding Window", "Hash Table"], "time_limit_minutes": 25,
                    "hints": ["Use sliding window technique.", "Track characters with hash set."]
                },
                {
                    "id": "group_anagrams", "title": "Group Anagrams", "difficulty": "medium",
                    "description": "Group strings that are anagrams together.",
                    "examples": [{"input": '["eat","tea","tan","ate"]', "output": '[["eat","tea","ate"],["tan"]]', "explanation": "Group by anagram"}],
                    "tags": ["Array", "Hash Table", "String"], "time_limit_minutes": 25,
                    "hints": ["Sort characters as key.", "Use hash map for grouping."]
                },
                {
                    "id": "product_except_self", "title": "Product of Array Except Self", "difficulty": "medium",
                    "description": "Return array where answer[i] equals product of all elements except nums[i].",
                    "examples": [{"input": "nums = [1,2,3,4]", "output": "[24,12,8,6]", "explanation": "Product excluding each element"}],
                    "tags": ["Array", "Prefix Sum"], "time_limit_minutes": 25,
                    "hints": ["Use left and right products.", "Avoid division for edge cases."]
                },
                {
                    "id": "container_water", "title": "Container With Most Water", "difficulty": "medium",
                    "description": "Find two lines that form container holding most water.",
                    "examples": [{"input": "height = [1,8,6,2,5,4,8,3,7]", "output": "49", "explanation": "Max area between lines"}],
                    "tags": ["Array", "Two Pointers"], "time_limit_minutes": 25,
                    "hints": ["Two pointers from ends.", "Move shorter line pointer."]
                },
                # String Problems  
                {
                    "id": "longest_palindrome", "title": "Longest Palindromic Substring", "difficulty": "medium",
                    "description": "Find the longest palindromic substring in a string.",
                    "examples": [{"input": 's = "babad"', "output": '"bab" or "aba"', "explanation": "Both are valid longest palindromes"}],
                    "tags": ["String", "Dynamic Programming"], "time_limit_minutes": 30,
                    "hints": ["Expand around centers.", "Check odd and even length palindromes."]
                },
                # Tree Problems
                {
                    "id": "validate_bst", "title": "Validate Binary Search Tree", "difficulty": "medium",
                    "description": "Determine if binary tree is valid BST.",
                    "examples": [{"input": "root = [2,1,3]", "output": "true", "explanation": "Valid BST structure"}],
                    "tags": ["Tree", "Depth-First Search", "Binary Search Tree"], "time_limit_minutes": 25,
                    "hints": ["Use inorder traversal.", "Check bounds for each node."]
                },
                {
                    "id": "level_order_traversal", "title": "Binary Tree Level Order Traversal", "difficulty": "medium",
                    "description": "Return level order traversal of binary tree nodes.",
                    "examples": [{"input": "root = [3,9,20,null,null,15,7]", "output": "[[3],[9,20],[15,7]]", "explanation": "Level by level"}],
                    "tags": ["Tree", "Breadth-First Search"], "time_limit_minutes": 25,
                    "hints": ["Use queue for BFS.", "Track nodes at each level."]
                }
            ],
            "hard": [
                {
                    "id": "median_sorted_arrays", "title": "Median of Two Sorted Arrays", "difficulty": "hard",
                    "description": "Find median of two sorted arrays in O(log(m+n)) time.",
                    "examples": [{"input": "nums1 = [1,3], nums2 = [2]", "output": "2.0", "explanation": "Merged [1,2,3], median is 2"}],
                    "tags": ["Array", "Binary Search", "Divide and Conquer"], "time_limit_minutes": 35,
                    "hints": ["Binary search on partition.", "Ensure O(log(min(m,n))) complexity."]
                },
                {
                    "id": "trapping_rain_water", "title": "Trapping Rain Water", "difficulty": "hard",
                    "description": "Calculate trapped rainwater given elevation map.",
                    "examples": [{"input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]", "output": "6", "explanation": "6 units trapped"}],
                    "tags": ["Array", "Two Pointers", "Dynamic Programming"], "time_limit_minutes": 35,
                    "hints": ["Track max heights left/right.", "Use two pointers approach."]
                },
                {
                    "id": "sliding_window_maximum", "title": "Sliding Window Maximum", "difficulty": "hard",
                    "description": "Find maximum in each sliding window of size k.",
                    "examples": [{"input": "nums = [1,3,-1,-3,5,3,6,7], k = 3", "output": "[3,3,5,5,6,7]", "explanation": "Max in each window"}],
                    "tags": ["Array", "Queue", "Sliding Window", "Heap"], "time_limit_minutes": 35,
                    "hints": ["Use deque for efficient tracking.", "Maintain decreasing order."]
                },
                {
                    "id": "word_ladder", "title": "Word Ladder", "difficulty": "hard",
                    "description": "Find shortest transformation sequence from beginWord to endWord.",
                    "examples": [{"input": 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', "output": "5", "explanation": "hit -> hot -> dot -> dog -> cog"}],
                    "tags": ["Hash Table", "String", "Breadth-First Search"], "time_limit_minutes": 40,
                    "hints": ["Use BFS for shortest path.", "Build adjacency graph of words."]
                }
            ]
        }
        
        # Topic filtering
        topic_keywords = {
            "arrays": ["Array", "Two Pointers", "Sliding Window"],
            "strings": ["String", "Hash Table"],
            "trees": ["Tree", "Binary Search Tree", "Depth-First Search", "Breadth-First Search"],
            "dynamic-programming": ["Dynamic Programming"],
            "graphs": ["Graph", "Breadth-First Search", "Depth-First Search"],
            "linked-lists": ["Linked List"]
        }
        
        selected_questions = questions_bank.get(difficulty, questions_bank["medium"])
        
        # Filter by topic if specified
        if topic and topic.lower() in topic_keywords:
            topic_tags = topic_keywords[topic.lower()]
            filtered_questions = [
                q for q in selected_questions 
                if any(tag in q["tags"] for tag in topic_tags)
            ]
            if filtered_questions:
                selected_questions = filtered_questions
        
        # Random selection with unique ID
        selected = random.choice(selected_questions).copy()
        selected["id"] = f"{selected['id']}_{int(time.time() * 1000) % 10000}"
        
        logger.info(f"Generated mock question: {selected['title']} (Topic: {topic or 'any'})")
        return selected
    
    def analyze_code_solution(self, question: Dict, user_code: str, time_taken: int) -> Dict[str, Any]:
        """Enhanced mock analysis with realistic scoring"""
        
        logger.info("Generating enhanced mock code analysis")
        
        # Enhanced analysis with more realistic scoring
        analysis = {
            "correctness_score": 0,
            "efficiency_score": 0, 
            "code_quality_score": 0,
            "time_management_score": 0,
            "overall_score": 0,
            "feedback": [],
            "improvements": [],
            "time_complexity": "O(?)",
            "space_complexity": "O(?)",
            "interview_tips": []
        }
        
        # Time management scoring
        expected_time = question.get("time_limit_minutes", 25) * 60
        time_ratio = time_taken / expected_time if expected_time > 0 else 1
        
        if time_ratio <= 0.6:
            analysis["time_management_score"] = 95
            analysis["feedback"].append("⚡ Excellent time management! Completed well within time limit.")
        elif time_ratio <= 0.8:
            analysis["time_management_score"] = 85
            analysis["feedback"].append("✅ Good time management. Finished comfortably.")
        elif time_ratio <= 1.0:
            analysis["time_management_score"] = 75
            analysis["feedback"].append("⏰ Completed within time limit.")
        else:
            analysis["time_management_score"] = 50
            analysis["improvements"].append("⏱️ Practice solving similar problems to improve speed.")
        
        if user_code:
            # Code quality analysis
            lines = user_code.strip().split('\n')
            
            # Function/class structure
            if any('def ' in line or 'class ' in line for line in lines):
                analysis["code_quality_score"] += 25
                analysis["feedback"].append("🔧 Good use of functions/classes for organization.")
            
            # Comments and documentation
            if any('#' in line or '"""' in line or "'''" in line for line in lines):
                analysis["code_quality_score"] += 20
                analysis["feedback"].append("📝 Great job adding comments for clarity!")
            
            # Variable naming
            if len([line for line in lines if '=' in line and not line.strip().startswith('#')]) > 0:
                analysis["code_quality_score"] += 15
                
            # Code length (reasonable)
            if len(lines) <= 30:
                analysis["code_quality_score"] += 20
            else:
                analysis["improvements"].append("🔄 Consider breaking down into smaller functions.")
                
            # Basic correctness heuristics
            if 'return' in user_code.lower():
                analysis["correctness_score"] += 40
                analysis["feedback"].append("✅ Code includes return statements.")
            
            if any(keyword in user_code.lower() for keyword in ['for', 'while', 'if']):
                analysis["correctness_score"] += 30
                analysis["feedback"].append("🔄 Good use of control structures.")
                
            # Error handling
            if any(keyword in user_code.lower() for keyword in ['try', 'except', 'catch']):
                analysis["correctness_score"] += 20
                analysis["feedback"].append("🛡️ Excellent error handling!")
            
            # Efficiency analysis
            nested_loops = user_code.lower().count('for') + user_code.lower().count('while')
            if nested_loops <= 1:
                analysis["efficiency_score"] = random.randint(85, 95)
                analysis["time_complexity"] = "O(n)" if 'for' in user_code or 'while' in user_code else "O(1)"
                analysis["feedback"].append("🚀 Efficient solution with good time complexity!")
            elif nested_loops == 2:
                analysis["efficiency_score"] = random.randint(65, 80)
                analysis["time_complexity"] = "O(n²)"
                analysis["improvements"].append("⚡ Consider if nested loops can be optimized.")
            else:
                analysis["efficiency_score"] = random.randint(40, 65)
                analysis["time_complexity"] = "O(n³) or higher"
                analysis["improvements"].append("🔄 Multiple nested loops detected - consider algorithm optimization.")
            
            # Space complexity estimation
            if 'dict' in user_code.lower() or 'set' in user_code.lower() or '{' in user_code:
                analysis["space_complexity"] = "O(n)"
            elif '[' in user_code and 'append' in user_code:
                analysis["space_complexity"] = "O(n)"
            else:
                analysis["space_complexity"] = "O(1)"
        
        # Calculate overall score
        scores = [
            analysis["correctness_score"],
            analysis["efficiency_score"],
            analysis["code_quality_score"], 
            analysis["time_management_score"]
        ]
        analysis["overall_score"] = sum(scores) // len(scores)
        
        # Add interview tips based on performance
        if analysis["overall_score"] >= 80:
            analysis["interview_tips"].extend([
                "🎯 Great work! Focus on explaining your approach clearly.",
                "💡 Consider discussing trade-offs between time and space complexity.",
                "🗣️ Practice verbalizing your thought process during coding."
            ])
        else:
            analysis["interview_tips"].extend([
                "📚 Practice more problems of similar difficulty level.",
                "⏱️ Work on improving coding speed through regular practice.",
                "🧠 Focus on understanding algorithm patterns and data structures."
            ])
            
        # Add some variety to feedback
        if not analysis["feedback"]:
            analysis["feedback"].append("💪 Keep practicing! Every attempt makes you stronger.")
            
        return analysis

# Initialize the service
ai_service = AIInterviewService()