import Link from 'next/link';
import Icon from '../Icon';
import { LogoMark } from './Logo';
import { NAV, PROFILE_LINKS, SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="ornament-divider" aria-hidden>
        <span />
        <Icon name="star8" size={18} />
        <span />
      </div>
      <div className="footer-inner">
        <div className="footer-brand">
          <LogoMark size={44} />
          <div>
            <strong>{SITE.name}</strong>
            <p>{SITE.tagline}. Al-Quran, jadwal sholat, kiblat, doa, dan alat ibadah dalam satu tempat — gratis tanpa iklan.</p>
            <div className="footer-social">
              {PROFILE_LINKS.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} title={l.label}>
                  <Icon name={l.icon} size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
        {NAV.slice(1).map((group) => (
          <div key={group.title} className="footer-col">
            <h3>{group.title}</h3>
            {group.items.map((i) => (
              <Link key={i.href} href={i.href}>
                {i.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {SITE.name} · Dibuat oleh{' '}
          <a href={PROFILE_LINKS[0].href} target="_blank" rel="noopener noreferrer">
            {SITE.author}
          </a>
        </p>
        <p className="footer-credit">
          Teks, terjemahan, tafsir & audio Al-Quran serta doa: <a href="https://equran.id" target="_blank" rel="noopener noreferrer">equran.id</a> (Kemenag RI) ·
          Peta lokasi: © OpenStreetMap
        </p>
      </div>
    </footer>
  );
}
