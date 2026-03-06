'use client';

import { useState, useEffect } from 'react';

const doaList = [
  { arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari azab neraka.', ref: 'QS. Al-Baqarah: 201' },
  { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', translation: 'Ya Tuhanku, lapangkanlah dadaku dan mudahkanlah urusanku.', ref: 'QS. Taha: 25-26' },
  { arabic: 'رَبِّ زِدْنِي عِلْمًا', translation: 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.', ref: 'QS. Taha: 114' },
  { arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translation: 'Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik pelindung.', ref: 'QS. Ali Imran: 173' },
  { arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا', translation: 'Ya Tuhan kami, janganlah Engkau jadikan hati kami condong setelah Engkau memberi petunjuk kepada kami.', ref: 'QS. Ali Imran: 8' },
  { arabic: 'رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ', translation: 'Ya Tuhanku, ampunilah aku dan kedua orang tuaku.', ref: 'QS. Nuh: 28' },
];

export default function DoaPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [doa, setDoa] = useState(doaList[0]);

  useEffect(() => {
    const lastShown = localStorage.getItem('MaRilmu-doa-popup-date');
    const today = new Date().toDateString();
    if (lastShown !== today) {
      const idx = new Date().getDate() % doaList.length;
      setDoa(doaList[idx]);
      setTimeout(() => setIsOpen(true), 1500);
      localStorage.setItem('MaRilmu-doa-popup-date', today);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="doa-popup-overlay" onClick={() => setIsOpen(false)}>
      <div className="doa-popup" onClick={(e) => e.stopPropagation()}>
        <button className="doa-popup-close" onClick={() => setIsOpen(false)}>✕</button>
        <div className="doa-popup-icon">🤲</div>
        <h3 className="doa-popup-title">Doa Hari Ini</h3>
        <div className="doa-popup-arabic">{doa.arabic}</div>
        <div className="doa-popup-translation">&ldquo;{doa.translation}&rdquo;</div>
        <div className="doa-popup-ref">— {doa.ref}</div>
      </div>
    </div>
  );
}
