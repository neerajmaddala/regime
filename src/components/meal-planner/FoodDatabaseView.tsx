
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Info } from 'lucide-react';

interface FoodDatabaseViewProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  foodCategories: string[];
  filteredFoodDatabase: any[];
  meals: any[];
  onAddFromDatabase: (foodItem: any, mealId: string) => void;
  mealTypeLabels: Record<string, string>;
}

const FoodDatabaseView: React.FC<FoodDatabaseViewProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  foodCategories,
  filteredFoodDatabase,
  meals,
  onAddFromDatabase,
  mealTypeLabels
}) => {
  return (
    <div className="bg-white dark:bg-regime-dark-light rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="p-4">
        <h4 className="font-medium mb-4 flex items-center gap-2">
          <Info size={16} className="text-regime-green" />
          Food Database
        </h4>
        
        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search foods..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="md:w-1/3">
            <select 
              className="w-full p-2 rounded border border-gray-200 dark:border-gray-700 focus:ring focus:ring-regime-green focus:ring-opacity-50"
              value={selectedCategory || ''}
              onChange={(e) => onCategoryChange(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {foodCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Food grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoodDatabase.map(food => (
            <div key={food.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-36 overflow-hidden bg-gray-100">
                {food.image ? (
                  <img 
                    src={food.image} 
                    alt={food.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <Info size={24} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-lg">{food.name}</h5>
                    <p className="text-xs text-gray-500">{food.portion}</p>
                  </div>
                  <span className="px-2 py-1 bg-regime-green-light text-regime-green-dark rounded text-xs">
                    {food.category}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>{food.calories} cal</span>
                  <div className="flex space-x-2 text-xs text-gray-500">
                    <span>P: {food.protein}g</span>
                    <span>C: {food.carbs}g</span>
                    <span>F: {food.fat}g</span>
                  </div>
                </div>
                <div className="mt-3">
                  <select 
                    className="w-full p-1.5 text-sm border rounded focus:ring focus:ring-regime-green focus:ring-opacity-50"
                    onChange={(e) => {
                      const mealId = e.target.value;
                      if (mealId) {
                        onAddFromDatabase(food, mealId);
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Add to meal...</option>
                    {meals.map(meal => (
                      <option key={meal.id} value={meal.id}>
                        {mealTypeLabels[meal.type]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredFoodDatabase.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No foods found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDatabaseView;
