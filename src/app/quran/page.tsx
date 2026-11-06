import type { Metadata } from 'next';
import { PageHeader, Page } from '@/components/ui';
import QuranIndex from './QuranIndex';

export const metadata: Metadata = {
  title: 'Al-Quran Digital',
  description: 'Baca Al-Quran 114 surah dan 30 juz lengkap dengan teks Arab, latin, terjemahan & tafsir Kemenag, serta murottal per ayat.',
};

export default function QuranPage() {
  return (
    <Page>
      <PageHeader
        icon="quran"
        arabic="ٱلْقُرْآنُ ٱلْكَرِيمُ"
        title="Al-Quran Digital"
        subtitle="114 surah · 30 juz · terjemahan & tafsir Kemenag RI · murottal 6 qari"
      />
      <QuranIndex />
    </Page>
  );
}
