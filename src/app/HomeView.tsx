'use client';

import Link from 'next/link';
import Icon, { type IconName } from '@/components/Icon';
import LocationBar from '@/components/LocationBar';
import { SectionTitle } from '@/components/ui';
import { useNow, useLastRead, useSettings } from '@/lib/store';
import { usePrayerTimes, useHijriToday } from '@/lib/hooks';
import { PRAYER_LABELS, formatCountdown, formatTime, getNextPrayer, getCurrentPrayer, type PrayerKey } from '@/lib/prayer';
import { HIJRI_MONTHS_AR, dateKey, startOfDay, formatGregorian, formatHijri, getUpcomingEvents, getSunnahFasts, toHijri } from '@/lib/hijri';
import { useJurnal, SHOLAT_NAMES, emptyEntry, sholatDone } from '@/lib/jurnal';
import { NAV } from '@/lib/site';
import ayatPilihan from '@/data/ayat-pilihan.json';
import haditsData from '@/data/hadits.json';
import doaData from '@/data/doa-fallback.json';
import { useMemo } from 'react';

const QUICK: { href: string; label: string; icon: IconName }[] = [
  { href: '/quran', label: 'Al-Quran', icon: 'quran' },
  { href: '/jadwal-sholat', label: 'Jadwal Sholat', icon: 'clock' },
  { href: '/kiblat', label: 'Kiblat', icon: 'kaaba' },
  { href: '/doa', label: 'Doa', icon: 'hands' },
  { href: '/dzikir', label: 'Dzikir', icon: 'sunrise' },
  { href: '/tasbih', label: 'Tasbih', icon: 'beads' },
  { href: '/kalender', label: 'Kalender', icon: 'calendar' },
  { href: '/murottal', label: 'Murottal', icon: 'headphones' },
];

const STRIP: PrayerKey[] = ['subuh', 'terbit', 'dzuhur', 'ashar', 'maghrib', 'isya'];

function greeting(h: number) {
  if (h < 4) return 'Selamat malam';
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 18) return 'Selamat sore';
  return 'Selamat malam';
}

export default function HomeView() {
  const now = useNow();
  const ready = now > 0;
  const [settings] = useSettings();
  const { yesterday, today, tomorrow } = usePrayerTimes(now);
  const hijri = useHijriToday(now);
  const [lastRead] = useLastRead();
  const [jurnal, setJurnal] = useJurnal();

  const nowDate = new Date(now || 0);
  const next = ready ? getNextPrayer(nowDate, today, tomorrow, yesterday) : null;
  const current = ready ? getCurrentPrayer(nowDate, today) : null;
  const progress = next ? Math.min(100, Math.max(0, ((now - next.prev.getTime()) / (next.time.getTime() - next.prev.getTime())) * 100)) : 0;
  const dayIndex = ready ? Math.floor(new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()).getTime() / 864e5) : 0;

  const ayat = ayatPilihan[dayIndex % ayatPilihan.length];
  const hadits = haditsData[dayIndex % haditsData.length];
  const doa = doaData[dayIndex % doaData.length];

  const dayStart = ready ? startOfDay(now) : 0;
  const upcoming = useMemo(
    () => (dayStart ? getUpcomingEvents(new Date(dayStart), settings.hijriOffset, 400, 3) : []),
    [dayStart, settings.hijriOffset],
  );
  const tomorrowFasts = useMemo(() => {
    if (!dayStart) return [];
    const d = new Date(startOfDay(dayStart, 1));
    return getSunnahFasts(d, toHijri(d, settings.hijriOffset));
  }, [dayStart, settings.hijriOffset]);

  const todayKey = ready ? dateKey(nowDate) : '';
  const entry = jurnal[todayKey] ?? emptyEntry();
  const toggleSholat = (i: number) => {
    if (!todayKey) return;
    setJurnal((prev) => {
      const e = prev[todayKey] ?? emptyEntry();
      const sholat = [...e.sholat];
      sholat[i] = !sholat[i];
      return { ...prev, [todayKey]: { ...e, sholat } };
    });
  };

  return (
    <div className="page page-default home">
      {/* ================= HERO ================= */}
      <section className="home-hero">
        <div className="page-header-pattern" aria-hidden />
        <div className="home-hero-left">
          <p className="home-salam arabic">السَّلَامُ عَلَيْكُمْ</p>
          <h1>{ready ? greeting(nowDate.getHours()) : 'Assalamu’alaikum'}</h1>
          <div className="home-date">
            {ready ? (
              <>
                <span className="home-hijri">
                  {formatHijri(hijri)} <span className="arabic">{HIJRI_MONTHS_AR[hijri.month - 1]}</span>
                </span>
                <span className="home-greg">{formatGregorian(nowDate, true)}</span>
              </>
            ) : (
              <span className="skeleton-text" />
            )}
          </div>
          <LocationBar />
        </div>

        <div className="home-next">
          <span className="home-next-label">{next ? `Menuju ${PRAYER_LABELS[next.key]}` : 'Waktu sholat berikutnya'}</span>
          <span className="home-next-countdown tabular">{next ? formatCountdown(next.time.getTime() - now) : '--:--:--'}</span>
          <span className="home-next-time">
            {next ? (
              <>
                {PRAYER_LABELS[next.key]} pukul <b>{formatTime(next.time)}</b>
              </>
            ) : (
              'Menghitung…'
            )}
          </span>
          <div className="home-next-progress" aria-hidden>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <ol className="home-strip" aria-label="Jadwal sholat hari ini">
          {STRIP.map((k) => (
            <li key={k} className={`${next?.key === k ? 'next' : ''} ${current === k ? 'current' : ''}`}>
              <span>{PRAYER_LABELS[k]}</span>
              <b className="tabular">{ready ? formatTime(today[k]) : '--:--'}</b>
            </li>
          ))}
        </ol>
      </section>

      {/* ================= AKSES CEPAT ================= */}
      <nav className="quick-grid" aria-label="Akses cepat">
        {QUICK.map((q, i) => (
          <Link key={q.href} href={q.href} className="quick-tile" style={{ animationDelay: `${i * 35}ms` }}>
            <span className="quick-tile-icon">
              <Icon name={q.icon} size={24} strokeWidth={1.6} />
            </span>
            <span>{q.label}</span>
          </Link>
        ))}
      </nav>

      <div className="home-grid">
        {/* ---- Lanjutkan membaca ---- */}
        <Link href={lastRead ? `/quran/${lastRead.surah}#ayat-${lastRead.ayah}` : '/quran/1'} className="card card-link continue-card">
          <span className="continue-icon">
            <Icon name="rehal" size={28} strokeWidth={1.5} />
          </span>
          <span className="continue-text">
            <small>{lastRead ? 'Lanjutkan membaca' : 'Mulai membaca'}</small>
            <strong>{lastRead ? `${lastRead.name} · Ayat ${lastRead.ayah}` : 'Al-Fatihah'}</strong>
          </span>
          <Icon name="arrowRight" size={20} />
        </Link>

        {/* ---- Checklist sholat hari ini ---- */}
        <div className="card sholat-check">
          <div className="sholat-check-head">
            <strong>Sholat hari ini</strong>
            <span className="badge gold">{ready ? sholatDone(entry) : 0}/5</span>
          </div>
          <div className="sholat-check-row">
            {SHOLAT_NAMES.map((n, i) => (
              <button
                key={n}
                className={`sholat-pill${entry.sholat[i] ? ' done' : ''}`}
                onClick={() => toggleSholat(i)}
                aria-pressed={!!entry.sholat[i]}
                disabled={!ready}
              >
                <Icon name={entry.sholat[i] ? 'check' : 'mosque'} size={16} />
                {n}
              </button>
            ))}
          </div>
          <Link href="/jurnal" className="section-link">
            Jurnal ibadah lengkap <Icon name="chevronRight" size={14} />
          </Link>
        </div>
      </div>

      {/* ================= HARI INI ================= */}
      <SectionTitle>Renungan hari ini</SectionTitle>
      <div className="daily-grid">
        <article className="daily-card daily-ayat">
          <header>
            <span className="badge">
              <Icon name="quran" size={13} /> Ayat
            </span>
            <Link href={`/quran/${ayat.surah}#ayat-${ayat.ayah}`} className="section-link">
              QS. {ayat.name}: {ayat.ayah}
            </Link>
          </header>
          <p className="arabic quran-text daily-ar" dir="rtl" lang="ar">
            {ayat.ar}
          </p>
          <p className="translation">{ayat.id}</p>
        </article>

        <article className="daily-card">
          <header>
            <span className="badge gold">
              <Icon name="hands" size={13} /> Doa
            </span>
            <Link href="/doa" className="section-link">
              Semua doa
            </Link>
          </header>
          <h3>{doa.nama}</h3>
          <p className="arabic daily-ar" dir="rtl" lang="ar">
            {doa.ar}
          </p>
          <p className="translation">{doa.idn}</p>
        </article>

        <article className="daily-card">
          <header>
            <span className="badge sky">
              <Icon name="scroll" size={13} /> Hadits
            </span>
            <span className="source">{hadits.source}</span>
          </header>
          <p className="arabic daily-ar" dir="rtl" lang="ar">
            {hadits.arabic}
          </p>
          <p className="translation">“{hadits.translation}”</p>
          <Link href="/hadits" className="section-link">
            Hadits lainnya <Icon name="chevronRight" size={14} />
          </Link>
        </article>
      </div>

      {/* ================= AGENDA ================= */}
      <SectionTitle
        action={
          <Link href="/kalender" className="section-link">
            Kalender <Icon name="chevronRight" size={14} />
          </Link>
        }
      >
        Agenda Islami
      </SectionTitle>
      <div className="agenda-grid">
        {tomorrowFasts.length > 0 && (
          <div className="agenda-card agenda-fast">
            <Icon name="crescent" size={22} />
            <div>
              <strong>Besok disunnahkan puasa</strong>
              <span>{tomorrowFasts.map((f) => (f === 'senin-kamis' ? 'Senin–Kamis' : 'Ayyamul Bidh')).join(' & ')}</span>
            </div>
          </div>
        )}
        {upcoming.map((e) => (
          <div key={e.name + e.hijri.year} className="agenda-card">
            <span className="agenda-days">
              <b>{e.daysLeft === 0 ? 'Hari' : e.daysLeft}</b>
              <small>{e.daysLeft === 0 ? 'ini' : 'hari lagi'}</small>
            </span>
            <div>
              <strong>{e.name}</strong>
              <span>
                {formatHijri(e.hijri)} · {formatGregorian(e.date)}
              </span>
            </div>
          </div>
        ))}
        {!ready && <div className="agenda-card skeleton" style={{ height: 76 }} />}
      </div>

      {/* ================= SEMUA FITUR ================= */}
      <SectionTitle>Jelajahi semua fitur</SectionTitle>
      <div className="feature-groups">
        {NAV.slice(1).map((g) => (
          <section key={g.title} className="feature-group">
            <h3>{g.title}</h3>
            <ul>
              {g.items.map((i) => (
                <li key={i.href}>
                  <Link href={i.href}>
                    <span className="feature-group-icon">
                      <Icon name={i.icon} size={18} />
                    </span>
                    <span>
                      <strong>{i.label}</strong>
                      <small>{i.desc}</small>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {ready && (
        <p className="muted center mt-3" style={{ fontSize: '0.78rem' }}>
          Jadwal dihitung lokal dengan kriteria {settings.method === 'kemenag' ? 'Kemenag RI' : settings.method.toUpperCase()} ·{' '}
          <Link href="/pengaturan" className="section-link">
            ubah
          </Link>
        </p>
      )}
    </div>
  );
}
