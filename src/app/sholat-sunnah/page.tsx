'use client';

import { useState, useEffect } from 'react';

const sholatSunnah = [
  { id: 'dhuha', name: 'Sholat Dhuha', time: '07:00 - 11:00', rakaat: '2-12 rakaat', icon: '☀️', color: '#F59E0B',
    niat: 'أُصَلِّي سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
    niatLatin: "Ushallii sunnata adh-dhuhaa rak'ataini lillaahi ta'aalaa",
    keutamaan: 'Sebagai sedekah untuk seluruh persendian tubuh. Siapa yang sholat Dhuha 2 rakaat, tidak tercatat sebagai orang lalai.' },
  { id: 'tahajud', name: 'Sholat Tahajud', time: 'Sepertiga malam terakhir', rakaat: '2-12 rakaat', icon: '🌙', color: '#4338CA',
    niat: 'أُصَلِّي سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
    niatLatin: "Ushallii sunnata at-tahajjudi rak'ataini lillaahi ta'aalaa",
    keutamaan: 'Sholat yang paling utama setelah sholat wajib. Allah turun ke langit dunia di sepertiga malam terakhir dan mengabulkan doa.' },
  { id: 'rawatib-subuh', name: 'Rawatib Qabliyah Subuh', time: 'Sebelum Subuh', rakaat: '2 rakaat', icon: '🌅', color: '#0D9488',
    niat: 'أُصَلِّي سُنَّةَ الْفَجْرِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
    niatLatin: "Ushallii sunnatal fajri rak'ataini lillaahi ta'aalaa",
    keutamaan: 'Dua rakaat sebelum Subuh lebih baik dari dunia dan seisinya.' },
  { id: 'rawatib-dzuhur', name: 'Rawatib Dzuhur', time: 'Sebelum & sesudah Dzuhur', rakaat: '4+2 rakaat', icon: '🕐', color: '#059669',
    niat: 'أُصَلِّي سُنَّةَ الظُّهْرِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
    niatLatin: "Ushallii sunnata azh-zhuhri rak'ataini lillaahi ta'aalaa",
    keutamaan: 'Menjaga 4 rakaat sebelum dan 2 setelah Dzuhur, Allah haramkan dari api neraka.' },
  { id: 'witir', name: 'Sholat Witir', time: 'Setelah Isya', rakaat: '1-11 rakaat (ganjil)', icon: '⭐', color: '#EC4899',
    niat: 'أُصَلِّي سُنَّةَ الْوِتْرِ رَكْعَةً وَاحِدَةً لِلّٰهِ تَعَالَى',
    niatLatin: "Ushallii sunnatal witri rak'atan waahidatan lillaahi ta'aalaa",
    keutamaan: 'Sholat penutup malam. Rasulullah bersabda: Jadikan akhir sholat malammu adalah witir.' },
   { id: 'istikharah', name: 'Sholat Istikharah', time: 'Kapan saja', rakaat: '2 rakaat', icon: '🤲', color: '#2563EB',
    niat: 'أُصَلِّي سُنَّةَ الِاسْتِخَارَةِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى',
    niatLatin: "Ushallii sunnatal istikharati rak'ataini lillaahi ta'aalaa",
    keutamaan: 'Memohon petunjuk Allah dalam mengambil keputusan penting.' },
];

export default function SholatSunnahPage() {
  const [selected, setSelected] = useState(sholatSunnah[0]);

  return (
    <>
      <div className="page-header"><div className="container"><h1>🕌 Sholat Sunnah</h1><p>Panduan sholat sunnah dengan niat dan keutamaan</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="filter-bar">
            {sholatSunnah.map((s) => (
              <button key={s.id} className={`filter-btn ${selected.id === s.id ? 'active' : ''}`} onClick={() => setSelected(s)}>
                {s.icon} {s.name.split(' ').pop()}
              </button>
            ))}
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selected.icon}</div>
              <h2 style={{ color: selected.color, margin: 0 }}>{selected.name}</h2>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', background: `${selected.color}15`, color: selected.color, fontWeight: 600 }}>⏰ {selected.time}</span>
                <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', background: `${selected.color}15`, color: selected.color, fontWeight: 600 }}>🔢 {selected.rakaat}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>📖 Niat</h4>
              <div className="doa-arabic">{selected.niat}</div>
              <p style={{ fontStyle: 'italic', color: 'var(--teal)', fontSize: '0.9rem' }}>{selected.niatLatin}</p>
            </div>

            <div style={{ padding: '1.25rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${selected.color}` }}>
              <h4 style={{ marginBottom: '0.5rem', color: selected.color }}>✨ Keutamaan</h4>
              <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{selected.keutamaan}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
