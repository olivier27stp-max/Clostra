import { cn } from '@/lib/utils/cn';

interface ClostraLogoProps {
  size?: number;
  className?: string;
}

export function ClostraLogo({ size = 28, className }: ClostraLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
    >
      {/* Background rounded square */}
      <rect width="32" height="32" rx="8" fill="#111519" />

      {/* C arc with gradient */}
      <defs>
        <linearGradient id="clostra-grad" x1="6" y1="8" x2="26" y2="24">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>

      {/* Main C shape — open arc */}
      <path
        d="M21 8.5A9 9 0 1 0 21 23.5"
        stroke="url(#clostra-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Arrow tip at top of C — pointing outward/forward */}
      <path
        d="M19 5.5L22 8.5L19 11.5"
        stroke="#818CF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function ClostraLogomark({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
    >
      <defs>
        <linearGradient id="clostra-mark" x1="6" y1="8" x2="26" y2="24">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <path
        d="M21 8.5A9 9 0 1 0 21 23.5"
        stroke="url(#clostra-mark)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M19 5.5L22 8.5L19 11.5"
        stroke="#818CF8"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
