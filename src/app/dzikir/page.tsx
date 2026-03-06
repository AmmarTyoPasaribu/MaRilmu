'use client';

import { useState } from 'react';
import dzikirData from '@/data/dzikir.json';

type Waktu = 'pagi' | 'sore';

interface DzikirItem { id: number; title: string; arabic: string; latin: string; translation: string; count: number; }

export default function DzikirPage() {
  const [waktu, setWaktu] = useState<Waktu>('pagi');
  const items = (waktu === 'pagi' ? dzikirData.pagi : dzikirData.sore) as DzikirItem[];

  return (
    <>
      <div className="page-header"><div className="container"><h1>🌅 Dzikir Pagi & Sore</h1><p>Al-Ma&apos;tsurat — dzikir harian pagi dan sore</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="filter-bar">
            <button className={`filter-btn ${waktu === 'pagi' ? 'active' : ''}`} onClick={() => setWaktu('pagi')}>🌅 Dzikir Pagi</button>
            <button className={`filter-btn ${waktu === 'sore' ? 'active' : ''}`} onClick={() => setWaktu('sore')}>🌇 Dzikir Sore</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((d, i) => (
              <div key={d.id} className="doa-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <div className="doa-card-title">{i + 1}. {d.title}</div>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'var(--bg-accent)', color: 'white', fontWeight: 600 }}>{d.count}×</span>
                </div>
                <div className="doa-arabic">{d.arabic}</div>
                <div className="doa-latin">{d.latin}</div>
                <div className="doa-translation">{d.translation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
