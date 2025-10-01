# Documentação Front-End – Aplicativo Administrativo Angular

Este repositório contém o front-end de um **aplicativo administrativo** desenvolvido em **Angular**, com foco em gestão de ocorrências, tickets e usuários. A aplicação integra-se com uma API REST para CRUD e dashboards de análise.

---

## Sumário
- [1. Ocorrências](#1-ocorrências-ocorrenciascomponent)
- [2. Configurações](#2-configurações-configuracoescomponent)
- [3. Login](#3-login-logincomponent)
- [4. Tickets](#4-tickets-ticketscomponent)
- [5. Usuários](#5-usuários-usuarioscomponent)
- [6. Dashboard](#6-dashboard-dashboardcomponent)
- [7. Modelo de Tabelas SQL](#7-modelo-de-tabelas-sql)
- [8. Exemplo JSON de Resposta da API](#8-exemplo-json-de-resposta-da-api)
- [Observações Gerais](#observações-gerais)

---

## 1. Ocorrências (`OcorrenciasComponent`)

- Exibe lista de ocorrências com filtros por **descrição**, **solicitante**, **status**, **categoria** e **datas**.
- Permite **seleção múltipla** e alteração em massa de status (`EM_ANDAMENTO`, `FINALIZADO`).
- Paginado com botão **“Carregar Mais”**.
- Campos principais de cada ocorrência:
  - `id`, `descricao`, `solicitante`, `categoria`, `data`, `status`.

---

## 2. Configurações (`ConfiguracoesComponent`)

- Seleção de **tema do mapa**: `Claro`, `Escuro`, `Satélite`.
- Seleção de cores **primária** e **secundária** a partir de uma paleta.
- Botões: **salvar configurações**, **exportar**, **criar novo ticket**.
- Campos principais:
  - `temaSelecionado: string`
  - `corPrimaria: string`
  - `corSecundaria: string`

---

## 3. Login (`LoginComponent`)

- Formulário de login com **email** e **senha**.
- Validação de campos e feedback de erros.
- Integração com `AuthService`.
- Redireciona para `/dashboard` apenas se o usuário for `ADMIN_MASTER`.
- Métodos importantes:
  - `onSubmit()`: envia dados do formulário.
  - `handleSuccess()`: trata login bem-sucedido.
  - `handleError()`: trata falha no login.
  - `scrollIntoView()`: ajusta foco nos inputs.
  - `showError()`: exibe mensagem de erro temporária.

---

## 4. Tickets (`TicketsComponent`)

- Lista de tickets com **filtros**, **ordenação** e **seleção múltipla**.
- Modal de detalhes com **chat interno** (`mensagens`).
- Campos principais:
  - `id`, `titulo`, `descricao`, `abertoPor`, `prioridade`, `status`, `setor`, `mensagensNaoLidas`.
- Funções:
  - `toggleSelecionarTodos()`
  - `verDetalhes(ticket)`
  - `alterarStatusSelecionados(event)`
  - `enviarMensagem()`
  - `fecharModal()`

---

## 5. Usuários (`UsuariosComponent`)

- Lista de usuários com **filtros**, **ordenação** e **seleção múltipla**.
- Modais para **criação**, **edição** e **ações** (ativar/desativar).
- Campos principais:
  - `id`, `nome`, `email`, `role`, `setor`, `status`, `telefone`.
- Funções principais:
  - `abrirModalCriarUsuario()`, `criarUsuario()`
  - `abrirModalEditar()`, `salvarEdicao()`
  - `abrirModalAcoes()`, `suspenderUsuario()`, `reativarUsuario()`
  - `selecionarTodos()`, `ativarSelecionados()`, `desativarSelecionados()`
  - `ordenar(tipo: 'asc'|'desc')`

---

## 6. Dashboard (`DashboardComponent`)

- Indicadores principais:
  - Total de Ocorrências
  - Usuários
  - Resolução Média
  - Usuários Ativos
  - Total de Tickets
  - Total de Mensagens
  - Média Mensagens/Ticket
- Gráficos de barra:
  - Ocorrências por Status (`ABERTO`, `EM_ANDAMENTO`, `FECHADO`)
  - Ocorrências por Categoria (`Infraestrutura`, `Clima`, `Segurança`)
- Lista **Top 5 Usuários Ativos**.
- Botão de exportação **PDF**.
- Modelo de dados `DashboardData`:
  - `ocorrenciasPorStatus`, `ocorrenciasPorCategoria`, `usuariosPorTipo`, `top5UsuariosAtivos`, `ocorrenciasPorBairro`.

---

## 7. Modelo de Tabelas SQL

### 7.1. Ocorrências
```sql
CREATE TABLE ocorrencias (
  id SERIAL PRIMARY KEY,
  descricao VARCHAR(255) NOT NULL,
  solicitante VARCHAR(100) NOT NULL,
  categoria VARCHAR(50),
  data DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('PENDENTE_APROVACAO','ABERTO','EM_ANDAMENTO','FINALIZADO')) DEFAULT 'ABERTO'
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) CHECK (role IN ('ADMIN','USER','ADMIN_MASTER')) DEFAULT 'USER',
  setor VARCHAR(50),
  status VARCHAR(10) CHECK (status IN ('ATIVO','INATIVO')) DEFAULT 'ATIVO',
  telefone VARCHAR(20)
);

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(150) NOT NULL,
  descricao TEXT,
  aberto_por VARCHAR(100),
  prioridade VARCHAR(10) CHECK (prioridade IN ('BAIXA','MEDIA','ALTA')) DEFAULT 'MEDIA',
  status VARCHAR(20) CHECK (status IN ('ABERTO','EM_ANDAMENTO','FECHADO')) DEFAULT 'ABERTO',
  setor VARCHAR(50),
  mensagens_nao_lidas INT DEFAULT 0
);
