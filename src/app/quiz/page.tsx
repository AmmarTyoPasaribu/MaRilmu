import type { Metadata } from 'next';
import QuizView from './QuizView';

export const metadata: Metadata = {
  title: 'Kuis Islami',
  description: 'Uji pengetahuan Islam Anda: Al-Quran, sejarah nabi, fiqih ibadah dan sejarah Islam — 10 soal acak setiap sesi.',
};

export default function QuizPage() {
  return <QuizView />;
}
