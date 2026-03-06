import type {
  Surah,
  SurahDetailData,
  PrayerTimesData,
  HijriDate,
  CalendarEntry,
  QiblaData,
  UserLocation,
} from '@/types';

const QURAN_API = 'https://api.alquran.cloud/v1';
const ALADHAN_API = 'https://api.aladhan.com/v1';

// ===== AL-QURAN API =====

export async function getAllSurahs(): Promise<Surah[]> {
  const res = await fetch(`${QURAN_API}/surah`);
  const data = await res.json();
  return data.data;
}

export async function getSurahDetail(surahNumber: string | number): Promise<SurahDetailData> {
  const [arabicRes, translationRes, latinRes] = await Promise.all([
    fetch(`${QURAN_API}/surah/${surahNumber}/ar.alafasy`),
    fetch(`${QURAN_API}/surah/${surahNumber}/id.indonesian`),
    fetch(`${QURAN_API}/surah/${surahNumber}/en.transliteration`),
  ]);
  const arabic = await arabicRes.json();
  const translation = await translationRes.json();
  const latin = await latinRes.json();
  return {
    arabic: arabic.data,
    translation: translation.data,
    latin: latin.data,
  };
}

// ===== PRAYER TIMES API =====

export async function getPrayerTimes(
  latitude: number,
  longitude: number,
  date: Date | null = null
): Promise<PrayerTimesData> {
  const today = date || new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const dateStr = `${dd}-${mm}-${yyyy}`;

  const res = await fetch(
    `${ALADHAN_API}/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=11`
  );
  const data = await res.json();
  return data.data;
}

// ===== HIJRI CALENDAR API =====

export async function getHijriDate(date: Date | null = null): Promise<HijriDate> {
  const today = date || new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const dateStr = `${dd}-${mm}-${yyyy}`;

  const res = await fetch(`${ALADHAN_API}/gpiToH/${dateStr}`);
  const data = await res.json();
  return data.data;
}

export async function getHijriCalendar(
  month: number,
  year: number
): Promise<CalendarEntry[]> {
  const res = await fetch(`${ALADHAN_API}/gpiToHijriCalendar/${month}/${year}`);
  const data = await res.json();
  return data.data;
}

// ===== QIBLA API =====

export async function getQiblaDirection(
  latitude: number,
  longitude: number
): Promise<QiblaData> {
  const res = await fetch(`${ALADHAN_API}/qibla/${latitude}/${longitude}`);
  const data = await res.json();
  return data.data;
}

// ===== HELPER: Get User Location =====

export function getUserLocation(): Promise<UserLocation> {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve({ latitude: -6.2088, longitude: 106.8456, city: 'Jakarta (default)' });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve({ latitude: -6.2088, longitude: 106.8456, city: 'Jakarta (default)' });
      },
      { timeout: 5000 }
    );
  });
}

// ===== HELPER: Reverse Geocode =====

export async function getCityName(latitude: number, longitude: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
    );
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.county || 'Lokasi Anda';
  } catch {
    return 'Lokasi Anda';
  }
}

// ===== HELPER: localStorage =====

export function getLastRead(): { surah: number; ayah: number; name: string } | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem('islamku-last-read');
  return data ? JSON.parse(data) : null;
}

export function setLastRead(surah: number, ayah: number, name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('islamku-last-read', JSON.stringify({ surah, ayah, name }));
}

// ===== HELPER: Dark Mode =====

export function getDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('islamku-dark-mode') === 'true';
}

export function setDarkMode(value: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('islamku-dark-mode', String(value));
  document.documentElement.setAttribute('data-theme', value ? 'dark' : 'light');
}

// ===== HELPER: Share =====

export async function shareContent(title: string, text: string): Promise<void> {
  if (navigator.share) {
    await navigator.share({ title, text });
  } else {
    await navigator.clipboard.writeText(text);
  }
}
