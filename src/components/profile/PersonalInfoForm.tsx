
import React from 'react';
import { UserProfile } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PersonalInfoFormProps {
  formData: UserProfile;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string, field: string) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ 
  formData, 
  handleChange, 
  handleSelectChange 
}) => {
  return (
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
  );
};

export default PersonalInfoForm;
