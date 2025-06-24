import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CodeAnalysis } from '../../types';

interface ScoreChartProps {
  analysis: CodeAnalysis;
}

export const ScoreChart: React.FC<ScoreChartProps> = ({ analysis }) => {
  // Prepare data for charts
  const data = [
    {
      name: 'Correctness',
      value: analysis.correctness_score,
      fill: '#10B981',
      shortName: 'Correct'
    },
    {
      name: 'Efficiency',
      value: analysis.efficiency_score,
      fill: '#3B82F6',
      shortName: 'Efficient'
    },
    {
      name: 'Code Quality',
      value: analysis.code_quality_score,
      fill: '#8B5CF6',
      shortName: 'Quality'
    },
    {
      name: 'Time Management',
      value: analysis.time_management_score,
      fill: '#F59E0B',
      shortName: 'Time'
    }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];

  // Custom label function for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Pie Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Score Breakdown with Progress Bars */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.fill }}
              ></div>
              <span className="text-sm font-medium text-gray-700">
                {item.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item.value}%`,
                    backgroundColor: item.fill
                  }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900 w-8 text-right">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Overall Score Circle */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
          <span className="text-lg font-bold text-white">
            {analysis.overall_score}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Overall Score</p>
      </div>

      {/* Alternative: Simple Bar Chart */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Overview</h4>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="shortName" 
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Bar dataKey="value" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};