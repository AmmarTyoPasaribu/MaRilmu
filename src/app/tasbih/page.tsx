'use client';

import { useState, useCallback } from 'react';

interface DzikirPreset {
  id: string;
  arabic: string;
  latin: string;
  translation: string;
  target: number;
}

const presets: DzikirPreset[] = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ اللّٰهِ', latin: 'Subhanallah', translation: 'Maha Suci Allah', target: 33 },
  { id: 'alhamdulillah', arabic: 'اَلْحَمْدُ لِلّٰهِ', latin: 'Alhamdulillah', translation: 'Segala Puji Bagi Allah', target: 33 },
  { id: 'allahuakbar', arabic: 'اللّٰهُ أَكْبَرُ', latin: 'Allahu Akbar', translation: 'Allah Maha Besar', target: 33 },
  { id: 'lailahaillallah', arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', latin: 'La ilaha illallah', translation: 'Tiada Tuhan Selain Allah', target: 100 },
  { id: 'istighfar', arabic: 'أَسْتَغْفِرُ اللّٰهَ', latin: 'Astaghfirullah', translation: 'Aku Memohon Ampun Kepada Allah', target: 100 },
  { id: 'sholawat', arabic: 'اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ', latin: 'Allahumma Sholli ala Muhammad', translation: 'Ya Allah Limpahkanlah Sholawat Atas Nabi Muhammad', target: 100 },
];

export default function TasbihPage() {
  const [count, setCount] = useState(0);
  const [activePreset, setActivePreset] = useState<DzikirPreset>(presets[0]);
  const [completed, setCompleted] = useState(false);

  const handleTap = useCallback(() => {
    const newCount = count + 1;
    setCount(newCount);
    if (newCount >= activePreset.target && !completed) {
      setCompleted(true);
    }
    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(30);
    }
  }, [count, activePreset.target, completed]);

  const handleReset = () => {
    setCount(0);
    setCompleted(false);
  };

  const selectPreset = (preset: DzikirPreset) => {
    setActivePreset(preset);
    setCount(0);
    setCompleted(false);
  };

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>📿 Tasbih Digital</h1>
          <p>Dzikir dan tasbih dengan penghitung otomatis</p>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          <div className="tasbih-wrapper">
            {/* Dzikir Text */}
            <div className="tasbih-dzikir">{activePreset.arabic}</div>
            <div className="tasbih-dzikir-translation">
              {activePreset.latin} — &ldquo;{activePreset.translation}&rdquo;
            </div>

            {/* Counter Circle */}
            <div
              className="tasbih-counter"
              onClick={handleTap}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleTap(); }}
              style={completed ? { borderColor: 'var(--gold)', background: 'rgba(212, 160, 23, 0.08)' } : {}}
            >
              <div className="tasbih-count">{count}</div>
              <div className="tasbih-label">/ {activePreset.target}</div>
            </div>

            {completed && (
              <div style={{
                color: 'var(--text-green)',
                fontWeight: 600,
                fontSize: '1.1rem',
                textAlign: 'center',
                animation: 'fadeInUp 0.5s ease',
              }}>
                ✅ Alhamdulillah, target tercapai!
              </div>
            )}

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Tap lingkaran atau tekan spasi untuk menghitung
            </p>

            {/* Reset */}
            <button className="tasbih-reset-btn" onClick={handleReset}>🔄 Reset</button>

            {/* Presets */}
            <div style={{ marginTop: '1rem', width: '100%', maxWidth: '500px' }}>
              <h4 style={{ textAlign: 'center', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pilih Dzikir</h4>
              <div className="tasbih-presets">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    className={`tasbih-preset-btn ${activePreset.id === p.id ? 'active' : ''}`}
                    onClick={() => selectPreset(p)}
                  >
                    {p.latin}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
