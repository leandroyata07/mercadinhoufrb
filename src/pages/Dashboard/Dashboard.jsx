import React from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { DollarSign, ShoppingCart, ArrowUpRight, ArrowDownRight, Package, AlertTriangle, Truck, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { vendas, compras, produtos, financeiro } = useDatabase();
  const navigate = useNavigate();

  
  const totalEntradas = financeiro
    .filter((f) => f.tipo === 'Entrada')
    .reduce((sum, item) => sum + item.valor, 0);

  const totalSaidas = financeiro
    .filter((f) => f.tipo === 'Saída')
    .reduce((sum, item) => sum + item.valor, 0);

  const caixaAtual = totalEntradas - totalSaidas;

  
  const fiadosEmAberto = vendas
    .filter((v) => v.formaPagamento === 'fiado' && !v.pago)
    .reduce((sum, item) => sum + item.valorTotal, 0);

  
  const produtosEstoqueBaixo = produtos.filter((p) => p.estoque <= 5);

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="dashboard-wrapper container animate-fade-in">
      <section className="welcome-banner">
        <div>
          <h1 className="welcome-title">Olá, Administrador!</h1>
          <p className="welcome-subtitle">Acompanhe as estatísticas e controle o caixa do Mercadinho UFRB hoje.</p>
        </div>
      </section>

      {}
      <div className="metrics-grid">
        <div className="metric-card color-caixa">
          <div className="metric-header">
            <span className="metric-title">Caixa Atual</span>
            <span className="metric-icon-box">
              <DollarSign size={20} />
            </span>
          </div>
          <div className="metric-value">{formatCurrency(caixaAtual)}</div>
          <div className="metric-sub">Em caixa e contas pagas</div>
        </div>

        <div className="metric-card color-fiados">
          <div className="metric-header">
            <span className="metric-title">Fiados a Receber</span>
            <span className="metric-icon-box">
              <ArrowUpRight size={20} />
            </span>
          </div>
          <div className="metric-value">{formatCurrency(fiadosEmAberto)}</div>
          <div className="metric-sub">Contas ativas em aberto</div>
        </div>

        <div className="metric-card color-faturamento">
          <div className="metric-header">
            <span className="metric-title">Faturamento de Vendas</span>
            <span className="metric-icon-box">
              <ShoppingCart size={20} />
            </span>
          </div>
          <div className="metric-value">
            {formatCurrency(vendas.reduce((sum, v) => sum + v.valorTotal, 0))}
          </div>
          <div className="metric-sub">{vendas.length} vendas efetuadas</div>
        </div>

        <div className="metric-card color-investimento">
          <div className="metric-header">
            <span className="metric-title">Investimento em Compras</span>
            <span className="metric-icon-box">
              <ArrowDownRight size={20} />
            </span>
          </div>
          <div className="metric-value">
            {formatCurrency(compras.reduce((sum, c) => sum + c.valorTotal, 0))}
          </div>
          <div className="metric-sub">{compras.length} compras de estoque</div>
        </div>
      </div>

      <div className="dashboard-layout">
        {}
        <div className="dashboard-column flex-2">
          <div className="card">
            <div className="card-header-flex">
              <h3 className="card-title flex-align">
                <Package size={20} className="mr-2 text-accent" />
                Alertas de Estoque Crítico
              </h3>
              <span className="badge badge-danger">{produtosEstoqueBaixo.length}</span>
            </div>

            {produtosEstoqueBaixo.length === 0 ? (
              <p className="no-data-msg text-center">Nenhum produto com estoque crítico no momento.</p>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Marca</th>
                      <th>Estoque</th>
                      <th>Preço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtosEstoqueBaixo.map((p) => (
                      <tr key={p.id}>
                        <td className="font-bold flex-align gap-2">
                          <AlertTriangle size={14} className="text-error" />
                          {p.nome}
                        </td>
                        <td>{p.marca}</td>
                        <td className="text-error font-bold">{p.estoque} {p.unidade}</td>
                        <td>{formatCurrency(p.preco)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
