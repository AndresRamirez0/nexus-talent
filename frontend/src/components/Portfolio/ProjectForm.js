import { useState } from 'react';
import { portfolioService } from '../../services/api';

const ProjectForm = ({ project, onSave, onCancel }) => {
  const [form, setForm] = useState({
    titulo: project ? project.titulo : '',
    descripcion: project ? project.descripcion : '',
    tecnologias: project ? project.tecnologias.join(', ') : '',
    enlace_proyecto: project ? project.enlace_proyecto || '' : '',
    enlace_repositorio: project ? project.enlace_repositorio || '' : '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!project && !image) {
      setError('La imagen es obligatoria para un nuevo proyecto');
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('titulo', form.titulo);
      formData.append('descripcion', form.descripcion);
      formData.append('tecnologias', form.tecnologias);
      if (form.enlace_proyecto) formData.append('enlace_proyecto', form.enlace_proyecto);
      if (form.enlace_repositorio) formData.append('enlace_repositorio', form.enlace_repositorio);
      if (image) formData.append('imagen', image);

      if (project) {
        await portfolioService.editProject(project.id, formData);
      } else {
        await portfolioService.addProject(formData);
      }
      onSave();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el proyecto. Revisa los datos o intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>{project ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
      {error && <div style={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label style={styles.label}>Título</label>
          <input style={styles.input} name="titulo" value={form.titulo} onChange={handleChange} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Descripción</label>
          <textarea style={{...styles.input, height:'80px'}} name="descripcion" value={form.descripcion} onChange={handleChange} required />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Tecnologías (separadas por coma, max 5)</label>
          <input style={styles.input} name="tecnologias" value={form.tecnologias} onChange={handleChange} required placeholder="React, Node.js" />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Enlace al Proyecto (Opcional)</label>
          <input style={styles.input} type="url" name="enlace_proyecto" value={form.enlace_proyecto} onChange={handleChange} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Enlace al Repositorio (Opcional)</label>
          <input style={styles.input} type="url" name="enlace_repositorio" value={form.enlace_repositorio} onChange={handleChange} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Imagen del Proyecto {project && '(Opcional si no deseas cambiarla)'}</label>
          <input style={styles.input} type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div style={styles.btnRow}>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Guardando...' : '💾 Guardar Proyecto'}
          </button>
          <button style={styles.btnCancel} type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: { marginTop:'20px', padding:'20px', backgroundColor:'#f9f9f9', borderRadius:'8px', border:'1px solid #eee' },
  title: { marginTop:0, color:'#2E5BA8' },
  field: { marginBottom:'12px' },
  label: { display:'block', marginBottom:'6px', color:'#555', fontSize:'14px', fontWeight:'500' },
  input: { width:'100%', padding:'10px', border:'1px solid #ccc', borderRadius:'6px', fontSize:'14px', boxSizing:'border-box' },
  error: { color:'red', marginBottom:'10px', fontSize:'14px' },
  btnRow: { display:'flex', marginTop:'16px' },
  btn: { padding:'10px 20px', backgroundColor:'#2E5BA8', color:'white', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  btnCancel: { padding:'10px 20px', backgroundColor:'#e0e0e0', color:'#555', border:'none', borderRadius:'6px', cursor:'pointer', marginLeft:'10px' },
};

export default ProjectForm;
