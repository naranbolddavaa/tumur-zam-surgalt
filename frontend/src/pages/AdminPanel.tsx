import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

export default function AdminPanel() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [regulation, setRegulation] = useState(0);
  const [chapter, setChapter] = useState(1);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') { setMsg('⚠️ Админ эрх шаардлагатай'); setTimeout(() => nav('/'), 2000); }
  }, [user, nav]);

  async function addMaterial() {
    setBusy(true); setMsg('');
    try {
      await api.materials.create({ title, content, regulation, chapter });
      setMsg('✅ Материал нэмэгдлээ!'); setTitle(''); setContent('');
    } catch (e: any) { setMsg('❌ ' + e.message); }
    setBusy(false);
  }

  async function addQuiz() {
    if (!question || options.some(o => !o)) { setMsg('❌ Бүх талбарыг бөглөнө үү'); return; }
    setBusy(true); setMsg('');
    try {
      await api.quizzes.create({ question, options, answer: 0, explanation: '', regulation, chapter });
      setMsg('✅ Тест нэмэгдлээ!'); setQuestion(''); setOptions(['', '', '', '']);
    } catch (e: any) { setMsg('❌ ' + e.message); }
    setBusy(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>🛡️ Админ самбар</h2>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {['📚 Материал', '📝 Тест'].map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ padding: '8px 16px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: tab === i ? 700 : 500, background: tab === i ? '#1a2233' : '#e2e8f0', color: tab === i ? '#fff' : '#64748b', fontSize: '.85rem' }}>{t}</button>
        ))}
      </div>
      {msg && <p style={{ padding: 8, borderRadius: 6, marginBottom: 12, fontSize: '.85rem', background: msg.startsWith('✅') ? '#dcfce7' : '#fee2e2' }}>{msg}</p>}

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, fontSize: '.85rem' }}>
        <select value={regulation} onChange={e => setRegulation(Number(e.target.value))} style={{ padding: 6, border: '1px solid #e2e8f0', borderRadius: 6 }}>
          <option value={0}>📘 Техник ашиглалтын журам</option>
          <option value={1}>📗 Дохиолол, холбооны журам</option>
          <option value={2}>📙 Хөдөлгөөний удирдлагын журам</option>
        </select>
        <input type="number" min={1} max={20} value={chapter} onChange={e => setChapter(Number(e.target.value))} style={{ width: 70, padding: 6, border: '1px solid #e2e8f0', borderRadius: 6 }} placeholder="Бүлэг" />
        <span style={{ padding: '6px 0', color: '#64748b' }}>Бүлэг {chapter}</span>
      </div>

      {tab === 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '.85rem' }}>Гарчиг</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} placeholder="Материалын гарчиг" />
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '.85rem' }}>Агуулга</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} placeholder="HTML дэмжинэ" />
          <button onClick={addMaterial} disabled={busy} style={{ padding: '10px 24px', background: '#1a2233', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, opacity: busy ? .6 : 1 }}>💾 Хадгалах</button>
        </div>
      )}

      {tab === 1 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '.85rem' }}>Асуулт</label>
          <input value={question} onChange={e => setQuestion(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          {options.map((o, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <label style={{ fontSize: '.8rem', fontWeight: 600 }}>{i === 0 ? '✅ Зөв хариулт' : ` Хариулт ${i + 1}`}</label>
              <input value={o} onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n) }} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
            </div>
          ))}
          <button onClick={addQuiz} disabled={busy} style={{ padding: '10px 24px', background: '#1a2233', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700, opacity: busy ? .6 : 1 }}>💾 Хадгалах</button>
        </div>
      )}
    </div>
  );
}
