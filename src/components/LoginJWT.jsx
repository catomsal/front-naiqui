import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';
import { useAuth } from '../context/useAuth.js'

const LoginJWT = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth()

  // Obtener el estado de autenticación desde Redux
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  // credentials es un estado local que guarda el email y password del formulario
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials)).then((result) => {
      if (loginUser.fulfilled.match(result)) login(result.payload);
    });
  };

  // Redirigir cuando el login sea exitoso
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <main className="catalog" style={{ maxWidth: '420px', margin: '2rem auto' }}>
      <header className="catalog__header">
        <p className="catalog__eyebrow">Acceso JWT (Redux Toolkit)</p>
        <h1>Iniciar Sesión</h1>
      </header>

      {error && (
        <p className="catalog__message" style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '4px' }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="usuario@naiqui.com"
          />
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="••••••••"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>
    </main>
  );
};

export default LoginJWT;
