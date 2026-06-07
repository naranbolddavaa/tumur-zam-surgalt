import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

function getMedal(p: number) { if (p >= 100) return '🥇 Алт'; if (p >= 50) return '🥈 Мөнгө'; if (p >= 20) return '🥉 Хүрэл'; return '📚 Суралцагч'; }

export default function Header() {
  const { user, login, logout } = useAuth();
  const nav = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [isReg, setIsReg] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', lastName: '', firstName: '', org: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    setErr(''); setBusy(true);
    let e: string | null = null;
    if (isReg) {
      e = await (window as any).__authRegister?.(form) || await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }).then(r => r.json()).then(d => d.error || (localStorage.setItem('token', d.token), window.location.reload(), null));
    } else {
      e = await login(form.email, form.password);
    }
    setBusy(false);
    if (e) setErr(e); else { setShowLogin(false); setErr(''); setForm({ email: '', password: '', lastName: '', firstName: '', org: '' }); }
  }

  return (
    <header style={{ background: 'linear-gradient(135deg, #1a2233, #243352)', color: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
      <Link to="/" style={{ color: '#f0c040', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 700 }}>🚂 Төмөр замын сургалт</Link>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/chapters" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '.85rem' }}>📚 Бүлгүүд</Link>
        <Link to="/leaderboard" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '.85rem' }}>🏆 Рейтинг</Link>
        {user?.role === 'admin' && <Link to="/admin" style={{ color: '#f0c040', textDecoration: 'none', fontSize: '.85rem' }}>🛡️ Админ</Link>}
        {user ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: '.8rem', color: '#f0c040', fontWeight: 600 }}>{getMedal(user.points || 0)}</span>
            <span style={{ fontSize: '.85rem' }}>👤 {user.lastName} {user.firstName}</span>
            <span style={{ background: 'rgba(255,255,255,.1)', padding: '2px 8px', borderRadius: 10, fontSize: '.75rem' }}>{user.points || 0} оноо</span>
            <button onClick={logout} style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>🚪</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)} style={{ background: '#f0c040', border: 'none', color: '#1a2233', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '.85rem' }}>🔑 Нэвтрэх</button>
        )}
      </nav>

      {showLogin && (
        <div onClick={e => { if (e.target === e.currentTarget) setShowLogin(false) }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: 380, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3>{isReg ? '📝 Бүртгүүлэх' : '🔑 Нэвтрэх'}</h3>
              <button onClick={() => setShowLogin(false)} style={{ background: '#e2e8f0', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>
            {err && <p style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: 6, marginBottom: 12, fontSize: '.84rem' }}>{err}</p>}
            {isReg && <>
              <input placeholder="Овог" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} style={inputStyle} />
              <input placeholder="Нэр" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} style={inputStyle} />
              <input placeholder="Байгууллага" value={form.org} onChange={e => setForm({ ...form, org: e.target.value })} style={inputStyle} />
            </>}
            <input type="email" placeholder="Имэйл" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input type="password" placeholder="Нууц үг (хамгийн бага 6 тэмдэгт)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            <button onClick={handleSubmit} disabled={busy} style={{ width: '100%', padding: 12, background: '#1a2233', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '.9rem', opacity: busy ? .6 : 1 }}>
              {busy ? 'Түр хүлээнэ үү...' : isReg ? 'Бүртгүүлэх' : 'Нэвтрэх'}
            </button>
            <p onClick={() => { setIsReg(!isReg); setErr(''); }} style={{ textAlign: 'center', marginTop: 14, fontSize: '.85rem', color: '#2563eb', cursor: 'pointer' }}>
              {isReg ? 'Бүртгэлтэй юу? Нэвтрэх →' : 'Бүртгэлгүй юу? Бүртгүүлэх →'}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}

const inputStyle: React.CSSProperties = { width: '100%', padding: 10, marginBottom: 10, border: '2px solid #e2e8f0', borderRadius: 8, fontSize: '.9rem', outline: 'none' };
