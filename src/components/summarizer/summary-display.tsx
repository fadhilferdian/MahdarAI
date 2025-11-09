'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SummarizeMeetingMinutesOutput } from '@/lib/types';

type SummaryDisplayProps = {
  summary: SummarizeMeetingMinutesOutput;
  originalFilename: string;
  onSave: () => Promise<{ success: boolean; error: string | null }>;
  isSaving: boolean;
};

export function SummaryDisplay({ summary, originalFilename, onSave, isSaving }: SummaryDisplayProps) {
  const { toast } = useToast();

  const handleCopy = (text: string, language: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard',
      description: `${language} summary has been copied.`,
    });
  };

  const handleDownload = (format: 'PDF' | 'DOCX') => {
    toast({
      title: 'Feature Not Implemented',
      description: `Downloading as ${format} is not yet available.`,
      variant: 'default',
    });
  };
  
  const handleSave = async () => {
    const result = await onSave();
    if(result.success) {
        toast({
            title: 'History Saved',
            description: 'The summary has been saved to your history.',
        });
    } else {
        toast({
            title: 'Save Failed',
            description: result.error || 'An unknown error occurred.',
            variant: 'destructive',
        });
    }
  }

  const parseSummary = (rawText: string) => {
    const sections: { [key: string]: string } = {
        '📜': 'Opening',
        '👥': 'Attendees',
        '💬': 'Discussion Points',
        '✅': 'Decisions & Recommendations',
        '🏁': 'Closing',
        'المقدمة': 'Opening',
        'الحضور': 'Attendees',
        'المحاور': 'Discussion Points',
        'التوصيات': 'Decisions & Recommendations',
        'الختام': 'Closing',
      };
      
      const lines = rawText.split('\n');
      const parsedContent: React.ReactNode[] = [];
      let currentSection: string[] = [];
      let currentTitle: string | null = null;
  
      const flushSection = () => {
        if (currentTitle) {
          parsedContent.push(
            <div key={currentTitle} className="mb-4">
              <h3 className="font-headline font-semibold text-lg mb-2">{currentTitle}</h3>
              <div className="space-y-1 text-muted-foreground">
                {currentSection.map((line, index) => <p key={index}>{line}</p>)}
              </div>
            </div>
          );
          currentSection = [];
        }
      };

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;
  
        let isNewSection = false;
        for (const key of Object.keys(sections)) {
          if (trimmedLine.includes(key)) {
            flushSection();
            currentTitle = trimmedLine;
            isNewSection = true;
            break;
          }
        }
  
        if (!isNewSection && currentTitle) {
          currentSection.push(trimmedLine);
        } else if (!isNewSection && !currentTitle) {
            // Handle cases where summary doesn't start with a section
            currentTitle = "Summary";
            currentSection.push(trimmedLine);
        }
      }
  
      flushSection();
  
      return parsedContent.length > 0 ? parsedContent : <p className="whitespace-pre-wrap">{rawText}</p>;
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Generated Summary</CardTitle>
          <p className="text-sm text-muted-foreground">Source: {originalFilename}</p>
          <div className="flex items-center space-x-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save to History
            </Button>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">Bahasa Indonesia</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(summary.indonesianSummary, 'Indonesian')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <ScrollArea className="h-[500px]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {parseSummary(summary.indonesianSummary)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline">English</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(summary.englishSummary, 'English')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <ScrollArea className="h-[500px]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {parseSummary(summary.englishSummary)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between" dir="rtl">
            <CardTitle className="font-headline">اللغة العربية</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(summary.arabicSummary, 'Arabic')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-6" dir="rtl">
            <ScrollArea className="h-[500px]">
              <div className="prose prose-sm dark:prose-invert max-w-none font-body text-right">
                {parseSummary(summary.arabicSummary)}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
