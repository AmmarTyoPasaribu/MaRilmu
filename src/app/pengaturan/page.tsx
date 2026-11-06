import type { Metadata } from 'next';
import SettingsView from './SettingsView';

export const metadata: Metadata = {
  title: 'Pengaturan',
  description: 'Atur tema, ukuran huruf Arab, metode perhitungan jadwal sholat, koreksi tanggal Hijriah, qari murottal, serta cadangkan data Anda.',
};

export default function PengaturanPage() {
  return <SettingsView />;
}
