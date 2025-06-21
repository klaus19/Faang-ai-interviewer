import React, { useState, useEffect, useRef } from 'react';
import { Clock, Pause, Play, Square } from 'lucide-react';

interface TimerProps {
  duration: number; // Duration in seconds
  onTimeUp: () => void;
  onTick?: (timeLeft: number) => void;
  autoStart?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ 
  duration, 
  onTimeUp, 
  onTick,
  autoStart = false 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime <= 0) {
            setIsRunning(false);
            onTimeUp();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTimeUp, onTick]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (): string => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage <= 10) return 'text-red-600';
    if (percentage <= 25) return 'text-orange-600';
    if (percentage <= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (): string => {
    const percentage = (timeLeft / duration) * 100;
    if (percentage <= 10) return 'bg-red-500';
    if (percentage <= 25) return 'bg-orange-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const toggleTimer = () => {
    if (timeLeft <= 0) return;
    
    setIsRunning(!isRunning);
    setIsPaused(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsPaused(false);
  };

  const progressPercentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex items-center space-x-4">
      {/* Timer Display */}
      <div className="flex items-center space-x-2">
        <Clock className={`h-5 w-5 ${getTimeColor()}`} />
        <div className="text-lg font-mono font-bold">
          <span className={getTimeColor()}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getProgressColor()} transition-all duration-1000 ease-linear`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Timer Controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={toggleTimer}
          disabled={timeLeft <= 0}
          className={`p-1.5 rounded-md transition-colors ${
            timeLeft <= 0
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title={isRunning ? 'Pause Timer' : 'Start Timer'}
        >
          {isRunning ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={resetTimer}
          className="p-1.5 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          title="Reset Timer"
        >
          <Square className="h-4 w-4" />
        </button>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center space-x-1">
        {timeLeft <= 0 ? (
          <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
            Time's Up!
          </span>
        ) : isPaused ? (
          <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
            Paused
          </span>
        ) : isRunning ? (
          <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Running
          </span>
        ) : (
          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
            Ready
          </span>
        )}
      </div>
    </div>
  );
};