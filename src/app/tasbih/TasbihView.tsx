'use client';

import { useCallback, useEffect, useState } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, Page } from '@/components/ui';
import { useNow, useStored } from '@/lib/store';
import { dateKey } from '@/lib/hijri';

interface Preset {
  id: string;
  arabic: string;
  latin: string;
  meaning: string;
  target: number;
}

const PRESETS: Preset[] = [
  { id: 'tasbih', arabic: 'سُبْحَانَ اللّٰهِ', latin: 'Subhanallah', meaning: 'Maha Suci Allah', target: 33 },
  { id: 'tahmid', arabic: 'اَلْحَمْدُ لِلّٰهِ', latin: 'Alhamdulillah', meaning: 'Segala puji bagi Allah', target: 33 },
  { id: 'takbir', arabic: 'اَللّٰهُ أَكْبَرُ', latin: 'Allahu Akbar', meaning: 'Allah Maha Besar', target: 33 },
  { id: 'tahlil', arabic: 'لَا إِلٰهَ إِلَّا اللّٰهُ', latin: 'La ilaha illallah', meaning: 'Tiada tuhan selain Allah', target: 100 },
  { id: 'istighfar', arabic: 'أَسْتَغْفِرُ اللّٰهَ', latin: 'Astaghfirullah', meaning: 'Aku memohon ampun kepada Allah', target: 100 },
  { id: 'shalawat', arabic: 'اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ', latin: 'Allahumma shalli ‘ala Muhammad', meaning: 'Ya Allah, limpahkan shalawat kepada Muhammad', target: 100 },
  { id: 'hauqalah', arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', latin: 'La haula wa la quwwata illa billah', meaning: 'Tiada daya dan kekuatan kecuali dengan Allah', target: 100 },
  { id: 'subhanallah-wabihamdihi', arabic: 'سُبْحَانَ اللّٰهِ وَبِحَمْدِهِ', latin: 'Subhanallahi wa bihamdihi', meaning: 'Maha Suci Allah dan segala puji bagi-Nya', target: 100 },
];

const SEQUENCE = ['tasbih', 'tahmid', 'takbir'];

interface TasbihStats {
  total: number;
  days: Record<string, number>;
}
const EMPTY_STATS: TasbihStats = { total: 0, days: {} };

export default function TasbihView() {
  const now = useNow();
  const hydrated = now > 0;
  const [preset, setPreset] = useState<Preset>(PRESETS[0]);
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(33);
  const [sequence, setSequence] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [pulse, setPulse] = useState(0);
  const [stats, setStats] = useStored<TasbihStats>('marilmu:tasbih', EMPTY_STATS);

  const today = hydrated ? dateKey(new Date(now)) : '';
  const done = target > 0 && count >= target;
  const seqIndex = SEQUENCE.indexOf(preset.id);
  const inSequence = sequence && seqIndex >= 0;
  const seqFinished = inSequence && seqIndex === SEQUENCE.length - 1 && done;

  const select = (p: Preset) => {
    setPreset(p);
    setTarget(p.target);
    setCount(0);
  };

  const tap = useCallback(() => {
    if (done && inSequence && seqIndex < SEQUENCE.length - 1) {
      const next = PRESETS.find((p) => p.id === SEQUENCE[seqIndex + 1])!;
      setPreset(next);
      setTarget(next.target);
      setCount(1);
    } else {
      setCount((c) => c + 1);
    }
    setPulse((p) => p + 1);
    const willComplete = target > 0 && count + 1 === target;
    if (vibrate) navigator.vibrate?.(willComplete ? [40, 80, 40] : 18);
    const key = dateKey(new Date());
    setStats((s) => ({ total: s.total + 1, days: { ...s.days, [key]: (s.days[key] ?? 0) + 1 } }));
  }, [done, inSequence, seqIndex, target, count, vibrate, setStats]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA' || el.tagName === 'BUTTON') return;
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        tap();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tap]);

  const pct = target > 0 ? Math.min(count / target, 1) : (count % 33) / 33;
  const R = 120;
  const C = 2 * Math.PI * R;
  const beads = 33;
  const activeBead = target > 0 ? Math.floor(pct * beads) : count % beads;

  return (
    <Page width="narrow">
      <PageHeader icon="beads" title="Tasbih Digital" subtitle="Ketuk lingkaran, tekan spasi, atau Enter untuk menghitung" />

      <section className="tasbih">
        <p className="tasbih-arabic arabic" lang="ar">
          {preset.arabic}
        </p>
        <p className="tasbih-latin">
          {preset.latin} — <span>{preset.meaning}</span>
        </p>

        <button className={`tasbih-counter${done ? ' done' : ''}`} onClick={tap} aria-label={`Hitung. Saat ini ${count}`}>
          <svg viewBox="0 0 280 280" aria-hidden className="tasbih-ring">
            <circle cx="140" cy="140" r={R} className="tasbih-track" />
            <circle
              cx="140"
              cy="140"
              r={R}
              className="tasbih-fill"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct)}
              transform="rotate(-90 140 140)"
            />
            {Array.from({ length: beads }).map((_, i) => {
              const a = (i / beads) * Math.PI * 2 - Math.PI / 2;
              return <circle key={i} cx={140 + Math.cos(a) * 136} cy={140 + Math.sin(a) * 136} r={i < activeBead ? 3.4 : 2.4} className={i < activeBead ? 'bead on' : 'bead'} />;
            })}
          </svg>
          <span className="tasbih-count tabular" key={pulse}>
            {count}
          </span>
          <span className="tasbih-target">{target > 0 ? `dari ${target}` : 'tanpa batas'}</span>
        </button>

        <p className="tasbih-msg" aria-live="polite">
          {seqFinished
            ? 'Selesai 33× tiga rangkaian. Tutup dengan tahlil: “Lā ilāha illallāh…”'
            : done && inSequence
              ? 'Target tercapai — ketuk lagi untuk lanjut ke bacaan berikutnya'
              : done
                ? 'Alhamdulillah, target tercapai!'
                : ' '}
        </p>

        <div className="tasbih-controls">
          <button className="btn btn-outline btn-sm" onClick={() => setCount(0)}>
            <Icon name="refresh" size={16} /> Ulangi
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => setCount((c) => Math.max(0, c - 1))} disabled={count === 0}>
            <Icon name="minus" size={16} /> Kurangi
          </button>
          <label className="tasbih-target-input">
            Target
            <select className="select" value={target} onChange={(e) => setTarget(Number(e.target.value))}>
              {[0, 7, 10, 33, 99, 100, 1000].map((t) => (
                <option key={t} value={t}>
                  {t === 0 ? '∞' : t}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="tasbih-toggles">
          <button className={`chip-btn${sequence ? ' on' : ''}`} onClick={() => setSequence((s) => !s)} aria-pressed={sequence}>
            <Icon name="repeat" size={14} /> Rangkaian 33-33-33
          </button>
          <button className={`chip-btn${vibrate ? ' on' : ''}`} onClick={() => setVibrate((v) => !v)} aria-pressed={vibrate}>
            Getar
          </button>
        </div>
      </section>

      <h2 className="tasbih-presets-title">Pilih bacaan</h2>
      <div className="tasbih-presets">
        {PRESETS.map((p) => (
          <button key={p.id} className={`tasbih-preset${preset.id === p.id ? ' active' : ''}`} onClick={() => select(p)}>
            <span className="arabic">{p.arabic}</span>
            <small>
              {p.latin} · {p.target}×
            </small>
          </button>
        ))}
      </div>

      <div className="stats mt-3">
        <div className="stat stat-emerald">
          <span className="stat-value">{hydrated ? (stats.days[today] ?? 0).toLocaleString('id-ID') : '—'}</span>
          <span className="stat-label">Hari ini</span>
        </div>
        <div className="stat stat-gold">
          <span className="stat-value">
            {hydrated
              ? Object.entries(stats.days)
                  .filter(([k]) => now - new Date(`${k}T00:00:00`).getTime() < 7 * 864e5)
                  .reduce((a, [, v]) => a + v, 0)
                  .toLocaleString('id-ID')
              : '—'}
          </span>
          <span className="stat-label">7 hari</span>
        </div>
        <div className="stat stat-sky">
          <span className="stat-value">{hydrated ? stats.total.toLocaleString('id-ID') : '—'}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>
    </Page>
  );
}
