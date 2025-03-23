
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, GoalType } from '@/lib/data';

export async function fetchUserProfile(userId: string, setLoading?: (loading: boolean) => void): Promise<UserProfile | null> {
  try {
    console.log('Fetching profile for user:', userId);
    if (setLoading) setLoading(true);
    
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      throw profileError;
    }

    const { data: goalsData, error: goalsError } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (goalsError && goalsError.code !== 'PGRST116') {
      console.error('Goals fetch error:', goalsError);
      throw goalsError;
    }

    console.log('Profile data fetched:', profileData);
    console.log('Goals data fetched:', goalsData);

    const validGender = (profileData.gender || 'male') as "male" | "female" | "other";
    const validActivityLevel = (profileData.activity_level || 'moderate') as "sedentary" | "light" | "moderate" | "active" | "very-active";
    
    // Fix: Add type assertion to ensure goalType is recognized as a valid GoalType
    const goalType = goalsData?.type || 'weight-loss';
    const validGoalType = goalType as GoalType;
    
    const userProfile: UserProfile = {
      name: profileData.name || '',
      age: profileData.age || 30,
      weight: profileData.weight || 70,
      height: profileData.height || 170,
      gender: validGender,
      activityLevel: validActivityLevel,
      goal: {
        type: validGoalType,
        targetCalories: goalsData?.target_calories || 2000,
        targetProtein: goalsData?.target_protein || 150,
        targetCarbs: goalsData?.target_carbs || 200,
        targetFat: goalsData?.target_fat || 60,
        targetWater: goalsData?.target_water || 2500,
        targetExerciseDuration: goalsData?.target_exercise_duration || 45
      }
    };

    return userProfile;
  } catch (error) {
    console.error('Error fetching profile:', error);
    
    const defaultProfile: UserProfile = {
      name: '',
      age: 30,
      weight: 70,
      height: 170,
      gender: 'male',
      activityLevel: 'moderate',
      goal: {
        type: 'weight-loss',
        targetCalories: 2000,
        targetProtein: 150,
        targetCarbs: 200,
        targetFat: 60,
        targetWater: 2500,
        targetExerciseDuration: 45
      }
    };
    
    return defaultProfile;
  } finally {
    if (setLoading) setLoading(false);
  }
}

export async function refreshProfileData(userId: string): Promise<UserProfile | null> {
  try {
    console.log('Refreshing profile for user:', userId);
    
    const { data: cacheResetResult } = await supabase.rpc('version');
    console.log('Cache reset result:', cacheResetResult);
    
    return await fetchUserProfile(userId);
  } catch (error) {
    console.error('Error refreshing profile:', error);
    throw error;
  }
}
