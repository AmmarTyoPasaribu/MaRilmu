import type { Metadata } from 'next';
import HafalanView from './HafalanView';

export const metadata: Metadata = {
  title: 'Hafalan Al-Quran',
  description: 'Pantau progres hafalan Al-Quran untuk 114 surah — status per surah, persentase per ayat, dan target Juz Amma.',
};

export default function HafalanPage() {
  return <HafalanView />;
}
