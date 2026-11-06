import type { Metadata } from 'next';
import KisahView from './KisahView';

export const metadata: Metadata = {
  title: 'Kisah 25 Nabi & Rasul',
  description: 'Kisah singkat 25 Nabi dan Rasul yang wajib diketahui beserta hikmah dan pelajarannya.',
};

export default function KisahNabiPage() {
  return <KisahView />;
}
