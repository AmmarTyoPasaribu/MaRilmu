import type { Metadata, Viewport } from 'next';
import { Amiri, Amiri_Quran, Marcellus, Plus_Jakarta_Sans } from 'next/font/google';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/layout.css';
import '@/styles/components.css';
import '@/styles/pages.css';
import Providers, { THEME_SCRIPT } from '@/components/providers/Providers';
import Shell from '@/components/layout/Shell';
import Footer from '@/components/layout/Footer';
import { SITE } from '@/lib/site';

const sans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const display = Marcellus({ subsets: ['latin'], weight: '400', variable: '--font-display', display: 'swap' });
const amiri = Amiri({ subsets: ['arabic', 'latin'], weight: ['400', '700'], variable: '--font-amiri', display: 'swap' });
const amiriQuran = Amiri_Quran({ subsets: ['arabic'], weight: '400', variable: '--font-amiri-quran', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author }],
  keywords: ['al-quran', 'jadwal sholat', 'arah kiblat', 'kalender hijriah', 'doa harian', 'dzikir', 'tasbih', 'asmaul husna', 'murottal', 'zakat'],
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    type: 'website',
    locale: 'id_ID',
    siteName: SITE.name,
  },
  appleWebApp: { capable: true, title: SITE.name, statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  themeColor: '#0f4c3a',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${sans.variable} ${display.variable} ${amiri.variable} ${amiriQuran.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <Providers>
          <Shell>
            {children}
            <Footer />
          </Shell>
        </Providers>
      </body>
    </html>
  );
}
