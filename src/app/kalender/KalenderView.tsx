'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, Page, SectionTitle, Segmented } from '@/components/ui';
import { useNow, useSettings } from '@/lib/store';
import {
  GREGORIAN_MONTHS,
  HIJRI_MONTHS,
  WEEKDAYS,
  WEEKDAYS_SHORT,
  formatGregorian,
  formatHijri,
  getEventsFor,
  getSunnahFasts,
  getUpcomingEvents,
  hijriToGregorian,
  startOfDay,
  startOfMonth,
  toHijri,
  type HijriDate,
} from '@/lib/hijri';

export default function KalenderView() {
  const now = useNow();
  const ready = now > 0;
  const [settings] = useSettings();
  const offset = settings.hijriOffset;
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const nowDate = new Date(now || 0);
  const todayStamp = ready ? startOfDay(now) : 0;
  const monthStamp = ready ? startOfMonth(now, monthOffset) : 0;

  const cells = useMemo(() => {
    if (!monthStamp) return [];
    const base = new Date(monthStamp);
    const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(base.getFullYear(), base.getMonth(), i + 1);
      const hijri = toHijri(date, offset);
      return { date, hijri, events: getEventsFor(hijri), fasts: getSunnahFasts(date, hijri) };
    });
  }, [monthStamp, offset]);

  const upcoming = useMemo(() => (todayStamp ? getUpcomingEvents(new Date(todayStamp), offset, 400, 14) : []), [todayStamp, offset]);

  const base = monthStamp ? new Date(monthStamp) : null;
  const lead = base ? base.getDay() : 0;
  const hijriRange = cells.length
    ? (() => {
        const a = cells[0].hijri;
        const b = cells[cells.length - 1].hijri;
        return a.month === b.month
          ? `${HIJRI_MONTHS[a.month - 1]} ${a.year} H`
          : `${HIJRI_MONTHS[a.month - 1]}${a.year !== b.year ? ` ${a.year}` : ''} – ${HIJRI_MONTHS[b.month - 1]} ${b.year} H`;
      })()
    : '';
  const sel = cells.find((c) => c.date.getTime() === selected) ?? cells.find((c) => c.date.getTime() === todayStamp) ?? null;
  const monthEvents = cells.filter((c) => c.events.length);

  return (
    <Page>
      <PageHeader icon="calendar" title="Kalender Hijriah" subtitle={ready ? `Hari ini ${formatHijri(toHijri(nowDate, offset))}` : 'Kalender Islam & Masehi'} />

      <div className="calendar-layout">
        <section className="card calendar">
          <header className="calendar-head">
            <button className="icon-btn" onClick={() => setMonthOffset((m) => m - 1)} aria-label="Bulan sebelumnya">
              <Icon name="chevronLeft" size={20} />
            </button>
            <div>
              <h2>{base ? `${GREGORIAN_MONTHS[base.getMonth()]} ${base.getFullYear()}` : '—'}</h2>
              <p>{hijriRange}</p>
            </div>
            <button className="icon-btn" onClick={() => setMonthOffset((m) => m + 1)} aria-label="Bulan berikutnya">
              <Icon name="chevronRight" size={20} />
            </button>
          </header>
          {monthOffset !== 0 && (
            <div className="center" style={{ marginBottom: 8 }}>
              <button className="chip-btn" onClick={() => setMonthOffset(0)}>
                Bulan ini
              </button>
            </div>
          )}
          <div className="calendar-grid" role="grid">
            {WEEKDAYS_SHORT.map((d, i) => (
              <div key={d} className={`calendar-dow${i === 5 ? ' friday' : ''}`} role="columnheader">
                {d}
              </div>
            ))}
            {Array.from({ length: lead }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {cells.map((c) => {
              const t = c.date.getTime();
              const cls = [
                'calendar-cell',
                t === todayStamp && 'today',
                sel && t === sel.date.getTime() && 'selected',
                c.events.some((e) => e.kind === 'hari-raya') && 'raya',
                c.events.length > 0 && 'event',
                c.fasts.length > 0 && 'fast',
                c.date.getDay() === 5 && 'friday',
              ]
                .filter(Boolean)
                .join(' ');
              return (
                <button key={t} className={cls} onClick={() => setSelected(t)} role="gridcell" aria-label={`${formatGregorian(c.date)}, ${formatHijri(c.hijri)}`}>
                  <span className="calendar-greg">{c.date.getDate()}</span>
                  <span className="calendar-hijri">{c.hijri.day}</span>
                  {(c.events.length > 0 || c.fasts.length > 0) && <span className="calendar-dot" />}
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span>
              <i className="lg-event" /> Hari besar
            </span>
            <span>
              <i className="lg-fast" /> Puasa sunnah
            </span>
            <span>
              <i className="lg-today" /> Hari ini
            </span>
          </div>
        </section>

        <aside className="stack">
          {sel && (
            <div className="card day-detail">
              <span className="badge gold">{WEEKDAYS[sel.date.getDay()]}</span>
              <h3>{formatGregorian(sel.date)}</h3>
              <p className="day-detail-hijri">{formatHijri(sel.hijri)}</p>
              {sel.events.map((e) => (
                <div key={e.name} className={`day-event kind-${e.kind}`}>
                  <strong>{e.name}</strong>
                  {e.note && <p>{e.note}</p>}
                </div>
              ))}
              {sel.fasts.map((f) => (
                <div key={f} className="day-event kind-puasa">
                  <strong>{f === 'senin-kamis' ? `Puasa ${WEEKDAYS[sel.date.getDay()]}` : 'Puasa Ayyamul Bidh'}</strong>
                  <p>{f === 'senin-kamis' ? 'Amal diperlihatkan pada hari Senin dan Kamis (HR. Tirmidzi).' : 'Puasa tanggal 13, 14, 15 bulan Hijriah — seperti puasa setahun.'}</p>
                </div>
              ))}
              {sel.events.length === 0 && sel.fasts.length === 0 && <p className="muted">Tidak ada agenda khusus.</p>}
            </div>
          )}

          {monthEvents.length > 0 && (
            <div className="card">
              <h3 className="card-title">
                <Icon name="star8" size={16} /> Bulan ini
              </h3>
              <ul className="event-list">
                {monthEvents.map((c) =>
                  c.events.map((e) => (
                    <li key={e.name + c.date.getTime()}>
                      <span className="event-date">{c.date.getDate()}</span>
                      <span>
                        <strong>{e.name}</strong>
                        <small>{formatHijri(c.hijri)}</small>
                      </span>
                    </li>
                  )),
                )}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <SectionTitle>Hari besar mendatang</SectionTitle>
      <ul className="upcoming-grid">
        {upcoming.map((e) => (
          <li key={e.name + e.hijri.year + e.hijri.day} className={`upcoming kind-${e.kind}`}>
            <span className="upcoming-days">
              <b>{e.daysLeft}</b>
              <small>hari</small>
            </span>
            <span>
              <strong>{e.name}</strong>
              <small>
                {formatHijri(e.hijri)} · {WEEKDAYS[e.date.getDay()]}, {formatGregorian(e.date)}
              </small>
            </span>
          </li>
        ))}
      </ul>

      <Converter offset={offset} ready={ready} nowStamp={todayStamp} />

      <p className="times-note mt-2">
        <Icon name="info" size={14} /> Perhitungan memakai kalender Umm al-Qura. Penetapan resmi awal Ramadhan, Syawal & Dzulhijjah di Indonesia
        mengikuti sidang isbat Kemenag — sesuaikan ±hari di Pengaturan bila berbeda.
      </p>
    </Page>
  );
}

function Converter({ offset, ready, nowStamp }: { offset: number; ready: boolean; nowStamp: number }) {
  const [mode, setMode] = useState<'m2h' | 'h2m'>('m2h');
  const [greg, setGreg] = useState('');
  const [hijri, setHijri] = useState<HijriDate | null>(null);

  const todayH = nowStamp ? toHijri(new Date(nowStamp), offset) : { day: 1, month: 1, year: 1448 };
  const h = hijri ?? todayH;

  let result = '';
  if (mode === 'm2h' && greg) {
    const [y, m, d] = greg.split('-').map(Number);
    if (y && m && d) result = formatHijri(toHijri(new Date(y, m - 1, d), offset));
  } else if (mode === 'h2m' && ready) {
    const g = hijriToGregorian(h, offset);
    result = g ? `${WEEKDAYS[g.getDay()]}, ${formatGregorian(g)}` : 'Tanggal tidak valid';
  }

  return (
    <>
      <SectionTitle>Konversi tanggal</SectionTitle>
      <div className="card converter">
        <Segmented<'m2h' | 'h2m'>
          label="Arah konversi"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'm2h', label: 'Masehi → Hijriah' },
            { value: 'h2m', label: 'Hijriah → Masehi' },
          ]}
        />
        {mode === 'm2h' ? (
          <label className="field">
            <span className="field-label">Tanggal Masehi</span>
            <input type="date" className="input" value={greg} onChange={(e) => setGreg(e.target.value)} />
          </label>
        ) : (
          <div className="converter-hijri">
            <label className="field">
              <span className="field-label">Tanggal</span>
              <select className="select" value={h.day} onChange={(e) => setHijri({ ...h, day: Number(e.target.value) })}>
                {Array.from({ length: 30 }, (_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Bulan</span>
              <select className="select" value={h.month} onChange={(e) => setHijri({ ...h, month: Number(e.target.value) })}>
                {HIJRI_MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field-label">Tahun (H)</span>
              <input
                type="number"
                className="input"
                value={h.year}
                min={1}
                max={1600}
                onChange={(e) => setHijri({ ...h, year: Number(e.target.value) || h.year })}
              />
            </label>
          </div>
        )}
        <div className="converter-result" aria-live="polite">
          {result ? (
            <>
              <small>Hasil</small>
              <strong>{result}</strong>
            </>
          ) : (
            <small>Pilih tanggal untuk melihat hasil konversi</small>
          )}
        </div>
      </div>
    </>
  );
}
