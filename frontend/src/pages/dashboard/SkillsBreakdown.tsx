import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  Code,
  Zap,
  Clock
} from 'lucide-react';
import { UserStats } from '../../types';

interface SkillsBreakdownProps {
  stats: UserStats;
}

export const SkillsBreakdown: React.FC<SkillsBreakdownProps> = ({ stats }) => {
  // Generate mock skills data based on user stats
  const generateSkillsData = () => {
    const baseScore = stats.average_score;
    const skills = [
      {
        name: 'Arrays & Strings',
        score: Math.min(100, baseScore + Math.floor(Math.random() * 20) - 10),
        trend: 'up',
        icon: Code,
        color: 'blue'
      },
      {
        name: 'Dynamic Programming',
        score: Math.min(100, baseScore + Math.floor(Math.random() * 20) - 10),
        trend: 'down',
        icon: Target,
        color: 'purple'
      },
      {
        name: 'Trees & Graphs',
        score: Math.min(100, baseScore + Math.floor(Math.random() * 20) - 10),
        trend: 'up',
        icon: Zap,
        color: 'green'
      },
      {
        name: 'Sorting & Searching',
        score: Math.min(100, baseScore + Math.floor(Math.random() * 20) - 10),
        trend: 'stable',
        icon: Clock,
        color: 'yellow'
      },
      {
        name: 'System Design',
        score: Math.min(100, baseScore + Math.floor(Math.random() * 20) - 15),
        trend: 'up',
        icon: Target,
        color: 'red'
      }
    ];
    
    return skills.sort((a, b) => b.score - a.score);
  };

  const skillsData = generateSkillsData();

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return '#10B981'; // green
    if (score >= 60) return '#3B82F6'; // blue
    if (score >= 40) return '#F59E0B'; // yellow
    return '#EF4444'; // red
  };

  return (
    <div className="space-y-4">
      {skillsData.map((skill, index) => {
        const Icon = skill.icon;
        return (
          <div key={skill.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${getColorClasses(skill.color)}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{skill.name}</span>
                  {getTrendIcon(skill.trend)}
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-gray-900">{skill.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${skill.score}%`,
                        backgroundColor: getProgressColor(skill.score)
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                #{index + 1}
              </div>
              <div className="text-xs text-gray-500">Rank</div>
            </div>
          </div>
        );
      })}
      
      {/* Skills Summary */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">Skills Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Strongest:</span>
            <span className="ml-2 font-medium text-blue-900">
              {skillsData[0]?.name}
            </span>
          </div>
          <div>
            <span className="text-blue-700">Focus Area:</span>
            <span className="ml-2 font-medium text-blue-900">
              {skillsData[skillsData.length - 1]?.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};