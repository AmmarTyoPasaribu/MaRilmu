'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, Page, SectionTitle } from '@/components/ui';
import { useNow } from '@/lib/store';
import { addDays } from '@/lib/prayer';
import { WEEKDAYS, WEEKDAYS_SHORT, dateKey, formatGregorian } from '@/lib/hijri';
import { IBADAH_ITEMS, SHOLAT_NAMES, TOTAL_ITEMS, emptyEntry, entryDone, sholatDone, useJurnal, type IbadahKey } from '@/lib/jurnal';

export default function JurnalView() {
  const now = useNow();
  const ready = now > 0;
  const [jurnal, setJurnal] = useJurnal();
  const [offset, setOffset] = useState(0);

  const today = ready ? new Date(new Date(now).setHours(0, 0, 0, 0)) : new Date(0);
  const day = addDays(today, offset);
  const key = dateKey(day);
  const entry = jurnal[key] ?? emptyEntry();
  const done = entryDone(entry);
  const pct = Math.round((done / TOTAL_ITEMS) * 100);

  const write = (fn: (e: typeof entry) => typeof entry) => setJurnal((prev) => ({ ...prev, [key]: fn(prev[key] ?? emptyEntry()) }));
  const toggleSholat = (i: number) =>
    write((e) => {
      const sholat = [...e.sholat];
      sholat[i] = !sholat[i];
      return { ...e, sholat };
    });
  const toggleItem = (k: IbadahKey) => write((e) => ({ ...e, [k]: !e[k] }));

  // streak: hari berturut-turut dengan sholat 5/5 (hari ini dihitung bila sudah lengkap)
  let streak = 0;
  if (ready) {
    for (let i = sholatDone(jurnal[dateKey(today)]) === 5 ? 0 : 1; i < 400; i++) {
      if (sholatDone(jurnal[dateKey(addDays(today, -i))]) === 5) streak++;
      else break;
    }
  }

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i - 6);
    const e = jurnal[dateKey(d)];
    return { d, pct: Math.round((entryDone(e) / TOTAL_ITEMS) * 100), sholat: sholatDone(e) };
  });

  // heatmap 5 minggu (Ahad–Sabtu)
  const start = addDays(today, -today.getDay() - 28);
  const heat = Array.from({ length: 35 }, (_, i) => {
    const d = addDays(start, i);
    return { d, level: d > today ? -1 : Math.ceil((entryDone(jurnal[dateKey(d)]) / TOTAL_ITEMS) * 4) };
  });

  const R = 54;
  const C = 2 * Math.PI * R;

  return (
    <Page width="narrow">
      <PageHeader icon="target" title="Jurnal Ibadah" subtitle="Istiqamah dimulai dari satu catatan kecil setiap hari" />

      <div className="day-nav">
        <button className="icon-btn" onClick={() => setOffset((o) => o - 1)} aria-label="Hari sebelumnya">
          <Icon name="chevronLeft" size={20} />
        </button>
        <div className="day-nav-label">
          <strong>{ready ? (offset === 0 ? 'Hari ini' : offset === -1 ? 'Kemarin' : WEEKDAYS[day.getDay()]) : '…'}</strong>
          <small>{ready ? formatGregorian(day) : ''}</small>
        </div>
        <button className="icon-btn" onClick={() => setOffset((o) => Math.min(0, o + 1))} disabled={offset >= 0} aria-label="Hari berikutnya">
          <Icon name="chevronRight" size={20} />
        </button>
      </div>

      <section className="jurnal-summary card">
        <div className="ring">
          <svg viewBox="0 0 128 128" aria-hidden>
            <circle cx="64" cy="64" r={R} className="ring-track" />
            <circle cx="64" cy="64" r={R} className="ring-fill" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} transform="rotate(-90 64 64)" />
          </svg>
          <span>
            <b>{pct}%</b>
            <small>
              {done}/{TOTAL_ITEMS}
            </small>
          </span>
        </div>
        <div className="jurnal-streak">
          <span className="jurnal-streak-icon">
            <Icon name="flame" size={22} />
          </span>
          <div>
            <b>{streak} hari</b>
            <small>sholat 5 waktu berturut-turut</small>
          </div>
        </div>
      </section>

      <SectionTitle>Sholat fardhu</SectionTitle>
      <div className="sholat-check-row big">
        {SHOLAT_NAMES.map((n, i) => (
          <button key={n} className={`sholat-pill${entry.sholat[i] ? ' done' : ''}`} onClick={() => toggleSholat(i)} aria-pressed={!!entry.sholat[i]} disabled={!ready}>
            <Icon name={entry.sholat[i] ? 'checkCircle' : 'mosque'} size={20} />
            {n}
          </button>
        ))}
      </div>

      <SectionTitle>Amalan lainnya</SectionTitle>
      <ul className="habit-list">
        {IBADAH_ITEMS.map((it) => (
          <li key={it.key}>
            <button className={`habit${entry[it.key] ? ' done' : ''}`} onClick={() => toggleItem(it.key)} aria-pressed={!!entry[it.key]} disabled={!ready}>
              <span className="habit-icon">
                <Icon name={it.icon} size={20} />
              </span>
              <span className="habit-label">{it.label}</span>
              <span className="habit-check">{entry[it.key] && <Icon name="check" size={16} strokeWidth={2.5} />}</span>
            </button>
          </li>
        ))}
      </ul>

      <SectionTitle>7 hari terakhir</SectionTitle>
      <div className="card bars">
        {last7.map((d) => (
          <div key={d.d.getTime()} className={`bar${d.d.getTime() === today.getTime() ? ' today' : ''}`} title={`${formatGregorian(d.d)}: ${d.pct}% (sholat ${d.sholat}/5)`}>
            <span className="bar-value">{d.pct}%</span>
            <span className="bar-track">
              <span style={{ height: `${Math.max(d.pct, 3)}%` }} />
            </span>
            <span className="bar-label">{WEEKDAYS_SHORT[d.d.getDay()]}</span>
          </div>
        ))}
      </div>

      <SectionTitle>5 minggu terakhir</SectionTitle>
      <div className="card heatmap-card">
        <div className="heatmap">
          {WEEKDAYS_SHORT.map((w) => (
            <span key={w} className="heatmap-dow">
              {w[0]}
            </span>
          ))}
          {heat.map((h) => (
            <span key={h.d.getTime()} className={`heat l${h.level}`} title={h.level >= 0 ? formatGregorian(h.d) : ''} />
          ))}
        </div>
        <div className="heatmap-legend">
          Sedikit <span className="heat l0" /> <span className="heat l1" /> <span className="heat l2" /> <span className="heat l3" /> <span className="heat l4" /> Banyak
        </div>
      </div>
      <p className="times-note mt-2">
        <Icon name="info" size={14} /> Jurnal tersimpan hanya di perangkat ini.
      </p>
    </Page>
  );
}
