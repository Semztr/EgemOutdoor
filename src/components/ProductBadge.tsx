import { BADGE_LABELS, BADGE_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProductBadgeProps {
  badge: 'popular' | 'bestseller' | 'new' | 'discount' | 'featured';
  className?: string;
}

export function ProductBadge({ badge, className }: ProductBadgeProps) {
  if (!badge) return null;

  const label = BADGE_LABELS[badge];
  const colors = BADGE_COLORS[badge];

  return (
    <span
      className={cn(
        'absolute top-2 right-2 z-10 px-3 py-1 text-xs font-semibold rounded-full shadow-lg',
        colors,
        className
      )}
    >
      {label}
    </span>
  );
}
