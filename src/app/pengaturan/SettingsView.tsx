'use client';

import { useRef } from 'react';
import Icon from '@/components/Icon';
import LocationBar from '@/components/LocationBar';
import { PageHeader, Page, Segmented } from '@/components/ui';
import { useToast } from '@/components/providers/Toast';
import { useNow, useSettings, type QariId, type ThemeMode } from '@/lib/store';
import { METHODS, type MethodId } from '@/lib/prayer';
import { QARI } from '@/lib/quran';
import { formatHijri, toHijri } from '@/lib/hijri';

const DATA_PREFIXES = ['marilmu:', 'MaRilmu-'];

function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}

export default function SettingsView() {
  const [s, update] = useSettings();
  const now = useNow();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const out: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (DATA_PREFIXES.some((p) => k.startsWith(p))) {
        try {
          out[k] = JSON.parse(localStorage.getItem(k)!);
        } catch {
          out[k] = localStorage.getItem(k);
        }
      }
    }
    const blob = new Blob([JSON.stringify({ app: 'MaRilmu', version: 1, exportedAt: new Date().toISOString(), data: out }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `marilmu-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Cadangan data diunduh', 'download');
  };

  const importData = async (file: File) => {
    try {
      const json = JSON.parse(await file.text());
      if (json.app !== 'MaRilmu' || typeof json.data !== 'object') throw new Error('format');
      for (const [k, val] of Object.entries(json.data as Record<string, unknown>)) {
        if (DATA_PREFIXES.some((p) => k.startsWith(p))) localStorage.setItem(k, typeof val === 'string' ? val : JSON.stringify(val));
      }
      toast('Data berhasil dipulihkan', 'checkCircle');
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast('File cadangan tidak valid', 'alert');
    }
  };

  const resetAll = () => {
    if (!window.confirm('Hapus semua data MaRilmu di perangkat ini (jurnal, hafalan, sedekah, penanda, pengaturan)? Tindakan ini tidak bisa dibatalkan.')) return;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (DATA_PREFIXES.some((p) => k.startsWith(p))) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    toast('Semua data dihapus', 'trash');
    setTimeout(() => window.location.reload(), 600);
  };

  const hijriPreview = now ? formatHijri(toHijri(new Date(now), s.hijriOffset)) : '';

  return (
    <Page width="narrow">
      <PageHeader icon="settings" title="Pengaturan" subtitle="Sesuaikan MaRilmu dengan kebutuhanmu">
        <LocationBar />
      </PageHeader>

      <section className="card settings-section">
        <h2 className="card-title">
          <Icon name="eye" size={18} /> Tampilan
        </h2>
        <div className="setting">
          <span className="setting-label">Tema</span>
          <Segmented<ThemeMode>
            label="Tema"
            value={s.theme}
            onChange={(theme) => update({ theme })}
            options={[
              { value: 'system', label: 'Otomatis', icon: 'monitor' },
              { value: 'light', label: 'Terang', icon: 'sun' },
              { value: 'dark', label: 'Gelap', icon: 'moon' },
            ]}
          />
        </div>
        <div className="setting">
          <span className="setting-label">Ukuran huruf Arab</span>
          <input type="range" min={1} max={5} step={1} value={s.arabicSize} onChange={(e) => update({ arabicSize: Number(e.target.value) })} className="range" aria-label="Ukuran huruf Arab" />
          <p className="arabic arabic-lg quran-text settings-preview" dir="rtl" lang="ar">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>
        </div>
        <div className="switch-row">
          <span className="switch-row-text">
            <strong>Tampilkan transliterasi latin</strong>
            <small>Pada Al-Quran, doa dan dzikir</small>
          </span>
          <Switch checked={s.showLatin} onChange={(v) => update({ showLatin: v })} label="Tampilkan latin" />
        </div>
        <div className="switch-row">
          <span className="switch-row-text">
            <strong>Tampilkan terjemahan</strong>
            <small>Terjemahan Bahasa Indonesia (Kemenag RI)</small>
          </span>
          <Switch checked={s.showTranslation} onChange={(v) => update({ showTranslation: v })} label="Tampilkan terjemahan" />
        </div>
      </section>

      <section className="card settings-section">
        <h2 className="card-title">
          <Icon name="clock" size={18} /> Jadwal sholat
        </h2>
        <label className="field">
          <span className="field-label">Metode perhitungan</span>
          <select className="select" value={s.method} onChange={(e) => update({ method: e.target.value as MethodId })}>
            {Object.values(METHODS).map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} — Subuh {m.fajr}°, Isya {m.ishaMinutes ? `${m.isha} menit` : `${m.isha}°`}
              </option>
            ))}
          </select>
        </label>
        <div className="setting">
          <span className="setting-label">Waktu Ashar</span>
          <Segmented
            label="Mazhab Ashar"
            value={s.madhab}
            onChange={(madhab) => update({ madhab })}
            options={[
              { value: 'syafii', label: "Syafi'i / Jumhur" },
              { value: 'hanafi', label: 'Hanafi' },
            ]}
          />
        </div>
        <div className="switch-row">
          <span className="switch-row-text">
            <strong>Pengingat waktu sholat</strong>
            <small>Notifikasi & bunyi saat masuk waktu (selama tab terbuka)</small>
          </span>
          <Switch
            checked={s.notify}
            label="Pengingat waktu sholat"
            onChange={async (v) => {
              if (!v) return update({ notify: false });
              if (typeof Notification === 'undefined') return toast('Browser tidak mendukung notifikasi', 'alert');
              const p = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
              if (p === 'granted') update({ notify: true });
              else toast('Izin notifikasi ditolak', 'alert');
            }}
          />
        </div>
      </section>

      <section className="card settings-section">
        <h2 className="card-title">
          <Icon name="calendar" size={18} /> Kalender Hijriah
        </h2>
        <div className="setting">
          <span className="setting-label">Koreksi tanggal</span>
          <div className="stepper-input">
            <button className="icon-btn" onClick={() => update({ hijriOffset: Math.max(-2, s.hijriOffset - 1) })} disabled={s.hijriOffset <= -2} aria-label="Kurangi satu hari">
              <Icon name="minus" size={18} />
            </button>
            <b className="tabular">{s.hijriOffset > 0 ? `+${s.hijriOffset}` : s.hijriOffset} hari</b>
            <button className="icon-btn" onClick={() => update({ hijriOffset: Math.min(2, s.hijriOffset + 1) })} disabled={s.hijriOffset >= 2} aria-label="Tambah satu hari">
              <Icon name="plus" size={18} />
            </button>
          </div>
          <p className="field-hint">Hari ini: {hijriPreview}. Sesuaikan bila berbeda dengan penetapan Kemenag di daerahmu.</p>
        </div>
      </section>

      <section className="card settings-section">
        <h2 className="card-title">
          <Icon name="headphones" size={18} /> Qari murottal
        </h2>
        <select className="select" value={s.qari} onChange={(e) => update({ qari: e.target.value as QariId })} aria-label="Qari">
          {(Object.keys(QARI) as QariId[]).map((id) => (
            <option key={id} value={id}>
              {QARI[id].name}
            </option>
          ))}
        </select>
      </section>

      <section className="card settings-section">
        <h2 className="card-title">
          <Icon name="layers" size={18} /> Data
        </h2>
        <p className="muted" style={{ fontSize: '0.88rem' }}>
          Semua data (jurnal, hafalan, sedekah, penanda) tersimpan di browser ini saja. Cadangkan agar bisa dipindah ke perangkat lain.
        </p>
        <div className="row mt-1">
          <button className="btn btn-outline btn-sm" onClick={exportData}>
            <Icon name="download" size={16} /> Cadangkan
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => fileRef.current?.click()}>
            <Icon name="refresh" size={16} /> Pulihkan
          </button>
          <button className="btn btn-danger btn-sm" onClick={resetAll}>
            <Icon name="trash" size={16} /> Hapus semua
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.target.value = '';
            }}
          />
        </div>
      </section>
    </Page>
  );
}
