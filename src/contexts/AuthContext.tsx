
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { UserProfile, GoalType } from '@/lib/data';

type AuthContextType = {
  user: any | null;
  session: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const setupUser = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        if (data.session?.user) {
          await fetchProfile(data.session.user.id);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            
            if (session?.user) {
              await fetchProfile(session.user.id);
            } else {
              setProfile(null);
            }

            setLoading(false);
          }
        );

        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error setting up user:', error);
      } finally {
        setLoading(false);
      }
    };

    setupUser();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // First, get the profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // Then, get the goals data
      const { data: goalsData, error: goalsError } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', userId)
        .single();

      // Ensure gender is one of the allowed values
      const validGender = profileData.gender as "male" | "female" | "other";
      const validActivityLevel = profileData.activity_level as "sedentary" | "light" | "moderate" | "active" | "very-active";
      // Ensure goal type is one of the allowed values
      const validGoalType = (goalsData?.type || 'weight-loss') as GoalType;
      
      // Combine the data into a UserProfile object
      let userProfile: UserProfile = {
        name: profileData.name || 'User',
        age: profileData.age || 30,
        weight: profileData.weight || 70,
        height: profileData.height || 170,
        gender: validGender || 'male',
        activityLevel: validActivityLevel || 'moderate',
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

      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      // If no profile exists, create default values
      const defaultProfile: UserProfile = {
        name: user?.email?.split('@')[0] || 'User',
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
      
      setProfile(defaultProfile);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      navigate('/auth');
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
