import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const passwordRules = [
  { id: 'length',   label: 'Mínimo 8 caracteres',        test: (p) => p.length >= 8 },
  { id: 'upper',    label: 'Al menos una mayúscula',      test: (p) => /[A-Z]/.test(p) },
  { id: 'lower',    label: 'Al menos una minúscula',      test: (p) => /[a-z]/.test(p) },
  { id: 'number',   label: 'Al menos un número',          test: (p) => /[0-9]/.test(p) },
  { id: 'special',  label: 'Al menos un carácter especial (@$!%*?&)', test: (p) => /[@$!%*?&]/.test(p) },
];

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: '', email: '', password: '', confirmPassword: '', rol: 'estudiante'
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar error del campo al escribir
    if (errors[name]) setErrors({ ...errors, [name]: '' });
    if (globalError) setGlobalError('');
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    } else if (form.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = 'Formato de correo inválido (ejemplo@correo.com)';
    }

    const failedRules = passwordRules.filter(r => !r.test(form.password));
    if (!form.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (failedRules.length > 0) {
      newErrors.password = `La contraseña no cumple: ${failedRules.map(r => r.label).join(', ')}`;
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar tu contraseña';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await register(form.nombre.trim(), form.email.toLowerCase(), form.password, form.rol);
      navigate('/profile');
    } catch (err) {
      const msg = err.response?.data?.error || '';
      if (msg.includes('correo') || msg.includes('email') || msg.includes('registrado')) {
        setErrors({ email: 'Este correo ya está registrado. ¿Quieres iniciar sesión?' });
      } else if (msg.includes('contraseña') || msg.includes('password')) {
        setErrors({ password: msg });
      } else {
        setGlobalError(msg || 'Error al conectar con el servidor. Intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const passed = passwordRules.filter(r => r.test(form.password)).length;
    if (passed === 0) return null;
    if (passed <= 2) return { label: 'Débil', color: '#e74c3c', width: '25%' };
    if (passed === 3) return { label: 'Regular', color: '#f39c12', width: '50%' };
    if (passed === 4) return { label: 'Buena', color: '#3498db', width: '75%' };
    return { label: 'Fuerte', color: '#27ae60', width: '100%' };
  };

  const strength = getPasswordStrength();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🚀 Crear cuenta en Nexus Talent</h2>

        {globalError && (
          <div style={styles.globalError}>
            ⚠️ {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>

          {/* Nombre */}
          <div style={styles.field}>
            <label style={styles.label}>Nombre completo</label>
            <input
              style={{ ...styles.input, borderColor: errors.nombre ? '#e74c3c' : '#ddd' }}
              name="nombre" value={form.nombre}
              onChange={handleChange} placeholder="Tu nombre completo"
            />
            {errors.nombre && <span style={styles.fieldError}>⚠️ {errors.nombre}</span>}
          </div>

          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <input
              style={{ ...styles.input, borderColor: errors.email ? '#e74c3c' : '#ddd' }}
              name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="correo@ejemplo.com"
            />
            {errors.email && (
              <span style={styles.fieldError}>
                ⚠️ {errors.email}{' '}
                {errors.email.includes('iniciar sesión') && (
                  <span style={styles.linkInline} onClick={() => navigate('/login')}>
                    Ir a Login
                  </span>
                )}
              </span>
            )}
          </div>

          {/* Contraseña */}
          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrapper}>
              <input
                style={{ ...styles.input, ...styles.inputWithIcon, borderColor: errors.password ? '#e74c3c' : '#ddd' }}
                name="password" type={showPassword ? 'text' : 'password'}
                value={form.password} onChange={handleChange}
                placeholder="Crea una contraseña segura"
              />
              <button type="button" style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Barra de fortaleza */}
            {form.password.length > 0 && strength && (
              <div style={styles.strengthBar}>
                <div style={{ ...styles.strengthFill, width: strength.width, backgroundColor: strength.color }} />
                <span style={{ ...styles.strengthLabel, color: strength.color }}>{strength.label}</span>
              </div>
            )}

            {/* Requisitos */}
            {form.password.length > 0 && (
              <div style={styles.rules}>
                {passwordRules.map(rule => {
                  const ok = rule.test(form.password);
                  return (
                    <div key={rule.id} style={{ ...styles.rule, color: ok ? '#27ae60' : '#999' }}>
                      {ok ? '✅' : '⭕'} {rule.label}
                    </div>
                  );
                })}
              </div>
            )}

            {errors.password && <span style={styles.fieldError}>⚠️ {errors.password}</span>}
          </div>

          {/* Confirmar contraseña */}
          <div style={styles.field}>
            <label style={styles.label}>Confirmar contraseña</label>
            <div style={styles.inputWrapper}>
              <input
                style={{ ...styles.input, ...styles.inputWithIcon,
                  borderColor: errors.confirmPassword ? '#e74c3c'
                    : form.confirmPassword && form.password === form.confirmPassword ? '#27ae60' : '#ddd' }}
                name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword} onChange={handleChange}
                placeholder="Repite tu contraseña"
              />
              <button type="button" style={styles.eyeBtn}
                onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
              <span style={{ ...styles.fieldError, color: '#27ae60' }}>✅ Las contraseñas coinciden</span>
            )}
            {errors.confirmPassword && <span style={styles.fieldError}>⚠️ {errors.confirmPassword}</span>}
          </div>

          {/* Rol */}
          <div style={styles.field}>
            <label style={styles.label}>Rol</label>
            <select style={styles.input} name="rol" value={form.rol} onChange={handleChange}>
              <option value="estudiante">🎓 Estudiante</option>
              <option value="mentor">👨‍💼 Mentor</option>
            </select>
          </div>

          <button style={{
            ...styles.btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }} type="submit" disabled={loading}>
            {loading ? '⏳ Registrando...' : '🚀 Crear cuenta'}
          </button>
        </form>

        <p style={styles.link}>
          ¿Ya tienes cuenta?{' '}
          <span style={styles.linkText} onClick={() => navigate('/login')}>
            Inicia sesión aquí
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#f0f4f8', padding: '20px' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '100%', maxWidth: '440px' },
  title: { textAlign: 'center', color: '#2E5BA8', marginBottom: '24px', fontSize: '22px' },
  globalError: { backgroundColor: '#fde8e8', color: '#c0392b', padding: '12px',
    borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' },
  field: { marginBottom: '18px' },
  label: { display: 'block', marginBottom: '6px', color: '#444',
    fontSize: '14px', fontWeight: '600' },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #ddd',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
    outline: 'none', transition: 'border-color 0.2s' },
  inputWrapper: { position: 'relative' },
  inputWithIcon: { paddingRight: '44px' },
  eyeBtn: { position: 'absolute', right: '10px', top: '50%',
    transform: 'translateY(-50%)', background: 'none', border: 'none',
    cursor: 'pointer', fontSize: '18px', padding: '0' },
  fieldError: { display: 'block', marginTop: '5px', fontSize: '12px', color: '#e74c3c' },
  strengthBar: { marginTop: '8px', height: '6px', backgroundColor: '#eee',
    borderRadius: '3px', overflow: 'hidden', position: 'relative' },
  strengthFill: { height: '100%', borderRadius: '3px', transition: 'all 0.3s' },
  strengthLabel: { fontSize: '11px', fontWeight: 'bold',
    display: 'block', marginTop: '4px', textAlign: 'right' },
  rules: { marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa',
    borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' },
  rule: { fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' },
  btn: { width: '100%', padding: '12px', backgroundColor: '#2E5BA8', color: 'white',
    border: 'none', borderRadius: '8px', fontSize: '16px',
    fontWeight: 'bold', marginTop: '8px' },
  link: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#777' },
  linkText: { color: '#2E5BA8', cursor: 'pointer', fontWeight: 'bold' },
  linkInline: { color: '#2E5BA8', cursor: 'pointer', fontWeight: 'bold',
    textDecoration: 'underline', marginLeft: '4px' },
};

export default Register;