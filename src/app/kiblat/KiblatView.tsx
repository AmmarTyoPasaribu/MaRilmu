'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import LocationBar from '@/components/LocationBar';
import { PageHeader, Page, SectionTitle } from '@/components/ui';
import { useHydrated, useLocation } from '@/lib/store';
import { angleDiff, compassLabel, distanceToKaaba, qiblaBearing } from '@/lib/qibla';

type CompassEvent = DeviceOrientationEvent & { webkitCompassHeading?: number };
type PermissionFn = () => Promise<'granted' | 'denied'>;

export default function KiblatView() {
  const hydrated = useHydrated();
  const [loc] = useLocation();
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState<'idle' | 'waiting' | 'active' | 'unsupported' | 'denied'>('idle');
  const [rotation, setRotation] = useState(0); // heading tanpa lompatan 359→0
  const [heading, setHeading] = useState<number | null>(null);
  const unwrapped = useRef(0);
  const lastRaw = useRef<number | null>(null);
  const vibrated = useRef(false);

  const bearing = qiblaBearing(loc.latitude, loc.longitude);
  const distance = distanceToKaaba(loc.latitude, loc.longitude);

  const needsPermission =
    hydrated &&
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: PermissionFn }).requestPermission === 'function';
  const hasSensorApi = hydrated && typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    let got = false;
    const handle = (e: CompassEvent) => {
      let h: number | null = null;
      if (typeof e.webkitCompassHeading === 'number') h = e.webkitCompassHeading;
      else if (e.absolute && e.alpha != null) h = 360 - e.alpha;
      if (h == null || Number.isNaN(h)) return;
      const screenAngle = typeof screen !== 'undefined' && screen.orientation ? screen.orientation.angle : 0;
      h = (h + screenAngle + 360) % 360;
      got = true;
      cancelAnimationFrame(frame);
      const value = h;
      frame = requestAnimationFrame(() => {
        if (lastRaw.current == null) unwrapped.current = value;
        else unwrapped.current += angleDiff(value, lastRaw.current);
        lastRaw.current = value;
        setRotation(unwrapped.current);
        setHeading(value);
        setStatus('active');
      });
    };
    const evt = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(evt, handle as EventListener, true);
    const timeout = setTimeout(() => {
      if (!got) setStatus('unsupported');
    }, 3500);
    return () => {
      window.removeEventListener(evt, handle as EventListener, true);
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [enabled]);

  const start = async () => {
    setStatus('waiting');
    if (needsPermission) {
      try {
        const res = await (DeviceOrientationEvent as unknown as { requestPermission: PermissionFn }).requestPermission();
        if (res !== 'granted') {
          setStatus('denied');
          return;
        }
      } catch {
        setStatus('denied');
        return;
      }
    }
    setEnabled(true);
  };

  const diff = heading == null ? null : angleDiff(bearing, heading);
  const aligned = diff != null && Math.abs(diff) <= 5;

  useEffect(() => {
    if (aligned && !vibrated.current) {
      vibrated.current = true;
      navigator.vibrate?.(120);
    } else if (!aligned) vibrated.current = false;
  }, [aligned]);

  const live = status === 'active';

  return (
    <Page width="narrow">
      <PageHeader icon="kaaba" title="Arah Kiblat" subtitle="Hadapkan ponsel ke arah Ka’bah di Masjidil Haram">
        <LocationBar />
      </PageHeader>

      <section className={`qibla${aligned ? ' aligned' : ''}`}>
        <div className="qibla-status" aria-live="polite">
          {live ? (
            aligned ? (
              <>
                <Icon name="checkCircle" size={18} /> Anda sudah menghadap kiblat
              </>
            ) : (
              <>
                Putar {diff! > 0 ? 'ke kanan' : 'ke kiri'} <b className="tabular">{Math.abs(Math.round(diff!))}°</b>
              </>
            )
          ) : (
            <>Kiblat {Math.round(bearing)}° dari Utara</>
          )}
        </div>

        <div className="compass" role="img" aria-label={`Arah kiblat ${bearing.toFixed(1)} derajat dari utara`}>
          <div className="compass-pointer" aria-hidden />
          <div className="compass-dial" style={{ transform: `rotate(${live ? -rotation : 0}deg)` }}>
            <svg viewBox="0 0 300 300" className="compass-svg" aria-hidden>
              <circle cx="150" cy="150" r="146" className="compass-ring" />
              <circle cx="150" cy="150" r="118" className="compass-ring-inner" />
              {Array.from({ length: 72 }).map((_, i) => (
                <line
                  key={i}
                  x1="150"
                  y1={i % 18 === 0 ? 10 : i % 2 === 0 ? 14 : 18}
                  x2="150"
                  y2="26"
                  className={i % 18 === 0 ? 'tick major' : 'tick'}
                  transform={`rotate(${i * 5} 150 150)`}
                />
              ))}
              {(['U', 'T', 'S', 'B'] as const).map((d, i) => (
                <text key={d} x="150" y="52" className={`compass-letter${d === 'U' ? ' north' : ''}`} transform={`rotate(${i * 90} 150 150)`}>
                  {d}
                </text>
              ))}
              <g transform={`rotate(${bearing} 150 150)`}>
                <line x1="150" y1="150" x2="150" y2="62" className="qibla-line" />
              </g>
            </svg>
            <div className="qibla-kaaba" style={{ transform: `rotate(${bearing}deg) translateY(calc(var(--compass-size) * -0.393)) rotate(${-bearing + (live ? rotation : 0)}deg)` }}>
              <Icon name="kaaba" size={26} strokeWidth={1.8} />
            </div>
          </div>
          <div className="compass-center" aria-hidden>
            <Icon name="star8" size={22} />
          </div>
        </div>

        {!live && hydrated && (
          <div className="qibla-start">
            {status === 'unsupported' || (!hasSensorApi && status !== 'idle') ? (
              <p className="info-box">
                <Icon name="info" size={18} />
                <span>
                  Sensor kompas tidak terdeteksi (umum di laptop). Gunakan arah statis: hadapkan bagian atas layar ke <b>Utara</b>, lalu putar{' '}
                  <b>{bearing.toFixed(1)}°</b> searah jarum jam ({compassLabel(bearing)}).
                </span>
              </p>
            ) : status === 'denied' ? (
              <p className="info-box">
                <Icon name="alert" size={18} />
                <span>Izin sensor gerak ditolak. Aktifkan di pengaturan browser lalu coba lagi.</span>
              </p>
            ) : (
              <button className="btn btn-gold" onClick={start} disabled={status === 'waiting'}>
                {status === 'waiting' ? <span className="spinner sm" /> : <Icon name="compass" size={18} />}
                {status === 'waiting' ? 'Menunggu sensor…' : 'Aktifkan kompas'}
              </button>
            )}
          </div>
        )}
      </section>

      <div className="stats">
        <div className="stat stat-gold">
          <span className="stat-value">{bearing.toFixed(1)}°</span>
          <span className="stat-label">{compassLabel(bearing)}</span>
        </div>
        <div className="stat">
          <span className="stat-value">{Math.round(distance).toLocaleString('id-ID')}</span>
          <span className="stat-label">km ke Ka’bah</span>
        </div>
        <div className="stat stat-sky">
          <span className="stat-value">{live && heading != null ? `${Math.round(heading)}°` : '—'}</span>
          <span className="stat-label">Arah ponsel</span>
        </div>
      </div>

      <SectionTitle>Tips akurasi</SectionTitle>
      <div className="stack-sm tips">
        <p className="info-box emerald">
          <Icon name="refresh" size={18} />
          <span>Kalibrasi kompas dengan menggerakkan ponsel membentuk angka 8 beberapa kali.</span>
        </p>
        <p className="info-box emerald">
          <Icon name="alert" size={18} />
          <span>Jauhkan dari benda logam, magnet, speaker, atau perangkat elektronik besar.</span>
        </p>
        <p className="info-box">
          <Icon name="sun" size={18} />
          <span>
            <b>Rashdul Qiblah:</b> setiap <b>27–28 Mei pukul 16.18 WIB</b> dan <b>15–16 Juli pukul 16.27 WIB</b> matahari tepat di atas Ka’bah.
            Bayangan benda tegak saat itu mengarah tepat berlawanan dengan kiblat — cara paling akurat untuk memeriksa arah kiblat.
          </span>
        </p>
      </div>
    </Page>
  );
}
