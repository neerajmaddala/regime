
import React from 'react';
import { useProgressData } from '@/hooks/useProgressData';
import { toast } from 'sonner';
import WaterTracker from '@/components/WaterTracker';
import MealPlanner from '@/components/MealPlanner';
import ExerciseLibrary from '@/components/ExerciseLibrary';
import ProgressChart from '@/components/ProgressChart';
import ProfileSetup from '@/components/ProfileSetup';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import Card from '@/components/common/Card';
import { mockExercises } from '@/lib/data';
import { 
  Utensils, 
  Dumbbell, 
  Droplet, 
  BrainCircuit, 
  ChevronRight, 
  TrendingUp, 
  Flame,
  Calendar 
} from 'lucide-react';

interface DashboardProps {
  activeSection?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection = 'dashboard' }) => {
  const { 
    dailyData, 
    weeklyData, 
    userProfile, 
    loading, 
    progress, 
    remainingCalories, 
    updateWaterIntake,
    remainingWater
  } = useProgressData();

  const handleAddWater = (amount: number) => {
    updateWaterIntake(amount);
    toast.success(`Added ${amount}ml of water!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-regime-green border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg font-medium">Loading your wellness data...</p>
        </div>
      </div>
    );
  }
  
  const renderContent = () => {
    switch (activeSection) {
      case 'water':
        return (
          <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Water Tracking</h1>
            <WaterTracker 
              waterIntake={dailyData.waterIntake} 
              targetWater={userProfile.goal.targetWater}
              completedIntakes={dailyData.completedWaterIntakes}
              onAddWater={handleAddWater}
            />
          </div>
        );
      case 'meals':
        return (
          <div className="max-w-5xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Meal Planning</h1>
            <MealPlanner meals={dailyData.meals} />
          </div>
        );
      case 'exercises':
        return (
          <div className="max-w-5xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Exercise Library</h1>
            <ExerciseLibrary exercises={mockExercises} />
          </div>
        );
      case 'progress':
        return (
          <div className="max-w-5xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Your Progress</h1>
            <ProgressChart data={weeklyData} />
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <ProfileSetup profile={userProfile} />
          </div>
        );
      default:
        return (
          <>
            <AnimatedTransition type="fade">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {userProfile.name.split(' ')[0]}</h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Let's continue your wellness journey
                  </p>
                </div>
                <div className="bg-regime-green text-regime-dark rounded-full px-4 py-2 flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span className="font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </AnimatedTransition>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <AnimatedTransition type="slide-up" delay={100}>
                <Card variant="glass" className="bg-white dark:bg-regime-dark-light">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Calories Remaining</span>
                      <h3 className="text-2xl font-bold mt-1">{remainingCalories}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-regime-green/20 flex items-center justify-center">
                      <Utensils size={18} className="text-regime-green-dark" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-regime-green rounded-full h-2 transition-all duration-1000 ease-out"
                        style={{ width: `${progress.calories}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>0</span>
                      <span>{userProfile.goal.targetCalories}</span>
                    </div>
                  </div>
                </Card>
              </AnimatedTransition>

              <AnimatedTransition type="slide-up" delay={150}>
                <Card variant="glass" className="bg-white dark:bg-regime-dark-light">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Water Remaining</span>
                      <h3 className="text-2xl font-bold mt-1">{remainingWater}ml</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Droplet size={18} className="text-regime-blue" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-regime-blue rounded-full h-2 transition-all duration-1000 ease-out"
                        style={{ width: `${progress.water}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>0</span>
                      <span>{userProfile.goal.targetWater}ml</span>
                    </div>
                  </div>
                </Card>
              </AnimatedTransition>

              <AnimatedTransition type="slide-up" delay={200}>
                <Card variant="glass" className="bg-white dark:bg-regime-dark-light">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Protein</span>
                      <h3 className="text-2xl font-bold mt-1">
                        {dailyData.meals.reduce((acc, meal) => acc + meal.totalProtein, 0)}g
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Dumbbell size={18} className="text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-purple-600 dark:bg-purple-400 rounded-full h-2 transition-all duration-1000 ease-out"
                        style={{ width: `${progress.protein}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>0</span>
                      <span>{userProfile.goal.targetProtein}g</span>
                    </div>
                  </div>
                </Card>
              </AnimatedTransition>

              <AnimatedTransition type="slide-up" delay={250}>
                <Card variant="glass" className="bg-white dark:bg-regime-dark-light">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Exercise</span>
                      <h3 className="text-2xl font-bold mt-1">
                        {dailyData.exercises.reduce((acc, ex) => acc + ex.duration, 0)} min
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Flame size={18} className="text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-orange-600 dark:bg-orange-400 rounded-full h-2 transition-all duration-1000 ease-out"
                        style={{ width: `${progress.exercise}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span>0</span>
                      <span>{userProfile.goal.targetExerciseDuration} min</span>
                    </div>
                  </div>
                </Card>
              </AnimatedTransition>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <MealPlanner meals={dailyData.meals} />
                <ProgressChart data={weeklyData} />
              </div>
              
              <div className="space-y-6">
                <WaterTracker 
                  waterIntake={dailyData.waterIntake} 
                  targetWater={userProfile.goal.targetWater}
                  completedIntakes={dailyData.completedWaterIntakes}
                  onAddWater={handleAddWater}
                />
                
                <AnimatedTransition type="slide-left" delay={300}>
                  <Card variant="glass" className="bg-white dark:bg-regime-dark-light">
                    <h3 className="section-title">
                      <BrainCircuit className="section-title-icon" size={20} />
                      Wellness Tip
                    </h3>
                    
                    <div className="mt-4 p-4 bg-regime-green/10 rounded-xl border border-regime-green/20">
                      <p className="text-gray-700 dark:text-gray-300">
                        Try to include more colorful vegetables in your meals today. 
                        Varied colors indicate different nutrients and antioxidants!
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <button className="w-full btn-regime-outline">
                        More wellness tips
                      </button>
                    </div>
                  </Card>
                </AnimatedTransition>
              </div>
            </div>
            
            <div className="mt-8">
              <ExerciseLibrary exercises={mockExercises} />
            </div>
          </>
        );
    }
  };

  return <div className="page-container">{renderContent()}</div>;
};

export default Dashboard;
