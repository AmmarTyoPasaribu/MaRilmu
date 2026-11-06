import type { Metadata } from 'next';
import JurnalView from './JurnalView';

export const metadata: Metadata = {
  title: 'Jurnal Ibadah',
  description: 'Catat sholat lima waktu dan amalan harian, pantau streak dan grafik konsistensi ibadah Anda. Data tersimpan di perangkat.',
};

export default function JurnalPage() {
  return <JurnalView />;
}
