import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { jsPDF } from 'jspdf';
import { FileText, Printer, FileSpreadsheet } from 'lucide-react';
import './Relatorios.css';

const Relatorios = () => {
  const { produtos, vendas, compras, financeiro } = useDatabase();
  const [reportType, setReportType] = useState('estoque'); 

  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  
  const getReportData = () => {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (reportType === 'estoque') {
      return produtos.map((p) => ({
        Produto: p.nome,
        Marca: p.marca,
        Estoque: `${p.estoque} ${p.unidade}`,
        'Preço Unitário': `R$ ${p.preco.toFixed(2)}`,
        'Total Estimado': `R$ ${(p.estoque * p.preco).toFixed(2)}`,
      }));
    }

    if (reportType === 'vendas') {
      const filtered = vendas.filter((v) => {
        const vDate = new Date(v.data);
        if (start && vDate < start) return false;
        if (end && vDate > end) return false;
        return true;
      });
      return filtered.map((v) => ({
        ID: v.id,
        Cliente: v.clienteNome,
        Data: new Date(v.data).toLocaleString('pt-BR'),
        Total: `R$ ${v.valorTotal.toFixed(2)}`,
        Pagamento: v.formaPagamento.toUpperCase(),
        Status: v.pago ? 'Pago' : 'Em Aberto',
      }));
    }

    if (reportType === 'inadimplencia') {
      const filtered = vendas.filter((v) => v.formaPagamento === 'fiado' && !v.pago);
      return filtered.map((v) => ({
        ID: v.id,
        Cliente: v.clienteNome,
        Data: new Date(v.data).toLocaleDateString('pt-BR'),
        Total: `R$ ${v.valorTotal.toFixed(2)}`,
      }));
    }

    if (reportType === 'balanco') {
      const filtered = financeiro.filter((f) => {
        const fDate = new Date(f.data);
        if (start && fDate < start) return false;
        if (end && fDate > end) return false;
        return true;
      });
      return filtered.map((f) => ({
        Data: new Date(f.data).toLocaleString('pt-BR'),
        Descrição: f.descricao,
        Tipo: f.tipo,
        Valor: `R$ ${f.valor.toFixed(2)}`,
      }));
    }

    return [];
  };

  const data = getReportData();

  
  const exportToCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(';'), 
      ...data.map((row) =>
        headers.map((fieldName) => JSON.stringify(row[fieldName] || '')).join(';')
      ),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(csvRows.join('\n'));
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `relatorio_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  const exportToPDF = () => {
    const doc = new jsPDF();
    const title = `Relatorio de ${reportType.toUpperCase()}`;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Mercadinho UFRB - Gestao Comercial', 14, 20);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text(title, 14, 28);
    doc.text(`Data de Emissão: ${new Date().toLocaleString('pt-BR')}`, 14, 34);
    doc.line(14, 38, 196, 38);

    let y = 46;
    if (data.length === 0) {
      doc.text('Nenhum dado encontrado para o relatorio.', 14, y);
    } else {
      const headers = Object.keys(data[0]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      
      
      let x = 14;
      headers.forEach((h) => {
        doc.text(h.substring(0, 15), x, y);
        x += 35;
      });

      doc.line(14, y + 2, 196, y + 2);
      y += 8;

      doc.setFont('Helvetica', 'normal');
      data.forEach((row) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        x = 14;
        headers.forEach((h) => {
          doc.text(String(row[h]).substring(0, 18), x, y);
          x += 35;
        });
        y += 7;
      });
    }

    doc.save(`relatorio_${reportType}_${Date.now()}.pdf`);
  };

  
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="relatorios-container container animate-fade-in">
      <h1 className="relatorios-title no-print">Painel de Relatórios</h1>

      {}
      <div className="card filters-card no-print">
        <h3 className="section-subtitle mb-4">Configuração do Relatório</h3>

        <div className="report-config-grid">
          <div className="form-group">
            <label className="form-label">Tipo de Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="form-select"
            >
              <option value="estoque">Inventário de Estoque Completo</option>
              <option value="vendas">Relatório de Vendas</option>
              <option value="inadimplencia">Relatório de Inadimplência (Fiados)</option>
              <option value="balanco">Demonstrativo Financeiro (Entradas/Saídas)</option>
            </select>
          </div>

          {(reportType === 'vendas' || reportType === 'balanco') && (
            <>
              <div className="form-group">
                <label className="form-label">Data Inicial</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Data Final</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </>
          )}
        </div>

        <div className="export-action-btns">
          <button className="btn btn-secondary" onClick={exportToCSV} disabled={data.length === 0}>
            <FileSpreadsheet size={16} />
            Planilha (CSV)
          </button>
          <button className="btn btn-secondary" onClick={exportToPDF} disabled={data.length === 0}>
            <FileText size={16} />
            Baixar PDF (jsPDF)
          </button>
          <button className="btn btn-primary" onClick={triggerPrint} disabled={data.length === 0}>
            <Printer size={16} />
            Imprimir Relatório
          </button>
        </div>
      </div>

      {}
      <div className="card report-preview-card">
        <div className="print-only-header">
          <h2>Mercadinho UFRB - Mercadinho de Bairro</h2>
          <p>Relatório de {reportType.toUpperCase()}</p>
          <p>Emissão: {new Date().toLocaleString('pt-BR')}</p>
          <hr className="print-hr" />
        </div>

        <h3 className="section-subtitle mb-4 no-print">Pré-visualização do Relatório</h3>

        {data.length === 0 ? (
          <p className="no-data-msg text-center">Nenhum dado disponível para os filtros selecionados.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {Object.keys(data[0]).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((val, i) => (
                      <td key={i} className={val === 'Em Aberto' ? 'text-warning font-bold' : ''}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Relatorios;
