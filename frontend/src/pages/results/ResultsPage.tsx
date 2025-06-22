import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Code2, 
  Target,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  Home,
  Share,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { CodeAnalysis, Question, SubmissionResponse } from '../../types';
import { SimpleScoreChart } from '../../components/charts/SimpleScoreChart';
import { PerformanceBreakdown } from '../results/PerformanceBreakdown';
import { FeedbackSection } from '../results/FeedbackSection';
import { CodeReview } from '../results/CodeReview';

interface ResultsPageState {
  submission: SubmissionResponse | null;
  question: Question | null;
  timeElapsed: number;
  userCode: string;
  loading: boolean;
  error: string | null;
}

export const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [state, setState] = useState<ResultsPageState>({
    submission: null,
    question: null,
    timeElapsed: 0,
    userCode: '',
    loading: false,
    error: null
  });

  const [showCode, setShowCode] = useState(true);

  useEffect(() => {
    // Get data from navigation state (from interview page)
    const locationState = location.state as any;
    
    if (locationState?.submission && locationState?.question) {
      setState(prev => ({
        ...prev,
        submission: locationState.submission,
        question: locationState.question,
        timeElapsed: locationState.timeElapsed || 0,
        userCode: locationState.userCode || ''
      }));
    } else {
      // If no data, redirect to home or show error
      setState(prev => ({
        ...prev,
        error: 'No submission data found. Please complete an interview first.'
      }));
    }
  }, [location.state]);

  const getOverallRating = (score: number): { text: string; color: string } => {
    if (score >= 90) return { text: 'Excellent', color: 'text-green-600' };
    if (score >= 80) return { text: 'Very Good', color: 'text-blue-600' };
    if (score >= 70) return { text: 'Good', color: 'text-yellow-600' };
    if (score >= 60) return { text: 'Fair', color: 'text-orange-600' };
    return { text: 'Needs Improvement', color: 'text-red-600' };
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handleRetryQuestion = () => {
    navigate('/interview', {
      state: {
        difficulty: state.question?.difficulty,
        autoStart: true
      }
    });
  };

  const handleShareResults = async () => {
    if (!state.submission || !state.question) return;
    
    const shareText = `I just completed a ${state.question.difficulty} coding interview question "${state.question.title}" and scored ${state.submission.analysis.overall_score}/100! 🚀`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Coding Interview Results',
          text: shareText,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText + ' ' + window.location.href);
        alert('Results copied to clipboard!');
      } catch (error) {
        console.error('Could not copy to clipboard:', error);
      }
    }
  };

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">No Results Found</h1>
          <p className="text-gray-600 mb-6">{state.error}</p>
          <div className="space-y-3">
            <Link to="/interview" className="w-full btn-primary flex items-center justify-center gap-2">
              <Code2 className="h-4 w-4" />
              Start New Interview
            </Link>
            <Link to="/" className="w-full btn-secondary flex items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!state.submission || !state.question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const analysis = state.submission.analysis;
  const question = state.question;
  const overallRating = getOverallRating(analysis.overall_score);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interview Results</h1>
              <p className="text-gray-600 mt-1">
                Analysis for "{question.title}" • {formatTime(state.timeElapsed)}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCode(!showCode)}
                className="btn-secondary flex items-center gap-2"
              >
                {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showCode ? 'Hide Code' : 'Show Code'}
              </button>
              
              <button
                onClick={handleShareResults}
                className="btn-secondary flex items-center gap-2"
              >
                <Share className="h-4 w-4" />
                Share
              </button>
              
              <button
                onClick={handleRetryQuestion}
                className="btn-primary flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Score Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
              <span className="text-3xl font-bold text-white">
                {analysis.overall_score}
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Overall Score: {analysis.overall_score}/100
            </h2>
            
            <p className={`text-xl font-medium ${overallRating.color} mb-4`}>
              {overallRating.text}
            </p>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Time: {formatTime(state.timeElapsed)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="h-4 w-4" />
                <span>Difficulty: {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>AI Analysis: {state.submission.ai_powered ? 'Yes' : 'Enhanced Mock'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Scores and Charts */}
          <div className="lg:col-span-1 space-y-6">
            {/* Score Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
              <SimpleScoreChart analysis={analysis} />
            </div>

            {/* Detailed Metrics */}
            <PerformanceBreakdown analysis={analysis} timeElapsed={state.timeElapsed} />

            {/* Complexity Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complexity Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Complexity:</span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {analysis.time_complexity || 'O(?)'}
                  </code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Space Complexity:</span>
                  <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                    {analysis.space_complexity || 'O(?)'}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Feedback and Code */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feedback Section */}
            <FeedbackSection analysis={analysis} />

            {/* Code Review */}
            {showCode && (
              <CodeReview 
                userCode={state.userCode || ''} 
                question={question}
                analysis={analysis}
              />
            )}

            {/* Interview Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-start space-x-3">
                <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Interview Tips for Next Time
                  </h3>
                  <div className="space-y-2">
                    {analysis.interview_tips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></span>
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/interview" 
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Code2 className="h-5 w-5" />
            Practice Another Question
          </Link>
          
          <Link 
            to="/dashboard" 
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            View Progress Dashboard
          </Link>
          
          <Link 
            to="/" 
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};