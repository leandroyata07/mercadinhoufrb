import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Search, AlertTriangle, CheckCircle, Package, TrendingUp, ShieldAlert, Edit2 } from 'lucide-react';
import './Estoque.css';

const Estoque = () => {
  const { produtos, fornecedores, updateProduto } = useDatabase();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);

  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAdjustFormModal, setShowAdjustFormModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  
  const [newStockVal, setNewStockVal] = useState('');
  const [adjustReason, setAdjustReason] = useState('inventario');
  const [observations, setObservations] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowPasswordModal(false);
        setShowAdjustFormModal(false);
        setSearchTerm('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  
  const totalItens = produtos.reduce((sum, p) => sum + (p.estoque || 0), 0);
  const totalZerados = produtos.filter((p) => (p.estoque || 0) === 0).length;
  const totalBaixos = produtos.filter((p) => (p.estoque || 0) > 0 && (p.estoque || 0) <= 5).length;
  const valorInventario = produtos.reduce((sum, p) => sum + (p.estoque || 0) * (p.preco || 0), 0);

  
  const filteredProducts = produtos.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterLowStock) {
      return matchesSearch && (p.estoque || 0) <= 5;
    }
    return matchesSearch;
  });

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  
  const handleOpenAdjust = (prod) => {
    setSelectedProduct(prod);
    setPassword('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  
  const handleVerifyPassword = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setPasswordError('');
      setShowPasswordModal(false);
      setNewStockVal(selectedProduct.estoque.toString());
      setAdjustReason('inventario');
      setObservations('');
      setShowAdjustFormModal(true);
    } else {
      setPasswordError('Senha incorreta. Acesso negado.');
    }
  };

  
  const handleSaveAdjust = (e) => {
    e.preventDefault();
    const parsedStock = Number(newStockVal);
    if (isNaN(parsedStock) || parsedStock < 0) {
      alert('Quantidade de estoque inválida.');
      return;
    }

    updateProduto(selectedProduct.id, { estoque: parsedStock });
    setShowAdjustFormModal(false);
    setSelectedProduct(null);
    setSuccessMsg('Estoque ajustado com sucesso!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <>
      <div className="estoque-container container animate-fade-in">
        <div className="estoque-header">
          <h1 className="estoque-title">Controle de Estoque</h1>
        </div>

        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {}
        <div className="estoque-metrics-grid">
          <div className="estoque-metric-card color-itens">
            <div className="metric-header">
              <span className="metric-title">Itens em Estoque</span>
              <div className="metric-icon-box">
                <Package size={20} />
              </div>
            </div>
            <span className="metric-value">{totalItens}</span>
            <span className="metric-sub">Quantidade total de produtos</span>
          </div>

          <div className="estoque-metric-card color-zerados">
            <div className="metric-header">
              <span className="metric-title">Produtos Zerados</span>
              <div className="metric-icon-box">
                <ShieldAlert size={20} />
              </div>
            </div>
            <span className="metric-value">{totalZerados}</span>
            <span className="metric-sub">Itens sem estoque</span>
          </div>

          <div className="estoque-metric-card color-baixos">
            <div className="metric-header">
              <span className="metric-title">Estoque Baixo (≤ 5)</span>
              <div className="metric-icon-box">
                <AlertTriangle size={20} />
              </div>
            </div>
            <span className="metric-value">{totalBaixos}</span>
            <span className="metric-sub">Precisam de reposição</span>
          </div>

          <div className="estoque-metric-card color-valor">
            <div className="metric-header">
              <span className="metric-title">Valor Estimado de Venda</span>
              <div className="metric-icon-box">
                <TrendingUp size={20} />
              </div>
            </div>
            <span className="metric-value">{formatCurrency(valorInventario)}</span>
            <span className="metric-sub">Potencial de vendas no estoque</span>
          </div>
        </div>

        {}
        <div className="card filters-card flex-between">
          <div className="search-box-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Buscar por nome ou marca do produto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input search-input"
            />
          </div>

          <label className="checkbox-label cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterLowStock}
              onChange={(e) => setFilterLowStock(e.target.checked)}
              className="checkbox-input"
            />
            <span className="text-secondary font-medium">Apenas Estoque Baixo / Zerado</span>
          </label>
        </div>

        {}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Marca</th>
                <th>Fornecedor</th>
                <th>Qtd em Estoque</th>
                <th>Status</th>
                <th>Preço Unitário</th>
                <th>Valor em Estoque</th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const forn = fornecedores.find((f) => f.id === p.fornecedorId);
                const isOutOfStock = (p.estoque || 0) === 0;
                const isLowStock = (p.estoque || 0) > 0 && (p.estoque || 0) <= 5;
                
                let badgeClass = 'badge-success';
                let statusText = 'Normal';
                if (isOutOfStock) {
                  badgeClass = 'badge-danger';
                  statusText = 'Sem Estoque';
                } else if (isLowStock) {
                  badgeClass = 'badge-warning';
                  statusText = 'Estoque Baixo';
                }

                return (
                  <tr key={p.id}>
                    <td className="font-bold">{p.nome}</td>
                    <td>{p.marca}</td>
                    <td>{forn ? forn.nome : '-'}</td>
                    <td className={`font-bold ${isOutOfStock ? 'text-error' : isLowStock ? 'text-warning' : ''}`}>
                      {p.estoque} {p.unidade}
                    </td>
                    <td>
                      <span className={`badge ${badgeClass}`}>{statusText}</span>
                    </td>
                    <td>{formatCurrency(p.preco)}</td>
                    <td className="font-semibold">{formatCurrency((p.estoque || 0) * (p.preco || 0))}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="edit-action-btn"
                          onClick={() => handleOpenAdjust(p)}
                          title="Ajustar Estoque"
                          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="8" className="no-data-msg text-center">
                    Nenhum produto encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {showPasswordModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content">
            <h3 className="form-title">Ajuste de Estoque Seguro</h3>
            {passwordError && <div className="alert alert-danger">{passwordError}</div>}
            
            <form onSubmit={handleVerifyPassword}>
              <div className="form-group">
                <label htmlFor="adjust-pass-input" className="form-label">
                  Confirme a senha de administrador para liberar o ajuste manual:
                </label>
                <input
                  id="adjust-pass-input"
                  type="password"
                  required
                  placeholder="Senha admin"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Voltar
                </button>
                <button type="submit" className="btn btn-primary">
                  Liberar Ajuste
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showAdjustFormModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content">
            <h3 className="form-title">Ajustar Estoque - {selectedProduct?.nome}</h3>
            
            <form onSubmit={handleSaveAdjust}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="new-stock-input" className="form-label">Nova Quantidade ({selectedProduct?.unidade}) *</label>
                  <input
                    id="new-stock-input"
                    type="number"
                    min="0"
                    required
                    value={newStockVal}
                    onChange={(e) => setNewStockVal(e.target.value)}
                    className="form-input"
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="adjust-reason-select" className="form-label">Motivo do Ajuste *</label>
                  <select
                    id="adjust-reason-select"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="form-select"
                  >
                    <option value="inventario">Correção de Inventário</option>
                    <option value="perda">Perda / Quebra</option>
                    <option value="vencimento">Produto Vencido</option>
                    <option value="ajuste">Ajuste Diverso</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="adjust-obs-input" className="form-label">Observações (Opcional)</label>
                <textarea
                  id="adjust-obs-input"
                  rows="3"
                  placeholder="Descreva detalhes do ajuste..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="form-input"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAdjustFormModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar e Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Estoque;
