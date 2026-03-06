'use client';

import { useState, useEffect } from 'react';
import haditsData from '@/data/hadits.json';
import { shareContent } from '@/lib/api';

interface Hadits { id: number; narrator: string; source: string; arabic: string; latin: string; translation: string; topic: string; }

export default function HaditsPage() {
  const [current, setCurrent] = useState<Hadits>(haditsData[0] as Hadits);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const idx = new Date().getDate() % haditsData.length;
    setCurrent(haditsData[idx] as Hadits);
  }, []);

  const randomize = () => {
    const idx = Math.floor(Math.random() * haditsData.length);
    setCurrent(haditsData[idx] as Hadits);
  };

  const handleShare = async () => {
    const text = `${current.arabic}\n\n${current.latin}\n\n"${current.translation}"\n\n— ${current.source} (${current.narrator})`;
    try { await shareContent('MaRilmu — Hadits', text); setToast('✅ Disalin!'); setTimeout(() => setToast(''), 2000); } catch {}
  };

  return (
    <>
      <div className="page-header"><div className="container"><h1>📜 Hadits Harian</h1><p>Pelajari hadits-hadits shahih setiap hari</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="daily-quote">
            <div style={{ marginBottom: '0.5rem' }}>
              <span className="doa-card-category">{current.topic}</span>
            </div>
            <div className="daily-quote-arabic">{current.arabic}</div>
            <p style={{ color: 'var(--teal)', fontStyle: 'italic', marginBottom: '0.75rem', fontSize: '0.95rem' }}>{current.latin}</p>
            <div className="daily-quote-translation">&ldquo;{current.translation}&rdquo;</div>
            <div className="daily-quote-ref">— {current.source} ({current.narrator})</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            <button className="filter-btn active" onClick={randomize}>🎲 Hadits Acak</button>
            <button className="filter-btn" onClick={handleShare}>📋 Salin Hadits</button>
          </div>
          <h3 style={{ marginTop: '3rem', marginBottom: '1rem', textAlign: 'center' }}>Semua Hadits</h3>
          <div className="feature-grid">
            {(haditsData as Hadits[]).map((h) => (
              <div key={h.id} className="doa-card" onClick={() => setCurrent(h)} style={{ cursor: 'pointer', border: current.id === h.id ? '2px solid var(--green-400)' : undefined }}>
                <div className="doa-card-title" style={{ fontSize: '0.95rem' }}>{h.translation.substring(0, 60)}...</div>
                <span className="doa-card-category">{h.topic}</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.source} — {h.narrator}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
