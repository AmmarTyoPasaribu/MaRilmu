'use client';

import { useState, useEffect } from 'react';
import { getQiblaDirection, getUserLocation, getCityName } from '@/lib/api';
import type { QiblaData } from '@/types';

export default function KiblatPage() {
  const [qibla, setQibla] = useState<QiblaData | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState(0);
  const [compassSupported, setCompassSupported] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const loc = await getUserLocation();
        const cityName = await getCityName(loc.latitude, loc.longitude);
        setCity(loc.city || cityName);
        const data = await getQiblaDirection(loc.latitude, loc.longitude);
        setQibla(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      let h = e.alpha || 0;
      if ((e as any).webkitCompassHeading !== undefined) {
        h = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        h = 360 - e.alpha;
      }
      setHeading(h);
    }

    if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        (DeviceOrientationEvent as any).requestPermission()
          .then((state: string) => {
            if (state === 'granted') window.addEventListener('deviceorientation', handleOrientation, true);
            else setCompassSupported(false);
          })
          .catch(() => setCompassSupported(false));
      } else {
        window.addEventListener('deviceorientation', handleOrientation, true);
      }
    } else {
      setCompassSupported(false);
    }

    return () => { window.removeEventListener('deviceorientation', handleOrientation, true); };
  }, []);

  const qiblaAngle = qibla ? qibla.direction : 0;
  const needleRotation = qiblaAngle - heading;

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>🧭 Arah Kiblat</h1><p>Penunjuk arah kiblat berdasarkan lokasi Anda</p></div>
      </div>
      <div className="page-content">
        <div className="container">
          {loading ? (
            <div className="loading-container"><div className="loading-spinner" /><p>Mendeteksi lokasi...</p></div>
          ) : qibla ? (
            <div className="compass-wrapper">
              <div className="location-info">📍 {city}</div>
              <div className="compass-container">
                <div className="compass-dial" style={{ transform: `rotate(${-heading}deg)` }}>
                  <span className="compass-direction north">U</span>
                  <span className="compass-direction south">S</span>
                  <span className="compass-direction east">T</span>
                  <span className="compass-direction west">B</span>
                </div>
                <div className="compass-needle" style={{ transform: `translate(-50%, -100%) rotate(${needleRotation}deg)` }} />
                <div className="compass-center" />
              </div>
              <div className="compass-info">
                <div className="compass-degree">{qiblaAngle.toFixed(2)}°</div>
                <div className="compass-label">Arah Kiblat dari lokasi Anda</div>
              </div>
              {!compassSupported && (
                <div className="info-box">
                  <p>⚠️ Kompas perangkat tidak tersedia. Jarum menunjukkan {qiblaAngle.toFixed(2)}° dari Utara. Buka di mobile untuk kompas otomatis.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state"><div className="empty-state-icon">⚠️</div><p>Gagal memuat arah kiblat.</p></div>
          )}
        </div>
      </div>
    </>
  );
}
