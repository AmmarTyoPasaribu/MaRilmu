'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, Page } from '@/components/ui';
import { usePlayer, type Track } from '@/components/providers/Player';
import { copyText, shareText, useToast } from '@/components/providers/Toast';
import { StarNumber } from '../QuranIndex';
import { JUZ_START, QARI, SURAHS, ayahAudioUrl, fetchTafsir, stripHtml, type Ayah, type SurahDetail } from '@/lib/quran';
import { useAyahBookmarks, useLastRead, useSettings } from '@/lib/store';

const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArabicDigits = (n: number) => String(n).replace(/\d/g, (d) => AR_DIGITS[Number(d)]);
const BISMILLAH = 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ';

const juzStarts = new Map(JUZ_START.map(([s, a], i) => [`${s}:${a}`, i + 1]));

export default function SurahReader({ surah }: { surah: SurahDetail }) {
  const router = useRouter();
  const [settings, update] = useSettings();
  const player = usePlayer();
  const toast = useToast();
  const [bookmarks, setBookmarks] = useAyahBookmarks();
  const [, setLastRead] = useLastRead();
  const [showInfo, setShowInfo] = useState(false);
  const [tafsirOpen, setTafsirOpen] = useState<Record<number, boolean>>({});
  const [tafsir, setTafsir] = useState<Record<number, string> | null>(null);
  const [tafsirError, setTafsirError] = useState(false);
  const [jump, setJump] = useState('');
  const listRef = useRef<HTMLOListElement>(null);

  const playingAyah = player.current?.surah === surah.n ? player.current.ayah : undefined;
  const bookmarked = new Set(bookmarks.filter((b) => b.surah === surah.n).map((b) => b.ayah));

  const tracks = useCallback(
    (): Track[] =>
      surah.ayahs.map((a) => ({
        id: `${surah.n}:${a.n}`,
        title: `${surah.lat} · Ayat ${a.n}`,
        subtitle: QARI[settings.qari].name,
        src: ayahAudioUrl(settings.qari, surah.n, a.n),
        href: `/quran/${surah.n}#ayat-${a.n}`,
        surah: surah.n,
        ayah: a.n,
      })),
    [surah, settings.qari],
  );

  const playFrom = useCallback(
    (ayah: number) => {
      if (playingAyah === ayah) {
        player.toggle();
        return;
      }
      player.playQueue(tracks(), ayah - 1);
    },
    [player, playingAyah, tracks],
  );

  // Gulir otomatis mengikuti ayat yang sedang diputar
  useEffect(() => {
    if (!playingAyah) return;
    const el = document.getElementById(`ayat-${playingAyah}`);
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 120) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [playingAyah]);

  // Simpan "terakhir dibaca" otomatis berdasarkan ayat yang terlihat
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let scrolled = false;
    const onScroll = () => (scrolled = true);
    window.addEventListener('scroll', onScroll, { passive: true, once: true });
    const io = new IntersectionObserver(
      (entries) => {
        if (!scrolled) return;
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const ayah = Number((visible.target as HTMLElement).dataset.ayah);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setLastRead({ surah: surah.n, ayah, name: surah.lat, at: Date.now() }), 800);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );
    list.querySelectorAll('[data-ayah]').forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (timer) clearTimeout(timer);
    };
  }, [surah, setLastRead]);

  const toggleTafsir = async (ayah: number) => {
    setTafsirOpen((o) => ({ ...o, [ayah]: !o[ayah] }));
    if (!tafsir) {
      try {
        setTafsirError(false);
        setTafsir(await fetchTafsir(surah.n));
      } catch {
        setTafsirError(true);
      }
    }
  };

  const toggleBookmark = (ayah: number) => {
    const exists = bookmarked.has(ayah);
    setBookmarks((prev) =>
      exists
        ? prev.filter((b) => !(b.surah === surah.n && b.ayah === ayah))
        : [...prev, { surah: surah.n, ayah, name: surah.lat, at: Date.now() }],
    );
    toast(exists ? 'Penanda dihapus' : `Ayat ${ayah} disimpan`, exists ? 'bookmark' : 'bookmarkFill');
  };

  const share = async (a: Ayah) => {
    const text = `${a.ar}\n\n${a.tr}\n\n"${a.id}"\n\n— QS. ${surah.lat} (${surah.n}): ${a.n}`;
    const r = await shareText(`QS. ${surah.lat}: ${a.n}`, text);
    if (r === 'copied') toast('Ayat disalin');
  };

  const copy = async (a: Ayah) => {
    const ok = await copyText(`${a.ar}\n\n${a.id}\n\n— QS. ${surah.lat} (${surah.n}): ${a.n}`);
    toast(ok ? 'Ayat disalin' : 'Gagal menyalin', ok ? 'checkCircle' : 'alert');
  };

  const goToAyah = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(jump);
    if (n >= 1 && n <= surah.ayat) {
      document.getElementById(`ayat-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setJump('');
    } else toast(`Ayat 1–${surah.ayat}`, 'info');
  };

  const prev = surah.n > 1 ? SURAHS[surah.n - 2] : null;
  const next = surah.n < 114 ? SURAHS[surah.n] : null;
  const fontLevel = settings.arabicSize;
  const isPlayingSurah = player.current?.surah === surah.n;

  return (
    <Page width="narrow">
      <PageHeader
        back={{ href: '/quran', label: 'Daftar surah' }}
        arabic={surah.ar}
        title={`${surah.n}. ${surah.lat}`}
        subtitle={`${surah.arti} · ${surah.ayat} ayat · ${surah.tempat === 'Mekah' ? 'Makkiyah' : 'Madaniyah'}`}
      >
        <button className="hero-btn on" onClick={() => (isPlayingSurah ? player.toggle() : playFrom(1))}>
          <Icon name={isPlayingSurah && player.playing ? 'pause' : 'play'} size={15} />
          {isPlayingSurah && player.playing ? 'Jeda' : 'Putar surah'}
        </button>
        <button className={`hero-btn${showInfo ? ' on' : ''}`} onClick={() => setShowInfo((s) => !s)}>
          <Icon name="info" size={15} /> Tentang surah
        </button>
      </PageHeader>

      {showInfo && (
        <div className="card surah-info">
          <p>{stripHtml(surah.deskripsi)}</p>
        </div>
      )}

      <div className="reader-toolbar">
        <select
          className="select"
          aria-label="Pindah surah"
          value={surah.n}
          onChange={(e) => router.push(`/quran/${e.target.value}`)}
        >
          {SURAHS.map((s) => (
            <option key={s.n} value={s.n}>
              {s.n}. {s.lat}
            </option>
          ))}
        </select>
        <form onSubmit={goToAyah} className="reader-jump">
          <input
            className="input"
            inputMode="numeric"
            placeholder={`Ayat (1–${surah.ayat})`}
            value={jump}
            onChange={(e) => setJump(e.target.value.replace(/\D/g, ''))}
            aria-label="Lompat ke ayat"
          />
          <button className="icon-btn" aria-label="Lompat">
            <Icon name="arrowRight" size={18} />
          </button>
        </form>
        <div className="reader-toggles">
          <button className={`chip-btn${settings.showLatin ? ' on' : ''}`} onClick={() => update({ showLatin: !settings.showLatin })} aria-pressed={settings.showLatin}>
            Latin
          </button>
          <button
            className={`chip-btn${settings.showTranslation ? ' on' : ''}`}
            onClick={() => update({ showTranslation: !settings.showTranslation })}
            aria-pressed={settings.showTranslation}
          >
            Arti
          </button>
          <button className="icon-btn sm" onClick={() => update({ arabicSize: Math.max(1, fontLevel - 1) })} disabled={fontLevel <= 1} aria-label="Perkecil huruf Arab">
            <Icon name="minus" size={16} />
          </button>
          <Icon name="type" size={16} className="muted" />
          <button className="icon-btn sm" onClick={() => update({ arabicSize: Math.min(5, fontLevel + 1) })} disabled={fontLevel >= 5} aria-label="Perbesar huruf Arab">
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>

      {surah.n !== 1 && surah.n !== 9 && <p className="bismillah arabic quran-text">{BISMILLAH}</p>}

      <ol className="ayah-list" ref={listRef}>
        {surah.ayahs.map((a) => (
          <AyahItem
            key={a.n}
            surah={surah}
            ayah={a}
            juz={juzStarts.get(`${surah.n}:${a.n}`)}
            playing={playingAyah === a.n}
            isPlaying={playingAyah === a.n && player.playing}
            bookmarked={bookmarked.has(a.n)}
            showLatin={settings.showLatin}
            showTranslation={settings.showTranslation}
            tafsirOpen={!!tafsirOpen[a.n]}
            tafsirText={tafsir?.[a.n]}
            tafsirError={tafsirError}
            onPlay={playFrom}
            onBookmark={toggleBookmark}
            onTafsir={toggleTafsir}
            onShare={share}
            onCopy={copy}
            onMarkRead={(n) => {
              setLastRead({ surah: surah.n, ayah: n, name: surah.lat, at: Date.now() });
              toast(`Ditandai: ${surah.lat} ayat ${n}`, 'bookmarkFill');
            }}
          />
        ))}
      </ol>

      <nav className="surah-nav" aria-label="Surah lain">
        {prev ? (
          <Link href={`/quran/${prev.n}`} className="surah-nav-link">
            <Icon name="chevronLeft" size={18} />
            <span>
              <small>Sebelumnya</small>
              <strong>{prev.lat}</strong>
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/quran/${next.n}`} className="surah-nav-link next">
            <span>
              <small>Selanjutnya</small>
              <strong>{next.lat}</strong>
            </span>
            <Icon name="chevronRight" size={18} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </Page>
  );
}

interface AyahItemProps {
  surah: SurahDetail;
  ayah: Ayah;
  juz?: number;
  playing: boolean;
  isPlaying: boolean;
  bookmarked: boolean;
  showLatin: boolean;
  showTranslation: boolean;
  tafsirOpen: boolean;
  tafsirText?: string;
  tafsirError: boolean;
  onPlay: (n: number) => void;
  onBookmark: (n: number) => void;
  onTafsir: (n: number) => void;
  onShare: (a: Ayah) => void;
  onCopy: (a: Ayah) => void;
  onMarkRead: (n: number) => void;
}

const AyahItem = memo(function AyahItem({
  surah,
  ayah: a,
  juz,
  playing,
  isPlaying,
  bookmarked,
  showLatin,
  showTranslation,
  tafsirOpen,
  tafsirText,
  tafsirError,
  onPlay,
  onBookmark,
  onTafsir,
  onShare,
  onCopy,
  onMarkRead,
}: AyahItemProps) {
  return (
    <li id={`ayat-${a.n}`} data-ayah={a.n} className={`ayah${playing ? ' playing' : ''}`}>
      {juz && (
        <div className="juz-marker">
          <Icon name="star8" size={14} /> Juz {juz}
        </div>
      )}
      <div className="ayah-head">
        <StarNumber n={a.n} size="sm" />
        <span className="ayah-ref">
          {surah.n}:{a.n}
        </span>
        <div className="ayah-actions">
          <button className={`icon-btn sm${playing ? ' on' : ''}`} onClick={() => onPlay(a.n)} aria-label={isPlaying ? 'Jeda' : `Putar ayat ${a.n}`}>
            <Icon name={isPlaying ? 'pause' : 'play'} size={15} />
          </button>
          <button className={`icon-btn sm${tafsirOpen ? ' on' : ''}`} onClick={() => onTafsir(a.n)} aria-label="Tafsir" aria-expanded={tafsirOpen}>
            <Icon name="notebook" size={16} />
          </button>
          <button className={`icon-btn sm${bookmarked ? ' on' : ''}`} onClick={() => onBookmark(a.n)} aria-label={bookmarked ? 'Hapus penanda' : 'Simpan ayat'} aria-pressed={bookmarked}>
            <Icon name={bookmarked ? 'bookmarkFill' : 'bookmark'} size={16} />
          </button>
          <button className="icon-btn sm" onClick={() => onCopy(a)} aria-label="Salin ayat">
            <Icon name="copy" size={16} />
          </button>
          <button className="icon-btn sm hide-xs" onClick={() => onShare(a)} aria-label="Bagikan ayat">
            <Icon name="share" size={16} />
          </button>
          <button className="icon-btn sm hide-xs" onClick={() => onMarkRead(a.n)} aria-label="Tandai terakhir dibaca" title="Tandai terakhir dibaca">
            <Icon name="check" size={16} />
          </button>
        </div>
      </div>
      <p className="ayah-ar arabic quran-text" lang="ar" dir="rtl">
        {a.ar} <span className="ayah-end">{toArabicDigits(a.n)}</span>
      </p>
      {showLatin && <p className="latin">{a.tr}</p>}
      {showTranslation && (
        <p className="translation">
          <span className="ayah-tr-num">{a.n}.</span> {a.id}
        </p>
      )}
      {tafsirOpen && (
        <div className="tafsir">
          <strong>
            <Icon name="notebook" size={15} /> Tafsir Kemenag
          </strong>
          {tafsirText ? <p>{tafsirText}</p> : tafsirError ? <p className="form-error">Gagal memuat tafsir. Periksa koneksi.</p> : <span className="spinner sm" />}
        </div>
      )}
    </li>
  );
});
