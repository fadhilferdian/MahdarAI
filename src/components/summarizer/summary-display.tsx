'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Copy, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { SummarizeMeetingMinutesOutput } from '@/lib/types';
import { Loader2 } from 'lucide-react';

type SummaryDisplayProps = {
  summary: SummarizeMeetingMinutesOutput | null;
  originalFilename: string;
  targetLanguage: 'id' | 'ar' | 'en';
  isLoading: boolean;
};

const languageTitles = {
    id: 'Bahasa Indonesia',
    ar: 'اللغة العربية',
    en: 'English',
}

function formatSummary(summary: string) {
  return summary
    .replace(/KESIMPULAN/g, '<strong>KESIMPULAN</strong>')
    .replace(/CONCLUSIONS/g, '<strong>CONCLUSIONS</strong>')
    .replace(/الخلاصة/g, '<strong>الخلاصة</strong>')
    .replace(/ACTION ITEMS/g, '<strong>ACTION ITEMS</strong>')
    .replace(/المهام المطلوبة/g, '<strong>المهام المطلوبة</strong>')
    .replace(/\n/g, '<br />');
}

export function SummaryDisplay({ summary, originalFilename, targetLanguage, isLoading }: SummaryDisplayProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    const plainText = text.replace(/<br \/>/g, '\n').replace(/<strong>|<\/strong>/g, '');
    navigator.clipboard.writeText(plainText);
    toast({
      title: 'Tersalin ke Papan Klip',
      description: `Ringkasan telah berhasil disalin.`,
    });
  };

  const handleDownload = (format: 'PDF' | 'DOCX') => {
    toast({
      title: 'Fitur Belum Tersedia',
      description: `Pengunduhan dalam format ${format} belum dapat dilakukan saat ini.`,
      variant: 'default',
    });
  };
  
  const formattedSummary = summary ? formatSummary(summary.summary) : '';

  const renderContent = () => {
    if (isLoading && !summary) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 font-semibold">Sedang Membuat Ringkasan...</p>
            <p className="text-sm text-muted-foreground mt-1">Proses ini mungkin memerlukan beberapa saat.</p>
        </div>
      )
    }

    if (!summary) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
                <FileText className="h-16 w-16 mb-4" />
                <h3 className="font-semibold text-lg">Hasil Ringkasan Anda</h3>
                <p className="max-w-xs">Hasil ringkasan akan ditampilkan di sini setelah Anda memproses sebuah berkas atau teks.</p>
            </div>
        )
    }

    return (
        <>
            <CardHeader className="flex flex-row items-start justify-between">
                <div>
                    <CardTitle className="font-headline text-2xl">Hasil Ringkasan</CardTitle>
                    <p className="text-sm text-muted-foreground">Sumber: {originalFilename}</p>
                </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownload('PDF')}>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDownload('DOCX')}>
                    <Download className="mr-2 h-4 w-4" />
                    Unduh DOCX
                    </Button>
                </div>
            </CardHeader>
            <Separator />
            <div className="relative">
                 {isLoading && (
                     <div className="absolute inset-0 bg-background/80 dark:bg-background/80 z-10 flex items-center justify-center rounded-b-lg">
                        <div className="flex flex-col items-center text-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                             <p className="mt-4 font-semibold">
                                Sedang Memperbarui Ringkasan...
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Proses ini mungkin memerlukan beberapa saat.
                            </p>
                        </div>
                     </div>
                )}
                <div className={isLoading ? 'opacity-50' : ''}>
                    <div className="flex items-center justify-between p-4 border-b" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
                        <h4 className="font-semibold">{languageTitles[targetLanguage]}</h4>
                        <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(summary.summary)}
                        aria-label="Salin Ringkasan"
                        >
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardContent className="p-0">
                        <ScrollArea className="h-[450px] lg:h-[calc(100vh-22rem)]">
                        <div
                            className={`prose prose-sm dark:prose-invert max-w-none p-6 ${targetLanguage === 'ar' ? 'text-right' : ''}`}
                            dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}
                            dangerouslySetInnerHTML={{ __html: formattedSummary }}
                        />
                        </ScrollArea>
                    </CardContent>
                </div>
            </div>
        </>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      {renderContent()}
    </Card>
  );
}
