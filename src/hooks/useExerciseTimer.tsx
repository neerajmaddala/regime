
import { useState } from 'react';
import ExerciseTimerModal from '@/components/ExerciseTimerModal';

export const useExerciseTimer = () => {
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [activeExercise, setActiveExercise] = useState<{
    name: string;
    duration: number;
  } | null>(null);

  const openExerciseTimer = (exerciseName: string, exerciseDuration: number = 60) => {
    setActiveExercise({
      name: exerciseName,
      duration: exerciseDuration
    });
    setIsTimerOpen(true);
  };

  const closeExerciseTimer = () => {
    setIsTimerOpen(false);
    setTimeout(() => {
      setActiveExercise(null);
    }, 300); // Small delay to allow modal animation to complete
  };

  const ExerciseTimerComponent = () => (
    activeExercise && (
      <ExerciseTimerModal
        open={isTimerOpen}
        onClose={closeExerciseTimer}
        exerciseName={activeExercise.name}
        exerciseDuration={activeExercise.duration}
      />
    )
  );

  return {
    openExerciseTimer,
    closeExerciseTimer,
    ExerciseTimerComponent
  };
};
