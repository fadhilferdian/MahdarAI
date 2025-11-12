
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-10 w-10 text-primary-foreground" />
          <span className="font-headline text-xl font-bold tracking-tight">
            Mahdar AI
          </span>
        </Link>
        
        <div className="flex items-center justify-end space-x-4">
          <Button asChild>
            <Link href="/summarizer">
              Coba Sekarang <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
