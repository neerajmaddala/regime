
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useRealtimeSubscriptions(userId: string | undefined, onDataChange: () => void) {
  useEffect(() => {
    if (!userId) return;
    
    console.log('Setting up realtime subscriptions for user:', userId);
    
    const profileChannel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`
        },
        (payload) => {
          console.log('Profile data changed in realtime:', payload);
          toast.success('Profile updated successfully');
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log('Profile subscription status:', status);
      });
      
    const goalsChannel = supabase
      .channel('goals-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_goals',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('Goals data changed in realtime:', payload);
          toast.success('Goals updated successfully');
          onDataChange();
        }
      )
      .subscribe((status) => {
        console.log('Goals subscription status:', status);
      });
      
    return () => {
      supabase.removeChannel(profileChannel);
      supabase.removeChannel(goalsChannel);
    };
  }, [userId, onDataChange]);
}
