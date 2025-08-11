import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { PomodoroSettings } from '../../types';
import { storage } from '../../utils/storage';

type TimerState = 'idle' | 'work' | 'shortBreak' | 'longBreak';

const PomodoroTimer: React.FC = () => {
  const [settings, setSettings] = useState<PomodoroSettings>(() => storage.getPomodoroSettings());
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [currentCycle, setCurrentCycle] = useState(1);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Settings form states
  const [workDuration, setWorkDuration] = useState(settings.workDuration);
  const [shortBreak, setShortBreak] = useState(settings.shortBreak);
  const [longBreak, setLongBreak] = useState(settings.longBreak);
  const [cycles, setCycles] = useState(settings.cycles);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);

  const intervalRef = useRef<NodeJS.Timeout>();
  const notificationRef = useRef<Notification>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play notification sound
    if (settings.soundEnabled) {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhAieKzvLZsW4cBjuV4O6+YhUHCFux5eHJaSwJJmnA6duKTgoUWKvp9aJKDwtOoOfw1m0ZDWU';
      audio.play().catch(() => {}); // Ignore errors if audio fails
    }

    // Show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      const messages = {
        work: 'Work session complete! Time for a break.',
        shortBreak: 'Break time over! Ready to focus?',
        longBreak: 'Long break complete! Let\'s get back to work.'
      };

      new Notification('StudySync Pomodoro', {
        body: messages[timerState] || 'Timer complete!',
        icon: '/vite.svg'
      });
    }

    // Advance to next phase
    advanceTimer();
  };

  const advanceTimer = () => {
    if (timerState === 'work') {
      if (currentCycle >= settings.cycles) {
        // Long break after completing all cycles
        setTimerState('longBreak');
        setTimeLeft(settings.longBreak * 60);
        setCurrentCycle(1);
      } else {
        // Short break
        setTimerState('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else if (timerState === 'shortBreak') {
      // Next work session
      setTimerState('work');
      setTimeLeft(settings.workDuration * 60);
      setCurrentCycle(prev => prev + 1);
    } else if (timerState === 'longBreak') {
      // Back to work
      setTimerState('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const startTimer = () => {
    if (timerState === 'idle') {
      setTimerState('work');
      setTimeLeft(settings.workDuration * 60);
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimerState('idle');
    setTimeLeft(settings.workDuration * 60);
    setCurrentCycle(1);
  };

  const saveSettings = () => {
    const newSettings: PomodoroSettings = {
      workDuration,
      shortBreak,
      longBreak,
      cycles,
      soundEnabled
    };

    setSettings(newSettings);
    storage.savePomodoroSettings(newSettings);
    
    // Update timer if idle
    if (timerState === 'idle') {
      setTimeLeft(workDuration * 60);
    }
    
    setIsSettingsOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerTitle = () => {
    switch (timerState) {
      case 'work':
        return `Work Session ${currentCycle}/${settings.cycles}`;
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return 'Ready to Start';
    }
  };

  const getTimerColor = () => {
    switch (timerState) {
      case 'work':
        return 'text-primary-500';
      case 'shortBreak':
        return 'text-secondary-500';
      case 'longBreak':
        return 'text-accent-500';
      default:
        return 'text-gray-500';
    }
  };

  const progress = timerState === 'idle' ? 0 : 
    (1 - (timeLeft / (
      timerState === 'work' ? settings.workDuration * 60 :
      timerState === 'shortBreak' ? settings.shortBreak * 60 :
      settings.longBreak * 60
    ))) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Settings Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          icon={Settings}
          onClick={() => setIsSettingsOpen(true)}
        >
          Settings
        </Button>
      </div>

      {/* Main Timer Card */}
      <Card className="text-center py-12">
        <h2 className="font-poppins font-semibold text-2xl text-gray-900 dark:text-white mb-2">
          {getTimerTitle()}
        </h2>

        {/* Circular Progress */}
        <div className="relative w-64 h-64 mx-auto mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={`transition-all duration-1000 ${getTimerColor()}`}
            />
          </svg>
          
          {/* Time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`text-6xl font-bold font-poppins ${getTimerColor()}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button
              size="lg"
              icon={Play}
              onClick={startTimer}
              className="px-8"
            >
              {timerState === 'idle' ? 'Start' : 'Resume'}
            </Button>
          ) : (
            <Button
              size="lg"
              icon={Pause}
              onClick={pauseTimer}
              className="px-8"
            >
              Pause
            </Button>
          )}
          
          <Button
            size="lg"
            variant="outline"
            icon={RotateCcw}
            onClick={resetTimer}
            className="px-8"
          >
            Reset
          </Button>
        </div>

        {/* Progress Info */}
        {timerState !== 'idle' && (
          <div className="mt-6 text-center">
            <div className="flex justify-center space-x-8">
              <div>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-300">Current Cycle</p>
                <p className="font-poppins font-semibold text-lg">{currentCycle}</p>
              </div>
              <div>
                <p className="font-inter text-sm text-gray-600 dark:text-gray-300">Total Cycles</p>
                <p className="font-poppins font-semibold text-lg">{settings.cycles}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card>
        <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
          How it works
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-inter font-medium text-gray-900 dark:text-white">Work Session</h4>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                Focus on your studies for {settings.workDuration} minutes
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-inter font-medium text-gray-900 dark:text-white">Short Break</h4>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                Take a {settings.shortBreak}-minute break to recharge
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-inter font-medium text-gray-900 dark:text-white">Repeat</h4>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                Continue for {settings.cycles} cycles total
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              4
            </div>
            <div>
              <h4 className="font-inter font-medium text-gray-900 dark:text-white">Long Break</h4>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                Enjoy a {settings.longBreak}-minute long break
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Pomodoro Settings"
      >
        <div className="space-y-4">
          <Input
            label="Work Duration (minutes)"
            type="number"
            value={workDuration.toString()}
            onChange={(value) => setWorkDuration(parseInt(value) || 25)}
          />
          
          <Input
            label="Short Break (minutes)"
            type="number"
            value={shortBreak.toString()}
            onChange={(value) => setShortBreak(parseInt(value) || 5)}
          />
          
          <Input
            label="Long Break (minutes)"
            type="number"
            value={longBreak.toString()}
            onChange={(value) => setLongBreak(parseInt(value) || 15)}
          />
          
          <Input
            label="Cycles until Long Break"
            type="number"
            value={cycles.toString()}
            onChange={(value) => setCycles(parseInt(value) || 4)}
          />

          <div className="flex items-center justify-between">
            <div>
              <label className="font-inter font-medium text-sm text-gray-700 dark:text-gray-300">
                Notification Sound
              </label>
              <p className="font-inter text-xs text-gray-500 dark:text-gray-400">
                Play sound when timer completes
              </p>
            </div>
            <Button
              variant={soundEnabled ? 'primary' : 'outline'}
              icon={soundEnabled ? Volume2 : VolumeX}
              onClick={() => setSoundEnabled(!soundEnabled)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button onClick={saveSettings} fullWidth>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PomodoroTimer;