import type { Metadata } from 'next';
import PanduanView from './PanduanView';

export const metadata: Metadata = {
  title: 'Panduan Sholat',
  description: 'Tata cara sholat fardhu langkah demi langkah lengkap dengan bacaan Arab, latin dan artinya, niat 5 waktu, serta jumlah rakaat.',
};

export default function PanduanSholatPage() {
  return <PanduanView />;
}
