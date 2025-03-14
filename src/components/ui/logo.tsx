
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
}

const Logo = ({ size = 'md', withText = true, className }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <img 
          src="/lovable-uploads/96004a18-203d-4904-96b8-3e8c2cc1d5c1.png" 
          alt="REGIME Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {withText && (
        <span className={cn('ml-2 font-bold tracking-wider text-white', textSizeClasses[size])}>
          REGIME
        </span>
      )}
    </div>
  );
};

export default Logo;
