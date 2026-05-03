import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>🚀 Nexus Talent</h1>
        <p style={styles.subtitle}>
          La plataforma de portafolios digitales, mentoría y retroalimentación
          para el talento tecnológico y creativo colombiano
        </p>
        {user ? (
          <button style={styles.btn} onClick={() => navigate('/profile')}>
            Ver mi perfil
          </button>
        ) : (
          <div style={styles.btnGroup}>
            <button style={styles.btn} onClick={() => navigate('/register')}>
              Comenzar gratis
            </button>
            <button style={styles.btnOutline} onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
          </div>
        )}
      </div>

      <div style={styles.features}>
        {[
          { icon:'💼', title:'Portafolio Digital', desc:'Muestra tus proyectos de forma profesional' },
          { icon:'🎓', title:'Mentoría', desc:'Conecta con expertos del sector tecnológico' },
          { icon:'⭐', title:'Retroalimentación', desc:'Mejora con comentarios de tus pares' },
        ].map((f, i) => (
          <div key={i} style={styles.featureCard}>
            <div style={styles.featureIcon}>{f.icon}</div>
            <h3 style={styles.featureTitle}>{f.title}</h3>
            <p style={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight:'100vh', backgroundColor:'#f0f4f8' },
  hero: { textAlign:'center', padding:'80px 20px 60px',
    backgroundColor:'#2E5BA8', color:'white' },
  title: { fontSize:'48px', margin:'0 0 16px', fontWeight:'bold' },
  subtitle: { fontSize:'18px', maxWidth:'600px', margin:'0 auto 32px',
    lineHeight:'1.6', color:'#cce0ff' },
  btnGroup: { display:'flex', gap:'16px', justifyContent:'center', flexWrap:'wrap' },
  btn: { padding:'14px 32px', backgroundColor:'white', color:'#2E5BA8',
    border:'none', borderRadius:'8px', fontSize:'16px',
    fontWeight:'bold', cursor:'pointer' },
  btnOutline: { padding:'14px 32px', backgroundColor:'transparent', color:'white',
    border:'2px solid white', borderRadius:'8px', fontSize:'16px',
    fontWeight:'bold', cursor:'pointer' },
  features: { display:'flex', gap:'24px', padding:'60px 40px',
    justifyContent:'center', flexWrap:'wrap' },
  featureCard: { backgroundColor:'white', borderRadius:'12px', padding:'32px',
    textAlign:'center', maxWidth:'280px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)' },
  featureIcon: { fontSize:'40px', marginBottom:'16px' },
  featureTitle: { color:'#2E5BA8', marginBottom:'8px' },
  featureDesc: { color:'#666', lineHeight:'1.6' },
};

export default Home;