import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store, Sun, Moon, LogOut, Menu, X, BarChart3, ShoppingCart, Users, Truck, DollarSign, Settings, LayoutDashboard, Boxes, Receipt, Bell, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../ThemeProvider/ThemeProvider';
import { useDatabase } from '../../context/DatabaseContext';
import './Header.css';

const Header = () => {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { notifications, marcarNotificacaoComoLida, marcarTodasComoLidas, apagarTodasNotificacoes } = useDatabase();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  
  const [showDeleteNotifModal, setShowDeleteNotifModal] = useState(false);
  const [deleteNotifPassword, setDeleteNotifPassword] = useState('');
  const [deleteNotifError, setDeleteNotifError] = useState('');

  
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowDeleteNotifModal(false);
        setDeleteNotifPassword('');
        setDeleteNotifError('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDeleteNotifications = (e) => {
    e.preventDefault();
    if (deleteNotifPassword === 'admin') {
      apagarTodasNotificacoes();
      setShowDeleteNotifModal(false);
      setDeleteNotifPassword('');
      setDeleteNotifError('');
      setShowNotifications(false);
    } else {
      setDeleteNotifError('Senha incorreta. Ação não autorizada.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, activeColor: '#3b82f6', lightBg: 'rgba(59, 130, 246, 0.1)' },
    { path: '/vendas', label: 'PDV - Vendas', icon: ShoppingCart, activeColor: '#10b981', lightBg: 'rgba(16, 185, 129, 0.1)' },
    { path: '/cadastros', label: 'Cadastros', icon: Users, activeColor: '#8b5cf6', lightBg: 'rgba(139, 92, 246, 0.1)' },
    { path: '/compras', label: 'Compras', icon: Truck, activeColor: '#f97316', lightBg: 'rgba(249, 115, 22, 0.1)' },
    { path: '/estoque', label: 'Estoque', icon: Boxes, activeColor: '#06b6d4', lightBg: 'rgba(6, 182, 212, 0.1)' },
    { path: '/despesas', label: 'Despesas', icon: Receipt, activeColor: '#ef4444', lightBg: 'rgba(239, 68, 68, 0.1)' },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSign, activeColor: '#eab308', lightBg: 'rgba(234, 179, 8, 0.1)' },
    { path: '/relatorios', label: 'Relatórios', icon: BarChart3, activeColor: '#ec4899', lightBg: 'rgba(236, 72, 153, 0.1)' },
    { path: '/configuracoes', label: 'Configurações', icon: Settings, activeColor: '#6366f1', lightBg: 'rgba(99, 102, 241, 0.1)' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (e, path) => {
    if (location.pathname === '/vendas' && path !== '/vendas') {
      const savedCart = localStorage.getItem('mercadinho_carrinho');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        if (cartItems && cartItems.length > 0) {
          const confirmLeave = window.confirm(
            'Você possui itens no carrinho de vendas em aberto. Deseja mesmo mudar de página? (O carrinho continuará salvo)'
          );
          if (!confirmLeave) {
            e.preventDefault();
            return;
          }
        }
      }
    }
    closeMobileMenu();
  };

  const handleLogoClick = (e) => {
    if (location.pathname === '/vendas') {
      const savedCart = localStorage.getItem('mercadinho_carrinho');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        if (cartItems && cartItems.length > 0) {
          const confirmLeave = window.confirm(
            'Você possui itens no carrinho de vendas em aberto. Deseja mesmo mudar de página? (O carrinho continuará salvo)'
          );
          if (!confirmLeave) {
            e.preventDefault();
            return;
          }
        }
      }
    }
    closeMobileMenu();
  };

  const unreadCount = (notifications || []).filter(n => !n.lida).length;

  return (
    <header className="main-header no-print">
      <div className="container header-container">
        <Link to="/dashboard" className="logo-container" onClick={handleLogoClick}>
          <Store className="logo-icon" size={24} />
          <div className="logo-text-wrapper">
            <span className="logo-text-top">Mercadinho</span>
            <span className="logo-text-bottom logo-highlight">UFRB</span>
          </div>
        </Link>

        {}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const linkStyle = isActive 
              ? { color: item.activeColor, backgroundColor: item.lightBg } 
              : {};
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={linkStyle}
                onClick={(e) => handleNavClick(e, item.path)}
              >
                <Icon size={16} style={{ color: item.activeColor }} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="header-actions">
          {}
          <div className="notification-bell-container" style={{ position: 'relative' }}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`action-btn ${showNotifications ? 'active' : ''}`}
              title="Notificações e Alertas"
              aria-label="Notificações"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="bell-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notifications-dropdown-menu animate-fade-in">
                <div className="notifications-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0 }}>Alertas ({notifications.length})</h4>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={marcarTodasComoLidas}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      Ler todas
                    </button>
                  )}
                </div>
                <div className="notifications-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications-item">
                      <span className="no-notif-check">✓</span>
                      <p>Tudo sob controle! Nenhum alerta de estoque ou despesas pendentes.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`notification-item ${n.tipo} ${n.lida ? 'read' : 'unread'}`}
                        onClick={() => !n.lida && marcarNotificacaoComoLida(n.id)}
                        style={{ cursor: n.lida ? 'default' : 'pointer' }}
                      >
                        <div className="notification-badge-dot"></div>
                        <div className="notification-info">
                          <strong style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {n.titulo}
                            {!n.lida && <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--accent)', borderRadius: '50%' }}></span>}
                          </strong>
                          <p>{n.mensagem}</p>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {new Date(n.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="notifications-footer" style={{ padding: '8px 12px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-tertiary)', textAlign: 'center' }}>
                    <button
                      type="button"
                      className="text-error font-semibold"
                      onClick={() => {
                        setDeleteNotifPassword('');
                        setDeleteNotifError('');
                        setShowDeleteNotifModal(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      Apagar Notificações
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className="action-btn"
            title={theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={handleLogout}
            className="action-btn logout-btn"
            title="Sair do Sistema"
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {}
      {mobileMenuOpen && (
        <div className="mobile-nav-overlay animate-fade-in" onClick={closeMobileMenu}>
          <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const linkStyle = isActive 
                ? { color: item.activeColor, backgroundColor: item.lightBg } 
                : {};
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={(e) => handleNavClick(e, item.path)}
                  style={linkStyle}
                >
                  <Icon size={20} style={{ color: item.activeColor }} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="mobile-nav-divider"></div>
            <button className="mobile-nav-link mobile-logout-btn" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Sair do Sistema</span>
            </button>
          </nav>
        </div>
      )}

      {}
      {showDeleteNotifModal && (
        <div className="modal-overlay" style={{ zIndex: 1200 }}>
          <div className="modal-content">
            <h3 className="form-title text-error">Apagar Histórico de Alertas</h3>
            <p className="text-secondary" style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
              Esta ação removerá todas as notificações do histórico permanentemente. As que continuarem ativas serão geradas novamente quando ocorrerem alterações de estoque ou despesas.
            </p>
            {deleteNotifError && <div className="alert alert-danger">{deleteNotifError}</div>}
            
            <form onSubmit={handleDeleteNotifications}>
              <div className="form-group">
                <label htmlFor="delete-notif-pass-input" className="form-label">
                  Confirme a senha de administrador (admin):
                </label>
                <input
                  id="delete-notif-pass-input"
                  type="password"
                  required
                  placeholder="Senha admin"
                  value={deleteNotifPassword}
                  onChange={(e) => setDeleteNotifPassword(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteNotifModal(false);
                    setDeleteNotifPassword('');
                    setDeleteNotifError('');
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-danger">
                  Apagar Tudo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
