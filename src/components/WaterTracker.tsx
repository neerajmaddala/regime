
import React from 'react';
import Card from '@/components/common/Card';
import { Droplet, Plus, Check } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import { WaterIntake } from '@/lib/data';
import { toast } from '@/components/ui/use-toast';

interface WaterTrackerProps {
  waterIntake: number;
  targetWater: number;
  completedIntakes: WaterIntake[];
  onAddWater: (amount: number) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({
  waterIntake,
  targetWater,
  completedIntakes,
  onAddWater
}) => {
  const percentage = Math.min(Math.round((waterIntake / targetWater) * 100), 100);
  const remainingWater = targetWater - waterIntake;
  
  const handleAddWater = (amount: number) => {
    onAddWater(amount);
    // Show a toast notification
    toast({
      title: `Added ${amount}ml of water`,
      description: `${remainingWater <= amount ? 'Daily target reached! 🎉' : `${remainingWater - amount}ml remaining`}`,
      variant: "default"
    });
  };

  return (
    <AnimatedTransition type="slide-up" delay={200}>
      <Card variant="glass" className="relative overflow-hidden">
        <div className="flex flex-col">
          <h3 className="section-title">
            <Droplet className="section-title-icon" size={20} />
            Water Tracker
          </h3>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
            {/* Water progress visualization */}
            <div className="relative w-40 h-40">
              <div 
                className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-900"
                style={{ borderRadius: '100%' }}
              ></div>
              <div 
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-regime-blue to-regime-blue-light opacity-80 water-animation"
                style={{ 
                  height: `${percentage}%`,
                  borderRadius: '0 0 100% 100%' 
                }}
              ></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-3xl font-bold text-regime-blue">
                  {waterIntake}
                  <span className="text-base font-normal">ml</span>
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  of {targetWater}ml
                </p>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="flex flex-col items-center sm:items-start">
              <p className="text-lg font-medium mb-2">
                {remainingWater > 0 ? `${remainingWater}ml remaining` : 'Goal completed!'}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <button 
                  onClick={() => handleAddWater(250)}
                  className="flex items-center justify-center bg-regime-blue hover:bg-regime-blue-light text-white p-3 rounded-full transition-all"
                >
                  <Plus size={16} className="mr-1" />
                  <span className="ml-1">250ml</span>
                </button>
                
                <button 
                  onClick={() => handleAddWater(500)}
                  className="flex items-center justify-center bg-regime-blue hover:bg-regime-blue-light text-white p-3 rounded-full transition-all"
                >
                  <Plus size={16} className="mr-1" />
                  <span className="ml-1">500ml</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Water intake history */}
          <div className="mt-6">
            <h4 className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-2">
              Today's intake
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {completedIntakes.map((intake, index) => (
                <AnimatedTransition key={intake.id} type="fade" delay={100 + (index * 50)}>
                  <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 p-2 rounded">
                    <Check size={16} className="text-regime-blue mr-2" />
                    <div className="text-sm">
                      <span className="font-medium">{intake.amount}ml</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-1">
                        {intake.timestamp}
                      </span>
                    </div>
                  </div>
                </AnimatedTransition>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </AnimatedTransition>
  );
};

export default WaterTracker;
