import axios, { AxiosResponse } from 'axios';
import { 
  QuestionResponse, 
  SubmissionResponse, 
  InterviewSession, 
  StartSessionRequest,
  CodeSubmission,
  UserStats,
  ApiResponse 
} from '../types';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    
    // Handle common error scenarios
    if (error.response?.status === 404) {
      throw new Error('Service not found. Please check if the backend server is running.');
    } else if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:8000');
    }
    
    return Promise.reject(error);
  }
);

// API Service Class
export class ApiService {
  // Health Check
  static async healthCheck(): Promise<any> {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend server is not responding. Please start the server.');
    }
  }

  // Question Generation
  static async generateQuestion(
    difficulty: 'easy' | 'medium' | 'hard',
    topic?: string
  ): Promise<QuestionResponse> {
    const params = topic ? { topic } : {};
    const response: AxiosResponse<QuestionResponse> = await api.get(
      `/questions/generate/${difficulty}`,
      { params }
    );
    return response.data;
  }

  // Get Question Categories
  static async getQuestionCategories(): Promise<string[]> {
    const response = await api.get('/questions/categories');
    return response.data.categories || [];
  }

  // Code Submission
  static async submitCode(submission: CodeSubmission): Promise<SubmissionResponse> {
    const response: AxiosResponse<SubmissionResponse> = await api.post(
      '/questions/submit',
      submission
    );
    return response.data;
  }

  // Interview Session Management
  static async startSession(sessionData: StartSessionRequest): Promise<InterviewSession> {
    const response: AxiosResponse<ApiResponse<InterviewSession>> = await api.post(
      '/interview/start',
      sessionData
    );
    return response.data.data!;
  }

  static async getSessions(): Promise<InterviewSession[]> {
    const response: AxiosResponse<ApiResponse<InterviewSession[]>> = await api.get(
      '/interview/sessions'
    );
    return response.data.data || [];
  }

  static async getSession(sessionId: string): Promise<InterviewSession> {
    const response: AxiosResponse<ApiResponse<InterviewSession>> = await api.get(
      `/interview/session/${sessionId}`
    );
    return response.data.data!;
  }

  static async endSession(sessionId: string): Promise<InterviewSession> {
    const response: AxiosResponse<ApiResponse<InterviewSession>> = await api.post(
      `/interview/session/${sessionId}/end`
    );
    return response.data.data!;
  }

  // Statistics
  static async getQuestionStats(): Promise<any> {
    const response = await api.get('/questions/stats');
    return response.data;
  }

  // User Statistics (mock for now)
  static async getUserStats(): Promise<UserStats> {
    // This would typically fetch from a user-specific endpoint
    // For now, we'll simulate with question stats
    const stats = await this.getQuestionStats();
    return {
      total_attempts: stats.total_questions || 0,
      average_score: 75, // Mock data
      problems_solved: Math.floor((stats.total_questions || 0) * 0.7),
      favorite_difficulty: 'medium',
      improvement_areas: ['Time Complexity Analysis', 'Edge Case Handling'],
      recent_sessions: await this.getSessions()
    };
  }
}

// Utility Functions
export const formatApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred. Please try again.';
  }
};

export const isApiAvailable = async (): Promise<boolean> => {
  try {
    await ApiService.healthCheck();
    return true;
  } catch {
    return false;
  }
};

export default ApiService;