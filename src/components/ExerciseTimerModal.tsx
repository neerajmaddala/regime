
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import ExerciseTimer from '@/components/ExerciseTimer';
import { toast } from '@/components/ui/use-toast';

interface ExerciseTimerModalProps {
  open: boolean;
  onClose: () => void;
  exerciseName: string;
  exerciseDuration?: number; // in seconds
}

const ExerciseTimerModal: React.FC<ExerciseTimerModalProps> = ({
  open,
  onClose,
  exerciseName,
  exerciseDuration = 60
}) => {
  const isMobile = useIsMobile();
  
  const handleExerciseComplete = () => {
    toast({
      title: "Exercise completed! 🎉",
      description: `You've completed ${exerciseName}`,
    });
  };
  
  const content = (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold">{exerciseName}</h3>
        <p className="text-gray-500 dark:text-gray-400">Complete this exercise using the timer below</p>
      </div>
      
      <ExerciseTimer
        initialDuration={exerciseDuration}
        onComplete={handleExerciseComplete}
      />
    </div>
  );
  
  return isMobile ? (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Exercise Timer</SheetTitle>
          <SheetDescription>
            Set the timer for your exercise session
          </SheetDescription>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Exercise Timer</DialogTitle>
          <DialogDescription>
            Set the timer for your exercise session
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseTimerModal;
