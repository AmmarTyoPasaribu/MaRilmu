'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon, { type IconName } from '@/components/Icon';
import LocationBar from '@/components/LocationBar';
import { PageHeader, Page, SectionTitle } from '@/components/ui';
import { useToast } from '@/components/providers/Toast';
import { useLocation, useNow, useSettings } from '@/lib/store';
import { usePrayerTimes, deviceTimeZoneLabel } from '@/lib/hooks';
import {
  ALL_TIMES,
  FARDHU,
  METHODS,
  PRAYER_LABELS,
  calculatePrayerTimes,
  formatCountdown,
  formatTime,
  getCurrentPrayer,
  getNextPrayer,
  type PrayerKey,
} from '@/lib/prayer';
import { GREGORIAN_MONTHS, WEEKDAYS, formatGregorian, formatHijri, startOfDay, startOfMonth, toHijri } from '@/lib/hijri';

const ICONS: Record<PrayerKey, IconName> = {
  imsak: 'moon',
  subuh: 'sunrise',
  terbit: 'sun',
  dhuha: 'sun',
  dzuhur: 'sun',
  ashar: 'sun',
  maghrib: 'sunset',
  isya: 'moon',
};

export default function JadwalView() {
  const now = useNow();
  const ready = now > 0;
  const [settings, update] = useSettings();
  const [loc] = useLocation();
  const toast = useToast();
  const { yesterday, today, tomorrow } = usePrayerTimes(now);
  const [dayOffset, setDayOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const nowDate = new Date(now || 0);
  const next = ready ? getNextPrayer(nowDate, today, tomorrow, yesterday) : null;
  const current = ready ? getCurrentPrayer(nowDate, today) : null;
  const { method, madhab, hijriOffset } = settings;
  const { latitude, longitude } = loc;

  const viewStamp = ready ? startOfDay(now, dayOffset) : 0;
  const viewDate = viewStamp ? new Date(viewStamp) : null;
  const viewTimes = viewStamp ? calculatePrayerTimes(new Date(viewStamp), latitude, longitude, { method, madhab }) : null;

  const monthStamp = ready ? startOfMonth(now, monthOffset) : 0;
  const monthBase = monthStamp ? new Date(monthStamp) : null;
  // ringan (±31 hari × beberapa operasi trigonometri), tidak perlu memo
  const monthRows = monthBase
    ? Array.from({ length: new Date(monthBase.getFullYear(), monthBase.getMonth() + 1, 0).getDate() }, (_, i) => {
        const d = new Date(monthBase.getFullYear(), monthBase.getMonth(), i + 1);
        return { date: d, times: calculatePrayerTimes(d, latitude, longitude, { method, madhab }), hijri: toHijri(d, hijriOffset) };
      })
    : [];

  const toggleNotify = async () => {
    if (settings.notify) {
      update({ notify: false });
      toast('Pengingat adzan dimatikan', 'bellOff');
      return;
    }
    if (typeof Notification === 'undefined') {
      toast('Browser ini tidak mendukung notifikasi', 'alert');
      return;
    }
    const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (perm === 'granted') {
      update({ notify: true });
      toast('Pengingat adzan aktif', 'bell');
    } else toast('Izin notifikasi ditolak', 'alert');
  };

  const tz = ready ? deviceTimeZoneLabel() : '';
  const isToday = dayOffset === 0;
  const todayStamp = ready ? startOfDay(now) : 0;

  return (
    <Page>
      <PageHeader icon="clock" title="Jadwal Sholat" subtitle="Dihitung otomatis sesuai lokasi Anda">
        <LocationBar />
      </PageHeader>

      {/* ---------- Hitung mundur ---------- */}
      <section className="prayer-hero">
        <div>
          <span className="prayer-hero-label">{next ? `Menuju waktu ${PRAYER_LABELS[next.key]}` : 'Menghitung…'}</span>
          <span className="prayer-hero-count tabular">{next ? formatCountdown(next.time.getTime() - now) : '--:--:--'}</span>
          <span className="prayer-hero-sub">
            {current ? `Sekarang waktu ${PRAYER_LABELS[current]}` : next ? `${PRAYER_LABELS[next.key]} pukul ${formatTime(next.time)}` : ''}
          </span>
        </div>
        <div className="prayer-hero-actions">
          <button className={`btn ${settings.notify ? 'btn-gold' : 'btn-outline'}`} onClick={toggleNotify} disabled={!ready}>
            <Icon name={settings.notify ? 'bell' : 'bellOff'} size={18} />
            {settings.notify ? 'Pengingat aktif' : 'Aktifkan pengingat'}
          </button>
          <a
            className="btn btn-outline"
            href={`https://www.google.com/maps/search/masjid/@${loc.latitude},${loc.longitude},15z`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="map" size={18} /> Masjid terdekat
          </a>
        </div>
      </section>

      {/* ---------- Harian ---------- */}
      <div className="day-nav">
        <button className="icon-btn" onClick={() => setDayOffset((d) => d - 1)} aria-label="Hari sebelumnya">
          <Icon name="chevronLeft" size={20} />
        </button>
        <div className="day-nav-label">
          {viewDate ? (
            <>
              <strong>{formatGregorian(viewDate, true)}</strong>
              <small>{formatHijri(toHijri(viewDate, settings.hijriOffset))}</small>
            </>
          ) : (
            <span className="skeleton-text" />
          )}
        </div>
        <button className="icon-btn" onClick={() => setDayOffset((d) => d + 1)} aria-label="Hari berikutnya">
          <Icon name="chevronRight" size={20} />
        </button>
      </div>
      {!isToday && (
        <div className="center" style={{ marginTop: -8, marginBottom: 12 }}>
          <button className="chip-btn" onClick={() => setDayOffset(0)}>
            <Icon name="refresh" size={14} /> Kembali ke hari ini
          </button>
        </div>
      )}

      <ul className="times-list">
        {ALL_TIMES.map((k) => {
          const t = viewTimes?.[k];
          const fardhu = FARDHU.includes(k);
          const isNext = isToday && next?.key === k;
          const isCurrent = isToday && current === k;
          const passed = isToday && t && t.getTime() < now && !isCurrent;
          return (
            <li key={k} className={`times-row${fardhu ? ' fardhu' : ''}${isNext ? ' next' : ''}${isCurrent ? ' current' : ''}${passed ? ' passed' : ''}`}>
              <span className="times-icon">
                <Icon name={ICONS[k]} size={20} />
              </span>
              <span className="times-name">
                {PRAYER_LABELS[k]}
                {isNext && <span className="badge gold">Berikutnya</span>}
                {isCurrent && <span className="badge">Sekarang</span>}
              </span>
              <span className="times-value tabular">{t ? formatTime(t) : '--:--'}</span>
            </li>
          );
        })}
      </ul>

      <p className="times-note">
        <Icon name="info" size={14} /> Metode {METHODS[settings.method].name} · Ashar {settings.madhab === 'hanafi' ? 'Hanafi' : "Syafi'i"}
        {tz && ` · waktu ${tz}`} ·{' '}
        <Link href="/pengaturan" className="section-link">
          Ubah
        </Link>
      </p>

      {/* ---------- Bulanan ---------- */}
      <SectionTitle
        action={
          <div className="row" style={{ gap: 4 }}>
            <button className="icon-btn sm" onClick={() => setMonthOffset((m) => m - 1)} aria-label="Bulan sebelumnya">
              <Icon name="chevronLeft" size={18} />
            </button>
            <button className="icon-btn sm" onClick={() => setMonthOffset((m) => m + 1)} aria-label="Bulan berikutnya">
              <Icon name="chevronRight" size={18} />
            </button>
          </div>
        }
      >
        Jadwal {monthBase ? `${GREGORIAN_MONTHS[monthBase.getMonth()]} ${monthBase.getFullYear()}` : 'bulanan'}
      </SectionTitle>
      <div className="table-wrap month-table">
        <table className="table">
          <thead>
            <tr>
              <th>Tanggal</th>
              {ALL_TIMES.map((k) => (
                <th key={k}>{PRAYER_LABELS[k]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthRows.map((r) => (
              <tr key={r.date.getTime()} className={`${r.date.getTime() === todayStamp ? 'is-today' : ''}${r.date.getDay() === 5 ? ' is-friday' : ''}`}>
                <td>
                  <b>{r.date.getDate()}</b> <span className="muted">{WEEKDAYS[r.date.getDay()].slice(0, 3)}</span>
                  <small className="table-hijri">
                    {r.hijri.day}/{r.hijri.month}
                  </small>
                </td>
                {ALL_TIMES.map((k) => (
                  <td key={k}>{formatTime(r.times[k])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="times-note">
        <Icon name="info" size={14} /> Pengingat adzan bekerja selama halaman MaRilmu terbuka di browser. Imsak = 10 menit sebelum Subuh.
      </p>
    </Page>
  );
}
