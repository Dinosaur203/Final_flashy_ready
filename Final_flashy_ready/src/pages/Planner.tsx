import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckSquare, Target } from 'lucide-react';
import CalendarView from '../components/Planner/CalendarView';
import TodoList from '../components/Planner/TodoList';
import GoalsTracker from '../components/Planner/GoalsTracker';

const Planner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = [
    {
      id: 'calendar',
      name: 'Calendar',
      icon: CalendarIcon,
      component: CalendarView
    },
    {
      id: 'todo',
      name: 'To-Do List',
      icon: CheckSquare,
      component: TodoList
    },
    {
      id: 'goals',
      name: 'Goals & Progress',
      icon: Target,
      component: GoalsTracker
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CalendarView;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-poppins font-bold text-3xl text-gray-900 dark:text-white mb-4">
          Planner
        </h1>
        <p className="font-inter text-gray-600 dark:text-gray-300 text-lg">
          Organize your schedule, tasks, and goals
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

      {/* Active Component */}
      <div className="animate-fade-in">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default Planner;