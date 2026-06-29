import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useSearchParams } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './Cadastros.css';

const formatCPF = (value) => {
  if (!value) return value;
  const cpf = value.replace(/[^\d]/g, ''); 
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
};

const formatCNPJ = (value) => {
  if (!value) return value;
  const cnpj = value.replace(/[^\d]/g, ''); 
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
  if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
  if (cnpj.length <= 12) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12, 14)}`;
};

const Cadastros = () => {
  const {
    clientes, addCliente, updateCliente, deleteCliente,
    produtos, addProduto, updateProduto, deleteProduto,
    fornecedores, addFornecedor, updateFornecedor, deleteFornecedor
  } = useDatabase();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'clientes';

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  
  const [formData, setFormData] = useState({});

  
  const [showSubFornecedorModal, setShowSubFornecedorModal] = useState(false);
  const [subFornecedorName, setSubFornecedorName] = useState('');
  const [subFornecedorCnpj, setSubFornecedorCnpj] = useState('');
  const [subFornecedorEndereco, setSubFornecedorEndereco] = useState('');
  const [subFornecedorPhone, setSubFornecedorPhone] = useState('');
  const [subFornecedorContact, setSubFornecedorContact] = useState('');
  const [subFornecedorError, setSubFornecedorError] = useState('');

  
  const [sortKeyClientes, setSortKeyClientes] = useState('nome');
  const [sortDirClientes, setSortDirClientes] = useState('asc');

  const [sortKeyProdutos, setSortKeyProdutos] = useState('nome');
  const [sortDirProdutos, setSortDirProdutos] = useState('asc');

  const [sortKeyFornecedores, setSortKeyFornecedores] = useState('nome');
  const [sortDirFornecedores, setSortDirFornecedores] = useState('asc');

  const handleSort = (tab, key) => {
    if (tab === 'clientes') {
      if (sortKeyClientes === key) {
        setSortDirClientes(sortDirClientes === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKeyClientes(key);
        setSortDirClientes('asc');
      }
    } else if (tab === 'produtos') {
      if (sortKeyProdutos === key) {
        setSortDirProdutos(sortDirProdutos === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKeyProdutos(key);
        setSortDirProdutos('asc');
      }
    } else if (tab === 'fornecedores') {
      if (sortKeyFornecedores === key) {
        setSortDirFornecedores(sortDirFornecedores === 'asc' ? 'desc' : 'asc');
      } else {
        setSortKeyFornecedores(key);
        setSortDirFornecedores('asc');
      }
    }
  };

  const renderSortIndicator = (tab, key) => {
    let activeKey, direction;
    if (tab === 'clientes') {
      activeKey = sortKeyClientes;
      direction = sortDirClientes;
    } else if (tab === 'produtos') {
      activeKey = sortKeyProdutos;
      direction = sortDirProdutos;
    } else if (tab === 'fornecedores') {
      activeKey = sortKeyFornecedores;
      direction = sortDirFornecedores;
    }

    if (activeKey !== key) {
      return <span style={{ marginLeft: '4px', opacity: 0.35 }}>↕</span>;
    }
    return <span style={{ marginLeft: '4px', color: 'var(--accent)' }}>{direction === 'asc' ? '▲' : '▼'}</span>;
  };

  
  const sortedClientes = [...clientes].sort((a, b) => {
    if (a.id === 'default') return -1;
    if (b.id === 'default') return 1;

    let valA = a[sortKeyClientes] || '';
    let valB = b[sortKeyClientes] || '';

    if (typeof valA === 'string') {
      return sortDirClientes === 'asc'
        ? valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' })
        : valB.localeCompare(valA, 'pt-BR', { sensitivity: 'base' });
    } else {
      return sortDirClientes === 'asc' ? valA - valB : valB - valA;
    }
  });

  const sortedProdutos = [...produtos].sort((a, b) => {
    let valA = a[sortKeyProdutos];
    let valB = b[sortKeyProdutos];

    if (sortKeyProdutos === 'fornecedorId') {
      const fornA = fornecedores.find(f => f.id === a.fornecedorId)?.nome || '';
      const fornB = fornecedores.find(f => f.id === b.fornecedorId)?.nome || '';
      return sortDirProdutos === 'asc'
        ? fornA.localeCompare(fornB, 'pt-BR', { sensitivity: 'base' })
        : fornB.localeCompare(fornA, 'pt-BR', { sensitivity: 'base' });
    }

    if (typeof valA === 'string') {
      return sortDirProdutos === 'asc'
        ? valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' })
        : valB.localeCompare(valA, 'pt-BR', { sensitivity: 'base' });
    } else {
      valA = valA || 0;
      valB = valB || 0;
      return sortDirProdutos === 'asc' ? valA - valB : valB - valA;
    }
  });

  const sortedFornecedores = [...fornecedores].sort((a, b) => {
    let valA = a[sortKeyFornecedores] || '';
    let valB = b[sortKeyFornecedores] || '';

    if (typeof valA === 'string') {
      return sortDirFornecedores === 'asc'
        ? valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' })
        : valB.localeCompare(valA, 'pt-BR', { sensitivity: 'base' });
    } else {
      return sortDirFornecedores === 'asc' ? valA - valB : valB - valA;
    }
  });

  useEffect(() => {
    
    setFormData({});
    setEditingId(null);
    setShowModal(false);
  }, [activeTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowSubFornecedorModal(false);
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    if (activeTab === 'clientes') {
      setFormData({ nome: '', telefone: '', cpf: '' });
    } else if (activeTab === 'produtos') {
      setFormData({ nome: '', marca: '', unidade: 'un', estoque: 0, preco: 0.0 });
    } else if (activeTab === 'fornecedores') {
      setFormData({ nome: '', cnpj: '', endereco: '', telefone: '', contato: '' });
    }
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingId(item.id);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      if (activeTab === 'clientes') deleteCliente(id);
      if (activeTab === 'produtos') deleteProduto(id);
      if (activeTab === 'fornecedores') deleteFornecedor(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (activeTab === 'clientes') {
      if (editingId) {
        updateCliente(editingId, formData);
      } else {
        addCliente(formData);
      }
    } else if (activeTab === 'produtos') {
      const data = {
        ...formData,
        estoque: Number(formData.estoque),
        preco: Number(formData.preco),
      };
      if (editingId) {
        updateProduto(editingId, data);
      } else {
        addProduto(data);
      }
    } else if (activeTab === 'fornecedores') {
      if (editingId) {
        updateFornecedor(editingId, formData);
      } else {
        addFornecedor(formData);
      }
    }

    setShowModal(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'cpf') {
      finalValue = formatCPF(value);
    } else if (name === 'cnpj') {
      finalValue = formatCNPJ(value);
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubFornecedorSubmit = (e) => {
    e.preventDefault();
    if (!subFornecedorName.trim()) {
      setSubFornecedorError('Por favor, informe a razão social/nome do fornecedor.');
      return;
    }
    const created = addFornecedor({
      nome: subFornecedorName,
      cnpj: subFornecedorCnpj,
      endereco: subFornecedorEndereco,
      telefone: subFornecedorPhone,
      contato: subFornecedorContact
    });
    setFormData(prev => ({ ...prev, fornecedorId: created.id }));
    setShowSubFornecedorModal(false);
    setSubFornecedorName('');
    setSubFornecedorCnpj('');
    setSubFornecedorEndereco('');
    setSubFornecedorPhone('');
    setSubFornecedorContact('');
    setSubFornecedorError('');
  };

  return (
    <>
      <div className="cadastros-container container animate-fade-in">
        <div className="cadastros-header">
        <h1 className="cadastros-title">Central de Cadastros</h1>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} />
          Cadastrar Novo
        </button>
      </div>

      {}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => handleTabChange('clientes')}
        >
          Clientes ({clientes.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'produtos' ? 'active' : ''}`}
          onClick={() => handleTabChange('produtos')}
        >
          Produtos ({produtos.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'fornecedores' ? 'active' : ''}`}
          onClick={() => handleTabChange('fornecedores')}
        >
          Fornecedores ({fornecedores.length})
        </button>
      </div>

      {}
      <div className="table-wrapper">
        {activeTab === 'clientes' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable-th" onClick={() => handleSort('clientes', 'nome')}>
                  Nome {renderSortIndicator('clientes', 'nome')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('clientes', 'telefone')}>
                  Telefone {renderSortIndicator('clientes', 'telefone')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('clientes', 'cpf')}>
                  CPF {renderSortIndicator('clientes', 'cpf')}
                </th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedClientes.map((c) => (
                <tr key={c.id}>
                  <td className="font-bold">{c.nome} {c.id === 'default' && <span className="badge badge-success ml-2">Padrão</span>}</td>
                  <td>{c.telefone || '-'}</td>
                  <td>{c.cpf || '-'}</td>
                  <td>
                    {c.id !== 'default' && (
                      <div className="actions-cell">
                        <button className="edit-action-btn" onClick={() => handleOpenEdit(c)} title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button className="delete-action-btn" onClick={() => handleDelete(c.id)} title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'produtos' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable-th" onClick={() => handleSort('produtos', 'nome')}>
                  Produto {renderSortIndicator('produtos', 'nome')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('produtos', 'marca')}>
                  Marca {renderSortIndicator('produtos', 'marca')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('produtos', 'fornecedorId')}>
                  Fornecedor {renderSortIndicator('produtos', 'fornecedorId')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('produtos', 'unidade')}>
                  Unidade {renderSortIndicator('produtos', 'unidade')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('produtos', 'estoque')}>
                  Estoque {renderSortIndicator('produtos', 'estoque')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('produtos', 'preco')}>
                  Preço Unitário {renderSortIndicator('produtos', 'preco')}
                </th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedProdutos.map((p) => {
                const forn = fornecedores.find((f) => f.id === p.fornecedorId);
                return (
                  <tr key={p.id}>
                    <td className="font-bold">{p.nome}</td>
                    <td>{p.marca}</td>
                    <td>{forn ? forn.nome : '-'}</td>
                    <td>{p.unidade}</td>
                    <td className={p.estoque <= 5 ? 'text-error font-bold' : ''}>
                      {p.estoque} {p.unidade}
                    </td>
                    <td>R$ {p.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="edit-action-btn" onClick={() => handleOpenEdit(p)} title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button className="delete-action-btn" onClick={() => handleDelete(p.id)} title="Excluir">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {activeTab === 'fornecedores' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable-th" onClick={() => handleSort('fornecedores', 'nome')}>
                  Nome / Razão Social {renderSortIndicator('fornecedores', 'nome')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('fornecedores', 'cnpj')}>
                  CNPJ/CPF {renderSortIndicator('fornecedores', 'cnpj')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('fornecedores', 'contato')}>
                  Contato {renderSortIndicator('fornecedores', 'contato')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('fornecedores', 'telefone')}>
                  Telefone {renderSortIndicator('fornecedores', 'telefone')}
                </th>
                <th className="sortable-th" onClick={() => handleSort('fornecedores', 'endereco')}>
                  Endereço {renderSortIndicator('fornecedores', 'endereco')}
                </th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedFornecedores.map((f) => (
                <tr key={f.id}>
                  <td className="font-bold">{f.nome}</td>
                  <td>{f.cnpj || '-'}</td>
                  <td>{f.contato || '-'}</td>
                  <td>{f.telefone || '-'}</td>
                  <td>{f.endereco || '-'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="edit-action-btn" onClick={() => handleOpenEdit(f)} title="Editar">
                        <Edit2 size={14} />
                      </button>
                      <button className="delete-action-btn" onClick={() => handleDelete(f.id)} title="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>

      {}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="form-title">
              {editingId ? 'Editar Registro' : 'Novo Cadastro'} - {activeTab.toUpperCase()}
            </h3>
            <form onSubmit={handleSubmit}>
              {activeTab === 'clientes' && (
                <>
                  <div className="form-group">
                    <label htmlFor="cli-name" className="form-label">Nome Completo *</label>
                    <input
                      id="cli-name"
                      type="text"
                      name="nome"
                      required
                      value={formData.nome || ''}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cli-phone" className="form-label">Telefone</label>
                    <input
                      id="cli-phone"
                      type="text"
                      name="telefone"
                      value={formData.telefone || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cli-cpf" className="form-label">CPF (Opcional)</label>
                    <input
                      id="cli-cpf"
                      type="text"
                      name="cpf"
                      value={formData.cpf || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </>
              )}

              {activeTab === 'produtos' && (
                <>
                  <div className="form-group">
                    <label htmlFor="prod-name" className="form-label">Nome do Produto *</label>
                    <input
                      id="prod-name"
                      type="text"
                      name="nome"
                      required
                      value={formData.nome || ''}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="prod-brand" className="form-label">Marca *</label>
                      <input
                        id="prod-brand"
                        type="text"
                        name="marca"
                        required
                        value={formData.marca || ''}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prod-unit" className="form-label">Unidade de Medida *</label>
                      <select
                        id="prod-unit"
                        name="unidade"
                        required
                        value={formData.unidade || 'un'}
                        onChange={handleInputChange}
                        className="form-select"
                      >
                        <option value="un">Unidade (un)</option>
                        <option value="kg">Quilograma (kg)</option>
                        <option value="g">Grama (g)</option>
                        <option value="L">Litro (L)</option>
                        <option value="ml">Mililitro (ml)</option>
                        <option value="cx">Caixa (cx)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="prod-stock" className="form-label">Estoque Inicial</label>
                      <input
                        id="prod-stock"
                        type="number"
                        name="estoque"
                        min="0"
                        value={formData.estoque ?? 0}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="prod-price" className="form-label">Preço de Venda (R$) *</label>
                      <input
                        id="prod-price"
                        type="number"
                        step="0.01"
                        min="0"
                        name="preco"
                        required
                        value={formData.preco ?? 0}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: '12px' }}>
                    <label htmlFor="prod-fornecedor" className="form-label">Fornecedor</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select
                        id="prod-fornecedor"
                        name="fornecedorId"
                        value={formData.fornecedorId || ''}
                        onChange={handleInputChange}
                        className="form-select"
                        style={{ flex: 1 }}
                      >
                        <option value="">Selecione um fornecedor...</option>
                        {fornecedores.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.nome}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setShowSubFornecedorModal(true);
                          setSubFornecedorName('');
                          setSubFornecedorCnpj('');
                          setSubFornecedorEndereco('');
                          setSubFornecedorError('');
                        }}
                        style={{ whiteSpace: 'nowrap', padding: '0 12px' }}
                      >
                        + Novo Fornecedor
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'fornecedores' && (
                <>
                  <div className="form-group">
                    <label htmlFor="for-name" className="form-label">Razão Social / Nome *</label>
                    <input
                      id="for-name"
                      type="text"
                      name="nome"
                      required
                      value={formData.nome || ''}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="for-cnpj" className="form-label">CNPJ / CPF</label>
                    <input
                      id="for-cnpj"
                      type="text"
                      name="cnpj"
                      value={formData.cnpj || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                   <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="for-contact" className="form-label">Nome do Contato</label>
                      <input
                        id="for-contact"
                        type="text"
                        name="contato"
                        value={formData.contato || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="Representante"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="for-phone" className="form-label">Telefone</label>
                      <input
                        id="for-phone"
                        type="text"
                        name="telefone"
                        value={formData.telefone || ''}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="(00) 0000-0000"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="for-address" className="form-label">Endereço</label>
                    <input
                      id="for-address"
                      type="text"
                      name="endereco"
                      value={formData.endereco || ''}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </>
              )}

              <div className="modal-actions-btns">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {showSubFornecedorModal && (
        <div className="modal-overlay" style={{ zIndex: 300 }}>
          <div className="modal-content">
            <h3 className="form-title">Cadastrar Novo Fornecedor</h3>
            
            {subFornecedorError && <div className="alert alert-danger">{subFornecedorError}</div>}

            <form onSubmit={handleSubFornecedorSubmit}>
              <div className="form-group">
                <label htmlFor="sub-for-name" className="form-label">Razão Social / Nome *</label>
                <input
                  id="sub-for-name"
                  type="text"
                  required
                  placeholder="Nome do Fornecedor"
                  value={subFornecedorName}
                  onChange={(e) => setSubFornecedorName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="sub-for-cnpj" className="form-label">CNPJ / CPF</label>
                <input
                  id="sub-for-cnpj"
                  type="text"
                  placeholder="00.000.000/0001-00"
                  value={subFornecedorCnpj}
                  onChange={(e) => setSubFornecedorCnpj(formatCNPJ(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="sub-for-contact" className="form-label">Nome do Contato</label>
                  <input
                    id="sub-for-contact"
                    type="text"
                    placeholder="Representante"
                    value={subFornecedorContact}
                    onChange={(e) => setSubFornecedorContact(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="sub-for-phone" className="form-label">Telefone</label>
                  <input
                    id="sub-for-phone"
                    type="text"
                    placeholder="(00) 0000-0000"
                    value={subFornecedorPhone}
                    onChange={(e) => setSubFornecedorPhone(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="sub-for-address" className="form-label">Endereço</label>
                <input
                  id="sub-for-address"
                  type="text"
                  placeholder="Av. Principal, 123"
                  value={subFornecedorEndereco}
                  onChange={(e) => setSubFornecedorEndereco(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-actions-btns">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowSubFornecedorModal(false);
                    setSubFornecedorName('');
                    setSubFornecedorCnpj('');
                    setSubFornecedorEndereco('');
                    setSubFornecedorPhone('');
                    setSubFornecedorContact('');
                    setSubFornecedorError('');
                  }}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Fornecedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Cadastros;
