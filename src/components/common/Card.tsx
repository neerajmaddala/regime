
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'glass' | 'neo' | 'default';
  hover?: boolean;
}

const Card = ({ 
  children, 
  className, 
  variant = 'default', 
  hover = true,
  ...props 
}: CardProps) => {
  const variantClasses = {
    glass: 'glass-card dark:glass-card-dark',
    neo: 'neo-card dark:neo-card-dark',
    default: 'bg-white dark:bg-regime-dark-light rounded-2xl shadow-md border border-gray-100 dark:border-regime-dark-lighter'
  };

  return (
    <div 
      className={cn(
        variantClasses[variant],
        hover && 'card-hover',
        'p-5 overflow-hidden',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
