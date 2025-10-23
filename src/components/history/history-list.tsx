'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import type { Summary } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LoginButton } from '@/components/auth/login-button';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function HistoryList() {
  const { user, loading } = useAuth();
  const [history, setHistory] = useState<Summary[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        const q = query(
          collection(db, 'summaries'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const summaries = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Summary)
        );
        setHistory(summaries);
        setIsLoadingHistory(false);
      };
      fetchHistory();
    } else if (!loading) {
      setIsLoadingHistory(false);
    }
  }, [user, loading]);

  if (loading || isLoadingHistory) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <p className="mb-4 text-muted-foreground">
          Please log in to view your summary history.
        </p>
        <LoginButton />
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">You have no saved summaries yet.</p>
      </Card>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {history.map((item) => (
        <AccordionItem value={item.id} key={item.id}>
          <AccordionTrigger>
            <div className="flex justify-between w-full pr-4">
                <span className="font-semibold truncate">{item.originalFilename}</span>
                <span className="text-sm text-muted-foreground">
                    {item.createdAt ? format(item.createdAt.toDate(), 'PPP') : 'N/A'}
                </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                <Card>
                    <CardContent className="p-4">
                        <h3 className="font-headline mb-2">Bahasa Indonesia</h3>
                        <Separator className="mb-4" />
                        <ScrollArea className="h-64">
                            <p className="text-sm whitespace-pre-wrap">{item.indonesianSummary}</p>
                        </ScrollArea>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-right" dir="rtl">
                        <h3 className="font-headline mb-2">اللغة العربية</h3>
                        <Separator className="mb-4" />
                        <ScrollArea className="h-64">
                             <p className="text-sm whitespace-pre-wrap">{item.arabicSummary}</p>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
