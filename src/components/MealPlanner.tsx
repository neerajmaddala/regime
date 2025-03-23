
import React from 'react';
import Card from '@/components/common/Card';
import { Meal } from '@/lib/data';
import { Calendar } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import { useIsMobile } from '@/hooks/use-mobile';
import { MealPlannerProvider, useMealPlanner } from '@/contexts/MealPlannerContext';
import MealPlannerContent from '@/components/meal-planner/MealPlannerContent';
import AddFoodDialog from '@/components/meal-planner/AddFoodDialog';
import DeleteFoodDialog from '@/components/meal-planner/DeleteFoodDialog';

interface MealPlannerProps {
  meals: Meal[];
}

const MealPlanner: React.FC<MealPlannerProps> = ({ meals: initialMeals }) => {
  const isMobile = useIsMobile();
  
  return (
    <MealPlannerProvider initialMeals={initialMeals}>
      <AnimatedTransition type="slide-up" delay={200}>
        <Card variant="glass">
          <div className="flex flex-col">
            <h3 className="section-title">
              <Calendar className="section-title-icon" size={20} />
              Meal Planning
            </h3>
            
            <MealPlannerContent />
          </div>
        </Card>
      </AnimatedTransition>

      <MealPlannerDialogs isMobile={isMobile} />
    </MealPlannerProvider>
  );
};

const MealPlannerDialogs: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { 
    addFoodDialogOpen, 
    setAddFoodDialogOpen, 
    currentMeal, 
    deleteDialogOpen, 
    setDeleteDialogOpen, 
    confirmDeleteFood, 
    onSubmit 
  } = useMealPlanner();

  return (
    <>
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
