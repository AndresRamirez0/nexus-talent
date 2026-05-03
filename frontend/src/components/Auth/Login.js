import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚀 Iniciar sesión</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <input style={styles.input} name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="correo@ejemplo.com" required />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input style={styles.input} name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="Tu contraseña" required />
          </div>
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
        <p style={styles.link}>
          ¿No tienes cuenta?{' '}
          <span style={styles.linkText} onClick={() => navigate('/register')}>
            Regístrate aquí
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight:'100vh', display:'flex', alignItems:'center',
    justifyContent:'center', backgroundColor:'#f0f4f8' },
  card: { backgroundColor:'white', padding:'40px', borderRadius:'12px',
    boxShadow:'0 4px 20px rgba(0,0,0,0.1)', width:'100%', maxWidth:'420px' },
  title: { textAlign:'center', color:'#2E5BA8', marginBottom:'24px' },
  error: { backgroundColor:'#fde8e8', color:'#e74c3c', padding:'10px',
    borderRadius:'6px', marginBottom:'16px', fontSize:'14px' },
  field: { marginBottom:'16px' },
  label: { display:'block', marginBottom:'6px', color:'#555', fontSize:'14px', fontWeight:'500' },
  input: { width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:'6px',
    fontSize:'14px', boxSizing:'border-box' },
  btn: { width:'100%', padding:'12px', backgroundColor:'#2E5BA8', color:'white',
    border:'none', borderRadius:'6px', fontSize:'16px', fontWeight:'bold',
    cursor:'pointer', marginTop:'8px' },
  link: { textAlign:'center', marginTop:'16px', fontSize:'14px', color:'#777' },
  linkText: { color:'#2E5BA8', cursor:'pointer', fontWeight:'bold' },
};

export default Login;