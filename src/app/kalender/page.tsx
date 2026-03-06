'use client';

import { useState, useEffect } from 'react';
import { getHijriCalendar } from '@/lib/api';
import type { CalendarEntry } from '@/types';

const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

const islamicEvents: Record<string, string> = {
  '1-1': 'Tahun Baru Hijriyah', '1-10': 'Hari Asyura', '3-12': 'Maulid Nabi Muhammad SAW',
  '7-27': 'Isra Miraj', '8-15': 'Nisfu Syaban', '9-1': 'Awal Ramadhan',
  '9-17': 'Nuzulul Quran', '10-1': 'Idul Fitri', '10-2': 'Idul Fitri',
  '12-8': 'Hari Tarwiyah', '12-9': 'Hari Arafah', '12-10': 'Idul Adha',
  '12-11': 'Hari Tasyrik', '12-12': 'Hari Tasyrik', '12-13': 'Hari Tasyrik',
};

export default function KalenderPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [calendarData, setCalendarData] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const data = await getHijriCalendar(month, year);
        setCalendarData(data || []);
      } catch (err) {
        console.error(err);
        setError(true);
        setCalendarData([]);
      } finally { setLoading(false); }
    }
    load();
  }, [month, year]);

  const prevMonth = () => { if (month === 1) { setMonth(12); setYear(year - 1); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 12) { setMonth(1); setYear(year + 1); } else setMonth(month + 1); };

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const today = now.getDate();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  const getHijriForDay = (day: number) => {
    if (!calendarData?.length) return null;
    const entry = calendarData.find((d) => parseInt(d.gregorian.day) === day);
    return entry?.hijri || null;
  };

  const getEventForDay = (day: number) => {
    const hijri = getHijriForDay(day);
    if (!hijri) return null;
    return islamicEvents[`${parseInt(String(hijri.month.number))}-${parseInt(hijri.day)}`] || null;
  };

  const events: { day: number; event: string; hijri: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const event = getEventForDay(d);
    if (event) {
      const hijri = getHijriForDay(d);
      events.push({ day: d, event, hijri: hijri ? `${hijri.day} ${hijri.month.en}` : '' });
    }
  }

  const hijriLabel = calendarData?.length
    ? (() => {
        const first = calendarData[0]?.hijri;
        const last = calendarData[calendarData.length - 1]?.hijri;
        if (first && last) return first.month.en === last.month.en ? `${first.month.en} ${first.year}` : `${first.month.en} - ${last.month.en} ${last.year}`;
        return '';
      })()
    : '';

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>📅 Kalender Hijriyah</h1><p>Kalender Masehi & Hijriyah dengan hari besar Islam</p></div>
      </div>
      <div className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p>Memuat kalender...</p></div>
          ) : error ? (
            <div className="empty-state"><div className="empty-state-icon">⚠️</div><p>Gagal memuat data kalender. Silakan coba lagi.</p>
              <button className="back-btn" onClick={() => { setMonth(now.getMonth() + 1); setYear(now.getFullYear()); }} style={{ marginTop: '1rem' }}>🔄 Muat Ulang</button>
            </div>
          ) : (
            <div className="calendar-wrapper">
              <div className="calendar-header">
                <button className="calendar-nav-btn" onClick={prevMonth}>← Prev</button>
                <div>
                  <div className="calendar-month-title">{monthNames[month - 1]} {year}</div>
                  {hijriLabel && <div className="calendar-hijri-title">{hijriLabel}</div>}
                </div>
                <button className="calendar-nav-btn" onClick={nextMonth}>Next →</button>
              </div>
              <div className="calendar-grid">
                {dayNames.map((d) => (<div key={d} className="calendar-day-name">{d}</div>))}
                {Array.from({ length: firstDay }).map((_, i) => (<div key={`e-${i}`} className="calendar-day" />))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hijri = getHijriForDay(day);
                  const event = getEventForDay(day);
                  return (
                    <div key={day} className={`calendar-day ${isCurrentMonth && day === today ? 'today' : ''} ${event ? 'holiday' : ''}`} title={event || ''}>
                      <span>{day}</span>
                      {hijri && <span className="calendar-day-hijri">{hijri.day}</span>}
                    </div>
                  );
                })}
              </div>
              {events.length > 0 && (
                <div className="calendar-events">
                  <h3 style={{ marginBottom: '1rem' }}>🎉 Hari Besar Islam</h3>
                  {events.map((e, i) => (
                    <div key={i} className="calendar-event">
                      <span className="calendar-event-date">{e.day} {monthNames[month - 1]} / {e.hijri}</span>
                      <span className="calendar-event-name">{e.event}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
