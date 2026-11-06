import type { Metadata } from 'next';
import DzikirView from './DzikirView';

export const metadata: Metadata = {
  title: 'Dzikir Pagi, Petang & Setelah Sholat',
  description: 'Bacaan dzikir pagi, petang dan setelah sholat sesuai sunnah (Hisnul Muslim) lengkap dengan penghitung, latin, terjemahan dan dalilnya.',
};

export default function DzikirPage() {
  return <DzikirView />;
}
