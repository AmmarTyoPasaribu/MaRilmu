'use client';

import { useState } from 'react';
import Icon from '@/components/Icon';
import { PageHeader, Page } from '@/components/ui';
import { useHydrated, useStored } from '@/lib/store';
import quizData from '@/data/quiz.json';

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const BANK = quizData as Question[];
const ROUND = 10;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Acak urutan soal dan urutan opsi jawaban. */
function buildRound(): Question[] {
  return shuffle(BANK)
    .slice(0, ROUND)
    .map((q) => {
      const order = shuffle(q.options.map((_, i) => i));
      return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) };
    });
}

export default function QuizView() {
  const hydrated = useHydrated();
  const [round, setRound] = useState<Question[] | null>(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [best, setBest] = useStored<number>('marilmu:quiz-best', 0);

  const start = () => {
    setRound(buildRound());
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  const answer = (i: number) => {
    if (selected != null || !round) return;
    setSelected(i);
    if (i === round[index].answer) setScore((s) => s + 1);
    navigator.vibrate?.(i === round[index].answer ? 20 : [30, 50, 30]);
  };

  const next = () => {
    if (!round) return;
    if (index + 1 >= round.length) {
      setFinished(true);
      if (score > best) setBest(score);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  if (!round) {
    return (
      <Page width="narrow">
        <PageHeader icon="cap" title="Kuis Islami" subtitle="10 soal acak dari bank soal — Al-Quran, sejarah nabi, dan fiqih ibadah" />
        <div className="card quiz-start">
          <span className="quiz-start-icon">
            <Icon name="trophy" size={40} strokeWidth={1.4} />
          </span>
          <h2>Siap menguji pengetahuanmu?</h2>
          <p className="muted">
            {BANK.length} soal di bank soal · {ROUND} soal per sesi · penjelasan di setiap jawaban
          </p>
          {hydrated && best > 0 && <p className="badge gold">Skor terbaikmu: {best}/{ROUND}</p>}
          <button className="btn btn-gold" onClick={start}>
            <Icon name="play" size={16} /> Mulai kuis
          </button>
        </div>
      </Page>
    );
  }

  if (finished) {
    const pct = Math.round((score / round.length) * 100);
    return (
      <Page width="narrow">
        <PageHeader icon="trophy" title="Kuis selesai" subtitle={pct >= 80 ? 'Masya Allah, luar biasa!' : pct >= 50 ? 'Bagus! Terus belajar.' : 'Semangat, terus belajar ya!'} />
        <div className="card quiz-start">
          <div className="quiz-score">
            <svg viewBox="0 0 120 120" aria-hidden>
              <circle cx="60" cy="60" r="52" className="quiz-score-track" />
              <circle cx="60" cy="60" r="52" className="quiz-score-fill" strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - score / round.length)} transform="rotate(-90 60 60)" />
            </svg>
            <span>
              <b>{score}</b>/{round.length}
            </span>
          </div>
          <p className="muted">Skor terbaik: {Math.max(best, score)}/{ROUND}</p>
          <button className="btn btn-gold" onClick={start}>
            <Icon name="refresh" size={16} /> Main lagi
          </button>
        </div>
      </Page>
    );
  }

  const q = round[index];
  const answered = selected != null;
  return (
    <Page width="narrow">
      <PageHeader icon="cap" title="Kuis Islami" subtitle={`Soal ${index + 1} dari ${round.length}`} />
      <div className="quiz-meta">
        <div className="progress">
          <span style={{ width: `${((index + (answered ? 1 : 0)) / round.length) * 100}%` }} />
        </div>
        <span className="badge gold">Skor {score}</span>
      </div>
      <article className="card quiz-card" key={q.id}>
        <h2>{q.question}</h2>
        <div className="quiz-options">
          {q.options.map((opt, i) => {
            const state = !answered ? '' : i === q.answer ? ' correct' : i === selected ? ' wrong' : ' dim';
            return (
              <button key={opt} className={`quiz-option${state}`} onClick={() => answer(i)} disabled={answered}>
                <span className="quiz-letter">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
                {answered && i === q.answer && <Icon name="checkCircle" size={20} />}
                {answered && i === selected && i !== q.answer && <Icon name="x" size={20} />}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className={`quiz-explain${selected === q.answer ? ' ok' : ' no'}`}>
            <strong>{selected === q.answer ? 'Benar!' : 'Kurang tepat'}</strong>
            <p>{q.explanation}</p>
          </div>
        )}
        {answered && (
          <button className="btn btn-primary btn-block mt-2" onClick={next}>
            {index + 1 >= round.length ? 'Lihat hasil' : 'Soal berikutnya'} <Icon name="arrowRight" size={18} />
          </button>
        )}
      </article>
    </Page>
  );
}
