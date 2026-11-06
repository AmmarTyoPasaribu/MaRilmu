import type { Metadata } from 'next';
import { PageHeader, Page } from '@/components/ui';
import HusnaView from './HusnaView';

export const metadata: Metadata = {
  title: 'Asmaul Husna',
  description: '99 nama Allah yang indah (Asmaul Husna) lengkap dengan tulisan Arab, latin dan artinya, serta mode hafalan.',
};

export default function AsmaulHusnaPage() {
  return (
    <Page>
      <PageHeader
        icon="sparkle"
        arabic="وَلِلّٰهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا"
        title="Asmaul Husna"
        subtitle="“Allah memiliki Asmaul Husna, maka bermohonlah kepada-Nya dengan menyebutnya.” — QS. Al-A’raf: 180"
      />
      <HusnaView />
    </Page>
  );
}
