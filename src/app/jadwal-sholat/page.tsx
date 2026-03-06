'use client';

import { useState, useEffect } from 'react';
import { getPrayerTimes, getUserLocation, getCityName } from '@/lib/api';
import type { PrayerTimings } from '@/types';

const prayerNames: Record<string, string> = {
  Fajr: 'Subuh', Sunrise: 'Syuruq', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya',
};

export default function JadwalSholatPage() {
  const [times, setTimes] = useState<PrayerTimings | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const loc = await getUserLocation();
        const cityName = await getCityName(loc.latitude, loc.longitude);
        setCity(loc.city || cityName);
        const data = await getPrayerTimes(loc.latitude, loc.longitude);
        setTimes(data.timings);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => {
    if (!times) return;
    const findNext = () => {
      const now = new Date();
      for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
        const [h, m] = times[name].split(':').map(Number);
        const d = new Date(now); d.setHours(h, m, 0, 0);
        if (d > now) return { name: prayerNames[name], time: d };
      }
      const [h, m] = times['Fajr'].split(':').map(Number);
      const tom = new Date(now); tom.setDate(tom.getDate() + 1); tom.setHours(h, m, 0, 0);
      return { name: 'Subuh', time: tom };
    };
    const update = () => {
      const next = findNext();
      setNextPrayer(next.name);
      const diff = next.time.getTime() - Date.now();
      const h = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(h).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [times]);

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>🕐 Jadwal Sholat</h1><p>Waktu sholat berdasarkan lokasi Anda</p></div>
      </div>
      <div className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p>Mendeteksi lokasi & memuat jadwal...</p></div>
          ) : times ? (
            <>
              <div className="location-info">📍 {city}</div>
              {nextPrayer && (
                <div className="prayer-countdown">
                  <div className="prayer-countdown-label">Menuju waktu sholat berikutnya</div>
                  <div className="prayer-countdown-time">{countdown}</div>
                  <div className="prayer-countdown-name">{nextPrayer}</div>
                </div>
              )}
              <div className="prayer-grid">
                {Object.entries(prayerNames).map(([key, label]) => (
                  <div key={key} className={`prayer-card ${nextPrayer === label ? 'active' : ''}`}>
                    <div className="prayer-name">{label}</div>
                    <div className="prayer-time-value">{times[key]}</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state"><div className="empty-state-icon">⚠️</div><p>Gagal memuat jadwal sholat.</p></div>
          )}
        </div>
      </div>
    </>
  );
}
