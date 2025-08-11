import React, { useState } from 'react';
import { Music, Heart, Clock, Smile } from 'lucide-react';
import MusicPlayer from '../components/Wellness/MusicPlayer';
import MoodTracker from '../components/Wellness/MoodTracker';
import ScreenTimeTips from '../components/Wellness/ScreenTimeTips';
import BackgroundMusic from '../components/UI/BackgroundMusic';

const Wellness: React.FC = () => {
  const [activeTab, setActiveTab] = useState('music');

  const tabs = [
    {
      id: 'music',
      name: 'Study Music',
      icon: Music,
      component: MusicPlayer
    },
    {
      id: 'mood',
      name: 'Mood Tracker',
      icon: Smile,
      component: MoodTracker
    },
    {
      id: 'screen-time',
      name: 'Screen Time Tips',
      icon: Clock,
      component: ScreenTimeTips
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || MusicPlayer;

  return (
    <>
      {/* Small minimal music player for wellness section */}
      <div className="w-full flex justify-end mb-4">
        <BackgroundMusic />
      </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-3xl text-gray-900 dark:text-white mb-4">
          Wellness & Focus
        </h1>
        <p className="font-inter text-gray-600 dark:text-gray-300 text-lg">
          Tools to maintain balance and well-being during your study journey
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-inter font-medium transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Wellness Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl p-6 text-white">
          <Heart className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-poppins font-semibold text-lg mb-2">Mental Wellness</h3>
          <p className="font-inter text-sm opacity-90">
            Track your mood and emotional well-being throughout your study journey
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-secondary-500 to-blue-500 rounded-xl p-6 text-white">
          <Music className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-poppins font-semibold text-lg mb-2">Focus Music</h3>
          <p className="font-inter text-sm opacity-90">
            Curated playlists and ambient sounds to enhance concentration
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 text-white">
          <Clock className="w-8 h-8 mb-3 opacity-80" />
          <h3 className="font-poppins font-semibold text-lg mb-2">Digital Balance</h3>
          <p className="font-inter text-sm opacity-90">
            Tips and strategies for healthy screen time and study habits
          </p>
        </div>
      </div>

      {/* Active Component */}
      <div className="animate-fade-in">
        <ActiveComponent />
      </div>
    </div>
    </>
  );
};

export default Wellness;