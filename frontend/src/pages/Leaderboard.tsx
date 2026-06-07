import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/scores/leaderboard').then(r => r.json()).then(setData).catch(() => {});
  }, []);

  function medal(p: number) {
    if (p >= 100) return '🥇';
    if (p >= 50) return '🥈';
    if (p >= 20) return '🥉';
    return '';
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>🏆 Рейтинг — Шилдэг суралцагчид</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <thead>
          <tr style={{ background: '#1a2233', color: '#fff' }}>
            <th style={{ padding: 10 }}>#</th><th style={{ padding: 10 }}>Нэр</th><th style={{ padding: 10 }}>Байгууллага</th><th style={{ padding: 10 }}>Оноо</th><th style={{ padding: 10 }}>Медаль</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#f8fafc' : '#fff' }}>
              <td style={{ padding: 10, textAlign: 'center', fontWeight: 700 }}>{i + 1}</td>
              <td style={{ padding: 10 }}>{r.name}</td>
              <td style={{ padding: 10, fontSize: '.8rem', color: '#64748b' }}>{r.org || '—'}</td>
              <td style={{ padding: 10, textAlign: 'center', fontWeight: 700 }}>{r.points}</td>
              <td style={{ padding: 10, textAlign: 'center', fontSize: '1.2rem' }}>{medal(r.points)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ textAlign: 'center', marginTop: 16, fontSize: '.8rem', color: '#64748b' }}>🥇 100+ | 🥈 50+ | 🥉 20+ оноо</p>
    </div>
  );
}
