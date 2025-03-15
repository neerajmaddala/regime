
import React, { useState } from 'react';
import Card from '@/components/common/Card';
import { UserProfile } from '@/lib/data';
import { User, Target, BarChart3, Weight, Ruler } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import ProfileEdit from '@/components/ProfileEdit';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileSetupProps {
  userProfile?: UserProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ userProfile }) => {
  const { profile, refreshProfile } = useAuth();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const isMobile = useIsMobile();

  // Use the passed userProfile prop if available, otherwise use the profile from auth context
  const displayProfile = userProfile || profile;

  const handleEditClose = async () => {
    setEditModalOpen(false);
    // Refresh the profile data after the modal is closed
    await refreshProfile();
  };

  if (!displayProfile) {
    return (
      <AnimatedTransition type="slide-up" delay={300}>
        <Card variant="glass" className="p-6 text-center">
          <p>Loading profile data...</p>
        </Card>
      </AnimatedTransition>
    );
  }

  return (
    <AnimatedTransition type="slide-up" delay={300}>
      <Card variant="glass">
        <div className="flex flex-col">
          <h3 className="section-title">
            <User className="section-title-icon" size={20} />
            Profile
          </h3>
          
          <div className={`mt-4 flex ${isMobile ? 'flex-col' : 'flex-row'} items-center`}>
            <div className="w-24 h-24 rounded-full bg-regime-green/20 flex items-center justify-center text-regime-green-dark border-4 border-white dark:border-regime-dark-light shadow-md">
              <span className="text-3xl font-bold">{displayProfile.name.charAt(0)}</span>
            </div>
            
            <div className={`${isMobile ? 'mt-4 text-center w-full' : 'mt-0 ml-6 text-left'}`}>
              <h4 className="text-xl font-bold">{displayProfile.name}</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {displayProfile.age} years, {displayProfile.gender}
              </p>
              <div className={`mt-2 flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-4'}`}>
                <div className={`flex items-center ${isMobile ? 'justify-center' : 'justify-start'}`}>
                  <Weight size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {displayProfile.weight} kg
                  </span>
                </div>
                <div className={`flex items-center ${isMobile ? 'justify-center' : 'justify-start'}`}>
                  <Ruler size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {displayProfile.height} cm
                  </span>
                </div>
                <div className={`flex items-center ${isMobile ? 'justify-center' : 'justify-start'} capitalize`}>
                  <BarChart3 size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {displayProfile.activityLevel} activity
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center">
              <Target size={20} className="text-regime-green mr-2" />
              <h4 className="text-lg font-semibold">Your Goals</h4>
            </div>
            
            <div className={`mt-4 grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-1 sm:grid-cols-3 gap-4'}`}>
              <div className="bg-white dark:bg-regime-dark-light rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h5 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Calories</h5>
                <p className="text-2xl font-bold">{displayProfile.goal.targetCalories}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 capitalize">
                  Goal: {displayProfile.goal.type.replace('-', ' ')}
                </p>
              </div>
              
              <div className="bg-white dark:bg-regime-dark-light rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h5 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Macronutrients</h5>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Protein</span>
                    <span className="font-medium">{displayProfile.goal.targetProtein}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Carbs</span>
                    <span className="font-medium">{displayProfile.goal.targetCarbs}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fat</span>
                    <span className="font-medium">{displayProfile.goal.targetFat}g</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-regime-dark-light rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h5 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Other Goals</h5>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Water</span>
                    <span className="font-medium">{displayProfile.goal.targetWater}ml</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exercise</span>
                    <span className="font-medium">{displayProfile.goal.targetExerciseDuration} min/day</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              className="mt-6 btn-regime-outline w-full"
              onClick={() => setEditModalOpen(true)}
            >
              Edit Profile & Goals
            </button>
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
