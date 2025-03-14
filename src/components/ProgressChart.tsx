
import React from 'react';
import Card from '@/components/common/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import AnimatedTransition from '@/components/common/AnimatedTransition';

interface ProgressData {
  day: string;
  calories: number;
  target: number;
  water: number;
  exercise: number;
}

interface ProgressChartProps {
  data: ProgressData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-regime-dark-light p-3 border border-gray-200 dark:border-gray-700 rounded shadow-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  return (
    <AnimatedTransition type="slide-up" delay={300}>
      <Card variant="glass" className="col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="section-title mb-0">
            <BarChart3 className="section-title-icon" size={20} />
            Weekly Progress
          </h3>
          <div className="flex gap-2">
            <button className="label-chip bg-regime-green/20 text-regime-green-dark hover:bg-regime-green/30 transition-colors">
              Calories
            </button>
            <button className="label-chip bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Water
            </button>
          </div>
        </div>
        
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calories" name="Calories" fill="#A6F751" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-8">
          <h3 className="font-medium flex items-center mb-4">
            <TrendingUp className="text-regime-blue mr-2" size={18} />
            Activity Trend
          </h3>
          
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="exercise" 
                  name="Exercise (min)" 
                  stroke="#0EA5E9" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>
    </AnimatedTransition>
  );
};

export default ProgressChart;
