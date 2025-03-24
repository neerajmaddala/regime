
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Navigation from '@/components/Navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLocation } from 'react-router-dom';
import { MealPlannerProvider } from '@/contexts/MealPlannerContext';
import { mockDailyProgress } from '@/lib/data';

const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const currentRoute = location.pathname.substring(1) || 'dashboard';
  
  // Extract meals from mock data to initialize the MealPlannerProvider
  const initialMeals = mockDailyProgress.meals;
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-regime-dark text-gray-900 dark:text-gray-100">
      <Navigation activeRoute={currentRoute} />
      
      <main className={`flex-1 ${isMobile ? 'pt-16' : 'ml-64'}`}>
        <MealPlannerProvider initialMeals={initialMeals}>
          <Dashboard activeSection={currentRoute} />
        </MealPlannerProvider>
      </main>
    </div>
  );
};

export default Index;
