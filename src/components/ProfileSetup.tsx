
import React from 'react';
import Card from '@/components/common/Card';
import { UserProfile } from '@/lib/data';
import { User, Target, BarChart3, Weight, Ruler } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';

interface ProfileSetupProps {
  profile: UserProfile;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ profile }) => {
  return (
    <AnimatedTransition type="slide-up" delay={300}>
      <Card variant="glass">
        <div className="flex flex-col">
          <h3 className="section-title">
            <User className="section-title-icon" size={20} />
            Profile
          </h3>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center">
            <div className="w-24 h-24 rounded-full bg-regime-green/20 flex items-center justify-center text-regime-green-dark border-4 border-white dark:border-regime-dark-light shadow-md">
              <span className="text-3xl font-bold">{profile.name.charAt(0)}</span>
            </div>
            
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h4 className="text-xl font-bold">{profile.name}</h4>
              <p className="text-gray-600 dark:text-gray-400">
                {profile.age} years, {profile.gender}
              </p>
              <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="flex items-center justify-center sm:justify-start">
                  <Weight size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {profile.weight} kg
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start">
                  <Ruler size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {profile.height} cm
                  </span>
                </div>
                <div className="flex items-center justify-center sm:justify-start capitalize">
                  <BarChart3 size={16} className="text-gray-500 mr-1" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {profile.activityLevel} activity
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
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-regime-dark-light rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h5 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Daily Calories</h5>
                <p className="text-2xl font-bold">{profile.goal.targetCalories}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 capitalize">
                  Goal: {profile.goal.type.replace('-', ' ')}
                </p>
              </div>
              
              <div className="bg-white dark:bg-regime-dark-light rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h5 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Macronutrients</h5>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Protein</span>
                    <span className="font-medium">{profile.goal.targetProtein}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Carbs</span>
                    <span className="font-medium">{profile.goal.targetCarbs}g</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fat</span>
                    <span className="font-medium">{profile.goal.targetFat}g</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-regime-dark-light rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                <h5 className="text-sm text-gray-600 dark:text-gray-400 mb-1">Other Goals</h5>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Water</span>
                    <span className="font-medium">{profile.goal.targetWater}ml</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Exercise</span>
                    <span className="font-medium">{profile.goal.targetExerciseDuration} min/day</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="mt-6 btn-regime-outline w-full">Edit Profile & Goals</button>
          </div>
        </div>
      </Card>
    </AnimatedTransition>
  );
};

export default ProfileSetup;
