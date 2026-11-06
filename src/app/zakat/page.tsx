import type { Metadata } from 'next';
import ZakatView from './ZakatView';

export const metadata: Metadata = {
  title: 'Kalkulator Zakat',
  description: 'Hitung zakat penghasilan, zakat mal (tabungan), zakat emas, zakat perdagangan dan zakat fitrah sesuai ketentuan nisab 85 gram emas.',
};

export default function ZakatPage() {
  return <ZakatView />;
}
