
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-auto items-center justify-center py-6 px-4 md:px-6">
        <p className="text-sm text-muted-foreground text-center">
          © 2025 Mahdar AI - Built with 💖 by Fadhil Ferdian
        </p>
      </div>
    </footer>
  );
}
