import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Code, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { InterviewSession } from '../../types';

interface RecentSessionsProps {
  sessions: InterviewSession[];
}

export const RecentSessions: React.FC<RecentSessionsProps> = ({ sessions }) => {
  // Generate mock sessions if none provided
  const generateMockSessions = () => {
    const mockSessions: InterviewSession[] = [
      {
        id: 'session-1',
        session_type: 'coding',
        status: 'completed',
        start_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        end_time: new Date(Date.now() - 2 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
        duration_minutes: 25,
        questions_attempted: 1
      },
      {
        id: 'session-2',
        session_type: 'coding',
        status: 'completed',
        start_time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        end_time: new Date(Date.now() - 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        duration_minutes: 30,
        questions_attempted: 1
      },
      {
        id: 'session-3',
        session_type: 'coding',
        status: 'completed',
        start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        end_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
        duration_minutes: 20,
        questions_attempted: 1
      }
    ];
    return mockSessions;
  };

  const displaySessions = sessions.length > 0 ? sessions : generateMockSessions();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'active':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'paused':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getSessionScore = () => {
    // Mock score generation
    return Math.floor(Math.random() * 30) + 70; // 70-100 range
  };

  if (displaySessions.length === 0) {
    return (
      <div className="text-center py-8">
        <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">No practice sessions yet</p>
        <Link to="/interview" className="btn-primary">
          Start Your First Interview
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displaySessions.slice(0, 5).map((session, index) => (
        <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(session.status)}
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 capitalize">
                    {session.session_type} Interview
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatRelativeTime(session.start_time)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{session.duration_minutes}m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Code className="h-3 w-3" />
                    <span>{session.questions_attempted} problem{session.questions_attempted !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {session.status === 'completed' && (
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {getSessionScore()}%
                </div>
                <div className="text-xs text-gray-500">Score</div>
              </div>
            )}
            
            {session.status === 'completed' && (
              <Link
                to="/results"
                state={{ sessionId: session.id }}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                title="View Results"
              >
                <ExternalLink className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      ))}
      
      {displaySessions.length > 5 && (
        <div className="text-center pt-4">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Sessions ({displaySessions.length})
          </button>
        </div>
      )}
    </div>
  );
};