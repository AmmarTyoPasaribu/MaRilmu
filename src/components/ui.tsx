import Link from 'next/link';
import Icon, { type IconName } from './Icon';

export function PageHeader({
  title,
  subtitle,
  icon,
  arabic,
  back,
  children,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: IconName;
  arabic?: string;
  back?: { href: string; label: string };
  children?: React.ReactNode;
}) {
  return (
    <header className="page-header">
      <div className="page-header-pattern" aria-hidden />
      <div className="page-header-inner">
        {back && (
          <Link href={back.href} className="page-back">
            <Icon name="arrowLeft" size={16} /> {back.label}
          </Link>
        )}
        {icon && (
          <span className="page-header-icon" aria-hidden>
            <Icon name={icon} size={26} strokeWidth={1.6} />
          </span>
        )}
        {arabic && <p className="page-header-arabic arabic">{arabic}</p>}
        <h1>{title}</h1>
        {subtitle && <p className="page-header-sub">{subtitle}</p>}
        {children && <div className="page-header-extra">{children}</div>}
      </div>
    </header>
  );
}

export function Page({ children, width = 'default' }: { children: React.ReactNode; width?: 'narrow' | 'default' | 'wide' }) {
  return <div className={`page page-${width}`}>{children}</div>;
}

export function EmptyState({ icon = 'search', title, children }: { icon?: IconName; title: string; children?: React.ReactNode }) {
  return (
    <div className="empty-state">
      <span className="empty-state-icon">
        <Icon name={icon} size={28} />
      </span>
      <p className="empty-state-title">{title}</p>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action, id }: { children: React.ReactNode; action?: React.ReactNode; id?: string }) {
  return (
    <div className="section-title" id={id}>
      <h2>
        <Icon name="star8" size={16} className="section-title-star" />
        {children}
      </h2>
      {action}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: React.ReactNode; icon?: IconName }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="segmented" role="tablist" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          className={value === o.value ? 'active' : ''}
          onClick={() => onChange(o.value)}
        >
          {o.icon && <Icon name={o.icon} size={16} />}
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="search-field">
      <Icon name="search" size={18} />
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="Hapus pencarian">
          <Icon name="x" size={16} />
        </button>
      )}
    </label>
  );
}

export function Stat({ label, value, tone = 'emerald' }: { label: string; value: React.ReactNode; tone?: 'emerald' | 'gold' | 'sky' | 'rose' }) {
  return (
    <div className={`stat stat-${tone}`}>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
