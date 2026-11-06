'use client';

import { useMemo, useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, SearchField } from '@/components/ui';
import { usePlayer, type Track } from '@/components/providers/Player';
import { QARI, SURAHS, surahAudioUrl } from '@/lib/quran';
import { useSettings, type QariId } from '@/lib/store';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

export default function MurottalView() {
  const [settings, update] = useSettings();
  const player = usePlayer();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const nq = norm(q);
    return nq ? SURAHS.filter((s) => norm(s.lat).includes(nq) || norm(s.arti).includes(nq) || String(s.n) === q.trim()) : SURAHS;
  }, [q]);

  const buildQueue = (qari: QariId): Track[] =>
    SURAHS.map((s) => ({
      id: `full:${s.n}`,
      title: `${s.n}. ${s.lat}`,
      subtitle: QARI[qari].name,
      src: surahAudioUrl(qari, s.n),
      href: `/quran/${s.n}`,
    }));

  const currentSurah = player.current?.id.startsWith('full:') ? Number(player.current.id.slice(5)) : null;

  const play = (n: number) => {
    if (currentSurah === n) {
      player.toggle();
      return;
    }
    player.playQueue(buildQueue(settings.qari), n - 1);
  };

  const changeQari = (id: QariId) => {
    update({ qari: id });
    if (currentSurah) player.playQueue(buildQueue(id), currentSurah - 1);
  };

  return (
    <>
      <h2 className="sub-heading">Pilih qari</h2>
      <div className="qari-grid">
        {(Object.keys(QARI) as QariId[]).map((id) => (
          <button key={id} className={`qari-card${settings.qari === id ? ' active' : ''}`} onClick={() => changeQari(id)} aria-pressed={settings.qari === id}>
            <span className="qari-avatar" aria-hidden>
              {QARI[id].name
                .split(' ')
                .filter((w) => /^[A-Z]/.test(w))
                .slice(0, 2)
                .map((w) => w[0])
                .join('')}
            </span>
            <span>{QARI[id].name}</span>
            {settings.qari === id && <Icon name="checkCircle" size={18} />}
          </button>
        ))}
      </div>

      <h2 className="sub-heading mt-3">Daftar surah</h2>
      <SearchField value={q} onChange={setQ} placeholder="Cari surah…" />
      {filtered.length === 0 ? (
        <EmptyState title="Surah tidak ditemukan" />
      ) : (
        <ul className="murottal-list">
          {filtered.map((s) => {
            const active = currentSurah === s.n;
            const playing = active && player.playing;
            return (
              <li key={s.n}>
                <button className={`murottal-item${active ? ' active' : ''}`} onClick={() => play(s.n)} aria-label={`${playing ? 'Jeda' : 'Putar'} ${s.lat}`}>
                  <span className="murottal-play">
                    {active && player.loading && player.playing ? <span className="spinner sm" /> : <Icon name={playing ? 'pause' : 'play'} size={16} />}
                  </span>
                  <span className="murottal-info">
                    <strong>
                      {s.n}. {s.lat}
                    </strong>
                    <small>
                      {s.arti} · {s.ayat} ayat
                    </small>
                  </span>
                  {playing && (
                    <span className="eq" aria-hidden>
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  <span className="murottal-ar arabic">{s.ar}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
