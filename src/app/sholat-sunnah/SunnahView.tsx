'use client';

import { useState } from 'react';
import Icon, { type IconName } from '@/components/Icon';
import ArabicBlock from '@/components/ArabicBlock';
import { PageHeader, Page } from '@/components/ui';
import { useNow } from '@/lib/store';
import { usePrayerTimes } from '@/lib/hooks';
import { formatTime, type PrayerTimes } from '@/lib/prayer';

interface Sunnah {
  id: string;
  name: string;
  icon: IconName;
  rakaat: string;
  waktu: string;
  window?: (t: { today: PrayerTimes; tomorrow: PrayerTimes }) => [Date, Date];
  niat: { ar: string; lat: string };
  keutamaan: string;
  dalil: string;
  cara?: string[];
  doa?: { title: string; ar: string; lat: string; id: string; source: string };
}

const minus = (d: Date, m: number) => new Date(d.getTime() - m * 60000);

const SUNNAH: Sunnah[] = [
  {
    id: 'dhuha',
    name: 'Sholat Dhuha',
    icon: 'sun',
    rakaat: '2 – 8 rakaat (salam tiap 2 rakaat)',
    waktu: 'Sejak matahari setinggi tombak hingga menjelang Dzuhur',
    window: ({ today }) => [today.dhuha, minus(today.dzuhur, 10)],
    niat: { ar: 'أُصَلِّيْ سُنَّةَ الضُّحَى رَكْعَتَيْنِ لِلّٰهِ تَعَالَى', lat: "Ushallii sunnatadh dhuhaa rak'ataini lillaahi ta'aalaa." },
    keutamaan: 'Setiap persendian manusia wajib bersedekah setiap pagi, dan dua rakaat Dhuha sudah mencukupi semuanya.',
    dalil: 'HR. Muslim no. 720',
  },
  {
    id: 'tahajud',
    name: 'Sholat Tahajud',
    icon: 'moon',
    rakaat: 'Minimal 2 rakaat, umumnya 8 rakaat + witir',
    waktu: 'Setelah tidur, paling utama sepertiga malam terakhir',
    window: ({ today, tomorrow }) => {
      const night = tomorrow.subuh.getTime() - today.maghrib.getTime();
      return [new Date(today.maghrib.getTime() + (night * 2) / 3), minus(tomorrow.subuh, 0)];
    },
    niat: { ar: 'أُصَلِّيْ سُنَّةَ التَّهَجُّدِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى', lat: "Ushallii sunnatat tahajjudi rak'ataini lillaahi ta'aalaa." },
    keutamaan: 'Sholat paling utama setelah sholat fardhu. Allah turun ke langit dunia pada sepertiga malam terakhir dan mengabulkan doa.',
    dalil: 'HR. Muslim no. 1163; HR. Bukhari no. 1145',
  },
  {
    id: 'witir',
    name: 'Sholat Witir',
    icon: 'star8',
    rakaat: '1, 3, 5, 7, 9 atau 11 rakaat (ganjil)',
    waktu: 'Setelah Isya hingga sebelum Subuh — penutup sholat malam',
    window: ({ today, tomorrow }) => [today.isya, minus(tomorrow.subuh, 0)],
    niat: { ar: 'أُصَلِّيْ سُنَّةَ الْوِتْرِ رَكْعَةً لِلّٰهِ تَعَالَى', lat: "Ushallii sunnatal witri rak'atan lillaahi ta'aalaa." },
    keutamaan: '“Jadikanlah akhir sholat malam kalian adalah witir.” Allah itu witir (ganjil) dan menyukai yang ganjil.',
    dalil: 'HR. Bukhari no. 998 & Muslim no. 751',
  },
  {
    id: 'rawatib',
    name: 'Sholat Rawatib',
    icon: 'clock',
    rakaat: '12 rakaat muakkad sehari',
    waktu: 'Sebelum (qabliyah) atau sesudah (ba’diyah) sholat fardhu',
    niat: { ar: 'أُصَلِّيْ سُنَّةَ الصُّبْحِ رَكْعَتَيْنِ قَبْلِيَّةً لِلّٰهِ تَعَالَى', lat: "Ushallii sunnatash shubhi rak'ataini qabliyyatan lillaahi ta'aalaa." },
    keutamaan: 'Siapa menjaga 12 rakaat sunnah dalam sehari semalam, Allah bangunkan baginya rumah di surga. Dua rakaat sebelum Subuh lebih baik dari dunia dan seisinya.',
    dalil: 'HR. Muslim no. 728 & 725',
    cara: ['2 rakaat sebelum Subuh', '4 rakaat sebelum Dzuhur (2 salam) & 2 rakaat sesudahnya', '2 rakaat sesudah Maghrib', '2 rakaat sesudah Isya'],
  },
  {
    id: 'tahiyatul-masjid',
    name: 'Tahiyatul Masjid',
    icon: 'mosque',
    rakaat: '2 rakaat',
    waktu: 'Saat masuk masjid sebelum duduk',
    niat: { ar: 'أُصَلِّيْ سُنَّةَ تَحِيَّةِ الْمَسْجِدِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى', lat: "Ushallii sunnata tahiyyatil masjidi rak'ataini lillaahi ta'aalaa." },
    keutamaan: '“Apabila salah seorang dari kalian masuk masjid, janganlah duduk sampai sholat dua rakaat.”',
    dalil: 'HR. Bukhari no. 444 & Muslim no. 714',
  },
  {
    id: 'istikharah',
    name: 'Sholat Istikharah',
    icon: 'compass',
    rakaat: '2 rakaat, lalu berdoa',
    waktu: 'Kapan saja di luar waktu terlarang, saat menghadapi pilihan',
    niat: { ar: 'أُصَلِّيْ سُنَّةَ الْاِسْتِخَارَةِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى', lat: "Ushallii sunnatal istikhaarati rak'ataini lillaahi ta'aalaa." },
    keutamaan: 'Rasulullah ﷺ mengajarkan istikharah dalam segala urusan sebagaimana mengajarkan surah Al-Quran.',
    dalil: 'HR. Bukhari no. 1162',
    doa: {
      title: 'Doa Istikharah',
      ar: 'اَللّٰهُمَّ إِنِّيْ أَسْتَخِيْرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيْمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوْبِ. اَللّٰهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هٰذَا الْأَمْرَ خَيْرٌ لِيْ فِيْ دِيْنِيْ وَمَعَاشِيْ وَعَاقِبَةِ أَمْرِيْ فَاقْدُرْهُ لِيْ وَيَسِّرْهُ لِيْ ثُمَّ بَارِكْ لِيْ فِيْهِ، وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هٰذَا الْأَمْرَ شَرٌّ لِيْ فِيْ دِيْنِيْ وَمَعَاشِيْ وَعَاقِبَةِ أَمْرِيْ فَاصْرِفْهُ عَنِّيْ وَاصْرِفْنِيْ عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِيْ بِهِ',
      lat: "Allaahumma innii astakhiiruka bi'ilmika, wa astaqdiruka biqudratika, wa as-aluka min fadhlikal 'azhiim, fa innaka taqdiru wa laa aqdiru, wa ta'lamu wa laa a'lamu, wa anta 'allaamul ghuyuub. Allaahumma in kunta ta'lamu anna haadzal amra khairun lii fii diinii wa ma'aasyii wa 'aaqibati amrii faqdurhu lii wa yassirhu lii tsumma baarik lii fiih. Wa in kunta ta'lamu anna haadzal amra syarrun lii fii diinii wa ma'aasyii wa 'aaqibati amrii fashrifhu 'annii washrifnii 'anhu, waqdur liyal khaira haitsu kaana tsumma ardhinii bih.",
      id: 'Ya Allah, aku memohon pilihan kepada-Mu dengan ilmu-Mu, memohon kekuatan dengan kekuasaan-Mu, dan memohon karunia-Mu yang agung. Engkau Mahakuasa sedangkan aku tidak, Engkau Maha Mengetahui sedangkan aku tidak, dan Engkau Maha Mengetahui perkara gaib. Ya Allah, jika Engkau mengetahui urusan ini (sebutkan) baik bagiku dalam agamaku, kehidupanku dan akhir urusanku, maka takdirkanlah untukku, mudahkanlah, lalu berkahilah. Jika Engkau mengetahui urusan ini buruk bagiku dalam agamaku, kehidupanku dan akhir urusanku, maka jauhkanlah ia dariku dan jauhkan aku darinya, takdirkanlah kebaikan untukku di mana pun berada, kemudian jadikanlah aku ridha dengannya.',
      source: 'HR. Bukhari no. 1162',
    },
  },
  {
    id: 'taubat',
    name: 'Sholat Taubat',
    icon: 'hands',
    rakaat: '2 rakaat',
    waktu: 'Kapan saja setelah melakukan dosa, di luar waktu terlarang',
    niat: { ar: 'أُصَلِّيْ سُنَّةَ التَّوْبَةِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى', lat: "Ushallii sunnatat taubati rak'ataini lillaahi ta'aalaa." },
    keutamaan: 'Tidaklah seorang hamba berbuat dosa lalu bersuci dengan baik, sholat dua rakaat dan memohon ampun kepada Allah, kecuali Allah mengampuninya.',
    dalil: 'HR. Abu Dawud no. 1521, Tirmidzi no. 406 (hasan)',
  },
  {
    id: 'tarawih',
    name: 'Sholat Tarawih',
    icon: 'lantern',
    rakaat: '8 atau 20 rakaat + witir',
    waktu: 'Malam-malam bulan Ramadhan setelah Isya',
    niat: { ar: 'أُصَلِّيْ سُنَّةَ التَّرَاوِيْحِ رَكْعَتَيْنِ لِلّٰهِ تَعَالَى', lat: "Ushallii sunnatat taraawiihi rak'ataini lillaahi ta'aalaa." },
    keutamaan: 'Siapa menghidupkan malam Ramadhan karena iman dan mengharap pahala, diampuni dosanya yang telah lalu.',
    dalil: 'HR. Bukhari no. 37 & Muslim no. 759',
  },
];

export default function SunnahView() {
  const now = useNow();
  const times = usePrayerTimes(now);
  const [id, setId] = useState(SUNNAH[0].id);
  const s = SUNNAH.find((x) => x.id === id)!;
  const win = now && s.window ? s.window(times) : null;

  return (
    <Page width="narrow">
      <PageHeader icon="star8" title="Sholat Sunnah" subtitle="Niat, waktu, jumlah rakaat dan keutamaannya" />

      <div className="chips" role="tablist" aria-label="Jenis sholat sunnah">
        {SUNNAH.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === id} className={`chip-btn${x.id === id ? ' on' : ''}`} onClick={() => setId(x.id)}>
            <Icon name={x.icon} size={15} /> {x.name.replace('Sholat ', '')}
          </button>
        ))}
      </div>

      <article className="card sunnah-card" key={s.id}>
        <header className="sunnah-head">
          <span className="sunnah-icon">
            <Icon name={s.icon} size={28} strokeWidth={1.6} />
          </span>
          <div>
            <h2>{s.name}</h2>
            <p className="muted">{s.dalil}</p>
          </div>
        </header>

        <dl className="sunnah-facts">
          <div>
            <dt>Rakaat</dt>
            <dd>{s.rakaat}</dd>
          </div>
          <div>
            <dt>Waktu</dt>
            <dd>{s.waktu}</dd>
          </div>
          {win && (
            <div className="sunnah-today">
              <dt>Hari ini di lokasimu</dt>
              <dd className="tabular">
                {formatTime(win[0])} – {formatTime(win[1])}
              </dd>
            </div>
          )}
        </dl>

        <div className="sunnah-virtue">
          <Icon name="sparkle" size={18} />
          <p>{s.keutamaan}</p>
        </div>

        {s.cara && (
          <ul className="check-list">
            {s.cara.map((c) => (
              <li key={c}>
                <Icon name="check" size={16} /> {c}
              </li>
            ))}
          </ul>
        )}
      </article>

      <div className="stack mt-2">
        <ArabicBlock title={`Niat ${s.name}`} arabic={s.niat.ar} latin={s.niat.lat} source="Niat cukup di dalam hati" />
        {s.doa && <ArabicBlock title={s.doa.title} arabic={s.doa.ar} latin={s.doa.lat} translation={s.doa.id} source={s.doa.source} />}
      </div>

      <p className="times-note mt-2">
        <Icon name="info" size={14} /> Waktu terlarang sholat sunnah mutlak: setelah Subuh hingga matahari naik, saat matahari tepat di atas (istiwa’), dan setelah
        Ashar hingga terbenam.
      </p>
    </Page>
  );
}
