
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';

const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentRoute = location.pathname.substring(1) || 'dashboard';
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-regime-dark text-gray-900 dark:text-gray-100">
      <Navigation activeRoute={currentRoute} />
      
      <main className={`flex-1 ${isMobile ? 'pt-16' : 'ml-64'}`}>
        <Dashboard activeSection={currentRoute} />
      </main>
    </div>
  );
};

export default Index;
