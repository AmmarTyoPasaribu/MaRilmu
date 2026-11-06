import type { Metadata } from 'next';
import RamadhanView from './RamadhanView';

export const metadata: Metadata = {
  title: 'Ramadhan',
  description: 'Jadwal imsakiyah Ramadhan sesuai lokasi, hitung mundur imsak & berbuka, target tilawah harian, serta niat dan doa puasa.',
};

export default function RamadhanPage() {
  return <RamadhanView />;
}
