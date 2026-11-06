import type { IconName } from '@/components/Icon';

export const SITE = {
  name: 'MaRilmu',
  tagline: 'Teman ibadah harianmu',
  description:
    'MaRilmu — portal Islami: Al-Quran 30 juz dengan terjemahan, tafsir & murottal, jadwal sholat sesuai lokasi, arah kiblat, kalender Hijriah, ratusan doa, dzikir, dan alat ibadah lainnya.',
  author: 'Ammar Tyo Pasaribu',
};

/**
 * Tautan profil pembuat (tampil di footer & sidebar).
 * Tambahkan tautan lain di sini, mis. { label: 'Instagram', href: 'https://instagram.com/…', icon: 'instagram' }.
 */
export const PROFILE_LINKS: { label: string; href: string; icon: IconName }[] = [
  { label: 'GitHub', href: 'https://github.com/AmmarTyoPasaribu', icon: 'github' },
  { label: 'Source code', href: 'https://github.com/AmmarTyoPasaribu/MaRilmu', icon: 'external' },
];

export interface NavItem {
  href: string;
  label: string;
  desc: string;
  icon: IconName;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: 'Utama',
    items: [
      { href: '/', label: 'Beranda', desc: 'Ringkasan hari ini', icon: 'home' },
      { href: '/quran', label: 'Al-Quran', desc: '114 surah, tafsir & audio', icon: 'quran' },
      { href: '/jadwal-sholat', label: 'Jadwal Sholat', desc: 'Sesuai lokasimu', icon: 'clock' },
      { href: '/kiblat', label: 'Arah Kiblat', desc: 'Kompas kiblat', icon: 'kaaba' },
      { href: '/kalender', label: 'Kalender Hijriah', desc: 'Hari besar & puasa', icon: 'calendar' },
    ],
  },
  {
    title: 'Ibadah',
    items: [
      { href: '/doa', label: 'Kumpulan Doa', desc: '220+ doa shahih', icon: 'hands' },
      { href: '/dzikir', label: 'Dzikir', desc: 'Pagi, petang & ba’da sholat', icon: 'sunrise' },
      { href: '/tasbih', label: 'Tasbih Digital', desc: 'Penghitung dzikir', icon: 'beads' },
      { href: '/murottal', label: 'Murottal', desc: '6 qari, 114 surah', icon: 'headphones' },
      { href: '/panduan-sholat', label: 'Panduan Sholat', desc: 'Tata cara & bacaan', icon: 'mosque' },
      { href: '/sholat-sunnah', label: 'Sholat Sunnah', desc: 'Niat & keutamaan', icon: 'star8' },
      { href: '/ramadhan', label: 'Ramadhan', desc: 'Imsakiyah & doa puasa', icon: 'lantern' },
    ],
  },
  {
    title: 'Belajar',
    items: [
      { href: '/asmaul-husna', label: 'Asmaul Husna', desc: '99 nama Allah', icon: 'sparkle' },
      { href: '/hadits', label: 'Hadits', desc: 'Hadits pilihan', icon: 'scroll' },
      { href: '/kisah-nabi', label: 'Kisah 25 Nabi', desc: 'Hikmah para rasul', icon: 'people' },
      { href: '/artikel', label: 'Artikel', desc: 'Bacaan singkat', icon: 'notebook' },
      { href: '/quiz', label: 'Kuis Islami', desc: 'Uji pengetahuanmu', icon: 'cap' },
    ],
  },
  {
    title: 'Catatan & Alat',
    items: [
      { href: '/jurnal', label: 'Jurnal Ibadah', desc: 'Checklist harian', icon: 'target' },
      { href: '/hafalan', label: 'Hafalan', desc: 'Progres hafalan', icon: 'brain' },
      { href: '/zakat', label: 'Kalkulator Zakat', desc: 'Mal, profesi, fitrah', icon: 'calculator' },
      { href: '/infaq', label: 'Catatan Sedekah', desc: 'Infaq & sedekah', icon: 'heartHand' },
      { href: '/tersimpan', label: 'Tersimpan', desc: 'Ayat & doa favorit', icon: 'bookmark' },
      { href: '/pengaturan', label: 'Pengaturan', desc: 'Tema, metode, qari', icon: 'settings' },
    ],
  },
];

export const ALL_NAV: NavItem[] = NAV.flatMap((g) => g.items);

/** Tab bawah (mobile) */
export const BOTTOM_NAV: NavItem[] = [
  ALL_NAV.find((i) => i.href === '/')!,
  ALL_NAV.find((i) => i.href === '/quran')!,
  ALL_NAV.find((i) => i.href === '/jadwal-sholat')!,
  ALL_NAV.find((i) => i.href === '/doa')!,
];
