import React, { useState } from 'react';
import { 
  Lightbulb, 
  ChevronDown, 
  ChevronRight, 
  Tag, 
  Clock,
  CheckCircle,
  Info,
  Loader
} from 'lucide-react';
import { Question } from '../../types';

interface QuestionDisplayProps {
  question: Question | null;
  showHints?: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ 
  question, 
  showHints = false 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    examples: true,
    constraints: false,
    hints: false
  });

  // Loading state when question is null
  if (!question) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Safe access with fallbacks
  const examples = question.examples || [];
  const constraints = question.constraints || [];
  const hints = question.hints || [];
  const tags = question.tags || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-semibold text-gray-900 pr-4">
            {question.title || 'Untitled Question'}
          </h2>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty || 'medium')}`}>
              {(question.difficulty || 'medium').charAt(0).toUpperCase() + (question.difficulty || 'medium').slice(1)}
            </span>
          </div>
        </div>
        
        {/* Tags and Time Limit */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{question.time_limit_minutes || 30} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Tag className="h-4 w-4" />
              <span>{tags.slice(0, 2).join(', ') || 'No tags'}</span>
              {tags.length > 2 && (
                <span className="text-gray-400">+{tags.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Problem Description */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Problem Description</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {question.description || 'No description available.'}
            </p>
          </div>
        </div>

        {/* Examples Section */}
        {examples.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('examples')}
              className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 p-2 rounded -m-2"
            >
              <h3 className="text-lg font-medium text-gray-900">
                Examples ({examples.length})
              </h3>
              {expandedSections.examples ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.examples && (
              <div className="space-y-4">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium text-gray-900 mb-2">
                      Example {index + 1}:
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Input:</span>
                        <code className="ml-2 px-2 py-1 bg-gray-200 rounded font-mono text-gray-800">
                          {example.input || 'No input'}
                        </code>
                      </div>
                      
                      <div>
                        <span className="font-medium text-gray-700">Output:</span>
                        <code className="ml-2 px-2 py-1 bg-gray-200 rounded font-mono text-gray-800">
                          {example.output || 'No output'}
                        </code>
                      </div>
                      
                      {example.explanation && (
                        <div>
                          <span className="font-medium text-gray-700">Explanation:</span>
                          <span className="ml-2 text-gray-600">
                            {example.explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Constraints Section */}
        {constraints.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('constraints')}
              className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 p-2 rounded -m-2"
            >
              <h3 className="text-lg font-medium text-gray-900">
                Constraints ({constraints.length})
              </h3>
              {expandedSections.constraints ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.constraints && (
              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="space-y-2">
                  {constraints.map((constraint, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{constraint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Hints Section */}
        {showHints && hints.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => toggleSection('hints')}
              className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 p-2 rounded -m-2"
            >
              <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span>Hints ({hints.length})</span>
              </h3>
              {expandedSections.hints ? (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            {expandedSections.hints && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="space-y-3">
                  {hints.map((hint, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium flex-shrink-0">
                        {index + 1}
                      </span>
                      <p className="text-sm text-gray-700">{hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Additional Tags */}
        {tags.length > 2 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-4 w-4" />
            <span>Question ID: {question.id || 'Unknown'}</span>
          </div>
          <div>
            Time limit: {question.time_limit_minutes || 30} minutes
          </div>
        </div>
      </div>
    </div>
  );
};