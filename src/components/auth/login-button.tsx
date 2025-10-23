'use client';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';

export function LoginButton() {
  const { toast } = useToast();

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      toast({
        title: 'Login Failed',
        description: 'There was an error while trying to log in. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button onClick={handleLogin} variant="outline" size="icon" aria-label="Login with Google">
      <LogIn className="h-5 w-5" />
    </Button>
  );
}
