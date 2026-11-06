import type { Metadata } from 'next';
import TasbihView from './TasbihView';

export const metadata: Metadata = {
  title: 'Tasbih Digital',
  description: 'Penghitung dzikir digital dengan mode tasbih 33-33-33, target kustom, getar, dan rekap total harian.',
};

export default function TasbihPage() {
  return <TasbihView />;
}
