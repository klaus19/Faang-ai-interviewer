import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { UserStats } from '../../types';

interface ProgressChartProps {
  stats: UserStats;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ stats }) => {
  // Generate mock progress data based on stats
  const generateProgressData = () => {
    const data = [];
    const baseScore = Math.max(40, stats.average_score - 20);
    
    for (let i = 0; i < 14; i++) {
      const variance = Math.random() * 15 - 7.5; // ±7.5 points variance
      const trend = (i / 14) * 10; // Upward trend
      const score = Math.min(100, Math.max(0, baseScore + trend + variance));
      
      data.push({
        day: `Day ${i + 1}`,
        score: Math.round(score),
        problems: Math.floor(Math.random() * 3) + 1,
        date: new Date(Date.now() - (13 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    
    return data;
  };

  const progressData = generateProgressData();

  return (
    <div className="space-y-6">
      {/* Score Trend */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Average Score Trend</h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#scoreGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {progressData[progressData.length - 1]?.score || stats.average_score}
          </div>
          <div className="text-xs text-gray-500">Latest Score</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            +{Math.round(Math.random() * 10 + 5)}
          </div>
          <div className="text-xs text-gray-500">Points This Week</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {progressData.reduce((sum, day) => sum + day.problems, 0)}
          </div>
          <div className="text-xs text-gray-500">Problems Solved</div>
        </div>
      </div>
    </div>
  );
};