import React from 'react';
import { 
  CheckCircle, 
  Zap, 
  Code, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';
import { CodeAnalysis } from '../../types';

interface PerformanceBreakdownProps {
  analysis: CodeAnalysis;
  timeElapsed: number;
}

export const PerformanceBreakdown: React.FC<PerformanceBreakdownProps> = ({ 
  analysis, 
  timeElapsed 
}) => {
  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (score >= 60) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const metrics = [
    {
      label: 'Correctness',
      score: analysis.correctness_score,
      icon: CheckCircle,
      description: 'Logic and accuracy'
    },
    {
      label: 'Efficiency',
      score: analysis.efficiency_score,
      icon: Zap,
      description: 'Algorithm optimization'
    },
    {
      label: 'Code Quality',
      score: analysis.code_quality_score,
      icon: Code,
      description: 'Structure and style'
    },
    {
      label: 'Time Management',
      score: analysis.time_management_score,
      icon: Clock,
      description: 'Completion speed'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Metrics</h3>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm">
                  <Icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{metric.label}</div>
                  <div className="text-xs text-gray-500">{metric.description}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getScoreIcon(metric.score)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(metric.score)}`}>
                  {metric.score}/100
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-xs text-blue-600 uppercase tracking-wide">
              Time Taken
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {analysis.overall_score}%
            </div>
            <div className="text-xs text-purple-600 uppercase tracking-wide">
              Overall Score
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};