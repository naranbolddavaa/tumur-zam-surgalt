import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

export default function Header() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  async function handleLogin() {
    const e = await login(email, pass);
    if (e) setErr(e); else { setShowLogin(false); setErr(''); }
  }

  function getMedal(p: number) {
    if (p >= 100) return '🥇 Алт';
    if (p >= 50) return '🥈 Мөнгө';
    if (p >= 20) return '🥉 Хүрэл';
    return '📚 Суралцагч';
  }

  return (
    <header style={{ background: 'linear-gradient(135deg, #1a2233, #243352)', color: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
      <div>
        <Link to="/" style={{ color: '#f0c040', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 700 }}>🚂 Төмөр замын сургалт</Link>
      </div>
      <nav style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/chapters" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '.85rem' }}>📚 Бүлгүүд</Link>
        <Link to="/leaderboard" style={{ color: '#e2e8f0', textDecoration: 'none', fontSize: '.85rem' }}>🏆 Рейтинг</Link>
        {user?.role === 'admin' && <Link to="/admin" style={{ color: '#f0c040', textDecoration: 'none', fontSize: '.85rem' }}>🛡️ Админ</Link>}
        {user ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: '.8rem', color: '#f0c040' }}>{getMedal(user.points)}</span>
            <span style={{ fontSize: '.85rem' }}>👤 {user.lastName} {user.firstName}</span>
            <button onClick={logout} style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', color: '#fff', padding: '4px 12px', borderRadius: 6, cursor: 'pointer', fontSize: '.8rem' }}>🚪</button>
          </div>
        ) : (
          <button onClick={() => setShowLogin(!showLogin)} style={{ background: '#f0c040', border: 'none', color: '#1a2233', padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 700, fontSize: '.85rem' }}>🔑 Нэвтрэх</button>
        )}
      </nav>
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 360 }}>
            <h3 style={{ marginBottom: 16 }}>🔑 Нэвтрэх</h3>
            {err && <p style={{ color: '#dc2626', fontSize: '.82rem', marginBottom: 8 }}>{err}</p>}
            <input placeholder="Имэйл" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8, border: '1px solid #e2e8f0', borderRadius: 6 }} />
            <input type="password" placeholder="Нууц үг" value={pass} onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 12, border: '1px solid #e2e8f0', borderRadius: 6 }} />
            <button onClick={handleLogin} style={{ width: '100%', padding: 10, background: '#1a2233', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700 }}>Нэвтрэх</button>
            <button onClick={() => setShowLogin(false)} style={{ width: '100%', padding: 8, marginTop: 8, background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>✕ Хаах</button>
          </div>
        </div>
      )}
    </header>
  );
}
