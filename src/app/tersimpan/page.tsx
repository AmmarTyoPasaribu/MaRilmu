import type { Metadata } from 'next';
import { PageHeader, Page } from '@/components/ui';
import { fetchDoa } from '@/lib/doa';
import SavedView from './SavedView';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Tersimpan',
  description: 'Ayat Al-Quran dan doa favorit yang Anda simpan.',
};

export default async function TersimpanPage() {
  const { list } = await fetchDoa();
  return (
    <Page width="narrow">
      <PageHeader icon="bookmark" title="Tersimpan" subtitle="Ayat dan doa favoritmu di satu tempat" />
      <SavedView doaList={list} />
    </Page>
  );
}
