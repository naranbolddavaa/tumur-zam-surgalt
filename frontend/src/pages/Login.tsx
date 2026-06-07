import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', lastName: '', firstName: '', org: '' });
  const [err, setErr] = useState('');

  async function submit() {
    const e = isReg ? await register(form) : await login(form.email, form.password);
    if (e) setErr(e); else nav('/');
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
      <h2 style={{ marginBottom: 20, textAlign: 'center' }}>{isReg ? '📝 Бүртгүүлэх' : '🔑 Нэвтрэх'}</h2>
      {err && <p style={{ background: '#fee2e2', color: '#991b1b', padding: 8, borderRadius: 6, marginBottom: 12, fontSize: '.85rem' }}>{err}</p>}
      {isReg && (
        <>
          <input placeholder="Овог" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          <input placeholder="Нэр" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
          <input placeholder="Байгууллага" value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
        </>
      )}
      <input type="email" placeholder="Имэйл" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
      <input type="password" placeholder="Нууц үг" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ width: '100%', padding: 10, marginBottom: 16, border: '1px solid #e2e8f0', borderRadius: 6 }} />
      <button onClick={submit} style={{ width: '100%', padding: 12, background: '#1a2233', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>{isReg ? 'Бүртгүүлэх' : 'Нэвтрэх'}</button>
      <p style={{ textAlign: 'center', marginTop: 12, fontSize: '.85rem', color: '#2563eb', cursor: 'pointer' }} onClick={() => setIsReg(!isReg)}>
        {isReg ? 'Бүртгэлтэй юу? Нэвтрэх →' : 'Бүртгэлгүй юу? Бүртгүүлэх →'}
      </p>
    </div>
  );
}
