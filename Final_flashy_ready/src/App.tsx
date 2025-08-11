import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import StudyTools from './pages/StudyTools';
import Planner from './pages/Planner';
import Resources from './pages/Resources';
import Wellness from './pages/Wellness';
import Profile from './pages/Profile';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const pageVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } };

  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('studysync_theme', 'light');

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onPageChange={setCurrentPage} />;
      case 'study-tools':
        return <StudyTools />;
      case 'planner':
        return <Planner />;
      case 'resources':
        return <Resources />;
      case 'wellness':
        return <Wellness />;
      case 'profile':
        return <Profile />;
      default:
        return <Home onPageChange={setCurrentPage} />;
    }
  };

  return (
    <Layout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      theme={theme}
      onThemeToggle={toggleTheme}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default App;