
import React from 'react';

interface NutritionTarget {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionSummaryProps {
  currentNutrition: NutritionTarget;
  dailyTargets: NutritionTarget;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({
  currentNutrition,
  dailyTargets
}) => {
  const remainingNutrition = {
    calories: dailyTargets.calories - currentNutrition.calories,
    protein: dailyTargets.protein - currentNutrition.protein,
    carbs: dailyTargets.carbs - currentNutrition.carbs,
    fat: dailyTargets.fat - currentNutrition.fat
  };

  return (
    <div className="bg-white dark:bg-regime-dark-light rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
      <h2 className="text-lg font-semibold mb-2">Daily Nutrition Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Calories</div>
          <div className="text-xl font-bold">{currentNutrition.calories} / {dailyTargets.calories}</div>
          <div className={`text-sm ${remainingNutrition.calories >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {remainingNutrition.calories >= 0 ? `${remainingNutrition.calories} remaining` : `${Math.abs(remainingNutrition.calories)} over`}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Protein (g)</div>
          <div className="text-xl font-bold">{currentNutrition.protein} / {dailyTargets.protein}</div>
          <div className={`text-sm ${remainingNutrition.protein >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {remainingNutrition.protein >= 0 ? `${remainingNutrition.protein} remaining` : `${Math.abs(remainingNutrition.protein)} over`}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Carbs (g)</div>
          <div className="text-xl font-bold">{currentNutrition.carbs} / {dailyTargets.carbs}</div>
          <div className={`text-sm ${remainingNutrition.carbs >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {remainingNutrition.carbs >= 0 ? `${remainingNutrition.carbs} remaining` : `${Math.abs(remainingNutrition.carbs)} over`}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">Fat (g)</div>
          <div className="text-xl font-bold">{currentNutrition.fat} / {dailyTargets.fat}</div>
          <div className={`text-sm ${remainingNutrition.fat >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {remainingNutrition.fat >= 0 ? `${remainingNutrition.fat} remaining` : `${Math.abs(remainingNutrition.fat)} over`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
