'use client';

import Icon from './Icon';
import { copyText, useToast } from './providers/Toast';
import { useSettings } from '@/lib/store';

/** Blok standar: teks Arab, latin, terjemahan + tombol salin. */
export default function ArabicBlock({
  title,
  arabic,
  latin,
  translation,
  source,
  badge,
  children,
  copyLabel,
}: {
  title?: React.ReactNode;
  arabic: string;
  latin?: string;
  translation?: string;
  source?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  copyLabel?: string;
}) {
  const [settings] = useSettings();
  const toast = useToast();
  const onCopy = async () => {
    const text = [title && typeof title === 'string' ? title : '', arabic, latin, translation, source ? `(${source})` : '']
      .filter(Boolean)
      .join('\n\n');
    const ok = await copyText(text + '\n\n— via MaRilmu');
    toast(ok ? 'Teks disalin' : 'Gagal menyalin', ok ? 'checkCircle' : 'alert');
  };
  return (
    <article className="arabic-block">
      {(title || badge) && (
        <header className="arabic-block-head">
          {title && <h3>{title}</h3>}
          {badge}
        </header>
      )}
      <p className="arabic arabic-lg" lang="ar" dir="rtl">
        {arabic}
      </p>
      {latin && settings.showLatin && <p className="latin">{latin}</p>}
      {translation && settings.showTranslation && <p className="translation">{translation}</p>}
      {children}
      <footer className="arabic-block-foot">
        {source ? <span className="source">{source}</span> : <span />}
        <button className="chip-btn" onClick={onCopy} aria-label={copyLabel ?? 'Salin teks'}>
          <Icon name="copy" size={15} /> Salin
        </button>
      </footer>
    </article>
  );
}
