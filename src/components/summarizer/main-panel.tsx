'use client';

import { useState } from 'react';
import { FileUploader } from './file-uploader';
import { SummaryDisplay } from './summary-display';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { SummarizeMeetingMinutesOutput, TranscribeAudioAndExtractTextOutput } from '@/lib/types';
import { saveHistory, summarize } from '@/lib/actions';

type AppState = 'idle' | 'processingFile' | 'editing' | 'summarizing' | 'complete';

export default function MainPanel() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [extractedText, setExtractedText] = useState('');
  const [language, setLanguage] = useState<'id' | 'ar'>('id');
  const [summary, setSummary] = useState<SummarizeMeetingMinutesOutput | null>(null);
  const [originalFilename, setOriginalFilename] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();

  const handleProcessingStart = () => {
    setAppState('processingFile');
    setSummary(null);
    setExtractedText('');
  };

  const handleProcessingSuccess = (data: TranscribeAudioAndExtractTextOutput, filename: string) => {
    setExtractedText(data.extractedText);
    setLanguage(data.language);
    setOriginalFilename(filename);
    setAppState('editing');
  };

  const handleProcessingError = (error: string) => {
    toast({
      title: 'Processing Error',
      description: error,
      variant: 'destructive',
    });
    setAppState('idle');
  };

  const handleSummarize = async () => {
    if (!extractedText) {
      toast({
        title: 'No Text',
        description: 'There is no text to summarize.',
        variant: 'destructive',
      });
      return;
    }
    setAppState('summarizing');
    const result = await summarize(extractedText, language);

    if (result.success && result.data) {
      setSummary(result.data);
      setAppState('complete');
    } else {
      toast({
        title: 'Summarization Failed',
        description: result.error || 'An unknown error occurred.',
        variant: 'destructive',
      });
      setAppState('editing');
    }
  };

  const handleSaveToHistory = async () => {
    if (!summary) return { success: false, error: 'No summary to save.' };
    if (!user) {
        toast({
            title: 'Not Logged In',
            description: 'You must be logged in to save history.',
            variant: 'destructive'
        });
        return { success: false, error: 'You must be logged in to save history.' };
    }

    setIsSaving(true);
    const result = await saveHistory(summary, originalFilename, user.uid);
    setIsSaving(false);
    return result;
  };

  const handleReset = () => {
    setAppState('idle');
    setExtractedText('');
    setSummary(null);
    setOriginalFilename('');
  };

  const isProcessing = appState === 'processingFile' || appState === 'summarizing';

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center space-y-8">
        {(appState === 'idle' || appState === 'processingFile') && (
          <FileUploader
            onProcessingStart={handleProcessingStart}
            onProcessingSuccess={handleProcessingSuccess}
            onProcessingError={handleProcessingError}
            disabled={appState === 'processingFile'}
          />
        )}

        {(appState === 'editing' || appState === 'summarizing') && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Edit Extracted Text</CardTitle>
              <CardDescription>
                Review and edit the text extracted from your file before generating the summary.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Extracted text will appear here..."
                rows={15}
                disabled={appState === 'summarizing'}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleReset} disabled={appState === 'summarizing'}>
                  Start Over
                </Button>
                <Button onClick={handleSummarize} disabled={appState === 'summarizing'}>
                  {appState === 'summarizing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Generate Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {appState === 'complete' && summary && (
          <>
            <SummaryDisplay
              summary={summary}
              originalFilename={originalFilename}
              onSave={handleSaveToHistory}
              isSaving={isSaving}
            />
            <Button variant="outline" onClick={handleReset}>
              Create New Summary
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
