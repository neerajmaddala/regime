
import React from 'react';
import Card from '@/components/common/Card';
import { Meal, MealItem, mealTypeIcons } from '@/lib/data';
import { Calendar, Plus, ChevronRight } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';

interface MealPlannerProps {
  meals: Meal[];
}

const MealPlanner: React.FC<MealPlannerProps> = ({ meals }) => {
  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack'
  };

  return (
    <AnimatedTransition type="slide-up" delay={200}>
      <Card variant="glass">
        <div className="flex flex-col">
          <h3 className="section-title">
            <Calendar className="section-title-icon" size={20} />
            Today's Meals
          </h3>
          
          <div className="mt-4 space-y-6">
            {meals.map((meal, index) => {
              const MealIcon = mealTypeIcons[meal.type];
              
              return (
                <AnimatedTransition key={meal.id} type="fade" delay={100 + (index * 50)}>
                  <div className="bg-white dark:bg-regime-dark-light rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                    <div className="p-4 bg-gray-50 dark:bg-regime-dark-lighter border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-regime-green/20 flex items-center justify-center mr-3">
                          <MealIcon size={16} className="text-regime-green-dark" />
                        </div>
                        <div>
                          <h4 className="font-medium">{mealTypeLabels[meal.type]}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{meal.time}</p>
                        </div>
                      </div>
                      
                      <div className="text-left sm:text-right">
                        <p className="font-medium">{meal.totalCalories} cal</p>
                        <div className="flex space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>P: {meal.totalProtein}g</span>
                          <span>C: {meal.totalCarbs}g</span>
                          <span>F: {meal.totalFat}g</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      {meal.items.map((item, itemIndex) => (
                        <div key={item.id} className={`flex flex-col sm:flex-row sm:items-center py-3 ${itemIndex !== meal.items.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}>
                          {item.image ? (
                            <div className="w-12 h-12 rounded-md overflow-hidden mb-2 sm:mb-0 sm:mr-3">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2 sm:mb-0 sm:mr-3">
                              <MealIcon size={20} className="text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1 mb-2 sm:mb-0">
                            <h5 className="font-medium">{item.name}</h5>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.portion}</p>
                          </div>
                          
                          <div className="text-left sm:text-right">
                            <p className="font-medium">{item.calories} cal</p>
                            <div className="flex space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>P: {item.protein}g</span>
                              <span>C: {item.carbs}g</span>
                              <span>F: {item.fat}g</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <button className="mt-3 flex items-center text-sm font-medium text-regime-green hover:text-regime-green-dark transition-colors">
                        <Plus size={16} className="mr-1" /> Add food
                      </button>
                    </div>
                  </div>
                </AnimatedTransition>
              );
            })}
          </div>
          
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
      </Card>
    </AnimatedTransition>
  );
};

export default MealPlanner;
