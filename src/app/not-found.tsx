import Link from 'next/link';
import { EmptyState, Page } from '@/components/ui';

export default function NotFound() {
  return (
    <Page width="narrow">
      <EmptyState icon="compass" title="Halaman tidak ditemukan">
        <p>Mungkin tautannya keliru atau halaman sudah dipindahkan.</p>
        <Link href="/" className="btn btn-primary mt-2">
          Kembali ke beranda
        </Link>
      </EmptyState>
    </Page>
  );
}
