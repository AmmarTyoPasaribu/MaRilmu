import type { Metadata } from 'next';
import KiblatView from './KiblatView';

export const metadata: Metadata = {
  title: 'Arah Kiblat',
  description: 'Kompas arah kiblat akurat berdasarkan lokasi GPS Anda, lengkap dengan sudut, jarak ke Ka’bah dan panduan Rashdul Qiblah.',
};

export default function KiblatPage() {
  return <KiblatView />;
}
