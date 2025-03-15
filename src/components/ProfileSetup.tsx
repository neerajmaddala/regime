
import React, { useState, useEffect } from 'react';
import Card from '@/components/common/Card';
import { UserProfile } from '@/lib/data';
import { User, Target, BarChart3, Weight, Ruler, Activity } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import ProfileEdit from '@/components/ProfileEdit';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ProfileSetupProps {
  userProfile?: UserProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ userProfile }) => {
  const { profile, refreshProfile } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const isMobile = useIsMobile();

  // Use the passed userProfile prop if available, otherwise use the profile from auth context
  useEffect(() => {
    setLocalProfile(userProfile || profile);
  }, [userProfile, profile]);

  const handleEditClose = async () => {
    setEditModalOpen(false);
    // Refresh the profile data after the modal is closed
    await refreshProfile();
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
    return name.charAt(0).toUpperCase();
  };

  return (
    <AnimatedTransition type="slide-up" delay={300}>
      <Card variant="glass" className="p-0 overflow-hidden">
        <div className="flex flex-col">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            
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
                
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <div className="flex items-center justify-center gap-2">
                    <Weight size={18} className="text-gray-500" />
                    <span>{localProfile.weight} kg</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Ruler size={18} className="text-gray-500" />
                    <span>{localProfile.height} cm</span>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2">
                    <Activity size={18} className="text-gray-500" />
                    <span className="capitalize">{localProfile.activityLevel.replace('-', ' ')} Activity</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={20} className="text-regime-green" />
                  <h3 className="text-xl font-semibold">Your Goals</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Daily Calories</p>
                    <p className="text-2xl font-bold">{localProfile.goal.targetCalories}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                      Goal: {localProfile.goal.type.replace('-', ' ')}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Macronutrients</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Protein</span>
                        <span className="font-medium">{localProfile.goal.targetProtein}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Carbs</span>
                        <span className="font-medium">{localProfile.goal.targetCarbs}g</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fat</span>
                        <span className="font-medium">{localProfile.goal.targetFat}g</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Other Goals</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Water</span>
                        <span className="font-medium">{localProfile.goal.targetWater}ml</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Exercise</span>
                        <span className="font-medium">{localProfile.goal.targetExerciseDuration} min/day</span>
                      </div>
                    </div>
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
