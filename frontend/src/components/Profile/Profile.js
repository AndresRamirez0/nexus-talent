import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ nombre:'', descripcion:'', habilidades:'' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || '',
        descripcion: user.descripcion || '',
        habilidades: user.habilidades ? user.habilidades.join(', ') : '',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const habilidadesArray = form.habilidades
        .split(',').map(h => h.trim()).filter(h => h);
      await userService.updateProfile({
        nombre: form.nombre,
        descripcion: form.descripcion,
        habilidades: habilidadesArray,
        foto_perfil: user.foto_perfil,
      });
      setMessage('✅ Perfil actualizado exitosamente');
      setEditing(false);
    } catch (err) {
      setMessage('❌ Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div style={styles.loading}>Cargando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>
            {user.nombre?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={styles.name}>{user.nombre}</h2>
            <span style={styles.rol}>{user.rol}</span>
          </div>
        </div>

        {message && <div style={styles.message}>{message}</div>}

        {!editing ? (
          <div>
            <div style={styles.infoRow}>
              <strong>Email:</strong> {user.email}
            </div>
            <div style={styles.infoRow}>
              <strong>Descripción:</strong> {user.descripcion || 'Sin descripción'}
            </div>
            <div style={styles.infoRow}>
              <strong>Habilidades:</strong>{' '}
              {user.habilidades?.length > 0
                ? user.habilidades.map((h, i) => (
                    <span key={i} style={styles.tag}>{h}</span>
                  ))
                : 'Sin habilidades registradas'}
            </div>
            <button style={styles.btn} onClick={() => setEditing(true)}>
              ✏️ Editar perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Nombre</label>
              <input style={styles.input} name="nombre"
                value={form.nombre} onChange={handleChange} required />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Descripción profesional</label>
              <textarea style={{...styles.input, height:'80px'}} name="descripcion"
                value={form.descripcion} onChange={handleChange}
                placeholder="Cuéntanos sobre ti..." />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Habilidades (separadas por coma)</label>
              <input style={styles.input} name="habilidades"
                value={form.habilidades} onChange={handleChange}
                placeholder="React, Node.js, PostgreSQL" />
            </div>
            <div style={styles.btnRow}>
              <button style={styles.btn} type="submit" disabled={loading}>
                {loading ? 'Guardando...' : '💾 Guardar cambios'}
              </button>
              <button style={styles.btnCancel} type="button"
                onClick={() => setEditing(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight:'100vh', backgroundColor:'#f0f4f8',
    display:'flex', justifyContent:'center', padding:'40px 16px' },
  card: { backgroundColor:'white', borderRadius:'12px', padding:'40px',
    boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'560px', height:'fit-content' },
  header: { display:'flex', alignItems:'center', gap:'20px', marginBottom:'32px' },
  avatar: { width:'70px', height:'70px', borderRadius:'50%', backgroundColor:'#2E5BA8',
    color:'white', fontSize:'28px', fontWeight:'bold', display:'flex',
    alignItems:'center', justifyContent:'center' },
  name: { margin:'0 0 4px', color:'#2E5BA8', fontSize:'22px' },
  rol: { backgroundColor:'#e8f0fe', color:'#2E5BA8', padding:'3px 10px',
    borderRadius:'12px', fontSize:'12px', fontWeight:'bold', textTransform:'uppercase' },
  message: { padding:'10px', borderRadius:'6px', marginBottom:'16px',
    backgroundColor:'#e8f5e9', color:'#2e7d32', fontSize:'14px' },
  infoRow: { marginBottom:'16px', color:'#444', lineHeight:'1.6' },
  tag: { display:'inline-block', backgroundColor:'#e8f0fe', color:'#2E5BA8',
    padding:'3px 10px', borderRadius:'12px', fontSize:'12px',
    marginRight:'6px', marginTop:'4px' },
  field: { marginBottom:'16px' },
  label: { display:'block', marginBottom:'6px', color:'#555', fontSize:'14px', fontWeight:'500' },
  input: { width:'100%', padding:'10px 12px', border:'1px solid #ddd',
    borderRadius:'6px', fontSize:'14px', boxSizing:'border-box', resize:'vertical' },
  btn: { padding:'10px 20px', backgroundColor:'#2E5BA8', color:'white',
    border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', marginTop:'8px' },
  btnCancel: { padding:'10px 20px', backgroundColor:'#e0e0e0', color:'#555',
    border:'none', borderRadius:'6px', cursor:'pointer', marginLeft:'10px', marginTop:'8px' },
  btnRow: { display:'flex', alignItems:'center' },
  loading: { textAlign:'center', marginTop:'100px', fontSize:'18px' },
};

export default Profile;