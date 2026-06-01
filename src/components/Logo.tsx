import { cn } from '@/lib/format';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 64 64"
        width="36"
        height="36"
        className="shrink-0"
        aria-hidden="true"
      >
        <ellipse cx="32" cy="22" rx="14" ry="6" fill="#3F8E3D" />
        <path
          d="M19 24c1 8 5 14 13 14s12-6 13-14H19z"
          fill="#5FA95C"
        />
        <path
          d="M19 30c1 6 4 10 13 10s12-4 13-10H19z"
          fill="#216321"
        />
        <circle cx="32" cy="14" r="6" fill="#CF2F2F" />
        <circle cx="32" cy="14" r="3" fill="#A92424" />
        <path
          d="M28 8c-2 1-3 3-2 5 1-1 3-2 5-2-1-2-2-3-3-3z"
          fill="#EF7474"
        />
      </svg>
      {showText && (
        <div className="leading-none">
          <div className="font-display text-base font-extrabold tracking-tight text-accent-600">
            Vivero
          </div>
          <div className="-mt-1 font-display text-base font-extrabold tracking-tight text-brand-700">
            Chiriquí
          </div>
        </div>
      )}
    </div>
  );
}
