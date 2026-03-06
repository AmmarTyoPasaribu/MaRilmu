import Link from 'next/link';

const footerLinks = [
  { title: 'Ibadah', links: [
    { href: '/quran', label: 'Al-Quran' },
    { href: '/jadwal-sholat', label: 'Jadwal Sholat' },
    { href: '/doa', label: 'Kumpulan Doa' },
    { href: '/tasbih', label: 'Tasbih Digital' },
    { href: '/dzikir', label: 'Dzikir Pagi/Sore' },
    { href: '/panduan-sholat', label: 'Panduan Sholat' },
    { href: '/sholat-sunnah', label: 'Sholat Sunnah' },
    { href: '/murottal', label: 'Audio Murottal' },
  ]},
  { title: 'Belajar', links: [
    { href: '/hadits', label: 'Hadits Harian' },
    { href: '/asmaul-husna', label: 'Asmaul Husna' },
    { href: '/kisah-nabi', label: 'Kisah 25 Nabi' },
    { href: '/bacaan', label: 'Bacaan Populer' },
    { href: '/artikel', label: 'Artikel Islami' },
    { href: '/quiz', label: 'Quiz Islami' },
  ]},
  { title: 'Tools', links: [
    { href: '/kalender', label: 'Kalender Hijriyah' },
    { href: '/kiblat', label: 'Arah Kiblat' },
    { href: '/zakat', label: 'Kalkulator Zakat' },
    { href: '/hafalan', label: 'Hafalan Tracker' },
    { href: '/jurnal', label: 'Jurnal Ibadah' },
    { href: '/infaq', label: 'Infaq Tracker' },
    { href: '/ramadhan', label: 'Ramadhan Mode' },
  ]},
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <div className="footer-brand"><span className="footer-brand-icon">🌙</span> MaRilmu</div>
            <p className="footer-desc">Portal Islami digital lengkap dengan 25+ fitur untuk membantu ibadah sehari-hari.</p>
          </div>
          {footerLinks.map((group) => (
            <div key={group.title} className="footer-links">
              <h4>{group.title}</h4>
              {group.links.map((link) => (
                <Link key={link.href} href={link.href}>{link.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} MaRilmu — Dibuat oleh <strong>Ammar Tyo Pasaribu</strong></p>
        </div>
      </div>
    </footer>
  );
}
