import React from 'react';
import { CodeAnalysis } from '../../types';

interface ScoreChartProps {
  analysis: CodeAnalysis;
}

export const SimpleScoreChart: React.FC<ScoreChartProps> = ({ analysis }) => {
  const data = [
    {
      name: 'Correctness',
      value: analysis.correctness_score,
      color: '#10B981',
      bgColor: 'bg-green-500'
    },
    {
      name: 'Efficiency',
      value: analysis.efficiency_score,
      color: '#3B82F6',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Code Quality',
      value: analysis.code_quality_score,
      color: '#8B5CF6',
      bgColor: 'bg-purple-500'
    },
    {
      name: 'Time Management',
      value: analysis.time_management_score,
      color: '#F59E0B',
      bgColor: 'bg-yellow-500'
    }
  ];

  const getScoreLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: 'text-green-600' };
    if (score >= 80) return { level: 'Very Good', color: 'text-blue-600' };
    if (score >= 70) return { level: 'Good', color: 'text-yellow-600' };
    if (score >= 60) return { level: 'Fair', color: 'text-orange-600' };
    return { level: 'Needs Work', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Display */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3">
          <span className="text-2xl font-bold text-white">
            {analysis.overall_score}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-700">Overall Score</p>
        <p className={`text-xs ${getScoreLevel(analysis.overall_score).color}`}>
          {getScoreLevel(analysis.overall_score).level}
        </p>
      </div>

      {/* Score Breakdown with Circular Progress */}
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {item.value}/100
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-700 ease-out"
                style={{ 
                  width: `${item.value}%`,
                  backgroundColor: item.color
                }}
              ></div>
            </div>
            
            {/* Score Level */}
            <div className="flex justify-between items-center mt-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className={`text-xs ${getScoreLevel(item.value).color}`}>
                {getScoreLevel(item.value).level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Circular Progress Indicators */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((item, index) => (
          <div key={item.name} className="text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mb-2">
              {/* Background Circle */}
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={item.color}
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${(item.value * 175.93) / 100} 175.93`}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <span className="absolute text-xs font-bold text-gray-900">
                {item.value}
              </span>
            </div>
            <p className="text-xs text-gray-600">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};