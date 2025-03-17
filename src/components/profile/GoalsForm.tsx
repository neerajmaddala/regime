
import React from 'react';
import { UserProfile, GoalType } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GoalsFormProps {
  formData: UserProfile;
  handleGoalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string, field: string) => void;
}

const GoalsForm: React.FC<GoalsFormProps> = ({ 
  formData, 
  handleGoalChange, 
  handleSelectChange 
}) => {
  return (
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
  );
};

export default GoalsForm;
