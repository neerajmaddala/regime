
import { 
  Apple, 
  Salad, 
  Coffee, 
  Utensils, 
  Dumbbell, 
  Running, 
  Heart, 
  Droplet, 
  BrainCircuit
} from 'lucide-react';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseCategory = 'cardio' | 'strength' | 'flexibility' | 'mind';
export type NutrientType = 'calories' | 'protein' | 'carbs' | 'fat';
export type GoalType = 'weight-loss' | 'muscle-gain' | 'maintenance' | 'health';

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion: string;
  image?: string;
}

export interface Meal {
  id: string;
  type: MealType;
  time: string;
  items: MealItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  duration: number;
  caloriesBurned: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  image?: string;
}

export interface WaterIntake {
  id: string;
  amount: number;
  timestamp: string;
}

export interface DailyProgress {
  date: string;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number;
  meals: Meal[];
  exercises: Exercise[];
  completedWaterIntakes: WaterIntake[];
}

export interface UserGoal {
  type: GoalType;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  targetWater: number;
  targetExerciseDuration: number;
}

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';
  goal: UserGoal;
}

// Mock data
export const mockMealItems: MealItem[] = [
  {
    id: '1',
    name: 'Greek Yogurt with Berries',
    calories: 150,
    protein: 15,
    carbs: 12,
    fat: 0.5,
    portion: '1 cup',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3'
  },
  {
    id: '2',
    name: 'Avocado Toast',
    calories: 290,
    protein: 10,
    carbs: 30,
    fat: 15,
    portion: '1 slice',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?ixlib=rb-4.0.3'
  },
  {
    id: '3',
    name: 'Grilled Chicken Salad',
    calories: 320,
    protein: 35,
    carbs: 10,
    fat: 14,
    portion: '1 bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3'
  },
  {
    id: '4',
    name: 'Salmon with Quinoa',
    calories: 450,
    protein: 40,
    carbs: 35,
    fat: 15,
    portion: '1 plate',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3'
  },
  {
    id: '5',
    name: 'Protein Smoothie',
    calories: 220,
    protein: 25,
    carbs: 20,
    fat: 3,
    portion: '1 glass',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90a0819?ixlib=rb-4.0.3'
  }
];

export const mockMeals: Meal[] = [
  {
    id: 'b1',
    type: 'breakfast',
    time: '08:00',
    items: [mockMealItems[0], mockMealItems[1]],
    totalCalories: 440,
    totalProtein: 25,
    totalCarbs: 42,
    totalFat: 15.5
  },
  {
    id: 'l1',
    type: 'lunch',
    time: '13:00',
    items: [mockMealItems[2]],
    totalCalories: 320,
    totalProtein: 35,
    totalCarbs: 10,
    totalFat: 14
  },
  {
    id: 'd1',
    type: 'dinner',
    time: '19:00',
    items: [mockMealItems[3]],
    totalCalories: 450,
    totalProtein: 40,
    totalCarbs: 35,
    totalFat: 15
  },
  {
    id: 's1',
    type: 'snack',
    time: '16:00',
    items: [mockMealItems[4]],
    totalCalories: 220,
    totalProtein: 25,
    totalCarbs: 20,
    totalFat: 3
  }
];

export const mockExercises: Exercise[] = [
  {
    id: 'e1',
    name: 'Morning Run',
    description: 'Moderate pace running on flat terrain',
    category: 'cardio',
    duration: 30,
    caloriesBurned: 300,
    difficulty: 'intermediate',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?ixlib=rb-4.0.3'
  },
  {
    id: 'e2',
    name: 'Bodyweight Workout',
    description: 'Push-ups, squats, lunges, and planks',
    category: 'strength',
    duration: 45,
    caloriesBurned: 350,
    difficulty: 'intermediate',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3'
  },
  {
    id: 'e3',
    name: 'Yoga Flow',
    description: 'Gentle yoga focusing on flexibility and balance',
    category: 'flexibility',
    duration: 60,
    caloriesBurned: 200,
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3'
  },
  {
    id: 'e4',
    name: 'Guided Meditation',
    description: 'Stress reduction and mindfulness practice',
    category: 'mind',
    duration: 15,
    caloriesBurned: 20,
    difficulty: 'beginner',
    image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?ixlib=rb-4.0.3'
  }
];

export const mockWaterIntakes: WaterIntake[] = [
  { id: 'w1', amount: 250, timestamp: '08:30' },
  { id: 'w2', amount: 250, timestamp: '10:45' },
  { id: 'w3', amount: 500, timestamp: '13:15' },
  { id: 'w4', amount: 250, timestamp: '16:30' },
  { id: 'w5', amount: 250, timestamp: '19:30' }
];

export const mockDailyProgress: DailyProgress = {
  date: new Date().toISOString().split('T')[0],
  caloriesConsumed: 1430,
  caloriesBurned: 670,
  waterIntake: 1500,
  meals: mockMeals,
  exercises: [mockExercises[0], mockExercises[1]],
  completedWaterIntakes: mockWaterIntakes
};

export const mockUserProfile: UserProfile = {
  name: 'Alex Johnson',
  age: 32,
  weight: 75,
  height: 178,
  gender: 'male',
  activityLevel: 'moderate',
  goal: {
    type: 'weight-loss',
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFat: 55,
    targetWater: 2500,
    targetExerciseDuration: 45
  }
};

export const mockWeeklyProgressData = [
  { day: 'Mon', calories: 1850, target: 2000, water: 2200, exercise: 40 },
  { day: 'Tue', calories: 1920, target: 2000, water: 2400, exercise: 60 },
  { day: 'Wed', calories: 2050, target: 2000, water: 2100, exercise: 30 },
  { day: 'Thu', calories: 1750, target: 2000, water: 2300, exercise: 45 },
  { day: 'Fri', calories: 1430, target: 2000, water: 1500, exercise: 35 },
  { day: 'Sat', calories: 0, target: 2000, water: 0, exercise: 0 },
  { day: 'Sun', calories: 0, target: 2000, water: 0, exercise: 0 }
];

export const mealTypeIcons = {
  breakfast: Coffee,
  lunch: Utensils,
  dinner: Utensils,
  snack: Apple
};

export const exerciseCategoryIcons = {
  cardio: Running,
  strength: Dumbbell,
  flexibility: Heart,
  mind: BrainCircuit
};
