import { Link } from 'react-router-dom';

const regulations = [
  { name: 'Техник ашиглалтын журам', icon: '📘', chapters: 15, desc: 'Байгууламж, төхөөрөмж, хөдлөх бүрэлдэхүүний шаардлага' },
  { name: 'Дохиолол, холбооны журам', icon: '📗', chapters: 9, desc: 'Дохионы тогтолцоо, хэрэгсэл, холбооны шаардлага' },
  { name: 'Хөдөлгөөний удирдлагын журам', icon: '📙', chapters: 16, desc: 'Галт тэрэгний хөдөлгөөн зохион байгуулалт' },
];

export default function Home() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: '1.4rem', marginBottom: 8 }}>🚂 Төмөр замын тээврийн нийтлэг багц дүрэм</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Интерактив сургалтын материал — 3 үндсэн журам, 40+ бүлэг</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {regulations.map((r, i) => (
          <Link to="/chapters" key={i} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,.06)', border: '1px solid #e2e8f0', transition: 'transform .2s', cursor: 'pointer' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{r.icon}</div>
              <h3 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: 4 }}>{r.name}</h3>
              <p style={{ fontSize: '.82rem', color: '#64748b', marginBottom: 8 }}>{r.desc}</p>
              <span style={{ background: '#1a2233', color: '#f0c040', borderRadius: 20, padding: '2px 12px', fontSize: '.76rem', fontWeight: 600 }}>{r.chapters} бүлэг</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
