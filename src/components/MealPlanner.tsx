
import React, { useState } from 'react';
import Card from '@/components/common/Card';
import { Meal, MealItem, extendedFoodDatabase } from '@/lib/data';
import { Calendar, ChevronRight } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

// Import our new components
import NutritionSummary from './meal-planner/NutritionSummary';
import MealPlanView from './meal-planner/MealPlanView';
import FoodDatabaseView from './meal-planner/FoodDatabaseView';
import AddFoodDialog from './meal-planner/AddFoodDialog';
import DeleteFoodDialog from './meal-planner/DeleteFoodDialog';

interface MealPlannerProps {
  meals: Meal[];
}

interface AddFoodFormValues {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

const MealPlanner: React.FC<MealPlannerProps> = ({ meals: initialMeals }) => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{mealId: string, itemId: string} | null>(null);
  const [activeTab, setActiveTab] = useState('mealPlan');
  const [foodDatabase] = useState(extendedFoodDatabase);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const isMobile = useIsMobile();
  
  // Get all unique categories from the food database
  const foodCategories = Array.from(new Set(foodDatabase.map(item => item.category))).sort();

  // Filter food database based on search term and category
  const filteredFoodDatabase = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? food.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Calculate daily targets based on sample profile
  const dailyTargets = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  };

  // Calculate current nutrition from meals
  const calculateCurrentNutrition = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    
    meals.forEach(meal => {
      meal.items.forEach(item => {
        totalCalories += item.calories;
        totalProtein += item.protein;
        totalCarbs += item.carbs;
        totalFat += item.fat;
      });
    });
    
    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat)
    };
  };

  const currentNutrition = calculateCurrentNutrition();

  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack'
  };

  const handleAddFoodClick = (meal: Meal) => {
    setCurrentMeal(meal);
    setAddFoodDialogOpen(true);
  };

  const handleDeleteFoodClick = (mealId: string, itemId: string) => {
    setItemToDelete({ mealId, itemId });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFood = () => {
    if (!itemToDelete) return;
    
    // Update the meals state by filtering out the deleted item
    setMeals(currentMeals => 
      currentMeals.map(meal => {
        if (meal.id === itemToDelete.mealId) {
          return {
            ...meal,
            items: meal.items.filter(item => item.id !== itemToDelete.itemId),
            // Recalculate meal totals
            totalCalories: meal.items
              .filter(item => item.id !== itemToDelete.itemId)
              .reduce((sum, item) => sum + item.calories, 0),
            totalProtein: meal.items
              .filter(item => item.id !== itemToDelete.itemId)
              .reduce((sum, item) => sum + item.protein, 0),
            totalCarbs: meal.items
              .filter(item => item.id !== itemToDelete.itemId)
              .reduce((sum, item) => sum + item.carbs, 0),
            totalFat: meal.items
              .filter(item => item.id !== itemToDelete.itemId)
              .reduce((sum, item) => sum + item.fat, 0)
          };
        }
        return meal;
      })
    );
    
    toast({
      title: "Food item deleted",
      description: "The food item has been removed from your meal plan",
    });
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const onSubmit = (values: AddFoodFormValues) => {
    if (!currentMeal) return;
    
    // Create a new food item
    const newItem: MealItem = {
      id: `item-${Date.now()}`,
      name: values.name,
      calories: values.calories,
      protein: values.protein,
      carbs: values.carbs,
      fat: values.fat,
      portion: values.portion
    };
    
    // Update the meals state with the new item
    setMeals(currentMeals => 
      currentMeals.map(meal => {
        if (meal.id === currentMeal.id) {
          const updatedItems = [...meal.items, newItem];
          return {
            ...meal,
            items: updatedItems,
            // Recalculate meal totals
            totalCalories: updatedItems.reduce((sum, item) => sum + item.calories, 0),
            totalProtein: updatedItems.reduce((sum, item) => sum + item.protein, 0),
            totalCarbs: updatedItems.reduce((sum, item) => sum + item.carbs, 0),
            totalFat: updatedItems.reduce((sum, item) => sum + item.fat, 0)
          };
        }
        return meal;
      })
    );
    
    toast({
      title: "Food added",
      description: `Added ${values.name} to ${mealTypeLabels[currentMeal.type]}`,
    });
    
    // Close dialog
    setAddFoodDialogOpen(false);
  };

  const handleAddFromDatabase = (foodItem: any, mealId: string) => {
    // Find the meal to update
    const mealToUpdate = meals.find(meal => meal.id === mealId);
    if (!mealToUpdate) return;
    
    // Create a new food item from the database entry
    const newItem: MealItem = {
      id: `item-${Date.now()}`,
      name: foodItem.name,
      calories: foodItem.calories,
      protein: foodItem.protein,
      carbs: foodItem.carbs,
      fat: foodItem.fat,
      portion: foodItem.portion,
      image: foodItem.image
    };
    
    // Update the meals state with the new item
    setMeals(currentMeals => 
      currentMeals.map(meal => {
        if (meal.id === mealId) {
          const updatedItems = [...meal.items, newItem];
          return {
            ...meal,
            items: updatedItems,
            // Recalculate meal totals
            totalCalories: updatedItems.reduce((sum, item) => sum + item.calories, 0),
            totalProtein: updatedItems.reduce((sum, item) => sum + item.protein, 0),
            totalCarbs: updatedItems.reduce((sum, item) => sum + item.carbs, 0),
            totalFat: updatedItems.reduce((sum, item) => sum + item.fat, 0)
          };
        }
        return meal;
      })
    );
    
    toast({
      title: "Food added",
      description: `Added ${foodItem.name} to ${mealTypeLabels[mealToUpdate.type]}`,
    });
  };

  return (
    <>
      <AnimatedTransition type="slide-up" delay={200}>
        <Card variant="glass">
          <div className="flex flex-col">
            <h3 className="section-title">
              <Calendar className="section-title-icon" size={20} />
              Meal Planning
            </h3>
            
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
                
                <MealPlanView 
                  meals={meals}
                  onAddFoodClick={handleAddFoodClick}
                  onDeleteFoodClick={handleDeleteFoodClick}
                  onAddFromDatabase={handleAddFromDatabase}
                  foodDatabase={foodDatabase}
                />
              </TabsContent>
              
              <TabsContent value="foodDatabase">
                <FoodDatabaseView 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  foodCategories={foodCategories}
                  filteredFoodDatabase={filteredFoodDatabase}
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
        </Card>
      </AnimatedTransition>

      {/* Add Food Dialog */}
      <AddFoodDialog 
        open={addFoodDialogOpen}
        onOpenChange={setAddFoodDialogOpen}
        currentMealType={currentMeal?.type || null}
        onSubmit={onSubmit}
        isMobile={isMobile}
      />

      {/* Delete Food Confirmation Dialog */}
      <DeleteFoodDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteFood}
      />
    </>
  );
};

export default MealPlanner;
