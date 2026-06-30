import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import './Toast.css';

const Toast = () => {
  const { toast } = useDatabase();
  const [visible, setVisible] = useState(false);
  const [currentToast, setCurrentToast] = useState(null);

  useEffect(() => {
    if (toast) {
      setCurrentToast(toast);
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!currentToast || !visible) return null;

  const getIcon = () => {
    switch (currentToast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon text-success" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon text-warning" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon text-error" />;
      default:
        return <Info size={18} className="toast-icon text-info" />;
    }
  };

  return (
    <div className={`toast-notification-item toast-${currentToast.type} animate-slide-up`}>
      {getIcon()}
      <span className="toast-message">{currentToast.message}</span>
      <button className="toast-close-btn" onClick={() => setVisible(false)}>
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
