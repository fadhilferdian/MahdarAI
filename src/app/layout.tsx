'use client';

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import './globals.css';
import { useState, useEffect } from 'react';

// export const metadata: Metadata = {
//   title: 'Mahdar AI',
//   description: 'Dari rekaman atau dokumen menjadi notulensi rapat yang cerdas.',
// };

function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // This logic can be expanded if language is stored in localStorage or context
    // For now, we listen to changes on the html tag which MainPanel modifies.
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'dir') {
          const newDir = document.documentElement.getAttribute('dir') as 'ltr' | 'rtl';
          if (newDir && newDir !== direction) {
            setDirection(newDir);
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    // Set initial direction
    const initialDir = document.documentElement.getAttribute('dir') as 'ltr' | 'rtl' | null;
    if (initialDir) {
        setDirection(initialDir);
    }


    return () => {
      observer.disconnect();
    };
  }, [direction]);

  return (
    <html lang="id" dir={direction} suppressHydrationWarning>
      <head>
        <title>Mahdar AI</title>
        <meta name="description" content="Dari rekaman atau dokumen menjadi notulensi rapat yang cerdas." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Inter:wght@400;700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}
