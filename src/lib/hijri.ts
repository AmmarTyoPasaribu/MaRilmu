/**
 * Kalender Hijriah lokal memakai Intl (Umm al-Qura) dengan fallback
 * algoritma tabular. Mendukung koreksi ±hari (hasil rukyat/isbat bisa berbeda).
 */

export interface HijriDate {
  day: number;
  month: number; // 1-12
  year: number;
}

export const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi'ul Awal",
  "Rabi'ul Akhir",
  'Jumadil Awal',
  'Jumadil Akhir',
  'Rajab',
  "Sya'ban",
  'Ramadhan',
  'Syawal',
  "Dzulqa'dah",
  'Dzulhijjah',
];

export const HIJRI_MONTHS_AR = [
  'مُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الآخِر',
  'جُمَادَى الأُولَى',
  'جُمَادَى الآخِرَة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة',
];

export const GREGORIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export const WEEKDAYS = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
export const WEEKDAYS_SHORT = ['Ahd', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

let formatter: Intl.DateTimeFormat | null | undefined;

function getFormatter(): Intl.DateTimeFormat | null {
  if (formatter !== undefined) return formatter;
  try {
    const f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    formatter = f.resolvedOptions().calendar.startsWith('islamic') ? f : null;
  } catch {
    formatter = null;
  }
  return formatter;
}

/** Algoritma tabular (Kuwaiti) sebagai cadangan */
function tabularHijri(date: Date): HijriDate {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let jd =
    Math.floor((1461 * (y + 4800 + Math.floor((m - 14) / 12))) / 4) +
    Math.floor((367 * (m - 2 - 12 * Math.floor((m - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((y + 4900 + Math.floor((m - 14) / 12)) / 100)) / 4) +
    d -
    32075;
  jd = jd - 1948440 + 10632;
  const n = Math.floor((jd - 1) / 10631);
  jd = jd - 10631 * n + 354;
  const j =
    Math.floor((10985 - jd) / 5316) * Math.floor((50 * jd) / 17719) +
    Math.floor(jd / 5670) * Math.floor((43 * jd) / 15238);
  jd =
    jd -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const month = Math.floor((24 * jd) / 709);
  const day = jd - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day, month, year };
}

/** Konversi tanggal Masehi (kalender lokal) ke Hijriah. */
export function toHijri(date: Date, offsetDays = 0): HijriDate {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate() + offsetDays);
  const f = getFormatter();
  if (!f) return tabularHijri(local);
  // pakai UTC agar tidak bergeser karena zona waktu
  const utc = new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate(), 12));
  const parts = f.formatToParts(utc);
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
  const day = get('day');
  const month = get('month');
  const year = get('year') || get('relatedYear');
  if (!day || !month || !year) return tabularHijri(local);
  return { day, month, year };
}

export function formatHijri(h: HijriDate, withYear = true): string {
  return `${h.day} ${HIJRI_MONTHS[h.month - 1]}${withYear ? ` ${h.year} H` : ''}`;
}

export function formatGregorian(date: Date, withWeekday = false): string {
  const base = `${date.getDate()} ${GREGORIAN_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  return withWeekday ? `${WEEKDAYS[date.getDay()]}, ${base}` : base;
}

// ---------- Hari besar Islam ----------

export interface IslamicEvent {
  month: number;
  day: number;
  name: string;
  kind: 'hari-raya' | 'peringatan' | 'puasa' | 'haram';
  note?: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { month: 1, day: 1, name: 'Tahun Baru Islam', kind: 'peringatan', note: 'Awal tahun Hijriah, memperingati hijrah Nabi ﷺ ke Madinah.' },
  { month: 1, day: 9, name: "Puasa Tasu'a", kind: 'puasa', note: 'Disunnahkan berpuasa sehari sebelum Asyura.' },
  { month: 1, day: 10, name: 'Hari Asyura', kind: 'puasa', note: 'Puasa Asyura menghapus dosa setahun yang lalu (HR. Muslim).' },
  { month: 3, day: 12, name: 'Maulid Nabi Muhammad ﷺ', kind: 'peringatan' },
  { month: 7, day: 27, name: "Isra Mi'raj", kind: 'peringatan', note: 'Peristiwa perjalanan malam Nabi ﷺ dan turunnya perintah sholat.' },
  { month: 8, day: 15, name: "Nisfu Sya'ban", kind: 'peringatan' },
  { month: 9, day: 1, name: 'Awal Ramadhan', kind: 'puasa', note: 'Hari pertama puasa wajib (menunggu sidang isbat).' },
  { month: 9, day: 17, name: "Nuzulul Qur'an", kind: 'peringatan' },
  { month: 10, day: 1, name: 'Idul Fitri', kind: 'hari-raya', note: 'Haram berpuasa pada hari ini.' },
  { month: 12, day: 8, name: 'Hari Tarwiyah', kind: 'puasa' },
  { month: 12, day: 9, name: 'Hari Arafah', kind: 'puasa', note: 'Puasa Arafah menghapus dosa setahun lalu dan setahun yang akan datang (HR. Muslim).' },
  { month: 12, day: 10, name: 'Idul Adha', kind: 'hari-raya', note: 'Haram berpuasa pada hari ini.' },
  { month: 12, day: 11, name: 'Hari Tasyrik', kind: 'haram', note: 'Haram berpuasa.' },
  { month: 12, day: 12, name: 'Hari Tasyrik', kind: 'haram', note: 'Haram berpuasa.' },
  { month: 12, day: 13, name: 'Hari Tasyrik', kind: 'haram', note: 'Haram berpuasa.' },
];

export function getEventsFor(h: HijriDate): IslamicEvent[] {
  return ISLAMIC_EVENTS.filter((e) => e.month === h.month && e.day === h.day);
}

export type SunnahFast = 'senin-kamis' | 'ayyamul-bidh';

/** Puasa sunnah rutin pada tanggal ini (bukan pada hari yang diharamkan). */
export function getSunnahFasts(date: Date, h: HijriDate): SunnahFast[] {
  const out: SunnahFast[] = [];
  const forbidden = (h.month === 10 && h.day === 1) || (h.month === 12 && h.day >= 10 && h.day <= 13) || h.month === 9;
  if (forbidden) return out;
  const wd = date.getDay();
  if (wd === 1 || wd === 4) out.push('senin-kamis');
  if (h.day >= 13 && h.day <= 15) out.push('ayyamul-bidh');
  return out;
}

export interface UpcomingEvent extends IslamicEvent {
  date: Date;
  hijri: HijriDate;
  daysLeft: number;
}

/** Cari hari besar Islam berikutnya dalam rentang `daysAhead` hari. */
export function getUpcomingEvents(from: Date, offsetDays = 0, daysAhead = 400, limit = 20): UpcomingEvent[] {
  const out: UpcomingEvent[] = [];
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const seen = new Set<string>();
  for (let i = 0; i <= daysAhead && out.length < limit; i++) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
    const h = toHijri(date, offsetDays);
    for (const e of getEventsFor(h)) {
      const key = `${e.name}-${h.year}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ ...e, date, hijri: h, daysLeft: i });
    }
  }
  return out;
}

/** Cari tanggal Masehi untuk tanggal Hijriah tertentu (sekitar `near`). */
export function hijriToGregorian(target: HijriDate, offsetDays = 0): Date | null {
  // perkiraan awal: 1 tahun hijriah ≈ 354.367 hari, epoch 16 Juli 622
  const approx = new Date(622, 6, 16 + Math.round((target.year - 1) * 354.367 + (target.month - 1) * 29.53 + target.day - 1));
  for (let delta = -20; delta <= 20; delta++) {
    const d = new Date(approx.getFullYear(), approx.getMonth(), approx.getDate() + delta);
    const h = toHijri(d, offsetDays);
    if (h.year === target.year && h.month === target.month && h.day === target.day) return d;
  }
  return null;
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Awal hari lokal (ms) dari timestamp. */
export function startOfDay(ms: number, addDays = 0): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + addDays).getTime();
}

/** Tanggal 1 bulan lokal (ms), digeser `addMonths`. */
export function startOfMonth(ms: number, addMonths = 0): number {
  const d = new Date(ms);
  return new Date(d.getFullYear(), d.getMonth() + addMonths, 1).getTime();
}
