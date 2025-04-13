
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, GoalType } from '@/lib/data';

// Interface to match the database schema structure
interface ProfileRecord {
  id: string;
  name: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  weight?: number;
  height?: number;
  activity_level?: string;
  goal_type?: GoalType;
  created_at?: string;
  updated_at?: string;
  avatar_url?: string;
  daily_calorie_target?: number;
  water_intake_goal?: number;
}

// Function to convert database record to UserProfile format
const mapProfileRecordToUserProfile = (record: ProfileRecord): UserProfile => {
  return {
    name: record.name || 'New User',
    age: record.age || 25,
    weight: record.weight || 70,
    height: record.height || 175,
    gender: record.gender || 'male',
    activityLevel: (record.activity_level as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active') || 'moderate',
    goal: {
      type: (record.goal_type as GoalType) || 'weight-loss',
      targetCalories: record.daily_calorie_target || 2000,
      targetProtein: 150,
      targetCarbs: 200,
      targetFat: 55,
      targetWater: record.water_intake_goal || 2500,
      targetExerciseDuration: 45
    }
  };
};

// Function to create a default user profile
export const createDefaultProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const defaultProfile: Omit<ProfileRecord, 'id' | 'created_at'> = {
      name: 'New User',
      goal_type: 'weight-loss',
      age: 25,
      weight: 70,
      height: 175,
      gender: 'male',
      activity_level: 'moderate',
      daily_calorie_target: 2000,
      water_intake_goal: 3000,
    };

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id: userId, ...defaultProfile }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating default profile:', error);
      return null;
    }

    return mapProfileRecordToUserProfile(data as ProfileRecord);
  } catch (error) {
    console.error('Error in createDefaultProfile:', error);
    return null;
  }
};

// Function to refresh profile data
export const refreshProfileData = async (userId: string): Promise<UserProfile | null> => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        if (!data) {
            console.log('No profile found');
            return null;
        }

        return mapProfileRecordToUserProfile(data as ProfileRecord);
    } catch (error) {
        console.error('Error in refreshProfileData:', error);
        return null;
    }
};

// Function to check if a goal type is valid
const isValidGoalType = (type: string): type is GoalType => {
  return ['weight-loss', 'muscle-gain', 'maintenance', 'health'].includes(type as GoalType);
};

// Function to fetch user profile
export const fetchUserProfile = async (userId: string, setLoading?: (loading: boolean) => void): Promise<UserProfile | null> => {
  try {
    if (setLoading) setLoading(true);
    
    // Fetch profile from the database
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    if (!profile) {
      console.log('No profile found, creating default profile');
      return await createDefaultProfile(userId);
    }
    
    const profileRecord = profile as ProfileRecord;
    
    // Type assertion for goal_type
    if (profileRecord.goal_type && !isValidGoalType(profileRecord.goal_type)) {
      console.warn(`Invalid goal type detected: ${profileRecord.goal_type}, defaulting to 'weight-loss'`);
      profileRecord.goal_type = 'weight-loss';
    }
    
    return mapProfileRecordToUserProfile(profileRecord);
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
};
