
import { 
  Apple, 
  Salad, 
  Coffee, 
  Utensils, 
  Dumbbell, 
  ActivitySquare, 
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
  cardio: ActivitySquare,
  strength: Dumbbell,
  flexibility: Heart,
  mind: BrainCircuit
};

// Extended food database with images based on the nutritional data provided
export const extendedFoodDatabase = [
  // Common foods
  { id: '101', name: 'Bajra', calories: 361, protein: 12, carbs: 67, fat: 5, portion: '100g', category: 'Grains', image: '/lovable-uploads/97a063a6-8824-4db4-a070-fd0771762524.png' },
  { id: '102', name: 'Barley', calories: 336, protein: 11, carbs: 70, fat: 1, portion: '100g', category: 'Grains', image: '/lovable-uploads/8fa834d6-ff36-4d34-8534-8a56a3ad5c13.png' },
  { id: '103', name: 'Italian Millet', calories: 331, protein: 12, carbs: 61, fat: 4, portion: '100g', category: 'Grains', image: '/lovable-uploads/bdbd2045-328d-419f-a115-d0ee27826914.png' },
  { id: '104', name: 'Jowar', calories: 349, protein: 10, carbs: 73, fat: 2, portion: '100g', category: 'Grains', image: '/lovable-uploads/cb59d8b3-85ad-4320-b26c-61c71d38b9fc.png' },
  { id: '105', name: 'Maize (Dry)', calories: 342, protein: 11, carbs: 66, fat: 4, portion: '100g', category: 'Grains', image: '/lovable-uploads/7139372c-7e0e-4165-842d-6d331343c156.png' },
  
  // Pulses and Legumes
  { id: '201', name: 'Bengal Gram', calories: 360, protein: 17, carbs: 61, fat: 5, portion: '100g', category: 'Legumes', image: '/lovable-uploads/6c9516b0-2671-4e7b-b90c-9eb26f712cb7.png' },
  { id: '202', name: 'Red Lentils', calories: 343, protein: 25, carbs: 59, fat: 1, portion: '100g', category: 'Legumes', image: '/lovable-uploads/84e4f01b-cd63-4be2-9d59-84fd1f2d6cbd.png' },
  { id: '203', name: 'Green Gram', calories: 348, protein: 24, carbs: 60, fat: 1, portion: '100g', category: 'Legumes', image: '/lovable-uploads/a7af9732-3555-4997-ba57-5a8838439a48.png' },
  { id: '204', name: 'Soybean', calories: 432, protein: 43, carbs: 21, fat: 19, portion: '100g', category: 'Legumes', image: '/lovable-uploads/68e9c756-02c8-4f94-93be-695c9e0b5005.png' },
  
  // Vegetables
  { id: '301', name: 'Spinach', calories: 26, protein: 2, carbs: 3, fat: 1, portion: '100g', category: 'Vegetables', image: '/lovable-uploads/c013b8ec-7817-4e3a-88b5-0f191ae85578.png' },
  { id: '302', name: 'Carrot', calories: 48, protein: 1, carbs: 11, fat: 0, portion: '100g', category: 'Vegetables', image: '/lovable-uploads/084eb706-19a7-4f9f-a34d-44bcbc3addd5.png' },
  { id: '303', name: 'Tomato', calories: 23, protein: 2, carbs: 4, fat: 1, portion: '100g', category: 'Vegetables', image: '/lovable-uploads/00ef612a-e9b8-4f56-91e0-a76f3c2c5747.png' },
  { id: '304', name: 'Sweet Potato', calories: 120, protein: 1, carbs: 28, fat: 0, portion: '100g', category: 'Vegetables', image: '/lovable-uploads/dd68df0c-6269-4936-8906-8d11af385d0f.png' },
  
  // Fruits
  { id: '401', name: 'Apple', calories: 59, protein: 0, carbs: 13, fat: 0, portion: '100g', category: 'Fruits', image: '/lovable-uploads/92241a7a-d56b-4e4f-8aa9-ce68f6c3462f.png' },
  { id: '402', name: 'Banana', calories: 116, protein: 1, carbs: 27, fat: 0, portion: '100g', category: 'Fruits', image: '/lovable-uploads/9bcd0151-8ed3-44cd-a0a7-ea82f835cb1f.png' },
  { id: '403', name: 'Orange', calories: 48, protein: 1, carbs: 11, fat: 0, portion: '100g', category: 'Fruits', image: '/lovable-uploads/4904fd9d-b9ca-4956-a2b7-8ef03d8ef935.png' },
  { id: '404', name: 'Mango', calories: 74, protein: 1, carbs: 17, fat: 0, portion: '100g', category: 'Fruits', image: '/lovable-uploads/8e9ce0f4-b6da-430a-9afc-925d19f6ee98.png' },
  
  // Nuts and Seeds
  { id: '501', name: 'Almond', calories: 655, protein: 21, carbs: 10, fat: 59, portion: '100g', category: 'Nuts', image: '/lovable-uploads/a1f5e6f9-9667-4c41-8e40-1687989850c4.png' },
  { id: '502', name: 'Cashew Nut', calories: 596, protein: 21, carbs: 22, fat: 47, portion: '100g', category: 'Nuts', image: '/lovable-uploads/5ed73dee-fe74-4f12-b22f-f33e2deb1768.png' },
  
  // Adding the original food database items with sample images for completeness
  { id: '1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, portion: '1 medium', category: 'Fruits', image: '/lovable-uploads/92241a7a-d56b-4e4f-8aa9-ce68f6c3462f.png' },
  { id: '2', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, portion: '100g', category: 'Protein', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3' },
  { id: '3', name: 'Brown Rice', calories: 215, protein: 5, carbs: 45, fat: 1.8, portion: '1 cup cooked', category: 'Grains', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?ixlib=rb-4.0.3' },
  { id: '4', name: 'Avocado', calories: 234, protein: 2.9, carbs: 12.5, fat: 21, portion: '1 medium', category: 'Fruits', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?ixlib=rb-4.0.3' },
  { id: '5', name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 13, portion: '100g', category: 'Protein', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3' },
  { id: '6', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, portion: '1 cup', category: 'Vegetables', image: 'https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?ixlib=rb-4.0.3' },
  { id: '7', name: 'Greek Yogurt', calories: 100, protein: 17, carbs: 6, fat: 0.4, portion: '100g', category: 'Dairy', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3' },
  { id: '8', name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14, portion: '1/4 cup', category: 'Nuts', image: '/lovable-uploads/a1f5e6f9-9667-4c41-8e40-1687989850c4.png' },
  { id: '9', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, portion: '1 medium', category: 'Fruits', image: '/lovable-uploads/9bcd0151-8ed3-44cd-a0a7-ea82f835cb1f.png' },
  { id: '10', name: 'Egg', calories: 68, protein: 5.5, carbs: 0.6, fat: 4.8, portion: '1 large', category: 'Protein', image: 'https://images.unsplash.com/photo-1607690424560-58e986f38a86?ixlib=rb-4.0.3' }
];
