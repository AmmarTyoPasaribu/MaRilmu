'use client';

import { useState } from 'react';

const steps = [
  { id: 1, name: 'Niat', arabic: 'أُصَلِّي فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', latin: 'Ushalli fardha zh-zhuhri arba\'a raka\'aatin mustaqbilal qiblati adaa-an lillaahi ta\'aalaa', desc: 'Berniat dalam hati untuk melaksanakan sholat. Niat harus dilakukan bersamaan dengan takbiratul ihram.', icon: '🤲' },
  { id: 2, name: 'Takbiratul Ihram', arabic: 'اللَّهُ أَكْبَرُ', latin: 'Allahu Akbar', desc: 'Mengangkat kedua tangan sejajar telinga (pria) atau bahu (wanita), lalu mengucapkan "Allahu Akbar".', icon: '🙌' },
  { id: 3, name: 'Doa Iftitah', arabic: 'وَجَّهْتُ وَجْهِيَ لِلَّذِي فَطَرَ السَّمَاوَاتِ وَالْأَرْضَ حَنِيفًا مُسْلِمًا', latin: 'Wajjahtu wajhiya lilladzii fatharas samaawaati wal ardha haniifan musliman', desc: 'Membaca doa iftitah setelah takbiratul ihram, sebelum membaca Al-Fatihah.', icon: '📖' },
  { id: 4, name: 'Al-Fatihah', arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ، الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', latin: 'Bismillaahir rahmaanir rahiim, Alhamdulillaahi rabbil \'aalamiin', desc: 'Membaca surah Al-Fatihah, wajib di setiap rakaat sholat.', icon: '📗' },
  { id: 5, name: 'Membaca Surah', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', latin: 'Qul huwallaahu ahad', desc: 'Membaca surah atau ayat Al-Quran setelah Al-Fatihah di rakaat 1 dan 2.', icon: '🔖' },
  { id: 6, name: 'Rukuk', arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ', latin: 'Subhaana rabbiyal \'azhiim (3x)', desc: 'Membungkukkan badan dengan tangan memegang lutut, punggung lurus.', icon: '🙏' },
  { id: 7, name: 'I\'tidal', arabic: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ، رَبَّنَا لَكَ الْحَمْدُ', latin: 'Sami\'allaahu liman hamidah, rabbanaa lakal hamdu', desc: 'Berdiri tegak kembali setelah rukuk.', icon: '🧍' },
  { id: 8, name: 'Sujud', arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى', latin: 'Subhaana rabbiyal a\'laa (3x)', desc: 'Meletakkan dahi, hidung, kedua telapak tangan, kedua lutut, dan ujung kedua kaki ke lantai.', icon: '🤲' },
  { id: 9, name: 'Duduk antara Dua Sujud', arabic: 'رَبِّ اغْفِرْ لِي وَارْحَمْنِي', latin: 'Rabbighfirlii warhamnii', desc: 'Duduk dengan kaki kiri dilipat, kaki kanan ditegakkan.', icon: '🪑' },
  { id: 10, name: 'Tasyahud & Salam', arabic: 'التَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلَّهِ', latin: 'At-tahiyyaatul mubaarakaatush shalawaat uth-thayyibaatu lillaah', desc: 'Membaca tahiyat akhir lalu mengucapkan salam ke kanan dan kiri.', icon: '✅' }
];

export default function PanduanSholatPage() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <div className="page-header"><div className="container"><h1>🕌 Panduan Sholat</h1><p>Tata cara sholat lengkap dengan bacaan</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '700px' }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: '2px', marginBottom: '2rem' }}>
            {steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= activeStep ? 'var(--green-500)' : 'var(--border-light)', transition: 'background 0.3s', cursor: 'pointer' }} onClick={() => setActiveStep(i)} />
            ))}
          </div>

          <div className="card" style={{ padding: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{steps[activeStep].icon}</div>
              <h2 style={{ margin: 0 }}>{steps[activeStep].name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Langkah {activeStep + 1} dari {steps.length}</p>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', textAlign: 'center', lineHeight: 1.8 }}>{steps[activeStep].desc}</p>
            <div className="doa-arabic" style={{ textAlign: 'center' }}>{steps[activeStep].arabic}</div>
            <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--teal)', marginBottom: '1.5rem' }}>{steps[activeStep].latin}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <button className="back-btn" onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0} style={{ opacity: activeStep === 0 ? 0.4 : 1 }}>← Sebelumnya</button>
              <button className="back-btn" onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))} disabled={activeStep === steps.length - 1} style={{ opacity: activeStep === steps.length - 1 ? 0.4 : 1 }}>Selanjutnya →</button>
            </div>
          </div>

          {/* All Steps */}
          <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Semua Langkah</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {steps.map((step, i) => (
              <div key={step.id} className="surah-card" onClick={() => setActiveStep(i)} style={{ cursor: 'pointer', border: i === activeStep ? '2px solid var(--green-400)' : undefined }}>
                <div className="surah-number">{step.icon}</div>
                <div className="surah-info">
                  <div className="surah-name">{step.name}</div>
                  <div className="surah-meta">{step.desc.substring(0, 60)}...</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
