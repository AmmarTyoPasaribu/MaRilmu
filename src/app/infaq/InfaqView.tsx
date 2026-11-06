'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { EmptyState, PageHeader, Page, SectionTitle } from '@/components/ui';
import { useToast } from '@/components/providers/Toast';
import { useNow, useStored } from '@/lib/store';
import { GREGORIAN_MONTHS } from '@/lib/hijri';

interface Entry {
  id?: string;
  date: string;
  amount: number;
  note: string;
  category?: string;
}

const CATEGORIES = ['Masjid', 'Fakir miskin', 'Anak yatim', 'Keluarga', 'Pendidikan', 'Bencana', 'Lainnya'];
const EMPTY: Entry[] = [];
const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');

export default function InfaqView() {
  const now = useNow();
  const ready = now > 0;
  const toast = useToast();
  const [entries, setEntries] = useStored<Entry[]>('MaRilmu-infaq', EMPTY);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [showAll, setShowAll] = useState(false);

  const nowDate = new Date(now || 0);
  const sameMonth = (d: Date, ref: Date) => d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear();
  const total = entries.reduce((s, e) => s + e.amount, 0);
  const thisMonth = entries.filter((e) => sameMonth(new Date(e.date), nowDate)).reduce((s, e) => s + e.amount, 0);
  const thisWeek = entries.filter((e) => now - new Date(e.date).getTime() <= 7 * 864e5).reduce((s, e) => s + e.amount, 0);

  const months = Array.from({ length: 6 }, (_, i) => {
    const ref = new Date(nowDate.getFullYear(), nowDate.getMonth() - (5 - i), 1);
    return { ref, sum: entries.filter((e) => sameMonth(new Date(e.date), ref)).reduce((s, e) => s + e.amount, 0) };
  });
  const maxMonth = Math.max(1, ...months.map((m) => m.sum));

  const byCat = CATEGORIES.map((c) => ({
    c,
    sum: entries.filter((e) => sameMonth(new Date(e.date), nowDate) && (e.category ?? 'Lainnya') === c).reduce((s, e) => s + e.amount, 0),
  })).filter((x) => x.sum > 0);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value) {
      toast('Masukkan jumlah sedekah', 'alert');
      return;
    }
    const entry: Entry = { id: `${Date.now()}`, date: new Date().toISOString(), amount: value, note: note.trim() || category, category };
    setEntries((prev) => [entry, ...prev]);
    setAmount('');
    setNote('');
    toast('Sedekah tercatat. Semoga berkah!', 'heartFill');
  };

  const remove = (idx: number) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    toast('Catatan dihapus', 'trash');
  };

  const visible = showAll ? entries : entries.slice(0, 10);

  return (
    <Page width="narrow">
      <PageHeader
        icon="heartHand"
        title="Catatan Sedekah"
        subtitle="“Sedekah tidak akan mengurangi harta.” — HR. Muslim"
      />

      <div className="stats">
        <div className="stat stat-emerald">
          <span className="stat-value small">{ready ? rp(thisMonth) : '—'}</span>
          <span className="stat-label">Bulan ini</span>
        </div>
        <div className="stat stat-gold">
          <span className="stat-value small">{ready ? rp(thisWeek) : '—'}</span>
          <span className="stat-label">7 hari</span>
        </div>
        <div className="stat stat-sky">
          <span className="stat-value small">{ready ? rp(total) : '—'}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <form className="card stack" onSubmit={add}>
        <h2 className="card-title">
          <Icon name="plus" size={18} /> Catat sedekah
        </h2>
        <label className="field">
          <span className="field-label">Jumlah</span>
          <span className="input-money">
            <input className="input" inputMode="numeric" placeholder="0" value={amount ? Number(amount).toLocaleString('id-ID') : ''} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} />
          </span>
        </label>
        <div className="field">
          <span className="field-label">Kategori</span>
          <div className="chips" style={{ marginBottom: 0 }}>
            {CATEGORIES.map((c) => (
              <button type="button" key={c} className={`chip-btn${category === c ? ' on' : ''}`} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <label className="field">
          <span className="field-label">Keterangan (opsional)</span>
          <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Mis. kotak amal masjid Al-Ikhlas" maxLength={80} />
        </label>
        <button className="btn btn-primary btn-block">
          <Icon name="heartHand" size={18} /> Simpan catatan
        </button>
      </form>

      {ready && entries.length > 0 && (
        <>
          <SectionTitle>Rekap 6 bulan</SectionTitle>
          <div className="card bars">
            {months.map((m) => (
              <div key={m.ref.getTime()} className={`bar${sameMonth(m.ref, nowDate) ? ' today' : ''}`} title={`${GREGORIAN_MONTHS[m.ref.getMonth()]}: ${rp(m.sum)}`}>
                <span className="bar-value">{m.sum ? `${Math.round(m.sum / 1000).toLocaleString('id-ID')}rb` : ''}</span>
                <span className="bar-track">
                  <span style={{ height: `${Math.max((m.sum / maxMonth) * 100, 3)}%` }} />
                </span>
                <span className="bar-label">{GREGORIAN_MONTHS[m.ref.getMonth()].slice(0, 3)}</span>
              </div>
            ))}
          </div>
          {byCat.length > 0 && (
            <div className="cat-split mt-2">
              {byCat.map((x) => (
                <span key={x.c} className="badge gold">
                  {x.c}: {rp(x.sum)}
                </span>
              ))}
            </div>
          )}
        </>
      )}

      <SectionTitle>Riwayat</SectionTitle>
      {!ready || entries.length === 0 ? (
        <EmptyState icon="heartHand" title="Belum ada catatan">
          <p>Mulai catat sedekah pertamamu hari ini.</p>
        </EmptyState>
      ) : (
        <>
          <ul className="ledger">
            {visible.map((e, i) => (
              <li key={e.id ?? `${e.date}-${i}`}>
                <span className="ledger-icon">
                  <Icon name="heartHand" size={18} />
                </span>
                <span className="ledger-text">
                  <strong>{e.note}</strong>
                  <small>
                    {e.category ?? 'Lainnya'} · {new Date(e.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </small>
                </span>
                <b className="ledger-amount">{rp(e.amount)}</b>
                <button className="icon-btn sm" onClick={() => remove(i)} aria-label="Hapus catatan">
                  <Icon name="trash" size={15} />
                </button>
              </li>
            ))}
          </ul>
          {entries.length > 10 && (
            <div className="center mt-2">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAll((s) => !s)}>
                {showAll ? 'Tampilkan lebih sedikit' : `Lihat semua (${entries.length})`}
              </button>
            </div>
          )}
        </>
      )}
    </Page>
  );
}
