
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function DemoSection() {
  return (
    <section id="demo" className="w-full py-20 md:py-32 bg-card flex items-center">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline mb-4">
          Coba Sekarang Tanpa Daftar
        </h2>
        <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl mb-8">
          Rasakan kemudahan meringkas dokumen dan rekaman suara secara langsung. Klik tombol di bawah untuk menuju halaman demo.
        </p>
        <Button asChild size="lg">
          <Link href="/summarizer">
            Mulai Meringkas <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
