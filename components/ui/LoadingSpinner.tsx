import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  color?: 'blue' | 'white' | 'gray';
}

const colorClasses = {
  blue: 'text-nutri-blue',
  white: 'text-white',
  gray: 'text-gray-400',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 32, 
  className = '',
  color = 'blue' 
}) => {
  return (
    <Loader2 
      className={`animate-spin ${colorClasses[color]} ${className}`} 
      size={size} 
    />
  );
};

export default LoadingSpinner;
