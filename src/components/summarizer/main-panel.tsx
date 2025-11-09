'use client';

import { useState } from 'react';
import { FileUploader } from './file-uploader';
import { SummaryDisplay } from './summary-display';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SummarizeMeetingMinutesOutput, TranscribeAudioAndExtractTextOutput } from '@/lib/types';
import { summarize } from '@/lib/actions';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AppState = 'idle' | 'processingFile' | 'summarizing' | 'complete';
type InputMode = 'text' | 'upload' | 'url';
type Language = 'id' | 'ar' | 'en';

export default function MainPanel() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [extractedText, setExtractedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<Language>('id');
  const [targetLanguage, setTargetLanguage] = useState<Language>('id');
  const [summary, setSummary] = useState<SummarizeMeetingMinutesOutput | null>(null);
  const [originalFilename, setOriginalFilename] = useState('');
  const [url, setUrl] = useState('');

  const { toast } = useToast();

  const handleProcessingStart = () => {
    setAppState('processingFile');
    setSummary(null);
    setExtractedText('');
  };

  const handleProcessingSuccess = async (data: TranscribeAudioAndExtractTextOutput, filename: string) => {
    setExtractedText(data.extractedText);
    setSourceLanguage(data.language);
    setOriginalFilename(filename);
    await handleSummarize(data.extractedText, data.language, filename);
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

  const handleDirectTextProcess = () => {
    if (!extractedText.trim()) {
      toast({
        title: 'Teks Kosong',
        description: 'Silakan masukkan teks untuk diringkas.',
        variant: 'destructive'
      });
      return;
    }
    const lang: Language = /[\u0600-\u06FF]/.test(extractedText) ? 'ar' : (/[a-zA-Z]/.test(extractedText) ? 'en' : 'id');
    setSourceLanguage(lang);
    handleSummarize(extractedText, lang, 'Teks Manual');
  }

  const handleSummarize = async (textToSummarize: string, lang: Language, filename: string) => {
    if (!textToSummarize.trim()) {
      toast({
        title: 'No Text',
        description: 'There is no text to summarize.',
        variant: 'destructive',
      });
      return;
    }
    setAppState('summarizing');
    setSummary(null);
    setOriginalFilename(filename);
    
    const result = await summarize(textToSummarize, lang, targetLanguage);

    if (result.success && result.data) {
      setSummary(result.data);
      setAppState('complete');
    } else {
      toast({
        title: 'Summarization Failed',
        description: result.error || 'An unknown error occurred.',
        variant: 'destructive',
      });
      setAppState('idle');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setExtractedText('');
    setSummary(null);
    setOriginalFilename('');
    setUrl('');
  };

  const isProcessing = appState === 'processingFile' || appState === 'summarizing';

  return (
    <div className="container py-8 w-full">
      <div className="flex flex-col items-center space-y-8">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 space-y-4">
            <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as InputMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" disabled={isProcessing}>Unggah File</TabsTrigger>
                <TabsTrigger value="text" disabled={isProcessing}>Teks</TabsTrigger>
                <TabsTrigger value="url" disabled={isProcessing}>URL</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <FileUploader
                  onProcessingStart={handleProcessingStart}
                  onProcessingSuccess={handleProcessingSuccess}
                  onProcessingError={handleProcessingError}
                  disabled={isProcessing}
                />
              </TabsContent>
              <TabsContent value="text">
                  <div className="space-y-4 pt-4">
                      <Textarea
                          placeholder="Tempel atau ketik teks Anda di sini..."
                          rows={12}
                          value={extractedText}
                          onChange={(e) => setExtractedText(e.target.value)}
                          disabled={isProcessing}
                      />
                      <div className="flex justify-end">
                          <Button onClick={handleDirectTextProcess} disabled={!extractedText.trim() || isProcessing}>
                              Buat Ringkasan
                          </Button>
                      </div>
                  </div>
              </TabsContent>
              <TabsContent value="url">
              <div className="space-y-4 pt-4">
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
             <div className="space-y-3 pt-4">
                <Label htmlFor="target-language" className="text-center block">Bahasa Hasil Ringkasan</Label>
                <div className="flex flex-wrap justify-center gap-2">
                    <Button
                        variant={targetLanguage === 'id' ? 'default' : 'outline'}
                        onClick={() => setTargetLanguage('id')}
                        disabled={isProcessing}
                        className={cn('flex-grow sm:flex-grow-0')}
                    >
                        Bahasa Indonesia
                    </Button>
                     <Button
                        variant={targetLanguage === 'en' ? 'default' : 'outline'}
                        onClick={() => setTargetLanguage('en')}
                        disabled={isProcessing}
                        className={cn('flex-grow sm:flex-grow-0')}
                    >
                        English
                    </Button>
                     <Button
                        variant={targetLanguage === 'ar' ? 'default' : 'outline'}
                        onClick={() => setTargetLanguage('ar')}
                        disabled={isProcessing}
                        className={cn('flex-grow sm:flex-grow-0')}
                    >
                        اللغة العربية
                    </Button>
                </div>
            </div>
          </CardContent>
        </Card>
        
        {isProcessing && (
             <Card className="w-full max-w-2xl">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 font-semibold">
                        {appState === 'processingFile' ? 'Mengekstrak Teks...' : 'Membuat Ringkasan...'}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Ini mungkin perlu beberapa saat.
                    </p>
                </CardContent>
             </Card>
        )}

        {appState === 'complete' && summary && (
            <div className="w-full max-w-2xl">
                <SummaryDisplay
                    summary={summary}
                    originalFilename={originalFilename}
                    targetLanguage={targetLanguage}
                />
                <div className="flex justify-center mt-8">
                    <Button variant="outline" onClick={handleReset}>
                    Buat Ringkasan Baru
                    </Button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
