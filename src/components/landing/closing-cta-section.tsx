
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function ClosingCtaSection() {
  return (
    <section id="closing-cta" className="w-full py-20 md:py-32 flex items-center">
      <div className="container text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline mb-4">
          Hemat Waktu. Pahami Isi Rapat dalam Hitungan Detik.
        </h2>
        <div className="mt-8">
            <Button asChild size="lg">
                <Link href="/summarizer">
                    Unggah & Ringkas Sekarang – Gratis Tanpa Login
                </Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
