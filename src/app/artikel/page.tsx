'use client';

import { useState } from 'react';

const articles = [
  { id: 1, title: 'Keutamaan Sholat Berjamaah', category: 'Ibadah', icon: '🕌', readTime: '5 menit',
    content: 'Sholat berjamaah memiliki keutamaan 27 derajat lebih tinggi dibandingkan sholat sendirian (HR. Bukhari & Muslim). Rasulullah SAW sangat menekankan pentingnya sholat berjamaah, terutama di masjid.\n\nBeberapa keutamaan sholat berjamaah:\n\n1. Pahala 27 kali lipat dari sholat sendiri\n2. Langkah menuju masjid dihitung sebagai pahala dan penghapus dosa\n3. Malaikat mendoakan orang yang menunggu sholat berjamaah\n4. Terjaga dari kemunafikan\n5. Mempererat ukhuwah Islamiyah antar sesama muslim' },
  { id: 2, title: 'Adab Membaca Al-Quran', category: 'Adab', icon: '📖', readTime: '4 menit',
    content: 'Membaca Al-Quran memiliki adab-adab yang perlu diperhatikan agar membaca menjadi ibadah yang sempurna.\n\nAdab-adab membaca Al-Quran:\n\n1. Berwudhu sebelum membaca\n2. Menghadap kiblat jika memungkinkan\n3. Membaca ta\'awudz dan basmalah\n4. Membaca dengan tartil (pelan dan jelas)\n5. Merenungkan makna ayat yang dibaca (tadabbur)\n6. Menangis atau berusaha menangis saat membaca\n7. Menghindari berbicara di tengah bacaan\n8. Membaca dengan suara yang merdu' },
  { id: 3, title: 'Pentingnya Silaturahmi', category: 'Akhlak', icon: '🤝', readTime: '4 menit',
    content: 'Silaturahmi adalah salah satu ajaran Islam yang sangat ditekankan. Rasulullah SAW bersabda bahwa siapa yang ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung silaturahmi.\n\nManfaat silaturahmi:\n\n1. Rezeki dilapangkan oleh Allah\n2. Umur dipanjangkan (berkah)\n3. Dicintai oleh manusia\n4. Mendapatkan pahala yang besar\n5. Terhindar dari murka Allah\n6. Mempererat persaudaraan umat Islam' },
  { id: 4, title: 'Hikmah Berpuasa', category: 'Ibadah', icon: '🌙', readTime: '6 menit',
    content: 'Puasa bukan sekadar menahan lapar dan haus, tetapi melatih jiwa untuk mengendalikan hawa nafsu dan mendekatkan diri kepada Allah SWT.\n\nHikmah berpuasa:\n\n1. Melatih kesabaran dan pengendalian diri\n2. Merasakan penderitaan orang miskin\n3. Menyehatkan tubuh secara medis\n4. Meningkatkan ketakwaan kepada Allah\n5. Mengajarkan kedisiplinan waktu\n6. Mendapatkan syafaat di hari kiamat\n7. Doa orang yang berpuasa mustajab\n8. Pintu Ar-Rayyan khusus bagi orang yang berpuasa' },
  { id: 5, title: 'Menjaga Lisan dalam Islam', category: 'Akhlak', icon: '🗣️', readTime: '5 menit',
    content: 'Rasulullah SAW bersabda: "Barangsiapa beriman kepada Allah dan hari akhir, hendaklah ia berkata baik atau diam." (HR. Bukhari & Muslim)\n\nDosa-dosa lisan yang harus dihindari:\n\n1. Ghibah (menggunjing)\n2. Namimah (mengadu domba)\n3. Berkata dusta\n4. Berkata kasar dan menyakiti perasaan\n5. Bersumpah palsu\n6. Menghina dan merendahkan orang lain\n\nCara menjaga lisan:\n- Berdzikir dan membaca Al-Quran\n- Berpikir sebelum berbicara\n- Mengganti kata buruk dengan kata baik' },
  { id: 6, title: 'Keutamaan Sedekah', category: 'Muamalah', icon: '💰', readTime: '4 menit',
    content: 'Sedekah adalah amalan yang tidak pernah rugi. Allah menjanjikan balasan berlipat ganda bagi yang bersedekah.\n\nKeutamaan sedekah:\n\n1. Sedekah memadamkan dosa seperti air memadamkan api\n2. Harta tidak akan berkurang karena sedekah\n3. Sedekah menjadi pelindung dari api neraka\n4. Akan dinaungi sedekahnya di hari kiamat\n5. Sedekah jariyah mengalir pahalanya walau sudah meninggal\n6. Obat penyakit dan penolak bala\n7. Mendatangkan keberkahan dalam rezeki' },
];

const categories = ['Semua', 'Ibadah', 'Akhlak', 'Adab', 'Muamalah'];

export default function ArtikelPage() {
  const [selected, setSelected] = useState<typeof articles[0] | null>(null);
  const [filter, setFilter] = useState('Semua');
  const filtered = filter === 'Semua' ? articles : articles.filter(a => a.category === filter);

  if (selected) {
    return (
      <>
        <div className="page-header"><div className="container"><h1>{selected.icon} {selected.title}</h1><p>{selected.category} • {selected.readTime}</p></div></div>
        <div className="page-content">
          <div className="container" style={{ maxWidth: '700px' }}>
            <button className="back-btn" onClick={() => setSelected(null)} style={{ marginBottom: '1.5rem' }}>← Kembali</button>
            <div className="card" style={{ padding: '2.5rem' }}>
              <h2 style={{ marginBottom: '0.5rem' }}>{selected.title}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <span className="doa-card-category">{selected.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>⏱️ {selected.readTime}</span>
              </div>
              {selected.content.split('\n\n').map((p, i) => (
                <p key={i} style={{ marginBottom: '1rem', lineHeight: 1.9, color: 'var(--text-secondary)' }}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="page-header"><div className="container"><h1>📝 Artikel Islami</h1><p>Pelajari Islam lebih dalam</p></div></div>
      <div className="page-content">
        <div className="container">
          <div className="filter-bar">
            {categories.map((cat) => (
              <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>
            ))}
          </div>
          <div className="feature-grid">
            {filtered.map((a) => (
              <div key={a.id} className="card" onClick={() => setSelected(a)} style={{ cursor: 'pointer', padding: '1.75rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{a.icon}</div>
                <h4 style={{ marginBottom: '0.5rem' }}>{a.title}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="doa-card-category">{a.category}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⏱️ {a.readTime}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{a.content.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
