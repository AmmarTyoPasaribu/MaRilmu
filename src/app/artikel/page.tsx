import type { Metadata } from 'next';
import ArtikelView from './ArtikelView';

export const metadata: Metadata = {
  title: 'Artikel Islami',
  description: 'Bacaan singkat seputar ibadah, adab, akhlak dan muamalah dalam Islam.',
};

export default function ArtikelPage() {
  return <ArtikelView />;
}
