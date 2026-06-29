import React, { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext();

const initialClientes = [
  { id: 'default', nome: 'Consumidor', telefone: '', cpf: '' },
  { id: 'cli-1', nome: 'Maria Silva', telefone: '(11) 98888-7777', cpf: '123.456.789-00', isPreRegistered: true },
  { id: 'cli-2', nome: 'João Santos', telefone: '(11) 97777-6666', cpf: '987.654.321-11', isPreRegistered: true },
  { id: 'cli-3', nome: 'Ana Oliveira', telefone: '(21) 99999-1111', cpf: '111.222.333-44', isPreRegistered: true },
  { id: 'cli-4', nome: 'Pedro Souza', telefone: '(31) 98888-2222', cpf: '222.333.444-55', isPreRegistered: true },
  { id: 'cli-5', nome: 'Lucas Lima', telefone: '(41) 97777-3333', cpf: '333.444.555-66', isPreRegistered: true },
  { id: 'cli-6', nome: 'Juliana Costa', telefone: '(51) 96666-4444', cpf: '444.555.666-77', isPreRegistered: true },
  { id: 'cli-7', nome: 'Marcos Pereira', telefone: '(61) 95555-5555', cpf: '555.666.777-88', isPreRegistered: true },
  { id: 'cli-8', nome: 'Camila Rodrigues', telefone: '(71) 94444-6666', cpf: '666.777.888-99', isPreRegistered: true },
  { id: 'cli-9', nome: 'Bruno Alves', telefone: '(81) 93333-7777', cpf: '777.888.999-00', isPreRegistered: true },
  { id: 'cli-10', nome: 'Amanda Gomes', telefone: '(85) 92222-8888', cpf: '888.999.000-11', isPreRegistered: true },
];

const initialFornecedores = [
  { id: 'for-1', nome: 'Distribuidora Alimentos S.A.', cnpj: '12.345.678/0001-99', endereco: 'Av. Industrial, 1000 - SP', telefone: '(11) 3222-1111', contato: 'Roberto', isPreRegistered: true },
  { id: 'for-2', nome: 'Hortifruti Vale Verde', cnpj: '98.765.432/0001-88', endereco: 'Sítio Novo, s/n - interior', telefone: '(81) 98888-2222', contato: 'Margarida', isPreRegistered: true },
  { id: 'for-3', nome: 'Bebidas Rio Claro', cnpj: '11.222.333/0001-44', endereco: 'Rua das Fontes, 12 - SP', telefone: '(19) 3456-7890', contato: 'Carlos Bebidas', isPreRegistered: true },
  { id: 'for-4', nome: 'Laticínios da Fazenda', cnpj: '22.333.444/0001-55', endereco: 'Estrada das Vacas, Km 5 - MG', telefone: '(31) 3333-4444', contato: 'Geraldo do Leite', isPreRegistered: true },
  { id: 'for-5', nome: 'Panificadora Central Ltda.', cnpj: '33.444.555/0001-66', endereco: 'Av. Central, 450 - BA', telefone: '(75) 3221-5555', contato: 'Seu Manoel', isPreRegistered: true },
  { id: 'for-6', nome: 'Açougue Boi Gordo Fornecimentos', cnpj: '44.555.666/0001-77', endereco: 'Rua do Comércio, 88 - GO', telefone: '(62) 3555-8888', contato: 'Chico da Carne', isPreRegistered: true },
  { id: 'for-7', nome: 'Embalagens Descartáveis S.A.', cnpj: '55.666.777/0001-88', endereco: 'Distrito Industrial, 50 - PE', telefone: '(81) 3444-5555', contato: 'Valéria Sacolas', isPreRegistered: true },
  { id: 'for-8', nome: 'Distribuidora de Limpeza Express', cnpj: '66.777.888/0001-99', endereco: 'Rua Limpa, 100 - PR', telefone: '(41) 3222-9999', contato: 'Dona Limpa', isPreRegistered: true },
  { id: 'for-9', nome: 'Doces & Fios Indústria', cnpj: '77.888.999/0001-00', endereco: 'Av. Açúcar, 1500 - AL', telefone: '(82) 3555-0000', contato: 'Clara Doces', isPreRegistered: true },
  { id: 'for-10', nome: 'Frutas e Cia Importação', cnpj: '88.999.000/0001-11', endereco: 'Porto de Salvador - BA', telefone: '(71) 3223-1111', contato: 'Mário Frutas', isPreRegistered: true },
];

const initialProdutos = [
  { id: 'prod-1', nome: 'Arroz Integral Tio João', marca: 'Tio João', unidade: 'kg', estoque: 15, preco: 8.50, isPreRegistered: true },
  { id: 'prod-2', nome: 'Feijão Carioca Camil', marca: 'Camil', unidade: 'kg', estoque: 20, preco: 9.00, isPreRegistered: true },
  { id: 'prod-3', nome: 'Leite Integral Leitíssimo', marca: 'Leitíssimo', unidade: 'L', estoque: 30, preco: 6.20, isPreRegistered: true },
  { id: 'prod-4', nome: 'Café Melitta Vácuo', marca: 'Melitta', unidade: 'g', estoque: 25, preco: 18.90, isPreRegistered: true },
  { id: 'prod-5', nome: 'Macarrão Espaguete Adria', marca: 'Adria', unidade: 'g', estoque: 50, preco: 4.50, isPreRegistered: true },
  { id: 'prod-6', nome: 'Óleo de Soja Liza', marca: 'Liza', unidade: 'ml', estoque: 40, preco: 7.80, isPreRegistered: true },
  { id: 'prod-7', nome: 'Açúcar Refinado União', marca: 'União', unidade: 'kg', estoque: 35, preco: 5.10, isPreRegistered: true },
  { id: 'prod-8', nome: 'Sal Refinado Lebre', marca: 'Lebre', unidade: 'kg', estoque: 60, preco: 2.50, isPreRegistered: true },
  { id: 'prod-9', nome: 'Sabonete Rexona 90g', marca: 'Rexona', unidade: 'un', estoque: 100, preco: 3.20, isPreRegistered: true },
  { id: 'prod-10', nome: 'Detergente Ypê Coco 500ml', marca: 'Ypê', unidade: 'ml', estoque: 80, preco: 2.80, isPreRegistered: true },
];

const initialDespesas = [
  { id: 'desp-1', descricao: 'Conta de Energia - Coelba', categoria: 'Energia', valor: 350.80, dataVencimento: '2026-07-10', pago: false, isPreRegistered: true },
  { id: 'desp-2', descricao: 'Conta de Água - Embasa', categoria: 'Água', valor: 95.20, dataVencimento: '2026-07-12', pago: true, dataPagamento: '2026-06-25', isPreRegistered: true },
  { id: 'desp-3', descricao: 'Aluguel do Salão', categoria: 'Aluguel', valor: 1200.00, dataVencimento: '2026-07-05', pago: false, isPreRegistered: true },
];

const initialVendas = [];
const initialCompras = [];
const initialFinanceiro = [
  { id: 'init', tipo: 'Entrada', descricao: 'Abertura de Caixa', valor: 200.00, data: new Date().toISOString(), isPreRegistered: true },
  { id: 'fin-desp-2', tipo: 'Saída', descricao: 'Pagamento Despesa: Conta de Água - Embasa (Água)', valor: 95.20, data: '2026-06-25T14:00:00.000Z', isPreRegistered: true }
];

export const DatabaseProvider = ({ children }) => {
  const [clientes, setClientes] = useState(() => {
    const saved = localStorage.getItem('mercadinho_clientes');
    return saved ? JSON.parse(saved) : initialClientes;
  });

  const [fornecedores, setFornecedores] = useState(() => {
    const saved = localStorage.getItem('mercadinho_fornecedores');
    return saved ? JSON.parse(saved) : initialFornecedores;
  });

  const [produtos, setProdutos] = useState(() => {
    const saved = localStorage.getItem('mercadinho_produtos');
    return saved ? JSON.parse(saved) : initialProdutos;
  });

  const [vendas, setVendas] = useState(() => {
    const saved = localStorage.getItem('mercadinho_vendas');
    return saved ? JSON.parse(saved) : initialVendas;
  });

  const [compras, setCompras] = useState(() => {
    const saved = localStorage.getItem('mercadinho_compras');
    return saved ? JSON.parse(saved) : initialCompras;
  });

  const [financeiro, setFinanceiro] = useState(() => {
    const saved = localStorage.getItem('mercadinho_financeiro');
    return saved ? JSON.parse(saved) : initialFinanceiro;
  });

  const [despesas, setDespesas] = useState(() => {
    const saved = localStorage.getItem('mercadinho_despesas');
    return saved ? JSON.parse(saved) : initialDespesas;
  });

  const [notificationsList, setNotificationsList] = useState(() => {
    const saved = localStorage.getItem('mercadinho_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('mercadinho_settings');
    const defaultSettings = {
      limiteEstoqueBaixo: 5,
      diasAvisarVencimento: 3,
      alertasEstoqueAtivos: true,
      alertasDespesasAtivos: true,
    };
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('mercadinho_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('mercadinho_despesas', JSON.stringify(despesas));
  }, [despesas]);

  useEffect(() => {
    localStorage.setItem('mercadinho_notifications', JSON.stringify(notificationsList));
  }, [notificationsList]);

  
  useEffect(() => {
    const newNotifications = [];
    const hoje = new Date(new Date().setHours(0,0,0,0));

    
    if (settings.alertasEstoqueAtivos) {
      (produtos || []).forEach((p) => {
        let key = '';
        let titulo = '';
        let mensagem = '';
        let tipo = '';

        if (p.estoque === 0) {
          key = `stock-zero-${p.id}`;
          titulo = 'Sem Estoque';
          mensagem = `O produto "${p.nome}" está sem estoque.`;
          tipo = 'danger';
        } else if (p.estoque <= settings.limiteEstoqueBaixo) {
          key = `stock-low-${p.id}`;
          titulo = 'Estoque Baixo';
          mensagem = `"${p.nome}" tem apenas ${p.estoque} ${p.unidade} em estoque.`;
          tipo = 'warning';
        }

        if (key) {
          newNotifications.push({ key, titulo, mensagem, tipo });
        }
      });
    }

    
    if (settings.alertasDespesasAtivos) {
      (despesas || []).forEach((d) => {
        if (!d.pago) {
          const venc = new Date(d.dataVencimento);
          let key = '';
          let titulo = '';
          let mensagem = '';
          let tipo = '';

          if (venc < hoje) {
            key = `desp-late-${d.id}`;
            titulo = 'Despesa Vencida';
            mensagem = `"${d.descricao}" está vencida (${d.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}).`;
            tipo = 'danger';
          } else {
            const diffTime = venc.getTime() - hoje.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= settings.diasAvisarVencimento) {
              key = `desp-soon-${d.id}`;
              titulo = 'Vence em Breve';
              mensagem = `"${d.descricao}" vence em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}.`;
              tipo = 'warning';
            }
          }

          if (key) {
            newNotifications.push({ key, titulo, mensagem, tipo });
          }
        }
      });
    }

    
    setNotificationsList((prev) => {
      let updated = [...prev];
      let changed = false;

      newNotifications.forEach((newNotif) => {
        const exists = updated.some((n) => n.key === newNotif.key);
        if (!exists) {
          updated = [
            {
              id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              key: newNotif.key,
              titulo: newNotif.titulo,
              mensagem: newNotif.mensagem,
              tipo: newNotif.tipo,
              lida: false,
              data: new Date().toISOString(),
            },
            ...updated,
          ];
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [produtos, despesas, settings]);

  const marcarNotificacaoComoLida = (id) => {
    setNotificationsList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificationsList((prev) => prev.map((n) => ({ ...n, lida: true })));
  };

  const apagarTodasNotificacoes = () => {
    setNotificationsList([]);
  };

  const [hidePreRegistered, setHidePreRegistered] = useState(() => {
    return localStorage.getItem('mercadinho_hide_pre') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mercadinho_hide_pre', String(hidePreRegistered));
  }, [hidePreRegistered]);

  
  useEffect(() => {
    localStorage.setItem('mercadinho_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('mercadinho_fornecedores', JSON.stringify(fornecedores));
  }, [fornecedores]);

  useEffect(() => {
    localStorage.setItem('mercadinho_produtos', JSON.stringify(produtos));
  }, [produtos]);

  useEffect(() => {
    localStorage.setItem('mercadinho_vendas', JSON.stringify(vendas));
  }, [vendas]);

  useEffect(() => {
    localStorage.setItem('mercadinho_compras', JSON.stringify(compras));
  }, [compras]);

  useEffect(() => {
    localStorage.setItem('mercadinho_financeiro', JSON.stringify(financeiro));
  }, [financeiro]);

  
  const addCliente = (cliente) => {
    const newCliente = { ...cliente, id: `cli-${Date.now()}` };
    setClientes((prev) => [...prev, newCliente]);
    return newCliente;
  };
  const updateCliente = (id, updated) => {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };
  const deleteCliente = (id) => {
    if (id === 'default') return; 
    setClientes((prev) => prev.filter((c) => c.id !== id));
  };

  
  const addFornecedor = (forn) => {
    const newForn = { ...forn, id: `for-${Date.now()}` };
    setFornecedores((prev) => [...prev, newForn]);
    return newForn;
  };
  const updateFornecedor = (id, updated) => {
    setFornecedores((prev) => prev.map((f) => (f.id === id ? { ...f, ...updated } : f)));
  };
  const deleteFornecedor = (id) => {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
  };

  
  const addProduto = (prod) => {
    const newProd = { ...prod, id: `prod-${Date.now()}`, estoque: Number(prod.estoque || 0), preco: Number(prod.preco || 0) };
    setProdutos((prev) => [...prev, newProd]);
    return newProd;
  };
  const updateProduto = (id, updated) => {
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updated, estoque: Number(updated.estoque ?? p.estoque), preco: Number(updated.preco ?? p.preco) }
          : p
      )
    );
  };
  const deleteProduto = (id) => {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
  };

  
  const registrarVenda = (vendaData) => {
    
    const id = `ven-${Date.now()}`;
    const clienteObj = clientes.find((c) => c.id === vendaData.clienteId) || clientes[0];
    const totalVenda = vendaData.itens.reduce((sum, item) => sum + item.quantidade * item.precoVenda, 0);

    const novaVenda = {
      id,
      clienteId: clienteObj.id,
      clienteNome: clienteObj.nome,
      itens: vendaData.itens.map((item) => {
        const prod = produtos.find((p) => p.id === item.produtoId);
        return {
          ...item,
          produtoNome: prod ? prod.nome : 'Produto Removido',
          unidade: prod ? prod.unidade : 'un',
        };
      }),
      formaPagamento: vendaData.formaPagamento,
      valorTotal: totalVenda,
      pago: vendaData.formaPagamento !== 'fiado',
      data: new Date().toISOString(),
    };

    
    setProdutos((prevProdutos) =>
      prevProdutos.map((p) => {
        const itemVenda = vendaData.itens.find((i) => i.produtoId === p.id);
        if (itemVenda) {
          return { ...p, estoque: Math.max(0, p.estoque - itemVenda.quantidade) };
        }
        return p;
      })
    );

    
    setVendas((prev) => [novaVenda, ...prev]);

    
    if (vendaData.formaPagamento !== 'fiado') {
      const novaTransacao = {
        id: `fin-${Date.now()}`,
        tipo: 'Entrada',
        descricao: `Venda ${id} - Cli: ${clienteObj.nome}`,
        valor: totalVenda,
        data: new Date().toISOString(),
      };
      setFinanceiro((prev) => [novaTransacao, ...prev]);
    }

    return novaVenda;
  };

  const quitarFiado = (vendaId) => {
    setVendas((prevVendas) =>
      prevVendas.map((v) => {
        if (v.id === vendaId) {
          
          const novaTransacao = {
            id: `fin-${Date.now()}`,
            tipo: 'Entrada',
            descricao: `Quitação Fiado ${vendaId} - Cli: ${v.clienteNome}`,
            valor: v.valorTotal,
            data: new Date().toISOString(),
          };
          setFinanceiro((prev) => [novaTransacao, ...prev]);
          return { ...v, pago: true };
        }
        return v;
      })
    );
  };

  
  const registrarCompra = (compraData) => {
    
    const id = `com-${Date.now()}`;
    const fornObj = fornecedores.find((f) => f.id === compraData.fornecedorId);
    const totalCompra = compraData.itens.reduce((sum, item) => sum + item.quantidade * item.custoUnitario, 0);

    const novaCompra = {
      id,
      fornecedorId: fornObj ? fornObj.id : '',
      fornecedorNome: fornObj ? fornObj.nome : 'Sem Fornecedor',
      itens: compraData.itens.map((item) => {
        const prod = produtos.find((p) => p.id === item.produtoId);
        return {
          ...item,
          produtoNome: prod ? prod.nome : 'Produto Novo',
          unidade: prod ? prod.unidade : 'un',
        };
      }),
      valorTotal: totalCompra,
      data: new Date().toISOString(),
    };

    
    setProdutos((prevProdutos) =>
      prevProdutos.map((p) => {
        const itemCompra = compraData.itens.find((i) => i.produtoId === p.id);
        if (itemCompra) {
          return { ...p, estoque: p.estoque + itemCompra.quantidade };
        }
        return p;
      })
    );

    
    setCompras((prev) => [novaCompra, ...prev]);

    
    const novaTransacao = {
      id: `fin-${Date.now()}`,
      tipo: 'Saída',
      descricao: `Compra de insumos ${id} - Forn: ${fornObj ? fornObj.nome : 'S/F'}`,
      valor: totalCompra,
      data: new Date().toISOString(),
    };
    setFinanceiro((prev) => [novaTransacao, ...prev]);
  };

  const excluirCompra = (compraId) => {
    const compra = compras.find((c) => c.id === compraId);
    if (!compra) return;

    
    setProdutos((prevProdutos) =>
      prevProdutos.map((p) => {
        const itemCompra = compra.itens.find((i) => i.produtoId === p.id);
        if (itemCompra) {
          const novoEstoque = Math.max(0, p.estoque - itemCompra.quantidade);
          return { ...p, estoque: novoEstoque };
        }
        return p;
      })
    );

    
    setFinanceiro((prev) =>
      prev.filter((f) => !f.descricao.includes(`Compra de insumos ${compraId}`))
    );

    
    setCompras((prev) => prev.filter((c) => c.id !== compraId));
  };

  const updateCompra = (compraId, updatedCompraData) => {
    const oldCompra = compras.find((c) => c.id === compraId);
    if (!oldCompra) return;

    const fornObj = fornecedores.find((f) => f.id === updatedCompraData.fornecedorId);
    const totalCompra = updatedCompraData.itens.reduce((sum, item) => sum + item.quantidade * item.custoUnitario, 0);

    
    setProdutos((prevProdutos) =>
      prevProdutos.map((p) => {
        const itemAntigo = oldCompra.itens.find((i) => i.produtoId === p.id);
        let estoqueRevertido = p.estoque;
        if (itemAntigo) {
          estoqueRevertido = Math.max(0, estoqueRevertido - itemAntigo.quantidade);
        }
        const itemNovo = updatedCompraData.itens.find((i) => i.produtoId === p.id);
        if (itemNovo) {
          estoqueRevertido += itemNovo.quantidade;
        }
        return { ...p, estoque: estoqueRevertido };
      })
    );

    
    const compraAtualizada = {
      ...oldCompra,
      fornecedorId: fornObj ? fornObj.id : '',
      fornecedorNome: fornObj ? fornObj.nome : 'Sem Fornecedor',
      itens: updatedCompraData.itens.map((item) => {
        const prod = produtos.find((p) => p.id === item.produtoId);
        return {
          ...item,
          produtoNome: prod ? prod.nome : 'Produto Novo',
          unidade: prod ? prod.unidade : 'un',
        };
      }),
      valorTotal: totalCompra,
    };

    setCompras((prev) => prev.map((c) => (c.id === compraId ? compraAtualizada : c)));

    
    setFinanceiro((prev) =>
      prev.map((f) => {
        if (f.descricao.includes(`Compra de insumos ${compraId}`)) {
          return {
            ...f,
            descricao: `Compra de insumos ${compraId} - Forn: ${fornObj ? fornObj.nome : 'S/F'}`,
            valor: totalCompra,
          };
        }
        return f;
      })
    );
  };

  
  const addDespesa = (desp) => {
    const newId = `desp-${Date.now()}`;
    const newDesp = { ...desp, id: newId, valor: Number(desp.valor || 0) };
    setDespesas((prev) => [...prev, newDesp]);

    if (newDesp.pago) {
      const novaTransacao = {
        id: `fin-desp-${newId}`,
        tipo: 'Saída',
        descricao: `Pagamento Despesa: ${newDesp.descricao} (${newDesp.categoria})`,
        valor: newDesp.valor,
        data: newDesp.dataPagamento ? new Date(newDesp.dataPagamento).toISOString() : new Date().toISOString(),
      };
      setFinanceiro((prev) => [novaTransacao, ...prev]);
    }
    return newDesp;
  };

  const updateDespesa = (id, updated) => {
    const oldDesp = despesas.find(d => d.id === id);
    if (!oldDesp) return;

    const newPago = updated.pago;
    const newValor = Number(updated.valor || 0);

    setDespesas((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updated, valor: newValor } : d))
    );

    if (oldDesp.pago && !newPago) {
      setFinanceiro((prev) => prev.filter((f) => f.id !== `fin-desp-${id}`));
    } else if (!oldDesp.pago && newPago) {
      const novaTransacao = {
        id: `fin-desp-${id}`,
        tipo: 'Saída',
        descricao: `Pagamento Despesa: ${updated.descricao} (${updated.categoria})`,
        valor: newValor,
        data: updated.dataPagamento ? new Date(updated.dataPagamento).toISOString() : new Date().toISOString(),
      };
      setFinanceiro((prev) => [novaTransacao, ...prev]);
    } else if (oldDesp.pago && newPago) {
      setFinanceiro((prev) =>
        prev.map((f) =>
          f.id === `fin-desp-${id}`
            ? {
                ...f,
                descricao: `Pagamento Despesa: ${updated.descricao} (${updated.categoria})`,
                valor: newValor,
                data: updated.dataPagamento ? new Date(updated.dataPagamento).toISOString() : f.data,
              }
            : f
        )
      );
    }
  };

  const deleteDespesa = (id) => {
    const oldDesp = despesas.find(d => d.id === id);
    setDespesas((prev) => prev.filter((d) => d.id !== id));
    if (oldDesp && oldDesp.pago) {
      setFinanceiro((prev) => prev.filter((f) => f.id !== `fin-desp-${id}`));
    }
  };

  
  const exportarBanco = () => {
    const data = {
      clientes,
      fornecedores,
      produtos,
      vendas,
      compras,
      financeiro,
      despesas,
    };
    return JSON.stringify(data, null, 2);
  };

  const restaurarBanco = (jsonStr) => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.clientes) setClientes(data.clientes);
      if (data.fornecedores) setFornecedores(data.fornecedores);
      if (data.produtos) setProdutos(data.produtos);
      if (data.vendas) setVendas(data.vendas);
      if (data.compras) setCompras(data.compras);
      if (data.financeiro) setFinanceiro(data.financeiro);
      if (data.despesas) setDespesas(data.despesas);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const visibleClientes = hidePreRegistered ? clientes.filter(c => !c.isPreRegistered) : clientes;
  const visibleFornecedores = hidePreRegistered ? fornecedores.filter(f => !f.isPreRegistered) : fornecedores;
  const visibleProdutos = hidePreRegistered ? produtos.filter(p => !p.isPreRegistered) : produtos;
  const visibleVendas = hidePreRegistered ? vendas.filter(v => !v.isPreRegistered) : vendas;
  const visibleCompras = hidePreRegistered ? compras.filter(c => !c.isPreRegistered) : compras;
  const visibleFinanceiro = hidePreRegistered ? financeiro.filter(f => !f.isPreRegistered) : financeiro;
  const visibleDespesas = hidePreRegistered ? despesas.filter(d => !d.isPreRegistered) : despesas;

  const ocultarDadosPreCadastrados = (ocultar) => {
    setHidePreRegistered(ocultar);
  };

  const restaurarDadosPreCadastrados = (limparTudo) => {
    if (limparTudo) {
      setClientes(initialClientes);
      setFornecedores(initialFornecedores);
      setProdutos(initialProdutos);
      setVendas(initialVendas);
      setCompras(initialCompras);
      setFinanceiro(initialFinanceiro);
      setDespesas(initialDespesas);
    }
    setHidePreRegistered(false);
  };

  return (
    <DatabaseContext.Provider
      value={{
        clientes: visibleClientes,
        addCliente,
        updateCliente,
        deleteCliente,
        fornecedores: visibleFornecedores,
        addFornecedor,
        updateFornecedor,
        deleteFornecedor,
        produtos: visibleProdutos,
        addProduto,
        updateProduto,
        deleteProduto,
        vendas: visibleVendas,
        registrarVenda,
        quitarFiado,
        compras: visibleCompras,
        registrarCompra,
        updateCompra,
        excluirCompra,
        despesas: visibleDespesas,
        addDespesa,
        updateDespesa,
        deleteDespesa,
        financeiro: visibleFinanceiro,
        notifications: notificationsList,
        marcarNotificacaoComoLida,
        marcarTodasComoLidas,
        apagarTodasNotificacoes,
        exportarBanco,
        restaurarBanco,
        hidePreRegistered,
        ocultarDadosPreCadastrados,
        restaurarDadosPreCadastrados,
        settings,
        setSettings,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase deve ser usado dentro de um DatabaseProvider');
  }
  return context;
};
