'use client';

import { useMemo } from 'react';
import { addDays, calculatePrayerTimes, type PrayerTimes } from './prayer';
import { toHijri, type HijriDate } from './hijri';
import { useLocation, useSettings } from './store';

function dayStamp(ms: number) {
  const d = ms ? new Date(ms) : new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** Jadwal sholat kemarin/hari ini/besok untuk lokasi & metode tersimpan. */
export function usePrayerTimes(nowMs: number): {
  yesterday: PrayerTimes;
  today: PrayerTimes;
  tomorrow: PrayerTimes;
} {
  const [settings] = useSettings();
  const [loc] = useLocation();
  const stamp = dayStamp(nowMs);
  return useMemo(() => {
    const base = new Date(stamp);
    const opts = { method: settings.method, madhab: settings.madhab };
    return {
      yesterday: calculatePrayerTimes(addDays(base, -1), loc.latitude, loc.longitude, opts),
      today: calculatePrayerTimes(base, loc.latitude, loc.longitude, opts),
      tomorrow: calculatePrayerTimes(addDays(base, 1), loc.latitude, loc.longitude, opts),
    };
  }, [stamp, loc.latitude, loc.longitude, settings.method, settings.madhab]);
}

/**
 * Tanggal Hijriah hari ini. Pergantian hari Hijriah terjadi saat maghrib,
 * tetapi kalender sipil (dan aplikasi umum di Indonesia) memakai tengah malam.
 */
export function useHijriToday(nowMs: number): HijriDate {
  const [settings] = useSettings();
  const stamp = dayStamp(nowMs);
  return useMemo(() => toHijri(new Date(stamp), settings.hijriOffset), [stamp, settings.hijriOffset]);
}

/** Nama zona waktu perangkat, mis. "WIB" / "WITA" */
export function deviceTimeZoneLabel(): string {
  const offset = -new Date().getTimezoneOffset() / 60;
  const id: Record<number, string> = { 7: 'WIB', 8: 'WITA', 9: 'WIT' };
  if (id[offset]) return id[offset];
  try {
    const parts = new Intl.DateTimeFormat('id-ID', { timeZoneName: 'short' }).formatToParts(new Date());
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    return '';
  }
}
