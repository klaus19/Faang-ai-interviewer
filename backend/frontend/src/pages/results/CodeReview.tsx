import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Download, 
  Eye,
  EyeOff,
  FileText,
  Zap,
  Clock
} from 'lucide-react';
import { Question, CodeAnalysis } from '../../types';

interface CodeReviewProps {
  userCode: string;
  question: Question;
  analysis: CodeAnalysis;
}

export const CodeReview: React.FC<CodeReviewProps> = ({ 
  userCode, 
  question, 
  analysis 
}) => {
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(userCode);
      console.log('Code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([userCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${question.title.replace(/\s+/g, '_').toLowerCase()}_solution.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const codeLines = userCode.split('\n');
  const codeStats = {
    lines: codeLines.length,
    characters: userCode.length,
    nonEmptyLines: codeLines.filter(line => line.trim().length > 0).length,
    comments: codeLines.filter(line => line.trim().startsWith('#')).length
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Code className="h-5 w-5" />
            <span>Your Solution</span>
          </h3>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowLineNumbers(!showLineNumbers)}
              className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title={showLineNumbers ? 'Hide line numbers' : 'Show line numbers'}
            >
              {showLineNumbers ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
            
            <button
              onClick={copyCode}
              className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Copy code"
            >
              <Copy className="h-4 w-4" />
            </button>
            
            <button
              onClick={downloadCode}
              className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              title="Download code"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Code Statistics */}
        <div className="mt-3 flex items-center space-x-6 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <FileText className="h-4 w-4" />
            <span>{codeStats.lines} lines</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{codeStats.characters} characters</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>{codeStats.comments} comments</span>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="p-6">
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
            <span className="text-gray-300 text-sm font-medium">solution.py</span>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>{analysis.time_complexity}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{analysis.space_complexity}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 overflow-x-auto">
            <pre className="text-sm text-gray-100 font-mono leading-relaxed">
              {codeLines.map((line, index) => (
                <div key={index} className="flex">
                  {showLineNumbers && (
                    <span className="text-gray-500 text-xs mr-4 select-none w-8 text-right">
                      {index + 1}
                    </span>
                  )}
                  <code className="flex-1">
                    {line || ' '}
                  </code>
                </div>
              ))}
            </pre>
          </div>
        </div>

        {/* Code Analysis Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Code className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Code Quality</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {analysis.code_quality_score}/100
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Structure, readability, and best practices
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Efficiency</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {analysis.efficiency_score}/100
            </div>
            <p className="text-xs text-green-700 mt-1">
              Algorithm optimization and performance
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Correctness</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {analysis.correctness_score}/100
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Logic accuracy and completeness
            </p>
          </div>
        </div>

        {/* Code Insights */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Code Insights</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Lines:</span>
              <span className="ml-2 font-medium">{codeStats.lines}</span>
            </div>
            <div>
              <span className="text-gray-600">Code Lines:</span>
              <span className="ml-2 font-medium">{codeStats.nonEmptyLines}</span>
            </div>
            <div>
              <span className="text-gray-600">Comments:</span>
              <span className="ml-2 font-medium">{codeStats.comments}</span>
            </div>
            <div>
              <span className="text-gray-600">Ratio:</span>
              <span className="ml-2 font-medium">
                {codeStats.nonEmptyLines > 0 
                  ? Math.round((codeStats.comments / codeStats.nonEmptyLines) * 100) 
                  : 0}% comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};