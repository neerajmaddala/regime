
import React from 'react';
import { useMealPlanner } from '@/contexts/MealPlannerContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';
import NutritionSummary from './NutritionSummary';
import MealPlanView from './MealPlanView';
import FoodDatabaseView from './FoodDatabaseView';

const MealPlannerContent: React.FC = () => {
  const {
    meals,
    activeTab,
    setActiveTab,
    foodDatabase,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    handleAddFoodClick,
    handleDeleteFoodClick,
    handleAddFromDatabase,
    foodCategories,
    mealTypeLabels,
    dailyTargets,
    currentNutrition
  } = useMealPlanner();

  return (
    <div className="flex flex-col">
      <Tabs defaultValue="mealPlan" className="mt-4" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="mealPlan">Meal Plan</TabsTrigger>
          <TabsTrigger value="foodDatabase">Food Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mealPlan" className="space-y-4">
          {/* Nutrition Summary - Always visible */}
          <NutritionSummary 
            currentNutrition={currentNutrition} 
            dailyTargets={dailyTargets} 
          />
          
          <MealPlanView />
        </TabsContent>
        
        <TabsContent value="foodDatabase">
          <FoodDatabaseView 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            foodCategories={foodCategories}
            filteredFoodDatabase={foodDatabase.filter(food => {
              const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesCategory = selectedCategory ? food.category === selectedCategory : true;
              return matchesSearch && matchesCategory;
            })}
            meals={meals}
            onAddFromDatabase={handleAddFromDatabase}
            mealTypeLabels={mealTypeLabels}
          />
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <p className="text-lg font-semibold">Weekly Meal Plan</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Plan your meals for the entire week</p>
        </div>
        <button className="btn-regime flex items-center justify-center">
          <span>View plan</span>
          <ChevronRight size={18} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default MealPlannerContent;
