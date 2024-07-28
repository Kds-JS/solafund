import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { WalletContextProvider } from '@/components';

import './globals.css';

import { ThemeProvider } from '@/providers/theme-provider';
import { ToastContainer } from 'react-toastify';
import { AuthContext } from '@/components/wallets';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : `http://localhost:${process.env.PORT || 3000}`,
  ),
  title: 'crowdfunding',
  description: 'A crowd funding dapp built on Solana',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastContainer pauseOnHover theme="colored" />
          <AuthContext>
            <WalletContextProvider>{children}</WalletContextProvider>
          </AuthContext>
        </ThemeProvider>
      </body>
    </html>
  );
}
