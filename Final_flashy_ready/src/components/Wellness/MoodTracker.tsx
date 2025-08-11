import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Plus, Smile } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Modal from '../UI/Modal';
import { MoodEntry } from '../../types';
import { storage } from '../../utils/storage';

const MoodTracker: React.FC = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [isLogging, setIsLogging] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(3);
  const [moodNote, setMoodNote] = useState('');

  const moods = [
    { value: 1, emoji: '😢', label: 'Very Bad', color: 'text-red-500' },
    { value: 2, emoji: '😞', label: 'Bad', color: 'text-orange-500' },
    { value: 3, emoji: '😐', label: 'Neutral', color: 'text-yellow-500' },
    { value: 4, emoji: '😊', label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: '😄', label: 'Great', color: 'text-blue-500' },
  ];

  useEffect(() => {
    loadMoodEntries();
  }, []);

  const loadMoodEntries = () => {
    const entries = storage.getMoodEntries();
    setMoodEntries(entries);
  };

  const logMood = () => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: selectedDate,
      mood: selectedMood,
      note: moodNote || undefined
    };

    // Remove existing entry for the same date if it exists
    const updatedEntries = moodEntries.filter(
      entry => !isSameDay(new Date(entry.date), selectedDate)
    );
    updatedEntries.push(newEntry);
    updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setMoodEntries(updatedEntries);
    storage.saveMoodEntries(updatedEntries);
    
    setMoodNote('');
    setSelectedMood(3);
    setIsLogging(false);
  };

  const getMoodEntryForDate = (date: Date) => {
    return moodEntries.find(entry => isSameDay(new Date(entry.date), date));
  };

  const getWeeklyAverage = () => {
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
    const weekEntries = moodEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= weekStart && entryDate <= weekEnd;
    });
    
    if (weekEntries.length === 0) return 0;
    return weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length;
  };

  const getCurrentStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (streak < 30) { // Max 30 days to prevent infinite loop
      const entry = getMoodEntryForDate(currentDate);
      if (!entry) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  // Get past 7 days for weekly view
  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date()),
    end: endOfWeek(new Date())
  });

  const weeklyAverage = getWeeklyAverage();
  const currentStreak = getCurrentStreak();
  const todayEntry = getMoodEntryForDate(new Date());

  return (
    <div className="space-y-6">
      {/* Today's Mood & Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <div className="text-4xl mb-2">
              {todayEntry ? moods.find(m => m.value === todayEntry.mood)?.emoji : '❓'}
            </div>
            <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-1">
              Today's Mood
            </h3>
            <p className="font-inter text-gray-600 dark:text-gray-300">
              {todayEntry 
                ? moods.find(m => m.value === todayEntry.mood)?.label 
                : 'Not logged yet'
              }
            </p>
            {!todayEntry && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedDate(new Date());
                  setIsLogging(true);
                }}
                className="mt-3"
              >
                Log Today
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {weeklyAverage.toFixed(1)}
            </div>
            <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-1">
              Week Average
            </h3>
            <p className="font-inter text-gray-600 dark:text-gray-300">
              Based on {moodEntries.filter(e => {
                const entryDate = new Date(e.date);
                return entryDate >= startOfWeek(new Date()) && entryDate <= endOfWeek(new Date());
              }).length} entries
            </p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {currentStreak}
            </div>
            <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-1">
              Current Streak
            </h3>
            <p className="font-inter text-gray-600 dark:text-gray-300">
              Days logged consecutively
            </p>
          </div>
        </Card>
      </div>

      {/* Quick Log */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white">
            How are you feeling today?
          </h3>
          <Button
            icon={Plus}
            onClick={() => {
              setSelectedDate(new Date());
              setIsLogging(true);
            }}
          >
            Log Mood
          </Button>
        </div>
        
        <div className="flex justify-center space-x-4">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => {
                setSelectedMood(mood.value);
                setSelectedDate(new Date());
                setIsLogging(true);
              }}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="text-3xl mb-1">{mood.emoji}</div>
              <span className="font-inter text-xs text-gray-600 dark:text-gray-300">
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </Card>

      {/* Weekly Overview */}
      <Card>
        <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
          This Week
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const entry = getMoodEntryForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`p-3 text-center rounded-lg border ${
                  isToday 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="font-inter text-xs text-gray-600 dark:text-gray-300 mb-1">
                  {format(day, 'EEE')}
                </div>
                <div className="text-lg">
                  {entry ? moods.find(m => m.value === entry.mood)?.emoji : '⚪'}
                </div>
                <div className="font-inter text-xs text-gray-500 dark:text-gray-400">
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Entries */}
      <Card>
        <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Recent Entries
        </h3>
        {moodEntries.length === 0 ? (
          <div className="text-center py-8">
            <Smile className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="font-poppins font-semibold text-gray-900 dark:text-white mb-2">
              No mood entries yet
            </h4>
            <p className="font-inter text-gray-600 dark:text-gray-300 mb-4">
              Start tracking your daily mood to see patterns and insights
            </p>
            <Button onClick={() => setIsLogging(true)}>
              Log Your First Mood
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {moodEntries.slice(0, 7).map((entry) => {
              const mood = moods.find(m => m.value === entry.mood)!;
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{mood.emoji}</div>
                    <div>
                      <p className="font-inter font-medium text-gray-900 dark:text-white">
                        {format(new Date(entry.date), 'MMMM dd, yyyy')}
                      </p>
                      <p className={`font-inter text-sm ${mood.color}`}>
                        {mood.label}
                      </p>
                      {entry.note && (
                        <p className="font-inter text-xs text-gray-600 dark:text-gray-300 mt-1">
                          "{entry.note}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    entry.mood === 1 ? 'bg-red-500' :
                    entry.mood === 2 ? 'bg-orange-500' :
                    entry.mood === 3 ? 'bg-yellow-500' :
                    entry.mood === 4 ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}>
                    {entry.mood}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Insights */}
      <Card>
        <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white mb-4">
          Mood Insights
        </h3>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <TrendingUp className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-inter font-medium text-gray-900 dark:text-white mb-1">
                Track Patterns
              </h4>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                Regular mood tracking helps you identify patterns and understand what affects your well-being.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-secondary-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-inter font-medium text-gray-900 dark:text-white mb-1">
                Study Correlation
              </h4>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                Notice how your mood correlates with your study sessions and academic performance.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Smile className="w-5 h-5 text-accent-500 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-inter font-medium text-gray-900 dark:text-white mb-1">
                Wellness Awareness
              </h4>
              <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
                Use mood data to make informed decisions about rest, exercise, and self-care.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Log Mood Modal */}
      <Modal
        isOpen={isLogging}
        onClose={() => setIsLogging(false)}
        title="Log Your Mood"
      >
        <div className="space-y-6">
          <div>
            <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300 mb-3">
              How are you feeling?
            </label>
            <div className="grid grid-cols-5 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                    selectedMood === mood.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <span className="font-inter text-xs text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Add a note (optional)"
            value={moodNote}
            onChange={setMoodNote}
            placeholder="What's affecting your mood today?"
            rows={3}
          />

          <div className="text-center">
            <p className="font-inter text-sm text-gray-600 dark:text-gray-300">
              Logging mood for {format(selectedDate, 'MMMM dd, yyyy')}
            </p>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsLogging(false)} 
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={logMood} fullWidth>
              Log Mood
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MoodTracker;