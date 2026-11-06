'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Icon from '../Icon';
import { Logo } from './Logo';
import SearchDialog from './SearchDialog';
import { BOTTOM_NAV, NAV, PROFILE_LINKS } from '@/lib/site';
import { useNow, useSettings, type ThemeMode } from '@/lib/store';
import { useHijriToday } from '@/lib/hooks';
import { formatHijri, formatGregorian } from '@/lib/hijri';

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');
}

const THEME_ORDER: ThemeMode[] = ['system', 'light', 'dark'];
const THEME_META: Record<ThemeMode, { icon: 'monitor' | 'sun' | 'moon'; label: string }> = {
  system: { icon: 'monitor', label: 'Tema: ikuti sistem' },
  light: { icon: 'sun', label: 'Tema: terang' },
  dark: { icon: 'moon', label: 'Tema: gelap' },
};

function ThemeButton() {
  const [settings, update] = useSettings();
  const meta = THEME_META[settings.theme];
  return (
    <button
      className="icon-btn ghost"
      onClick={() => update({ theme: THEME_ORDER[(THEME_ORDER.indexOf(settings.theme) + 1) % 3] })}
      aria-label={meta.label}
      title={meta.label}
    >
      <Icon name={meta.icon} size={19} />
    </button>
  );
}

function TodayLabel() {
  const now = useNow();
  const hijri = useHijriToday(now);
  if (!now) return <span className="topbar-date skeleton-text" aria-hidden />;
  return (
    <span className="topbar-date">
      <span className="topbar-hijri">{formatHijri(hijri)}</span>
      <span className="topbar-greg">{formatGregorian(new Date(now), true)}</span>
    </span>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // tutup menu saat pindah halaman (pola "adjust state during render")
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      } else if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
  }, [menuOpen]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <div className="shell">
      <a href="#konten" className="skip-link">
        Lompat ke konten
      </a>

      {/* ---------- Sidebar desktop ---------- */}
      <aside className="sidebar" aria-label="Navigasi utama">
        <Link href="/" className="sidebar-brand">
          <Logo />
        </Link>
        <button className="sidebar-search" onClick={() => setSearchOpen(true)}>
          <Icon name="search" size={17} />
          <span>Cari…</span>
          <kbd>Ctrl K</kbd>
        </button>
        <nav className="sidebar-nav">
          {NAV.map((group) => (
            <div key={group.title} className="sidebar-group">
              <div className="sidebar-group-title">{group.title}</div>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link${isActive(pathname, item.href) ? ' active' : ''}`}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                >
                  <Icon name={item.icon} size={19} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          {PROFILE_LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="icon-btn ghost" aria-label={l.label} title={l.label}>
              <Icon name={l.icon} size={18} />
            </a>
          ))}
          <span className="sidebar-foot-spacer" />
          <ThemeButton />
        </div>
      </aside>

      {/* ---------- Area konten ---------- */}
      <div className="shell-main">
        <header className="topbar">
          <Link href="/" className="topbar-brand" aria-label="MaRilmu — Beranda">
            <Logo />
          </Link>
          <TodayLabel />
          <div className="topbar-actions">
            <button className="icon-btn ghost" onClick={() => setSearchOpen(true)} aria-label="Cari (Ctrl+K)">
              <Icon name="search" size={19} />
            </button>
            <ThemeButton />
            <Link href="/pengaturan" className="icon-btn ghost topbar-settings" aria-label="Pengaturan">
              <Icon name="settings" size={19} />
            </Link>
          </div>
        </header>

        <main id="konten" className="shell-content">
          {children}
        </main>
      </div>

      {/* ---------- Tab bawah (mobile) ---------- */}
      <nav className="bottom-nav" aria-label="Navigasi cepat">
        {BOTTOM_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-nav-item${isActive(pathname, item.href) && !menuOpen ? ' active' : ''}`}
            aria-current={isActive(pathname, item.href) ? 'page' : undefined}
          >
            <Icon name={item.icon} size={22} />
            <span>{item.href === '/' ? 'Beranda' : item.label.replace('Kumpulan ', '').replace('Jadwal ', '')}</span>
          </Link>
        ))}
        <button className={`bottom-nav-item${menuOpen ? ' active' : ''}`} onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
          <Icon name={menuOpen ? 'x' : 'grid'} size={22} />
          <span>Menu</span>
        </button>
      </nav>

      {/* ---------- Lembar menu semua fitur (mobile) ---------- */}
      <div className={`menu-sheet${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
        <div className="menu-sheet-backdrop" onClick={() => setMenuOpen(false)} />
        <div className="menu-sheet-panel" role="dialog" aria-label="Semua fitur">
          <div className="menu-sheet-handle" />
          {NAV.map((group) => (
            <section key={group.title} className="menu-sheet-group">
              <h2>{group.title}</h2>
              <div className="menu-sheet-grid">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href} className={`menu-tile${isActive(pathname, item.href) ? ' active' : ''}`} tabIndex={menuOpen ? 0 : -1}>
                    <span className="menu-tile-icon">
                      <Icon name={item.icon} size={22} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </div>
  );
}
