
import React, { useEffect } from 'react';
import { useProgressData } from '@/hooks/useProgressData';
import { useMealPlanner } from '@/contexts/MealPlannerContext';
import { toast } from 'sonner';
import WaterTracker from '@/components/WaterTracker';
import MealPlanner from '@/components/MealPlanner';
import ExerciseLibrary from '@/components/ExerciseLibrary';
import ProgressChart from '@/components/ProgressChart';
import ProfileSetup from '@/components/ProfileSetup';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import Card from '@/components/common/Card';
import { mockExercises } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Utensils, 
  Dumbbell, 
  Droplet, 
  BrainCircuit, 
  ChevronRight, 
  TrendingUp, 
  Flame,
  Calendar,
  LogIn,
  UserPlus
} from 'lucide-react';

interface DashboardProps {
  activeSection?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ activeSection = 'dashboard' }) => {
  const { user, profile } = useAuth();
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
  
  // Get currentNutrition from MealPlannerContext to ensure real-time updates
  const { currentNutrition, meals } = useMealPlanner();

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
  
  // Get user's name from auth profile if available, otherwise from the userProfile
  const userName = profile?.name || userProfile.name || 'User';

  // If user is not logged in and viewing the main dashboard, show welcome screen with login options
  if (!user && activeSection === 'dashboard') {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <AnimatedTransition type="fade">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Welcome to REGIME</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Your personal fitness journey starts here
            </p>
          </div>
        </AnimatedTransition>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <AnimatedTransition type="slide-right">
            <Card variant="glass" className="bg-white dark:bg-regime-dark-light p-8">
              <h2 className="text-2xl font-bold mb-4">Have an account?</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Log in to access your personalized fitness plan, track your progress, and achieve your goals.
              </p>
              <Link to="/auth">
                <Button className="w-full bg-regime-green hover:bg-regime-green-dark text-white">
                  <LogIn className="mr-2" size={18} />
                  Log In
                </Button>
              </Link>
            </Card>
          </AnimatedTransition>

          <AnimatedTransition type="slide-left">
            <Card variant="glass" className="bg-white dark:bg-regime-dark-light p-8">
              <h2 className="text-2xl font-bold mb-4">New here?</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                Create an account to get started with personalized meal plans, exercise routines, and progress tracking.
              </p>
              <Link to="/auth?tab=signup">
                <Button className="w-full bg-regime-green hover:bg-regime-green-dark text-white">
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Button>
              </Link>
            </Card>
          </AnimatedTransition>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <AnimatedTransition type="slide-up" delay={100}>
            <Card variant="glass" className="bg-white dark:bg-regime-dark-light p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-regime-green/20 flex items-center justify-center mx-auto mb-4">
                <Utensils size={24} className="text-regime-green-dark" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meal Planning</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create personalized meal plans based on your nutritional goals
              </p>
            </Card>
          </AnimatedTransition>

          <AnimatedTransition type="slide-up" delay={200}>
            <Card variant="glass" className="bg-white dark:bg-regime-dark-light p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <Dumbbell size={24} className="text-regime-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Exercise Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Follow workout routines designed to meet your fitness goals
              </p>
            </Card>
          </AnimatedTransition>

          <AnimatedTransition type="slide-up" delay={300}>
            <Card variant="glass" className="bg-white dark:bg-regime-dark-light p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your progress over time with detailed charts and insights
              </p>
            </Card>
          </AnimatedTransition>
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
            <MealPlanner meals={meals} />
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
            <ProfileSetup userProfile={userProfile} />
          </div>
        );
      default:
        return (
          <>
            <AnimatedTransition type="fade">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold">Welcome back, {userName.split(' ')[0]}</h1>
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
                      <h3 className="text-2xl font-bold mt-1">{userProfile.goal.targetCalories - currentNutrition.calories}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-regime-green/20 flex items-center justify-center">
                      <Utensils size={18} className="text-regime-green-dark" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-regime-green rounded-full h-2 transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min((currentNutrition.calories / userProfile.goal.targetCalories) * 100, 100)}%` }}
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
                        {currentNutrition.protein}g
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
                        style={{ width: `${Math.min((currentNutrition.protein / userProfile.goal.targetProtein) * 100, 100)}%` }}
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
                <MealPlanner meals={meals} />
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
