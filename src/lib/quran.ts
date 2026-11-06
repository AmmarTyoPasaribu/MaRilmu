import surahList from '@/data/surah.json';
import type { QariId } from './store';

/** Sumber data: equran.id (teks & terjemahan Kemenag RI). */
export const EQURAN = 'https://equran.id/api/v2';

export interface SurahMeta {
  n: number;
  ar: string;
  lat: string;
  arti: string;
  ayat: number;
  tempat: string;
}

export const SURAHS = surahList as SurahMeta[];

export function getSurahMeta(n: number): SurahMeta | undefined {
  return SURAHS[n - 1];
}

export interface Ayah {
  n: number;
  ar: string;
  tr: string;
  id: string;
}

export interface SurahDetail extends SurahMeta {
  deskripsi: string;
  ayahs: Ayah[];
}

export const QARI: Record<QariId, { name: string; folder: string }> = {
  '01': { name: 'Abdullah Al-Juhany', folder: 'Abdullah-Al-Juhany' },
  '02': { name: 'Abdul Muhsin Al-Qasim', folder: 'Abdul-Muhsin-Al-Qasim' },
  '03': { name: 'Abdurrahman As-Sudais', folder: 'Abdurrahman-as-Sudais' },
  '04': { name: 'Ibrahim Al-Dossari', folder: 'Ibrahim-Al-Dossari' },
  '05': { name: 'Misyari Rasyid Al-Afasi', folder: 'Misyari-Rasyid-Al-Afasi' },
  '06': { name: 'Yasser Al-Dosari', folder: 'Yasser-Al-Dosari' },
};

export function ayahAudioUrl(qari: QariId, surah: number, ayah: number): string {
  const q = QARI[qari] ?? QARI['05'];
  return `https://cdn.equran.id/audio-partial/${q.folder}/${String(surah).padStart(3, '0')}${String(ayah).padStart(3, '0')}.mp3`;
}

export function surahAudioUrl(qari: QariId, surah: number): string {
  const q = QARI[qari] ?? QARI['05'];
  return `https://cdn.equran.id/audio-full/${q.folder}/${String(surah).padStart(3, '0')}.mp3`;
}

interface EquranAyat {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
}

/** Ambil detail surah (dipanggil di server, di-cache 1 hari). */
export async function fetchSurah(n: number): Promise<SurahDetail> {
  const res = await fetch(`${EQURAN}/surat/${n}`, { next: { revalidate: 60 * 60 * 24 * 7 } });
  if (!res.ok) throw new Error(`Gagal memuat surah ${n}`);
  const json = await res.json();
  const d = json.data;
  return {
    n: d.nomor,
    ar: d.nama,
    lat: d.namaLatin,
    arti: d.arti,
    ayat: d.jumlahAyat,
    tempat: d.tempatTurun,
    deskripsi: d.deskripsi,
    ayahs: (d.ayat as EquranAyat[]).map((a) => ({
      n: a.nomorAyat,
      ar: a.teksArab,
      tr: a.teksLatin,
      id: a.teksIndonesia,
    })),
  };
}

const tafsirCache = new Map<number, Promise<Record<number, string>>>();

/** Tafsir Kemenag per ayat (dipanggil di browser saat dibutuhkan). */
export function fetchTafsir(n: number): Promise<Record<number, string>> {
  let p = tafsirCache.get(n);
  if (!p) {
    p = fetch(`${EQURAN}/tafsir/${n}`)
      .then((r) => {
        if (!r.ok) throw new Error('Gagal memuat tafsir');
        return r.json();
      })
      .then((j) => {
        const map: Record<number, string> = {};
        for (const t of j.data.tafsir as { ayat: number; teks: string }[]) map[t.ayat] = t.teks;
        return map;
      });
    p.catch(() => tafsirCache.delete(n));
    tafsirCache.set(n, p);
  }
  return p;
}

/** Awal tiap juz (mushaf Madinah) */
export const JUZ_START: [number, number][] = [
  [1, 1], [2, 142], [2, 253], [3, 93], [4, 24], [4, 148], [5, 82], [6, 111], [7, 88], [8, 41],
  [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75], [21, 1], [23, 1], [25, 21], [27, 56],
  [29, 46], [33, 31], [36, 28], [39, 32], [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1],
];

export function juzOf(surah: number, ayah: number): number {
  let juz = 1;
  for (let i = 0; i < JUZ_START.length; i++) {
    const [s, a] = JUZ_START[i];
    if (surah > s || (surah === s && ayah >= a)) juz = i + 1;
    else break;
  }
  return juz;
}

/** Surah pilihan yang sering dibaca */
export const FEATURED_SURAHS: { n: number; note: string }[] = [
  { n: 18, note: "Dibaca di hari Jum'at" },
  { n: 36, note: 'Jantung Al-Quran' },
  { n: 67, note: 'Pelindung dari azab kubur' },
  { n: 56, note: 'Surah Al-Waqi’ah' },
  { n: 55, note: 'Nikmat Allah' },
  { n: 32, note: 'Dibaca sebelum tidur' },
];

/** Hilangkan tag HTML dari deskripsi equran */
export function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, '');
}
