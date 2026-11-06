# MaRilmu — Teman Ibadah Harian

Portal Islami berbahasa Indonesia dengan tema visual **"Andalusia"**: hijau zamrud, emas, dan gading dengan ornamen bintang delapan (khatam) dan bingkai mihrab. Mendukung mode terang/gelap, nyaman di desktop maupun ponsel, tanpa iklan dan tanpa akun — semua catatan pribadi tersimpan di perangkat.

## Fitur

**Utama**
- **Al-Quran 114 surah / 30 juz** — teks Arab (rasm Kemenag), latin, terjemahan & **tafsir Kemenag**, murottal per ayat yang berlanjut otomatis dengan sorotan ayat, penanda ayat, "terakhir dibaca" otomatis, lompat ke ayat, ukuran huruf Arab
- **Jadwal sholat** — dihitung lokal dari koordinat (kriteria Kemenag RI: Subuh −20°, Isya −18°, ihtiyat 2 menit), imsak/terbit/dhuha, hitung mundur, tabel bulanan, pengingat adzan, tautan masjid terdekat
- **Arah kiblat** — kompas yang benar untuk Android & iOS, indikator "sudah menghadap kiblat" + getar, jarak ke Ka'bah, info Rashdul Qiblah
- **Kalender Hijriah** — tanggal Hijriah lokal (Umm al-Qura) dengan koreksi ±hari, hari besar Islam, puasa sunnah (Senin–Kamis, Ayyamul Bidh, Arafah, Asyura), agenda mendatang, konverter Masehi ⇄ Hijriah

**Ibadah** — 220+ doa shahih beserta sumbernya · dzikir pagi, petang & ba'da sholat dengan penghitung · tasbih digital (rangkaian 33-33-33, rekap harian) · murottal 6 qari yang tetap diputar saat berpindah halaman · panduan sholat langkah demi langkah · 8 sholat sunnah dengan jendela waktunya hari ini · mode Ramadhan (imsakiyah, target tilawah, doa)

**Belajar** — Asmaul Husna (dengan mode hafalan) · 30 hadits pilihan · kisah 25 nabi · artikel · kuis 35 soal (10 soal acak per sesi)

**Catatan & alat** — jurnal ibadah (streak, grafik 7 hari, heatmap) · hafalan 114 surah · kalkulator zakat (penghasilan, tabungan, emas, perdagangan, fitrah) · catatan sedekah · halaman tersimpan · pengaturan + cadangkan/pulihkan data

Pencarian cepat fitur & surah: **Ctrl + K**.

## Teknologi

| Lapisan | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router, ISR) + React 19 |
| Bahasa | TypeScript |
| Gaya | CSS murni dengan design token (`src/styles/`) |
| Font | Plus Jakarta Sans, Marcellus, Amiri, Amiri Quran |
| Data | [equran.id](https://equran.id) (Al-Quran, tafsir, audio & doa — Kemenag RI), OpenStreetMap Nominatim (pencarian kota) |
| Perhitungan lokal | Jadwal sholat (algoritma astronomis), kalender Hijriah (`Intl` Umm al-Qura), arah kiblat (great-circle) |
| Penyimpanan | `localStorage` (hanya di perangkat) |

## Struktur

```
src/
  app/              halaman (page.tsx = server, *View.tsx = komponen klien)
  components/       Icon (set ikon SVG), layout (Shell, Footer, Logo), providers (tema, toast, pemutar audio)
  lib/              prayer.ts, hijri.ts, qibla.ts, quran.ts, doa.ts, store.ts, site.ts
  data/             data lokal (surah, dzikir, hadits, kuis, asmaul husna, kisah nabi, artikel)
  styles/           tokens, base, layout, components, pages
```

Tautan profil pembuat diatur di `src/lib/site.ts` (`PROFILE_LINKS`).

## Menjalankan

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Lisensi

Dibuat oleh **Ammar Tyo Pasaribu**. Teks, terjemahan, tafsir, audio Al-Quran dan koleksi doa berasal dari equran.id (Kementerian Agama RI).
