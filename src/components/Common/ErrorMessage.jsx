import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorMessage.css';

const ErrorMessage = ({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }) => {
  return (
    <div className="error-container animate-fade-in">
      <AlertCircle className="error-icon" size={40} />
      <h3 className="error-title">Ops! Algo deu errado</h3>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button className="btn btn-primary retry-btn" onClick={onRetry}>
          Tentar Novamente
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
