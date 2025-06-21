import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Square, 
  Send, 
  Lightbulb, 
  Clock,
  Code,
  AlertTriangle,
  CheckCircle,
  Loader,
  Settings
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { Question, InterviewSession, CodeSubmission } from '../../types';
import { CodeEditor } from '../../components/editor/CodeEditor';
import { QuestionDisplay } from '../interview/QuestionDisplay';
import { Timer } from '../interview/Timer';
import { InterviewSetup } from '../interview/InterviewSetup';

interface InterviewState {
  phase: 'setup' | 'active' | 'completed' | 'loading';
  session: InterviewSession | null;
  question: Question | null;
  userCode: string;
  timeStarted: number | null;
  showHints: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export const InterviewPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [state, setState] = useState<InterviewState>({
    phase: 'setup',
    session: null,
    question: null,
    userCode: '',
    timeStarted: null,
    showHints: false,
    isSubmitting: false,
    error: null
  });

  // Get initial settings from navigation state
  const initialSettings = location.state || {};

  useEffect(() => {
    // Auto-start if coming from home page
    if (initialSettings.autoStart && initialSettings.difficulty) {
      handleStartInterview({
        sessionType: 'coding',
        difficulty: initialSettings.difficulty,
        duration: 30,
        enableHints: true
      });
    }
  }, []);

  const handleStartInterview = async (settings: any) => {
    setState(prev => ({ ...prev, phase: 'loading', error: null }));
    
    try {
      // Start session
      const session = await ApiService.startSession({
        session_type: settings.sessionType,
        duration_minutes: settings.duration
      });

      // Generate question
      const questionResponse = await ApiService.generateQuestion(
        settings.difficulty,
        settings.topic
      );

      // Validate question response
      if (!questionResponse.question) {
        throw new Error('No question received from server');
      }

      setState(prev => ({
        ...prev,
        phase: 'active',
        session,
        question: questionResponse.question,
        timeStarted: Date.now(),
        showHints: settings.enableHints,
        userCode: `# Write your solution here\ndef solution():\n    # Your code goes here\n    pass\n\n# Test your solution\nif __name__ == "__main__":\n    print("Testing solution...")`
      }));

    } catch (error: any) {
      console.error('Error starting interview:', error);
      setState(prev => ({
        ...prev,
        phase: 'setup',
        error: error.message || 'Failed to start interview. Please check if the backend server is running.'
      }));
    }
  };

  const handleCodeChange = (code: string) => {
    setState(prev => ({ ...prev, userCode: code }));
  };

  const handleSubmitCode = async () => {
    if (!state.question || !state.timeStarted) return;

    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const timeElapsed = Math.floor((Date.now() - state.timeStarted) / 1000);
      
      const submission: CodeSubmission = {
        question_id: state.question.id,
        user_code: state.userCode,
        time_taken_seconds: timeElapsed,
        session_id: state.session?.id
      };

      const result = await ApiService.submitCode(submission);
      
      // End session
      if (state.session) {
        await ApiService.endSession(state.session.id);
      }

      // Navigate to results with submission data
      navigate('/results', {
        state: {
          submission: result,
          question: state.question,
          timeElapsed
        }
      });

    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.message || 'Failed to submit code'
      }));
    }
  };

  const handleTimeUp = () => {
    // Auto-submit when time is up
    handleSubmitCode();
  };

  const handleEndInterview = async () => {
    if (state.session) {
      try {
        await ApiService.endSession(state.session.id);
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    navigate('/dashboard');
  };

  const toggleHints = () => {
    setState(prev => ({ ...prev, showHints: !prev.showHints }));
  };

  // Render different phases
  if (state.phase === 'setup') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your Interview
            </h1>
            <p className="text-lg text-gray-600">
              Configure your interview settings and begin practicing
            </p>
          </div>

          {state.error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{state.error}</span>
              </div>
            </div>
          )}

          <InterviewSetup 
            onStart={handleStartInterview}
            initialSettings={initialSettings}
          />
        </div>
      </div>
    );
  }

  if (state.phase === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Preparing Your Interview
          </h2>
          <p className="text-gray-600">
            Generating questions and setting up your session...
          </p>
        </div>
      </div>
    );
  }

  if (state.phase === 'active' && state.question) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Timer and Controls */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Session Info */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Code className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">
                    Coding Interview
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Session: {state.session?.id.slice(-8)}
                </div>
              </div>

              {/* Timer */}
              <div className="flex items-center space-x-6">
                <Timer
                  duration={(state.session?.duration_minutes || 30) * 60}
                  onTimeUp={handleTimeUp}
                  autoStart={true}
                />

                {/* Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleHints}
                    className={`p-2 rounded-lg transition-colors ${
                      state.showHints 
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={state.showHints ? 'Hide Hints' : 'Show Hints'}
                  >
                    <Lightbulb className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleEndInterview}
                    className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    title="End Interview"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Question Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <QuestionDisplay 
                question={state.question}
                showHints={state.showHints}
              />
            </div>

            {/* Code Editor Panel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    Code Editor
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      state.question.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-800'
                        : state.question.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {state.question.difficulty.charAt(0).toUpperCase() + state.question.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <CodeEditor
                  initialCode={state.userCode}
                  onChange={handleCodeChange}
                  onSubmit={handleSubmitCode}
                  language="python"
                />

                {/* Submit Button */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {state.userCode.split('\n').length} lines, {state.userCode.length} characters
                  </div>
                  
                  <button
                    onClick={handleSubmitCode}
                    disabled={state.isSubmitting || !state.userCode.trim()}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
                      state.isSubmitting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {state.isSubmitting ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit Solution</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {state.error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="text-red-800">{state.error}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};