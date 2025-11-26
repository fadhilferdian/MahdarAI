
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase, Podcast, FileCode } from 'lucide-react';

const useCases = [
  {
    icon: <Briefcase className="h-8 w-8 mb-4 text-primary" />,
    title: 'Rapat Tim',
    description: 'Ringkas hasil diskusi 1 jam jadi 5 poin utama yang bisa langsung ditindaklanjuti.',
  },
  {
    icon: <Podcast className="h-8 w-8 mb-4 text-primary" />,
    title: 'Podcast & Wawancara',
    description: 'Ubah transkrip audio yang panjang menjadi insight singkat dan poin-poin penting.',
  },
  {
    icon: <FileCode className="h-8 w-8 mb-4 text-primary" />,
    title: 'Dokumen Proyek',
    description: 'Sederhanakan laporan teknis yang kompleks ke dalam bahasa yang mudah dipahami semua orang.',
  },
];

export function UseCasesSection() {
  return (
    <section id="use-cases" className="w-full py-20 md:py-32 bg-card flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
                Gunakan Mahdar AI untuk Semua Jenis Catatan
            </h2>
        </div>
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <Card key={useCase.title}>
              <CardHeader>
                {useCase.icon}
                <CardTitle>{useCase.title}</CardTitle>
                <CardDescription>{useCase.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
