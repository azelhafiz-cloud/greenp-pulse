import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GreenPulse — Build a Sustainable Future',
  description:
    'Track your personal eco impact, complete green challenges, and learn about sustainability. Every action brings a greener tomorrow.',
  keywords: ['sustainability', 'eco tracker', 'green', 'climate', 'carbon footprint'],
  authors: [{ name: 'GreenPulse' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'GreenPulse — Build a Sustainable Future',
    description: 'Track your personal eco impact and build a greener tomorrow.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f6f8f5' },
    { media: '(prefers-color-scheme: dark)',  color: '#0d1f13' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        {/* Material Symbols Rounded icon font — required for all icons */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional"
          rel="stylesheet"
        />
      </head>
      <body className={`min-h-screen transition-theme font-sans`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
