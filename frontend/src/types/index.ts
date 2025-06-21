// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Question Types
export interface Question {
  id: string;
  title: string;
  description: string;
  examples: Example[];
  constraints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  time_limit_minutes: number;
  hints: string[];
}

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface QuestionResponse {
  success: boolean;
  question: Question;
  ai_generated: boolean;
  session_id?: string;
}

// Code Analysis Types
export interface CodeAnalysis {
  correctness_score: number;
  efficiency_score: number;
  code_quality_score: number;
  time_management_score: number;
  overall_score: number;
  feedback: string[];
  improvements: string[];
  time_complexity: string;
  space_complexity: string;
  interview_tips: string[];
}

export interface SubmissionResponse {
  success: boolean;
  analysis: CodeAnalysis;
  ai_powered: boolean;
  submission_id: string;
}

// Interview Session Types
export interface InterviewSession {
  id: string;
  session_type: 'coding' | 'system_design' | 'behavioral';
  status: 'active' | 'completed' | 'paused';
  start_time: string;
  end_time?: string;
  duration_minutes: number;
  questions_attempted: number;
  current_question?: Question;
}

export interface StartSessionRequest {
  session_type: 'coding' | 'system_design' | 'behavioral';
  duration_minutes: number;
}

// Code Submission Types
export interface CodeSubmission {
  question_id: string;
  user_code: string;
  time_taken_seconds: number;
  session_id?: string;
}

// User Interface Types
export interface InterviewSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  topic?: string;
  duration: number;
  showHints: boolean;
  autoSave: boolean;
}

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  isPaused: boolean;
  totalTime: number;
}

// Component Props Types
export interface QuestionDisplayProps {
  question: Question;
  onHintRequest?: () => void;
  showHints?: boolean;
}

export interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange: (code: string) => void;
  onSubmit: (code: string) => void;
  readOnly?: boolean;
}

export interface TimerProps {
  duration: number;
  onTimeUp: () => void;
  onTick?: (timeLeft: number) => void;
  autoStart?: boolean;
}

export interface AnalysisDisplayProps {
  analysis: CodeAnalysis;
  question: Question;
  submissionTime: number;
}

// Statistics and Dashboard Types
export interface UserStats {
  total_attempts: number;
  average_score: number;
  problems_solved: number;
  favorite_difficulty: string;
  improvement_areas: string[];
  recent_sessions: InterviewSession[];
}

export interface PerformanceMetrics {
  accuracy: number;
  speed: number;
  consistency: number;
  problem_solving: number;
  code_quality: number;
}

// Navigation and Routing Types
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  protected?: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Theme and UI Types
export interface ThemeConfig {
  isDark: boolean;
  primaryColor: string;
  codeTheme: 'light' | 'dark' | 'monokai';
}

// Form Types
export interface InterviewSetupForm {
  sessionType: 'coding' | 'system_design' | 'behavioral';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  topic?: string;
  enableHints: boolean;
}