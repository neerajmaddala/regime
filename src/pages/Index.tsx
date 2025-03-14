
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-regime-dark text-gray-900 dark:text-gray-100">
      <Navigation />
      
      <main className={`flex-1 ${isMobile ? 'pt-16' : 'ml-64'}`}>
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
