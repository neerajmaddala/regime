
import { GoalType, UserProfile } from "@/lib/data";

// Function to calculate recommended nutrition values based on goal type
export const calculateNutritionValues = (goalType: GoalType, user: UserProfile) => {
  const { weight, height, age, gender, activityLevel } = user;
  
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Apply activity level multiplier
  let activityMultiplier;
  switch (activityLevel) {
    case 'sedentary':
      activityMultiplier = 1.2;
      break;
    case 'light':
      activityMultiplier = 1.375;
      break;
    case 'moderate':
      activityMultiplier = 1.55;
      break;
    case 'active':
      activityMultiplier = 1.725;
      break;
    case 'very-active':
      activityMultiplier = 1.9;
      break;
    default:
      activityMultiplier = 1.55; // Default to moderate
  }
  
  let maintenanceCalories = Math.round(bmr * activityMultiplier);
  let calories, protein, carbs, fat;
  
  // Adjust based on goal type
  switch (goalType) {
    case 'weight-loss':
      calories = Math.round(maintenanceCalories * 0.8); // 20% deficit
      protein = Math.round(weight * 2.2); // Higher protein for weight loss
      fat = Math.round((calories * 0.25) / 9); // 25% of calories from fat
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4); // Remainder from carbs
      break;
    case 'muscle-gain':
      calories = Math.round(maintenanceCalories * 1.1); // 10% surplus
      protein = Math.round(weight * 1.8); // High protein for muscle gain
      fat = Math.round((calories * 0.25) / 9); // 25% of calories from fat
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4); // Remainder from carbs
      break;
    case 'maintenance':
      calories = maintenanceCalories;
      protein = Math.round(weight * 1.6); // Moderate protein
      fat = Math.round((calories * 0.3) / 9); // 30% of calories from fat
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4); // Remainder from carbs
      break;
    case 'health':
      calories = maintenanceCalories;
      protein = Math.round(weight * 1.4); // Moderate protein
      fat = Math.round((calories * 0.3) / 9); // 30% of calories from fat
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4); // Remainder from carbs
      break;
    default:
      calories = maintenanceCalories;
      protein = Math.round(weight * 1.6);
      fat = Math.round((calories * 0.3) / 9);
      carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4);
  }
  
  // Calculate water intake based on weight (in ml)
  const water = Math.round(weight * 35); // 35ml per kg of body weight
  
  // Calculate exercise duration based on goal
  let exerciseDuration;
  switch (goalType) {
    case 'weight-loss':
      exerciseDuration = 60; // More exercise for weight loss
      break;
    case 'muscle-gain':
      exerciseDuration = 45; // Moderate exercise for muscle gain
      break;
    case 'maintenance':
      exerciseDuration = 30; // Standard exercise for maintenance
      break;
    case 'health':
      exerciseDuration = 45; // Moderate exercise for health
      break;
    default:
      exerciseDuration = 30;
  }
  
  // Ensure values are reasonable
  carbs = Math.max(50, carbs); // Minimum 50g carbs
  protein = Math.max(50, protein); // Minimum 50g protein
  fat = Math.max(30, fat); // Minimum 30g fat
  
  return {
    targetCalories: calories,
    targetProtein: protein,
    targetCarbs: carbs,
    targetFat: fat,
    targetWater: water,
    targetExerciseDuration: exerciseDuration
  };
};
