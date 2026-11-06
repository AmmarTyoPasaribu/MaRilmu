'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, SearchField, Segmented } from '@/components/ui';
import { FEATURED_SURAHS, JUZ_START, SURAHS, getSurahMeta } from '@/lib/quran';
import { useAyahBookmarks, useHydrated, useLastRead } from '@/lib/store';

type Tab = 'surah' | 'juz' | 'tersimpan';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export function StarNumber({ n, size = 'md' }: { n: number | string; size?: 'sm' | 'md' }) {
  return (
    <span className={`star-num star-num-${size}`}>
      <svg viewBox="0 0 40 40" aria-hidden>
        <path d="M8 8h24v24H8zM20 3l17 17-17 17L3 20z" />
      </svg>
      <span>{n}</span>
    </span>
  );
}

export default function QuranIndex() {
  const [tab, setTab] = useState<Tab>('surah');
  const [q, setQ] = useState('');
  const [lastRead] = useLastRead();
  const [bookmarks, setBookmarks] = useAyahBookmarks();
  const hydrated = useHydrated();

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return SURAHS;
    return SURAHS.filter((s) => norm(s.lat).includes(nq) || norm(s.arti).includes(nq) || String(s.n) === q.trim() || s.ar.includes(q.trim()));
  }, [q]);

  return (
    <>
      {hydrated && lastRead && (
        <Link href={`/quran/${lastRead.surah}#ayat-${lastRead.ayah}`} className="last-read">
          <span className="last-read-icon">
            <Icon name="bookmarkFill" size={20} />
          </span>
          <span className="last-read-text">
            <small>Terakhir dibaca</small>
            <strong>
              {lastRead.name} · Ayat {lastRead.ayah}
            </strong>
          </span>
          <span className="btn btn-gold btn-sm">
            Lanjutkan <Icon name="arrowRight" size={16} />
          </span>
        </Link>
      )}

      <div className="featured-row" aria-label="Surah pilihan">
        {FEATURED_SURAHS.map((f) => {
          const s = getSurahMeta(f.n)!;
          return (
            <Link key={f.n} href={`/quran/${f.n}`} className="featured-chip">
              <strong>{s.lat}</strong>
              <small>{f.note}</small>
            </Link>
          );
        })}
      </div>

      <div className="quran-toolbar">
        <Segmented<Tab>
          label="Tampilan daftar"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'surah', label: 'Surah' },
            { value: 'juz', label: 'Juz' },
            { value: 'tersimpan', label: `Tersimpan${hydrated && bookmarks.length ? ` (${bookmarks.length})` : ''}` },
          ]}
        />
      </div>

      {tab === 'surah' && (
        <>
          <SearchField value={q} onChange={setQ} placeholder="Cari surah: nama, arti, atau nomor…" />
          <ul className="surah-grid">
            {filtered.map((s) => (
              <li key={s.n}>
                <Link href={`/quran/${s.n}`} className="surah-card">
                  <StarNumber n={s.n} />
                  <span className="surah-card-info">
                    <strong>{s.lat}</strong>
                    <small>
                      {s.arti} · {s.ayat} ayat · {s.tempat === 'Mekah' ? 'Makkiyah' : 'Madaniyah'}
                    </small>
                  </span>
                  <span className="surah-card-ar arabic">{s.ar}</span>
                </Link>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && <EmptyState title={`Surah “${q}” tidak ditemukan`} />}
        </>
      )}

      {tab === 'juz' && (
        <ul className="juz-grid">
          {JUZ_START.map(([s, a], i) => {
            const meta = getSurahMeta(s)!;
            const end = JUZ_START[i + 1];
            const endMeta = end ? getSurahMeta(end[1] === 1 ? end[0] - 1 : end[0]) : getSurahMeta(114);
            return (
              <li key={i}>
                <Link href={`/quran/${s}#ayat-${a}`} className="juz-card">
                  <span className="juz-num">
                    <small>Juz</small>
                    <b>{i + 1}</b>
                  </span>
                  <span className="juz-info">
                    <strong>
                      {meta.lat} {a}
                    </strong>
                    <small>sampai {endMeta?.lat}</small>
                  </span>
                  <Icon name="chevronRight" size={18} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {tab === 'tersimpan' &&
        (bookmarks.length === 0 ? (
          <EmptyState icon="bookmark" title="Belum ada ayat tersimpan">
            <p>Ketuk ikon penanda pada ayat mana pun untuk menyimpannya di sini.</p>
          </EmptyState>
        ) : (
          <ul className="bookmark-list">
            {[...bookmarks]
              .sort((a, b) => b.at - a.at)
              .map((b) => (
                <li key={`${b.surah}:${b.ayah}`} className="card bookmark-item">
                  <Link href={`/quran/${b.surah}#ayat-${b.ayah}`}>
                    <StarNumber n={b.ayah} size="sm" />
                    <span>
                      <strong>{b.name}</strong>
                      <small>
                        Surah ke-{b.surah}, ayat {b.ayah}
                      </small>
                    </span>
                  </Link>
                  <button
                    className="icon-btn sm"
                    aria-label="Hapus penanda"
                    onClick={() => setBookmarks((prev) => prev.filter((x) => !(x.surah === b.surah && x.ayah === b.ayah)))}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
          </ul>
        ))}
    </>
  );
}
