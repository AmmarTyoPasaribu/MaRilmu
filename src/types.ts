// ===== Al-Quran Types =====
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio?: string;
}

export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export interface SurahDetailData {
  arabic: SurahDetail;
  translation: SurahDetail;
  latin: SurahDetail;
}

// ===== Prayer Times Types =====
export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  [key: string]: string;
}

export interface HijriMonth {
  number: number;
  en: string;
  ar: string;
}

export interface HijriDate {
  date: string;
  day: string;
  month: HijriMonth;
  year: string;
}

export interface PrayerTimesData {
  timings: PrayerTimings;
  date: {
    hijri: HijriDate;
    gregorian: {
      date: string;
      day: string;
      month: { number: number; en: string };
      year: string;
    };
  };
}

// ===== Doa Types =====
export interface Doa {
  id: number;
  title: string;
  category: string;
  arabic: string;
  latin: string;
  translation: string;
}

// ===== Asmaul Husna Types =====
export interface HusnaName {
  number: number;
  arabic: string;
  latin: string;
  meaning: string;
}

// ===== Location Types =====
export interface UserLocation {
  latitude: number;
  longitude: number;
  city?: string;
}

// ===== Qibla Types =====
export interface QiblaData {
  latitude: number;
  longitude: number;
  direction: number;
}

// ===== Calendar Types =====
export interface CalendarEntry {
  hijri: HijriDate;
  gregorian: {
    date: string;
    day: string;
    month: { number: number; en: string };
    year: string;
  };
}
