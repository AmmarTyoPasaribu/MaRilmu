'use client';

import { useState } from 'react';
import quizData from '@/data/quiz.json';

interface Question { id: number; question: string; options: string[]; answer: number; explanation: string; }

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);
  const questions = quizData as Question[];

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[current].answer) setScore(score + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); return; }
    setCurrent(current + 1);
    setSelected(null);
    setAnswered(false);
  };

  const restart = () => { setCurrent(0); setSelected(null); setScore(0); setAnswered(false); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <>
        <div className="page-header"><div className="container"><h1>🎓 Quiz Selesai!</h1></div></div>
        <div className="page-content">
          <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <div className="card" style={{ padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{pct >= 80 ? '🏆' : pct >= 50 ? '⭐' : '💪'}</div>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, background: 'var(--bg-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{score}/{questions.length}</p>
              <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 1.5rem' }}>Skor: {pct}% — {pct >= 80 ? 'Masya Allah! Luar biasa!' : pct >= 50 ? 'Bagus! Terus belajar!' : 'Semangat! Terus belajar ya!'}</p>
              <button className="filter-btn active" onClick={restart}>🔄 Main Lagi</button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const q = questions[current];

  return (
    <>
      <div className="page-header"><div className="container"><h1>🎓 Quiz Islami</h1><p>Uji pengetahuan Islam kamu!</p></div></div>
      <div className="page-content">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span>Soal {current + 1} / {questions.length}</span>
            <span>Skor: {score}</span>
          </div>
          <div style={{ height: '4px', background: 'var(--border-light)', borderRadius: '2px', marginBottom: '2rem' }}>
            <div style={{ height: '100%', width: `${((current + 1) / questions.length) * 100}%`, background: 'var(--bg-accent)', borderRadius: '2px', transition: 'width 0.3s' }} />
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', lineHeight: 1.5 }}>{q.question}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {q.options.map((opt, i) => {
                let bg = 'var(--bg-card)';
                let border = 'var(--border-light)';
                let color = 'var(--text-primary)';
                if (answered) {
                  if (i === q.answer) { bg = 'rgba(5, 150, 105, 0.1)'; border = 'var(--green-500)'; color = 'var(--text-green)'; }
                  else if (i === selected) { bg = 'rgba(244, 63, 94, 0.1)'; border = '#F43F5E'; color = '#F43F5E'; }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} style={{ padding: '0.85rem 1.25rem', textAlign: 'left', border: `2px solid ${border}`, borderRadius: 'var(--radius-sm)', background: bg, color, cursor: answered ? 'default' : 'pointer', fontFamily: 'var(--font-ui)', fontSize: '0.95rem', transition: 'all 0.2s' }}>
                    <strong style={{ marginRight: '0.5rem' }}>{String.fromCharCode(65 + i)}.</strong> {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${selected === q.answer ? 'var(--green-500)' : '#F43F5E'}` }}>
                <p style={{ fontWeight: 600, color: selected === q.answer ? 'var(--text-green)' : '#F43F5E', marginBottom: '0.25rem' }}>{selected === q.answer ? '✅ Benar!' : '❌ Salah!'}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{q.explanation}</p>
              </div>
            )}
            {answered && (
              <button onClick={next} className="filter-btn active" style={{ marginTop: '1.25rem', width: '100%' }}>
                {current + 1 >= questions.length ? '🏆 Lihat Hasil' : 'Selanjutnya →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
