'use client';

import { useState, useEffect } from 'react';
import { getPrayerTimes, getUserLocation, getCityName } from '@/lib/api';
import type { PrayerTimings } from '@/types';

const niatPuasa = { arabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى', latin: 'Nawaitu shauma ghadin \'an adaa-i fardhi syahri ramadhaana haadzihis sanati lillaahi ta\'aalaa', translation: 'Aku berniat puasa esok hari untuk menunaikan fardhu Ramadhan tahun ini karena Allah Ta\'ala.' };
const doaBuka = { arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ', latin: 'Allahumma laka shumtu wa bika aamantu wa \'ala rizqika afthartu', translation: 'Ya Allah, karena-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.' };

export default function RamadhanPage() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
  const [city, setCity] = useState('');
  const [countdown, setCountdown] = useState('');
  const [countdownLabel, setCountdownLabel] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const loc = await getUserLocation();
        const cityName = await getCityName(loc.latitude, loc.longitude);
        setCity(loc.city || cityName);
        const data = await getPrayerTimes(loc.latitude, loc.longitude);
        setPrayerTimes(data.timings);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    const update = () => {
      const now = new Date();
      const [fH, fM] = prayerTimes.Fajr.split(':').map(Number);
      const [mH, mM] = prayerTimes.Maghrib.split(':').map(Number);
      const fajr = new Date(now); fajr.setHours(fH, fM, 0, 0);
      const maghrib = new Date(now); maghrib.setHours(mH, mM, 0, 0);

      let target: Date; let label: string;
      if (now < fajr) { target = fajr; label = 'Menuju Imsak / Sahur berakhir'; }
      else if (now < maghrib) { target = maghrib; label = 'Menuju waktu Berbuka'; }
      else { target = new Date(fajr); target.setDate(target.getDate() + 1); label = 'Menuju Imsak besok'; }

      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
      setCountdownLabel(label);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <>
      <div className="page-header" style={{ background: 'linear-gradient(135deg, #1E1B4B, #312E81, #4338CA)' }}>
        <div className="container" style={{ color: 'white' }}>
          <h1 style={{ color: 'white' }}>🌙 Ramadhan Mode</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Imsak, buka puasa & doa Ramadhan</p>
        </div>
      </div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '700px' }}>
          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p>Memuat jadwal...</p></div>
          ) : prayerTimes ? (
            <>
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '1rem' }}>📍 {city}</p>
              <div className="prayer-countdown" style={{ background: 'linear-gradient(135deg, rgba(67, 56, 202, 0.08), rgba(79, 70, 229, 0.04))' }}>
                <div className="prayer-countdown-label">{countdownLabel}</div>
                <div className="prayer-countdown-time" style={{ background: 'linear-gradient(135deg, #4338CA, #6366F1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{countdown}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', borderTop: '3px solid #4338CA' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Imsak</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4338CA' }}>{prayerTimes.Fajr}</div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem', borderTop: '3px solid var(--amber)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Buka Puasa</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--amber)' }}>{prayerTimes.Maghrib}</div>
                </div>
              </div>
              <div className="doa-card" style={{ marginBottom: '1rem' }}>
                <div className="doa-card-title">Niat Puasa</div>
                <div className="doa-arabic">{niatPuasa.arabic}</div>
                <div className="doa-latin">{niatPuasa.latin}</div>
                <div className="doa-translation">{niatPuasa.translation}</div>
              </div>
              <div className="doa-card">
                <div className="doa-card-title">Doa Buka Puasa</div>
                <div className="doa-arabic">{doaBuka.arabic}</div>
                <div className="doa-latin">{doaBuka.latin}</div>
                <div className="doa-translation">{doaBuka.translation}</div>
              </div>
            </>
          ) : (
            <div className="empty-state"><div className="empty-state-icon">⚠️</div><p>Gagal memuat jadwal</p></div>
          )}
        </div>
      </div>
    </>
  );
}
