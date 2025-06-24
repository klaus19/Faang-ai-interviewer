import React, { useState } from 'react';
import { 
  ThumbsUp, 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { CodeAnalysis } from '../../types';

interface FeedbackSectionProps {
  analysis: CodeAnalysis;
}

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ analysis }) => {
  const [expandedSections, setExpandedSections] = useState({
    positive: true,
    improvements: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
        <MessageSquare className="h-5 w-5" />
        <span>Detailed Feedback</span>
      </h3>

      {/* Positive Feedback */}
      {analysis.feedback.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('positive')}
            className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 p-2 rounded -m-2"
          >
            <h4 className="text-md font-medium text-green-700 flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4" />
              <span>What You Did Well ({analysis.feedback.length})</span>
            </h4>
            {expandedSections.positive ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {expandedSections.positive && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="space-y-3">
                {analysis.feedback.map((feedback, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-200 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-green-800">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-green-800 text-sm leading-relaxed">
                      {feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Areas for Improvement */}
      {analysis.improvements.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => toggleSection('improvements')}
            className="flex items-center justify-between w-full text-left mb-3 hover:bg-gray-50 p-2 rounded -m-2"
          >
            <h4 className="text-md font-medium text-orange-700 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Areas for Improvement ({analysis.improvements.length})</span>
            </h4>
            {expandedSections.improvements ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {expandedSections.improvements && (
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="space-y-3">
                {analysis.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-200 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-orange-800">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-orange-800 text-sm leading-relaxed">
                      {improvement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No feedback fallback */}
      {analysis.feedback.length === 0 && analysis.improvements.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No detailed feedback available for this submission.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Positive Points:</span>
            <span className="font-medium text-green-600">{analysis.feedback.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Improvement Areas:</span>
            <span className="font-medium text-orange-600">{analysis.improvements.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};