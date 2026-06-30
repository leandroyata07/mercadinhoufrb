import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Search, Plus, Trash2, Edit2, AlertCircle, FileText, CheckCircle2, Calendar, DollarSign, Wallet } from 'lucide-react';
import './Despesas.css';

const Despesas = () => {
  const { despesas, addDespesa, updateDespesa, deleteDespesa } = useDatabase();

  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('todas'); 
  const [columnFilters, setColumnFilters] = useState({});

  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    descricao: '',
    categoria: 'Energia',
    valor: '',
    dataVencimento: '',
    pago: false,
    dataPagamento: ''
  });
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowDeleteModal(false);
        setSearchTerm('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  
  const totalGeral = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
  const totalPagas = despesas.filter(d => d.pago).reduce((sum, d) => sum + (d.valor || 0), 0);
  const totalPendentes = despesas.filter(d => !d.pago).reduce((sum, d) => sum + (d.valor || 0), 0);
  const percentualPago = totalGeral > 0 ? Math.round((totalPagas / totalGeral) * 100) : 0;

  
  const filteredDespesas = despesas.filter((d) => {
    const matchesSearch = d.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? d.categoria === filterCategory : true;
    
    const matchesColDesc = !columnFilters.desc || d.descricao.toLowerCase().includes(columnFilters.desc.toLowerCase());
    const matchesColCat = !columnFilters.cat || d.categoria.toLowerCase().includes(columnFilters.cat.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'pagas') matchesStatus = d.pago;
    else if (filterStatus === 'pendentes') matchesStatus = !d.pago;

    return matchesSearch && matchesCategory && matchesStatus && matchesColDesc && matchesColCat;
  });

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      descricao: '',
      categoria: 'Energia',
      valor: '',
      dataVencimento: new Date().toISOString().split('T')[0],
      pago: false,
      dataPagamento: ''
    });
    setFormError('');
    setShowModal(true);
  };

  
  const handleOpenEdit = (desp) => {
    setEditingId(desp.id);
    setFormData({
      descricao: desp.descricao,
      categoria: desp.categoria,
      valor: desp.valor.toString(),
      dataVencimento: desp.dataVencimento,
      pago: desp.pago,
      dataPagamento: desp.dataPagamento || ''
    });
    setFormError('');
    setShowModal(true);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.descricao.trim()) {
      setFormError('Informe a descrição da despesa.');
      return;
    }
    const val = Number(formData.valor);
    if (isNaN(val) || val <= 0) {
      setFormError('O valor deve ser maior que zero.');
      return;
    }
    if (!formData.dataVencimento) {
      setFormError('Informe a data de vencimento.');
      return;
    }
    if (formData.pago && !formData.dataPagamento) {
      setFormError('Informe a data de pagamento da despesa.');
      return;
    }

    const payload = {
      descricao: formData.descricao,
      categoria: formData.categoria,
      valor: val,
      dataVencimento: formData.dataVencimento,
      pago: formData.pago,
      dataPagamento: formData.pago ? formData.dataPagamento : ''
    };

    if (editingId) {
      updateDespesa(editingId, payload);
      setSuccessMsg('Despesa atualizada com sucesso!');
    } else {
      addDespesa(payload);
      setSuccessMsg('Despesa cadastrada com sucesso!');
    }

    setShowModal(false);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  
  const handleQuickPay = (desp) => {
    updateDespesa(desp.id, {
      ...desp,
      pago: true,
      dataPagamento: new Date().toISOString().split('T')[0]
    });
    setSuccessMsg('Despesa quitada com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  
  const handleConfirmDelete = () => {
    deleteDespesa(deleteId);
    setShowDeleteModal(false);
    setDeleteId(null);
    setSuccessMsg('Despesa excluída com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <>
      <div className="despesas-container container animate-fade-in">
        <div className="despesas-header">
          <h1 className="despesas-title">Controle de Despesas</h1>
          <button className="btn btn-primary" onClick={handleOpenCreate}>
            <Plus size={16} />
            Lançar Despesa
          </button>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {}
        <div className="despesas-metrics-grid">
          <div className="despesas-metric-card color-pendentes">
            <div className="metric-header">
              <span className="metric-title">Total Pendente</span>
              <div className="metric-icon-box">
                <AlertCircle size={20} />
              </div>
            </div>
            <span className="metric-value">{formatCurrency(totalPendentes)}</span>
            <span className="metric-sub">Contas aguardando pagamento</span>
          </div>

          <div className="despesas-metric-card color-pagas">
            <div className="metric-header">
              <span className="metric-title">Total Pago</span>
              <div className="metric-icon-box">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <span className="metric-value">{formatCurrency(totalPagas)}</span>
            <span className="metric-sub">Contas liquidadas</span>
          </div>

          <div className="despesas-metric-card color-geral">
            <div className="metric-header">
              <span className="metric-title">Total Geral Lançado</span>
              <div className="metric-icon-box">
                <Wallet size={20} />
              </div>
            </div>
            <span className="metric-value">{formatCurrency(totalGeral)}</span>
            <span className="metric-sub">Soma de todas as despesas</span>
          </div>

          <div className="despesas-metric-card color-progresso">
            <div className="metric-header">
              <span className="metric-title">Progresso de Quitação</span>
              <div className="metric-icon-box">
                <DollarSign size={20} />
              </div>
            </div>
            <span className="metric-value">{percentualPago}%</span>
            <span className="metric-sub">Porcentagem de contas pagas</span>
          </div>
        </div>

        {}
        <div className="card filters-card despesas-filters">
          <div className="search-box-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar por descrição da conta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input search-input"
            />
          </div>

          <div className="filter-selects-row">
            <div className="filter-select-group">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select"
              >
                <option value="">Todas as Categorias</option>
                <option value="Energia">Energia</option>
                <option value="Água">Água</option>
                <option value="Internet/Telefone">Internet / Telefone</option>
                <option value="Aluguel">Aluguel</option>
                <option value="Salários">Salários</option>
                <option value="Manutenção">Manutenção</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div className="filter-select-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="todas">Todos os Status</option>
                <option value="pendentes">Pendentes</option>
                <option value="pagas">Pagas</option>
              </select>
            </div>
          </div>
        </div>

        {}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>
                  <div className="header-cell-content">
                    <span>Descrição / Conta</span>
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      className="header-filter-input"
                      value={columnFilters.desc || ''}
                      onChange={(e) => setColumnFilters({ ...columnFilters, desc: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </th>
                <th>
                  <div className="header-cell-content">
                    <span>Categoria</span>
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      className="header-filter-input"
                      value={columnFilters.cat || ''}
                      onChange={(e) => setColumnFilters({ ...columnFilters, cat: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </th>
                <th>Valor</th>
                <th>Vencimento</th>
                <th>Status</th>
                <th>Data Pagamento</th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDespesas.map((d) => {
                const isLate = !d.pago && new Date(d.dataVencimento) < new Date(new Date().setHours(0,0,0,0));
                
                return (
                  <tr key={d.id}>
                    <td className="font-bold">{d.descricao}</td>
                    <td>
                      <span className="desp-category-tag">{d.categoria}</span>
                    </td>
                    <td className="font-bold text-error">
                      {formatCurrency(d.valor)}
                    </td>
                    <td className={isLate ? 'text-error font-bold' : ''}>
                      {new Date(d.dataVencimento).toLocaleDateString('pt-BR')}
                      {isLate && <span className="late-indicator" title="Vencido!"> (Vencido)</span>}
                    </td>
                    <td>
                      <span className={`badge ${d.pago ? 'badge-success' : 'badge-danger'}`}>
                        {d.pago ? 'Pago' : 'Pendente'}
                      </span>
                    </td>
                    <td>{d.pago ? new Date(d.dataPagamento).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>
                      <div className="actions-cell">
                        {!d.pago && (
                          <button
                            className="edit-action-btn"
                            onClick={() => handleQuickPay(d)}
                            title="Marcar como Pago"
                            style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                          >
                            <CheckCircle2 size={14} />
                          </button>
                        )}
                        <button
                          className="edit-action-btn"
                          onClick={() => handleOpenEdit(d)}
                          title="Editar Despesa"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="delete-action-btn"
                          onClick={() => {
                            setDeleteId(d.id);
                            setShowDeleteModal(true);
                          }}
                          title="Excluir Despesa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDespesas.length === 0 && (
                <tr>
                  <td colSpan="7" className="no-data-msg text-center">
                    Nenhuma despesa correspondente encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {showModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content">
            <h3 className="form-title">
              {editingId ? 'Editar Despesa Lançada' : 'Lançar Nova Despesa'}
            </h3>
            {formError && <div className="alert alert-danger">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="desp-desc" className="form-label">Descrição / Conta *</label>
                <input
                  id="desp-desc"
                  type="text"
                  name="descricao"
                  required
                  placeholder="Ex: Conta de Luz Julho/26"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="desp-cat" className="form-label">Categoria *</label>
                  <select
                    id="desp-cat"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Energia">Energia</option>
                    <option value="Água">Água</option>
                    <option value="Internet/Telefone">Internet / Telefone</option>
                    <option value="Aluguel">Aluguel</option>
                    <option value="Salários">Salários</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="desp-val" className="form-label">Valor (R$) *</label>
                  <input
                    id="desp-val"
                    type="number"
                    step="0.01"
                    min="0.01"
                    name="valor"
                    required
                    placeholder="0.00"
                    value={formData.valor}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="desp-due" className="form-label">Data de Vencimento *</label>
                  <input
                    id="desp-due"
                    type="date"
                    name="dataVencimento"
                    required
                    value={formData.dataVencimento}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <label className="checkbox-label cursor-pointer select-none" style={{ marginTop: '24px' }}>
                    <input
                      type="checkbox"
                      name="pago"
                      checked={formData.pago}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          pago: isChecked,
                          dataPagamento: isChecked ? new Date().toISOString().split('T')[0] : ''
                        }));
                      }}
                      className="checkbox-input"
                    />
                    <span className="font-semibold text-secondary">Despesa já Paga</span>
                  </label>
                </div>
              </div>

              {formData.pago && (
                <div className="form-group animate-fade-in">
                  <label htmlFor="desp-pay-date" className="form-label">Data de Pagamento *</label>
                  <input
                    id="desp-pay-date"
                    type="date"
                    name="dataPagamento"
                    required={formData.pago}
                    value={formData.dataPagamento}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              )}

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Salvar Alterações' : 'Lançar Despesa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showDeleteModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content">
            <h3 className="form-title text-error">Confirmar Exclusão</h3>
            <p className="text-secondary" style={{ marginBottom: '24px', lineHeight: '1.5' }}>
              Tem certeza que deseja excluir esta despesa? Se ela estiver marcada como paga, a saída correspondente no Financeiro também será removida automaticamente.
            </p>
            <div className="modal-actions-btns">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteId(null);
                }}
              >
                Voltar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
              >
                Confirmar e Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Despesas;
