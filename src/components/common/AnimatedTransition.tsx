
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

type AnimationType = 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  type?: AnimationType;
  className?: string;
  delay?: number;
}

const AnimatedTransition = ({
  children,
  type = 'fade',
  className,
  delay = 0,
}: AnimatedTransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const animations = {
    fade: 'opacity-0 transition-opacity duration-500',
    'slide-up': 'opacity-0 translate-y-10 transition-all duration-500',
    'slide-left': 'opacity-0 translate-x-10 transition-all duration-500',
    'slide-right': 'opacity-0 -translate-x-10 transition-all duration-500',
    scale: 'opacity-0 scale-95 transition-all duration-500',
  };

  const visibleClasses = {
    fade: 'opacity-100',
    'slide-up': 'opacity-100 translate-y-0',
    'slide-left': 'opacity-100 translate-x-0',
    'slide-right': 'opacity-100 translate-x-0',
    scale: 'opacity-100 scale-100',
  };

  return (
    <div
      className={cn(
        animations[type],
        isVisible && visibleClasses[type],
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
