import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { DollarSign, CheckCircle2, TrendingUp, TrendingDown, ClipboardList } from 'lucide-react';
import './Financeiro.css';

const Financeiro = () => {
  const { vendas, financeiro, quitarFiado } = useDatabase();
  const [activeTab, setActiveTab] = useState('caixa'); 

  
  const fiadosAtivos = vendas.filter((v) => v.formaPagamento === 'fiado' && !v.pago);

  
  const totalEntradas = financeiro
    .filter((f) => f.tipo === 'Entrada')
    .reduce((sum, item) => sum + item.valor, 0);

  const totalSaidas = financeiro
    .filter((f) => f.tipo === 'Saída')
    .reduce((sum, item) => sum + item.valor, 0);

  const caixaAtual = totalEntradas - totalSaidas;

  const totalFiados = fiadosAtivos.reduce((sum, item) => sum + item.valorTotal, 0);

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="financeiro-container container animate-fade-in">
      <h1 className="financeiro-title">Módulo Financeiro</h1>

      {}
      <div className="financeiro-cards-grid">
        <div className="fin-card card color-saldo">
          <div className="fin-card-header">
            <span className="fin-card-title">Saldo do Caixa</span>
            <DollarSign size={20} />
          </div>
          <div className="fin-card-value">{formatCurrency(caixaAtual)}</div>
          <p className="fin-card-sub">Diferença de Entradas/Saídas</p>
        </div>

        <div className="fin-card card color-entradas">
          <div className="fin-card-header">
            <span className="fin-card-title">Total Entradas (Vendas/Quitações)</span>
            <TrendingUp size={20} />
          </div>
          <div className="fin-card-value">+{formatCurrency(totalEntradas)}</div>
          <p className="fin-card-sub">Valores físicos recebidos</p>
        </div>

        <div className="fin-card card color-saidas">
          <div className="fin-card-header">
            <span className="fin-card-title">Total Saídas (Compras de Insumos)</span>
            <TrendingDown size={20} />
          </div>
          <div className="fin-card-value">-{formatCurrency(totalSaidas)}</div>
          <p className="fin-card-sub">Pagamento de mercadorias</p>
        </div>

        <div className="fin-card card color-fiados">
          <div className="fin-card-header">
            <span className="fin-card-title">Fiados Pendentes (A Receber)</span>
            <ClipboardList size={20} />
          </div>
          <div className="fin-card-value">{formatCurrency(totalFiados)}</div>
          <p className="fin-card-sub">Total de contas a receber</p>
        </div>
      </div>

      {}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'caixa' ? 'active' : ''}`}
          onClick={() => setActiveTab('caixa')}
        >
          Fluxo de Caixa / Transações ({financeiro.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'fiados' ? 'active' : ''}`}
          onClick={() => setActiveTab('fiados')}
        >
          Contas a Receber (Fiados) ({fiadosAtivos.length})
        </button>
      </div>

      {}
      {activeTab === 'caixa' && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição / Origem</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {financeiro.map((f) => (
                <tr key={f.id}>
                  <td>{new Date(f.data).toLocaleString('pt-BR')}</td>
                  <td className="font-bold">{f.descricao}</td>
                  <td>
                    <span className={`badge ${f.tipo === 'Entrada' ? 'badge-success' : 'badge-danger'}`}>
                      {f.tipo}
                    </span>
                  </td>
                  <td className={`font-bold ${f.tipo === 'Entrada' ? 'text-success' : 'text-error'}`}>
                    {f.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(f.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {}
      {activeTab === 'fiados' && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cód. Venda</th>
                <th>Cliente</th>
                <th>Data da Venda</th>
                <th>Itens da Venda</th>
                <th>Total Devido</th>
                <th>Status</th>
                <th className="action-column">Ações</th>
              </tr>
            </thead>
            <tbody>
              {fiadosAtivos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center no-data-msg">Nenhum fiado pendente. Tudo em dia!</td>
                </tr>
              ) : (
                fiadosAtivos.map((v) => (
                  <tr key={v.id}>
                    <td className="font-bold">{v.id}</td>
                    <td className="font-bold">{v.clienteNome}</td>
                    <td>{new Date(v.data).toLocaleDateString('pt-BR')}</td>
                    <td>
                      {v.itens.map((i) => `${i.produtoNome} (x${i.quantidade})`).join(', ')}
                    </td>
                    <td className="font-bold text-warning">{formatCurrency(v.valorTotal)}</td>
                    <td>
                      <span className="badge badge-warning">Em Aberto</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary receive-pay-btn"
                        onClick={() => quitarFiado(v.id)}
                        title="Registrar recebimento de pagamento"
                      >
                        <CheckCircle2 size={14} />
                        Receber
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Financeiro;
