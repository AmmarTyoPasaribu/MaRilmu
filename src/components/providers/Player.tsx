'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../Icon';

export interface Track {
  id: string;
  title: string;
  subtitle?: string;
  src: string;
  href?: string;
  surah?: number;
  ayah?: number;
}

interface PlayerApi {
  current: Track | null;
  playing: boolean;
  loading: boolean;
  queueLength: number;
  index: number;
  playQueue: (tracks: Track[], start?: number) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  seek: (seconds: number) => void;
}

const PlayerContext = createContext<PlayerApi | null>(null);
const TimeContext = createContext<{ time: number; duration: number }>({ time: 0, duration: 0 });

export function usePlayer(): PlayerApi {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer harus di dalam PlayerProvider');
  return ctx;
}

export function usePlayerTime() {
  return useContext(TimeContext);
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [time, setTime] = useState({ time: 0, duration: 0 });
  const queueRef = useRef<Track[]>([]);
  const indexRef = useRef(0);

  const current = queue[index] ?? null;

  const load = useCallback((i: number) => {
    const audio = audioRef.current;
    const track = queueRef.current[i];
    if (!audio || !track) return;
    indexRef.current = i;
    setIndex(i);
    setLoading(true);
    setTime({ time: 0, duration: 0 });
    audio.src = track.src;
    audio.play().catch(() => {
      setPlaying(false);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'auto';
    audioRef.current = audio;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onPlaying = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onTime = () => setTime({ time: audio.currentTime, duration: audio.duration || 0 });
    const onEnded = () => {
      const nextIndex = indexRef.current + 1;
      if (nextIndex < queueRef.current.length) load(nextIndex);
      else setPlaying(false);
    };
    const onError = () => {
      setLoading(false);
      setPlaying(false);
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [load]);

  // Media Session: kontrol dari layar kunci / notifikasi
  useEffect(() => {
    if (!current || typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.subtitle ?? 'MaRilmu',
      album: 'MaRilmu',
    });
  }, [current]);

  const playQueue = useCallback(
    (tracks: Track[], start = 0) => {
      queueRef.current = tracks;
      setQueue(tracks);
      load(start);
    },
    [load],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !queueRef.current.length) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, []);

  const next = useCallback(() => {
    if (indexRef.current + 1 < queueRef.current.length) load(indexRef.current + 1);
  }, [load]);

  const prev = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (indexRef.current > 0) load(indexRef.current - 1);
  }, [load]);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }
    queueRef.current = [];
    setQueue([]);
    setIndex(0);
    setPlaying(false);
    setLoading(false);
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(seconds)) audio.currentTime = seconds;
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', toggle);
    navigator.mediaSession.setActionHandler('pause', toggle);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('previoustrack', prev);
  }, [toggle, next, prev]);

  const api = useMemo<PlayerApi>(
    () => ({ current, playing, loading, queueLength: queue.length, index, playQueue, toggle, next, prev, stop, seek }),
    [current, playing, loading, queue.length, index, playQueue, toggle, next, prev, stop, seek],
  );

  return (
    <PlayerContext.Provider value={api}>
      <TimeContext.Provider value={time}>
        {children}
        <MiniPlayer />
      </TimeContext.Provider>
    </PlayerContext.Provider>
  );
}

function fmt(s: number) {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function MiniPlayer() {
  const p = usePlayer();
  const { time, duration } = usePlayerTime();
  if (!p.current) return null;
  const pct = duration ? (time / duration) * 100 : 0;
  return (
    <div className="mini-player" role="region" aria-label="Pemutar audio">
      <div className="mini-player-progress" style={{ ['--p' as string]: `${pct}%` }}>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          onChange={(e) => p.seek(Number(e.target.value))}
          aria-label="Posisi audio"
        />
      </div>
      <div className="mini-player-body">
        <div className="mini-player-art" aria-hidden>
          <Icon name={p.playing ? 'volume' : 'headphones'} size={20} />
        </div>
        <div className="mini-player-info">
          {p.current.href ? (
            <Link href={p.current.href} className="mini-player-title">
              {p.current.title}
            </Link>
          ) : (
            <span className="mini-player-title">{p.current.title}</span>
          )}
          <span className="mini-player-sub">
            {p.current.subtitle}
            {duration ? ` · ${fmt(time)} / ${fmt(duration)}` : ''}
          </span>
        </div>
        <div className="mini-player-controls">
          <button className="icon-btn" onClick={p.prev} aria-label="Sebelumnya" disabled={p.index === 0 && time < 3}>
            <Icon name="prev" size={16} />
          </button>
          <button className="icon-btn primary" onClick={p.toggle} aria-label={p.playing ? 'Jeda' : 'Putar'}>
            {p.loading && p.playing ? <span className="spinner sm" /> : <Icon name={p.playing ? 'pause' : 'play'} size={16} />}
          </button>
          <button className="icon-btn" onClick={p.next} aria-label="Berikutnya" disabled={p.index + 1 >= p.queueLength}>
            <Icon name="next" size={16} />
          </button>
          <button className="icon-btn" onClick={p.stop} aria-label="Tutup pemutar">
            <Icon name="x" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
