'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, SearchField } from '@/components/ui';
import husna from '@/data/asmaul-husna.json';

interface Name {
  number: number;
  arabic: string;
  latin: string;
  meaning: string;
}
const DATA = husna as Name[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '');

export default function HusnaView() {
  const [q, setQ] = useState('');
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const nq = norm(q);
    if (!nq) return DATA;
    return DATA.filter((h) => norm(h.latin).includes(nq) || norm(h.meaning).includes(nq) || String(h.number) === q.trim());
  }, [q]);

  const reveal = (n: number) =>
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  return (
    <>
      <div className="husna-toolbar">
        <SearchField value={q} onChange={setQ} placeholder="Cari nama atau arti, mis. Ar-Rahman, pengampun…" />
        <button
          className={`chip-btn gold${quiz ? ' on' : ''}`}
          onClick={() => {
            setQuiz((v) => !v);
            setRevealed(new Set());
          }}
          aria-pressed={quiz}
        >
          <Icon name="brain" size={15} /> Mode hafalan
        </button>
      </div>
      {quiz && <p className="result-count">Ketuk kartu untuk melihat nama & artinya. Terbuka {revealed.size} dari {DATA.length}.</p>}

      {filtered.length === 0 ? (
        <EmptyState title="Nama tidak ditemukan" />
      ) : (
        <ul className="husna-grid">
          {filtered.map((h) => {
            const hidden = quiz && !revealed.has(h.number);
            return (
              <li key={h.number}>
                <button className={`husna-card${hidden ? ' hidden' : ''}`} onClick={() => quiz && reveal(h.number)} tabIndex={quiz ? 0 : -1}>
                  <span className="husna-num">{h.number}</span>
                  <span className="husna-ar arabic">{h.arabic}</span>
                  <span className="husna-latin">{hidden ? '• • •' : h.latin}</span>
                  <span className="husna-meaning">{hidden ? 'Ketuk untuk membuka' : h.meaning}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
