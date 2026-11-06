'use client';

import { useState } from 'react';
import Icon, { type IconName } from '@/components/Icon';
import { PageHeader, Page } from '@/components/ui';
import artikel from '@/data/artikel.json';

interface Artikel {
  id: number;
  title: string;
  category: string;
  readTime: string;
  content: string;
}

const DATA = artikel as Artikel[];
const CATEGORIES = ['Semua', ...Array.from(new Set(DATA.map((a) => a.category)))];
const CAT_ICON: Record<string, IconName> = { Ibadah: 'mosque', Adab: 'hands', Akhlak: 'heart', Muamalah: 'heartHand' };

/** Render teks sederhana: paragraf, daftar bernomor (1.) dan daftar butir (-). */
function RichText({ text }: { text: string }) {
  return (
    <div className="prose">
      {text.split('\n\n').map((block, i) => {
        const lines = block.split('\n');
        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i}>
              {lines.map((l) => (
                <li key={l}>{l.replace(/^\d+\.\s/, '')}</li>
              ))}
            </ol>
          );
        }
        if (lines.length > 1 && lines.slice(1).every((l) => /^[-•]\s/.test(l))) {
          return (
            <div key={i}>
              <p>
                <strong>{lines[0]}</strong>
              </p>
              <ul>
                {lines.slice(1).map((l) => (
                  <li key={l}>{l.replace(/^[-•]\s/, '')}</li>
                ))}
              </ul>
            </div>
          );
        }
        if (lines.every((l) => /^[-•]\s/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l) => (
                <li key={l}>{l.replace(/^[-•]\s/, '')}</li>
              ))}
            </ul>
          );
        }
        return block.endsWith(':') ? (
          <h3 key={i}>{block.slice(0, -1)}</h3>
        ) : (
          <p key={i}>{block}</p>
        );
      })}
    </div>
  );
}

export default function ArtikelView() {
  const [selected, setSelected] = useState<Artikel | null>(null);
  const [cat, setCat] = useState('Semua');
  const list = cat === 'Semua' ? DATA : DATA.filter((a) => a.category === cat);

  if (selected) {
    return (
      <Page width="narrow">
        <PageHeader icon={CAT_ICON[selected.category] ?? 'notebook'} title={selected.title} subtitle={`${selected.category} · ${selected.readTime} baca`}>
          <button className="hero-btn" onClick={() => setSelected(null)}>
            <Icon name="arrowLeft" size={15} /> Semua artikel
          </button>
        </PageHeader>
        <article className="card story">
          <RichText text={selected.content} />
        </article>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader icon="notebook" title="Artikel Islami" subtitle="Bacaan singkat untuk menambah ilmu dan amal" />
      <div className="chips" role="tablist" aria-label="Kategori artikel">
        {CATEGORIES.map((c) => (
          <button key={c} role="tab" aria-selected={cat === c} className={`chip-btn${cat === c ? ' on' : ''}`} onClick={() => setCat(c)}>
            {c}
          </button>
        ))}
      </div>
      <ul className="grid grid-3">
        {list.map((a) => (
          <li key={a.id}>
            <button
              className="card card-link article-card"
              onClick={() => {
                setSelected(a);
                window.scrollTo({ top: 0 });
              }}
            >
              <span className="article-icon">
                <Icon name={CAT_ICON[a.category] ?? 'notebook'} size={22} />
              </span>
              <span className="row" style={{ gap: 8 }}>
                <span className="badge">{a.category}</span>
                <small className="muted">{a.readTime}</small>
              </span>
              <strong>{a.title}</strong>
              <span className="muted">{a.content.slice(0, 110)}…</span>
            </button>
          </li>
        ))}
      </ul>
    </Page>
  );
}
