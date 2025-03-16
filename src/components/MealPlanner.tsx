
import React, { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import { Meal, MealItem, mealTypeIcons } from '@/lib/data';
import { Calendar, Plus, ChevronRight, X, Trash2, PlusCircle, Info } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [foodDatabase, setFoodDatabase] = useState([
    { id: '1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, portion: '1 medium' },
    { id: '2', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: '100g' },
    { id: '3', name: 'Brown Rice', calories: 215, protein: 5, carbs: 45, fat: 1.8, portion: '1 cup cooked' },
    { id: '4', name: 'Avocado', calories: 234, protein: 2.9, carbs: 12.5, fat: 21, portion: '1 medium' },
    { id: '5', name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 13, portion: '100g' },
    { id: '6', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, portion: '1 cup' },
    { id: '7', name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.4, portion: '100g' },
    { id: '8', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, portion: '1/4 cup' },
    { id: '9', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, portion: '1 medium' },
    { id: '10', name: 'Egg', calories: 68, protein: 5.5, carbs: 0.6, fat: 4.8, portion: '1 large' },
  ]);
  
  const isMobile = useIsMobile();
  
  const form = useForm<AddFoodFormValues>({
    defaultValues: {
      name: '',
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      portion: '1 serving'
    }
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
  const remainingNutrition = {
    calories: dailyTargets.calories - currentNutrition.calories,
    protein: dailyTargets.protein - currentNutrition.protein,
    carbs: dailyTargets.carbs - currentNutrition.carbs,
    fat: dailyTargets.fat - currentNutrition.fat
  };

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
    
    // Reset form and close dialog
    form.reset();
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
      portion: foodItem.portion
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
                <div className="bg-white dark:bg-regime-dark-light rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
                  <h2 className="text-lg font-semibold mb-2">Daily Nutrition Summary</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
                      <div className="text-xl font-bold">{currentNutrition.calories} / {dailyTargets.calories}</div>
                      <div className={`text-sm ${remainingNutrition.calories >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {remainingNutrition.calories >= 0 ? `${remainingNutrition.calories} remaining` : `${Math.abs(remainingNutrition.calories)} over`}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Protein (g)</div>
                      <div className="text-xl font-bold">{currentNutrition.protein} / {dailyTargets.protein}</div>
                      <div className={`text-sm ${remainingNutrition.protein >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {remainingNutrition.protein >= 0 ? `${remainingNutrition.protein} remaining` : `${Math.abs(remainingNutrition.protein)} over`}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Carbs (g)</div>
                      <div className="text-xl font-bold">{currentNutrition.carbs} / {dailyTargets.carbs}</div>
                      <div className={`text-sm ${remainingNutrition.carbs >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {remainingNutrition.carbs >= 0 ? `${remainingNutrition.carbs} remaining` : `${Math.abs(remainingNutrition.carbs)} over`}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Fat (g)</div>
                      <div className="text-xl font-bold">{currentNutrition.fat} / {dailyTargets.fat}</div>
                      <div className={`text-sm ${remainingNutrition.fat >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {remainingNutrition.fat >= 0 ? `${remainingNutrition.fat} remaining` : `${Math.abs(remainingNutrition.fat)} over`}
                      </div>
                    </div>
                  </div>
                </div>
                
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
                                    onClick={() => handleDeleteFoodClick(meal.id, item.id)}
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
                                onClick={() => handleAddFoodClick(meal)}
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
                                        handleAddFromDatabase(food, meal.id);
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
              </TabsContent>
              
              <TabsContent value="foodDatabase">
                <div className="bg-white dark:bg-regime-dark-light rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="p-4">
                    <h4 className="font-medium mb-4 flex items-center gap-2">
                      <Info size={16} className="text-regime-green" />
                      Food Database
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calories</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Protein</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Carbs</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fat</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Portion</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-regime-dark-light divide-y divide-gray-200 dark:divide-gray-700">
                          {foodDatabase.map((food) => (
                            <tr key={food.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{food.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{food.calories}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{food.protein}g</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{food.carbs}g</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{food.fat}g</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{food.portion}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
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
      <Dialog open={addFoodDialogOpen} onOpenChange={setAddFoodDialogOpen}>
        <DialogContent className={`sm:max-w-[425px] ${isMobile ? 'p-4' : ''}`}>
          <DialogHeader>
            <DialogTitle>Add Food to {currentMeal ? mealTypeLabels[currentMeal.type] : 'Meal'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Food Name</label>
              <Input
                id="name"
                placeholder="e.g., Greek Yogurt"
                {...form.register('name', { required: true })}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="calories" className="text-sm font-medium">Calories</label>
                <Input
                  id="calories"
                  type="number" 
                  placeholder="0"
                  {...form.register('calories', { 
                    required: true,
                    valueAsNumber: true 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="portion" className="text-sm font-medium">Portion</label>
                <Input
                  id="portion"
                  placeholder="e.g., 1 cup"
                  {...form.register('portion', { required: true })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="protein" className="text-sm font-medium">Protein (g)</label>
                <Input
                  id="protein"
                  type="number" 
                  placeholder="0"
                  {...form.register('protein', { 
                    required: true,
                    valueAsNumber: true 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="carbs" className="text-sm font-medium">Carbs (g)</label>
                <Input
                  id="carbs"
                  type="number" 
                  placeholder="0"
                  {...form.register('carbs', { 
                    required: true,
                    valueAsNumber: true 
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="fat" className="text-sm font-medium">Fat (g)</label>
                <Input
                  id="fat"
                  type="number" 
                  placeholder="0"
                  {...form.register('fat', { 
                    required: true,
                    valueAsNumber: true 
                  })}
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setAddFoodDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Food</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Food Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Food Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this food item from your meal plan?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteFood} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MealPlanner;
