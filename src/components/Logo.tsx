import Image from 'next/image';
import { cn } from '@/lib/format';

interface LogoProps {
  className?: string;
}

const LOGO_WIDTH = 4672;
const LOGO_HEIGHT = 2298;

export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Vivero Chiriquí"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={cn('h-11 w-auto max-w-full', className)}
      priority
    />
  );
}
