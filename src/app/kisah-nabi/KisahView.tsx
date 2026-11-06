'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, PageHeader, Page, SearchField } from '@/components/ui';
import { StarNumber } from '../quran/QuranIndex';
import kisahData from '@/data/kisah-nabi.json';

interface Kisah {
  id: number;
  name: string;
  title: string;
  story: string;
  lessons: string;
}

const DATA = kisahData as Kisah[];
const ULUL_AZMI = new Set([3, 6, 15, 24, 25]);

export default function KisahView() {
  const [selected, setSelected] = useState<Kisah | null>(null);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const nq = q.toLowerCase().trim();
    return nq ? DATA.filter((n) => n.name.toLowerCase().includes(nq) || n.title.toLowerCase().includes(nq) || n.story.toLowerCase().includes(nq)) : DATA;
  }, [q]);

  const open = (k: Kisah | undefined) => {
    if (!k) return;
    setSelected(k);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selected) {
    const idx = DATA.findIndex((d) => d.id === selected.id);
    const prev = DATA[idx - 1];
    const next = DATA[idx + 1];
    return (
      <Page width="narrow">
        <PageHeader icon="people" title={selected.name} subtitle={selected.title}>
          <button className="hero-btn" onClick={() => setSelected(null)}>
            <Icon name="arrowLeft" size={15} /> Semua nabi
          </button>
          {ULUL_AZMI.has(selected.id) && <span className="hero-btn on">Ulul Azmi</span>}
        </PageHeader>
        <article className="card story">
          <p className="story-text">{selected.story}</p>
          <div className="story-lesson">
            <h2>
              <Icon name="sparkle" size={18} /> Hikmah & pelajaran
            </h2>
            <p>{selected.lessons}</p>
          </div>
        </article>
        <nav className="surah-nav" aria-label="Nabi lain">
          {prev ? (
            <button className="surah-nav-link" onClick={() => open(prev)}>
              <Icon name="chevronLeft" size={18} />
              <span>
                <small>Sebelumnya</small>
                <strong>{prev.name}</strong>
              </span>
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button className="surah-nav-link next" onClick={() => open(next)}>
              <span>
                <small>Selanjutnya</small>
                <strong>{next.name}</strong>
              </span>
              <Icon name="chevronRight" size={18} />
            </button>
          ) : (
            <span />
          )}
        </nav>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader icon="people" title="Kisah 25 Nabi & Rasul" subtitle="Teladan para utusan Allah dari Nabi Adam hingga Nabi Muhammad ﷺ" />
      <SearchField value={q} onChange={setQ} placeholder="Cari nabi atau kisah, mis. kapal, ikan, api…" />
      {filtered.length === 0 ? (
        <EmptyState title="Tidak ditemukan" />
      ) : (
        <ul className="grid grid-3">
          {filtered.map((n) => (
            <li key={n.id}>
              <button className="card card-link nabi-card" onClick={() => open(n)}>
                <StarNumber n={n.id} />
                <span className="nabi-card-text">
                  <strong>{n.name}</strong>
                  <small>{n.title}</small>
                  <span>{n.story.slice(0, 110)}…</span>
                </span>
                {ULUL_AZMI.has(n.id) && <span className="badge gold nabi-badge">Ulul Azmi</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}
