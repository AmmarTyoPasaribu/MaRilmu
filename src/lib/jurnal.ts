'use client';

import type { IconName } from '@/components/Icon';
import { useStored } from './store';

export interface JurnalEntry {
  sholat: boolean[];
  quran?: boolean;
  dzikir?: boolean;
  dhuha?: boolean;
  tahajud?: boolean;
  sedekah?: boolean;
  puasaSunnah?: boolean;
}

export type IbadahKey = Exclude<keyof JurnalEntry, 'sholat'>;

export const IBADAH_ITEMS: { key: IbadahKey; label: string; icon: IconName }[] = [
  { key: 'quran', label: 'Tilawah Al-Quran', icon: 'quran' },
  { key: 'dzikir', label: 'Dzikir pagi / petang', icon: 'beads' },
  { key: 'dhuha', label: 'Sholat Dhuha', icon: 'sun' },
  { key: 'tahajud', label: 'Tahajud / qiyamul lail', icon: 'moon' },
  { key: 'sedekah', label: 'Sedekah', icon: 'heartHand' },
  { key: 'puasaSunnah', label: 'Puasa sunnah', icon: 'crescent' },
];

export const SHOLAT_NAMES = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

/** Key penyimpanan dipertahankan agar data lama tidak hilang. */
export const JURNAL_KEY = 'MaRilmu-jurnal';
const EMPTY: Record<string, JurnalEntry> = {};

export function useJurnal() {
  return useStored<Record<string, JurnalEntry>>(JURNAL_KEY, EMPTY);
}

export const TOTAL_ITEMS = SHOLAT_NAMES.length + IBADAH_ITEMS.length;

export function emptyEntry(): JurnalEntry {
  return { sholat: [false, false, false, false, false] };
}

export function entryDone(e: JurnalEntry | undefined): number {
  if (!e) return 0;
  return (e.sholat ?? []).filter(Boolean).length + IBADAH_ITEMS.filter((i) => e[i.key]).length;
}

export function sholatDone(e: JurnalEntry | undefined): number {
  return (e?.sholat ?? []).filter(Boolean).length;
}
