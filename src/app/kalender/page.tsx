import type { Metadata } from 'next';
import KalenderView from './KalenderView';

export const metadata: Metadata = {
  title: 'Kalender Hijriah',
  description: 'Kalender Masehi & Hijriah lengkap dengan hari besar Islam, jadwal puasa sunnah (Senin-Kamis, Ayyamul Bidh, Arafah, Asyura) dan konverter tanggal.',
};

export default function KalenderPage() {
  return <KalenderView />;
}
