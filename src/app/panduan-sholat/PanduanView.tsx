'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import ArabicBlock from '@/components/ArabicBlock';
import { PageHeader, Page, Segmented, SectionTitle } from '@/components/ui';
import snippets from '@/data/quran-snippets.json';

interface Step {
  name: string;
  desc: string;
  arabic: string;
  latin: string;
  translation: string;
  note?: string;
  quran?: boolean;
}

const STEPS: Step[] = [
  {
    name: 'Niat',
    desc: 'Berdiri tegak menghadap kiblat dan berniat di dalam hati untuk sholat yang akan dikerjakan. Niat dilakukan bersamaan dengan takbiratul ihram.',
    arabic: 'أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى',
    latin: "Ushallii fardhazh zhuhri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa.",
    translation: 'Aku berniat sholat fardhu Dzuhur empat rakaat menghadap kiblat, tunai karena Allah Ta’ala.',
    note: 'Tempat niat adalah hati. Melafalkannya dianjurkan sebagian ulama madzhab Syafi’i untuk membantu menghadirkan niat. Lihat niat lima waktu di bawah.',
  },
  {
    name: 'Takbiratul Ihram',
    desc: 'Mengangkat kedua tangan sejajar bahu atau telinga dengan telapak menghadap kiblat, lalu bertakbir. Setelah itu tangan kanan diletakkan di atas tangan kiri di dada.',
    arabic: 'اَللّٰهُ أَكْبَرُ',
    latin: 'Allaahu akbar.',
    translation: 'Allah Maha Besar.',
  },
  {
    name: 'Doa Iftitah',
    desc: 'Dibaca pelan setelah takbiratul ihram pada rakaat pertama (sunnah).',
    arabic:
      'اَللّٰهُمَّ بَاعِدْ بَيْنِيْ وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اَللّٰهُمَّ نَقِّنِيْ مِنَ الْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اَللّٰهُمَّ اغْسِلْ خَطَايَايَ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ',
    latin:
      "Allaahumma baa'id bainii wa baina khathaayaaya kamaa baa'adta bainal masyriqi wal maghrib. Allaahumma naqqinii minal khathaayaa kamaa yunaqqats tsaubul abyadhu minad danas. Allaahummaghsil khathaayaaya bil maa-i wats tsalji wal barad.",
    translation:
      'Ya Allah, jauhkanlah antara aku dan kesalahan-kesalahanku sebagaimana Engkau menjauhkan timur dan barat. Ya Allah, bersihkanlah aku dari kesalahan sebagaimana kain putih dibersihkan dari kotoran. Ya Allah, cucilah kesalahan-kesalahanku dengan air, salju dan embun. (HR. Bukhari & Muslim)',
  },
  {
    name: 'Membaca Al-Fatihah',
    desc: 'Wajib dibaca pada setiap rakaat — tidak sah sholat tanpa Al-Fatihah. Diawali ta’awudz, lalu diakhiri “Aamiin”.',
    arabic: snippets.fatihah.arabic,
    latin: snippets.fatihah.latin,
    translation: snippets.fatihah.translation,
    quran: true,
  },
  {
    name: 'Membaca Surah',
    desc: 'Pada rakaat pertama dan kedua, membaca surah atau ayat Al-Quran setelah Al-Fatihah (sunnah). Contoh: Al-Ikhlas.',
    arabic: snippets.ikhlas.arabic,
    latin: snippets.ikhlas.latin,
    translation: snippets.ikhlas.translation,
    quran: true,
  },
  {
    name: 'Rukuk',
    desc: 'Bertakbir lalu membungkuk, kedua telapak tangan memegang lutut, punggung dan kepala lurus. Thuma’ninah (tenang sejenak).',
    arabic: 'سُبْحَانَ رَبِّيَ الْعَظِيْمِ وَبِحَمْدِهِ',
    latin: "Subhaana rabbiyal 'azhiimi wa bihamdih. (3×)",
    translation: 'Maha Suci Rabbku Yang Maha Agung dan segala puji bagi-Nya.',
  },
  {
    name: "I'tidal",
    desc: 'Bangkit dari rukuk sambil mengangkat tangan dan membaca tasmi’, lalu berdiri tegak dan membaca tahmid.',
    arabic: 'سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ — رَبَّنَا وَلَكَ الْحَمْدُ، مِلْءَ السَّمٰوَاتِ وَمِلْءَ الْأَرْضِ، وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ',
    latin: "Sami'allaahu liman hamidah — Rabbanaa wa lakal hamdu, mil-as samaawaati wa mil-al ardhi, wa mil-a maa syi'ta min syai-in ba'du.",
    translation: 'Allah mendengar orang yang memuji-Nya. Wahai Rabb kami, bagi-Mu segala puji, sepenuh langit, sepenuh bumi dan sepenuh apa yang Engkau kehendaki setelah itu. (HR. Muslim)',
  },
  {
    name: 'Sujud',
    desc: 'Bertakbir lalu sujud dengan tujuh anggota: dahi beserta hidung, kedua telapak tangan, kedua lutut, dan ujung jari kedua kaki.',
    arabic: 'سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ',
    latin: "Subhaana rabbiyal a'laa wa bihamdih. (3×)",
    translation: 'Maha Suci Rabbku Yang Maha Tinggi dan segala puji bagi-Nya.',
  },
  {
    name: 'Duduk di antara Dua Sujud',
    desc: 'Bangkit dari sujud sambil bertakbir, duduk iftirasy (duduk di atas kaki kiri, kaki kanan ditegakkan), lalu sujud kedua.',
    arabic: 'رَبِّ اغْفِرْ لِيْ، وَارْحَمْنِيْ، وَاجْبُرْنِيْ، وَارْفَعْنِيْ، وَارْزُقْنِيْ، وَاهْدِنِيْ، وَعَافِنِيْ، وَاعْفُ عَنِّيْ',
    latin: "Rabbighfirlii, warhamnii, wajburnii, warfa'nii, warzuqnii, wahdinii, wa 'aafinii, wa'fu 'annii.",
    translation: 'Wahai Rabbku, ampunilah aku, rahmatilah aku, cukupkanlah aku, angkatlah derajatku, berilah aku rezeki, berilah aku petunjuk, sehatkanlah aku, dan maafkanlah aku.',
  },
  {
    name: 'Tasyahud Awal',
    desc: 'Pada rakaat kedua (sholat 3 atau 4 rakaat), duduk iftirasy dan membaca tasyahud, lalu berdiri untuk rakaat berikutnya.',
    arabic:
      'اَلتَّحِيَّاتُ الْمُبَارَكَاتُ الصَّلَوَاتُ الطَّيِّبَاتُ لِلّٰهِ، اَلسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ، اَلسَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللّٰهِ الصَّالِحِيْنَ، أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُوْلُ اللّٰهِ',
    latin:
      "At-tahiyyaatul mubaarakaatush shalawaatuth thayyibaatu lillaah. As-salaamu 'alaika ayyuhan nabiyyu wa rahmatullaahi wa barakaatuh. As-salaamu 'alainaa wa 'alaa 'ibaadillaahish shaalihiin. Asyhadu an laa ilaaha illallaah, wa asyhadu anna muhammadar rasuulullaah.",
    translation:
      'Segala penghormatan, keberkahan, shalawat dan kebaikan hanya milik Allah. Semoga keselamatan, rahmat Allah dan keberkahan-Nya tercurah kepadamu wahai Nabi. Semoga keselamatan tercurah kepada kami dan hamba-hamba Allah yang saleh. Aku bersaksi tidak ada tuhan selain Allah, dan aku bersaksi bahwa Muhammad adalah utusan Allah. (HR. Muslim)',
  },
  {
    name: 'Tasyahud Akhir & Shalawat',
    desc: 'Pada rakaat terakhir, duduk tawarruk lalu membaca tasyahud seperti di atas, dilanjutkan shalawat Ibrahimiyah.',
    arabic:
      'اَللّٰهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيْمَ وَعَلَى آلِ إِبْرَاهِيْمَ، إِنَّكَ حَمِيْدٌ مَجِيْدٌ، اَللّٰهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيْمَ وَعَلَى آلِ إِبْرَاهِيْمَ، إِنَّكَ حَمِيْدٌ مَجِيْدٌ',
    latin:
      "Allaahumma shalli 'alaa muhammadin wa 'alaa aali muhammad, kamaa shallaita 'alaa ibraahiima wa 'alaa aali ibraahiim, innaka hamiidum majiid. Allaahumma baarik 'alaa muhammadin wa 'alaa aali muhammad, kamaa baarakta 'alaa ibraahiima wa 'alaa aali ibraahiim, innaka hamiidum majiid.",
    translation:
      'Ya Allah, limpahkanlah shalawat kepada Muhammad dan keluarga Muhammad sebagaimana Engkau melimpahkan shalawat kepada Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. Ya Allah, berkahilah Muhammad dan keluarga Muhammad sebagaimana Engkau memberkahi Ibrahim dan keluarga Ibrahim, sesungguhnya Engkau Maha Terpuji lagi Maha Mulia. (HR. Bukhari)',
  },
  {
    name: 'Salam',
    desc: 'Menoleh ke kanan lalu ke kiri sambil mengucapkan salam. Sholat selesai.',
    arabic: 'اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ',
    latin: "As-salaamu 'alaikum wa rahmatullaah.",
    translation: 'Semoga keselamatan dan rahmat Allah tercurah kepada kalian.',
  },
];

const NIAT = [
  { name: 'Subuh', rakaat: 2, ar: 'أُصَلِّيْ فَرْضَ الصُّبْحِ رَكْعَتَيْنِ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', lat: "Ushallii fardhash shubhi rak'ataini mustaqbilal qiblati adaa-an lillaahi ta'aalaa." },
  { name: 'Dzuhur', rakaat: 4, ar: 'أُصَلِّيْ فَرْضَ الظُّهْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', lat: "Ushallii fardhazh zhuhri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa." },
  { name: 'Ashar', rakaat: 4, ar: 'أُصَلِّيْ فَرْضَ الْعَصْرِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', lat: "Ushallii fardhal 'ashri arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa." },
  { name: 'Maghrib', rakaat: 3, ar: 'أُصَلِّيْ فَرْضَ الْمَغْرِبِ ثَلَاثَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', lat: "Ushallii fardhal maghribi tsalaatsa raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa." },
  { name: 'Isya', rakaat: 4, ar: 'أُصَلِّيْ فَرْضَ الْعِشَاءِ أَرْبَعَ رَكَعَاتٍ مُسْتَقْبِلَ الْقِبْلَةِ أَدَاءً لِلّٰهِ تَعَالَى', lat: "Ushallii fardhal 'isyaa-i arba'a raka'aatin mustaqbilal qiblati adaa-an lillaahi ta'aalaa." },
];

type Tab = 'langkah' | 'niat';

export default function PanduanView() {
  const [tab, setTab] = useState<Tab>('langkah');
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <Page width="narrow">
      <PageHeader icon="mosque" title="Panduan Sholat" subtitle="Tata cara sholat fardhu lengkap dengan bacaannya" />

      <div className="segmented-wrap">
        <Segmented<Tab>
          label="Bagian panduan"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'langkah', label: 'Langkah sholat', icon: 'steps' },
            { value: 'niat', label: 'Niat & rakaat', icon: 'list' },
          ]}
        />
      </div>

      {tab === 'langkah' ? (
        <>
          <ol className="stepper" aria-label="Langkah sholat">
            {STEPS.map((s, i) => (
              <li key={s.name}>
                <button className={`${i === active ? 'active' : ''}${i < active ? ' past' : ''}`} onClick={() => setActive(i)} aria-label={`${i + 1}. ${s.name}`} aria-current={i === active ? 'step' : undefined}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ol>

          <article className="step-card card" key={active}>
            <span className="badge gold">
              Langkah {active + 1} dari {STEPS.length}
            </span>
            <h2>{step.name}</h2>
            <p className="step-desc">{step.desc}</p>
            <p className={`arabic arabic-lg${step.quran ? ' quran-text' : ''}`} lang="ar" dir="rtl">
              {step.arabic}
            </p>
            <p className="latin">{step.latin}</p>
            <p className="translation">{step.translation}</p>
            {step.note && (
              <p className="info-box mt-1">
                <Icon name="info" size={16} />
                <span>{step.note}</span>
              </p>
            )}
            <div className="step-nav">
              <button className="btn btn-outline" onClick={() => setActive((a) => a - 1)} disabled={active === 0}>
                <Icon name="chevronLeft" size={18} /> Sebelumnya
              </button>
              <button className="btn btn-primary" onClick={() => setActive((a) => a + 1)} disabled={active === STEPS.length - 1}>
                Selanjutnya <Icon name="chevronRight" size={18} />
              </button>
            </div>
          </article>
        </>
      ) : (
        <>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Sholat</th>
                  <th>Rakaat</th>
                  <th>Bacaan</th>
                  <th>Tasyahud awal</th>
                </tr>
              </thead>
              <tbody>
                {NIAT.map((n) => (
                  <tr key={n.name}>
                    <td>
                      <b>{n.name}</b>
                    </td>
                    <td>{n.rakaat}</td>
                    <td>{n.name === 'Dzuhur' || n.name === 'Ashar' ? 'Sirr (pelan)' : 'Jahr 2 rakaat awal'}</td>
                    <td>{n.rakaat > 2 ? 'Ya' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SectionTitle>Lafal niat lima waktu</SectionTitle>
          <div className="stack">
            {NIAT.map((n) => (
              <ArabicBlock key={n.name} title={`Niat sholat ${n.name}`} arabic={n.ar} latin={n.lat} badge={<span className="badge">{n.rakaat} rakaat</span>} />
            ))}
          </div>
        </>
      )}
    </Page>
  );
}
