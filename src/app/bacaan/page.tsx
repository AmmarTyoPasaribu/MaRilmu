'use client';

import { useState, useEffect } from 'react';
import { getSurahDetail } from '@/lib/api';
import type { SurahDetailData } from '@/types';

const popularSurahs = [
  { number: 36, name: 'Yasin', icon: '📖', desc: 'Jantungnya Al-Quran' },
  { number: 56, name: 'Al-Waqiah', icon: '💎', desc: 'Surah pembuka rezeki' },
  { number: 67, name: 'Al-Mulk', icon: '🏰', desc: 'Pelindung dari siksa kubur' },
  { number: 18, name: 'Al-Kahfi', icon: '🕌', desc: 'Dibaca setiap Jumat' },
  { number: 55, name: 'Ar-Rahman', icon: '🌸', desc: 'Pengantin Al-Quran' },
];

export default function BacaanPage() {
  const [selected, setSelected] = useState(popularSurahs[0]);
  const [data, setData] = useState<SurahDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const result = await getSurahDetail(selected.number);
        setData(result);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [selected]);

  return (
    <>
      <div className="page-header"><div className="container"><h1>📖 Bacaan Populer</h1><p>Surah-surah yang sering dibaca</p></div></div>
      <div className="page-content">
        <div className="container">
          <div className="filter-bar">
            {popularSurahs.map((s) => (
              <button key={s.number} className={`filter-btn ${selected.number === s.number ? 'active' : ''}`} onClick={() => setSelected(s)}>
                {s.icon} {s.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p>Memuat {selected.name}...</p></div>
          ) : data ? (
            <div className="ayat-container">
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--text-green)' }}>{data.arabic.englishName}</h2>
                <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.75rem', color: 'var(--gold)' }}>{data.arabic.name}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{data.arabic.numberOfAyahs} Ayat • {data.arabic.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}</p>
              </div>
              {data.arabic.ayahs.map((ayah, i) => (
                <div key={ayah.number} className="ayat-item">
                  <div className="ayat-arabic">{ayah.text} <span className="ayat-number">{ayah.numberInSurah}</span></div>
                  {data.latin?.ayahs?.[i] && <div className="ayat-latin">{data.latin.ayahs[i].text}</div>}
                  <div className="ayat-translation">{data.translation.ayahs[i]?.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><div className="empty-state-icon">❌</div><p>Gagal memuat surah</p></div>
          )}
        </div>
      </div>
    </>
  );
}
