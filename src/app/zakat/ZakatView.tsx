'use client';

import { useState } from 'react';
import Icon, { type IconName } from '@/components/Icon';
import { PageHeader, Page } from '@/components/ui';

type Jenis = 'penghasilan' | 'mal' | 'emas' | 'dagang' | 'fitrah';

const JENIS: { id: Jenis; label: string; icon: IconName; desc: string }[] = [
  { id: 'penghasilan', label: 'Penghasilan', icon: 'wallet', desc: 'Gaji, honor, atau pendapatan profesi bulanan' },
  { id: 'mal', label: 'Tabungan', icon: 'coins', desc: 'Tabungan, deposito & investasi yang sudah 1 tahun (haul)' },
  { id: 'emas', label: 'Emas', icon: 'gem', desc: 'Emas simpanan yang tidak dipakai sehari-hari' },
  { id: 'dagang', label: 'Dagang', icon: 'layers', desc: 'Modal usaha, stok barang, piutang lancar' },
  { id: 'fitrah', label: 'Fitrah', icon: 'wheat', desc: 'Wajib setiap jiwa menjelang Idul Fitri' },
];

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const parse = (s: string) => Number(s.replace(/\D/g, '')) || 0;

function Money({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="input-money">
        <input
          className="input"
          inputMode="numeric"
          value={value ? parse(value).toLocaleString('id-ID') : ''}
          placeholder="0"
          onChange={(e) => onChange(e.target.value.replace(/\D/g, ''))}
        />
      </span>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function Num({ label, value, onChange, suffix, hint }: { label: string; value: string; onChange: (v: string) => void; suffix: string; hint?: string }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <span className="input-suffix">
        <input className="input" inputMode="decimal" value={value} placeholder="0" onChange={(e) => onChange(e.target.value.replace(/[^\d.,]/g, ''))} />
        <span>{suffix}</span>
      </span>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export default function ZakatView() {
  const [jenis, setJenis] = useState<Jenis>('penghasilan');
  const [gold, setGold] = useState('2000000');
  const [v, setV] = useState<Record<string, string>>({ jiwa: '1', beras: '15000', kg: '2.5' });
  const set = (k: string) => (val: string) => setV((p) => ({ ...p, [k]: val }));
  const n = (k: string) => parse(v[k] ?? '');
  const f = (k: string) => Number((v[k] ?? '').replace(',', '.')) || 0;

  const goldPrice = parse(gold);
  const nisabTahun = 85 * goldPrice;

  let base = 0;
  let nisab = nisabTahun;
  let wajib = false;
  let zakat = 0;
  let note = '';

  if (jenis === 'penghasilan') {
    base = n('gaji') + n('lain') - n('pokok') - n('cicilan');
    nisab = nisabTahun / 12;
    wajib = base >= nisab && base > 0;
    zakat = wajib ? base * 0.025 : 0;
    note = 'Nisab bulanan = nisab 85 gram emas ÷ 12 (pendapat BAZNAS & fatwa MUI).';
  } else if (jenis === 'mal') {
    base = n('tabungan') + n('investasi') + n('piutang') - n('hutang');
    wajib = base >= nisab && base > 0;
    zakat = wajib ? base * 0.025 : 0;
    note = 'Harta harus sudah dimiliki penuh selama satu tahun Hijriah (haul).';
  } else if (jenis === 'emas') {
    const gram = f('gram');
    base = gram * goldPrice;
    wajib = gram >= 85;
    zakat = wajib ? base * 0.025 : 0;
    note = 'Nisab emas 85 gram dan telah tersimpan selama satu tahun. Perhiasan yang dipakai wajar diperselisihkan ulama.';
  } else if (jenis === 'dagang') {
    base = n('modal') + n('stok') + n('kas') + n('piutangDagang') - n('hutangDagang');
    wajib = base >= nisab && base > 0;
    zakat = wajib ? base * 0.025 : 0;
    note = 'Dihitung dari aset lancar usaha setelah satu tahun berjalan; aset tetap (gedung, kendaraan operasional) tidak dihitung.';
  } else {
    const jiwa = Math.max(0, Math.floor(f('jiwa')));
    zakat = jiwa * f('kg') * n('beras');
    wajib = jiwa > 0;
    nisab = 0;
    note = `${jiwa} jiwa × ${f('kg')} kg × ${rp(n('beras'))}. Ikuti ketetapan nominal BAZNAS/LAZ setempat bila membayar dengan uang.`;
  }

  const current = JENIS.find((j) => j.id === jenis)!;

  return (
    <Page width="narrow">
      <PageHeader icon="calculator" title="Kalkulator Zakat" subtitle="Hitung kewajiban zakat dengan mudah — hasil langsung tampil" />

      <div className="zakat-tabs" role="tablist" aria-label="Jenis zakat">
        {JENIS.map((j) => (
          <button key={j.id} role="tab" aria-selected={jenis === j.id} className={`zakat-tab${jenis === j.id ? ' active' : ''}`} onClick={() => setJenis(j.id)}>
            <Icon name={j.icon} size={20} />
            <span>{j.label}</span>
          </button>
        ))}
      </div>

      <div className="card zakat-form">
        <p className="muted">{current.desc}</p>

        {jenis === 'penghasilan' && (
          <>
            <Money label="Penghasilan per bulan" value={v.gaji ?? ''} onChange={set('gaji')} />
            <Money label="Pendapatan lain per bulan (opsional)" value={v.lain ?? ''} onChange={set('lain')} hint="Bonus, honor, sewa, dll." />
            <Money label="Kebutuhan pokok per bulan (opsional)" value={v.pokok ?? ''} onChange={set('pokok')} hint="Kosongkan bila ingin menghitung dari penghasilan bruto." />
            <Money label="Cicilan hutang per bulan (opsional)" value={v.cicilan ?? ''} onChange={set('cicilan')} />
          </>
        )}
        {jenis === 'mal' && (
          <>
            <Money label="Tabungan & deposito" value={v.tabungan ?? ''} onChange={set('tabungan')} />
            <Money label="Investasi (saham, reksadana, dll.)" value={v.investasi ?? ''} onChange={set('investasi')} />
            <Money label="Piutang yang bisa ditagih" value={v.piutang ?? ''} onChange={set('piutang')} />
            <Money label="Hutang jatuh tempo" value={v.hutang ?? ''} onChange={set('hutang')} />
          </>
        )}
        {jenis === 'emas' && <Num label="Berat emas simpanan" value={v.gram ?? ''} onChange={set('gram')} suffix="gram" />}
        {jenis === 'dagang' && (
          <>
            <Money label="Modal / kas usaha" value={v.modal ?? ''} onChange={set('modal')} />
            <Money label="Nilai stok barang" value={v.stok ?? ''} onChange={set('stok')} />
            <Money label="Keuntungan / saldo kas" value={v.kas ?? ''} onChange={set('kas')} />
            <Money label="Piutang dagang lancar" value={v.piutangDagang ?? ''} onChange={set('piutangDagang')} />
            <Money label="Hutang dagang jatuh tempo" value={v.hutangDagang ?? ''} onChange={set('hutangDagang')} />
          </>
        )}
        {jenis === 'fitrah' && (
          <>
            <Num label="Jumlah jiwa" value={v.jiwa ?? ''} onChange={set('jiwa')} suffix="orang" />
            <Num label="Takaran per jiwa" value={v.kg ?? ''} onChange={set('kg')} suffix="kg beras" hint="Umumnya 2,5 kg (≈ 3,5 liter) beras / makanan pokok." />
            <Money label="Harga beras per kg" value={v.beras ?? ''} onChange={set('beras')} />
          </>
        )}

        {jenis !== 'fitrah' && (
          <Money label="Harga emas per gram (hari ini)" value={gold} onChange={setGold} hint="Perbarui sesuai harga emas terkini untuk hasil akurat." />
        )}
      </div>

      <section className={`zakat-result${wajib ? ' wajib' : ''}`} aria-live="polite">
        <div className="page-header-pattern" aria-hidden />
        {jenis !== 'fitrah' && (
          <div className="zakat-rows">
            <div>
              <span>{jenis === 'penghasilan' ? 'Penghasilan bersih' : jenis === 'emas' ? 'Nilai emas' : 'Total harta'}</span>
              <b>{rp(base)}</b>
            </div>
            <div>
              <span>Nisab {jenis === 'penghasilan' ? '(per bulan)' : '(85 gr emas)'}</span>
              <b>{rp(nisab)}</b>
            </div>
          </div>
        )}
        <span className="zakat-status">
          <Icon name={wajib ? 'checkCircle' : 'info'} size={18} />
          {jenis === 'fitrah' ? 'Total zakat fitrah' : wajib ? 'Wajib zakat (2,5%)' : base > 0 ? 'Belum mencapai nisab — dianjurkan bersedekah' : 'Isi data untuk menghitung'}
        </span>
        <span className="zakat-amount tabular">{rp(zakat)}</span>
        {jenis === 'fitrah' && n('beras') > 0 && f('jiwa') > 0 && (
          <span className="zakat-sub">
            atau {(f('jiwa') * f('kg')).toLocaleString('id-ID')} kg beras
          </span>
        )}
      </section>

      <p className="info-box mt-2">
        <Icon name="info" size={16} />
        <span>{note} Hasil ini bersifat panduan; konsultasikan dengan amil zakat resmi (BAZNAS/LAZ) untuk kasus khusus.</span>
      </p>
    </Page>
  );
}
