import type { Metadata } from 'next';
import JadwalView from './JadwalView';

export const metadata: Metadata = {
  title: 'Jadwal Sholat',
  description: 'Jadwal sholat harian & bulanan sesuai lokasi Anda (kriteria Kemenag RI), lengkap dengan imsak, terbit, dhuha, hitung mundur dan pengingat adzan.',
};

export default function JadwalSholatPage() {
  return <JadwalView />;
}
