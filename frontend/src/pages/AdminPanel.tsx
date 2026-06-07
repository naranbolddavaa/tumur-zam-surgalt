import { useState } from 'react';

export default function AdminPanel() {
  const [tab, setTab] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState(0);
  const [msg, setMsg] = useState('');

  async function addMaterial() {
    const r = await fetch('/api/materials', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ title, content, regulation: 0, chapter: 1 })
    });
    const d = await r.json();
    setMsg(d.error ? '❌ ' + d.error : '✅ Материал нэмэгдлээ!');
    if (!d.error) { setTitle(''); setContent(''); }
  }

  async function addQuiz() {
    const r = await fetch('/api/quizzes', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ question, options, answer, regulation: 0, chapter: 1 })
    });
    const d = await r.json();
    setMsg(d.error ? '❌ ' + d.error : '✅ Тест нэмэгдлээ!');
    if (!d.error) { setQuestion(''); setOptions(['', '', '', '']); }
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

      {tab === 0 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '.85rem' }}>Гарчиг</label>
          <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} placeholder="Материалын гарчиг" />
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '.85rem' }}>Агуулга</label>
          <textarea value={content} onChange={e => setContent(e.target.value)} rows={5} style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} placeholder="HTML дэмжинэ" />
          <button onClick={addMaterial} style={{ padding: '10px 24px', background: '#1a2233', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>💾 Хадгалах</button>
        </div>
      )}

      {tab === 1 && (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 4, fontSize: '.85rem' }}>Асуулт</label>
          <input value={question} onChange={e => setQuestion(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          {options.map((o, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <label style={{ fontSize: '.8rem', fontWeight: 600 }}>{i === 0 ? '✅ Зөв хариулт' : `❌ Хариулт ${i + 1}`}</label>
              <input value={o} onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n) }} style={{ width: '100%', padding: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
            </div>
          ))}
          <button onClick={addQuiz} style={{ padding: '10px 24px', background: '#1a2233', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>💾 Хадгалах</button>
        </div>
      )}
    </div>
  );
}
