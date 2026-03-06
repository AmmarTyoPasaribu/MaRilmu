'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDarkMode, setDarkMode } from '@/lib/api';

const sidebarSections = [
  {
    title: 'Utama',
    links: [
      { href: '/', icon: '🏠', label: 'Beranda' },
      { href: '/quran', icon: '📖', label: 'Al-Quran' },
      { href: '/jadwal-sholat', icon: '🕐', label: 'Jadwal Sholat' },
      { href: '/doa', icon: '🤲', label: 'Kumpulan Doa' },
    ],
  },
  {
    title: 'Ibadah',
    links: [
      { href: '/tasbih', icon: '📿', label: 'Tasbih Digital' },
      { href: '/dzikir', icon: '🌅', label: 'Dzikir Pagi/Sore' },
      { href: '/panduan-sholat', icon: '🕌', label: 'Panduan Sholat' },
      { href: '/sholat-sunnah', icon: '⭐', label: 'Sholat Sunnah' },
      { href: '/bacaan', icon: '📗', label: 'Bacaan Populer' },
      { href: '/murottal', icon: '🎧', label: 'Audio Murottal' },
      { href: '/ramadhan', icon: '🌙', label: 'Ramadhan Mode' },
    ],
  },
  {
    title: 'Belajar',
    links: [
      { href: '/hadits', icon: '📜', label: 'Hadits Harian' },
      { href: '/asmaul-husna', icon: '✨', label: 'Asmaul Husna' },
      { href: '/kisah-nabi', icon: '📚', label: 'Kisah 25 Nabi' },
      { href: '/artikel', icon: '📝', label: 'Artikel Islami' },
      { href: '/quiz', icon: '🎓', label: 'Quiz Islami' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/kalender', icon: '📅', label: 'Kalender Hijriyah' },
      { href: '/kiblat', icon: '🧭', label: 'Arah Kiblat' },
      { href: '/zakat', icon: '🧮', label: 'Kalkulator Zakat' },
      { href: '/hafalan', icon: '📝', label: 'Hafalan Tracker' },
      { href: '/jurnal', icon: '📋', label: 'Jurnal Ibadah' },
      { href: '/infaq', icon: '💰', label: 'Infaq Tracker' },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = getDarkMode();
    setDark(saved);
    document.documentElement.setAttribute('data-theme', saved ? 'dark' : 'light');
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const toggleDark = () => {
    const newVal = !dark;
    setDark(newVal);
    setDarkMode(newVal);
  };

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      <header className="topbar">
        <button className="topbar-toggle" onClick={() => setIsOpen(true)} aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <Link href="/" className="topbar-brand"><span>🌙</span> MaRilmu</Link>
        <button className="dark-toggle" onClick={toggleDark} aria-label="Toggle dark mode">{dark ? '☀️' : '🌙'}</button>
      </header>

      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-brand"><span className="sidebar-brand-icon">🌙</span><span>MaRilmu</span></Link>
          <button className="sidebar-close" onClick={() => setIsOpen(false)} aria-label="Close">✕</button>
        </div>
        <nav className="sidebar-nav">
          {sidebarSections.map((section) => (
            <div key={section.title} className="sidebar-section">
              <div className="sidebar-section-title">{section.title}</div>
              {section.links.map((link) => (
                <Link key={link.href} href={link.href} className={`sidebar-link ${isActive(link.href) ? 'active' : ''}`}>
                  <span className="sidebar-link-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-dark-toggle" onClick={toggleDark}>{dark ? '☀️ Light Mode' : '🌙 Dark Mode'}</button>
        </div>
      </aside>
    </>
  );
}
