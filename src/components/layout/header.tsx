'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold tracking-tight">
            <span className="text-primary">محضر</span> | Mahdar AI
          </span>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
           <p className="hidden text-sm text-muted-foreground font-arabic italic md:block">
            "من الصوت أو المستند إلى المحضر الذكي"
          </p>
        </div>
        <div className="flex items-center justify-end space-x-4">
          {/* Placeholder for future elements */}
        </div>
      </div>
    </header>
  );
}
