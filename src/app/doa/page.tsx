'use client';

import { useState } from 'react';
import doaData from '@/data/doa.json';
import { shareContent } from '@/lib/api';
import type { Doa } from '@/types';

const doaList = doaData as Doa[];
const categories = ['Semua', ...Array.from(new Set(doaList.map((d) => d.category)))];

export default function DoaPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [toast, setToast] = useState('');

  const filtered = doaList.filter((doa) => {
    const matchSearch = doa.title.toLowerCase().includes(search.toLowerCase()) || doa.translation.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'Semua' || doa.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const handleShare = async (doa: Doa) => {
    const text = `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\n${doa.translation}`;
    try {
      await shareContent('IslamKu — Doa', text);
      setToast('✅ Berhasil disalin!');
      setTimeout(() => setToast(''), 2000);
    } catch { /* ignore */ }
  };

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>📿 Kumpulan Doa</h1><p>Doa sehari-hari lengkap dengan Arab, latin, dan terjemahan</p></div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Cari doa..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="filter-bar">
            {categories.map((cat) => (
              <button key={cat} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
          <div className="feature-grid">
            {filtered.map((doa) => (
              <div key={doa.id} className="doa-card">
                <div className="doa-card-header">
                  <div className="doa-card-title">{doa.title}</div>
                </div>
                <span className="doa-card-category">{doa.category}</span>
                <div className="doa-arabic">{doa.arabic}</div>
                <div className="doa-latin">{doa.latin}</div>
                <div className="doa-translation">{doa.translation}</div>
                <button className="doa-share-btn" onClick={() => handleShare(doa)}>📋 Salin Doa</button>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (<div className="empty-state"><div className="empty-state-icon">🔍</div><p>Doa tidak ditemukan</p></div>)}
        </div>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
