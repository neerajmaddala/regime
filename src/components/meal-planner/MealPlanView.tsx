
import React from 'react';
import { Meal, MealItem, mealTypeIcons } from '@/lib/data';
import { Trash2, Plus } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';

interface MealPlanViewProps {
  meals: Meal[];
  onAddFoodClick: (meal: Meal) => void;
  onDeleteFoodClick: (mealId: string, itemId: string) => void;
  onAddFromDatabase: (foodItem: any, mealId: string) => void;
  foodDatabase: any[];
}

const mealTypeLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

const MealPlanView: React.FC<MealPlanViewProps> = ({ 
  meals, 
  onAddFoodClick, 
  onDeleteFoodClick,
  onAddFromDatabase,
  foodDatabase
}) => {
  return (
    <div className="space-y-6">
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
                    
                    <div className="text-left sm:text-right flex flex-row items-center justify-between sm:block">
                      <div>
                        <p className="font-medium">{item.calories} cal</p>
                        <div className="flex space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <span>P: {item.protein}g</span>
                          <span>C: {item.carbs}g</span>
                          <span>F: {item.fat}g</span>
                        </div>
                      </div>
                      
                      <button 
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 sm:mt-1"
                        onClick={() => onDeleteFoodClick(meal.id, item.id)}
                        aria-label="Delete food item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <button 
                    className="flex items-center text-sm font-medium text-regime-green hover:text-regime-green-dark transition-colors"
                    onClick={() => onAddFoodClick(meal)}
                  >
                    <Plus size={16} className="mr-1" /> Add custom food
                  </button>
                  
                  <div className="relative inline-block text-left">
                    <select 
                      className="text-sm text-regime-green font-medium bg-transparent border border-regime-green/30 rounded px-2 py-1"
                      onChange={(e) => {
                        const foodId = e.target.value;
                        if (foodId) {
                          const food = foodDatabase.find(f => f.id === foodId);
                          if (food) {
                            onAddFromDatabase(food, meal.id);
                          }
                          e.target.value = ""; // Reset select after selection
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Select from database</option>
                      {foodDatabase.map(food => (
                        <option key={food.id} value={food.id}>{food.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        );
      })}
    </div>
  );
};

export default MealPlanView;
