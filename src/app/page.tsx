'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPrayerTimes, getUserLocation, getCityName } from '@/lib/api';
import type { PrayerTimings } from '@/types';

const quickLinks = [
  { href: '/quran', icon: '📖', title: 'Al-Quran', desc: 'Baca & dengarkan', color: '#059669' },
  { href: '/jadwal-sholat', icon: '🕐', title: 'Jadwal Sholat', desc: 'Waktu sholat', color: '#0EA5E9' },
  { href: '/doa', icon: '🤲', title: 'Doa', desc: 'Kumpulan doa', color: '#8B5CF6' },
  { href: '/dzikir', icon: '🌅', title: 'Dzikir', desc: 'Pagi & sore', color: '#F59E0B' },
  { href: '/tasbih', icon: '📿', title: 'Tasbih', desc: 'Penghitung dzikir', color: '#7C3AED' },
  { href: '/hadits', icon: '📜', title: 'Hadits', desc: 'Hadits harian', color: '#0D9488' },
  { href: '/bacaan', icon: '📗', title: 'Bacaan', desc: 'Yasin & Al-Waqiah', color: '#059669' },
  { href: '/zakat', icon: '🧮', title: 'Zakat', desc: 'Kalkulator zakat', color: '#D97706' },
  { href: '/panduan-sholat', icon: '🕌', title: 'Panduan Sholat', desc: 'Tata cara', color: '#2563EB' },
  { href: '/kisah-nabi', icon: '📚', title: 'Kisah Nabi', desc: '25 Nabi & Rasul', color: '#DC2626' },
  { href: '/asmaul-husna', icon: '✨', title: 'Asmaul Husna', desc: '99 nama Allah', color: '#F59E0B' },
  { href: '/kalender', icon: '📅', title: 'Kalender', desc: 'Kalender Hijriyah', color: '#F43F5E' },
  { href: '/kiblat', icon: '🧭', title: 'Kiblat', desc: 'Arah kiblat', color: '#0D9488' },
  { href: '/ramadhan', icon: '🌙', title: 'Ramadhan', desc: 'Imsak & buka', color: '#4338CA' },
  { href: '/jurnal', icon: '📋', title: 'Jurnal', desc: 'Tracking ibadah', color: '#059669' },
  { href: '/quiz', icon: '🎓', title: 'Quiz', desc: 'Trivia Islam', color: '#EC4899' },
];

const dailyQuotes = [
  { arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Sesungguhnya sesudah kesulitan itu ada kemudahan.', ref: 'QS. Al-Insyirah: 5' },
  { arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ', translation: 'Dan kelak Tuhanmu pasti memberikan karunia-Nya kepadamu.', ref: 'QS. Ad-Dhuha: 5' },
  { arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ', translation: 'Barangsiapa bertawakal kepada Allah, niscaya Allah mencukupkannya.', ref: 'QS. At-Talaq: 3' },
  { arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', translation: 'Dan katakanlah: Ya Tuhanku, tambahkanlah ilmu kepadaku.', ref: 'QS. Taha: 114' },
];

const prayerNameMap: Record<string, string> = {
  Fajr: 'Subuh', Sunrise: 'Syuruq', Dhuhr: 'Dzuhur', Asr: 'Ashar', Maghrib: 'Maghrib', Isha: 'Isya',
};

export default function HomePage() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
  const [city, setCity] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [quote] = useState(dailyQuotes[new Date().getDate() % dailyQuotes.length]);
  const [nextPrayer, setNextPrayer] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const loc = await getUserLocation();
        const cityName = await getCityName(loc.latitude, loc.longitude);
        setCity(loc.city || cityName);
        const data = await getPrayerTimes(loc.latitude, loc.longitude);
        setPrayerTimes(data.timings);
        if (data.date?.hijri) {
          const h = data.date.hijri;
          setHijriDate(`${h.day} ${h.month.en} ${h.year} H`);
        }
      } catch (err) { console.error(err); }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    const findNext = () => {
      const now = new Date();
      for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']) {
        const [h, m] = prayerTimes[name].split(':').map(Number);
        const d = new Date(now); d.setHours(h, m, 0, 0);
        if (d > now) return { name: prayerNameMap[name], time: d };
      }
      const [h, m] = prayerTimes['Fajr'].split(':').map(Number);
      const tom = new Date(now); tom.setDate(tom.getDate() + 1); tom.setHours(h, m, 0, 0);
      return { name: 'Subuh', time: tom };
    };
    const update = () => {
      const next = findNext();
      setNextPrayer(next.name);
      const diff = next.time.getTime() - Date.now();
      const hrs = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-bismillah">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
          <h1>Selamat Datang di <span className="green-accent">MaR</span><span className="gold-accent">Ilmu</span></h1>
          <p className="hero-subtitle">Portal Islami digital lengkap — 17 fitur untuk ibadah sehari-hari</p>
          {hijriDate && <div className="hero-badge">📅 {hijriDate}</div>}
          <p className="hero-ayat">{quote.arabic}</p>
          <p className="hero-ayat-ref">{quote.ref}</p>
        </div>
      </section>

      {prayerTimes && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">🕌 Jadwal Sholat</h2>
            <p className="section-subtitle">📍 {city}</p>
            {nextPrayer && (
              <div className="prayer-countdown">
                <div className="prayer-countdown-label">Menuju {nextPrayer}</div>
                <div className="prayer-countdown-time">{countdown}</div>
                <div className="prayer-countdown-name">{nextPrayer}</div>
              </div>
            )}
            <div className="prayer-grid">
              {Object.entries(prayerNameMap).map(([key, label]) => (
                <div key={key} className={`prayer-card ${nextPrayer === label ? 'active' : ''}`}>
                  <div className="prayer-name">{label}</div>
                  <div className="prayer-time-value">{prayerTimes[key]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-alt">
        <div className="container">
          <h2 className="section-title">🌟 Semua Fitur</h2>
          <p className="section-subtitle">Akses cepat ke semua 17 fitur MaRilmu</p>
          <div className="quick-grid">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} className="quick-card" style={{ borderBottom: `3px solid ${link.color}` }}>
                <div className="quick-card-icon" style={{ background: `${link.color}15`, padding: '0.75rem', borderRadius: '12px' }}>{link.icon}</div>
                <div className="quick-card-title" style={{ color: link.color }}>{link.title}</div>
                <div className="quick-card-desc">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
