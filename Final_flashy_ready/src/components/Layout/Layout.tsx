import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentPage, 
  onPageChange, 
  theme, 
  onThemeToggle 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Navigation 
        currentPage={currentPage}
        onPageChange={onPageChange}
        theme={theme}
        onThemeToggle={onThemeToggle}
      />
      <main className="py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;