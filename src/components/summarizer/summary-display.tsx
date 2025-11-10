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

const languageTitles = {
    id: 'Bahasa Indonesia',
    ar: 'اللغة العربية',
    en: 'English',
}

function formatSummary(summary: string) {
  return summary
    .replace(/KESIMPULAN:|الاستنتاجات:|CONCLUSIONS:/g, '<strong>KESIMPULAN:</strong>')
    .replace(/ACTION ITEMS:|بنود العمل:|ACTION ITEMS:/g, '<strong>ACTION ITEMS:</strong>')
    .replace(/\n/g, '<br />');
}

export function SummaryDisplay({ summary, originalFilename, targetLanguage }: SummaryDisplayProps) {
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
  
  const formattedSummary = formatSummary(summary.summary);

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Hasil Ringkasan</CardTitle>
          <p className="text-sm text-muted-foreground">Sumber: {originalFilename}</p>
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
      </Card>
      <div className="grid grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <CardTitle className="font-headline">{languageTitles[targetLanguage]}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(summary.summary)}
              aria-label="Salin Ringkasan"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <Separator />
          <CardContent className="p-6" dir={targetLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <ScrollArea className="h-[500px]">
              <div
                className={`prose prose-sm dark:prose-invert max-w-none ${targetLanguage === 'ar' ? 'font-arabic text-right' : ''}`}
                dangerouslySetInnerHTML={{ __html: formattedSummary }}
              />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
