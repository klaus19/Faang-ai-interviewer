import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Code, 
  Target, 
  Lightbulb, 
  Play,
  Settings,
  ChevronDown
} from 'lucide-react';
import { ApiService } from '../../services/api';

interface InterviewSetupProps {
  onStart: (settings: InterviewSettings) => void;
  initialSettings?: Partial<InterviewSettings>;
}

interface InterviewSettings {
  sessionType: 'coding';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  topic?: string;
  enableHints: boolean;
}

export const InterviewSetup: React.FC<InterviewSetupProps> = ({ 
  onStart, 
  initialSettings = {} 
}) => {
  const [settings, setSettings] = useState<InterviewSettings>({
    sessionType: 'coding',
    difficulty: 'medium',
    duration: 30,
    topic: '',
    enableHints: true,
    ...initialSettings
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const cats = await ApiService.getQuestionCategories();
      // Ensure all categories are strings and valid
      const validCategories = cats
        .filter(cat => cat && typeof cat === 'string' && cat.length > 0)
        .map(cat => String(cat).trim());
      setCategories(validCategories);
    } catch (error) {
      console.log('Categories not available:', error);
      // Fallback categories - all strings
      setCategories([
        'arrays', 
        'strings', 
        'trees', 
        'graphs', 
        'dynamic-programming', 
        'linked-lists',
        'hash-tables',
        'sorting',
        'searching',
        'recursion',
        'greedy-algorithms'
      ]);
    }
  };

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await onStart(settings);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const sessionTypes = [
    {
      id: 'coding' as const,
      name: 'Coding Interview',
      description: 'Algorithm and data structure problems',
      icon: Code,
      color: 'text-blue-600'
    },
    {
      id: 'system_design' as const,
      name: 'System Design',
      description: 'Architecture and scalability questions',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      id: 'behavioral' as const,
      name: 'Behavioral',
      description: 'Leadership and experience questions',
      icon: Lightbulb,
      color: 'text-green-600'
    }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy', color: 'text-green-600', description: 'Perfect for beginners' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600', description: 'Most common in interviews' },
    { value: 'hard', label: 'Hard', color: 'text-red-600', description: 'Advanced challenge' }
  ];

  const durationOptions = [15, 20, 30, 45, 60];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {/* Session Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Interview Type
          </h3>
          <div className="grid gap-4">
            {sessionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <label
                  key={type.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    settings.sessionType === type.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="sessionType"
                    value={type.id}
                    checked={settings.sessionType === type.id}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      sessionType: e.target.value as any 
                    }))}
                    className="sr-only"
                  />
                  <Icon className={`h-6 w-6 ${type.color} mr-4`} />
                  <div>
                    <div className="font-medium text-gray-900">{type.name}</div>
                    <div className="text-sm text-gray-500">{type.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Difficulty Level
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {difficultyOptions.map((option) => (
              <label
                key={option.value}
                className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  settings.difficulty === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={option.value}
                  checked={settings.difficulty === option.value}
                  onChange={(e) => setSettings(prev => ({ 
                    ...prev, 
                    difficulty: e.target.value as any 
                  }))}
                  className="sr-only"
                />
                <div className={`font-medium ${option.color} mb-1`}>
                  {option.label}
                </div>
                <div className="text-xs text-gray-500 text-center">
                  {option.description}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Duration Selection */}
        <div className="mb-8">
          <label className="block text-lg font-medium text-gray-900 mb-4">
            Duration
          </label>
          <div className="relative">
            <select
              value={settings.duration}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                duration: parseInt(e.target.value) 
              }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              {durationOptions.map((duration) => (
                <option key={duration} value={duration}>
                  {duration} minutes
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Topic Selection (for coding interviews) */}
        {settings.sessionType === 'coding' && (
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-900 mb-4">
              Topic (Optional)
            </label>
            <div className="relative">
              <select
                value={settings.topic}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  topic: e.target.value 
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              >
                <option value="">Any Topic</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {String(category).charAt(0).toUpperCase() + String(category).slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Additional Options */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Options
          </h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={settings.enableHints}
              onChange={(e) => setSettings(prev => ({ 
                ...prev, 
                enableHints: e.target.checked 
              }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-3 text-gray-900">Enable hints during interview</span>
          </label>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={isLoading}
          className={`w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-medium text-lg transition-all ${
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Starting Interview...</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              <span>Start Interview</span>
            </>
          )}
        </button>

        {/* Summary */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Interview Summary:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Type: {sessionTypes.find(t => t.id === settings.sessionType)?.name}</div>
            <div>Difficulty: {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}</div>
            <div>Duration: {settings.duration} minutes</div>
            {settings.topic && <div>Topic: {settings.topic.replace('-', ' ')}</div>}
            <div>Hints: {settings.enableHints ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};