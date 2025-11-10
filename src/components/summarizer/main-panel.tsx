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
  const [summary, setSummary] = useState<SummarizeMeetingMinutesOutput | null>(null);
  const [originalFilename, setOriginalFilename] = useState('');
  
  const { toast } = useToast();

  const handleProcessingStart = () => {
    setAppState('processingFile');
    setSummary(null);
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
    setOriginalFilename('Teks Manual');
    handleSummarize(extractedText, lang, targetLanguage);
  }

  const handleSummarize = async (textToSummarize: string, lang: Language, newTargetLanguage: Language) => {
    if (!textToSummarize.trim()) {
      setAppState('idle');
      toast({
        title: 'Tidak Ada Teks untuk Diringkas',
        description: 'Berkas tampaknya kosong atau tidak dapat dibaca.',
        variant: 'destructive',
      });
      return;
    }
    setAppState('summarizing');
    setSummary(null);
    
    const result = await summarize(textToSummarize, lang, newTargetLanguage);

    if (result.success && result.data) {
      setSummary(result.data);
      setAppState('complete');
    } else {
      toast({
        title: 'Gagal Membuat Ringkasan',
        description: result.error || 'Terjadi kesalahan yang tidak diketahui.',
        variant: 'destructive',
      });
      setAppState(extractedText ? 'fileReady' : 'idle'); 
    }
  };

  const handleTargetLanguageChange = (newLang: Language) => {
    setTargetLanguage(newLang);
    if (appState === 'complete' && extractedText) {
      handleSummarize(extractedText, sourceLanguage, newLang);
    }
  }

  const handleReset = () => {
    setAppState('idle');
    setInputMode('upload');
    setExtractedText('');
    setSummary(null);
    setOriginalFilename('');
    setTargetLanguage('id');
  };

  const isProcessing = appState === 'processingFile' || appState === 'summarizing';
  const showProcessingCard = appState === 'summarizing';
  const fileIsReady = appState === 'fileReady' || (inputMode === 'text' && extractedText.trim() && appState !== 'complete' && appState !== 'summarizing' && appState !== 'processingFile' )

  return (
    <div className="container py-8 w-full">
      <div className="flex flex-col items-center space-y-8">
        { appState !== 'complete' && !showProcessingCard ? (
          <Card className="w-full max-w-2xl">
            <CardContent className="p-6 space-y-4">
              <Tabs value={inputMode} onValueChange={(value) => setInputMode(value as InputMode)} className="w-full">
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
                    isProcessed={appState === 'fileReady' || appState === 'complete'}
                  />
                </TabsContent>
                <TabsContent value="text">
                    <div className="space-y-4 pt-4">
                        <Textarea
                            placeholder="Salin atau ketik teks Anda di sini..."
                            rows={12}
                            value={extractedText}
                            onChange={(e) => {
                              setExtractedText(e.target.value)
                              if (appState !== 'idle') {
                                  setAppState('idle');
                                  setSummary(null);
                              }
                            }}
                            disabled={isProcessing}
                        />
                    </div>
                </TabsContent>
              </Tabs>
              
              {fileIsReady && (
                <>
                  <div className="space-y-3 pt-4">
                      <Label htmlFor="target-language" className="text-center block">Bahasa Hasil Ringkasan</Label>
                      <div className="flex flex-wrap justify-center gap-2">
                          <Button
                              variant={targetLanguage === 'id' ? 'default' : 'outline'}
                              onClick={() => handleTargetLanguageChange('id')}
                              disabled={isProcessing}
                              className="flex-1 sm:flex-none"
                          >
                              Bahasa Indonesia
                          </Button>
                          <Button
                              variant={targetLanguage === 'en' ? 'default' : 'outline'}
                              onClick={() => handleTargetLanguageChange('en')}
                              disabled={isProcessing}
                              className="flex-1 sm:flex-none"
                          >
                              English
                          </Button>
                          <Button
                              variant={targetLanguage === 'ar' ? 'default' : 'outline'}
                              onClick={() => handleTargetLanguageChange('ar')}
                              disabled={isProcessing}
                              className="flex-1 sm:flex-none"
                          >
                              اللغة العربية
                          </Button>
                      </div>
                  </div>
                  <div className="flex justify-center pt-4">
                      <Button 
                          onClick={() => inputMode === 'upload' ? handleSummarize(extractedText, sourceLanguage, targetLanguage) : handleDirectTextProcess()} 
                          disabled={isProcessing}
                          size="lg"
                      >
                          {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Buat Ringkasan
                      </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ) : null }
        
        {showProcessingCard && (
             <Card className="w-full max-w-2xl">
                <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 font-semibold">
                        Sedang Membuat Ringkasan...
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Proses ini mungkin memerlukan beberapa saat.
                    </p>
                </CardContent>
             </Card>
        )}

        {appState === 'complete' && summary && (
            <div className="w-full max-w-2xl">
                 <Card className="mb-6">
                    <CardContent className="p-6">
                        <div className="space-y-3">
                            <Label htmlFor="target-language" className="text-center block">Ubah Bahasa Hasil Ringkasan</Label>
                            <div className="flex flex-wrap justify-center gap-2">
                                <Button
                                    variant={targetLanguage === 'id' ? 'default' : 'outline'}
                                    onClick={() => handleTargetLanguageChange('id')}
                                    disabled={isProcessing}
                                    className="flex-1 sm:flex-none"
                                >
                                    Bahasa Indonesia
                                </Button>
                                <Button
                                    variant={targetLanguage === 'en' ? 'default' : 'outline'}
                                    onClick={() => handleTargetLanguageChange('en')}
                                    disabled={isProcessing}
                                    className="flex-1 sm:flex-none"
                                >
                                    English
                                </Button>
                                <Button
                                    variant={targetLanguage === 'ar' ? 'default' : 'outline'}
                                    onClick={() => handleTargetLanguageChange('ar')}
                                    disabled={isProcessing}
                                    className="flex-1 sm:flex-none"
                                >
                                    اللغة العربية
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                 </Card>
                <SummaryDisplay
                    summary={summary}
                    originalFilename={originalFilename}
                    targetLanguage={targetLanguage}
                />
            </div>
        )}

        {(appState === 'complete' || appState === 'fileReady' ) && !isProcessing && (
             <div className="flex justify-center mt-4">
                <Button variant="outline" onClick={handleReset}>
                Buat Ringkasan Baru
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
