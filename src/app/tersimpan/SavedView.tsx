'use client';

import Link from 'next/link';
import { useState } from 'react';
import Icon from '@/components/Icon';
import ArabicBlock from '@/components/ArabicBlock';
import { EmptyState, Segmented } from '@/components/ui';
import { StarNumber } from '../quran/QuranIndex';
import { useAyahBookmarks, useDoaFavorites, useHydrated, useLastRead } from '@/lib/store';
import type { Doa } from '@/lib/doa';

export default function SavedView({ doaList }: { doaList: Doa[] }) {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<'ayat' | 'doa'>('ayat');
  const [bookmarks, setBookmarks] = useAyahBookmarks();
  const [favs, setFavs] = useDoaFavorites();
  const [lastRead] = useLastRead();

  const favDoa = hydrated ? doaList.filter((d) => favs.includes(d.id)) : [];
  const ayat = hydrated ? [...bookmarks].sort((a, b) => b.at - a.at) : [];

  return (
    <>
      <div className="segmented-wrap">
        <Segmented<'ayat' | 'doa'>
          label="Jenis"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'ayat', label: `Ayat (${ayat.length})`, icon: 'quran' },
            { value: 'doa', label: `Doa (${favDoa.length})`, icon: 'hands' },
          ]}
        />
      </div>

      {tab === 'ayat' && (
        <>
          {hydrated && lastRead && (
            <Link href={`/quran/${lastRead.surah}#ayat-${lastRead.ayah}`} className="card card-link continue-card">
              <span className="continue-icon">
                <Icon name="rehal" size={26} />
              </span>
              <span className="continue-text">
                <small>Terakhir dibaca</small>
                <strong>
                  {lastRead.name} · Ayat {lastRead.ayah}
                </strong>
              </span>
              <Icon name="arrowRight" size={20} />
            </Link>
          )}
          {ayat.length === 0 ? (
            <EmptyState icon="bookmark" title="Belum ada ayat tersimpan">
              <p>Ketuk ikon penanda pada ayat saat membaca Al-Quran.</p>
              <Link href="/quran" className="btn btn-primary mt-1">
                Buka Al-Quran
              </Link>
            </EmptyState>
          ) : (
            <ul className="bookmark-list mt-2">
              {ayat.map((b) => (
                <li key={`${b.surah}:${b.ayah}`} className="card bookmark-item">
                  <Link href={`/quran/${b.surah}#ayat-${b.ayah}`}>
                    <StarNumber n={b.ayah} size="sm" />
                    <span>
                      <strong>
                        QS. {b.name} : {b.ayah}
                      </strong>
                      <small>Disimpan {new Date(b.at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</small>
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
          )}
        </>
      )}

      {tab === 'doa' &&
        (favDoa.length === 0 ? (
          <EmptyState icon="heart" title="Belum ada doa favorit">
            <p>Ketuk ikon hati pada doa untuk menyimpannya.</p>
            <Link href="/doa" className="btn btn-primary mt-1">
              Jelajahi doa
            </Link>
          </EmptyState>
        ) : (
          <div className="stack">
            {favDoa.map((d) => (
              <ArabicBlock
                key={d.id}
                title={d.nama}
                arabic={d.ar}
                latin={d.tr}
                translation={d.idn}
                badge={
                  <button className="icon-btn sm on" aria-label="Hapus dari favorit" onClick={() => setFavs((prev) => prev.filter((x) => x !== d.id))}>
                    <Icon name="heartFill" size={16} />
                  </button>
                }
              />
            ))}
          </div>
        ))}
    </>
  );
}
