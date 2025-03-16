
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface ExerciseTimerProps {
  initialDuration?: number; // in seconds
  onComplete?: () => void;
}

const ExerciseTimer: React.FC<ExerciseTimerProps> = ({ 
  initialDuration = 60,
  onComplete
}) => {
  const [duration, setDuration] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for completion sound
    audioRef.current = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3');
    audioRef.current.preload = 'auto';
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            
            // Play sound when timer completes
            if (isSoundEnabled && audioRef.current) {
              audioRef.current.play().catch(e => console.error('Error playing sound:', e));
            }
            
            if (onComplete) {
              onComplete();
            }
            
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, onComplete, isSoundEnabled]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercent = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-40 h-40 rounded-full relative mb-4">
        {/* Progress circle background */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700"></div>
        
        {/* Progress circle fill */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="transparent"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={isRunning ? "#10b981" : "#6b7280"}
            strokeWidth="8"
            strokeDasharray="289.02652413026095"
            strokeDashoffset={(289.02652413026095 * (100 - progressPercent)) / 100}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Timer display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      {/* Duration input slider */}
      <div className="w-full max-w-xs mb-6">
        <label className="block text-sm font-medium mb-2 text-center">
          Set Duration (min): {Math.floor(duration/60)}
        </label>
        <input
          type="range"
          min="30"
          max="3600"
          step="30"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          disabled={isRunning}
          className="w-full"
        />
      </div>
      
      {/* Timer controls */}
      <div className="flex space-x-4">
        {isRunning ? (
          <button
            onClick={pauseTimer}
            className="p-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <Pause size={24} />
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="p-3 rounded-full bg-regime-green text-white hover:bg-green-600 transition-colors"
          >
            <Play size={24} />
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <RotateCcw size={24} />
        </button>
        
        <button
          onClick={toggleSound}
          className="p-3 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          {isSoundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </div>
    </div>
  );
};

export default ExerciseTimer;
