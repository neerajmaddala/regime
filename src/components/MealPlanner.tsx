
import React, { useState } from 'react';
import Card from '@/components/common/Card';
import { Meal, MealItem, mealTypeIcons } from '@/lib/data';
import { Calendar, Plus, ChevronRight, X } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

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

const MealPlanner: React.FC<MealPlannerProps> = ({ meals }) => {
  const [currentMeal, setCurrentMeal] = useState<Meal | null>(null);
  const [addFoodDialogOpen, setAddFoodDialogOpen] = useState(false);
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

  const onSubmit = (values: AddFoodFormValues) => {
    if (!currentMeal) return;
    
    // Here you would typically send this data to your backend
    // For now we'll just show a toast notification
    toast.success(`Added ${values.name} to ${mealTypeLabels[currentMeal.type]}`);
    
    // Reset form and close dialog
    form.reset();
    setAddFoodDialogOpen(false);
  };

  return (
    <>
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
                        
                        <button 
                          className="mt-3 flex items-center text-sm font-medium text-regime-green hover:text-regime-green-dark transition-colors"
                          onClick={() => handleAddFoodClick(meal)}
                        >
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
    </>
  );
};

export default MealPlanner;
