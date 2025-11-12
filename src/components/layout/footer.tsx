
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col sm:flex-row h-auto items-center justify-between py-6 px-4 md:px-6 gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          © 2025 Mahdar AI — "Ringkas cerdas, lintas bahasa."
        </p>
        <nav className="flex gap-4 sm:gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Tentang
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privasi
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Kontak
            </Link>
        </nav>
      </div>
    </footer>
  );
}
