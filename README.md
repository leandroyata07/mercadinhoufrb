# Mercadinho UFRB - Sistema de Gestão Comercial e PDV 🛍️

Este repositório contém o projeto final (**Trabalho 4**) desenvolvido para o componente curricular de desenvolvimento web. O sistema consiste em uma solução completa de Frente de Caixa (PDV) e Retaguarda (ERP) voltada para o comércio varejista simulado (**Mercadinho UFRB**), construída como uma Single Page Application (SPA) moderna, responsiva e de alta performance utilizando **React 19**, **Vite** e **Vanilla CSS**.

---

## 🎓 Contexto Acadêmico

* **Instituição:** Universidade Federal do Recôncavo da Bahia (UFRB)
* **Estudante:** Leandro Yata
* **Projeto:** Trabalho Final (Trabalho 4) - Sistema de Gestão e Frente de Caixa

---

## 🖥️ Visão Geral do Sistema

O objetivo deste projeto foi desenvolver um sistema integrado que simule a rotina operacional e administrativa de um mercado de bairro. A aplicação conta com controle de acesso, retaguarda financeira, controle de estoque, gestão de compras e despesas, relatórios consolidados e um terminal de vendas (PDV) com simulação de cupom térmico e impressão. Toda a persistência de dados é feita localmente através do **LocalStorage** com suporte a backup e restauração.

---

## 🚀 Módulos e Funcionalidades Implementadas

### 1. 🛒 Frente de Caixa (PDV)
* **Busca Rápida de Produtos:** Pesquisa instantânea por nome ou marca e filtragem inteligente por categorias.
* **Carrinho Otimizado:** Exibição elegante limitada a **5 itens simultâneos**. A partir do 6º item, o sistema ativa uma rolagem interna com barra de rolagem minimalista, evitando que a tela se desloque verticalmente.
* **Cadastro Expresso de Clientes:** Atalho rápido para cadastrar um novo cliente sem sair da tela de vendas.
* **Método de Pagamento Dinâmico:** Suporte a Dinheiro, Pix, Fiado (exige busca de cliente cadastrado) e Cartão de Crédito.
* **Parcelamento no Cartão (Até 6x):** Opção de parcelamento em até 6x para o cliente, configurada com a regra de que a empresa recebe o valor de forma integral/à vista.
* **Cupom de Venda Não Fiscal (Simulado):** 
  * Geração instantânea de um recibo térmico após a finalização da venda.
  * Estilização fiel a impressoras térmicas (fundo creme `#fff8d6`, tipografia mono-espaçada `Courier New` e bordas serrilhadas imitadoras do corte de papel).
  * Integração com regras CSS `@media print` que isolam apenas o cupom em largura padrão (76mm/80mm) ao imprimir, ocultando os elementos do sistema.
* **Histórico e Reimpressão:** Tela para buscar vendas lançadas com filtros por data, período, cliente e valor. Permite abrir a pré-visualização do cupom correspondente e escolher se deseja imprimi-lo ou não.

### 2. 🗂️ Central de Cadastros (Clientes, Produtos e Fornecedores)
* **Tabelas Compactas (Scroll Limit):** Cada tabela exibe no máximo os **8 primeiros cadastros**. A partir do 9º registro, o contêiner ativa rolagem vertical e fixa o cabeçalho no topo (`position: sticky`), mantendo o alinhamento visual perfeito.
* **Ordenação Dinâmica de Colunas:** Clicar nos títulos das colunas (ex: Nome, Estoque, CPF, Preço) reordena a lista correspondente em ordem ascendente ou descendente. O cabeçalho exibe indicadores de estado (`▲`, `▼`, `↕`) e funciona de forma independente para cada cadastro.
* **Formatadores Inteligentes:** Inputs de CPF e CNPJ aplicam máscaras de formatação em tempo real durante a digitação.
* **Operações CRUD Completas:** Adição, edição e exclusão segura de todos os dados do banco.

### 3. 📦 Gestão de Estoque e Compras
* **Dashboard de Estoque:** Listagem de produtos com destaque em vermelho para itens com estoque crítico (menor ou igual a 5 unidades por padrão).
* **Painel de Compras:** Registro de entradas de mercadorias associadas a fornecedores, atualizando automaticamente o saldo físico do estoque e inserindo o custo das compras no fluxo financeiro.

### 4. 💰 Fluxo Financeiro e Controle de Despesas
* **Fluxo de Caixa (Abertura/Fechamento):** Controle do estado do caixa (Aberto/Fechado). Exibição consolidada de faturamento bruto, margem líquida e despesas operacionais.
* **Gestão de Despesas:** Cadastro de contas a pagar, com definição de categoria, valor, data de vencimento e status de pagamento (Pendente/Paga).

### 5. 🔔 Sistema de Alertas e Notificações (Sininho)
* **Painel Centralizado no Header:** Um ícone de sino exibe um crachá de notificações em tempo real.
* **Tipos de Alerta:**
  * Alerta de estoque baixo.
  * Alerta de despesas vencidas.
  * Alerta de despesas próximas ao vencimento.
* **Interatividade Avançada:**
  * Clicar em uma notificação individual marca-a como lida sem removê-la do histórico (mantendo o registro visível com tom opaco).
  * Atalho rápido para "Marcar tudo como lido".
  * Opção para apagar definitivamente todo o histórico de notificações (exige digitação da senha de administrador).

### 6. ⚙️ Central de Configurações e Segurança
* **Menu em Grid Moderno:** Substituição de painéis longos por um grid de categorias com ícones coloridos exclusivos e animações suaves de zoom e flutuação ao passar o mouse.
* **Modais Focados:** Cada configuração (Backup, Restauração, Senha, Limite de Alertas) abre de forma isolada em um modal sem fundo cinza escuro (mantendo o fundo visível e nítido) e livre de barras de rolagem desnecessárias no desktop.
* **Backup & Restauração:** Exportação completa da base de dados em formato `.json` e importação com duas opções: Mesclar dados ou Limpar base atual e restaurar.
* **Carga de Dados Demo:** Opção de preenchimento instantâneo do sistema com dados de teste comerciais para demonstração do fluxo completo.
* **Segurança de Ações:** Operações críticas (excluir cadastros, limpar dados, apagar notificações) exigem autorização por senha de administrador (padrão: `admin`).

---

## 🛠️ Tecnologias e Bibliotecas Utilizadas

* **React 19:** Biblioteca principal para renderização declarativa de componentes.
* **Vite:** Ferramenta de build e ambiente de desenvolvimento rápido.
* **React Router DOM v7:** Gerenciamento de rotas e navegação SPA.
* **Lucide React:** Conjunto premium de ícones vetoriais.
* **jsPDF:** Geração de relatórios administrativos em PDF para exportação.
* **Vanilla CSS:** Estilização baseada em variáveis de design system, flexbox, CSS grid e animações nativas.

---

## ⚙️ Instalação e Execução Local

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd trabalho4
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   *O projeto estará disponível por padrão no endereço: `http://localhost:5173`*

4. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 🔐 Credenciais Padrão do Sistema
* **Usuário:** `admin`
* **Senha:** `admin`
*(A senha é requisitada no login e também para autorizar a limpeza de dados e exclusão de logs de notificações).*
