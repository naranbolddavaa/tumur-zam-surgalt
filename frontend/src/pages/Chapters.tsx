import { Link } from 'react-router-dom';

const chData = [
  { reg: '📘 Техник ашиглалтын журам', chapters: [
    'Нийтлэг үндэслэл','Байгууламж, төхөөрөмж','Замын аж ахуй','Зүтгүүр, вагоны аж ахуй',
    'Өртөөний аж ахуй','Холбоо, дохиолол','Цахилгаан, ус хангамж','Үзлэг, засвар',
    'Хөдлөх бүрэлдэхүүн','Тоормос, авто угсраа','Арчлалт, техник үйлчилгээ',
    'Хөдөлгөөн зохион байгуулалт, Хэсэглэх газар','Өртөөний ажлын зохион байгуулалт',
    'Галт тэрэгний хөдөлгөөн','Дохиолол, холбооны шаардлага'
  ]},
];

export default function Chapters() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>📚 Бүлгүүд</h2>
      {chData.map((reg, ri) => (
        <div key={ri} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: 12, color: '#1e293b' }}>{reg.reg}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
            {reg.chapters.map((ch, ci) => (
              <Link to={`/chapter/${ri}-${ci}`} key={ci} style={{ textDecoration: 'none' }}>
                <div style={{ background: '#fff', borderRadius: 8, padding: '10px 14px', border: '1px solid #e2e8f0', fontSize: '.85rem', color: '#1e293b', transition: 'all .15s' }}>
                  <b style={{ color: '#2563eb', marginRight: 8 }}>{ci + 1}.</b> {ch}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
