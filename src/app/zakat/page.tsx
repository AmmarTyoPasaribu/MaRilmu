'use client';

import { useState } from 'react';

type ZakatType = 'penghasilan' | 'mal' | 'fitrah';

export default function ZakatPage() {
  const [type, setType] = useState<ZakatType>('penghasilan');
  const [income, setIncome] = useState('');
  const [savings, setSavings] = useState('');
  const [goldPrice, setGoldPrice] = useState('1200000');
  const [members, setMembers] = useState('1');
  const [ricePrice, setRicePrice] = useState('15000');
  const [result, setResult] = useState<{ amount: number; nisab: number; wajib: boolean } | null>(null);

  const calculate = () => {
    const nisab85gram = Number(goldPrice) * 85;
    if (type === 'penghasilan') {
      const yearlyIncome = Number(income) * 12;
      const wajib = yearlyIncome >= nisab85gram;
      setResult({ amount: wajib ? yearlyIncome * 0.025 : 0, nisab: nisab85gram, wajib });
    } else if (type === 'mal') {
      const total = Number(savings);
      const wajib = total >= nisab85gram;
      setResult({ amount: wajib ? total * 0.025 : 0, nisab: nisab85gram, wajib });
    } else {
      const amount = Number(members) * 3.5 * Number(ricePrice);
      setResult({ amount, nisab: 0, wajib: true });
    }
  };

  const formatRp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

  return (
    <>
      <div className="page-header">
        <div className="container"><h1>🧮 Kalkulator Zakat</h1><p>Hitung zakat penghasilan, mal, dan fitrah</p></div>
      </div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="filter-bar">
            {(['penghasilan', 'mal', 'fitrah'] as ZakatType[]).map((t) => (
              <button key={t} className={`filter-btn ${type === t ? 'active' : ''}`} onClick={() => { setType(t); setResult(null); }}>
                {t === 'penghasilan' ? '💰 Penghasilan' : t === 'mal' ? '🏦 Mal' : '🌾 Fitrah'}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            {type === 'penghasilan' && (
              <>
                <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Penghasilan per Bulan (Rp)</span>
                  <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="5000000" style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
                </label>
                <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Harga Emas per Gram (Rp)</span>
                  <input type="number" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
                </label>
              </>
            )}
            {type === 'mal' && (
              <>
                <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Total Harta / Tabungan (Rp)</span>
                  <input type="number" value={savings} onChange={(e) => setSavings(e.target.value)} placeholder="100000000" style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
                </label>
                <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Harga Emas per Gram (Rp)</span>
                  <input type="number" value={goldPrice} onChange={(e) => setGoldPrice(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
                </label>
              </>
            )}
            {type === 'fitrah' && (
              <>
                <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Jumlah Anggota Keluarga</span>
                  <input type="number" value={members} onChange={(e) => setMembers(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
                </label>
                <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>Harga Beras per Kg (Rp)</span>
                  <input type="number" value={ricePrice} onChange={(e) => setRicePrice(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid var(--border-light)', borderRadius: 'var(--radius-sm)', fontSize: '1rem', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }} />
                </label>
              </>
            )}
            <button onClick={calculate} style={{ width: '100%', padding: '0.85rem', background: 'var(--bg-accent)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
              Hitung Zakat
            </button>
          </div>

          {result && (
            <div className="card" style={{ padding: '2rem', marginTop: '1.5rem', textAlign: 'center' }}>
              {type !== 'fitrah' && (
                <>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Nisab (85 gram emas): <strong>{formatRp(result.nisab)}</strong></p>
                  <p style={{ color: result.wajib ? 'var(--text-green)' : 'var(--amber)', fontWeight: 600, marginBottom: '1rem' }}>
                    {result.wajib ? '✅ Wajib Zakat' : '⚠️ Belum mencapai nisab'}
                  </p>
                </>
              )}
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Jumlah Zakat yang Harus Dikeluarkan:</p>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, background: 'var(--bg-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {formatRp(result.amount)}
              </p>
              {type === 'fitrah' && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>({members} orang × 3.5 kg beras)</p>}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
