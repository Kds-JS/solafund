'use client';

import { cn } from '@/lib/utils';
import { Footer } from '@/components/admin-panel/footer';

export default function CampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 transition-[margin-left] duration-300 ease-in-out dark:bg-zinc-900',
        )}
      >
        {children}
      </main>
      <footer
        className={cn('transition-[margin-left] duration-300 ease-in-out')}
      >
        <Footer />
      </footer>
    </>
  );
}
