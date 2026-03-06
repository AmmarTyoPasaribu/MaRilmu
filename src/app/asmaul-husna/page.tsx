'use client';

import { useState } from 'react';
import husnaData from '@/data/asmaul-husna.json';
import type { HusnaName } from '@/types';

const data = husnaData as HusnaName[];

export default function AsmaulHusnaPage() {
  const [search, setSearch] = useState('');

  const filtered = data.filter(
    (h) =>
      h.latin.toLowerCase().includes(search.toLowerCase()) ||
      h.meaning.toLowerCase().includes(search.toLowerCase()) ||
      h.arabic.includes(search) ||
      String(h.number).includes(search)
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>🌟 Asmaul Husna</h1>
          <p>99 Nama Allah Yang Maha Indah</p>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Cari nama Allah..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="husna-grid">
            {filtered.map((h) => (
              <div key={h.number} className="husna-card">
                <div className="husna-number">{h.number}</div>
                <div className="husna-arabic">{h.arabic}</div>
                <div className="husna-latin">{h.latin}</div>
                <div className="husna-meaning">{h.meaning}</div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="empty-state"><div className="empty-state-icon">🔍</div><p>Nama tidak ditemukan</p></div>
          )}
        </div>
      </div>
    </>
  );
}
