'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, SearchField } from '@/components/ui';
import { shareText, useToast } from '@/components/providers/Toast';
import { useNow, useSettings } from '@/lib/store';
import haditsData from '@/data/hadits.json';

interface Hadits {
  id: number;
  narrator: string;
  source: string;
  arabic: string;
  latin: string;
  translation: string;
  topic: string;
}

const DATA = haditsData as Hadits[];
const TOPICS = ['Semua', ...Array.from(new Set(DATA.map((h) => h.topic)))];

export default function HaditsView() {
  const now = useNow();
  const [settings] = useSettings();
  const toast = useToast();
  const [picked, setPicked] = useState<number | null>(null);
  const [topic, setTopic] = useState('Semua');
  const [q, setQ] = useState('');

  const dayIndex = now ? Math.floor(new Date(new Date(now).toDateString()).getTime() / 864e5) : 0;
  const featured = picked != null ? DATA.find((h) => h.id === picked)! : DATA[dayIndex % DATA.length];

  const list = useMemo(() => {
    const nq = q.toLowerCase().trim();
    return DATA.filter((h) => (topic === 'Semua' || h.topic === topic) && (!nq || h.translation.toLowerCase().includes(nq) || h.latin.toLowerCase().includes(nq)));
  }, [q, topic]);

  const random = () => {
    let next = featured.id;
    while (next === featured.id) next = DATA[Math.floor(Math.random() * DATA.length)].id;
    setPicked(next);
  };

  const share = async (h: Hadits) => {
    const r = await shareText('Hadits', `${h.arabic}\n\n“${h.translation}”\n\n— ${h.source}, dari ${h.narrator}`);
    if (r === 'copied') toast('Hadits disalin');
  };

  return (
    <>
      <article className="hadits-feature" aria-live="polite">
        <div className="page-header-pattern" aria-hidden />
        <header>
          <span className="badge gold">{picked == null ? 'Hadits hari ini' : featured.topic}</span>
        </header>
        <p className="arabic hadits-ar" lang="ar" dir="rtl">
          {featured.arabic}
        </p>
        {settings.showLatin && <p className="hadits-latin">{featured.latin}</p>}
        <p className="hadits-tr">“{featured.translation}”</p>
        <p className="hadits-src">
          {featured.source} · diriwayatkan dari {featured.narrator}
        </p>
        <div className="hadits-actions">
          <button className="hero-btn on" onClick={random}>
            <Icon name="dice" size={15} /> Hadits acak
          </button>
          <button className="hero-btn" onClick={() => share(featured)}>
            <Icon name="share" size={15} /> Bagikan
          </button>
        </div>
      </article>

      <div className="chips mt-3" role="tablist" aria-label="Topik hadits">
        {TOPICS.map((t) => (
          <button key={t} role="tab" aria-selected={topic === t} className={`chip-btn${topic === t ? ' on' : ''}`} onClick={() => setTopic(t)}>
            {t}
          </button>
        ))}
      </div>
      <SearchField value={q} onChange={setQ} placeholder="Cari isi hadits…" />

      {list.length === 0 ? (
        <EmptyState title="Hadits tidak ditemukan" />
      ) : (
        <ul className="hadits-list">
          {list.map((h) => (
            <li key={h.id}>
              <button
                className={`hadits-item${h.id === featured.id ? ' active' : ''}`}
                onClick={() => {
                  setPicked(h.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="badge">{h.topic}</span>
                <span className="hadits-item-tr">“{h.translation}”</span>
                <small>{h.source}</small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
