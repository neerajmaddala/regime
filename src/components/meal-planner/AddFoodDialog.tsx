
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MealType } from '@/lib/data';

interface AddFoodFormValues {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
}

interface AddFoodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentMealType: MealType | null;
  onSubmit: (values: AddFoodFormValues) => void;
  isMobile: boolean;
}

const mealTypeLabels = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack'
};

const AddFoodDialog: React.FC<AddFoodDialogProps> = ({
  open,
  onOpenChange,
  currentMealType,
  onSubmit,
  isMobile
}) => {
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

  const handleSubmit = (values: AddFoodFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] ${isMobile ? 'p-4' : ''}`}>
        <DialogHeader>
          <DialogTitle>Add Food to {currentMealType ? mealTypeLabels[currentMealType] : 'Meal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Food</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFoodDialog;
