import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setToken } from '../services/api.js';
import { Field } from './LoginPage.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.register(form);
      setToken(data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-sm border">
      <h1 className="text-2xl font-bold mb-4 text-tak-board">Inscription</h1>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field
          label="Nom d'utilisateur"
          type="text"
          value={form.username}
          onChange={(v) => setForm({ ...form, username: v })}
        />
        <Field
          label="Courriel"
          type="email"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
        />
        <Field
          label="Mot de passe"
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-tak-board text-white rounded-md py-2 font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Création...' : "Créer mon compte"}
        </button>
      </form>
      <p className="text-sm text-gray-600 mt-4">
        Déjà inscrit ?{' '}
        <Link to="/connexion" className="text-tak-board font-medium">
          Connectez-vous
        </Link>
      </p>
    </div>
  );
}
