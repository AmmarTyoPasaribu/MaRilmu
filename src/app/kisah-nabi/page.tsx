'use client';

import { useState } from 'react';
import kisahData from '@/data/kisah-nabi.json';

interface KisahNabi { id: number; name: string; title: string; story: string; lessons: string; }

const nabiIcons: Record<number, string> = {
  1: '🕊️', 2: '✍️', 3: '🚢', 4: '💨', 5: '🐪', 6: '🕋', 7: '🔥', 8: '🐑',
  9: '👶', 10: '👁️', 11: '⭐', 12: '💪', 13: '🤝', 14: '⚖️', 15: '🌊',
  16: '🗣️', 17: '🎵', 18: '👑', 19: '⛰️', 20: '🌿', 21: '🐋', 22: '🤲',
  23: '💎', 24: '✨', 25: '🌙',
};

export default function KisahNabiPage() {
  const [selected, setSelected] = useState<KisahNabi | null>(null);
  const [search, setSearch] = useState('');
  const data = kisahData as KisahNabi[];

  const filtered = data.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase()) ||
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return (
      <>
        <div className="page-header"><div className="container"><h1>{nabiIcons[selected.id] || '📚'} {selected.name}</h1><p>{selected.title}</p></div></div>
        <div className="page-content">
          <div className="container" style={{ maxWidth: '700px' }}>
            <button className="back-btn" onClick={() => setSelected(null)} style={{ marginBottom: '1.5rem' }}>← Kembali ke Daftar</button>
            <div className="card" style={{ padding: '2.5rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{nabiIcons[selected.id] || '📚'}</div>
                <h2 style={{ color: 'var(--text-green)', marginBottom: '0.25rem' }}>{selected.name}</h2>
                <p style={{ color: 'var(--gold)', fontWeight: 600, fontSize: '0.95rem' }}>{selected.title}</p>
              </div>
              <p style={{ lineHeight: 2, color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', textAlign: 'justify' }}>{selected.story}</p>
              <div style={{ padding: '1.25rem 1.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--amber)' }}>
                <p style={{ fontWeight: 700, color: 'var(--amber)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>💡 Hikmah & Pelajaran</p>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.8 }}>{selected.lessons}</p>
              </div>
              {/* Prev/Next navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', gap: '1rem' }}>
                {selected.id > 1 && (
                  <button className="back-btn" onClick={() => setSelected(data[selected.id - 2])}>
                    ← {data[selected.id - 2].name}
                  </button>
                )}
                <div style={{ flex: 1 }} />
                {selected.id < 25 && (
                  <button className="back-btn" onClick={() => setSelected(data[selected.id])}>
                    {data[selected.id].name} →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header"><div className="container"><h1>📚 Kisah 25 Nabi & Rasul</h1><p>Pelajari kisah para Nabi dan Rasul Allah</p></div></div>
      <div className="page-content">
        <div className="container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Cari nama nabi..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="feature-grid">
            {filtered.map((nabi) => (
              <div key={nabi.id} className="card" onClick={() => setSelected(nabi)} style={{ cursor: 'pointer', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>{nabiIcons[nabi.id] || '📖'}</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{nabi.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-green)', fontWeight: 500, margin: 0 }}>{nabi.title}</p>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{nabi.story.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state"><div className="empty-state-icon">🔍</div><p>Nabi tidak ditemukan</p></div>
          )}
        </div>
      </div>
    </>
  );
}
