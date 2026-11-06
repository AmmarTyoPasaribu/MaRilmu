import type { Metadata } from 'next';
import SunnahView from './SunnahView';

export const metadata: Metadata = {
  title: 'Sholat Sunnah',
  description: 'Panduan sholat sunnah: Dhuha, Tahajud, Witir, Rawatib, Tahiyatul Masjid, Istikharah, Taubat dan Tarawih — niat, waktu, jumlah rakaat dan keutamaannya.',
};

export default function SholatSunnahPage() {
  return <SunnahView />;
}
