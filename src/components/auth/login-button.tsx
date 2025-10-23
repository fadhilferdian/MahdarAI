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
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M15 6.3621C16.151 7.01962 17.1652 7.88636 17.9999 8.91355C18.8347 9.94074 19.4678 11.1095 19.8519 12.348C20.236 13.5866 20.3609 14.872 20.2177 16.1416C20.0745 17.4111 19.6673 18.6368 19.0224 19.742C18.3775 20.8472 17.5113 21.8083 16.4807 22.562C15.4501 23.3157 14.281 23.8436 13.0416 24.1084C11.8023 24.3732 10.5187 24.3686 9.2785 24.0952C8.03831 23.8218 6.87784 23.2868 5.86595 22.5299M8.00003 14H16M12 10V18M12 4C12.5304 4 13.0392 4.21071 13.4142 4.58579C13.7893 4.96086 14 5.46957 14 6C14 6.53043 13.7893 7.03914 13.4142 7.41421C13.0392 7.78929 12.5304 8 12 8C11.4696 8 10.9609 7.78929 10.5858 7.41421C10.2107 7.03914 10 6.53043 10 6C10 5.46957 10.2107 4.96086 10.5858 4.58579C10.9609 4.21071 11.4696 4 12 4Z" stroke-width="1.5" /><path d="M12 12V12C10.6635 11.3807 9.53073 10.3365 8.75544 9.00862C7.98015 7.68072 7.59827 6.13523 7.66532 4.57521C7.73238 3.01518 8.24522 1.5212 9.12215 0.311025" stroke-width="1.5" stroke-linecap="round" /><path d="M12 12V12C13.3365 11.3807 14.4693 10.3365 15.2446 9.00862C16.0199 7.68072 16.4017 6.13523 16.3347 4.57521C16.2676 3.01518 15.7548 1.5212 14.8779 0.311025" stroke-width="1.5" stroke-linecap="round" /></svg>
    </Button>
  );
}
