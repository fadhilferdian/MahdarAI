'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { UserNav } from '@/components/auth/user-nav';
import { LoginButton } from '@/components/auth/login-button';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold tracking-tight">
            <span className="text-primary">محضر</span> | Mahdar AI
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <p className="hidden text-sm text-muted-foreground font-headline italic md:block">
            "من الصوت أو المستند إلى المحضر الذكي"
          </p>
          <nav className="flex items-center space-x-2">
            {loading ? <Skeleton className="h-10 w-24" /> : user ? <UserNav /> : <LoginButton />}
          </nav>
        </div>
      </div>
    </header>
  );
}
