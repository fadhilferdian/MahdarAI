'use client';

import { useState } from 'react';
import { FileUploader } from './file-uploader';
import { SummaryDisplay } from './summary-display';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import type { SummarizeMeetingMinutesOutput, TranscribeAudioAndExtractTextOutput } from '@/lib/types';
import { saveHistory, summarize } from '@/lib/actions';

type AppState = 'idle' | 'processingFile' | 'editing' | 'summarizing' | 'complete';
type InputMode = 'text' | 'upload' | 'url';

export default function MainPanel() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [extractedText, setExtractedText] = useState('');
  const [language, setLanguage] = useState<'id' | 'ar'>('id');
  const [summary, setSummary] = useState<SummarizeMeetingMinutesOutput | null>(null);
  const [originalFilename, setOriginalFilename] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [url, setUrl] = useState('');

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

  const handleUrlProcess = () => {
    toast({
      title: 'Fitur Belum Tersedia',
      description: 'Pemrosesan dari URL akan segera hadir.',
    });
  }

  const handleDirectTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setExtractedText(text);
    if(text.trim().length > 0) {
        setAppState('editing');
    } else {
        setAppState('idle');
    }
  }

  const handleSummarize = async () => {
    if (!extractedText.trim()) {
      toast({
        title: 'No Text',
        description: 'There is no text to summarize.',
        variant: 'destructive',
      });
      return;
    }
    setAppState('summarizing');
    // Simple language detection for direct text input
    const lang = /[\u0600-\u06FF]/.test(extractedText) ? 'ar' : 'id';
    setLanguage(lang);

    const result = await summarize(extractedText, lang);

    if (result.success && result.data) {
      setSummary(result.data);
      if (inputMode === 'text') {
        setOriginalFilename('Teks Manual');
      } else if (inputMode === 'url') {
        setOriginalFilename(url);
      }
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
    setUrl('');
  };

  const isProcessing = appState === 'processingFile' || appState === 'summarizing';

  const renderContent = () => {
    if (appState === 'complete' && summary) {
      return (
        <>
          <SummaryDisplay
            summary={summary}
            originalFilename={originalFilename}
            onSave={handleSaveToHistory}
            isSaving={isSaving}
          />
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={handleReset}>
              Buat Ringkasan Baru
            </Button>
          </div>
        </>
      );
    }

    if (appState === 'editing' || appState === 'summarizing') {
        return (
            <Card className="w-full">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Edit Teks Hasil Ekstraksi</CardTitle>
              <CardDescription>
                Periksa dan edit teks sebelum membuat ringkasan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                placeholder="Teks hasil ekstraksi akan muncul di sini..."
                rows={15}
                disabled={appState === 'summarizing'}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleReset} disabled={appState === 'summarizing'}>
                  Mulai Lagi
                </Button>
                <Button onClick={handleSummarize} disabled={appState === 'summarizing'}>
                  {appState === 'summarizing' ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Buat Ringkasan
                </Button>
              </div>
            </CardContent>
          </Card>
        )
    }

    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="p-0">
          <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as InputMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upload">Unggah File</TabsTrigger>
              <TabsTrigger value="text">Teks</TabsTrigger>
              <TabsTrigger value="url">URL</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
              <FileUploader
                onProcessingStart={handleProcessingStart}
                onProcessingSuccess={handleProcessingSuccess}
                onProcessingError={handleProcessingError}
                disabled={appState === 'processingFile'}
              />
            </TabsContent>
            <TabsContent value="text">
                <div className="p-6 space-y-4">
                    <Textarea
                        placeholder="Tempel atau ketik teks Anda di sini..."
                        rows={12}
                        value={extractedText}
                        onChange={handleDirectTextChange}
                        disabled={isProcessing}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleSummarize} disabled={!extractedText.trim() || isProcessing}>
                            Buat Ringkasan
                        </Button>
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="url">
            <div className="p-6 space-y-4">
                    <Input
                        type="url"
                        placeholder="https://example.com/article"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isProcessing}
                    />
                     <div className="flex justify-end">
                        <Button onClick={handleUrlProcess} disabled={!url.trim() || isProcessing}>
                            Proses URL
                        </Button>
                    </div>
                </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex flex-col items-center space-y-8">
        {renderContent()}
      </div>
    </div>
  );
}
