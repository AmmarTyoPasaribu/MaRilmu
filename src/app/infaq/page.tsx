'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'MaRilmu-infaq';

interface InfaqEntry { date: string; amount: number; note: string; }

export default function InfaqPage() {
  const [entries, setEntries] = useState<InfaqEntry[]>([]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const addEntry = () => {
    if (!amount || Number(amount) <= 0) return;
    const entry: InfaqEntry = { date: new Date().toISOString(), amount: Number(amount), note: note || 'Infaq' };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setAmount(''); setNote('');
    setToast('✅ Infaq tercatat!'); setTimeout(() => setToast(''), 2000);
  };

  const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
  const total = entries.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = entries.filter(e => new Date(e.date).getMonth() === new Date().getMonth()).reduce((sum, e) => sum + e.amount, 0);
  const thisWeek = entries.filter(e => { const d = new Date(e.date); const now = new Date(); const diff = (now.getTime() - d.getTime()) / 86400000; return diff <= 7; }).reduce((sum, e) => sum + e.amount, 0);

  return (
    <>
      <div className="page-header"><div className="container"><h1>💰 Infaq & Sedekah Tracker</h1><p>Catat dan pantau infaq harianmu</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', borderTop: '3px solid var(--green-500)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-green)' }}>{formatRp(total)}</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', borderTop: '3px solid var(--amber)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Bulan Ini</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--amber)' }}>{formatRp(thisMonth)}</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.25rem', borderTop: '3px solid var(--sky)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Minggu Ini</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--sky)' }}>{formatRp(thisWeek)}</div>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Catat Infaq Baru</h4>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Jumlah (Rp)</span>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="10000" style={{ width: '100%', padding: '0.65rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
            </label>
            <label style={{ display: 'block', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>Keterangan</span>
              <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Contoh: Kotak amal masjid" style={{ width: '100%', padding: '0.65rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
            </label>
            <button onClick={addEntry} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>💰 Catat Infaq</button>
          </div>

          {entries.length > 0 && (
            <>
              <h4 style={{ marginBottom: '1rem' }}>Riwayat Infaq ({entries.length})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {entries.slice(0, 20).map((e, i) => (
                  <div key={i} className="card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{e.note}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(e.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-green)' }}>{formatRp(e.amount)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  );
}
