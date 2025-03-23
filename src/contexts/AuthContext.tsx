
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { UserProfile } from '@/lib/data';
import { fetchUserProfile, refreshProfileData } from '@/hooks/useProfile';
import { useRealtimeSubscriptions } from '@/hooks/useRealtimeSubscriptions';

type AuthContextType = {
  user: any | null;
  session: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadProfile = useCallback(async (userId: string) => {
    try {
      const userProfile = await fetchUserProfile(userId, setLoading);
      if (userProfile) {
        setProfile(userProfile);
        console.log('Profile loaded:', userProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  useEffect(() => {
    const setupUser = async () => {
      try {
        setLoading(true);
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user || null);

        if (data.session?.user) {
          await loadProfile(data.session.user.id);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            console.log('Auth state changed:', _event, session?.user?.id);
            setSession(session);
            setUser(session?.user || null);
            
            if (session?.user) {
              await loadProfile(session.user.id);
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
  }, [loadProfile]);

  // Set up realtime subscriptions when user changes
  useRealtimeSubscriptions(user?.id, () => loadProfile(user.id));

  const refreshProfile = async () => {
    console.log('Refreshing profile requested');
    if (user) {
      console.log('Refreshing profile for user:', user.id);
      try {
        setLoading(true);
        const updatedProfile = await refreshProfileData(user.id);
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
        
        console.log('Profile refreshed successfully:', updatedProfile);
        return updatedProfile;
      } catch (error) {
        console.error('Error refreshing profile:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    }
    return null;
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
