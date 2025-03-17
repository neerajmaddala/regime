
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { UserProfile, GoalType } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Loader2 } from 'lucide-react';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import GoalsForm from '@/components/profile/GoalsForm';
import { calculateNutritionValues } from '@/utils/profileCalculations';

interface ProfileEditProps {
  open: boolean;
  onClose: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ open, onClose }) => {
  const { profile, user, refreshProfile } = useAuth();
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (profile && open) {
      console.log("Setting form data to current profile:", profile);
      // Create a deep copy to avoid references
      setFormData(JSON.parse(JSON.stringify(profile)));
    }
  }, [profile, open]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      [name]: name === 'age' || name === 'weight' || name === 'height' ? Number(value) : value,
    }));
  };

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      goal: {
        ...prev!.goal,
        [name]: name === 'type' ? value : Number(value),
      },
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    if (field === 'goalType') {
      // When goal type changes, calculate new nutrition values
      const goalType = value as GoalType;
      const currentFormData = { ...formData! };
      
      // Calculate new nutrition values based on the goal type
      const newNutritionValues = calculateNutritionValues(goalType, currentFormData);
      
      // Update the form data with new goal type and calculated nutrition values
      setFormData({
        ...currentFormData,
        goal: {
          ...currentFormData.goal,
          type: goalType,
          ...newNutritionValues
        },
      });
      
      // Show toast notification about the update
      toast({
        title: "Nutrition plan updated",
        description: `Your nutrition plan has been adjusted for ${goalType.replace('-', ' ')}`,
      });
    } else if (field === 'gender') {
      setFormData((prev) => ({
        ...prev!,
        gender: value as 'male' | 'female' | 'other',
      }));
    } else if (field === 'activityLevel') {
      setFormData((prev) => ({
        ...prev!,
        activityLevel: value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error('User not authenticated');

      console.log('Updating profile with data:', formData);

      // Update profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: formData.name,
          gender: formData.gender,
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
          activity_level: formData.activityLevel,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (profileError) throw profileError;

      // Check if a goal exists
      const { data: existingGoal, error: checkError } = await supabase
        .from('user_goals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // Update or insert the goal
      const { error: goalError } = await supabase
        .from('user_goals')
        .upsert({
          id: existingGoal?.id || undefined,
          user_id: user.id,
          type: formData.goal.type,
          target_calories: formData.goal.targetCalories,
          target_protein: formData.goal.targetProtein,
          target_carbs: formData.goal.targetCarbs,
          target_fat: formData.goal.targetFat,
          target_water: formData.goal.targetWater,
          target_exercise_duration: formData.goal.targetExerciseDuration,
          updated_at: new Date().toISOString(),
        });

      if (goalError) throw goalError;

      toast({
        title: "Profile updated",
        description: "Your profile and goals have been updated successfully",
      });
      
      // Close the modal immediately after success
      onClose();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <PersonalInfoForm 
        formData={formData}
        handleChange={handleChange}
        handleSelectChange={handleSelectChange}
      />
      
      <GoalsForm 
        formData={formData}
        handleGoalChange={handleGoalChange}
        handleSelectChange={handleSelectChange}
      />
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" className="bg-regime-green text-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );

  return isMobile ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Profile & Goals</SheetTitle>
          <SheetDescription>
            Update your personal information and fitness goals
          </SheetDescription>
        </SheetHeader>
        {formContent}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile & Goals</DialogTitle>
          <DialogDescription>
            Update your personal information and fitness goals
          </DialogDescription>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEdit;
