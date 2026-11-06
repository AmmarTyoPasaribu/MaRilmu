import type { Metadata } from 'next';
import InfaqView from './InfaqView';

export const metadata: Metadata = {
  title: 'Catatan Sedekah',
  description: 'Catat infaq dan sedekah harian, lihat rekap bulanan per kategori. Data tersimpan di perangkat Anda.',
};

export default function InfaqPage() {
  return <InfaqView />;
}
