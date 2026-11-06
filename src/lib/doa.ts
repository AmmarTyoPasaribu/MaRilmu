import fallback from '@/data/doa-fallback.json';

export interface Doa {
  id: number;
  grup: string;
  nama: string;
  ar: string;
  tr: string;
  idn: string;
  tentang: string;
  tag: string[];
}

/** Kumpulan ±227 doa dari equran.id, dengan cadangan data lokal. */
export async function fetchDoa(): Promise<{ list: Doa[]; source: 'equran' | 'lokal' }> {
  try {
    const res = await fetch('https://equran.id/api/doa', { next: { revalidate: 60 * 60 * 24 } });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const list = (json.data as Doa[]).map((d) => ({
      ...d,
      grup: d.grup.replace(/\.$/, '').trim(),
      tentang: (d.tentang ?? '').trim(),
      tag: d.tag ?? [],
    }));
    if (!list.length) throw new Error('kosong');
    return { list, source: 'equran' };
  } catch {
    return { list: fallback as Doa[], source: 'lokal' };
  }
}

/** Kelompok besar agar filter tidak terlalu banyak */
export const DOA_THEMES: { id: string; label: string; match: RegExp }[] = [
  { id: 'harian', label: 'Harian', match: /tidur|kamar mandi|berpakaian|rumah|makan|majelis|harian|kabar|kagum/i },
  { id: 'sholat', label: 'Sholat & Wudhu', match: /shalat|sholat|wudhu|adzan/i },
  { id: 'perlindungan', label: 'Perlindungan', match: /berlindung|perlindungan|setan|musuh|zalim|syirik|kecelakaan|keburukan/i },
  { id: 'ampunan', label: 'Ampunan & Kebaikan', match: /ampun|istighfar|taubat|kebaikan|surga|akhlak|keteguhan|ilmu/i },
  { id: 'keluarga', label: 'Keluarga', match: /orang tua|istri|anak|pernikahan|lahir/i },
  { id: 'safar', label: 'Perjalanan', match: /perjalanan/i },
  { id: 'sakit', label: 'Sakit & Musibah', match: /sakit|wafat|jenazah|sedih|sulit|fenomena|hutang|harta/i },
  { id: 'ibadah', label: 'Puasa & Hari Raya', match: /puasa|ramadhan|hari raya/i },
  { id: 'dzikir', label: 'Dzikir & Adab', match: /dzikir|adab/i },
];

export function themeOf(grup: string): string {
  return DOA_THEMES.find((t) => t.match.test(grup))?.id ?? 'lainnya';
}
