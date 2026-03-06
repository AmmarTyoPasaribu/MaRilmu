'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'MaRilmu-hafalan';

const surahList = [
  { number: 1, name: 'Al-Fatihah', ayahs: 7 }, { number: 2, name: 'Al-Baqarah', ayahs: 286 }, { number: 3, name: 'Ali Imran', ayahs: 200 },
  { number: 36, name: 'Yasin', ayahs: 83 }, { number: 55, name: 'Ar-Rahman', ayahs: 78 }, { number: 56, name: 'Al-Waqiah', ayahs: 96 },
  { number: 67, name: 'Al-Mulk', ayahs: 30 }, { number: 78, name: 'An-Naba', ayahs: 40 }, { number: 87, name: 'Al-A\'la', ayahs: 19 },
  { number: 93, name: 'Adh-Dhuha', ayahs: 11 }, { number: 94, name: 'Al-Insyirah', ayahs: 8 }, { number: 95, name: 'At-Tin', ayahs: 8 },
  { number: 96, name: 'Al-Alaq', ayahs: 19 }, { number: 97, name: 'Al-Qadr', ayahs: 5 }, { number: 98, name: 'Al-Bayyinah', ayahs: 8 },
  { number: 99, name: 'Az-Zalzalah', ayahs: 8 }, { number: 100, name: 'Al-Adiyat', ayahs: 11 }, { number: 101, name: 'Al-Qariah', ayahs: 11 },
  { number: 102, name: 'At-Takatsur', ayahs: 8 }, { number: 103, name: 'Al-Asr', ayahs: 3 }, { number: 104, name: 'Al-Humazah', ayahs: 9 },
  { number: 105, name: 'Al-Fil', ayahs: 5 }, { number: 106, name: 'Quraisy', ayahs: 4 }, { number: 107, name: 'Al-Maun', ayahs: 7 },
  { number: 108, name: 'Al-Kautsar', ayahs: 3 }, { number: 109, name: 'Al-Kafirun', ayahs: 6 }, { number: 110, name: 'An-Nasr', ayahs: 3 },
  { number: 111, name: 'Al-Lahab', ayahs: 5 }, { number: 112, name: 'Al-Ikhlas', ayahs: 4 }, { number: 113, name: 'Al-Falaq', ayahs: 5 },
  { number: 114, name: 'An-Nas', ayahs: 6 },
];

type HafalanStatus = 'belum' | 'proses' | 'hafal';
type HafalanData = Record<number, HafalanStatus>;

export default function HafalanPage() {
  const [data, setData] = useState<HafalanData>({});

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setData(JSON.parse(saved));
  }, []);

  const toggle = (num: number) => {
    const current = data[num] || 'belum';
    const next: HafalanStatus = current === 'belum' ? 'proses' : current === 'proses' ? 'hafal' : 'belum';
    const updated = { ...data, [num]: next };
    setData(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const hafal = Object.values(data).filter(s => s === 'hafal').length;
  const proses = Object.values(data).filter(s => s === 'proses').length;
  const pct = Math.round((hafal / surahList.length) * 100);

  const statusColors: Record<HafalanStatus, { bg: string; border: string; color: string; label: string }> = {
    belum: { bg: 'var(--bg-card)', border: 'var(--border-light)', color: 'var(--text-muted)', label: 'Belum' },
    proses: { bg: 'rgba(245, 158, 11, 0.08)', border: '#F59E0B', color: '#D97706', label: 'Proses' },
    hafal: { bg: 'rgba(5, 150, 105, 0.08)', border: 'var(--green-500)', color: 'var(--text-green)', label: 'Hafal ✅' },
  };

  return (
    <>
      <div className="page-header"><div className="container"><h1>📝 Hafalan Tracker</h1><p>Tracking progress hafalan Al-Quran</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', borderTop: '3px solid var(--green-500)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-green)' }}>{hafal}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sudah Hafal</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', borderTop: '3px solid #F59E0B' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#D97706' }}>{proses}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sedang Proses</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', borderTop: '3px solid var(--sky)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--sky)' }}>{pct}%</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress</div>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center' }}>Klik surah untuk mengubah status: Belum → Proses → Hafal</p>
          <div className="feature-grid">
            {surahList.map((s) => {
              const status = data[s.number] || 'belum';
              const st = statusColors[status];
              return (
                <div key={s.number} onClick={() => toggle(s.number)} className="card" style={{ cursor: 'pointer', padding: '1rem', border: `2px solid ${st.border}`, background: st.bg, transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{s.ayahs} ayat</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: st.color, padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-full)', background: st.bg }}>{st.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
