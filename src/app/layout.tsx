import type { Metadata } from 'next';
import { Poppins, Amiri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DoaPopup from '@/components/DoaPopup';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const amiri = Amiri({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MaRilmu — Portal Islami Digital',
  description: 'Portal Islami digital lengkap dengan 25+ fitur: Al-Quran dengan transliterasi latin, Jadwal Sholat, Hadits, Dzikir, Quiz Islami, Kisah 25 Nabi, dan banyak lagi.',
  keywords: ['islam', 'quran', 'sholat', 'doa', 'asmaul husna', 'kiblat', 'kalender hijriyah', 'tasbih', 'hadits', 'dzikir'],
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} ${amiri.variable}`}>
      <body>
        <Navbar />
        <div className="main-content">
          <main>{children}</main>
          <Footer />
        </div>
        <DoaPopup />
      </body>
    </html>
  );
}
