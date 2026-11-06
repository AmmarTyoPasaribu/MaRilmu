'use client';

import { useEffect, useRef } from 'react';
import { ToastProvider } from './Toast';
import { PlayerProvider } from './Player';
import { useNow, useSettings } from '@/lib/store';
import { usePrayerTimes } from '@/lib/hooks';
import { FARDHU, PRAYER_LABELS, formatTime } from '@/lib/prayer';

export const ARABIC_SCALE = [0.85, 0.95, 1, 1.15, 1.3];

/** Skrip kecil yang dijalankan sebelum render agar tema tidak berkedip. */
export const THEME_SCRIPT = `(function(){try{var s=JSON.parse(localStorage.getItem('marilmu:settings')||'{}');var t=s.theme||'system';if(t==='system')t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var d=document.documentElement;d.dataset.theme=t;var a=[${ARABIC_SCALE.join(',')}][(s.arabicSize||3)-1]||1;d.style.setProperty('--ar-scale',a);}catch(e){}})();`;

function ThemeSync() {
  const [settings] = useSettings();
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      const t = settings.theme === 'system' ? (mq.matches ? 'dark' : 'light') : settings.theme;
      root.dataset.theme = t;
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', t === 'dark' ? '#0a1512' : '#0f4c3a');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [settings.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--ar-scale', String(ARABIC_SCALE[settings.arabicSize - 1] ?? 1));
  }, [settings.arabicSize]);
  return null;
}

function chime() {
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = freq;
      o.type = 'sine';
      const t = ctx.currentTime + i * 0.35;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.25, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 1.5);
    });
    setTimeout(() => ctx.close(), 3000);
  } catch {
    /* abaikan */
  }
}

/** Notifikasi masuk waktu sholat (selama tab terbuka). */
function PrayerNotifier() {
  const [settings] = useSettings();
  const now = useNow();
  const { today } = usePrayerTimes(now);
  const fired = useRef<string>('');

  useEffect(() => {
    if (!settings.notify || !now) return;
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    for (const key of FARDHU) {
      const t = today[key].getTime();
      if (now >= t && now - t < 60_000) {
        const id = `${key}-${t}`;
        if (fired.current === id) return;
        fired.current = id;
        try {
          new Notification(`Waktu ${PRAYER_LABELS[key]} telah tiba`, {
            body: `${formatTime(today[key])} — Mari tunaikan sholat ${PRAYER_LABELS[key]}.`,
            icon: '/icon.svg',
            tag: id,
          });
        } catch {
          /* beberapa browser mobile butuh service worker */
        }
        chime();
        return;
      }
    }
  }, [now, today, settings.notify]);
  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <PlayerProvider>
        <ThemeSync />
        <PrayerNotifier />
        {children}
      </PlayerProvider>
    </ToastProvider>
  );
}
