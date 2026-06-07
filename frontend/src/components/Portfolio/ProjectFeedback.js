import { useState, useEffect } from 'react';
import { feedbackService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ProjectFeedback = ({ projectId, isOwner }) => {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState({ comentarios: [], valoracion: { promedio: 0, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ texto: '', puntuacion: 0 });
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    try {
      const res = await feedbackService.getFeedback(projectId);
      setFeedback(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
    // eslint-disable-next-line
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para comentar.');
      return;
    }
    if (isOwner) {
      setError('No puedes comentar tu propio proyecto.');
      return;
    }
    try {
      setError('');
      await feedbackService.addFeedback(projectId, {
        texto: form.texto || undefined,
        puntuacion: form.puntuacion || undefined
      });
      setForm({ texto: '', puntuacion: 0 });
      fetchFeedback();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar feedback');
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm('¿Eliminar comentario?')) {
      try {
        await feedbackService.removeComment(commentId);
        fetchFeedback();
      } catch (err) {
        alert('Error al eliminar el comentario');
      }
    }
  };

  if (loading) return <div style={styles.loading}>Cargando feedback...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.ratingHeader}>
        <span style={styles.stars}>⭐ {feedback.valoracion.promedio.toFixed(1)}</span>
        <span style={styles.totalRatings}>({feedback.valoracion.total} valoraciones)</span>
      </div>

      <div style={styles.commentsList}>
        {feedback.comentarios.length === 0 ? (
          <p style={styles.noComments}>No hay comentarios aún.</p>
        ) : (
          feedback.comentarios.map(c => (
            <div key={c.id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <strong>{c.nombre}</strong>
                <span style={styles.date}>{new Date(c.fecha).toLocaleDateString()}</span>
              </div>
              <p style={styles.commentText}>{c.texto}</p>
              {user && (user.id === c.usuario_id || isOwner) && (
                <button style={styles.delBtn} onClick={() => handleDelete(c.id)}>Eliminar</button>
              )}
            </div>
          ))
        )}
      </div>

      {user && !isOwner && (
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.inputGroup}>
            <textarea 
              style={styles.textarea} 
              placeholder="Deja un comentario constructivo..." 
              value={form.texto} 
              onChange={e => setForm({...form, texto: e.target.value})} 
              maxLength={500}
            />
            <div style={styles.ratingSelect}>
              <label>Valorar: </label>
              <select value={form.puntuacion} onChange={e => setForm({...form, puntuacion: parseInt(e.target.value)})}>
                <option value={0}>-</option>
                <option value={1}>1 ⭐</option>
                <option value={2}>2 ⭐</option>
                <option value={3}>3 ⭐</option>
                <option value={4}>4 ⭐</option>
                <option value={5}>5 ⭐</option>
              </select>
            </div>
          </div>
          <button type="submit" style={styles.submitBtn} disabled={!form.texto && !form.puntuacion}>Enviar Feedback</button>
        </form>
      )}
    </div>
  );
};

const styles = {
  container: { marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '15px' },
  loading: { fontSize: '12px', color: '#666' },
  ratingHeader: { marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' },
  stars: { color: '#f39c12' },
  totalRatings: { color: '#666', marginLeft: '5px', fontWeight: 'normal' },
  noComments: { color: '#888', fontStyle: 'italic', fontSize: '13px' },
  commentsList: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' },
  comment: { backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '6px', fontSize: '13px' },
  commentHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', color: '#333' },
  date: { color: '#888', fontSize: '11px' },
  commentText: { margin: 0, color: '#444' },
  delBtn: { marginTop: '5px', background: 'none', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '11px', padding: 0 },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  error: { color: 'red', fontSize: '12px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  textarea: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical', minHeight: '60px', fontSize: '13px' },
  ratingSelect: { fontSize: '13px' },
  submitBtn: { backgroundColor: '#2E5BA8', color: 'white', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }
};

export default ProjectFeedback;
