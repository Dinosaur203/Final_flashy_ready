import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, HelpCircle, Clock, Plus } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import FlashcardsManager from '../components/StudyTools/FlashcardsManager';
import NotesManager from '../components/StudyTools/NotesManager';
import QuizGenerator from '../components/StudyTools/QuizGenerator';
import PomodoroTimer from '../components/StudyTools/PomodoroTimer';

const StudyTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('flashcards');

  const tools = [
    {
      id: 'flashcards',
      name: 'Flashcards',
      icon: BookOpen,
      description: 'Create and study flashcard decks with spaced repetition'
    },
    {
      id: 'notes',
      name: 'Notes',
      icon: FileText,
      description: 'Rich text editor for organized note-taking'
    },
    {
      id: 'quiz',
      name: 'Quiz Generator',
      icon: HelpCircle,
      description: 'Generate quizzes from your flashcards and notes'
    },
    {
      id: 'pomodoro',
      name: 'Pomodoro Timer',
      icon: Clock,
      description: 'Focus timer with customizable intervals'
    }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'flashcards':
        return <FlashcardsManager />;
      case 'notes':
        return <NotesManager />;
      case 'quiz':
        return <QuizGenerator />;
      case 'pomodoro':
        return <PomodoroTimer />;
      default:
        return <FlashcardsManager />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-3xl text-gray-900 dark:text-white mb-4">
          Study Tools
        </h1>
        <p className="font-inter text-gray-600 dark:text-gray-300 text-lg">
          Powerful tools to enhance your learning experience
        </p>
      </div>

      {/* Tool Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id)}
              className={`
                flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-inter font-medium transition-all duration-200
                ${activeTab === tool.id
                  ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <tool.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tool.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Active Tool Component */}
      <div className="animate-fade-in">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default StudyTools;