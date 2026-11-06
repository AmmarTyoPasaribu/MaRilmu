/**
 * Perhitungan waktu sholat lokal (tanpa API) berbasis algoritma astronomis
 * PrayTimes (posisi matahari, sudut fajar/isya, bayangan ashar).
 * Default memakai kriteria Kemenag RI: Subuh -20°, Isya -18°, ihtiyat 2 menit.
 */

export type PrayerKey = 'imsak' | 'subuh' | 'terbit' | 'dhuha' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya';

export type MethodId = 'kemenag' | 'jakim' | 'muis' | 'mwl' | 'ummalqura' | 'egypt' | 'isna';

export interface CalcMethod {
  id: MethodId;
  name: string;
  fajr: number;
  /** derajat, atau menit setelah maghrib bila `ishaMinutes` */
  isha: number;
  ishaMinutes?: boolean;
  /** menit pengaman (ihtiyat) yang ditambahkan ke waktu sholat */
  ihtiyat: number;
}

export const METHODS: Record<MethodId, CalcMethod> = {
  kemenag: { id: 'kemenag', name: 'Kemenag RI (Indonesia)', fajr: 20, isha: 18, ihtiyat: 2 },
  jakim: { id: 'jakim', name: 'JAKIM (Malaysia)', fajr: 20, isha: 18, ihtiyat: 1 },
  muis: { id: 'muis', name: 'MUIS (Singapura)', fajr: 20, isha: 18, ihtiyat: 1 },
  mwl: { id: 'mwl', name: 'Muslim World League', fajr: 18, isha: 17, ihtiyat: 0 },
  ummalqura: { id: 'ummalqura', name: 'Umm al-Qura (Makkah)', fajr: 18.5, isha: 90, ishaMinutes: true, ihtiyat: 0 },
  egypt: { id: 'egypt', name: 'Egyptian General Authority', fajr: 19.5, isha: 17.5, ihtiyat: 0 },
  isna: { id: 'isna', name: 'ISNA (Amerika Utara)', fajr: 15, isha: 15, ihtiyat: 0 },
};

export type AsrMadhab = 'syafii' | 'hanafi';

export interface PrayerOptions {
  method: MethodId;
  madhab: AsrMadhab;
}

export const PRAYER_LABELS: Record<PrayerKey, string> = {
  imsak: 'Imsak',
  subuh: 'Subuh',
  terbit: 'Terbit',
  dhuha: 'Dhuha',
  dzuhur: 'Dzuhur',
  ashar: 'Ashar',
  maghrib: 'Maghrib',
  isya: 'Isya',
};

/** Lima sholat fardhu, urut waktu */
export const FARDHU: PrayerKey[] = ['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'];
export const ALL_TIMES: PrayerKey[] = ['imsak', 'subuh', 'terbit', 'dhuha', 'dzuhur', 'ashar', 'maghrib', 'isya'];

export type PrayerTimes = Record<PrayerKey, Date>;

// ---------- trigonometri derajat ----------
const DEG = Math.PI / 180;
const dsin = (d: number) => Math.sin(d * DEG);
const dcos = (d: number) => Math.cos(d * DEG);
const dtan = (d: number) => Math.tan(d * DEG);
const darcsin = (x: number) => Math.asin(x) / DEG;
const darccos = (x: number) => Math.acos(x) / DEG;
const darctan2 = (y: number, x: number) => Math.atan2(y, x) / DEG;
const darccot = (x: number) => Math.atan(1 / x) / DEG;
const fix = (a: number, b: number) => {
  const r = a - b * Math.floor(a / b);
  return r < 0 ? r + b : r;
};
const fixAngle = (a: number) => fix(a, 360);
const fixHour = (a: number) => fix(a, 24);

function julian(year: number, month: number, day: number) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function sunPosition(jd: number) {
  const D = jd - 2451545.0;
  const g = fixAngle(357.529 + 0.98560028 * D);
  const q = fixAngle(280.459 + 0.98564736 * D);
  const L = fixAngle(q + 1.915 * dsin(g) + 0.02 * dsin(2 * g));
  const e = 23.439 - 0.00000036 * D;
  const RA = darctan2(dcos(e) * dsin(L), dcos(L)) / 15;
  const equation = q / 15 - fixHour(RA);
  const declination = darcsin(dsin(e) * dsin(L));
  return { declination, equation };
}

/**
 * Hitung waktu sholat untuk tanggal (lokal perangkat) di koordinat tertentu.
 * Hasil berupa objek Date absolut, ditampilkan dalam zona waktu perangkat.
 */
export function calculatePrayerTimes(
  date: Date,
  latitude: number,
  longitude: number,
  options: PrayerOptions = { method: 'kemenag', madhab: 'syafii' },
): PrayerTimes {
  const method = METHODS[options.method] ?? METHODS.kemenag;
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const jDate = julian(y, m, d) - longitude / (15 * 24);

  const midDay = (t: number) => fixHour(12 - sunPosition(jDate + t).equation);
  const sunAngleTime = (angle: number, t: number, ccw = false) => {
    const decl = sunPosition(jDate + t).declination;
    const noon = midDay(t);
    const v = (-dsin(angle) - dsin(decl) * dsin(latitude)) / (dcos(decl) * dcos(latitude));
    const tt = darccos(Math.max(-1, Math.min(1, v))) / 15;
    return noon + (ccw ? -tt : tt);
  };
  const asrTime = (factor: number, t: number) => {
    const decl = sunPosition(jDate + t).declination;
    const angle = -darccot(factor + dtan(Math.abs(latitude - decl)));
    return sunAngleTime(angle, t);
  };

  // perkiraan awal (jam) → dibagi 24 sebagai porsi hari, lalu satu iterasi
  const p = (h: number) => h / 24;
  const riseSet = 0.833;
  const fajr = sunAngleTime(method.fajr, p(5), true);
  const sunrise = sunAngleTime(riseSet, p(6), true);
  const dhuha = sunAngleTime(-4.5, p(6.5), true);
  const dhuhr = midDay(p(12));
  const asr = asrTime(options.madhab === 'hanafi' ? 2 : 1, p(13));
  const sunset = sunAngleTime(riseSet, p(18));
  const isha = method.ishaMinutes ? sunset + method.isha / 60 : sunAngleTime(method.isha, p(18));

  const tz = -date.getTimezoneOffset() / 60;
  const adjust = (t: number) => t + tz - longitude / 15;
  const ih = method.ihtiyat / 60;

  const hours: Record<PrayerKey, number> = {
    subuh: adjust(fajr) + ih,
    imsak: adjust(fajr) + ih - 10 / 60,
    terbit: adjust(sunrise) - ih,
    dhuha: adjust(dhuha) + ih,
    dzuhur: adjust(dhuhr) + ih,
    ashar: adjust(asr) + ih,
    maghrib: adjust(sunset) + ih,
    isya: adjust(isha) + ih,
  };

  const out = {} as PrayerTimes;
  for (const key of ALL_TIMES) {
    const h = hours[key];
    const base = new Date(y, m - 1, d, 0, 0, 0, 0);
    if (!Number.isFinite(h)) {
      out[key] = new Date(NaN);
      continue;
    }
    // bulatkan ke menit terdekat (ke atas untuk waktu masuk sholat, gaya Kemenag)
    const totalMinutes = Math.ceil(h * 60 - 0.0001);
    base.setMinutes(totalMinutes);
    out[key] = base;
  }
  return out;
}

export function formatTime(d: Date): string {
  if (!(d instanceof Date) || Number.isNaN(d.getTime())) return '--:--';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export interface NextPrayer {
  key: PrayerKey;
  time: Date;
  /** waktu sholat sebelumnya (untuk progress bar) */
  prev: Date;
  prevKey: PrayerKey;
}

/** Cari sholat fardhu berikutnya. `tomorrow` dipakai jika sudah lewat Isya. */
export function getNextPrayer(now: Date, today: PrayerTimes, tomorrow: PrayerTimes, yesterday?: PrayerTimes): NextPrayer {
  for (let i = 0; i < FARDHU.length; i++) {
    const key = FARDHU[i];
    if (today[key] > now) {
      const prevKey = i === 0 ? 'isya' : FARDHU[i - 1];
      const prev = i === 0 ? (yesterday?.isya ?? new Date(today.subuh.getTime() - 8 * 3600e3)) : today[prevKey];
      return { key, time: today[key], prev, prevKey };
    }
  }
  return { key: 'subuh', time: tomorrow.subuh, prev: today.isya, prevKey: 'isya' };
}

/** Sholat yang sedang berlangsung (waktu terakhir yang sudah masuk) */
export function getCurrentPrayer(now: Date, today: PrayerTimes): PrayerKey | null {
  let current: PrayerKey | null = null;
  for (const key of FARDHU) if (today[key] <= now) current = key;
  if (current === 'subuh' && today.terbit <= now) return null; // lewat terbit: waktu subuh habis
  return current;
}

export function formatCountdown(ms: number): string {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
