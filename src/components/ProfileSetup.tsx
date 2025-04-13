
import React, { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import { UserProfile } from '@/lib/data';
import { User, Target, Activity, Weight, Ruler, RefreshCw } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import ProfileEdit from '@/components/ProfileEdit';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfileSetupProps {
  userProfile?: UserProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ userProfile }) => {
  const { profile, refreshProfile } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log("Profile from auth context updated:", profile);
    if (userProfile || profile) {
      setLocalProfile(userProfile || profile);
    }
  }, [userProfile, profile]);

  const handleEditClose = async () => {
    setEditModalOpen(false);
    try {
      await refreshProfile();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error refreshing profile after edit:", error);
      toast.error("Failed to refresh profile");
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshProfile();
      toast.success("Profile refreshed successfully");
    } catch (error) {
      console.error("Error manually refreshing profile:", error);
      toast.error("Failed to refresh profile");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!localProfile) {
    return (
      <AnimatedTransition type="slide-up" delay={300}>
        <Card variant="glass" className="p-6 text-center">
          <p>Loading profile data...</p>
        </Card>
      </AnimatedTransition>
    );
  }

  const getFirstLetter = (name: string) => {
    return name && name.charAt(0).toUpperCase() || 'U';
  };

  return (
    <AnimatedTransition type="slide-up" delay={300}>
      <Card variant="glass" className="p-0 overflow-hidden">
        <div className="flex flex-col">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Profile</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleManualRefresh}
                className="flex items-center gap-1 text-gray-600 hover:text-green-700"
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
            </div>
            
            <div className="bg-white dark:bg-regime-dark-light rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <User size={20} className="text-regime-green" />
                <h3 className="text-xl font-semibold">Profile</h3>
              </div>
              
              <div className="flex flex-col items-center mb-8">
                <Avatar className="w-24 h-24 mb-4 bg-green-100 text-green-600 text-3xl font-bold">
                  <AvatarFallback>{getFirstLetter(localProfile.name)}</AvatarFallback>
                </Avatar>
                
                <h3 className="text-xl font-bold mb-1">{localProfile.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {localProfile.age} years, {localProfile.gender}
                </p>
                
                <div className="flex flex-wrap justify-center gap-6 w-full max-w-xs mb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                      <Weight size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium">{localProfile.weight} kg</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                      <Ruler size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium">{localProfile.height} cm</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                      <Activity size={18} className="text-gray-500" />
                    </div>
                    <span className="text-sm font-medium capitalize">{localProfile.activityLevel.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={20} className="text-regime-green" />
                  <h3 className="text-xl font-semibold">Your Goals</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Goal Type</p>
                    <p className="text-lg font-medium capitalize">{localProfile.goal.type.replace('-', ' ')}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Daily Calories</p>
                    <p className="text-lg font-medium">{localProfile.goal.targetCalories} kcal</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Water Target</p>
                    <p className="text-lg font-medium">{localProfile.goal.targetWater} ml</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Protein</p>
                    <p className="text-lg font-medium">{localProfile.goal.targetProtein}g</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Carbs</p>
                    <p className="text-lg font-medium">{localProfile.goal.targetCarbs}g</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Fat</p>
                    <p className="text-lg font-medium">{localProfile.goal.targetFat}g</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Exercise Target</p>
                    <p className="text-lg font-medium">{localProfile.goal.targetExerciseDuration} min/day</p>
                  </div>
                </div>
              </div>
              
              <button 
                className="w-full py-3 rounded-full bg-white text-regime-green border border-regime-green/30 hover:bg-regime-green/10 transition-colors font-medium"
                onClick={() => setEditModalOpen(true)}
              >
                Edit Profile & Goals
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      <ProfileEdit 
        open={editModalOpen} 
        onClose={handleEditClose}
      />
    </AnimatedTransition>
  );
};

export default ProfileSetup;
