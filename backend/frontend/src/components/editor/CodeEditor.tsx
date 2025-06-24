import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { 
  Code, 
  Copy, 
  RotateCcw, 
  Maximize, 
  Minimize,
  Settings
} from 'lucide-react';

interface CodeEditorProps {
  initialCode?: string;
  language?: string;
  onChange: (code: string) => void;
  onSubmit?: (code: string) => void;
  readOnly?: boolean;
  height?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode = '',
  language = 'python',
  onChange,
  onSubmit,
  readOnly = false,
  height = '400px'
}) => {
  const [code, setCode] = React.useState(initialCode);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [isEditorReady, setIsEditorReady] = React.useState(false);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onChange(newCode);
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);
    
    try {
      // Add keyboard shortcuts only after editor is mounted
      editor.addAction({
        id: 'submit-code',
        label: 'Submit Code',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
        ],
        run: () => {
          if (onSubmit) {
            onSubmit(code);
          }
        }
      });

      // Focus the editor
      editor.focus();
    } catch (error) {
      console.warn('Could not add keyboard shortcuts:', error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here
      console.log('Code copied to clipboard');
    } catch (error) {
      console.error('Failed to copy code:', error);
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        console.log('Code copied using fallback method');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const resetCode = () => {
    setCode(initialCode);
    onChange(initialCode);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getLanguageTemplates = () => {
    const templates = {
      python: `# Write your solution here
def solution():
    # Your code goes here
    pass

# Test your solution
if __name__ == "__main__":
    print("Testing solution...")`,
      
      javascript: `// Write your solution here
function solution() {
    // Your code goes here
}

// Test your solution
console.log("Testing solution...");`,
      
      java: `public class Solution {
    public void solution() {
        // Your code goes here
    }
    
    public static void main(String[] args) {
        Solution sol = new Solution();
        System.out.println("Testing solution...");
    }
}`,
      
      cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    void solution() {
        // Your code goes here
    }
};

int main() {
    Solution sol;
    cout << "Testing solution..." << endl;
    return 0;
}`
    };
    
    return templates[language as keyof typeof templates] || templates.python;
  };

  const editorOptions = {
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 14,
    lineNumbers: 'on' as const,
    roundedSelection: false,
    automaticLayout: true,
    wordWrap: 'on' as const,
    tabSize: 4,
    insertSpaces: true,
    readOnly,
    theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on' as const,
    snippetSuggestions: 'top' as const,
    selectOnLineNumbers: true,
    matchBrackets: 'always' as const,
    folding: true,
    foldingHighlight: true,
    foldingStrategy: 'indentation' as const,
    showFoldingControls: 'always' as const,
    // Disable some features that might cause issues
    quickSuggestions: {
      other: true,
      comments: false,
      strings: false
    }
  };

  const containerClass = isFullscreen
    ? 'fixed inset-0 z-50 bg-white'
    : 'relative';

  const editorHeight = isFullscreen ? 'calc(100vh - 120px)' : height;

  return (
    <div className={containerClass}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <Code className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700 capitalize">
            {language} Editor
          </span>
          <span className="text-xs text-gray-500">
            {code.split('\n').length} lines
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Copy Code */}
          <button
            onClick={copyToClipboard}
            className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            title="Copy code"
          >
            <Copy className="h-4 w-4" />
          </button>

          {/* Reset Code */}
          <button
            onClick={resetCode}
            className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            title="Reset to template"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <Editor
          height={editorHeight}
          language={language}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading editor...</p>
              </div>
            </div>
          }
        />

        {/* Keyboard Shortcuts Hint */}
        {!readOnly && isEditorReady && (
          <div className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-70">
            Ctrl+Enter to submit
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <span>Language: {language.charAt(0).toUpperCase() + language.slice(1)}</span>
          <span>Theme: {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
          <span>Characters: {code.length}</span>
        </div>
        <div className="flex items-center space-x-4">
          {!readOnly && isEditorReady && (
            <span>Press Ctrl+Enter to submit</span>
          )}
          {!isEditorReady && (
            <span className="text-yellow-600">Editor loading...</span>
          )}
        </div>
      </div>
    </div>
  );
};