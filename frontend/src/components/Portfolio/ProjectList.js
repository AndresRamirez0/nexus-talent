import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/api';
import ProjectForm from './ProjectForm';
import { useAuth } from '../../context/AuthContext';

const ProjectList = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const fetchProjects = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const res = await portfolioService.getPublicPortfolio(user.id);
      if (res.data && res.data.portafolio && res.data.portafolio.proyectos) {
        setProjects(res.data.portafolio.proyectos);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error('Error fetching projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await portfolioService.removeProject(id);
        fetchProjects();
      } catch (err) {
        console.error('Error deleting project', err);
        alert('Error al eliminar el proyecto');
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingProject(null);
    fetchProjects();
  };

  const handleEdit = (proj) => {
    setEditingProject(proj);
    setShowForm(true);
  };

  if (loading) return <div>Cargando proyectos...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Mis Proyectos</h3>
        {!showForm && (
          <button style={styles.addBtn} onClick={() => { setEditingProject(null); setShowForm(true); }}>
            + Nuevo Proyecto
          </button>
        )}
      </div>

      {showForm && (
        <ProjectForm 
          project={editingProject} 
          onSave={handleSave} 
          onCancel={() => { setShowForm(false); setEditingProject(null); }} 
        />
      )}

      {!showForm && projects.length === 0 && (
        <p style={styles.empty}>Aún no tienes proyectos en tu portafolio.</p>
      )}

      {!showForm && projects.map(proj => (
        <div key={proj.id} style={styles.projectCard}>
          <img src={proj.imagen_url} alt={proj.titulo} style={styles.image} />
          <div style={styles.details}>
            <h4 style={styles.projTitle}>{proj.titulo}</h4>
            <p style={styles.desc}>{proj.descripcion}</p>
            <div style={styles.tags}>
              {proj.tecnologias.map((tech, i) => <span key={i} style={styles.tag}>{tech}</span>)}
            </div>
            <div style={styles.links}>
              {proj.enlace_proyecto && <a href={proj.enlace_proyecto} target="_blank" rel="noreferrer" style={styles.link}>Ver Proyecto</a>}
              {proj.enlace_repositorio && <a href={proj.enlace_repositorio} target="_blank" rel="noreferrer" style={styles.link}>Repositorio</a>}
            </div>
            <div style={styles.actions}>
              <button style={styles.editBtn} onClick={() => handleEdit(proj)}>Editar</button>
              <button style={styles.delBtn} onClick={() => handleDelete(proj.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: { marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#2E5BA8', margin: 0 },
  addBtn: { backgroundColor: '#2E5BA8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
  empty: { color: '#777', fontStyle: 'italic', marginTop: '20px' },
  projectCard: { display: 'flex', gap: '20px', border: '1px solid #e0e0e0', borderRadius: '8px', padding: '16px', marginTop: '20px', backgroundColor: 'white' },
  image: { width: '200px', height: '150px', objectFit: 'cover', borderRadius: '6px' },
  details: { flex: 1, display: 'flex', flexDirection: 'column' },
  projTitle: { margin: '0 0 10px 0', fontSize: '18px', color: '#333' },
  desc: { margin: '0 0 10px 0', color: '#555', fontSize: '14px', lineHeight: '1.5' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' },
  tag: { backgroundColor: '#e8f0fe', color: '#2E5BA8', padding: '3px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },
  links: { display: 'flex', gap: '15px', marginBottom: '10px' },
  link: { color: '#2E5BA8', textDecoration: 'none', fontSize: '14px', fontWeight: '500' },
  actions: { marginTop: 'auto', display: 'flex', gap: '10px' },
  editBtn: { backgroundColor: '#f0f0f0', color: '#333', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  delBtn: { backgroundColor: '#ffebee', color: '#c62828', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
};

export default ProjectList;
