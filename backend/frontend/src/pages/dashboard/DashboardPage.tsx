import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Code, 
  Clock, 
  Target,
  Award,
  Calendar,
  BarChart3,
  Play,
  RefreshCw,
  Trophy,
  Zap,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { UserStats, InterviewSession } from '../../types';
import { ProgressChart } from '../dashboard/ProgressChart';
import { RecentSessions } from '../dashboard/RecentSessions';
import { SkillsBreakdown } from '../dashboard/SkillsBreakdown';
import { AchievementsBadges } from '../dashboard/AchievementsBadges';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userStats = await ApiService.getUserStats();
      setStats(userStats);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Unable to load dashboard data. Using demo data for now.');
      
      // Fallback demo data
      setStats({
        total_attempts: 25,
        average_score: 78,
        problems_solved: 18,
        favorite_difficulty: 'medium',
        improvement_areas: ['Dynamic Programming', 'Graph Algorithms', 'System Design'],
        recent_sessions: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Failed to load dashboard data</p>
          <button onClick={fetchDashboardData} className="btn-primary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Expert', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 80) return { level: 'Advanced', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 70) return { level: 'Intermediate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 60) return { level: 'Beginner', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Novice', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(stats.average_score);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track your progress and continue improving your interview skills
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchDashboardData}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </button>
              
              <Link 
                to="/interview" 
                className="btn-primary flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Start Interview
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Attempts */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total_attempts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Keep practicing to improve!
              </span>
            </div>
          </div>

          {/* Average Score */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{stats.average_score}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performance.bg} ${performance.color}`}>
                {performance.level}
              </span>
            </div>
          </div>

          {/* Problems Solved */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                <p className="text-3xl font-bold text-gray-900">{stats.problems_solved}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                {Math.round((stats.problems_solved / stats.total_attempts) * 100)}% success rate
              </span>
            </div>
          </div>

          {/* Preferred Difficulty */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Preferred Level</p>
                <p className="text-3xl font-bold text-gray-900 capitalize">{stats.favorite_difficulty}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Most practiced difficulty
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trend</h3>
              <ProgressChart stats={stats} />
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Practice Sessions</h3>
              <RecentSessions sessions={stats.recent_sessions} />
            </div>

            {/* Skills Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills Analysis</h3>
              <SkillsBreakdown stats={stats} />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/interview"
                  state={{ 
                    difficulty: 'easy', 
                    autoStart: false,
                    sessionType: 'coding',
                    duration: 30,
                    enableHints: true 
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Easy Practice
                </Link>
                
                <Link
                  to="/interview"
                  state={{ 
                    difficulty: 'medium', 
                    autoStart: false,
                    sessionType: 'coding',
                    duration: 30,
                    enableHints: true 
                  }}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Start Medium Practice
                </Link>
                
                <Link
                  to="/interview"
                  state={{ 
                    difficulty: 'hard', 
                    autoStart: false,
                    sessionType: 'coding',
                    duration: 45,
                    enableHints: false 
                  }}
                  className="w-full btn-danger flex items-center justify-center gap-2"
                >
                  <Target className="h-4 w-4" />
                  Start Hard Challenge
                </Link>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h3>
              <AchievementsBadges stats={stats} />
            </div>

            {/* Improvement Areas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Focus Areas</h3>
              <div className="space-y-3">
                {stats.improvement_areas.map((area, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm font-medium text-orange-900">{area}</span>
                    <Link
                      to="/interview"
                      state={{ 
                        topic: area.toLowerCase().replace(/\s+/g, '-'), 
                        difficulty: 'medium',
                        sessionType: 'coding',
                        duration: 30,
                        enableHints: true
                      }}
                      className="text-orange-600 hover:text-orange-800 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Streak */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-semibold">Study Streak</h3>
                  <p className="text-blue-100">Keep practicing daily!</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold">7 days</div>
                <p className="text-blue-100 text-sm">Current streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};