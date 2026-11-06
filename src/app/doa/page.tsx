import type { Metadata } from 'next';
import { PageHeader, Page } from '@/components/ui';
import { fetchDoa } from '@/lib/doa';
import DoaList from './DoaList';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Kumpulan Doa',
  description: 'Lebih dari 220 doa shahih sehari-hari dari Al-Quran dan Hadits lengkap dengan teks Arab, latin, terjemahan dan sumbernya.',
};

export default async function DoaPage() {
  const { list, source } = await fetchDoa();
  return (
    <Page>
      <PageHeader
        icon="hands"
        arabic="ادْعُونِي أَسْتَجِبْ لَكُمْ"
        title="Kumpulan Doa"
        subtitle={`${list.length} doa dari Al-Quran & Hadits — lengkap dengan sumbernya`}
      />
      <DoaList list={list} source={source} />
    </Page>
  );
}
