import type { Metadata } from 'next';

import './globals.css';
import { Footer } from '@/src/components/Footer';
/**
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});
*/

export const metadata: Metadata = {
  title: 'Quem eu aciono?',
  description: 'Sistema de gestão de Plantões.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children} <Footer />
      </body>
    </html>
  );
}
