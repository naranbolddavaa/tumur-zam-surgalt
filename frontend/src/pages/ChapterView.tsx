import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

interface Card { title: string; color: string; desc: string; icon?: string; }
interface QuizItem { question: string; options: string[]; answer: number; explanation: string; }

const REG_NAMES = ['📘 Техник ашиглалтын журам', '📗 Дохиолол, холбооны журам', '📙 Хөдөлгөөний удирдлагын журам'];

export default function ChapterView() {
  const { id } = useParams();
  const [reg, ch] = (id || '0-0').split('-').map(Number);
  const [subtab, setSubtab] = useState(0);
  const [tab, setTab] = useState(0);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.quizzes.list(reg, ch + 1).then(qs => {
      setQuizzes(qs.map((q: any) => ({ question: q.question, options: q.options, answer: q.answer, explanation: q.explanation || '' })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const allCards: Card[][] = [
    [ // Subtab 0 - General
      { title: 'Журмын зорилго (1.1)', color: '#f0c040', icon: '🎯', desc: 'Төмөр замын байгууламж, техник тоног төхөөрөмж, хөдлөх бүрэлдэхүүний үндсэн хэмжээ болон ашиглалт, засвар, үйлчилгээнд тавигдах шаардлага, галт тэрэгний хөдөлгөөнийг зохион байгуулах журам, горим, зарчмыг тогтооход оршино.' },
      { title: 'Хамрах хүрээ (1.2)', color: '#2563eb', icon: '📋', desc: 'Суурь бүтэц эзэмшигч, тээвэрлэгч, нийтийн болон дагнасан хэрэглээний зам талбай эзэмшигч, холбоотой үйл ажиллагаа явуулагч бүгд дагаж мөрдөнө.' },
      { title: 'Бусад журамтай уялдаа (1.3)', color: '#16a34a', icon: '🔗', desc: 'Байгууламж, тоног төхөөрөмж, хөдлөх бүрэлдэхүүнтэй холбоотой бүх дүрэм, журам, заавар нь энэхүү журмаар тогтоосон шаардлагад нийцсэн байна.' },
    ],
    [ // Subtab 1 - Duties
      { title: 'Хууль, дүрмийг сахих (1.4а)', color: '#f0c040', icon: '👷', desc: 'Хууль тогтоомж, дүрэм журам, технологийн горим, стандарт, нормын шаардлагын дагуу тээврийн техник хэрэгслийг ашиглах, арчлах.' },
      { title: 'Зорчигчдод үйлчлэх (1.4б)', color: '#2563eb', icon: '🤝', desc: 'Зорчигчийн аялах аятай нөхцөлийг бүрдүүлэн эелдэг, уриалгахан, хөнгөн шуурхай үйлчлэх.' },
      { title: 'Ачааг бүрэн тээвэрлэх (1.4в)', color: '#16a34a', icon: '📦', desc: 'Ачаа, тээш, ачаан тээшийг бүрэн бүтэн тээвэрлэх; эрэлт хэрэгцээ, аюулгүй, найдвартай, тасралтгүй ажиллагааг хангах.' },
    ],
  ];

  function handleAnswer(ai: number) {
    if (done) return;
    const q = quizzes[qIdx];
    const isCorrect = ai === q.answer;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? '✅ Зөв! ' + q.explanation : '❌ Буруу. ' + q.explanation);
    const nextIdx = qIdx + 1;
    if (nextIdx >= quizzes.length) {
      setDone(true);
      api.scores.save(id || 'unknown', score + (isCorrect ? 1 : 0), quizzes.length).catch(() => {});
    } else {
      setTimeout(() => { setQIdx(nextIdx); setFeedback(''); }, 1500);
    }
  }

  const tabs = ['📖 Нийтлэг', '📋 Дэлгэрэнгүй', '📝 Тест'];
  const subtabs = ['Ерөнхий', 'Ажилтны үүрэг'];

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>⏳ Ачаалж байна...</div>;

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: 24 }}>
      <Link to="/chapters" style={{ fontSize: '.82rem', color: '#2563eb', textDecoration: 'none' }}>← Бүлгүүд</Link>
      <h2 style={{ margin: '8px 0 4px' }}>Бүлэг {ch + 1}: Нийтлэг үндэслэл</h2>
      <p style={{ fontSize: '.8rem', color: '#64748b', marginBottom: 16 }}>{REG_NAMES[reg] || ''}</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 0 }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={tabStyle(tab === i)}>{t}</button>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '0 12px 12px 12px', padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,.06)', minHeight: 300 }}>
        {tab === 0 && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {subtabs.map((s, i) => (
                <button key={i} onClick={() => setSubtab(i)} style={subtabStyle(subtab === i)}>{s}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
              {(allCards[subtab] || []).map((c, i) => (
                <div key={i} onClick={() => setSelectedCard(selectedCard?.title === c.title ? null : c)}
                  style={{ cursor: 'pointer', background: '#1a2233', borderRadius: 10, padding: 18, color: '#fff', border: `2px solid ${selectedCard?.title === c.title ? c.color : 'transparent'}`, transition: 'all .2s' }}>
                  <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{c.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '.88rem', color: c.color, marginBottom: 4 }}>{c.title}</div>
                  {selectedCard?.title === c.title && <p style={{ fontSize: '.84rem', color: '#e2e8f0', lineHeight: 1.7, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,.1)' }}>{c.desc}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 1 && (
          <div style={{ color: '#64748b', textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📋</div>
            <p>Энэ хэсэгт дэлгэрэнгүй хүснэгт, зургийн мэдээлэл байрлана.</p>
          </div>
        )}

        {tab === 2 && quizzes.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📝</div>
            <p>Энэ бүлэгт тест оруулаагүй байна. Админаар нэвтэрч тест нэмнэ үү.</p>
          </div>
        )}

        {tab === 2 && quizzes.length > 0 && !done && (
          <div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
              {quizzes.map((_, i) => (
                <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < qIdx ? '#16a34a' : i === qIdx ? '#2563eb' : '#e2e8f0' }} />
              ))}
            </div>
            <div style={{ background: '#1a2233', color: '#f0c040', borderRadius: 5, padding: '2px 10px', fontSize: '.78rem', display: 'inline-block', marginBottom: 12 }}>Асуулт {qIdx + 1}/{quizzes.length}</div>
            <p style={{ fontWeight: 600, fontSize: '.95rem', marginBottom: 20 }}>{quizzes[qIdx].question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {quizzes[qIdx].options.map((o, i) => (
                <button key={i} onClick={() => handleAnswer(i)} disabled={!!feedback}
                  style={{ padding: '12px 16px', border: `2px solid ${feedback && i === quizzes[qIdx].answer ? '#16a34a' : feedback ? '#e2e8f0' : '#e2e8f0'}`, borderRadius: 8, background: feedback && i === quizzes[qIdx].answer ? '#dcfce7' : '#f8fafc', cursor: feedback ? 'default' : 'pointer', textAlign: 'left', fontSize: '.9rem', opacity: feedback && i !== quizzes[qIdx].answer ? .6 : 1 }}>
                  {o}
                </button>
              ))}
            </div>
            {feedback && <p style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, fontSize: '.88rem', lineHeight: 1.5, background: feedback.startsWith('✅') ? '#dcfce7' : '#fee2e2', color: feedback.startsWith('✅') ? '#166534' : '#991b1b' }}>{feedback}</p>}
          </div>
        )}

        {tab === 2 && done && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>{score === quizzes.length ? '🏆' : score >= quizzes.length / 2 ? '👍' : '📖'}</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: score === quizzes.length ? '#f0c040' : '#1e293b' }}>{score}/{quizzes.length}</div>
            <p style={{ marginTop: 8, opacity: .7 }}>
              {score === quizzes.length ? 'Гайхалтай! Бүх асуултанд зөв хариуллаа!' : score >= quizzes.length / 2 ? 'Сайн! Дахин үзээрэй.' : 'Дахин судалж үзэхийг зөвлөж байна.'}
            </p>
            <button onClick={() => { setQIdx(0); setScore(0); setDone(false); setFeedback(''); }}
              style={{ marginTop: 20, padding: '10px 24px', background: '#1a2233', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>🔄 Дахин эхлэх</button>
          </div>
        )}
      </div>
    </div>
  );
}

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '10px 18px', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer',
  fontWeight: active ? 700 : 500, background: active ? '#fff' : '#e2e8f0',
  color: active ? '#1e293b' : '#64748b', fontSize: '.85rem'
});

const subtabStyle = (active: boolean): React.CSSProperties => ({
  padding: '6px 14px', border: 'none', borderRadius: 20, cursor: 'pointer',
  fontWeight: active ? 700 : 500, background: active ? '#1a2233' : '#e2e8f0',
  color: active ? '#f0c040' : '#64748b', fontSize: '.8rem'
});
