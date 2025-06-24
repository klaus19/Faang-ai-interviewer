import React from 'react';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Clock,
  Award,
  Crown,
  Flame
} from 'lucide-react';
import { UserStats } from '../../types';

interface AchievementsBadgesProps {
  stats: UserStats;
}

export const AchievementsBadges: React.FC<AchievementsBadgesProps> = ({ stats }) => {
  const generateAchievements = () => {
    const achievements = [
      {
        id: 'first_solve',
        name: 'First Steps',
        description: 'Solved your first problem',
        icon: Star,
        unlocked: stats.problems_solved > 0,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100'
      },
      {
        id: 'streak_3',
        name: 'Getting Started',
        description: 'Solved 3 problems in a row',
        icon: Flame,
        unlocked: stats.problems_solved >= 3,
        color: 'text-orange-600',
        bg: 'bg-orange-100'
      },
      {
        id: 'score_80',
        name: 'High Achiever',
        description: 'Achieved 80+ average score',
        icon: Trophy,
        unlocked: stats.average_score >= 80,
        color: 'text-blue-600',
        bg: 'bg-blue-100'
      },
      {
        id: 'problems_10',
        name: 'Problem Solver',
        description: 'Solved 10 problems',
        icon: Target,
        unlocked: stats.problems_solved >= 10,
        color: 'text-green-600',
        bg: 'bg-green-100'
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Completed interview in under 15 minutes',
        icon: Zap,
        unlocked: Math.random() > 0.5, // Mock condition
        color: 'text-purple-600',
        bg: 'bg-purple-100'
      },
      {
        id: 'consistency',
        name: 'Consistent Coder',
        description: 'Practiced 5 days in a row',
        icon: Clock,
        unlocked: stats.total_attempts >= 5,
        color: 'text-indigo-600',
        bg: 'bg-indigo-100'
      },
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieved a perfect 100 score',
        icon: Crown,
        unlocked: stats.average_score >= 95,
        color: 'text-pink-600',
        bg: 'bg-pink-100'
      },
      {
        id: 'dedication',
        name: 'Dedicated',
        description: 'Completed 25 practice sessions',
        icon: Award,
        unlocked: stats.total_attempts >= 25,
        color: 'text-red-600',
        bg: 'bg-red-100'
      }
    ];

    return achievements;
  };

  const achievements = generateAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <div className="space-y-4">
      {/* Unlocked Achievements */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Earned Badges ({unlockedAchievements.length})
        </h4>
        
        {unlockedAchievements.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {unlockedAchievements.slice(0, 6).map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 ${achievement.bg} border-opacity-50`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className={`h-4 w-4 ${achievement.color}`} />
                    <span className={`text-xs font-medium ${achievement.color}`}>
                      {achievement.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {achievement.description}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No badges earned yet</p>
            <p className="text-xs text-gray-400">Keep practicing to unlock achievements!</p>
          </div>
        )}
      </div>

      {/* Next Achievement */}
      {nextAchievement && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Next Goal</h4>
          <div className="p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="flex items-center space-x-2">
              <nextAchievement.icon className="h-4 w-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-600">
                {nextAchievement.name}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {nextAchievement.description}
            </p>
          </div>
        </div>
      )}

      {/* Progress Summary */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium text-gray-900">
            {unlockedAchievements.length} / {achievements.length} badges
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};