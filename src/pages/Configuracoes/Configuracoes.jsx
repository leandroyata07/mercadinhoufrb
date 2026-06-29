import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Download, Upload, ShieldCheck, AlertCircle, Bell } from 'lucide-react';
import './Configuracoes.css';

const Configuracoes = () => {
  const {
    exportarBanco,
    restaurarBanco,
    hidePreRegistered,
    ocultarDadosPreCadastrados,
    restaurarDadosPreCadastrados,
    settings,
    setSettings,
  } = useDatabase();

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  
  const [actionType, setActionType] = useState(null); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalError, setModalError] = useState('');

  
  const [activeModalConfig, setActiveModalConfig] = useState(null); 

  
  const [limiteEstoqueBaixo, setLimiteEstoqueBaixo] = useState(settings?.limiteEstoqueBaixo ?? 5);
  const [diasAvisarVencimento, setDiasAvisarVencimento] = useState(settings?.diasAvisarVencimento ?? 3);
  const [alertasEstoqueAtivos, setAlertasEstoqueAtivos] = useState(settings?.alertasEstoqueAtivos ?? true);
  const [alertasDespesasAtivos, setAlertasDespesasAtivos] = useState(settings?.alertasDespesasAtivos ?? true);

  useEffect(() => {
    if (settings) {
      setLimiteEstoqueBaixo(settings.limiteEstoqueBaixo);
      setDiasAvisarVencimento(settings.diasAvisarVencimento);
      setAlertasEstoqueAtivos(settings.alertasEstoqueAtivos);
      setAlertasDespesasAtivos(settings.alertasDespesasAtivos);
    }
  }, [settings]);

  const handleSaveAlertSettings = (e) => {
    e.preventDefault();
    setSettings({
      limiteEstoqueBaixo: Number(limiteEstoqueBaixo),
      diasAvisarVencimento: Number(diasAvisarVencimento),
      alertasEstoqueAtivos,
      alertasDespesasAtivos,
    });
    setSuccessMsg('Configurações de notificações salvas com sucesso!');
    setActiveModalConfig(null); 
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActionType(null);
        setActiveModalConfig(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleBackup = () => {
    try {
      const dataStr = exportarBanco();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `backup_mercadinho_ufrb_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccessMsg('Backup baixado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      setErrorMsg('Falha ao exportar backup de dados.');
    }
  };

  const handleRestore = (e) => {
    setErrorMsg('');
    setSuccessMsg('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const success = restaurarBanco(event.target.result);
      if (success) {
        setSuccessMsg('Banco de dados restaurado com sucesso! Recarregando os módulos...');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg('Arquivo de backup inválido ou corrompido.');
      }
    };
    reader.readAsText(file);
  };

  const handleActionConfirm = (e) => {
    e.preventDefault();
    setModalError('');
    
    if (confirmPassword !== 'admin') {
      setModalError('Senha incorreta. Ação não autorizada.');
      return;
    }

    if (actionType === 'hide') {
      ocultarDadosPreCadastrados(true);
      setSuccessMsg('Dados pré-cadastrados ocultados com sucesso!');
    } else if (actionType === 'restore-merge') {
      restaurarDadosPreCadastrados(false);
      setSuccessMsg('Dados pré-cadastrados exibidos e mesclados de volta!');
    } else if (actionType === 'restore-wipe') {
      restaurarDadosPreCadastrados(true);
      setSuccessMsg('Toda a base limpa. Apenas os dados originais carregados!');
    }

    setActionType(null);
    setConfirmPassword('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="configuracoes-container container animate-fade-in">
      <h1 className="configuracoes-title">Configurações do Sistema</h1>
      <p className="config-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
        Selecione uma categoria abaixo para ajustar as preferências e gerenciar a base de dados comercial.
      </p>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      {}
      <div className="config-menu-grid">
        <button 
          onClick={() => setActiveModalConfig('backup')}
          className="config-menu-card animate-fade-in"
          style={{ animationDelay: '0.05s' }}
        >
          <div className="config-menu-icon-wrap icon-backup">
            <Download size={32} />
          </div>
          <span className="config-menu-label">Backup dos Dados</span>
        </button>

        <button 
          onClick={() => setActiveModalConfig('restore')}
          className="config-menu-card animate-fade-in"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="config-menu-icon-wrap icon-restore">
            <Upload size={32} />
          </div>
          <span className="config-menu-label">Restauração de Dados</span>
        </button>

        <button 
          onClick={() => setActiveModalConfig('demo')}
          className="config-menu-card animate-fade-in"
          style={{ animationDelay: '0.15s' }}
        >
          <div className="config-menu-icon-wrap icon-demo">
            <AlertCircle size={32} />
          </div>
          <span className="config-menu-label">Dados Demonstrativos</span>
        </button>

        <button 
          onClick={() => setActiveModalConfig('alerts')}
          className="config-menu-card animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="config-menu-icon-wrap icon-alerts">
            <Bell size={32} />
          </div>
          <span className="config-menu-label">Alertas e Notificações</span>
        </button>

        <button 
          onClick={() => setActiveModalConfig('security')}
          className="config-menu-card animate-fade-in"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="config-menu-icon-wrap icon-security">
            <ShieldCheck size={32} />
          </div>
          <span className="config-menu-label">Segurança e Armazenamento</span>
        </button>
      </div>

      {}
      {activeModalConfig === 'backup' && (
        <div className="modal-overlay" onClick={() => setActiveModalConfig(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header-config">
              <Download className="text-accent" size={28} />
              <h3 className="form-title" style={{ margin: 0 }}>Backup dos Dados</h3>
            </div>
            <p className="modal-desc-config">
              Gere uma cópia de segurança completa de todos os seus dados comerciais (clientes, produtos, vendas, compras, financeiro e fornecedores) salvos localmente.
            </p>
            <div className="modal-actions-btns" style={{ marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModalConfig(null)}>
                Fechar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleBackup}>
                Exportar Dados (JSON)
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModalConfig === 'restore' && (
        <div className="modal-overlay" onClick={() => setActiveModalConfig(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header-config">
              <Upload className="text-success" size={28} />
              <h3 className="form-title" style={{ margin: 0 }}>Restauração de Dados</h3>
            </div>
            <p className="modal-desc-config">
              Selecione um arquivo de backup (.json) gerado anteriormente por este sistema para carregar todos os dados de volta. Atenção: isso substituirá o estado atual.
            </p>
            
            <div className="file-input-wrapper-config" style={{ marginTop: '20px' }}>
              <input
                type="file"
                accept=".json"
                id="restore-file-input"
                onChange={(e) => {
                  handleRestore(e);
                  setActiveModalConfig(null); 
                }}
                className="file-input-hidden"
              />
              <label htmlFor="restore-file-input" className="btn btn-secondary cursor-pointer" style={{ display: 'block', textAlign: 'center', padding: '12px' }}>
                Selecionar Arquivo de Backup
              </label>
            </div>

            <div className="modal-actions-btns" style={{ marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary w-full" onClick={() => setActiveModalConfig(null)}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModalConfig === 'demo' && (
        <div className="modal-overlay" onClick={() => setActiveModalConfig(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header-config">
              <AlertCircle className="text-warning" size={28} />
              <h3 className="form-title" style={{ margin: 0 }}>Dados de Demonstração</h3>
            </div>
            <p className="modal-desc-config">
              Gerencie a visibilidade dos dados de demonstração (pré-cadastrados). Status atual: <strong>{hidePreRegistered ? 'OCULTADOS' : 'EXIBIDOS'}</strong>.
            </p>
            
            <div className="config-actions-stacked" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              {!hidePreRegistered ? (
                <button 
                  className="btn btn-secondary config-action-btn"
                  onClick={() => {
                    setActionType('hide');
                    setConfirmPassword('');
                    setModalError('');
                  }}
                >
                  Ocultar Dados Iniciais
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-secondary config-action-btn"
                    onClick={() => {
                      setActionType('restore-merge');
                      setConfirmPassword('');
                      setModalError('');
                    }}
                  >
                    Exibir Dados (Mesclar)
                  </button>
                  <button 
                    className="btn btn-danger config-action-btn"
                    onClick={() => {
                      setActionType('restore-wipe');
                      setConfirmPassword('');
                      setModalError('');
                    }}
                  >
                    Limpar Tudo e Deixar Apenas Demo
                  </button>
                </>
              )}
            </div>

            <div className="modal-actions-btns" style={{ marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary w-full" onClick={() => setActiveModalConfig(null)}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModalConfig === 'alerts' && (
        <div className="modal-overlay" onClick={() => setActiveModalConfig(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '20px' }}>
            <div className="modal-header-config" style={{ marginBottom: '8px', paddingBottom: '6px' }}>
              <Bell className="text-primary" size={28} />
              <h3 className="form-title" style={{ margin: 0 }}>Alertas e Notificações</h3>
            </div>
            <p className="modal-desc-config" style={{ marginBottom: '10px', fontSize: '13px' }}>
              Ajuste as preferências de notificação de estoque crítico e prazo das despesas.
            </p>
            
            <form onSubmit={handleSaveAlertSettings} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="alertas-estoque-toggle"
                  type="checkbox"
                  checked={alertasEstoqueAtivos}
                  onChange={(e) => setAlertasEstoqueAtivos(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="alertas-estoque-toggle" className="form-label" style={{ margin: 0, cursor: 'pointer', fontWeight: '600' }}>
                  Habilitar Alertas de Estoque
                </label>
              </div>

              {alertasEstoqueAtivos && (
                <div className="form-group animate-fade-in" style={{ marginLeft: '26px', marginTop: '2px' }}>
                  <label htmlFor="limite-estoque-input" className="form-label" style={{ fontSize: '11px', marginBottom: '2px' }}>
                    Limite para Estoque Baixo (unidades/kg):
                  </label>
                  <input
                    id="limite-estoque-input"
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={limiteEstoqueBaixo}
                    onChange={(e) => setLimiteEstoqueBaixo(e.target.value)}
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px', height: '32px' }}
                  />
                </div>
              )}

              <div className="summary-pdv-divider" style={{ margin: '4px 0' }}></div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  id="alertas-despesas-toggle"
                  type="checkbox"
                  checked={alertasDespesasAtivos}
                  onChange={(e) => setAlertasDespesasAtivos(e.target.checked)}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="alertas-despesas-toggle" className="form-label" style={{ margin: 0, cursor: 'pointer', fontWeight: '600' }}>
                  Habilitar Alertas de Despesas
                </label>
              </div>

              {alertasDespesasAtivos && (
                <div className="form-group animate-fade-in" style={{ marginLeft: '26px', marginTop: '2px' }}>
                  <label htmlFor="dias-despesas-input" className="form-label" style={{ fontSize: '11px', marginBottom: '2px' }}>
                    Avisar sobre contas a vencer (dias de antecedência):
                  </label>
                  <input
                    id="dias-despesas-input"
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={diasAvisarVencimento}
                    onChange={(e) => setDiasAvisarVencimento(e.target.value)}
                    className="form-input"
                    style={{ padding: '6px 10px', fontSize: '13px', height: '32px' }}
                  />
                </div>
              )}

              <div className="modal-actions-btns" style={{ marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModalConfig(null)}>
                  Voltar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Preferências
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModalConfig === 'security' && (
        <div className="modal-overlay" onClick={() => setActiveModalConfig(null)}>
          <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="modal-header-config">
              <ShieldCheck className="text-success" size={28} />
              <h3 className="form-title" style={{ margin: 0 }}>Segurança e Armazenamento</h3>
            </div>
            <p className="modal-desc-config">
              Seus dados estão armazenados localmente no navegador por meio de <strong>LocalStorage</strong>. Fazer backups regulares garante que você não perca seu histórico ao limpar cookies do seu navegador.
            </p>
            
            <div className="security-tips-box" style={{ marginTop: '16px' }}>
              <div className="tip-item">
                <AlertCircle size={16} className="text-warning" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Armazenamento local ativo. A autenticação com o usuário e senha (admin/admin) permanece configurada e ativa de forma inalterada.</span>
              </div>
            </div>

            <div className="modal-actions-btns" style={{ marginTop: '24px' }}>
              <button type="button" className="btn btn-secondary w-full" onClick={() => setActiveModalConfig(null)}>
                Entendi e Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {actionType && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content">
            <h3 className="form-title">Confirmar Ação</h3>
            
            {modalError && <div className="alert alert-danger">{modalError}</div>}

            <form onSubmit={(e) => {
              handleActionConfirm(e);
              setActiveModalConfig(null); 
            }}>
              <div className="form-group">
                <label htmlFor="confirm-password-input" className="form-label">
                  Digite a senha de administrador para autorizar:
                </label>
                <input
                  id="confirm-password-input"
                  type="password"
                  required
                  placeholder="Senha admin"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setActionType(null)}
                >
                  Voltar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;
