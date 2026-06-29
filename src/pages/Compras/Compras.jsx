import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Plus, Trash2, Truck, Edit2 } from 'lucide-react';
import './Compras.css';

const Compras = () => {
  const { fornecedores, produtos, registrarCompra, updateCompra, compras, addProduto, updateProduto, excluirCompra } = useDatabase();

  const [selectedFornecedorId, setSelectedFornecedorId] = useState('');
  const [selectedProdutoId, setSelectedProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [custoUnitario, setCustoUnitario] = useState('');

  const [itensCompra, setItensCompra] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  
  const [showQuickProductModal, setShowQuickProductModal] = useState(false);
  const [quickProdName, setQuickProdName] = useState('');
  const [quickProdMarca, setQuickProdMarca] = useState('');
  const [quickProdUnidade, setQuickProdUnidade] = useState('un');
  const [quickProdPreco, setQuickProdPreco] = useState('');
  const [quickProdError, setQuickProdError] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingCompraId, setEditingCompraId] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);

  
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [purchaseToDeleteId, setPurchaseToDeleteId] = useState(null);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteConfirmError, setDeleteConfirmError] = useState('');

  
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowQuickProductModal(false);
        setEditingProductId(null);
        setShowDeleteConfirmModal(false);
        setPurchaseToDeleteId(null);
        setEditingCompraId(null);
        setEditingItemIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const qty = Number(quantidade || 0);
    const cost = Number(custoUnitario || 0);

    if (!selectedProdutoId) {
      setErrorMsg('Selecione um produto.');
      return;
    }
    if (qty <= 0) {
      setErrorMsg('A quantidade deve ser maior que zero.');
      return;
    }
    if (cost <= 0) {
      setErrorMsg('O custo unitário deve ser maior que zero.');
      return;
    }

    const prod = produtos.find((p) => p.id === selectedProdutoId);
    if (!prod) return;

    if (editingItemIndex !== null) {
      setItensCompra((prev) =>
        prev.map((item, idx) =>
          idx === editingItemIndex
            ? {
                produtoId: selectedProdutoId,
                produtoNome: prod.nome,
                unidade: prod.unidade,
                quantidade: qty,
                custoUnitario: cost,
              }
            : item
        )
      );
      setEditingItemIndex(null);
    } else {
      
      const existing = itensCompra.find((item) => item.produtoId === selectedProdutoId);
      if (existing) {
        setItensCompra((prev) =>
          prev.map((item) =>
            item.produtoId === selectedProdutoId
              ? { ...item, quantidade: item.quantidade + qty }
              : item
          )
        );
      } else {
        setItensCompra((prev) => [
          ...prev,
          {
            produtoId: selectedProdutoId,
            produtoNome: prod.nome,
            unidade: prod.unidade,
            quantidade: qty,
            custoUnitario: cost,
          },
        ]);
      }
    }

    
    setSelectedProdutoId('');
    setQuantidade('1');
    setCustoUnitario('');
  };

  const handleRemoveItem = (index) => {
    setItensCompra((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveCompra = () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedFornecedorId) {
      setErrorMsg('Selecione o fornecedor.');
      return;
    }
    if (itensCompra.length === 0) {
      setErrorMsg('Adicione pelo menos um item à compra.');
      return;
    }

    const cleanItens = itensCompra.map(item => ({
      produtoId: item.produtoId,
      quantidade: Number(item.quantidade),
      custoUnitario: Number(item.custoUnitario)
    }));

    if (editingCompraId) {
      updateCompra(editingCompraId, {
        fornecedorId: selectedFornecedorId,
        itens: cleanItens,
      });
      setSuccessMsg('Compra atualizada com sucesso!');
      setEditingCompraId(null);
    } else {
      registrarCompra({
        fornecedorId: selectedFornecedorId,
        itens: cleanItens,
      });
      setSuccessMsg('Compra e entrada de estoque registradas com sucesso!');
    }

    setItensCompra([]);
    setSelectedFornecedorId('');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleQuickProductSubmit = (e) => {
    e.preventDefault();
    if (!quickProdName.trim()) {
      setQuickProdError('Por favor, informe o nome do produto.');
      return;
    }
    if (!quickProdMarca.trim()) {
      setQuickProdError('Por favor, informe a marca.');
      return;
    }
    const price = Number(quickProdPreco || 0);
    if (price <= 0) {
      setQuickProdError('O preço de venda deve ser maior que zero.');
      return;
    }

    if (editingProductId) {
      updateProduto(editingProductId, {
        nome: quickProdName,
        marca: quickProdMarca,
        unidade: quickProdUnidade,
        preco: price,
      });
      setShowQuickProductModal(false);
      setEditingProductId(null);
    } else {
      const created = addProduto({
        nome: quickProdName,
        marca: quickProdMarca,
        unidade: quickProdUnidade,
        preco: price,
        estoque: 0,
        fornecedorId: selectedFornecedorId,
      });
      setSelectedProdutoId(created.id);
      setShowQuickProductModal(false);
    }

    setQuickProdName('');
    setQuickProdMarca('');
    setQuickProdUnidade('un');
    setQuickProdPreco('');
    setQuickProdError('');
  };

  const handleDeletePurchase = (e) => {
    e.preventDefault();
    if (deleteConfirmPassword === 'admin') {
      excluirCompra(purchaseToDeleteId);
      setShowDeleteConfirmModal(false);
      setPurchaseToDeleteId(null);
      setDeleteConfirmPassword('');
      setDeleteConfirmError('');
      setSuccessMsg('Compra excluída e estoque estornado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setDeleteConfirmError('Senha incorreta. Exclusão não autorizada.');
    }
  };

  const totalCompra = itensCompra.reduce((sum, item) => sum + item.quantidade * item.custoUnitario, 0);

  return (
    <>
      <div className="compras-container container animate-fade-in">
        <h1 className="compras-title">Entrada de Estoque (Compras)</h1>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <div className="compras-grid">
        {}
        <div className="compras-column flex-1">
          <div className="card">
            <h3 className="section-subtitle mb-4">{editingCompraId ? `Editar Compra (${editingCompraId})` : 'Nova Compra / Entrada'}</h3>

            <div className="form-group">
              <label htmlFor="forn-select" className="form-label">Fornecedor *</label>
              <select
                id="forn-select"
                value={selectedFornecedorId}
                onChange={(e) => setSelectedFornecedorId(e.target.value)}
                className="form-select"
              >
                <option value="">Selecione o Fornecedor</option>
                {fornecedores.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="divider-line"></div>

            <form onSubmit={handleAddItem} className="add-item-compra-form">
              <h4 className="item-form-title">{editingItemIndex !== null ? 'Editar Item no Lote' : 'Adicionar Item ao Lote'}</h4>

              <div className="form-group">
                <div className="label-with-action">
                  <label htmlFor="prod-select" className="form-label">Produto *</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {selectedFornecedorId && (
                      <button
                        type="button"
                        className="quick-client-add-btn"
                        onClick={() => {
                          setQuickProdName('');
                          setQuickProdMarca('');
                          setQuickProdUnidade('un');
                          setQuickProdPreco('');
                          setQuickProdError('');
                          setEditingProductId(null);
                          setShowQuickProductModal(true);
                        }}
                      >
                        + Novo Produto
                      </button>
                    )}
                    {selectedProdutoId && (
                      <>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>|</span>
                        <button
                          type="button"
                          className="quick-client-add-btn"
                          style={{ color: 'var(--accent)' }}
                          onClick={() => {
                            const p = produtos.find((item) => item.id === selectedProdutoId);
                            if (p) {
                              setQuickProdName(p.nome);
                              setQuickProdMarca(p.marca);
                              setQuickProdUnidade(p.unidade);
                              setQuickProdPreco(p.preco.toString());
                              setEditingProductId(p.id);
                              setShowQuickProductModal(true);
                            }
                          }}
                        >
                          Editar Produto
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <select
                  id="prod-select"
                  value={selectedProdutoId}
                  onChange={(e) => setSelectedProdutoId(e.target.value)}
                  className="form-select"
                >
                  <option value="">Selecione o Produto</option>
                  {produtos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.marca}) - Estoque: {p.estoque} {p.unidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="qty-input" className="form-label">Quantidade</label>
                  <input
                    id="qty-input"
                    type="number"
                    min="1"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cost-input" className="form-label">Custo Unitário (R$)</label>
                  <input
                    id="cost-input"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={custoUnitario}
                    onChange={(e) => setCustoUnitario(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {editingItemIndex !== null && (
                  <button
                    type="button"
                    className="btn btn-secondary w-full"
                    onClick={() => {
                      setEditingItemIndex(null);
                      setSelectedProdutoId('');
                      setQuantidade('1');
                      setCustoUnitario('');
                    }}
                  >
                    Cancelar
                  </button>
                )}
                <button type="submit" className="btn btn-primary w-full">
                  <Plus size={16} />
                  {editingItemIndex !== null ? 'Salvar Item' : 'Adicionar Item'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {}
        <div className="compras-column flex-2">
          <div className="card">
            <h3 className="section-subtitle mb-4">Itens da Entrada</h3>

            {itensCompra.length === 0 ? (
              <div className="empty-compra-box">
                <p>Nenhum item adicionado à compra.</p>
              </div>
            ) : (
              <>
                <div className="table-wrapper mb-4">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Produto</th>
                        <th>Qtd</th>
                        <th>Custo Unit.</th>
                        <th>Subtotal</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensCompra.map((item, index) => (
                        <tr key={index}>
                          <td className="font-bold">{item.produtoNome}</td>
                          <td>{item.quantidade} {item.unidade}</td>
                          <td>R$ {item.custoUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td>R$ {(item.quantidade * item.custoUnitario).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                          <td>
                            <div className="actions-cell">
                              <button
                                type="button"
                                className="edit-action-btn"
                                onClick={() => {
                                  setEditingItemIndex(index);
                                  setSelectedProdutoId(item.produtoId);
                                  setQuantidade(item.quantidade.toString());
                                  setCustoUnitario(item.custoUnitario.toString());
                                }}
                                title="Editar Item"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                type="button"
                                className="delete-action-btn"
                                onClick={() => {
                                  if (editingItemIndex === index) {
                                    setEditingItemIndex(null);
                                    setSelectedProdutoId('');
                                    setQuantidade('1');
                                    setCustoUnitario('');
                                  }
                                  handleRemoveItem(index);
                                }}
                                title="Remover"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="compra-total-bar">
                  <div className="compra-total-details">
                    <span>Total da Nota</span>
                    <strong>R$ {totalCompra.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {editingCompraId && (
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setEditingCompraId(null);
                          setItensCompra([]);
                          setSelectedFornecedorId('');
                          setSelectedProdutoId('');
                          setQuantidade('1');
                          setCustoUnitario('');
                        }}
                      >
                        Cancelar Edição
                      </button>
                    )}
                    <button className="btn btn-primary" onClick={handleSaveCompra}>
                      <Truck size={16} />
                      {editingCompraId ? 'Salvar Alterações' : 'Confirmar Entrada'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {}
      <section className="compras-history-section">
        <h2 className="history-section-title">Histórico de Entradas</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cód. Compra</th>
                <th>Fornecedor</th>
                <th>Data</th>
                <th>Itens Adquiridos</th>
                <th>Total da Nota</th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {compras.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center no-data-msg">Nenhuma compra registrada ainda.</td>
                </tr>
              ) : (
                compras.map((c) => (
                  <tr key={c.id}>
                    <td className="font-bold">{c.id}</td>
                    <td>{c.fornecedorNome}</td>
                    <td>{new Date(c.data).toLocaleString('pt-BR')}</td>
                    <td>
                      {c.itens.map((i) => `${i.produtoNome} (${i.quantidade} ${i.unidade})`).join(', ')}
                    </td>
                    <td className="font-bold text-error">R$ {c.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="edit-action-btn"
                          title="Editar Compra"
                          onClick={() => {
                            setEditingCompraId(c.id);
                            setSelectedFornecedorId(c.fornecedorId);
                            setItensCompra(c.itens.map(item => ({
                              produtoId: item.produtoId,
                              produtoNome: item.produtoNome,
                              unidade: item.unidade,
                              quantidade: item.quantidade.toString(),
                              custoUnitario: item.custoUnitario.toString()
                            })));
                            setSelectedProdutoId('');
                            setQuantidade('1');
                            setCustoUnitario('');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="delete-action-btn"
                          title="Excluir Compra"
                          onClick={() => {
                            setPurchaseToDeleteId(c.id);
                            setDeleteConfirmPassword('');
                            setDeleteConfirmError('');
                            setShowDeleteConfirmModal(true);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
      </div>

      {}
      {showQuickProductModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content">
            <h3 className="form-title">{editingProductId ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
            
            {quickProdError && <div className="alert alert-danger">{quickProdError}</div>}

            <form onSubmit={handleQuickProductSubmit}>
              <div className="form-group">
                <label htmlFor="quick-prod-name" className="form-label">Nome do Produto *</label>
                <input
                  id="quick-prod-name"
                  type="text"
                  required
                  placeholder="Nome do produto"
                  value={quickProdName}
                  onChange={(e) => setQuickProdName(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="quick-prod-brand" className="form-label">Marca *</label>
                  <input
                    id="quick-prod-brand"
                    type="text"
                    required
                    placeholder="Marca do produto"
                    value={quickProdMarca}
                    onChange={(e) => setQuickProdMarca(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quick-prod-unit" className="form-label">Unidade de Medida *</label>
                  <select
                    id="quick-prod-unit"
                    value={quickProdUnidade}
                    onChange={(e) => setQuickProdUnidade(e.target.value)}
                    className="form-select"
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="kg">Quilograma (kg)</option>
                    <option value="g">Grama (g)</option>
                    <option value="L">Litro (L)</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="cx">Caixa (cx)</option>
                    <option value="fd">Fardo (fd)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="quick-prod-price" className="form-label">Preço de Venda (R$) *</label>
                <input
                  id="quick-prod-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="Preço sugerido para venda"
                  value={quickProdPreco}
                  onChange={(e) => setQuickProdPreco(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowQuickProductModal(false);
                    setEditingProductId(null);
                    setQuickProdName('');
                    setQuickProdMarca('');
                    setQuickProdUnidade('un');
                    setQuickProdPreco('');
                    setQuickProdError('');
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProductId ? 'Salvar Alterações' : 'Salvar e Selecionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showDeleteConfirmModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content">
            <h3 className="form-title text-error">Excluir Registro de Compra</h3>
            <p className="text-secondary" style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
              <strong>Atenção:</strong> A exclusão desta compra irá estornar (reduzir) a quantidade correspondente de estoque dos produtos vinculados e estornar a despesa do Financeiro.
            </p>
            {deleteConfirmError && <div className="alert alert-danger">{deleteConfirmError}</div>}
            
            <form onSubmit={handleDeletePurchase}>
              <div className="form-group">
                <label htmlFor="delete-purchase-pass-input" className="form-label">
                  Confirme a senha de administrador (admin) para prosseguir:
                </label>
                <input
                  id="delete-purchase-pass-input"
                  type="password"
                  required
                  placeholder="Senha admin"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  className="form-input"
                  autoFocus
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirmModal(false);
                    setPurchaseToDeleteId(null);
                    setDeleteConfirmPassword('');
                    setDeleteConfirmError('');
                  }}
                >
                  Cancelar Exclusão
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirmar Exclusão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Compras;
