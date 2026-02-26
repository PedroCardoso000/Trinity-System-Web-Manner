import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullScreen?: boolean;
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  fullScreen = false,
  text = 'Carregando...'
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
    xl: 'h-24 w-24 border-4',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Círculo de fundo (Black) */}
        <div className={`${sizeClasses[size]} rounded-full border-neutral-800`}></div>
        {/* Spinner animado (Red Trinity) */}
        <div className={`${sizeClasses[size]} absolute top-0 left-0 rounded-full border-t-red-600 animate-spin`}></div>
      </div>
      {text && (
        <p className="text-neutral-400 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      {spinner}
    </div>
  );
};

export default Loading;
