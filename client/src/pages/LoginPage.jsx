// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage({ onNavigate }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result.success) {
      onNavigate({ view: 'admin' });
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-amber-100 rounded-2xl shadow-sm p-8">
        <h1 className="text-2xl font-bold text-amber-900 mb-2 text-center">
          Acceso de Administrador
        </h1>
        <p className="text-sm text-amber-700/70 mb-6 text-center">
          Esta sección es exclusiva para el personal de La Casa Amarilla.
        </p>

        <div onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-amber-900 mb-1">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="Username"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-amber-900 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
