import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchSurah, getSurahMeta } from '@/lib/quran';
import SurahReader from './SurahReader';

export const revalidate = 604800; // 7 hari

export function generateStaticParams() {
  // dibangun saat pertama kali diakses lalu di-cache (ISR)
  return [];
}

type Props = { params: Promise<{ surah: string }> };

function parse(raw: string) {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parse((await params).surah);
  const meta = n ? getSurahMeta(n) : undefined;
  if (!meta) return { title: 'Surah tidak ditemukan' };
  return {
    title: `QS. ${meta.lat} (${meta.n}) — ${meta.arti}`,
    description: `Baca Surah ${meta.lat} (${meta.ar}) ${meta.ayat} ayat lengkap dengan teks Arab, latin, terjemahan, tafsir Kemenag, dan audio murottal.`,
  };
}

export default async function SurahPage({ params }: Props) {
  const n = parse((await params).surah);
  if (!n) notFound();
  const surah = await fetchSurah(n);
  return <SurahReader surah={surah} />;
}
