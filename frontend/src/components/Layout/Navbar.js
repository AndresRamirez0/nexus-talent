import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand} onClick={() => navigate('/')}>
        🚀 Nexus Talent
      </div>
      <div style={styles.links}>
        {user ? (
          <>
            <span style={styles.welcome}>Hola, {user.nombre} ({user.rol})</span>
            <button style={styles.btnSecondary} onClick={() => navigate('/profile')}>
              Mi Perfil
            </button>
            <button style={styles.btnDanger} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button style={styles.btnPrimary} onClick={() => navigate('/login')}>
              Iniciar sesión
            </button>
            <button style={styles.btnSecondary} onClick={() => navigate('/register')}>
              Registrarse
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center',
    padding:'12px 32px', backgroundColor:'#2E5BA8', color:'white' },
  brand: { fontSize:'20px', fontWeight:'bold', cursor:'pointer' },
  links: { display:'flex', alignItems:'center', gap:'12px' },
  welcome: { fontSize:'14px', color:'#cce0ff' },
  btnPrimary: { padding:'8px 16px', backgroundColor:'white', color:'#2E5BA8',
    border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  btnSecondary: { padding:'8px 16px', backgroundColor:'transparent', color:'white',
    border:'1px solid white', borderRadius:'6px', cursor:'pointer' },
  btnDanger: { padding:'8px 16px', backgroundColor:'#e74c3c', color:'white',
    border:'none', borderRadius:'6px', cursor:'pointer' },
};

export default Navbar;