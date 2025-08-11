import React, { useState } from 'react';
import { Clock, Eye, Brain, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';

const ScreenTimeTips: React.FC = () => {
  const [remindersEnabled, setRemindersEnabled] = useState(false);

  const tips = [
    {
      id: '20-20-20',
      icon: Eye,
      title: '20-20-20 Rule',
      description: 'Every 20 minutes, look at something 20 feet away for 20 seconds to reduce eye strain.',
      category: 'Eye Health',
      color: 'bg-blue-500'
    },
    {
      id: 'breaks',
      icon: Clock,
      title: 'Regular Breaks',
      description: 'Take a 5-10 minute break every hour. Stand up, stretch, and move around.',
      category: 'Physical Health',
      color: 'bg-green-500'
    },
    {
      id: 'posture',
      icon: Brain,
      title: 'Proper Posture',
      description: 'Keep your screen at eye level, feet flat on floor, and shoulders relaxed.',
      category: 'Physical Health',
      color: 'bg-purple-500'
    },
    {
      id: 'lighting',
      icon: Eye,
      title: 'Optimal Lighting',
      description: 'Ensure good ambient lighting to reduce contrast between screen and surroundings.',
      category: 'Eye Health',
      color: 'bg-yellow-500'
    },
    {
      id: 'hydration',
      icon: CheckCircle,
      title: 'Stay Hydrated',
      description: 'Drink water regularly. Screen time can reduce blink rate, leading to dry eyes.',
      category: 'General Health',
      color: 'bg-blue-400'
    },
    {
      id: 'sleep',
      icon: AlertTriangle,
      title: 'Screen-Free Before Bed',
      description: 'Avoid screens 1-2 hours before bedtime to improve sleep quality.',
      category: 'Sleep Health',
      color: 'bg-indigo-500'
    }
  ];

  const healthyHabits = [
    'Use blue light filters in the evening',
    'Adjust screen brightness to match surroundings',
    'Blink consciously and frequently',
    'Keep screens at arm\'s length distance',
    'Use larger fonts to reduce eye strain',
    'Clean your screen regularly for clarity'
  ];

  const studyScheduleExample = [
    { time: '9:00 AM', activity: 'Start study session', duration: '50 min' },
    { time: '9:50 AM', activity: '10-minute break (no screens)', duration: '10 min' },
    { time: '10:00 AM', activity: 'Continue studying', duration: '50 min' },
    { time: '10:50 AM', activity: 'Longer break + walk', duration: '20 min' },
    { time: '11:10 AM', activity: 'Study session', duration: '50 min' },
    { time: '12:00 PM', activity: 'Lunch break (screen-free)', duration: '60 min' }
  ];

  const toggleReminders = () => {
    if (!remindersEnabled && 'Notification' in window) {
      Notification.requestPermission().then(() => {
        setRemindersEnabled(true);
        
        // Demo notification
        setTimeout(() => {
          if (Notification.permission === 'granted') {
            new Notification('StudySync Wellness Reminder', {
              body: 'Time for a 20-20-20 break! Look at something 20 feet away for 20 seconds.',
              icon: '/vite.svg'
            });
          }
        }, 2000);
      });
    } else {
      setRemindersEnabled(!remindersEnabled);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wellness Overview */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <h2 className="font-poppins font-bold text-2xl mb-2">Digital Wellness</h2>
            <p className="font-inter opacity-90">
              Protect your eyes, maintain good posture, and create healthy study habits
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Reminder Settings */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-1">
              Break Reminders
            </h3>
            <p className="font-inter text-gray-600 dark:text-gray-300">
              Get notified to take regular breaks and follow healthy screen habits
            </p>
          </div>
          <Button
            variant={remindersEnabled ? 'primary' : 'outline'}
            icon={Bell}
            onClick={toggleReminders}
          >
            {remindersEnabled ? 'Enabled' : 'Enable'}
          </Button>
        </div>
        {remindersEnabled && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
            <p className="font-inter text-sm text-green-700 dark:text-green-300">
              ✓ Reminders enabled! You'll receive notifications every 20 minutes for eye breaks and hourly for movement breaks.
            </p>
          </div>
        )}
      </Card>

      {/* Screen Time Tips Grid */}
      <div>
        <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
          Essential Screen Time Tips
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <Card key={tip.id} hover>
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <tip.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-poppins font-semibold text-gray-900 dark:text-white">
                      {tip.title}
                    </h4>
                    <span className="px-2 py-1 text-xs font-inter bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                      {tip.category}
                    </span>
                  </div>
                  <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                    {tip.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Healthy Study Schedule */}
      <Card>
        <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
          Sample Healthy Study Schedule
        </h3>
        <div className="space-y-3">
          {studyScheduleExample.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 text-center">
                  <span className="font-inter font-medium text-sm text-primary-600 dark:text-primary-400">
                    {item.time}
                  </span>
                </div>
                <div className="flex-1">
                  <span className="font-inter text-gray-900 dark:text-white">
                    {item.activity}
                  </span>
                </div>
              </div>
              <span className="font-inter text-sm text-gray-500 dark:text-gray-400">
                {item.duration}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
          <p className="font-inter text-sm text-blue-700 dark:text-blue-300">
            💡 This schedule follows the 50/10 rule: 50 minutes of focused study followed by 10-minute breaks.
            Adjust timing based on your personal needs and attention span.
          </p>
        </div>
      </Card>

      {/* Additional Healthy Habits */}
      <Card>
        <h3 className="font-poppins font-semibold text-xl text-gray-900 dark:text-white mb-6">
          Additional Healthy Habits
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {healthyHabits.map((habit, index) => (
            <div key={index} className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="font-inter text-gray-900 dark:text-white">{habit}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Warning Signs */}
      <Card className="border-l-4 border-l-red-500">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-3">
              Watch for These Warning Signs
            </h3>
            <div className="space-y-2">
              <p className="font-inter text-gray-600 dark:text-gray-300">
                • Dry, tired, or strained eyes
              </p>
              <p className="font-inter text-gray-600 dark:text-gray-300">
                • Headaches or neck pain
              </p>
              <p className="font-inter text-gray-600 dark:text-gray-300">
                • Difficulty focusing on distant objects
              </p>
              <p className="font-inter text-gray-600 dark:text-gray-300">
                • Increased sensitivity to light
              </p>
              <p className="font-inter text-gray-600 dark:text-gray-300">
                • Trouble falling asleep after screen use
              </p>
            </div>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900 rounded-lg">
              <p className="font-inter text-sm text-red-700 dark:text-red-300">
                If you experience persistent symptoms, consider consulting an eye care professional or healthcare provider.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="text-center">
          <Clock className="w-12 h-12 text-primary-500 mx-auto mb-3" />
          <h4 className="font-poppins font-semibold text-gray-900 dark:text-white mb-2">
            Take a Break Now
          </h4>
          <p className="font-inter text-sm text-gray-600 dark:text-gray-300 mb-3">
            Stand up, stretch, and rest your eyes
          </p>
          <Button size="sm" variant="outline" fullWidth>
            5-Minute Break
          </Button>
        </Card>

        <Card className="text-center">
          <Eye className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="font-poppins font-semibold text-gray-900 dark:text-white mb-2">
            Eye Exercises
          </h4>
          <p className="font-inter text-sm text-gray-600 dark:text-gray-300 mb-3">
            Follow guided eye movement exercises
          </p>
          <Button size="sm" variant="outline" fullWidth>
            Start Exercises
          </Button>
        </Card>

        <Card className="text-center">
          <Brain className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h4 className="font-poppins font-semibold text-gray-900 dark:text-white mb-2">
            Posture Check
          </h4>
          <p className="font-inter text-sm text-gray-600 dark:text-gray-300 mb-3">
            Adjust your sitting position and setup
          </p>
          <Button size="sm" variant="outline" fullWidth>
            Check Posture
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default ScreenTimeTips;