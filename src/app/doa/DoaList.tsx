'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, SearchField } from '@/components/ui';
import { copyText, useToast } from '@/components/providers/Toast';
import { DOA_THEMES, themeOf, type Doa } from '@/lib/doa';
import { useDoaFavorites, useHydrated, useSettings } from '@/lib/store';

const PAGE = 24;
const norm = (s: string) => s.toLowerCase();

export default function DoaList({ list, source }: { list: Doa[]; source: 'equran' | 'lokal' }) {
  const [q, setQ] = useState('');
  const [theme, setTheme] = useState('semua');
  const [limit, setLimit] = useState(PAGE);
  const [favs, setFavs] = useDoaFavorites();
  const hydrated = useHydrated();

  const themes = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of list) {
      const t = themeOf(d.grup);
      counts[t] = (counts[t] ?? 0) + 1;
    }
    return [
      { id: 'semua', label: 'Semua', count: list.length },
      { id: 'favorit', label: 'Favorit', count: favs.length },
      ...DOA_THEMES.filter((t) => counts[t.id]).map((t) => ({ id: t.id, label: t.label, count: counts[t.id] })),
      ...(counts.lainnya ? [{ id: 'lainnya', label: 'Lainnya', count: counts.lainnya }] : []),
    ];
  }, [list, favs.length]);

  const filtered = useMemo(() => {
    const nq = norm(q.trim());
    const favSet = new Set(favs);
    return list.filter((d) => {
      if (theme === 'favorit' && !favSet.has(d.id)) return false;
      if (theme !== 'semua' && theme !== 'favorit' && themeOf(d.grup) !== theme) return false;
      if (!nq) return true;
      return (
        norm(d.nama).includes(nq) ||
        norm(d.grup).includes(nq) ||
        norm(d.idn).includes(nq) ||
        norm(d.tr).includes(nq) ||
        d.tag.some((t) => t.includes(nq))
      );
    });
  }, [list, q, theme, favs]);

  const toggleFav = (id: number) => setFavs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <>
      <SearchField
        value={q}
        onChange={(v) => {
          setQ(v);
          setLimit(PAGE);
        }}
        placeholder="Cari doa: makan, tidur, safar, hujan, hutang…"
      />
      <div className="chips" role="tablist" aria-label="Tema doa">
        {themes.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={theme === t.id}
            className={`chip-btn${theme === t.id ? ' on' : ''}`}
            onClick={() => {
              setTheme(t.id);
              setLimit(PAGE);
            }}
          >
            {t.id === 'favorit' && <Icon name="heart" size={14} />}
            {t.label}
            {hydrated || t.id !== 'favorit' ? <span className="chip-count">{t.count}</span> : null}
          </button>
        ))}
      </div>

      <p className="result-count">
        {filtered.length} doa{q && ` untuk “${q}”`}
      </p>

      {filtered.length === 0 ? (
        <EmptyState icon={theme === 'favorit' ? 'heart' : 'search'} title={theme === 'favorit' ? 'Belum ada doa favorit' : 'Doa tidak ditemukan'}>
          {theme === 'favorit' && <p>Ketuk ikon hati pada doa untuk menyimpannya.</p>}
        </EmptyState>
      ) : (
        <div className="doa-grid">
          {filtered.slice(0, limit).map((d) => (
            <DoaCard key={d.id} doa={d} fav={hydrated && favs.includes(d.id)} onFav={toggleFav} />
          ))}
        </div>
      )}

      {filtered.length > limit && (
        <div className="center mt-3">
          <button className="btn btn-outline" onClick={() => setLimit((l) => l + PAGE)}>
            Tampilkan lebih banyak ({filtered.length - limit} lagi)
          </button>
        </div>
      )}

      {source === 'lokal' && (
        <p className="times-note mt-3">
          <Icon name="info" size={14} /> Sedang offline — menampilkan koleksi doa lokal.
        </p>
      )}
    </>
  );
}

function DoaCard({ doa, fav, onFav }: { doa: Doa; fav: boolean; onFav: (id: number) => void }) {
  const [settings] = useSettings();
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const copy = async () => {
    const ok = await copyText(`${doa.nama}\n\n${doa.ar}\n\n${doa.tr}\n\nArtinya: ${doa.idn}\n\n— via MaRilmu`);
    toast(ok ? 'Doa disalin' : 'Gagal menyalin', ok ? 'checkCircle' : 'alert');
  };

  return (
    <article className="arabic-block doa-card">
      <header className="arabic-block-head">
        <div>
          <span className="doa-group">{doa.grup}</span>
          <h3>{doa.nama}</h3>
        </div>
        <button className={`icon-btn sm${fav ? ' on' : ''}`} onClick={() => onFav(doa.id)} aria-pressed={fav} aria-label={fav ? 'Hapus dari favorit' : 'Tambah ke favorit'}>
          <Icon name={fav ? 'heartFill' : 'heart'} size={17} />
        </button>
      </header>
      <p className="arabic arabic-lg" lang="ar" dir="rtl">
        {doa.ar}
      </p>
      {settings.showLatin && <p className="latin">{doa.tr}</p>}
      {settings.showTranslation && <p className="translation">{doa.idn}</p>}
      {open && doa.tentang && <p className="doa-about">{doa.tentang}</p>}
      <footer className="arabic-block-foot">
        {doa.tentang ? (
          <button className="chip-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            <Icon name="info" size={14} /> {open ? 'Tutup' : 'Sumber & keterangan'}
          </button>
        ) : (
          <span />
        )}
        <button className="chip-btn" onClick={copy}>
          <Icon name="copy" size={14} /> Salin
        </button>
      </footer>
    </article>
  );
}
