'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '../Icon';
import { ALL_NAV } from '@/lib/site';
import { SURAHS } from '@/lib/quran';

interface Result {
  href: string;
  title: string;
  sub: string;
  icon: 'quran' | (typeof ALL_NAV)[number]['icon'];
  ar?: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open, onClose]);

  const results = useMemo<Result[]>(() => {
    const nq = norm(q);
    const features: Result[] = ALL_NAV.filter((i) => !nq || norm(i.label + i.desc).includes(nq)).map((i) => ({
      href: i.href,
      title: i.label,
      sub: i.desc,
      icon: i.icon,
    }));
    if (!nq) return features.slice(0, 8);
    const num = Number(q.trim());
    const surahs: Result[] = SURAHS.filter(
      (s) => norm(s.lat).includes(nq) || norm(s.arti).includes(nq) || (num && s.n === num),
    )
      .slice(0, 8)
      .map((s) => ({
        href: `/quran/${s.n}`,
        title: `${s.n}. ${s.lat}`,
        sub: `${s.arti} · ${s.ayat} ayat`,
        icon: 'quran',
        ar: s.ar,
      }));
    return [...features, ...surahs];
  }, [q]);

  if (!open) return null;

  const go = (r: Result | undefined) => {
    if (!r) return;
    onClose();
    setQ('');
    router.push(r.href);
  };

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div className="search-dialog" role="dialog" aria-modal="true" aria-label="Pencarian" onClick={(e) => e.stopPropagation()}>
        <div className="search-dialog-input">
          <Icon name="search" size={20} />
          <input
            ref={inputRef}
            autoFocus
            value={q}
            placeholder="Cari fitur atau surah… (mis. Yasin, kiblat)"
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === 'Enter') go(results[active]);
            }}
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="search-dialog-results">
          {results.length === 0 && <li className="search-empty">Tidak ada hasil untuk “{q}”.</li>}
          {results.map((r, i) => (
            <li key={r.href}>
              <button className={i === active ? 'active' : ''} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                <span className="search-result-icon">
                  <Icon name={r.icon} size={18} />
                </span>
                <span className="search-result-text">
                  <strong>{r.title}</strong>
                  <small>{r.sub}</small>
                </span>
                {r.ar && <span className="search-result-ar arabic">{r.ar}</span>}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
