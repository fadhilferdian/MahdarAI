'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SummarizeMeetingMinutesOutput } from '@/lib/types';

type SummaryDisplayProps = {
  summary: SummarizeMeetingMinutesOutput;
  originalFilename: string;
  targetLanguage: 'id' | 'ar' | 'en';
};

const languageNames = {
  id: 'Indonesian',
  ar: 'Arabic',
  en: 'English',
};

const languageTitles = {
    id: 'Bahasa Indonesia',
    ar: 'اللغة العربية',
    en: 'English',
}

export function SummaryDisplay({ summary, originalFilename, targetLanguage }: SummaryDisplayProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: `Summary has been copied.`,
    });
  };

  const handleDownload = (format: 'PDF' | 'DOCX') => {
    toast({
      title: 'Feature Not Implemented',
      description: `Downloading as ${format} is not yet available.`,
      variant: 'default',
    });
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Generated Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Source: {originalFilename}</p>
          <div className="flex items-center space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => handleDownload('PDF')}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDownload('DOCX')}>
              <Download className="mr-2 h-4 w-4" />
              Download DOCX
            </Button>
          </div>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <CardTitle className="font-headline">{languageTitles[targetLanguage]}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(summary.summary)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-6" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <ScrollArea className="h-[500px]">
              <div className={`prose prose-sm dark:prose-invert max-w-none ${targetLanguage === 'ar' ? 'font-body text-right' : ''}`}>
                 <p className="whitespace-pre-wrap">{summary.summary}</p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
