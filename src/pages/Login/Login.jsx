import React, { useState } from 'react';
import { Store, Lock, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="login-wrapper animate-fade-in">
      <div className="login-card">
        <div className="login-logo-header">
          <Store size={40} className="login-logo" />
          <h2 className="login-brand">Mercadinho <span className="logo-highlight">UFRB</span></h2>
          <p className="login-subtitle">Sua melhor compra!</p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username-input" className="form-label">Usuário</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="username-input"
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password-input" className="form-label">Senha</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password-input"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Entrar no Sistema
          </button>
        </form>
        <div className="login-footer">
          <p>Login Didático: <strong>admin</strong> / <strong>admin</strong></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
