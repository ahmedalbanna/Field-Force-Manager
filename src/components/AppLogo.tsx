import { Building } from 'lucide-react';
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function AppLogo({ className, iconSize = 24, textSize = "text-xl" }: AppLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <Building color="hsl(var(--primary))" size={iconSize} />
      <span className={`font-headline font-semibold ${textSize} text-foreground`}>
        Field Force Manager
      </span>
    </Link>
  );
}
