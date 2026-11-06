'use client';

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { useToast } from './providers/Toast';
import { detectLocation, searchPlaces, useHydrated, useLocation, writeStored, LOCATION_KEY, type PlaceResult } from '@/lib/store';

/** Chip lokasi + panel ganti lokasi (GPS atau cari kota). */
export default function LocationBar({ compact = false }: { compact?: boolean }) {
  const hydrated = useHydrated();
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();
  const autoTried = useRef(false);

  // Jika izin lokasi sudah pernah diberikan, perbarui otomatis secara diam-diam.
  useEffect(() => {
    if (!hydrated || autoTried.current || loc.source !== 'default') return;
    autoTried.current = true;
    navigator.permissions
      ?.query({ name: 'geolocation' as PermissionName })
      .then((p) => {
        if (p.state === 'granted') detectLocation().catch(() => {});
      })
      .catch(() => {});
  }, [hydrated, loc.source]);

  useEffect(() => {
    if (q.trim().length < 3) return;
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        setResults(await searchPlaces(q.trim()));
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [q]);

  const useGps = async () => {
    setBusy(true);
    setError('');
    try {
      const l = await detectLocation();
      toast(`Lokasi diperbarui: ${l.name}`, 'pin');
      setOpen(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const choose = (r: PlaceResult) => {
    writeStored(LOCATION_KEY, { latitude: r.latitude, longitude: r.longitude, name: r.name, source: 'manual' });
    toast(`Lokasi diatur ke ${r.name}`, 'pin');
    setOpen(false);
    setQ('');
    setResults([]);
  };

  return (
    <div className={`location-bar${compact ? ' compact' : ''}`}>
      <button className="location-chip" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Icon name="pin" size={16} />
        <span className="location-chip-name">{hydrated ? loc.name : 'Memuat lokasi…'}</span>
        {hydrated && loc.source === 'default' && <span className="location-chip-hint">default</span>}
        <Icon name="chevronDown" size={14} />
      </button>

      {open && (
        <div className="location-panel">
          <button className="btn btn-primary btn-block" onClick={useGps} disabled={busy}>
            {busy ? <span className="spinner sm" /> : <Icon name="locate" size={18} />}
            {busy ? 'Mendeteksi lokasi…' : 'Gunakan lokasi saya (GPS)'}
          </button>
          {error && (
            <p className="form-error">
              <Icon name="alert" size={15} /> {error}
            </p>
          )}
          <div className="location-divider">atau cari kota</div>
          <label className="search-field">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ketik nama kota, mis. Bandung" autoFocus />
            {searching && <span className="spinner sm" />}
          </label>
          {q.trim().length >= 3 && results.length > 0 && (
            <ul className="location-results">
              {results.map((r) => (
                <li key={`${r.latitude},${r.longitude}`}>
                  <button onClick={() => choose(r)}>
                    <Icon name="pin" size={15} />
                    <span>
                      <strong>{r.name}</strong>
                      <small>{r.detail}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {hydrated && (
            <p className="location-coords">
              Koordinat: {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
