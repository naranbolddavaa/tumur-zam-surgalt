import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Card { title: string; color: string; desc: string; }
interface Quiz { question: string; options: string[]; answer: number; explanation: string; }

export default function ChapterView() {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const [card, setCard] = useState<Card | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');

  const cards: Card[][] = [
    [{ title: 'Журмын зорилго (1.1)', color: '#f0c040', desc: 'Төмөр замын байгууламж, техник тоног төхөөрөмж, хөдлөх бүрэлдэхүүний үндсэн хэмжээ болон ашиглалт, засвар, үйлчилгээнд тавигдах шаардлага, галт тэрэгний хөдөлгөөнийг зохион байгуулах журам, горим, зарчмыг тогтооход оршино.' },
    { title: 'Хамрах хүрээ (1.2)', color: '#2563eb', desc: 'Суурь бүтэц эзэмшигч, тээвэрлэгч, зам талбай эзэмшигч, холбогдох хуулийн этгээд дагаж мөрдөнө.' },
    { title: 'Ажилтны үүрэг (1.4)', color: '#16a34a', desc: 'Хууль, дүрэм, журмыг чанд биелүүлэх; зорчигчид эелдэг үйлчлэх; ачааг бүрэн бүтэн тээвэрлэх.' }],
    [{ title: 'Депо, засварын газар (4.1)', color: '#f0c040', desc: 'Зүтгүүр, вагоны депо, техник үйлчилгээний газар нь галт тэрэгний хөдөлгөөний зурмагт тохирсон байх.' },
    { title: 'Сэргээн босгох ГТ (4.3)', color: '#dc2626', desc: 'Суурь бүтэц эзэмшигч нь сэргээн босгох болон гал унтраах галт тэрэгтэй байна.' }],
  ];

  const quizzes: Quiz[] = [
    { question: 'Журмын зорилго юу вэ? (1.1)', options: ['Тариф тогтоох', 'Байгууламжийн шаардлага, хөдөлгөөний журам тогтоох', 'Ажилтны цалин тогтоох', 'Галт тэрэг худалдах'], answer: 1, explanation: 'Байгууламж, тоног төхөөрөмж, хөдлөх бүрэлдэхүүний шаардлага, хөдөлгөөний журам тогтоох.' },
    { question: 'Хэн дагаж мөрдөх вэ? (1.2)', options: ['Зөвхөн машинч', 'Суурь бүтэц, тээвэрлэгч, зам эзэмшигч бүгд', 'Зөвхөн захирал', 'Гадаадын иргэд'], answer: 1, explanation: 'Суурь бүтэц эзэмшигч, тээвэрлэгч, зам эзэмшигч бүгд дагаж мөрдөнө.' },
  ];

  function handleAnswer(ai: number) {
    if (done) return;
    const q = quizzes[qIdx];
    if (ai === q.answer) {
      setScore(s => s + 1);
      setFeedback('✅ Зөв! ' + q.explanation);
    } else {
      setFeedback('❌ Буруу. ' + q.explanation);
    }
    if (qIdx + 1 >= quizzes.length) {
      setDone(true);
      fetch('/api/scores', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` }, body: JSON.stringify({ chapter: id, score, total: quizzes.length }) }).catch(() => {});
    } else {
      setTimeout(() => { setQIdx(i => i + 1); setFeedback(''); }, 1200);
    }
  }

  const tabs = ['📖 Нийтлэг', '📋 Дэлгэрэнгүй', '📝 Тест'];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <Link to="/chapters" style={{ fontSize: '.82rem', color: '#2563eb', textDecoration: 'none' }}>← Бүлгүүд</Link>
      <h2 style={{ marginTop: 8, marginBottom: 16 }}>1-р бүлэг: Нийтлэг үндэслэл</h2>
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: tab === i ? 700 : 500, background: tab === i ? '#fff' : '#e2e8f0', color: tab === i ? '#1e293b' : '#64748b', fontSize: '.85rem' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {cards[0].map((c, i) => (
            <div key={i} onClick={() => setCard(card?.title === c.title ? null : c)}
              style={{ cursor: 'pointer', background: '#1a2233', borderRadius: 10, padding: 16, color: '#fff', border: card?.title === c.title ? `2px solid ${c.color}` : '2px solid transparent', transition: 'all .2s' }}>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: c.color, marginBottom: 4 }}>{c.title}</div>
              {card?.title === c.title && <p style={{ fontSize: '.82rem', color: '#e2e8f0', lineHeight: 1.6, marginTop: 8 }}>{c.desc}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {cards[1].map((c, i) => (
            <div key={i} onClick={() => setCard(card?.title === c.title ? null : c)}
              style={{ cursor: 'pointer', background: '#1a2233', borderRadius: 10, padding: 16, color: '#fff', border: card?.title === c.title ? `2px solid ${c.color}` : '2px solid transparent' }}>
              <div style={{ fontWeight: 700, fontSize: '.88rem', color: c.color }}>{c.title}</div>
              {card?.title === c.title && <p style={{ fontSize: '.82rem', color: '#e2e8f0', lineHeight: 1.6, marginTop: 8 }}>{c.desc}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 2 && !done && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          <div style={{ background: '#1a2233', color: '#f0c040', borderRadius: 5, padding: '2px 10px', fontSize: '.78rem', display: 'inline-block', marginBottom: 12 }}>Асуулт {qIdx + 1}/{quizzes.length}</div>
          <p style={{ fontWeight: 600, marginBottom: 16 }}>{quizzes[qIdx].question}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quizzes[qIdx].options.map((o, i) => (
              <button key={i} onClick={() => handleAnswer(i)} style={{ padding: '10px 14px', border: '2px solid #e2e8f0', borderRadius: 8, background: '#f8fafc', cursor: 'pointer', textAlign: 'left', fontSize: '.88rem' }}>{o}</button>
            ))}
          </div>
          {feedback && <p style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: '.85rem', background: feedback.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: feedback.startsWith('✅') ? '#166534' : '#991b1b' }}>{feedback}</p>}
        </div>
      )}
      {tab === 2 && done && (
        <div style={{ textAlign: 'center', background: 'linear-gradient(135deg, #1a2233, #243352)', borderRadius: 12, padding: 40, color: '#fff' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f0c040' }}>{score}/{quizzes.length}</div>
          <p style={{ marginTop: 8, opacity: .8 }}>
            {score === quizzes.length ? '🏆 Гайхалтай!' : score >= quizzes.length / 2 ? '👍 Сайн!' : '📖 Дахин үзнэ үү.'}
          </p>
        </div>
      )}
    </div>
  );
}
