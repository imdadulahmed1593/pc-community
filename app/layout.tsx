import './globals.css';
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { ModalProvider } from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import { QueryProvider } from '@/components/providers/query-provider';

const font = Open_Sans({ subsets: ['latin'] });

// generating pwa
export const metadata: Metadata = {
  title: 'DISCORDIA',
  description: 'A Communication platform for project code community',
  manifest: '/manifest.json',
  icons: { apple: '/icon.png' },
  themeColor: '#fff',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, 'bg-white dark:bg-[#313833]')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
