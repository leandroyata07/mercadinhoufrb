import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Search, ShoppingCart, UserPlus, Trash2, Plus, Minus, DollarSign, Eye, Printer } from 'lucide-react';
import './Vendas.css';

const formatCPF = (value) => {
  if (!value) return value;
  const cpf = value.replace(/[^\d]/g, ''); 
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

const Vendas = () => {
  const { produtos, clientes, addCliente, registrarVenda, vendas } = useDatabase();

  
  const [carrinho, setCarrinho] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClienteId, setSelectedClienteId] = useState('default');
  const [formaPagamento, setFormaPagamento] = useState('dinheiro');
  const [numParcelas, setNumParcelas] = useState(1);
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [showClientResults, setShowClientResults] = useState(false);
  const [caixaStatus, setCaixaStatus] = useState('livre');

  
  const [showQuickClientModal, setShowQuickClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientCpf, setNewClientCpf] = useState('');

  
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelPassword, setCancelPassword] = useState('');
  const [modalError, setModalError] = useState('');

  
  const [showSearchSalesModal, setShowSearchSalesModal] = useState(false);
  const [showSaleDetailsModal, setShowSaleDetailsModal] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);

  
  const [showSuccessCheckoutModal, setShowSuccessCheckoutModal] = useState(false);
  const [completedSale, setCompletedSale] = useState(null);

  
  const [printSaleTarget, setPrintSaleTarget] = useState(null);
  
  const [saleFilterClient, setSaleFilterClient] = useState('');
  const [saleFilterDate, setSaleFilterDate] = useState('');
  const [saleFilterStart, setSaleFilterStart] = useState('');
  const [saleFilterEnd, setSaleFilterEnd] = useState('');
  const [saleFilterMinVal, setSaleFilterMinVal] = useState('');
  const [saleFilterMaxVal, setSaleFilterMaxVal] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowQuickClientModal(false);
        setShowCancelModal(false);
        setShowClientResults(false);
        setSearchTerm('');
        setClientSearchQuery('');
        setShowSearchSalesModal(false);
        setShowSaleDetailsModal(false);
        setShowSuccessCheckoutModal(false);
        setPrintSaleTarget(null);
      }
      if (e.key === 'Enter') {
        const okBtn = document.getElementById('success-checkout-ok-btn');
        if (okBtn) {
          e.preventDefault();
          okBtn.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  
  const filteredProducts = produtos.filter((p) => {
    return (
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  
  const filteredClients = clientes
    .filter((c) => c.id !== 'default')
    .filter((c) => c.nome.toLowerCase().includes(clientSearchQuery.toLowerCase()));

  
  const addToCart = (product) => {
    setErrorMsg('');
    setSuccessMsg('');
    if (product.estoque <= 0) {
      setErrorMsg(`Produto "${product.nome}" sem estoque no momento.`);
      return;
    }

    setCarrinho((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantidade >= product.estoque) {
          setErrorMsg(`Quantidade máxima de estoque atingida para "${product.nome}".`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...prev, { ...product, quantidade: 1 }];
    });
    setCaixaStatus('aberto');
  };

  const updateCartQty = (productId, newQty) => {
    setErrorMsg('');
    const prod = produtos.find((p) => p.id === productId);
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    if (prod && newQty > prod.estoque) {
      setErrorMsg(`Estoque máximo atingido para "${prod.nome}".`);
      return;
    }
    setCarrinho((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantidade: newQty } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCarrinho((prev) => prev.filter((item) => item.id !== productId));
  };

  
  const handleQuickClientSubmit = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const created = addCliente({
      nome: newClientName,
      telefone: newClientPhone,
      cpf: newClientCpf,
    });

    setSelectedClienteId(created.id);
    setClientSearchQuery(created.nome);
    setNewClientName('');
    setNewClientPhone('');
    setNewClientCpf('');
    setShowQuickClientModal(false);
  };

  
  const handleCheckout = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (carrinho.length === 0) {
      setErrorMsg('Adicione pelo menos um produto ao carrinho.');
      return;
    }

    
    if (formaPagamento === 'fiado' && selectedClienteId === 'default') {
      setErrorMsg('Venda do tipo "Fiado" exige obrigatoriamente a identificação do cliente (não pode ser Consumidor).');
      return;
    }

    
    const finalFormaPagamento = formaPagamento === 'credito' 
      ? `crédito (${numParcelas}x)` 
      : formaPagamento;

    const vendaData = {
      clienteId: selectedClienteId,
      itens: carrinho.map((item) => ({
        produtoId: item.id,
        quantidade: item.quantidade,
        precoVenda: item.preco,
      })),
      formaPagamento: finalFormaPagamento,
    };

    const saleResult = registrarVenda(vendaData);
    setCompletedSale(saleResult);
    setShowSuccessCheckoutModal(true);

    setCarrinho([]);
    setSelectedClienteId('default');
    setClientSearchQuery('');
    setFormaPagamento('dinheiro');
    setNumParcelas(1);
    setCaixaStatus('livre');
  };

  const handleCancelVenda = (e) => {
    e.preventDefault();
    setModalError('');
    if (cancelPassword === 'admin') {
      setCarrinho([]);
      setSelectedClienteId('default');
      setClientSearchQuery('');
      setFormaPagamento('dinheiro');
      setNumParcelas(1);
      setCaixaStatus('aberto');
      setSuccessMsg('Venda cancelada com sucesso!');
      setCancelPassword('');
      setShowCancelModal(false);
      setTimeout(() => setSuccessMsg(''), 2000);
    } else {
      setModalError('Senha incorreta. Cancelamento não autorizado.');
    }
  };

  const filteredSales = (vendas || []).filter((sale) => {
    if (saleFilterClient && !sale.clienteNome.toLowerCase().includes(saleFilterClient.toLowerCase())) {
      return false;
    }
    if (saleFilterDate) {
      const saleDateStr = sale.data.split('T')[0];
      if (saleDateStr !== saleFilterDate) return false;
    }
    if (saleFilterStart) {
      const saleDateStr = sale.data.split('T')[0];
      if (saleDateStr < saleFilterStart) return false;
    }
    if (saleFilterEnd) {
      const saleDateStr = sale.data.split('T')[0];
      if (saleDateStr > saleFilterEnd) return false;
    }
    if (saleFilterMinVal) {
      if (sale.valorTotal < Number(saleFilterMinVal)) return false;
    }
    if (saleFilterMaxVal) {
      if (sale.valorTotal > Number(saleFilterMaxVal)) return false;
    }
    return true;
  });

  const total = carrinho.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <>
      <div className="vendas-container container animate-fade-in">
      <div className="vendas-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '24px 0', flexWrap: 'wrap', gap: '16px' }}>
        <h1 className="vendas-title" style={{ margin: 0 }}>
          Status: <span className={caixaStatus === 'livre' ? 'caixa-livre' : 'caixa-aberto'}>
            {caixaStatus === 'livre' ? 'CAIXA LIVRE' : 'CAIXA ABERTO'}
          </span>
        </h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setSaleFilterClient('');
            setSaleFilterDate('');
            setSaleFilterStart('');
            setSaleFilterEnd('');
            setSaleFilterMinVal('');
            setSaleFilterMaxVal('');
            setShowSearchSalesModal(true);
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: '600' }}
        >
          <Search size={16} />
          Buscar Vendas Lançadas
        </button>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="pdv-grid">
        {}
        <div className="pdv-left-section">
          {}
          <div className="card search-card-pdv">
            <h3 className="section-subtitle">Buscar Produtos</h3>
            <div className="pdv-search-box">
              <Search className="pdv-search-icon" size={18} />
              <input
                type="text"
                placeholder="Busque por nome ou marca do produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pdv-search-input"
              />
            </div>

            {}
            {searchTerm && (
              <div className="pdv-results-dropdown">
                {filteredProducts.slice(0, 5).map((p) => (
                  <div
                    key={p.id}
                    className="pdv-search-result-item"
                    onClick={() => {
                      addToCart(p);
                      setSearchTerm('');
                    }}
                  >
                    <div className="pdv-result-info">
                      <span className="font-bold">{p.nome}</span>
                      <span className="text-secondary">{p.marca} ({p.unidade})</span>
                    </div>
                    <div className="pdv-result-action">
                      <span className="result-price">
                        R$ {p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className={`badge ${p.estoque > 5 ? 'badge-success' : 'badge-warning'}`}>
                        Estoque: {p.estoque}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <p className="no-result-text">Nenhum produto cadastrado com esse termo.</p>
                )}
              </div>
            )}
          </div>

          {}
          <div className="card cart-card-pdv">
            <div className="cart-header-pdv">
              <h3 className="section-subtitle flex-align gap-2">
                <ShoppingCart size={18} className="text-accent" />
                Carrinho de Venda
              </h3>
              <span className="badge badge-success">{carrinho.length} itens</span>
            </div>

            {carrinho.length === 0 ? (
              <div className="empty-cart-pdv">
                <p>Nenhum item adicionado à venda. Pesquise um produto para começar.</p>
              </div>
            ) : (
              <div className="cart-items-pdv-list">
                {carrinho.map((item) => (
                  <div key={item.id} className="cart-item-pdv">
                    <div className="cart-item-pdv-info">
                      <span className="cart-item-name">{item.nome}</span>
                      <span className="cart-item-sub">
                        {item.marca} - R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="cart-item-pdv-actions">
                      <div className="qty-picker">
                        <button
                          className="qty-picker-btn"
                          onClick={() => updateCartQty(item.id, item.quantidade - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-picker-val">{item.quantidade}</span>
                        <button
                          className="qty-picker-btn"
                          onClick={() => updateCartQty(item.id, item.quantidade + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="cart-item-total">
                        R$ {(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>

                      <button
                        className="delete-item-pdv"
                        onClick={() => removeFromCart(item.id)}
                        title="Remover"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {}
        <div className="pdv-right-section">
          <div className="card checkout-card-pdv">
            <h3 className="section-subtitle mb-4">Informações da Venda</h3>

            {}
            {formaPagamento === 'fiado' ? (
              <div className="form-group client-search-group-pdv">
                <div className="label-with-action">
                  <label htmlFor="cliente-search-input" className="form-label">Buscar Cliente (Fiado) *</label>
                  <button
                    type="button"
                    className="quick-client-add-btn"
                    onClick={() => setShowQuickClientModal(true)}
                  >
                    <UserPlus size={14} />
                    Cadastrar Cliente
                  </button>
                </div>
                <div className="pdv-client-search-wrapper">
                  <input
                    id="cliente-search-input"
                    type="text"
                    placeholder="Digite para filtrar clientes..."
                    value={clientSearchQuery}
                    onChange={(e) => {
                      setClientSearchQuery(e.target.value);
                      setShowClientResults(true);
                    }}
                    onFocus={() => setShowClientResults(true)}
                    className="form-input"
                  />
                  {selectedClienteId !== 'default' && (
                    <div className="selected-client-display-badge">
                      Selecionado: <strong>{clientes.find(c => c.id === selectedClienteId)?.nome}</strong>
                      <button
                        type="button"
                        className="clear-selected-client-btn"
                        onClick={() => {
                          setSelectedClienteId('default');
                          setClientSearchQuery('');
                        }}
                      >
                        ×
                      </button>
                    </div>
                  )}
                  {showClientResults && clientSearchQuery && (
                    <div className="pdv-client-results-dropdown">
                      {filteredClients.map((c) => (
                        <div
                          key={c.id}
                          className="pdv-client-result-item"
                          onClick={() => {
                            setSelectedClienteId(c.id);
                            setClientSearchQuery(c.nome);
                            setShowClientResults(false);
                          }}
                        >
                          <span className="font-bold">{c.nome}</span>
                          <span className="text-secondary">{c.telefone || 'Sem Tel'}</span>
                        </div>
                      ))}
                      {filteredClients.length === 0 && (
                        <p className="no-result-text">Nenhum cliente correspondente.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Cliente</label>
                <div className="client-static-display">
                  <strong>Consumidor (Padrão)</strong>
                </div>
              </div>
            )}

            {}
            <div className="form-group">
              <label htmlFor="payment-select" className="form-label">Método de Pagamento</label>
              <select
                id="payment-select"
                value={formaPagamento}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormaPagamento(val);
                  if (val !== 'fiado') {
                    setSelectedClienteId('default');
                    setClientSearchQuery('');
                  }
                }}
                className="form-select"
              >
                <option value="dinheiro">Dinheiro (Espécie)</option>
                <option value="pix">Pix</option>
                <option value="debito">Cartão de Débito</option>
                <option value="credito">Cartão de Crédito</option>
                <option value="alimentacao">Vale Alimentação</option>
                <option value="fiado">Fiado (Caderneta)</option>
              </select>
            </div>

            {formaPagamento === 'credito' && (
              <div className="form-group animate-fade-in" style={{ marginTop: '12px' }}>
                <label htmlFor="installments-select" className="form-label">Parcelas</label>
                <select
                  id="installments-select"
                  value={numParcelas}
                  onChange={(e) => setNumParcelas(Number(e.target.value))}
                  className="form-select"
                >
                  <option value={1}>1x de R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (sem juros)</option>
                  {[2, 3, 4, 5, 6].map((x) => (
                    <option key={x} value={x}>
                      {x}x de R$ {(total / x).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (sem juros)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="summary-pdv-divider"></div>

            <div className="total-box-pdv">
              <span className="total-label-pdv">Total Geral</span>
              <span className="total-value-pdv">
                R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <button className="btn btn-primary checkout-pdv-btn" onClick={handleCheckout}>
              <DollarSign size={18} />
              Finalizar Venda
            </button>

            {carrinho.length > 0 && (
              <button 
                type="button" 
                className="btn btn-danger w-full mt-2" 
                onClick={() => {
                  setShowCancelModal(true);
                  setCancelPassword('');
                  setModalError('');
                }}
                style={{ marginTop: '10px', width: '100%' }}
              >
                Cancelar Venda
              </button>
            )}
          </div>
        </div>
      </div>
      </div>

      {}
      {showQuickClientModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="form-title">Cadastrar Novo Cliente</h3>
            <form onSubmit={handleQuickClientSubmit}>
              <div className="form-group">
                <label htmlFor="modal-name-input" className="form-label">Nome Completo *</label>
                <input
                  id="modal-name-input"
                  type="text"
                  required
                  placeholder="Nome do cliente"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-phone-input" className="form-label">Telefone</label>
                <input
                  id="modal-phone-input"
                  type="text"
                  placeholder="(00) 00000-0000"
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="modal-cpf-input" className="form-label">CPF (Opcional)</label>
                <input
                  id="modal-cpf-input"
                  type="text"
                  placeholder="000.000.000-00"
                  value={newClientCpf}
                  onChange={(e) => setNewClientCpf(formatCPF(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowQuickClientModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showCancelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="form-title">Confirmar Cancelamento</h3>
            
            {modalError && <div className="alert alert-danger">{modalError}</div>}

            <form onSubmit={handleCancelVenda}>
              <div className="form-group">
                <label htmlFor="cancel-password-input" className="form-label">
                  Confirme a senha de administrador para cancelar a venda:
                </label>
                <input
                  id="cancel-password-input"
                  type="password"
                  required
                  placeholder="Senha admin"
                  value={cancelPassword}
                  onChange={(e) => setCancelPassword(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  Voltar
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showSearchSalesModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content" style={{ maxWidth: '850px', width: '90%' }}>
            <h3 className="form-title">Buscar Vendas Lançadas</h3>
            
            {}
            <div className="filters-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Cliente</label>
                <input
                  type="text"
                  placeholder="Nome do cliente"
                  value={saleFilterClient}
                  onChange={(e) => setSaleFilterClient(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Data Específica</label>
                <input
                  type="date"
                  value={saleFilterDate}
                  onChange={(e) => {
                    setSaleFilterDate(e.target.value);
                    setSaleFilterStart('');
                    setSaleFilterEnd('');
                  }}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Período (Início)</label>
                <input
                  type="date"
                  value={saleFilterStart}
                  disabled={!!saleFilterDate}
                  onChange={(e) => setSaleFilterStart(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Período (Fim)</label>
                <input
                  type="date"
                  value={saleFilterEnd}
                  disabled={!!saleFilterDate}
                  onChange={(e) => setSaleFilterEnd(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor Mínimo (R$)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={saleFilterMinVal}
                  onChange={(e) => setSaleFilterMinVal(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Valor Máximo (R$)</label>
                <input
                  type="number"
                  placeholder="9999.00"
                  value={saleFilterMaxVal}
                  onChange={(e) => setSaleFilterMaxVal(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            {}
            <div className="table-wrapper" style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Cód. Venda</th>
                    <th>Cliente</th>
                    <th>Data / Hora</th>
                    <th>Pagamento</th>
                    <th>Total</th>
                    <th className="action-column">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="font-bold">{sale.id}</td>
                      <td>{sale.clienteNome}</td>
                      <td>{new Date(sale.data).toLocaleString('pt-BR')}</td>
                      <td>
                        <span className="badge" style={{ textTransform: 'capitalize' }}>
                          {sale.formaPagamento}
                        </span>
                      </td>
                      <td className="font-bold text-success">
                        R$ {sale.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td>
                        <div className="actions-cell" style={{ display: 'flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="edit-action-btn"
                            onClick={() => {
                              setSelectedSale(sale);
                              setShowSaleDetailsModal(true);
                            }}
                            title="Visualizar Detalhes"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            className="edit-action-btn"
                            onClick={() => {
                              setPrintSaleTarget(sale);
                            }}
                            title="Imprimir Cupom"
                            style={{ color: 'var(--success)' }}
                          >
                            <Printer size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredSales.length === 0 && (
                    <tr>
                      <td colSpan="6" className="no-data-msg text-center">Nenhuma venda encontrada com os filtros informados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-actions-btns">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSearchSalesModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showSaleDetailsModal && selectedSale && (
        <div className="modal-overlay" style={{ zIndex: 400 }}>
          <div className="modal-content" style={{ maxWidth: '650px', width: '90%' }}>
            <h3 className="form-title">Detalhes da Venda {selectedSale.id}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', fontSize: '14px' }}>
              <div>
                <p><strong>Cliente:</strong> {selectedSale.clienteNome}</p>
                <p><strong>Data/Hora:</strong> {new Date(selectedSale.data).toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p><strong>Forma de Pagamento:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedSale.formaPagamento}</span></p>
                <p><strong>Status de Pagamento:</strong> {selectedSale.pago ? <span className="badge badge-success">Pago</span> : <span className="badge badge-danger">Pendente (Fiado)</span>}</p>
              </div>
            </div>

            <div className="table-wrapper mb-4" style={{ maxHeight: '250px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Preço Unit.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.itens.map((item, idx) => (
                    <tr key={idx}>
                      <td className="font-bold">{item.produtoNome}</td>
                      <td>{item.quantidade} {item.unidade || 'un'}</td>
                      <td>R$ {item.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="font-bold">
                        R$ {(item.quantidade * item.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
              <div>
                <span className="text-secondary" style={{ fontSize: '14px' }}>Total Geral</span>
              </div>
              <div>
                <strong className="text-success" style={{ fontSize: '20px' }}>
                  R$ {selectedSale.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </strong>
              </div>
            </div>

            <div className="modal-actions-btns" style={{ marginTop: '24px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowSaleDetailsModal(false);
                  setSelectedSale(null);
                }}
              >
                Fechar Detalhes
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showSuccessCheckoutModal && completedSale && (
        <div className="modal-overlay" style={{ zIndex: 500 }}>
          <div className="modal-content text-center" style={{ maxWidth: '440px', width: '90%', padding: '24px 20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="form-title text-success" style={{ marginBottom: '4px' }}>Venda Concluída!</h3>
            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '16px', lineHeight: '1.4' }}>
              A transação foi registrada e o estoque atualizado. Veja o cupom de venda abaixo:
            </p>

            {}
            <div className="thermal-ticket" id="thermal-print-area">
              <div className="thermal-ticket-header">
                <h2>MERCADINHO UFRB</h2>
                <p className="ticket-subtitle">COMPROVANTE DE VENDA</p>
                <p className="ticket-non-fiscal">(CUPOM NÃO FISCAL)</p>
              </div>
              
              <div className="ticket-divider">--------------------------------</div>
              
              <div className="ticket-info-grid">
                <div>
                  <span className="ticket-info-label">CLIENTE:</span>
                  <span className="ticket-info-val">{completedSale.clienteNome.toUpperCase()}</span>
                </div>
                <div>
                  <span className="ticket-info-label">REGISTRO:</span>
                  <span className="ticket-info-val">{completedSale.id}</span>
                </div>
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-info-grid flex-row justify-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span className="ticket-info-label">DATA:</span>
                  <span className="ticket-info-val">{new Date(completedSale.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="ticket-info-label">HORA:</span>
                  <span className="ticket-info-val">
                    {new Date(completedSale.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-items-list">
                {completedSale.itens.map((item, idx) => (
                  <div key={idx} className="ticket-item-row">
                    <span className="ticket-item-name">{item.produtoNome}</span>
                    <div className="ticket-item-details">
                      <span>{item.quantidade} {item.unidade || 'un'} x R$ {item.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className="font-mono">R$ {(item.quantidade * item.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-totals">
                <div className="ticket-total-row">
                  <span>PAGTO:</span>
                  <span style={{ textTransform: 'uppercase' }}>{completedSale.formaPagamento}</span>
                </div>
                <div className="ticket-total-row grand-total">
                  <span>TOTAL:</span>
                  <span>R$ {completedSale.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-footer">
                <p>OBRIGADO PELA PREFERÊNCIA!</p>
                <p className="ticket-thanks">Guarde este recibo</p>
              </div>
            </div>

            <div className="modal-actions-btns" style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => window.print()}
                style={{ padding: '10px', fontWeight: '700' }}
              >
                Imprimir Cupom
              </button>
              <button
                id="success-checkout-ok-btn"
                type="button"
                className="btn btn-success w-full"
                onClick={() => {
                  setShowSuccessCheckoutModal(false);
                  setCompletedSale(null);
                }}
                style={{ padding: '10px', fontWeight: '700' }}
              >
                Confirmar (Enter / ESC)
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {printSaleTarget && (
        <div className="modal-overlay" style={{ zIndex: 600 }}>
          <div className="modal-content text-center" style={{ maxWidth: '440px', width: '90%', padding: '24px 20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="form-title text-primary" style={{ marginBottom: '4px' }}>Cupom da Venda</h3>
            <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '16px', lineHeight: '1.4' }}>
              Pré-visualização do cupom de venda (Não Fiscal):
            </p>

            {}
            <div className="thermal-ticket" id="thermal-print-area">
              <div className="thermal-ticket-header">
                <h2>MERCADINHO UFRB</h2>
                <p className="ticket-subtitle">COMPROVANTE DE VENDA</p>
                <p className="ticket-non-fiscal">(CUPOM NÃO FISCAL)</p>
              </div>
              
              <div className="ticket-divider">--------------------------------</div>
              
              <div className="ticket-info-grid">
                <div>
                  <span className="ticket-info-label">CLIENTE:</span>
                  <span className="ticket-info-val">{printSaleTarget.clienteNome.toUpperCase()}</span>
                </div>
                <div>
                  <span className="ticket-info-label">REGISTRO:</span>
                  <span className="ticket-info-val">{printSaleTarget.id}</span>
                </div>
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-info-grid flex-row justify-between" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span className="ticket-info-label">DATA:</span>
                  <span className="ticket-info-val">{new Date(printSaleTarget.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div>
                  <span className="ticket-info-label">HORA:</span>
                  <span className="ticket-info-val">
                    {new Date(printSaleTarget.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-items-list">
                {printSaleTarget.itens.map((item, idx) => (
                  <div key={idx} className="ticket-item-row">
                    <span className="ticket-item-name">{item.produtoNome}</span>
                    <div className="ticket-item-details">
                      <span>{item.quantidade} {item.unidade || 'un'} x R$ {item.precoVenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className="font-mono">R$ {(item.quantidade * item.precoVenda).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-totals">
                <div className="ticket-total-row">
                  <span>PAGTO:</span>
                  <span style={{ textTransform: 'uppercase' }}>{printSaleTarget.formaPagamento}</span>
                </div>
                <div className="ticket-total-row grand-total">
                  <span>TOTAL:</span>
                  <span>R$ {printSaleTarget.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="ticket-divider">--------------------------------</div>

              <div className="ticket-footer">
                <p>OBRIGADO PELA PREFERÊNCIA!</p>
                <p className="ticket-thanks">Guarde este recibo</p>
              </div>
            </div>

            <div className="modal-actions-btns" style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => window.print()}
                style={{ padding: '10px', fontWeight: '700' }}
              >
                Imprimir
              </button>
              <button
                type="button"
                className="btn btn-danger w-full"
                onClick={() => setPrintSaleTarget(null)}
                style={{ padding: '10px', fontWeight: '700' }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Vendas;
