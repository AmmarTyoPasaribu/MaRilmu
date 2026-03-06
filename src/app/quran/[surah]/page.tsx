'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSurahDetail, setLastRead, shareContent } from '@/lib/api';
import type { SurahDetailData } from '@/types';

export default function SurahDetailPage() {
  const params = useParams();
  const surahNumber = params.surah as string;
  const [data, setData] = useState<SurahDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [showLatin, setShowLatin] = useState(true);
  const [toast, setToast] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const result = await getSurahDetail(surahNumber);
        setData(result);
        if (result.arabic) {
          setLastRead(Number(surahNumber), 1, result.arabic.englishName);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    load();
  }, [surahNumber]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const playAudio = (audioUrl: string | undefined, ayahNum: number) => {
    if (!audioUrl) return;
    if (audioRef.current) { audioRef.current.pause(); }
    if (playing && currentAyah === ayahNum) {
      setPlaying(false);
      setCurrentAyah(null);
      return;
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    setCurrentAyah(ayahNum);
    setPlaying(true);
    audio.play();
    audio.onended = () => { setPlaying(false); setCurrentAyah(null); };
  };

  const handleShare = async (arabicText: string, latinText: string, translation: string, ayahNum: number) => {
    const text = `${arabicText}\n\n${latinText}\n\n${translation}\n\n— ${data?.arabic.englishName} : ${ayahNum}`;
    try {
      await shareContent('NurIlmu — Ayat Al-Quran', text);
      showToast('✅ Berhasil disalin!');
    } catch { showToast('❌ Gagal menyalin'); }
  };

  if (loading) {
    return (
      <>
        <div className="page-header">
          <div className="container"><h1>Memuat Surah...</h1></div>
        </div>
        <div className="page-content">
          <div className="container">
            <div className="ayat-container">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="ayat-item">
                  <div className="skeleton" style={{ height: '40px', marginBottom: '12px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '80%', marginBottom: '8px' }} />
                  <div className="skeleton" style={{ height: '16px', width: '60%' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <div className="empty-state" style={{ minHeight: '60vh' }}>
        <div className="empty-state-icon">❌</div><p>Surah tidak ditemukan</p>
      </div>
    );
  }

  const { arabic, translation, latin } = data;

  return (
    <>
      <div className="page-header">
        <div className="container">
          <Link href="/quran" className="back-btn">← Kembali ke Daftar Surah</Link>
          <h1>{arabic.englishName}</h1>
          <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.75rem', color: 'var(--text-green)', margin: '0.5rem 0' }}>
            {arabic.name}
          </p>
          <p>{arabic.englishNameTranslation} • {arabic.numberOfAyahs} Ayat • {arabic.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}</p>
        </div>
      </div>

      <div className="page-content">
        <div className="container">
          {/* Latin toggle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            <button
              className={`filter-btn ${showLatin ? 'active' : ''}`}
              onClick={() => setShowLatin(!showLatin)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              🔤 {showLatin ? 'Sembunyikan' : 'Tampilkan'} Transliterasi Latin
            </button>
          </div>

          <div className="ayat-container">
            {surahNumber !== '1' && surahNumber !== '9' && (
              <div style={{ textAlign: 'center', padding: '2rem 0', marginBottom: '1rem' }}>
                <p style={{ fontFamily: 'var(--font-arabic)', fontSize: '2rem', color: 'var(--gold)' }}>
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                {showLatin && (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                    Bismillahir rahmanir rahim
                  </p>
                )}
              </div>
            )}

            {arabic.ayahs.map((ayah, index) => (
              <div key={ayah.number} className="ayat-item">
                {/* Arabic text */}
                <div className="ayat-arabic">
                  {ayah.text} <span className="ayat-number">{ayah.numberInSurah}</span>
                </div>
                {/* Latin transliteration */}
                {showLatin && latin?.ayahs?.[index] && (
                  <div className="ayat-latin">
                    {latin.ayahs[index].text}
                  </div>
                )}
                {/* Indonesian translation */}
                <div className="ayat-translation">
                  {translation.ayahs[index]?.text}
                </div>
                {/* Action buttons */}
                <div className="ayat-actions">
                  {ayah.audio && (
                    <button
                      className="ayat-action-btn"
                      onClick={() => playAudio(ayah.audio, ayah.numberInSurah)}
                    >
                      {playing && currentAyah === ayah.numberInSurah ? '⏹️ Stop' : '▶️ Audio'}
                    </button>
                  )}
                  <button
                    className="ayat-action-btn"
                    onClick={() => handleShare(ayah.text, latin?.ayahs?.[index]?.text || '', translation.ayahs[index]?.text || '', ayah.numberInSurah)}
                  >
                    📋 Salin
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', gap: '1rem' }}>
            {Number(surahNumber) > 1 && (
              <Link href={`/quran/${Number(surahNumber) - 1}`} className="back-btn">← Sebelumnya</Link>
            )}
            <div style={{ flex: 1 }} />
            {Number(surahNumber) < 114 && (
              <Link href={`/quran/${Number(surahNumber) + 1}`} className="back-btn">Selanjutnya →</Link>
            )}
          </div>
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
