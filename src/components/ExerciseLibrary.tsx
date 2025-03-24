
import React, { useState } from 'react';
import Card from '@/components/common/Card';
import { Exercise, exerciseCategoryIcons } from '@/lib/data';
import { Dumbbell, Search, Clock, Flame, ChevronRight } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';
import { useExerciseTimer } from '@/hooks/useExerciseTimer';

interface ExerciseLibraryProps {
  exercises: Exercise[];
}

const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ exercises }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { openExerciseTimer, ExerciseTimerComponent } = useExerciseTimer();
  
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'strength', label: 'Strength' },
    { id: 'flexibility', label: 'Flexibility' },
    { id: 'mind', label: 'Mind' }
  ];
  
  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = activeCategory === 'all' || exercise.category === activeCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartExercise = (exercise: Exercise) => {
    // Convert duration from minutes to seconds for the timer
    const durationInSeconds = exercise.duration * 60;
    openExerciseTimer(exercise.name, durationInSeconds);
  };

  return (
    <AnimatedTransition type="slide-up" delay={300}>
      <Card variant="glass">
        <div className="flex flex-col">
          <h3 className="section-title">
            <Dumbbell className="section-title-icon" size={20} />
            Exercise Library
          </h3>
          
          <div className="relative mt-2 mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-regime-green/30 bg-white dark:bg-regime-dark-light"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 pb-2 mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-regime-green text-regime-dark'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
            {filteredExercises.map((exercise, index) => {
              const CategoryIcon = exerciseCategoryIcons[exercise.category];
              
              return (
                <AnimatedTransition key={exercise.id} type="fade" delay={100 + (index * 50)}>
                  <div className="bg-white dark:bg-regime-dark-light rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <div className="h-40 overflow-hidden relative">
                      {exercise.image && (
                        <img
                          src={exercise.image}
                          alt={exercise.name}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                        />
                      )}
                      <div className="absolute top-2 left-2">
                        <span className={`label-chip ${
                          exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="label-chip bg-black bg-opacity-50 text-white">
                          <CategoryIcon size={12} className="mr-1" />
                          {exercise.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-1">{exercise.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {exercise.description}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div className="flex space-x-3">
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Clock size={16} className="mr-1" />
                            {exercise.duration} min
                          </div>
                          <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                            <Flame size={16} className="mr-1" />
                            {exercise.caloriesBurned} cal
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleStartExercise(exercise)}
                          className="flex items-center justify-center text-sm font-medium text-regime-green hover:text-regime-green-dark transition-colors"
                        >
                          Start <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedTransition>
              );
            })}
          </div>
        </div>
      </Card>
      
      {/* Exercise Timer Modal */}
      <ExerciseTimerComponent />
    </AnimatedTransition>
  );
};

export default ExerciseLibrary;
