'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import Icon from '@/components/Icon';
import ArabicBlock from '@/components/ArabicBlock';
import LocationBar from '@/components/LocationBar';
import { PageHeader, Page, SectionTitle } from '@/components/ui';
import { useLocation, useNow, useSettings } from '@/lib/store';
import { usePrayerTimes, useHijriToday } from '@/lib/hooks';
import { addDays, calculatePrayerTimes, formatCountdown, formatTime } from '@/lib/prayer';
import { WEEKDAYS, formatGregorian, hijriToGregorian } from '@/lib/hijri';
import { JUZ_START, getSurahMeta } from '@/lib/quran';

const DOA = [
  {
    title: 'Niat puasa Ramadhan',
    ar: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هٰذِهِ السَّنَةِ لِلّٰهِ تَعَالَى',
    lat: "Nawaitu shauma ghadin 'an adaa-i fardhi syahri ramadhaana haadzihis sanati lillaahi ta'aalaa.",
    id: 'Aku berniat puasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta’ala.',
    source: 'Niat wajib di malam hari sebelum fajar (HR. Abu Dawud no. 2454)',
  },
  {
    title: 'Doa berbuka puasa',
    ar: 'ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوْقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللّٰهُ',
    lat: "Dzahabazh zhama-u wabtallatil 'uruuqu wa tsabatal ajru in syaa-allaah.",
    id: 'Telah hilang rasa haus, urat-urat telah basah, dan pahala telah ditetapkan, insya Allah.',
    source: 'HR. Abu Dawud no. 2357 (hasan)',
  },
  {
    title: 'Doa malam Lailatul Qadar',
    ar: 'اَللّٰهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّيْ',
    lat: "Allaahumma innaka 'afuwwun tuhibbul 'afwa fa'fu 'annii.",
    id: 'Ya Allah, sesungguhnya Engkau Maha Pemaaf dan menyukai maaf, maka maafkanlah aku.',
    source: 'HR. Tirmidzi no. 3513',
  },
];

export default function RamadhanView() {
  const now = useNow();
  const ready = now > 0;
  const [settings] = useSettings();
  const [loc] = useLocation();
  const hijri = useHijriToday(now);
  const { today, tomorrow } = usePrayerTimes(now);

  const inRamadhan = hijri.month === 9;
  const ramadhanYear = hijri.month > 9 ? hijri.year + 1 : hijri.year;
  const { method, madhab, hijriOffset } = settings;
  const { latitude, longitude } = loc;

  const startStamp = ready ? (hijriToGregorian({ day: 1, month: 9, year: ramadhanYear }, hijriOffset)?.getTime() ?? 0) : 0;
  const todayStamp = ready ? new Date(new Date(now).setHours(0, 0, 0, 0)).getTime() : 0;
  const daysToGo = startStamp ? Math.round((startStamp - todayStamp) / 864e5) : 0;

  const rows = useMemo(() => {
    if (!startStamp) return [];
    return Array.from({ length: 30 }, (_, i) => {
      const d = addDays(new Date(startStamp), i);
      return { day: i + 1, date: d, t: calculatePrayerTimes(d, latitude, longitude, { method, madhab }) };
    });
  }, [startStamp, latitude, longitude, method, madhab]);

  // hitung mundur: sebelum imsak → imsak; sebelum maghrib → berbuka; sesudahnya → imsak besok
  let target: Date | null = null;
  let label = '';
  if (ready) {
    if (now < today.imsak.getTime()) {
      target = today.imsak;
      label = 'Menuju imsak (batas sahur)';
    } else if (now < today.maghrib.getTime()) {
      target = today.maghrib;
      label = 'Menuju waktu berbuka';
    } else {
      target = tomorrow.imsak;
      label = 'Menuju imsak besok';
    }
  }

  const juzToday = inRamadhan ? Math.min(hijri.day, 30) : 0;
  const juz = juzToday ? JUZ_START[juzToday - 1] : null;

  return (
    <Page>
      <PageHeader
        icon="lantern"
        arabic="رَمَضَان كَرِيم"
        title={inRamadhan ? `Hari ke-${hijri.day} Ramadhan ${hijri.year} H` : 'Ramadhan'}
        subtitle={inRamadhan ? 'Semoga Allah menerima puasa dan amal kita' : ready && daysToGo > 0 ? `${daysToGo} hari menuju 1 Ramadhan ${ramadhanYear} H` : 'Imsakiyah, doa & persiapan Ramadhan'}
      >
        <LocationBar />
      </PageHeader>

      <section className="ramadhan-hero">
        <div className="ramadhan-count">
          <span className="prayer-hero-label">{label || 'Menghitung…'}</span>
          <span className="prayer-hero-count tabular">{target ? formatCountdown(target.getTime() - now) : '--:--:--'}</span>
        </div>
        <div className="ramadhan-pair">
          <div>
            <small>Imsak</small>
            <b className="tabular">{ready ? formatTime(today.imsak) : '--:--'}</b>
          </div>
          <div>
            <small>Subuh</small>
            <b className="tabular">{ready ? formatTime(today.subuh) : '--:--'}</b>
          </div>
          <div className="gold">
            <small>Berbuka</small>
            <b className="tabular">{ready ? formatTime(today.maghrib) : '--:--'}</b>
          </div>
        </div>
      </section>

      {juz && (
        <Link href={`/quran/${juz[0]}#ayat-${juz[1]}`} className="card card-link continue-card mt-2">
          <span className="continue-icon">
            <Icon name="quran" size={26} />
          </span>
          <span className="continue-text">
            <small>Target tilawah hari ini (khatam 30 hari)</small>
            <strong>
              Juz {juzToday} — mulai {getSurahMeta(juz[0])?.lat} ayat {juz[1]}
            </strong>
          </span>
          <Icon name="arrowRight" size={20} />
        </Link>
      )}

      <SectionTitle>Niat & doa</SectionTitle>
      <div className="grid grid-3">
        {DOA.map((d) => (
          <ArabicBlock key={d.title} title={d.title} arabic={d.ar} latin={d.lat} translation={d.id} source={d.source} />
        ))}
      </div>

      <SectionTitle>Imsakiyah Ramadhan {ramadhanYear} H</SectionTitle>
      {rows.length > 0 && (
        <p className="times-note" style={{ marginTop: -8 }}>
          <Icon name="calendar" size={14} /> Perkiraan 1 Ramadhan: {WEEKDAYS[rows[0].date.getDay()]}, {formatGregorian(rows[0].date)} · menunggu sidang isbat Kemenag
        </p>
      )}
      <div className="table-wrap month-table">
        <table className="table">
          <thead>
            <tr>
              <th>Ramadhan</th>
              <th>Imsak</th>
              <th>Subuh</th>
              <th>Dzuhur</th>
              <th>Ashar</th>
              <th>Maghrib</th>
              <th>Isya</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.day} className={r.date.getTime() === todayStamp ? 'is-today' : ''}>
                <td>
                  <b>{r.day}</b> <span className="muted">· {r.date.getDate()}/{r.date.getMonth() + 1}</span>
                </td>
                <td>{formatTime(r.t.imsak)}</td>
                <td>{formatTime(r.t.subuh)}</td>
                <td>{formatTime(r.t.dzuhur)}</td>
                <td>{formatTime(r.t.ashar)}</td>
                <td className="gold-cell">{formatTime(r.t.maghrib)}</td>
                <td>{formatTime(r.t.isya)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
