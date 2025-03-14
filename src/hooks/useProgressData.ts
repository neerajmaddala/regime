
import { useState, useEffect } from 'react';
import { mockDailyProgress, mockWeeklyProgressData, mockUserProfile } from '@/lib/data';

export const useProgressData = () => {
  const [dailyData, setDailyData] = useState(mockDailyProgress);
  const [weeklyData, setWeeklyData] = useState(mockWeeklyProgressData);
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [loading, setLoading] = useState(true);

  // Calculate progress percentages
  const calculateProgress = () => {
    const { caloriesConsumed, waterIntake } = dailyData;
    const { targetCalories, targetWater } = userProfile.goal;
    
    return {
      calories: Math.min(Math.round((caloriesConsumed / targetCalories) * 100), 100),
      water: Math.min(Math.round((waterIntake / targetWater) * 100), 100),
      protein: Math.min(Math.round((dailyData.meals.reduce((acc, meal) => acc + meal.totalProtein, 0) / userProfile.goal.targetProtein) * 100), 100),
      exercise: Math.min(Math.round((dailyData.exercises.reduce((acc, exercise) => acc + exercise.duration, 0) / userProfile.goal.targetExerciseDuration) * 100), 100)
    };
  };

  const getRemainingCalories = () => {
    return userProfile.goal.targetCalories - dailyData.caloriesConsumed + dailyData.caloriesBurned;
  };

  const getRemainingWater = () => {
    return userProfile.goal.targetWater - dailyData.waterIntake;
  };

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Simulate data update for demo purposes
  const updateWaterIntake = (amount: number) => {
    setDailyData(prev => ({
      ...prev,
      waterIntake: prev.waterIntake + amount,
      completedWaterIntakes: [
        ...prev.completedWaterIntakes,
        {
          id: `w${prev.completedWaterIntakes.length + 1}`,
          amount,
          timestamp: new Date().toTimeString().slice(0, 5)
        }
      ]
    }));
  };

  return {
    dailyData,
    weeklyData,
    userProfile,
    loading,
    progress: calculateProgress(),
    remainingCalories: getRemainingCalories(),
    remainingWater: getRemainingWater(),
    updateWaterIntake
  };
};
