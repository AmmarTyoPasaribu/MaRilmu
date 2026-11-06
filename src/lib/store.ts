'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { AsrMadhab, MethodId } from './prayer';

/* ============================================================
 * Penyimpanan lokal (localStorage) yang aman untuk SSR/hidrasi.
 * Nilai `initial` HARUS konstanta modul (referensi stabil).
 * ============================================================ */

const EVENT = 'marilmu:storage';
const cache = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function readStored<T>(key: string, initial: T): T {
  if (typeof window === 'undefined') return initial;
  const raw = readRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T;
  let value: T = initial;
  if (raw != null) {
    try {
      const parsed = JSON.parse(raw);
      value =
        initial && typeof initial === 'object' && !Array.isArray(initial) && parsed && typeof parsed === 'object'
          ? ({ ...initial, ...parsed } as T)
          : (parsed as T);
    } catch {
      value = initial;
    }
  }
  cache.set(key, { raw, value });
  return value;
}

export function writeStored<T>(key: string, value: T) {
  try {
    const raw = JSON.stringify(value);
    window.localStorage.setItem(key, raw);
    cache.set(key, { raw, value });
  } catch {
    cache.set(key, { raw: null, value });
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
}

function subscribeStorage(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener('storage', cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener('storage', cb);
  };
}

export function useStored<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const value = useSyncExternalStore(
    subscribeStorage,
    () => readStored(key, initial),
    () => initial,
  );
  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const prev = readStored(key, initial);
      const next = typeof v === 'function' ? (v as (p: T) => T)(prev) : v;
      writeStored(key, next);
    },
    [key, initial],
  );
  return [value, set];
}

/** true setelah komponen berjalan di browser (false saat SSR & hidrasi). */
const noopSubscribe = () => () => {};
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/* ============================================================
 * Jam global (satu interval untuk seluruh aplikasi)
 * ============================================================ */

let nowValue = 0;
const tickListeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function subscribeTick(cb: () => void) {
  tickListeners.add(cb);
  if (!timer) {
    nowValue = Date.now();
    timer = setInterval(() => {
      nowValue = Date.now();
      tickListeners.forEach((l) => l());
    }, 1000);
  }
  return () => {
    tickListeners.delete(cb);
    if (tickListeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
    }
  };
}

/** Waktu sekarang (ms), diperbarui tiap detik. 0 saat SSR. */
export function useNow(): number {
  return useSyncExternalStore(
    subscribeTick,
    () => nowValue || (nowValue = Date.now()),
    () => 0,
  );
}

/* ============================================================
 * Pengaturan
 * ============================================================ */

export type ThemeMode = 'system' | 'light' | 'dark';
export type QariId = '01' | '02' | '03' | '04' | '05' | '06';

export interface Settings {
  theme: ThemeMode;
  method: MethodId;
  madhab: AsrMadhab;
  hijriOffset: number;
  arabicSize: number; // 1..5
  showLatin: boolean;
  showTranslation: boolean;
  qari: QariId;
  notify: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  method: 'kemenag',
  madhab: 'syafii',
  hijriOffset: 0,
  arabicSize: 3,
  showLatin: true,
  showTranslation: true,
  qari: '05',
  notify: false,
};

export const SETTINGS_KEY = 'marilmu:settings';

export function useSettings() {
  const [settings, setSettings] = useStored<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS);
  const update = useCallback(
    (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch })),
    [setSettings],
  );
  return [settings, update] as const;
}

/* ============================================================
 * Lokasi
 * ============================================================ */

export interface SavedLocation {
  latitude: number;
  longitude: number;
  name: string;
  source: 'default' | 'gps' | 'manual';
}

export const DEFAULT_LOCATION: SavedLocation = {
  latitude: -6.2088,
  longitude: 106.8456,
  name: 'Jakarta',
  source: 'default',
};

export const LOCATION_KEY = 'marilmu:location';

export function useLocation() {
  return useStored<SavedLocation>(LOCATION_KEY, DEFAULT_LOCATION);
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=id`,
    );
    const data = await res.json();
    const a = data.address ?? {};
    return a.city || a.town || a.municipality || a.county || a.state_district || a.state || 'Lokasi Anda';
  } catch {
    return 'Lokasi Anda';
  }
}

export interface PlaceResult {
  name: string;
  detail: string;
  latitude: number;
  longitude: number;
}

export async function searchPlaces(q: string): Promise<PlaceResult[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&limit=6&accept-language=id&q=${encodeURIComponent(q)}`,
  );
  const data: Array<{ name: string; display_name: string; lat: string; lon: string }> = await res.json();
  return data.map((d) => ({
    name: d.name || d.display_name.split(',')[0],
    detail: d.display_name,
    latitude: Number(d.lat),
    longitude: Number(d.lon),
  }));
}

export function detectLocation(): Promise<SavedLocation> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      reject(new Error('Perangkat tidak mendukung GPS'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const name = await reverseGeocode(latitude, longitude);
        const loc: SavedLocation = { latitude, longitude, name, source: 'gps' };
        writeStored(LOCATION_KEY, loc);
        resolve(loc);
      },
      (err) =>
        reject(
          new Error(
            err.code === err.PERMISSION_DENIED
              ? 'Izin lokasi ditolak. Aktifkan izin lokasi di browser atau pilih kota secara manual.'
              : 'Gagal mendeteksi lokasi. Coba lagi atau pilih kota secara manual.',
          ),
        ),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  });
}

/* ============================================================
 * Bookmark & terakhir dibaca
 * ============================================================ */

export interface AyahBookmark {
  surah: number;
  ayah: number;
  name: string;
  at: number;
}

export interface LastRead {
  surah: number;
  ayah: number;
  name: string;
  at: number;
}

export const EMPTY_AYAH_BOOKMARKS: AyahBookmark[] = [];
export const EMPTY_IDS: number[] = [];

export function useAyahBookmarks() {
  return useStored<AyahBookmark[]>('marilmu:bookmarks:ayat', EMPTY_AYAH_BOOKMARKS);
}

export function useDoaFavorites() {
  return useStored<number[]>('marilmu:bookmarks:doa', EMPTY_IDS);
}

export function useLastRead() {
  return useStored<LastRead | null>('marilmu:last-read', null);
}
