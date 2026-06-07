import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { portfolioService } from '../services/api';
import ProjectFeedback from '../components/Portfolio/ProjectFeedback';
import { useAuth } from '../context/AuthContext';

const PublicPortfolio = () => {
  const { userId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await portfolioService.getPublicPortfolio(userId);
        setData(res.data);
      } catch (err) {
        setError('Portafolio no encontrado o no disponible.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [userId]);

  if (loading) return <div style={styles.center}>Cargando portafolio...</div>;
  if (error || !data) return <div style={styles.centerError}>{error}</div>;

  const { usuario, portafolio } = data;
  const proyectos = portafolio?.proyectos || [];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.avatar}>{usuario.nombre.charAt(0).toUpperCase()}</div>
        <div>
          <h1 style={styles.name}>{usuario.nombre}</h1>
          <span style={styles.rol}>{usuario.rol}</span>
        </div>
      </div>
      
      <div style={styles.about}>
        <h3>Sobre mí</h3>
        <p>{usuario.descripcion || 'Sin descripción disponible.'}</p>
        <div style={styles.tags}>
          {usuario.habilidades?.map((h, i) => <span key={i} style={styles.tag}>{h}</span>)}
        </div>
        <p><strong>Contacto:</strong> <a href={`mailto:${usuario.email}`}>{usuario.email}</a></p>
      </div>

      <div style={styles.projectsSection}>
        <h2 style={styles.sectionTitle}>{portafolio?.titulo || 'Portafolio de Proyectos'}</h2>
        <p>{portafolio?.descripcion}</p>

        {proyectos.length === 0 ? (
          <p>No hay proyectos publicados aún.</p>
        ) : (
          <div style={styles.grid}>
            {proyectos.map(proj => (
              <div key={proj.id} style={styles.card}>
                <img src={proj.imagen_url} alt={proj.titulo} style={styles.cardImage} />
                <div style={styles.cardContent}>
                  <h4 style={styles.cardTitle}>{proj.titulo}</h4>
                  <p style={styles.cardDesc}>{proj.descripcion}</p>
                  <div style={styles.tags}>
                    {proj.tecnologias.map((tech, i) => <span key={i} style={styles.tag}>{tech}</span>)}
                  </div>
                  <div style={styles.links}>
                    {proj.enlace_proyecto && <a href={proj.enlace_proyecto} target="_blank" rel="noreferrer" style={styles.link}>Ver Proyecto</a>}
                    {proj.enlace_repositorio && <a href={proj.enlace_repositorio} target="_blank" rel="noreferrer" style={styles.link}>Repositorio</a>}
                  </div>
                  <ProjectFeedback projectId={proj.id} isOwner={user && user.id === usuario.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', minHeight: '100vh' },
  center: { textAlign: 'center', marginTop: '100px', fontSize: '18px' },
  centerError: { textAlign: 'center', marginTop: '100px', fontSize: '18px', color: 'red' },
  header: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px', backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#2E5BA8', color: 'white', fontSize: '32px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  name: { margin: '0 0 5px 0', color: '#333' },
  rol: { backgroundColor: '#e8f0fe', color: '#2E5BA8', padding: '4px 12px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' },
  about: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '15px 0' },
  tag: { backgroundColor: '#f0f4f8', color: '#444', padding: '4px 10px', borderRadius: '12px', fontSize: '13px' },
  projectsSection: { marginTop: '40px' },
  sectionTitle: { color: '#2E5BA8', borderBottom: '2px solid #e8f0fe', paddingBottom: '10px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' },
  card: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
  cardImage: { width: '100%', height: '180px', objectFit: 'cover' },
  cardContent: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
  cardTitle: { margin: '0 0 10px 0', fontSize: '18px', color: '#333' },
  cardDesc: { color: '#666', fontSize: '14px', marginBottom: '15px', flex: 1 },
  links: { display: 'flex', gap: '15px', marginTop: '15px' },
  link: { color: '#2E5BA8', textDecoration: 'none', fontWeight: '600', fontSize: '14px' },
};

export default PublicPortfolio;
