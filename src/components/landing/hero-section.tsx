
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Languages, ShieldCheck, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 lg:py-40 bg-card flex items-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-1 lg:gap-12 xl:grid-cols-1">
          <div className="flex flex-col justify-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
              Rapat Panjang? Biarkan Mahdar AI Meringkasnya untuk Anda.
            </h1>
            <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl">
              Unggah catatan, rekaman, atau file PDF Anda — dapatkan ringkasan otomatis dalam 3 bahasa: Indonesia, Inggris, dan Arab. Gratis. Tanpa login.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/summarizer">
                  Coba Sekarang Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#use-cases">
                  Lihat Contoh Hasil
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
