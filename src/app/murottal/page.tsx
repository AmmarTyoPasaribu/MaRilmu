'use client';

import { useState, useRef, useEffect } from 'react';

const qariList = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', flag: '🇰🇼' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahman As-Sudais', flag: '🇸🇦' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify', flag: '🇸🇦' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', flag: '🇪🇬' },
];

const popularSurahs = [
  { number: 1, name: 'Al-Fatihah' }, { number: 2, name: 'Al-Baqarah' }, { number: 36, name: 'Yasin' },
  { number: 55, name: 'Ar-Rahman' }, { number: 56, name: 'Al-Waqiah' }, { number: 67, name: 'Al-Mulk' },
  { number: 18, name: 'Al-Kahfi' }, { number: 78, name: 'An-Naba' }, { number: 112, name: 'Al-Ikhlas' },
  { number: 113, name: 'Al-Falaq' }, { number: 114, name: 'An-Nas' },
];

export default function MurottalPage() {
  const [qari, setQari] = useState(qariList[0]);
  const [playing, setPlaying] = useState<number | null>(null);
  const [surahNum, setSurahNum] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = (num: number) => {
    if (audioRef.current) { audioRef.current.pause(); }
    const url = `https://cdn.islamic.network/quran/audio-surah/128/${qari.id}/${num}.mp3`;
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch(() => {});
    setPlaying(num);
    audio.onended = () => setPlaying(null);
  };

  const stop = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlaying(null);
  };

  useEffect(() => { return () => { if (audioRef.current) audioRef.current.pause(); }; }, []);

  const handleCustom = () => {
    const num = parseInt(surahNum);
    if (num >= 1 && num <= 114) play(num);
  };

  return (
    <>
      <div className="page-header"><div className="container"><h1>🎧 Audio Murottal</h1><p>Dengarkan Al-Quran dari Qari terkenal</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Qari selector */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Pilih Qari</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {qariList.map((q) => (
                <button key={q.id} onClick={() => { setQari(q); stop(); }} className="filter-btn" style={{ textAlign: 'left', padding: '0.75rem', borderColor: qari.id === q.id ? 'var(--green-500)' : undefined, background: qari.id === q.id ? 'rgba(5,150,105,0.1)' : undefined, color: qari.id === q.id ? 'var(--text-green)' : undefined }}>
                  {q.flag} {q.name}
                </button>
              ))}
            </div>
          </div>

          {/* Custom surah input */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem' }}>Putar Surah (1-114)</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="number" min="1" max="114" value={surahNum} onChange={(e) => setSurahNum(e.target.value)} placeholder="Nomor surah..." style={{ flex: 1, padding: '0.65rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
              <button onClick={handleCustom} className="filter-btn active">▶️ Putar</button>
            </div>
          </div>

          {/* Now playing */}
          {playing && (
            <div className="card" style={{ padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'center', border: '2px solid var(--green-500)', background: 'rgba(5,150,105,0.05)' }}>
              <p style={{ fontWeight: 700, color: 'var(--text-green)', marginBottom: '0.5rem' }}>🔊 Sedang memutar Surah #{playing}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Qari: {qari.name}</p>
              <button onClick={stop} className="filter-btn" style={{ borderColor: '#F43F5E', color: '#F43F5E' }}>⏹️ Stop</button>
            </div>
          )}

          {/* Popular surahs */}
          <h4 style={{ marginBottom: '1rem' }}>Surah Populer</h4>
          <div className="feature-grid">
            {popularSurahs.map((s) => (
              <div key={s.number} className="card" style={{ cursor: 'pointer', padding: '1.25rem', textAlign: 'center' }} onClick={() => playing === s.number ? stop() : play(s.number)}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{playing === s.number ? '⏸️' : '▶️'}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Surah {s.number}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
