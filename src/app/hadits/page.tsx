import type { Metadata } from 'next';
import { PageHeader, Page } from '@/components/ui';
import HaditsView from './HaditsView';

export const metadata: Metadata = {
  title: 'Hadits Pilihan',
  description: 'Kumpulan hadits shahih pilihan tentang niat, akhlak, ilmu, sedekah dan ibadah — lengkap dengan teks Arab, latin, terjemahan dan perawinya.',
};

export default function HaditsPage() {
  return (
    <Page width="narrow">
      <PageHeader icon="scroll" title="Hadits Pilihan" subtitle="Sabda Rasulullah ﷺ yang ringkas, shahih, dan mudah diamalkan" />
      <HaditsView />
    </Page>
  );
}
