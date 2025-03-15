import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile, GoalType } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

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
    if (profile) {
      setFormData({ ...profile });
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
      setFormData((prev) => ({
        ...prev!,
        goal: {
          ...prev!.goal,
          type: value as GoalType,
        },
      }));
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

      // Refresh the profile data immediately after successful update
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile and goals have been updated successfully",
      });
      
      onClose();
    } catch (error) {
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

  const modalContent = (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Personal Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange(value, 'gender')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              min={1}
              max={120}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleChange}
              min={20}
              max={300}
              step={0.1}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              name="height"
              type="number"
              value={formData.height}
              onChange={handleChange}
              min={50}
              max={250}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => handleSelectChange(value, 'activityLevel')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="very-active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your Goals</h3>
        <div className="space-y-2">
          <Label htmlFor="goalType">Goal Type</Label>
          <Select
            value={formData.goal.type}
            onValueChange={(value) => handleSelectChange(value, 'goalType')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select goal type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight-loss">Weight Loss</SelectItem>
              <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="health">Overall Health</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="targetCalories">Daily Calories</Label>
            <Input
              id="targetCalories"
              name="targetCalories"
              type="number"
              value={formData.goal.targetCalories}
              onChange={handleGoalChange}
              min={500}
              max={5000}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetProtein">Protein (g)</Label>
            <Input
              id="targetProtein"
              name="targetProtein"
              type="number"
              value={formData.goal.targetProtein}
              onChange={handleGoalChange}
              min={10}
              max={400}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetCarbs">Carbs (g)</Label>
            <Input
              id="targetCarbs"
              name="targetCarbs"
              type="number"
              value={formData.goal.targetCarbs}
              onChange={handleGoalChange}
              min={10}
              max={600}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetFat">Fat (g)</Label>
            <Input
              id="targetFat"
              name="targetFat"
              type="number"
              value={formData.goal.targetFat}
              onChange={handleGoalChange}
              min={10}
              max={200}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetWater">Water (ml)</Label>
            <Input
              id="targetWater"
              name="targetWater"
              type="number"
              value={formData.goal.targetWater}
              onChange={handleGoalChange}
              min={500}
              max={5000}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="targetExerciseDuration">Exercise (min/day)</Label>
            <Input
              id="targetExerciseDuration"
              name="targetExerciseDuration"
              type="number"
              value={formData.goal.targetExerciseDuration}
              onChange={handleGoalChange}
              min={0}
              max={240}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" className="bg-regime-green text-white" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
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
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange(value, 'gender')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  min={1}
                  max={120}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  min={20}
                  max={300}
                  step={0.1}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  min={50}
                  max={250}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => handleSelectChange(value, 'activityLevel')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="very-active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Goals</h3>
            <div className="space-y-2">
              <Label htmlFor="goalType">Goal Type</Label>
              <Select
                value={formData.goal.type}
                onValueChange={(value) => handleSelectChange(value, 'goalType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="health">Overall Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetCalories">Daily Calories</Label>
                <Input
                  id="targetCalories"
                  name="targetCalories"
                  type="number"
                  value={formData.goal.targetCalories}
                  onChange={handleGoalChange}
                  min={500}
                  max={5000}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetProtein">Protein (g)</Label>
                <Input
                  id="targetProtein"
                  name="targetProtein"
                  type="number"
                  value={formData.goal.targetProtein}
                  onChange={handleGoalChange}
                  min={10}
                  max={400}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetCarbs">Carbs (g)</Label>
                <Input
                  id="targetCarbs"
                  name="targetCarbs"
                  type="number"
                  value={formData.goal.targetCarbs}
                  onChange={handleGoalChange}
                  min={10}
                  max={600}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetFat">Fat (g)</Label>
                <Input
                  id="targetFat"
                  name="targetFat"
                  type="number"
                  value={formData.goal.targetFat}
                  onChange={handleGoalChange}
                  min={10}
                  max={200}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetWater">Water (ml)</Label>
                <Input
                  id="targetWater"
                  name="targetWater"
                  type="number"
                  value={formData.goal.targetWater}
                  onChange={handleGoalChange}
                  min={500}
                  max={5000}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetExerciseDuration">Exercise (min/day)</Label>
                <Input
                  id="targetExerciseDuration"
                  name="targetExerciseDuration"
                  type="number"
                  value={formData.goal.targetExerciseDuration}
                  onChange={handleGoalChange}
                  min={0}
                  max={240}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-regime-green text-white" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange(value, 'gender')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  min={1}
                  max={120}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  min={20}
                  max={300}
                  step={0.1}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                  min={50}
                  max={250}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => handleSelectChange(value, 'activityLevel')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="very-active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Your Goals</h3>
            <div className="space-y-2">
              <Label htmlFor="goalType">Goal Type</Label>
              <Select
                value={formData.goal.type}
                onValueChange={(value) => handleSelectChange(value, 'goalType')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select goal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight-loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="health">Overall Health</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetCalories">Daily Calories</Label>
                <Input
                  id="targetCalories"
                  name="targetCalories"
                  type="number"
                  value={formData.goal.targetCalories}
                  onChange={handleGoalChange}
                  min={500}
                  max={5000}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetProtein">Protein (g)</Label>
                <Input
                  id="targetProtein"
                  name="targetProtein"
                  type="number"
                  value={formData.goal.targetProtein}
                  onChange={handleGoalChange}
                  min={10}
                  max={400}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetCarbs">Carbs (g)</Label>
                <Input
                  id="targetCarbs"
                  name="targetCarbs"
                  type="number"
                  value={formData.goal.targetCarbs}
                  onChange={handleGoalChange}
                  min={10}
                  max={600}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetFat">Fat (g)</Label>
                <Input
                  id="targetFat"
                  name="targetFat"
                  type="number"
                  value={formData.goal.targetFat}
                  onChange={handleGoalChange}
                  min={10}
                  max={200}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetWater">Water (ml)</Label>
                <Input
                  id="targetWater"
                  name="targetWater"
                  type="number"
                  value={formData.goal.targetWater}
                  onChange={handleGoalChange}
                  min={500}
                  max={5000}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetExerciseDuration">Exercise (min/day)</Label>
                <Input
                  id="targetExerciseDuration"
                  name="targetExerciseDuration"
                  type="number"
                  value={formData.goal.targetExerciseDuration}
                  onChange={handleGoalChange}
                  min={0}
                  max={240}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-regime-green text-white" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEdit;
