'use client';

import { useState, useEffect } from 'react';

interface JurnalEntry { date: string; sholat: boolean[]; quran: boolean; dzikir: boolean; sedekah: boolean; puasaSunnah: boolean; }

const STORAGE_KEY = 'MaRilmu-jurnal';
const sholatNames = ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'];

function getTodayKey() { return new Date().toISOString().split('T')[0]; }

function getJurnal(): Record<string, JurnalEntry> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

function saveJurnal(jurnal: Record<string, JurnalEntry>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jurnal));
}

export default function JurnalPage() {
  const todayKey = getTodayKey();
  const [jurnal, setJurnal] = useState<Record<string, JurnalEntry>>({});
  const [today, setToday] = useState<JurnalEntry>({ date: todayKey, sholat: [false, false, false, false, false], quran: false, dzikir: false, sedekah: false, puasaSunnah: false });

  useEffect(() => {
    const data = getJurnal();
    setJurnal(data);
    if (data[todayKey]) setToday(data[todayKey]);
  }, [todayKey]);

  const update = (updated: JurnalEntry) => {
    setToday(updated);
    const newJurnal = { ...jurnal, [todayKey]: updated };
    setJurnal(newJurnal);
    saveJurnal(newJurnal);
  };

  const toggleSholat = (idx: number) => {
    const newSholat = [...today.sholat];
    newSholat[idx] = !newSholat[idx];
    update({ ...today, sholat: newSholat });
  };

  const toggleField = (field: 'quran' | 'dzikir' | 'sedekah' | 'puasaSunnah') => {
    update({ ...today, [field]: !today[field] });
  };

  const sholatDone = today.sholat.filter(Boolean).length;
  const totalItems = 5 + 4;
  const totalDone = sholatDone + (today.quran ? 1 : 0) + (today.dzikir ? 1 : 0) + (today.sedekah ? 1 : 0) + (today.puasaSunnah ? 1 : 0);
  const pct = Math.round((totalDone / totalItems) * 100);

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    const entry = jurnal[key];
    const done = entry ? entry.sholat.filter(Boolean).length + (entry.quran ? 1 : 0) + (entry.dzikir ? 1 : 0) + (entry.sedekah ? 1 : 0) + (entry.puasaSunnah ? 1 : 0) : 0;
    return { label: d.toLocaleDateString('id-ID', { weekday: 'short' }), pct: Math.round((done / totalItems) * 100), isToday: key === todayKey };
  });

  return (
    <>
      <div className="page-header"><div className="container"><h1>📋 Jurnal Ibadah</h1><p>Tracking ibadah harian kamu</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '600px' }}>
          {/* Progress ring */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1rem' }}>
              <svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" strokeWidth="8" /><circle cx="60" cy="60" r="50" fill="none" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${pct * 3.14} ${314 - pct * 3.14}`} transform="rotate(-90 60 60)" style={{ transition: 'stroke-dasharray 0.5s' }} /><defs><linearGradient id="grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#059669" /><stop offset="100%" stopColor="#10B981" /></linearGradient></defs></svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-green)' }}>{pct}%</div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{totalDone}/{totalItems} ibadah hari ini</p>
          </div>

          {/* Sholat */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>🕌 Sholat 5 Waktu</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {sholatNames.map((name, i) => (
                <button key={name} onClick={() => toggleSholat(i)} style={{ flex: '1 1 80px', padding: '0.75rem 0.5rem', borderRadius: 'var(--radius-sm)', border: `2px solid ${today.sholat[i] ? 'var(--green-500)' : 'var(--border-light)'}`, background: today.sholat[i] ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-card)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.8rem', fontWeight: 600, color: today.sholat[i] ? 'var(--text-green)' : 'var(--text-secondary)', transition: 'all 0.2s', textAlign: 'center' }}>
                  {today.sholat[i] ? '✅' : '⬜'} {name}
                </button>
              ))}
            </div>
          </div>

          {/* Other items */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>✨ Ibadah Lainnya</h4>
            {([['quran', '📖 Baca Al-Quran'], ['dzikir', '📿 Dzikir'], ['sedekah', '💰 Sedekah'], ['puasaSunnah', '🌙 Puasa Sunnah']] as const).map(([field, label]) => (
              <button key={field} onClick={() => toggleField(field)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: `2px solid ${today[field] ? 'var(--green-500)' : 'var(--border-light)'}`, background: today[field] ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-card)', cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.9rem', fontWeight: 500, color: today[field] ? 'var(--text-green)' : 'var(--text-primary)', transition: 'all 0.2s', marginBottom: '0.5rem', textAlign: 'left' }}>
                <span style={{ fontSize: '1.1rem' }}>{today[field] ? '✅' : '⬜'}</span> {label}
              </button>
            ))}
          </div>

          {/* 7-day streak */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>📊 Aktivitas 7 Hari Terakhir</h4>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '100px' }}>
              {last7.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                  <div style={{ width: '100%', background: d.isToday ? 'var(--bg-accent)' : 'var(--green-200)', borderRadius: '4px', height: `${Math.max(d.pct, 5)}%`, transition: 'height 0.3s' }} />
                  <span style={{ fontSize: '0.65rem', color: d.isToday ? 'var(--text-green)' : 'var(--text-muted)', fontWeight: d.isToday ? 700 : 400 }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
