'use client';

import { useState } from 'react';
import { FileUploader } from './file-uploader';
import { SummaryDisplay } from './summary-display';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SummarizeMeetingMinutesOutput, TranscribeAudioAndExtractTextOutput } from '@/lib/types';
import { summarize } from '@/lib/actions';
import { Label } from '@/components/ui/label';

type AppState = 'idle' | 'processingFile' | 'fileReady' | 'summarizing' | 'complete';
type InputMode = 'upload' | 'text';
type Language = 'id' | 'ar' | 'en';

export default function MainPanel() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [inputMode, setInputMode] = useState<InputMode>('upload');
  const [extractedText, setExtractedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<Language>('id');
  const [targetLanguage, setTargetLanguage] = useState<Language>('id');
  const [currentSummary, setCurrentSummary] = useState<SummarizeMeetingMinutesOutput | null>(null);
  const [summariesCache, setSummariesCache] = useState<Partial<Record<Language, SummarizeMeetingMinutesOutput>>>({});
  const [originalFilename, setOriginalFilename] = useState('');
  
  const { toast } = useToast();

  const handleProcessingStart = () => {
    setAppState('processingFile');
    setCurrentSummary(null);
    setSummariesCache({});
    setExtractedText('');
    setOriginalFilename('');
  };

  const handleFileProcessed = () => {
    setAppState('fileReady');
  }

  const handleProcessingSuccess = (data: TranscribeAudioAndExtractTextOutput, filename: string) => {
    setExtractedText(data.extractedText);
    setSourceLanguage(data.language);
    setOriginalFilename(filename);
  };

  const handleProcessingError = (error: string) => {
    toast({
      title: 'Kesalahan Pemrosesan Berkas',
      description: error,
      variant: 'destructive',
    });
    setAppState('idle');
  };
  
  const handleDirectTextChange = (text: string) => {
    setExtractedText(text);
    setCurrentSummary(null);
    setSummariesCache({});
    if (text.trim()) {
      const lang: Language = /[\u0600-\u06FF]/.test(text) ? 'ar' : (/[a-zA-Z]/.test(text) ? 'en' : 'id');
      setSourceLanguage(lang);
      setOriginalFilename('Teks Manual');
      setAppState('fileReady');
    } else {
      setAppState('idle');
    }
  }


  const handleSummarize = async () => {
    if (!extractedText.trim()) {
      toast({
        title: 'Tidak Ada Teks untuk Diringkas',
        description: 'Teks sumber kosong atau belum siap.',
        variant: 'destructive',
      });
      return;
    }

    if (summariesCache[targetLanguage]) {
      setCurrentSummary(summariesCache[targetLanguage]!);
      setAppState('complete');
      return;
    }

    setAppState('summarizing');
    
    const result = await summarize(extractedText, sourceLanguage, targetLanguage);

    if (result.success && result.data) {
      const newCache = { ...summariesCache, [targetLanguage]: result.data };
      setSummariesCache(newCache);
      setCurrentSummary(result.data);
      setAppState('complete');
    } else {
      toast({
        title: 'Gagal Membuat Ringkasan',
        description: result.error || 'Terjadi kesalahan yang tidak diketahui.',
        variant: 'destructive',
      });
      setAppState(currentSummary ? 'complete' : 'fileReady');
    }
  };

  const handleTargetLanguageChange = (newLang: Language) => {
    setTargetLanguage(newLang);
    if (appState === 'complete' || appState === 'fileReady') {
      // If cached, show immediately
      if (summariesCache[newLang]) {
        setCurrentSummary(summariesCache[newLang]!);
      } else if(currentSummary) {
        // if there's an active summary, generate the new one
        handleSummarizeBasedOnNewLang(newLang);
      }
    }
  }

  const handleSummarizeBasedOnNewLang = async (newLang: Language) => {
    setAppState('summarizing');
    const result = await summarize(extractedText, sourceLanguage, newLang);
     if (result.success && result.data) {
      const newCache = { ...summariesCache, [newLang]: result.data };
      setSummariesCache(newCache);
      setCurrentSummary(result.data);
      setAppState('complete');
    } else {
      toast({
        title: 'Gagal Membuat Ringkasan',
        description: result.error || 'Terjadi kesalahan yang tidak diketahui.',
        variant: 'destructive',
      });
      setAppState('complete'); 
    }
  }


  const handleReset = () => {
    setAppState('idle');
    setInputMode('upload');
    setExtractedText('');
    setCurrentSummary(null);
    setSummariesCache({});
    setOriginalFilename('');
    setTargetLanguage('id');
  };

  const isProcessing = appState === 'processingFile' || appState === 'summarizing';
  const showSummaryControls = appState === 'fileReady' || appState === 'complete' || appState === 'summarizing';

  return (
    <div className="container py-8 w-full">
      <div className="flex flex-col items-center space-y-8">
        
        <Card className="w-full max-w-2xl">
            <CardContent className="p-6 space-y-4">
              <Tabs 
                value={inputMode} 
                onValueChange={(value) => {
                  if(!isProcessing) setInputMode(value as InputMode)
                }} 
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload" disabled={isProcessing}>Unggah Berkas</TabsTrigger>
                  <TabsTrigger value="text" disabled={isProcessing}>Teks Manual</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <FileUploader
                    onProcessingStart={handleProcessingStart}
                    onProcessingSuccess={handleProcessingSuccess}
                    onProcessingError={handleProcessingError}
                    onProcessingComplete={handleFileProcessed}
                    disabled={isProcessing}
                    isProcessed={appState === 'fileReady' && inputMode === 'upload'}
                  />
                </TabsContent>
                <TabsContent value="text">
                    <div className="space-y-4 pt-4">
                        <Textarea
                            placeholder="Salin atau ketik teks Anda di sini untuk diringkas..."
                            rows={12}
                            value={extractedText}
                            onChange={(e) => handleDirectTextChange(e.target.value)}
                            disabled={isProcessing}
                        />
                    </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

        {showSummaryControls && (
            <div className="w-full max-w-2xl space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            <Label htmlFor="target-language" className="text-center block">Pilih Bahasa Hasil Ringkasan</Label>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Button
                                    variant={targetLanguage === 'id' ? 'default' : 'outline'}
                                    onClick={() => handleTargetLanguageChange('id')}
                                    disabled={isProcessing}
                                    className="flex-1 min-w-[140px] sm:flex-none"
                                >
                                    Bahasa Indonesia
                                </Button>
                                <Button
                                    variant={targetLanguage === 'en' ? 'default' : 'outline'}
                                    onClick={() => handleTargetLanguageChange('en')}
                                    disabled={isProcessing}
                                    className="flex-1 min-w-[140px] sm:flex-none"
                                >
                                    English
                                </Button>
                                <Button
                                    variant={targetLanguage === 'ar' ? 'default' : 'outline'}
                                    onClick={() => handleTargetLanguageChange('ar')}
                                    disabled={isProcessing}
                                    className="flex-1 min-w-[140px] sm:flex-none"
                                >
                                    اللغة العربية
                                </Button>
                            </div>
                        </div>
                         {(appState === 'fileReady' && !currentSummary) && (
                            <div className="flex justify-center pt-6">
                                <Button 
                                    onClick={handleSummarize} 
                                    disabled={isProcessing}
                                    size="lg"
                                >
                                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Buat Ringkasan
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        )}

        {(currentSummary || appState === 'summarizing') && (
            <div className="w-full max-w-2xl relative">
                {appState === 'summarizing' && (
                     <div className="absolute inset-0 bg-background/80 dark:bg-background/80 z-10 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                             <p className="mt-4 font-semibold">
                                Sedang Membuat Ringkasan...
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Proses ini mungkin memerlukan beberapa saat.
                            </p>
                        </div>
                     </div>
                )}
                {currentSummary && (
                    <div className="space-y-8">
                        <SummaryDisplay
                            summary={currentSummary}
                            originalFilename={originalFilename}
                            targetLanguage={targetLanguage}
                        />
                         <div className="flex justify-center">
                            <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                                Buat Ringkasan Baru
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
