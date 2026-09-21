import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import { Footer } from '@/src/components/Footer';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quem eu aciono?',
  description: 'Sistema de gestão de plantões.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="min-h-screen bg-bg font-sans text-ink antialiased">
        <ClerkProvider
          taskUrls={{ 'choose-organization': '/session-tasks/choose-organization' }}
        >
          {children}
          <Footer />
        </ClerkProvider>
      </body>
    </html>
  );
}
