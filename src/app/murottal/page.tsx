import type { Metadata } from 'next';
import { PageHeader, Page } from '@/components/ui';
import MurottalView from './MurottalView';

export const metadata: Metadata = {
  title: 'Murottal Al-Quran',
  description: 'Dengarkan murottal 114 surah Al-Quran dari 6 qari ternama. Audio tetap berjalan saat Anda membuka halaman lain.',
};

export default function MurottalPage() {
  return (
    <Page>
      <PageHeader icon="headphones" title="Murottal Al-Quran" subtitle="114 surah · 6 qari · terus diputar walau Anda pindah halaman" />
      <MurottalView />
    </Page>
  );
}
