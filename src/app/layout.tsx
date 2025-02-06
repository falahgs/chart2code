import { LanguageProvider } from '@/context/LanguageContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VideoMind AI - Video Analysis with Gemini',
  description: 'Analyze videos using Google\'s Gemini AI model for intelligent insights and summaries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <LanguageProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
