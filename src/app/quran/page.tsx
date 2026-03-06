'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllSurahs, getLastRead } from '@/lib/api';
import type { Surah } from '@/types';

export default function QuranPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastRead, setLastRead] = useState<{ surah: number; ayah: number; name: string } | null>(null);

  useEffect(() => {
    setLastRead(getLastRead());
    async function load() {
      try {
        const data = await getAllSurahs();
        setSurahs(data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const filtered = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase()) ||
      s.name.includes(search) ||
      String(s.number).includes(search)
  );

  return (
    <>
      <div className="page-header">
        <div className="container">
          <h1>📖 Al-Quran Digital</h1>
          <p>Baca Al-Quran dengan terjemahan Bahasa Indonesia</p>
        </div>
      </div>
      <div className="page-content">
        <div className="container">
          {lastRead && (
            <div className="last-read-banner">
              <div className="last-read-info">
                <div className="last-read-label">📌 Terakhir Dibaca</div>
                <div className="last-read-title">{lastRead.name} — Ayat {lastRead.ayah}</div>
              </div>
              <Link href={`/quran/${lastRead.surah}`} className="last-read-btn">Lanjutkan</Link>
            </div>
          )}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Cari surah..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {loading ? (
            <div className="surah-list">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-card" />
              ))}
            </div>
          ) : (
            <div className="surah-list">
              {filtered.map((surah) => (
                <Link key={surah.number} href={`/quran/${surah.number}`} className="surah-card">
                  <div className="surah-number">{surah.number}</div>
                  <div className="surah-info">
                    <div className="surah-name">{surah.englishName}</div>
                    <div className="surah-meta">{surah.englishNameTranslation} • {surah.numberOfAyahs} ayat • {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}</div>
                  </div>
                  <div className="surah-arabic">{surah.name}</div>
                </Link>
              ))}
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="empty-state"><div className="empty-state-icon">🔍</div><p>Surah tidak ditemukan</p></div>
          )}
        </div>
      </div>
    </>
  );
}
