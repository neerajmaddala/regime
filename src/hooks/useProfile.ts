import { supabase } from '@/integrations/supabase/client';
import { UserProfile, GoalType } from '@/lib/data';

// Function to create a default user profile
export const createDefaultProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const defaultProfile: Omit<UserProfile, 'id' | 'created_at'> = {
      name: 'New User',
      email: '',
      avatar_url: '',
      goal_type: 'general_fitness',
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

    return data as UserProfile;
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

        return data as UserProfile;
    } catch (error) {
        console.error('Error in refreshProfileData:', error);
        return null;
    }
};

// Function to check if a goal type is valid
const isValidGoalType = (type: string): type is GoalType => {
  return ['weight_loss', 'muscle_gain', 'maintenance', 'general_fitness'].includes(type as GoalType);
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
    
    // Type assertion for goal_type
    if (profile.goal_type && !isValidGoalType(profile.goal_type)) {
      console.warn(`Invalid goal type detected: ${profile.goal_type}, defaulting to 'general_fitness'`);
      profile.goal_type = 'general_fitness';
    }
    
    return profile as UserProfile;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
};
