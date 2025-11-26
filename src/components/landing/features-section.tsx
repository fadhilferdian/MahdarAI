
import { FileText, Languages, Zap, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: 'Meringkas Semua Format',
    description: 'Unggah teks, audio rapat, atau file PDF — Mahdar AI mengenali dan meringkas semuanya.',
  },
  {
    icon: <Languages className="h-8 w-8 text-primary" />,
    title: 'Tiga Bahasa Otomatis',
    description: 'Dapatkan ringkasan dalam Bahasa Indonesia, Inggris, dan Arab — siap dibagikan ke tim global.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Tanpa Login, Tanpa Batasan',
    description: 'Langsung gunakan, tanpa perlu akun. 100% gratis.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Privasi Aman',
    description: 'Semua file dihapus otomatis setelah proses selesai. Data Anda, bukan milik kami.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-20 md:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
