'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, Page, Segmented } from '@/components/ui';
import { copyText, useToast } from '@/components/providers/Toast';
import { useNow, useSettings } from '@/lib/store';
import dzikirData from '@/data/dzikir.json';
import snippets from '@/data/quran-snippets.json';

type Waktu = 'pagi' | 'petang' | 'sholat';

interface RawItem {
  id: string;
  title: string;
  ref?: keyof typeof snippets;
  count: number;
  source: string;
  virtue?: string;
  only?: 'pagi' | 'petang';
  arabic?: string;
  arabicSore?: string;
  latin?: string;
  latinSore?: string;
  translation?: string;
  translationSore?: string;
}

interface Item {
  id: string;
  title: string;
  count: number;
  source: string;
  virtue?: string;
  arabic: string;
  latin: string;
  translation: string;
  quran: boolean;
}

function resolve(raw: RawItem, waktu: Waktu): Item {
  const petang = waktu === 'petang';
  if (raw.ref) {
    const s = snippets[raw.ref];
    return { ...raw, arabic: s.arabic, latin: s.latin, translation: s.translation, quran: true };
  }
  return {
    ...raw,
    arabic: (petang && raw.arabicSore) || raw.arabic || '',
    latin: (petang && raw.latinSore) || raw.latin || '',
    translation: (petang && raw.translationSore) || raw.translation || '',
    quran: false,
  };
}

function itemsFor(waktu: Waktu): Item[] {
  const list = (waktu === 'sholat' ? dzikirData.sholat : dzikirData.pagiPetang) as RawItem[];
  return list.filter((r) => !r.only || r.only === waktu).map((r) => resolve(r, waktu));
}

export default function DzikirView() {
  const now = useNow();
  const [chosen, setChosen] = useState<Waktu | null>(null);
  const hour = now ? new Date(now).getHours() : 6;
  const auto: Waktu = hour >= 15 || hour < 3 ? 'petang' : 'pagi';
  const waktu = chosen ?? auto;
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [settings] = useSettings();
  const toast = useToast();

  const items = itemsFor(waktu);
  const key = (id: string) => `${waktu}:${id}`;
  const done = items.filter((i) => (counts[key(i.id)] ?? 0) >= i.count).length;

  const tap = (i: Item) => {
    const k = key(i.id);
    const c = counts[k] ?? 0;
    if (c >= i.count) return;
    setCounts((prev) => ({ ...prev, [k]: c + 1 }));
    navigator.vibrate?.(c + 1 === i.count ? [30, 60, 30] : 15);
    if (c + 1 === i.count) {
      const nextEl = document.getElementById(`dz-${items[items.indexOf(i) + 1]?.id}`);
      if (nextEl) setTimeout(() => nextEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
    }
  };

  const reset = () => setCounts((prev) => Object.fromEntries(Object.entries(prev).filter(([k]) => !k.startsWith(`${waktu}:`))));

  return (
    <Page width="narrow">
      <PageHeader
        icon={waktu === 'petang' ? 'sunset' : waktu === 'pagi' ? 'sunrise' : 'mosque'}
        title={waktu === 'sholat' ? 'Dzikir Setelah Sholat' : `Dzikir ${waktu === 'pagi' ? 'Pagi' : 'Petang'}`}
        subtitle={
          waktu === 'pagi'
            ? 'Dibaca setelah Subuh hingga terbit matahari'
            : waktu === 'petang'
              ? 'Dibaca setelah Ashar hingga terbenam matahari'
              : 'Dibaca setelah salam sholat fardhu'
        }
      />

      <div className="segmented-wrap">
        <Segmented<Waktu>
          label="Waktu dzikir"
          value={waktu}
          onChange={setChosen}
          options={[
            { value: 'pagi', label: 'Pagi', icon: 'sunrise' },
            { value: 'petang', label: 'Petang', icon: 'sunset' },
            { value: 'sholat', label: 'Ba’da Sholat', icon: 'mosque' },
          ]}
        />
      </div>

      <div className="dzikir-progress card">
        <div>
          <strong>
            {done}/{items.length} bacaan selesai
          </strong>
          <div className="progress mt-1">
            <span style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={reset} disabled={done === 0 && !Object.keys(counts).some((k) => k.startsWith(waktu))}>
          <Icon name="refresh" size={16} /> Ulangi
        </button>
      </div>

      <ol className="dzikir-list">
        {items.map((i, idx) => {
          const c = counts[key(i.id)] ?? 0;
          const complete = c >= i.count;
          return (
            <li key={i.id} id={`dz-${i.id}`} className={`dzikir-item${complete ? ' complete' : ''}`}>
              <header className="dzikir-head">
                <span className="dzikir-no">{idx + 1}</span>
                <h3>{i.title}</h3>
                <span className="badge gold">{i.count}×</span>
              </header>
              <p className={`arabic arabic-lg${i.quran ? ' quran-text' : ''}`} lang="ar" dir="rtl">
                {i.arabic}
              </p>
              {settings.showLatin && <p className="latin">{i.latin}</p>}
              {settings.showTranslation && <p className="translation">{i.translation}</p>}
              {i.virtue && (
                <p className="dzikir-virtue">
                  <Icon name="sparkle" size={15} /> {i.virtue}
                </p>
              )}
              <footer className="dzikir-foot">
                <span className="source">{i.source}</span>
                <div className="row" style={{ gap: 6 }}>
                  <button
                    className="icon-btn sm"
                    aria-label="Salin"
                    onClick={async () => {
                      const ok = await copyText(`${i.title}\n\n${i.arabic}\n\n${i.latin}\n\n${i.translation}\n\n(${i.source})`);
                      toast(ok ? 'Disalin' : 'Gagal menyalin', ok ? 'checkCircle' : 'alert');
                    }}
                  >
                    <Icon name="copy" size={15} />
                  </button>
                  <button className={`counter-btn${complete ? ' done' : ''}`} onClick={() => tap(i)} aria-label={`Hitung ${i.title}: ${c} dari ${i.count}`}>
                    {complete ? <Icon name="check" size={18} /> : <span className="tabular">{c}</span>}
                    <small>/{i.count}</small>
                  </button>
                </div>
              </footer>
            </li>
          );
        })}
      </ol>

      {done === items.length && (
        <div className="info-box emerald mt-3">
          <Icon name="checkCircle" size={18} />
          <span>Alhamdulillah, dzikir {waktu === 'sholat' ? 'setelah sholat' : waktu} sudah selesai. Semoga Allah menerima amal kita.</span>
        </div>
      )}
    </Page>
  );
}
