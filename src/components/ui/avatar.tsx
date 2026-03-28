import { cn } from '@/lib/utils/cn';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-11 w-11 text-sm',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getColor(name: string): { bg: string; text: string } {
  const palette = [
    { bg: '#EEF2FF', text: '#4F46E5' },
    { bg: '#F0FDF4', text: '#16A34A' },
    { bg: '#FEF3C7', text: '#B45309' },
    { bg: '#FFF1F2', text: '#E11D48' },
    { bg: '#F0F9FF', text: '#0369A1' },
    { bg: '#FAF5FF', text: '#7C3AED' },
    { bg: '#ECFDF5', text: '#059669' },
    { bg: '#FFF7ED', text: '#C2410C' },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('shrink-0 rounded-full object-cover', sizeClasses[size], className)}
      />
    );
  }

  const color = getColor(name);

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold select-none',
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: color.bg, color: color.text }}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
