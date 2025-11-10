'use client';

import { useState, useEffect } from 'react';
import { FileUploader } from './file-uploader';
import { SummaryDisplay } from './summary-display';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  useEffect(() => {
    document.documentElement.dir = targetLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [targetLanguage]);

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
    if (appState === 'complete') {
      if (summariesCache[newLang]) {
        setCurrentSummary(summariesCache[newLang]!);
      } else {
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
  const isInputReady = appState === 'fileReady' || appState === 'complete' || appState === 'summarizing';

  return (
    <div className="container py-8 w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        
        {/* Input Panel */}
        <div className="flex flex-col space-y-6">
          <Card className="flex-grow">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Input Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs 
                value={inputMode} 
                onValueChange={(value) => {
                  if(!isProcessing) handleReset(); setInputMode(value as InputMode)
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

          <Card>
              <CardContent className="p-6 space-y-6">
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
                    <div className="flex justify-center pt-4">
                      <Button 
                          onClick={handleSummarize} 
                          disabled={isProcessing || !isInputReady}
                          size="lg"
                      >
                          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Buat Ringkasan
                      </Button>
                  </div>
              </CardContent>
          </Card>

           {appState === 'complete' && (
              <div className="flex justify-center">
                  <Button variant="outline" onClick={handleReset} disabled={isProcessing}>
                      Buat Ringkasan Baru
                  </Button>
              </div>
            )}
        </div>

        {/* Result Panel */}
        <div className="relative">
            <SummaryDisplay
                summary={currentSummary}
                originalFilename={originalFilename}
                targetLanguage={targetLanguage}
                isLoading={appState === 'summarizing'}
            />
        </div>
      </div>
    </div>
  );
}
