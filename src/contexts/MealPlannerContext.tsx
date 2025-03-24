
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Meal, MealItem, extendedFoodDatabase } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

interface MealPlannerContextType {
  meals: Meal[];
  setMeals: React.Dispatch<React.SetStateAction<Meal[]>>;
  currentMeal: Meal | null;
  setCurrentMeal: React.Dispatch<React.SetStateAction<Meal | null>>;
  addFoodDialogOpen: boolean;
  setAddFoodDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemToDelete: {mealId: string, itemId: string} | null;
  setItemToDelete: React.Dispatch<React.SetStateAction<{mealId: string, itemId: string} | null>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  foodDatabase: typeof extendedFoodDatabase;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  handleAddFoodClick: (meal: Meal) => void;
  handleDeleteFoodClick: (mealId: string, itemId: string) => void;
  confirmDeleteFood: () => void;
  onSubmit: (values: AddFoodFormValues) => void;
  handleAddFromDatabase: (foodItem: any, mealId: string) => void;
  foodCategories: string[];
  mealTypeLabels: Record<string, string>;
  dailyTargets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  currentNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface AddFoodFormValues {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

const MealPlannerContext = createContext<MealPlannerContextType | undefined>(undefined);

export const useMealPlanner = () => {
  const context = useContext(MealPlannerContext);
  if (context === undefined) {
    throw new Error('useMealPlanner must be used within a MealPlannerProvider');
  }
  return context;
};

export const MealPlannerProvider: React.FC<{
  children: React.ReactNode;
  initialMeals: Meal[];
}> = ({ children, initialMeals }) => {
  const [meals, setMeals] = useState<Meal[]>(initialMeals);
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{mealId: string, itemId: string} | null>(null);
  const [activeTab, setActiveTab] = useState('mealPlan');
  const [foodDatabase] = useState(extendedFoodDatabase);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentNutrition, setCurrentNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // Get all unique categories from the food database
  const foodCategories = Array.from(new Set(foodDatabase.map(item => item.category))).sort();

  // Calculate daily targets based on sample profile
  const dailyTargets = {
    calories: 2000,
    protein: 150,
    carbs: 200,
    fat: 65
  };

  const mealTypeLabels = {
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack'
  };

  // Calculate current nutrition from meals whenever meals change
  useEffect(() => {
    calculateCurrentNutrition();
  }, [meals]);

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
    
    setCurrentNutrition({
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein),
      carbs: Math.round(totalCarbs),
      fat: Math.round(totalFat)
    });
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
          // Filter out the deleted item
          const updatedItems = meal.items.filter(item => item.id !== itemToDelete.itemId);
          
          // Recalculate meal totals
          const totalCalories = updatedItems.reduce((sum, item) => sum + item.calories, 0);
          const totalProtein = updatedItems.reduce((sum, item) => sum + item.protein, 0);
          const totalCarbs = updatedItems.reduce((sum, item) => sum + item.carbs, 0);
          const totalFat = updatedItems.reduce((sum, item) => sum + item.fat, 0);
          
          return {
            ...meal,
            items: updatedItems,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat
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
          // Recalculate meal totals
          const totalCalories = updatedItems.reduce((sum, item) => sum + item.calories, 0);
          const totalProtein = updatedItems.reduce((sum, item) => sum + item.protein, 0);
          const totalCarbs = updatedItems.reduce((sum, item) => sum + item.carbs, 0);
          const totalFat = updatedItems.reduce((sum, item) => sum + item.fat, 0);
          
          return {
            ...meal,
            items: updatedItems,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat
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
          // Recalculate meal totals
          const totalCalories = updatedItems.reduce((sum, item) => sum + item.calories, 0);
          const totalProtein = updatedItems.reduce((sum, item) => sum + item.protein, 0);
          const totalCarbs = updatedItems.reduce((sum, item) => sum + item.carbs, 0);
          const totalFat = updatedItems.reduce((sum, item) => sum + item.fat, 0);
          
          return {
            ...meal,
            items: updatedItems,
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat
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

  const value = {
    meals,
    setMeals,
    currentMeal,
    setCurrentMeal,
    addFoodDialogOpen,
    setAddFoodDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    itemToDelete,
    setItemToDelete,
    activeTab,
    setActiveTab,
    foodDatabase,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    handleAddFoodClick,
    handleDeleteFoodClick,
    confirmDeleteFood,
    onSubmit,
    handleAddFromDatabase,
    foodCategories,
    mealTypeLabels,
    dailyTargets,
    currentNutrition
  };

  return (
    <MealPlannerContext.Provider value={value}>
      {children}
    </MealPlannerContext.Provider>
  );
};
