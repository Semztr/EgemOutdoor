import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

export function LoadingSpinner({ 
  size = 'md', 
  className,
  fullScreen = false,
  text,
}: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={cn(sizeClasses[size], 'animate-spin text-primary', className)} />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
}

// Page loading component
export function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" text="Yükleniyor..." />
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 h-48 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  );
}
