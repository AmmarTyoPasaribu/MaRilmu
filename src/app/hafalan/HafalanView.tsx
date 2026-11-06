'use client';

import Link from 'next/link';
import { useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, PageHeader, Page, SearchField } from '@/components/ui';
import { SURAHS } from '@/lib/quran';
import { useHydrated, useStored } from '@/lib/store';

type Status = 'belum' | 'proses' | 'hafal';
const EMPTY: Record<number, Status> = {};
const NEXT: Record<Status, Status> = { belum: 'proses', proses: 'hafal', hafal: 'belum' };
const LABEL: Record<Status, string> = { belum: 'Belum', proses: 'Menghafal', hafal: 'Hafal' };
const TOTAL_AYAT = SURAHS.reduce((a, s) => a + s.ayat, 0);

type Filter = 'juz30' | 'semua' | 'proses' | 'hafal';

export default function HafalanView() {
  const hydrated = useHydrated();
  const [data, setData] = useStored<Record<number, Status>>('MaRilmu-hafalan', EMPTY);
  const [filter, setFilter] = useState<Filter>('juz30');
  const [q, setQ] = useState('');

  const status = (n: number): Status => (hydrated ? (data[n] ?? 'belum') : 'belum');
  const hafalSurah = hydrated ? SURAHS.filter((s) => data[s.n] === 'hafal') : [];
  const prosesCount = hydrated ? SURAHS.filter((s) => data[s.n] === 'proses').length : 0;
  const hafalAyat = hafalSurah.reduce((a, s) => a + s.ayat, 0);
  const juz30 = SURAHS.filter((s) => s.n >= 78);
  const juz30Done = juz30.filter((s) => status(s.n) === 'hafal').length;

  const nq = q.toLowerCase().trim();
  const list = SURAHS.filter((s) => {
    if (filter === 'juz30' && s.n < 78) return false;
    if ((filter === 'proses' || filter === 'hafal') && status(s.n) !== filter) return false;
    return !nq || s.lat.toLowerCase().includes(nq) || String(s.n) === nq;
  });

  const cycle = (n: number) => setData((prev) => ({ ...prev, [n]: NEXT[prev[n] ?? 'belum'] }));

  return (
    <Page>
      <PageHeader icon="brain" title="Hafalan Al-Quran" subtitle="Ketuk surah untuk mengubah status: Belum → Menghafal → Hafal" />

      <div className="stats">
        <div className="stat stat-emerald">
          <span className="stat-value">{hafalSurah.length}</span>
          <span className="stat-label">Surah hafal</span>
        </div>
        <div className="stat stat-gold">
          <span className="stat-value">{prosesCount}</span>
          <span className="stat-label">Sedang menghafal</span>
        </div>
        <div className="stat stat-sky">
          <span className="stat-value">{((hafalAyat / TOTAL_AYAT) * 100).toFixed(1)}%</span>
          <span className="stat-label">{hafalAyat.toLocaleString('id-ID')} / 6.236 ayat</span>
        </div>
      </div>

      <div className="card juz-amma-progress">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <strong>Target Juz Amma (Juz 30)</strong>
          <span className="badge gold">
            {juz30Done}/{juz30.length} surah
          </span>
        </div>
        <div className="progress mt-1">
          <span style={{ width: `${(juz30Done / juz30.length) * 100}%` }} />
        </div>
      </div>

      <div className="chips mt-2" role="tablist" aria-label="Filter surah">
        {(
          [
            ['juz30', 'Juz Amma'],
            ['semua', 'Semua surah'],
            ['proses', 'Menghafal'],
            ['hafal', 'Sudah hafal'],
          ] as [Filter, string][]
        ).map(([v, l]) => (
          <button key={v} role="tab" aria-selected={filter === v} className={`chip-btn${filter === v ? ' on' : ''}`} onClick={() => setFilter(v)}>
            {l}
          </button>
        ))}
      </div>
      {filter === 'semua' && <SearchField value={q} onChange={setQ} placeholder="Cari surah…" />}

      {list.length === 0 ? (
        <EmptyState icon="brain" title="Belum ada surah di daftar ini" />
      ) : (
        <ul className="hafalan-grid">
          {list.map((s) => {
            const st = status(s.n);
            return (
              <li key={s.n} className={`hafalan-item st-${st}`}>
                <button className="hafalan-toggle" onClick={() => cycle(s.n)} aria-label={`${s.lat}: ${LABEL[st]}. Ketuk untuk ubah`}>
                  <span className="hafalan-status">{st === 'hafal' ? <Icon name="check" size={16} strokeWidth={2.5} /> : st === 'proses' ? <Icon name="refresh" size={14} /> : s.n}</span>
                  <span className="hafalan-text">
                    <strong>{s.lat}</strong>
                    <small>
                      {s.ayat} ayat · {LABEL[st]}
                    </small>
                  </span>
                </button>
                <Link href={`/quran/${s.n}`} className="icon-btn sm" aria-label={`Buka ${s.lat}`}>
                  <Icon name="quran" size={16} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Page>
  );
}
