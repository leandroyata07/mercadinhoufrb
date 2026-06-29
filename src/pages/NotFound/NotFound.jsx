import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-page-container container animate-fade-in">
      <div className="notfound-card">
        <AlertCircle size={64} className="notfound-icon" />
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Página Não Encontrada</h2>
        <p className="notfound-text">
          A página que você está procurando não existe ou foi movida para outro endereço.
        </p>
        <Link to="/" className="btn btn-primary">
          Voltar para a vitrine
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
