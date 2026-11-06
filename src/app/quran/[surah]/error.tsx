'use client';

import Link from 'next/link';
import { EmptyState, Page } from '@/components/ui';

export default function SurahError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Page width="narrow">
      <EmptyState icon="alert" title="Surah gagal dimuat">
        <p>Periksa koneksi internet Anda, lalu coba lagi.</p>
        <div className="row mt-2" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={reset}>
            Coba lagi
          </button>
          <Link href="/quran" className="btn btn-outline">
            Daftar surah
          </Link>
        </div>
      </EmptyState>
    </Page>
  );
}
