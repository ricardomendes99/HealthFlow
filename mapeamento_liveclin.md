# mapeamento_liveclin.md
# Documento de Requisitos de Produto (PRD) — HealthFlow
> Baseado na análise do site https://liveclin.com/ e do painel https://app.liveclin.com/
> Sistema implementado como: **HealthFlow** — clone funcional com tema **AZUL** (igual ao original liveclin.com)
> Data de análise: 25/05/2026 | Última atualização: 26/05/2026 — cor primária corrigida para azul #2563eb

---

## 1. VISÃO GERAL DO PRODUTO

### 1.1 Nome e Proposta de Valor
- **Nome:** HealthFlow (clone do LiveClin)
- **Tagline:** "Automatize sua consultoria sem perder o toque humano 💙"
- **Subtítulo:** "Gerencie hábitos, colete dados relevantes por meio de check-ins e envie orientações, tudo em um ambiente intuitivo."
- **Posicionamento:** Plataforma SaaS de acompanhamento pós-consulta para profissionais de saúde (nutricionistas, treinadores, profissionais de saúde em geral).
- **Diferencial central:** Não requer que o paciente baixe nenhum aplicativo — a área do cliente é acessada inteiramente pelo navegador (web app responsivo).
- **Visual:** Tema **azul** (`#2563eb`) — igual ao original liveclin.com. Alterado de roxo em 2026-05-26.

### 1.2 Usuários
- **Profissional (Prestador):** Nutricionistas, treinadores pessoais, profissionais de saúde em geral.
- **Paciente/Cliente (Consumidor):** Pacientes que recebem check-ins, respondem questionários e acompanham seu progresso via área do cliente no navegador.

---

## 2. PÚBLICO-ALVO E CASOS DE USO

### 2.1 Personas
| Persona | Descrição |
|---|---|
| Nutricionista | Monitora dietas, ajusta planos alimentares, envia orientações nutricionais personalizadas |
| Treinador Pessoal | Acompanha indicadores físicos, envia lembretes de treino, monitora progresso de alunos/atletas |
| Profissional de Saúde | Coleta dados clínicos, avalia progresso terapêutico, envia orientações |

### 2.2 Casos de Uso Principais
1. **Acompanhamento pós-consulta:** Profissional envia questionários automáticos entre consultas para monitorar adesão ao tratamento.
2. **Check-in semanal de hábitos:** Paciente relata como está sendo a adesão ao plano (dieta, exercício, sono, etc.).
3. **Relatório de progresso gamificado:** Paciente recebe pontuação a cada resposta, encorajando adesão contínua.
4. **Gestão de planos de serviço:** Profissional cadastra e gerencia planos de atendimento (mensal, trimestral, semestral) com controle de validade e faturamento.
5. **Automação via WhatsApp:** Questionários enviados automaticamente no WhatsApp/e-mail nas datas programadas, com lembretes automáticos em caso de não-resposta.
6. **Importação de pacientes:** Migração de dados de outros sistemas via XLS/CSV.
7. **Área do cliente personalizada:** Profissional cria um mini-portal com sua marca (logo, capa, cor, slug) acessível via URL customizada `/p/{slug}`.

---

## 3. FUNCIONALIDADES DETALHADAS

### 3.1 Módulo do Profissional (Dashboard — /app/*)

#### 3.1.1 Gestão de Clientes (`/app/clientes`)
**Implementado:**
- Listagem de clientes com abas: **Ativos | Finalizados | Inativos | Todos**
- Contador de clientes por aba (badge numérico)
- Campos exibidos na tabela: Avatar inicial, Nome, Serviço associado, Status, Observação, Ações
- **Adicionar cliente** → modal com campos: Nome*, WhatsApp, E-mail, Serviço, Observação
- **Busca por nome** em tempo real (filtro client-side)
- **Paginação** (15 linhas por página, Anterior/Próximo com contador "X–Y de Z")
- **Flag/marcador visual** por cliente (ícone de bandeira vermelha = atenção, toggle)
- **Botão WhatsApp** direto para cada cliente (link `wa.me/55{número}`)
- **Importar** (botão com ícone Upload — interface visual; integração CSV a implementar no backend)
- Dados mock: 16 clientes pré-carregados com status variados

#### 3.1.2 Serviços (`/app/servicos`)
**Implementado:**
- **Dashboard financeiro** com:
  - Gráfico de barras verticais (Recharts) — últimos 6 meses (Dez–Mai)
  - Cards de métricas: Total do período | Vendas | Ticket médio
  - Painel lateral "Últimas entradas" com nome do cliente, serviço e valor em verde
- **Listagem de serviços** com colunas: Nome, Status (badge), Validade, Modalidade, Preço, Vendas, Faturamento, Editar
- **Adicionar serviço** → modal com: Nome*, Validade em dias, Preço, Modalidade, Status
- **Editar serviço** → mesmo modal pré-preenchido
- **Busca de serviços** por nome
- Dados mock: 4 serviços (Consulta Presencial, Plano Trimestral, Plano Semestral, Avaliação Online)

#### 3.1.3 Questionários (`/app/questionarios`)
**Implementado:**
- Listagem de questionários em cards expansíveis (acordeão)
- Cada card: ícone, nome, total de perguntas, status (badge), ações (editar, excluir, expandir)
- **Expansão** mostra todas as perguntas com opções e pontuações
- **Construtor de questionários** (modal) com:
  - Nome do questionário + status
  - **Adicionar perguntas** dinamicamente: texto + tipo (Escala / Múltipla Escolha / Aberta)
  - Ao adicionar tipo Escala: gera automaticamente opções padrão (Ótimo 4pt / Bom 3pt / Regular 2pt / Ruim 1pt)
  - **Edição inline das opções** (texto + pontuação editáveis dentro do modal)
  - Indicador visual de ordem com ícone GripVertical
  - Remover pergunta individualmente
- **Editar** questionário existente (pré-preenche perguntas)
- **Excluir** questionário
- Dados mock: 3 questionários (Check-in Semanal com 3 perguntas expandíveis, Avaliação Nutricional, Questionário de Adesão)

#### 3.1.4 Respostas (`/app/respostas`)
**Implementado:**
- **Painel dividido em 2 colunas:**
  - Coluna esquerda: lista de check-ins recentes (clicável) com nome do paciente, questionário, data, pontuação % e comparativo (↑↓)
  - Coluna direita (prontuário):
    - Score em destaque com comparativo ao anterior e ícone TrendingUp/TrendingDown
    - **Ranking de hábitos** em grid 2 colunas com badge colorido (Ótimo verde / Bom **azul** `text-primary-600 bg-primary-50` / Regular âmbar / Ruim vermelho)
    - **Gráfico de linha** (Recharts LineChart) — evolução da pontuação semana a semana
    - Filtro por tipo de dado (select)
- Dados mock: 4 check-ins, 6 hábitos, 6 semanas de progresso

#### 3.1.5 Lembretes (`/app/lembretes`)
**Implementado:**
- **Cards de métricas** no topo: Pendentes (âmbar) | Enviados (verde) | Falhou (vermelho)
- **Tabela de lembretes** com colunas: Cliente, Questionário, Tipo, Data e Hora, Canal (ícone), Status (badge)
- **Tipos de lembrete:** Envio inicial | Lembrete de resposta | Vencimento de plano
- **Canais:** WhatsApp (ícone verde) | E-mail (ícone **azul** `text-primary-600`) | Ambos
- **Status:** Pendente (âmbar) | Enviado (verde) | Falhou (vermelho)
- **Novo lembrete** → modal com: Paciente*, Questionário, Data*, Hora, Tipo, Canal
- Excluir lembrete (ícone X)
- Dados mock: 5 lembretes com status variados

#### 3.1.6 Área do Cliente (`/app/area-cliente`)
**Implementado:**
- **Link customizável:** prefixo `healthflow.app/p/` + slug editável (só letras/números/hífen)
- **Informações do profissional:** Nome (read-only do perfil) + Título/Profissão (editável)
- **Upload de imagens** (UI implementada):
  - Foto de perfil (400x400px, máx 8MB) — drag area visual
  - Capa da área do cliente (1080x1920px, máx 8MB) — drag area visual
- **Aparência:** Color picker para Cor Primária + Cor Secundária (inputs `type="color"` + display hex)
- **Preview em tempo real** — mockup de celular que reflete cor, nome do profissional, título e slug em tempo real
- Botão "Ir para a área do cliente" → abre `/p/{slug}` em nova aba
- Botão "Salvar configurações" com feedback visual ("✓ Salvo com sucesso!")

#### 3.1.7 Sidebar / AppLayout
**Implementado:**
- Logo HealthFlow + ícone Zap (azul `#2563eb`)
- **Badge da área do cliente:** mostra URL truncada + botões Copiar (com feedback "Copiado!") e Abrir
- Navegação com grupos expansíveis (Gestão de Clientes → Clientes + Importação)
- Itens: Serviços, Questionários, Respostas, Lembretes, Área do Cliente, Tutoriais, Falar com o Suporte, Indique e Ganhe
- **Recolher sidebar** (toggle `<` / `>`) — versão colapsada mostra só ícones
- Rodapé: Avatar com inicial, nome, email, botão logout
- Active state com highlight **azul** (`bg-primary-50 text-primary-700`) no item selecionado

---

### 3.2 Módulo do Paciente (`/p/:slug`)
**Implementado:**

#### Tela Home
- Header **azul** (`bg-primary-600`) com avatar do profissional, nome, título, indicador on-line (verde)
- Saudação: "Olá, [Nome]! 👋 Seja bem-vinda de volta"
- Botão primário "Questionários pendentes" com badge de contagem
- Botão secundário "Histórico de respostas"
- Card de última pontuação (85%) com comparativo "+10% em relação ao anterior"

#### Tela de Lista de Questionários Pendentes
- Card do questionário com nome, tempo estimado, status "Pendente"
- Botão "Responder →"

#### Fluxo de Check-in (paginado)
- Barra de progresso visual (N/Total)
- Botão voltar para pergunta anterior
- Texto da pergunta em destaque
- Opções de resposta como botões com border — selecionado fica com borda **azul** (`border-primary-500`) + fundo azul claro (`bg-primary-50`)
- Para tipo "aberta": textarea
- Botão "Próxima" / "Finalizar" — **desabilitado até o paciente selecionar uma opção**

#### Tela de Resultado (Gamificação)
- Score percentual em destaque (ex: 85%)
- Comparativo com questionário anterior (+10%)
- **Ranking de hábitos** com badges coloridos (Ótimo verde / Bom **azul** / Regular âmbar / Ruim vermelho)
- Botão "Voltar ao início"

#### Tela de Histórico
- Lista de check-ins anteriores com data, nome do questionário e pontuação
- Card de média geral

---

### 3.3 Landing Page (`/`)
**Implementado — todas as seções:**

| Seção | O que contém |
|---|---|
| **Header sticky** | Logo, nav links (Funções/Preços/Depoimentos/Contato), Entrar, Testar Grátis; menu mobile hamburger |
| **Hero** | Fundo com dot-grid azul, gradiente azul (`#eff6ff`→`#dbeafe`→`#bfdbfe`), badge social proof, H1 grande, subtítulo, 2 CTAs, 3 mockups de celular flutuantes |
| **Para quem é** | 3 cards (Nutricionistas, Treinadores, Profissionais de Saúde) com ícone, heading, parágrafo |
| **Como funciona** | 3 cards numerados (01/02/03) com ícone e descrição de cada passo |
| **Área do Cliente** | Grid 2 colunas: 3 feature cards + mockup de celular com preview real |
| **Progresso** | Grid 2 colunas: mockup de prontuário com ranking de hábitos + 3 feature cards |
| **Automações** | Grid 2 colunas: 3 feature cards + painel escuro simulando log de automações |
| **Financeiro** | 3 cards de feature (Gestão de planos, Entradas, Tendências) |
| **Vídeo** | Placeholder de player com botão play |
| **Preços** | Toggle mensal/anual, card com gradiente **azul** (`primary-600` → `primary-800`), lista de 10 features com checkmarks, CTA |
| **Depoimentos** | Grid de 7 cards estilo Twitter (avatar iniciais, @handle, texto) |
| **FAQ** | 5 perguntas em acordeão expansível (ChevronDown/Up) |
| **CTA Final** | Seção escura com dot-grid e headline grande |
| **Footer** | Links, redes sociais, copyright |

---

### 3.4 Autenticação (`/login`, `/cadastro`)
**Implementado:**
- **Login:** campos email + senha, toggle mostrar/esconder senha, botão Google OAuth (visual), link "Esqueci minha senha", link para cadastro
- **Cadastro:** campos Nome*, Email*, Celular*, Senha*, Confirmar Senha*, Profissão* (dropdown com 7 opções), Cupom (opcional), botão Google OAuth
- **Validação client-side:** erros inline por campo (borda vermelha + texto)
- **AuthContext** (React Context API): estado de autenticação, funções login/logout/register, persistência em localStorage
- **Proteção de rotas:** `PrivateRoute` e `PublicRoute` — redireciona automaticamente
- Mock: qualquer email não-vazio + qualquer senha → login bem-sucedido

---

## 4. ESTRUTURA DE NAVEGAÇÃO

### 4.1 Landing Page (`/`)
```
Header (sticky, translúcido no scroll):
  Logo HealthFlow (ícone Zap)
  Funções | Preços | Depoimentos | Contato | [Entrar] | [Testar Grátis]

Seções (scroll único — one-page):
  Hero → Para quem é → Como funciona → Área do Cliente →
  Progresso → Automações → Financeiro → Vídeo →
  Preços → Depoimentos → FAQ → CTA Final → Footer
```

### 4.2 Painel do Profissional
```
Sidebar (fixa, recolhível — 64px colapsada / 256px expandida):
  Logo HealthFlow
  Badge URL da área do cliente (copiar/abrir)
  Gestão de Clientes (grupo expansível)
  ├── Clientes
  └── Importação
  Serviços
  Questionários
  Respostas
  Lembretes
  Área do Cliente
  Tutoriais
  Falar com o Suporte
  Indique e Ganhe
  [rodapé] Avatar + Nome + Email + Logout

Main content: área à direita da sidebar (overflow-y-auto)
```

### 4.3 Rotas Implementadas
| Rota | Componente | Proteção |
|---|---|---|
| `/` | `LandingPage.tsx` | Pública |
| `/login` | `LoginPage.tsx` | PublicRoute (redireciona se logado) |
| `/cadastro` | `RegisterPage.tsx` | PublicRoute (redireciona se logado) |
| `/app` | `AppLayout.tsx` (Outlet) | PrivateRoute |
| `/app/clientes` | `ClientsPage.tsx` | PrivateRoute |
| `/app/servicos` | `ServicesPage.tsx` | PrivateRoute |
| `/app/questionarios` | `QuestionnairesPage.tsx` | PrivateRoute |
| `/app/respostas` | `ResponsesPage.tsx` | PrivateRoute |
| `/app/lembretes` | `RemindersPage.tsx` | PrivateRoute |
| `/app/area-cliente` | `ClientAreaPage.tsx` | PrivateRoute |
| `/p/:slug` | `PatientPage.tsx` | Pública |
| `*` | Redirect para `/` | — |

---

## 5. PLANOS E PRECIFICAÇÃO

### 5.1 Estrutura de Planos (implementado na Landing Page)
| Periodicidade | Valor |
|---|---|
| Mensal | R$89/mês |
| Anual | R$75/mês (ou R$900 no Pix — 15% desconto) |

Toggle visual mensal/anual implementado com state React.

### 5.2 O que está incluso (lista na Landing Page)
1. Clientes Ilimitados
2. Questionários Ilimitados
3. Personalização Total da Área de Clientes
4. Relatório de Respostas para o Profissional
5. Relatório de Respostas para o Cliente
6. Controle de Faturamento
7. Importação de Clientes (XLS/CSV)
8. Envio de Questionários por WhatsApp
9. Lembrete de Prazo de Resposta
10. Lembrete de Vencimento de Plano

---

## 6. LAYOUT, UX/UI E DESIGN SYSTEM

### 6.1 Paleta de Cores — HealthFlow (AZUL — igual ao liveclin.com, atualizado 2026-05-26)
| Elemento | Token | Cor |
|---|---|---|
| Primária 50 | `primary-50` | `#eff6ff` |
| Primária 100 | `primary-100` | `#dbeafe` |
| Primária 200 | `primary-200` | `#bfdbfe` |
| Primária 300 | `primary-300` | `#93c5fd` |
| Primária 400 | `primary-400` | `#60a5fa` |
| **Primária principal** | `primary-600` | `#2563eb` ← botões, sidebar, highlights |
| Primária dark | `primary-700` | `#1d4ed8` ← hover |
| Primária 800 | `primary-800` | `#1e40af` |
| Primária 900 | `primary-900` | `#1e3a8a` |
| Texto principal | — | `#0f172a` (slate-900) |
| Background | — | `#ffffff` |
| Background alt | — | `#f8fafc` (slate-50) |
| Hero gradient | — | `#eff6ff` → `#dbeafe` → `#bfdbfe` |
| Dot grid | — | `#93c5fd` (primary-300) |
| Status ativo | — | `#22c55e` (green-500) |
| Status âmbar | — | `#f59e0b` (amber-500) |
| Status erro | — | `#ef4444` (red-500) |
| Footer/dark | — | `#0f172a` (slate-900) |
| Gráfico barras | — | `#2563eb` (primary-600) |
| Linha do gráfico | — | `#2563eb` (primary-600) |

### 6.2 Tipografia
- **Família:** `Inter` (Google Fonts, carregada no `index.html`)
- **Fallback:** `system-ui, sans-serif`
- **Headings landing:** peso 800–900 (`font-black`)
- **App:** peso 400–600 (legível em tabelas e formulários)

### 6.3 Componentes Visuais Implementados

**Landing Page:**
- `dot-grid`: padrão radial-gradient de pontos azuis (`#93c5fd`) no hero e CTA final
- `gradient-hero`: gradiente CSS `135deg` azul `#eff6ff`→`#dbeafe`→`#bfdbfe`
- Sticky header com `bg-white/90 backdrop-blur-md` no scroll
- 3 mockups de celular flutuantes no hero (rotacionados `-6deg`, `0`, `+6deg`)
- Badge social proof flutuante com dot animado (pulse)
- Cards com `rounded-2xl` + hover shadow
- Toggle mensal/anual com `rounded-full` e transição de cor
- Cards de depoimento estilo Twitter
- FAQ com ChevronDown/Up animado

**App (Painel):**
- Sidebar `w-64` → `w-16` (colapsada) com transição `duration-300`
- Header de seção: ícone Lucide + título bold
- Tabelas: `thead` cinza, linhas zebradas alternadas, hover
- `StatusBadge`: pill colorido (`rounded-full text-xs font-semibold`)
- Gráfico de barras: `BarChart` Recharts com radius `[6,6,0,0]` e cor `#2563eb`
- Gráfico de linha: `LineChart` Recharts com stroke `#2563eb`, dot e activeDot
- Modais com `backdrop-blur-sm` + `rounded-2xl` + `shadow-2xl`
- Botões pill (`rounded-full`) nas CTAs principais
- Botões ação com `rounded-xl`

**Área do Paciente:**
- Layout mobile-first centralizado (max-w-sm)
- Header azul (bg-primary-600) com borda arredondada superior
- Barra de progresso com `transition` suave
- Opções de resposta com borda azul (border-primary-500) ao selecionar
- Botão "Próxima" desabilitado até seleção (opacity-50)

### 6.4 Efeitos Visuais
- `box-shadow` suave em cards (`shadow-sm`, `shadow-md` no hover)
- `border-radius` generoso: cards `rounded-2xl` (16px), modais `rounded-2xl`, botões pill `rounded-full`
- `backdrop-blur-md` no header sticky e modais
- `transition-all duration-300` nas transições de sidebar e cores
- `animate-pulse` no badge de status on-line
- Hover com mudança de cor e fundo nos itens da sidebar e tabelas

---

## 7. TECNOLOGIAS IMPLEMENTADAS

### 7.1 Front-end — Efetivamente usado neste projeto
| Tecnologia | Versão | Uso |
|---|---|---|
| **React** | 18.3.1 | Biblioteca de UI principal, componentes funcionais, hooks |
| **TypeScript** | 5.6.3 | Tipagem estática em todos os arquivos `.tsx` e `.ts` |
| **Vite** | 6.0.3 | Bundler/dev server, HMR, build ESM |
| **React Router DOM** | 6.28.0 | Roteamento client-side, `BrowserRouter`, `Outlet`, `NavLink`, `useParams` |
| **Tailwind CSS** | 3.4.16 | Estilização utility-first com tema customizado **azul** (primary = `#2563eb`) |
| **PostCSS** | 8.4.49 | Pipeline de transformação CSS (autoprefixer + tailwind) |
| **Autoprefixer** | 10.4.20 | Prefixos CSS automáticos para cross-browser |
| **Recharts** | 2.13.3 | Gráficos (`BarChart`, `LineChart`, `Tooltip`, `ResponsiveContainer`) |
| **Lucide React** | 0.460.0 | Ícones SVG (60+ ícones usados) |
| **React Hook Form** | 7.54.0 | Instalado como dependência (pronto para formulários avançados) |
| **@playwright/test** | 1.60.0 | Testes de verificação E2E (headless Chromium) |

### 7.2 Arquitetura de Estado
| Mecanismo | Uso |
|---|---|
| **React Context API** | `AuthContext` — autenticação global (user, login, logout, register) |
| **`useState`** | Estado local em todos os componentes (formulários, modais, tabs, paginação) |
| **`useMemo`** | Filtragem e paginação de clientes (evita re-cálculo desnecessário) |
| **`useEffect`** | Scroll listener no header da landing page |
| **`localStorage`** | Persistência da sessão do usuário entre reloads |

### 7.3 Estrutura de Arquivos
```
sistemajunin/
├── index.html                    ← entry point, Google Fonts (Inter)
├── vite.config.ts                ← @vitejs/plugin-react
├── tailwind.config.js            ← tema customizado (primary azul #2563eb)
├── postcss.config.js             ← tailwind + autoprefixer
├── tsconfig.json                 ← strict mode, react-jsx
├── tsconfig.node.json            ← config para vite.config.ts
├── package.json                  ← scripts: dev, build, preview
└── src/
    ├── main.tsx                  ← ReactDOM.createRoot, StrictMode
    ├── App.tsx                   ← BrowserRouter, AuthProvider, Routes
    ├── index.css                 ← @tailwind directives, dot-grid, gradient-hero
    ├── types/
    │   └── index.ts              ← interfaces TypeScript: Professional, Client, Service,
    │                                Questionnaire, Question, QuestionOption, CheckIn,
    │                                Reminder, FinancialEntry
    ├── data/
    │   └── mockData.ts           ← dados mock: 16 clientes, 4 serviços, 3 questionários,
    │                                4 check-ins, 5 lembretes, 6 entradas financeiras,
    │                                chartData (6 meses), progressData (6 semanas)
    ├── context/
    │   └── AuthContext.tsx       ← AuthProvider, useAuth hook, mockUser
    └── pages/
        ├── LandingPage.tsx       ← landing page completa (all sections)
        ├── auth/
        │   ├── LoginPage.tsx     ← login com validação + Google OAuth visual
        │   └── RegisterPage.tsx  ← cadastro com 7 campos + validação
        ├── app/
        │   ├── AppLayout.tsx     ← sidebar recolhível + Outlet
        │   ├── ClientsPage.tsx   ← CRUD clientes, tabs, busca, paginação
        │   ├── ServicesPage.tsx  ← CRUD serviços + dashboard financeiro Recharts
        │   ├── QuestionnairesPage.tsx ← construtor de questionários dinâmico
        │   ├── ResponsesPage.tsx ← prontuário + ranking + LineChart
        │   ├── RemindersPage.tsx ← agendamento de lembretes + stats
        │   └── ClientAreaPage.tsx ← customização + preview em tempo real
        └── patient/
            └── PatientPage.tsx   ← fluxo completo: home → lista → check-in → resultado → histórico
```

### 7.4 Back-end (a implementar para produção)
| Aspecto | Recomendação |
|---|---|
| **Runtime** | Node.js 20 LTS |
| **Framework** | NestJS (modular, TypeScript nativo) ou Express |
| **API** | REST com JSON, endpoints por módulo |
| **Autenticação** | JWT (access + refresh token) + Google OAuth 2.0 |
| **Validação** | class-validator (NestJS) ou Zod |
| **WhatsApp** | Meta WhatsApp Business Cloud API |
| **E-mail** | SendGrid ou Nodemailer + SMTP |
| **Filas** | BullMQ + Redis (agendamento de lembretes) |
| **reCAPTCHA** | Google reCAPTCHA v3 nos formulários de auth |

### 7.5 Banco de Dados (a implementar)
| Aspecto | Recomendação |
|---|---|
| **Principal** | PostgreSQL via Supabase (gerenciado) |
| **Cache / Filas** | Redis (sessões + BullMQ jobs) |
| **ORM** | Prisma (type-safe, migrations, seeds) |
| **Uploads** | Cloudinary ou AWS S3 (foto perfil + capa) |

### 7.6 Deploy (a implementar)
| Parte | Plataforma |
|---|---|
| **Front-end** | Vercel (CI/CD automático do GitHub) |
| **Back-end** | Railway ou Render |
| **Banco** | Supabase (PostgreSQL gerenciado) |
| **Cache** | Upstash Redis (serverless) |
| **Storage** | Cloudinary |
| **Domínio** | healthflow.app + *.healthflow.app |

---

## 8. INTEGRAÇÕES E CANAIS

| Canal | Status | Uso |
|---|---|---|
| **WhatsApp Business API (Meta)** | A implementar | Envio automático de questionários, lembretes, avisos de vencimento |
| **E-mail (SendGrid)** | A implementar | Envio alternativo de questionários e notificações |
| **Google OAuth** | Visual implementado | Login social para profissionais |
| **Google reCAPTCHA v3** | A implementar | Proteção de formulários de auth |
| **YouTube** | Placeholder implementado | Vídeo demonstrativo na landing page |
| **LinkedIn / Instagram** | Links no footer | Redes sociais da empresa |

---

## 9. FLUXOS PRINCIPAIS (USER FLOWS)

### 9.1 Fluxo de Cadastro do Profissional
```
Landing Page → CTA "Testar Gratuitamente" → /cadastro
  Campos: Nome*, Email*, Celular*, Senha*, Confirmar Senha*, Profissão*, Cupom (opcional)
  Validação client-side com erros inline
  Auth alternativa: Google OAuth (visual)
  → AuthContext.register() → localStorage → redirect /app/clientes
```

### 9.2 Fluxo de Login
```
/login → email + senha → AuthContext.login() → localStorage → /app/clientes
  (mock: qualquer email não-vazio + qualquer senha = sucesso)
  Logout: clique no ícone → AuthContext.logout() → limpa localStorage → /
```

### 9.3 Fluxo de Onboarding do Profissional
```
1. /app/area-cliente → configurar slug, título, foto, capa, cores
2. /app/servicos → criar serviço (nome, validade, modalidade, preço)
3. /app/clientes → cadastrar cliente (associar serviço)
4. /app/questionarios → criar questionário + adicionar perguntas
5. /app/lembretes → agendar envio automático
6. Copiar link da área do cliente da sidebar → compartilhar com paciente
```

### 9.4 Fluxo do Paciente (Check-in)
```
Recebe link → /p/{slug}
→ Tela Home: saudação + botões + última pontuação
→ [Questionários pendentes] → lista de questionários
→ [Responder] → pergunta 1/N
→ Seleciona opção → [Próxima] (ativo) → pergunta 2/N → ... → [Finalizar]
→ Tela resultado: pontuação % + comparativo + ranking de hábitos
→ [Voltar ao início] → Home
→ [Histórico de respostas] → lista de check-ins anteriores com médias
```

### 9.5 Fluxo de Revisão pelo Profissional
```
/app/respostas → lista de check-ins recentes
→ Clica em um check-in → prontuário abre no painel direito
→ Vê score, ranking de hábitos e gráfico de evolução
→ Pode filtrar o gráfico por categoria de hábito
```

---

## 10. REQUISITOS NÃO-FUNCIONAIS

| Requisito | Especificação | Status |
|---|---|---|
| **Responsividade** | Mobile-first, landing + área do paciente otimizadas para celular | ✅ Implementado |
| **Sem app nativo** | Área do paciente é web app puro — sem instalação | ✅ Implementado |
| **Tema customizável** | Profissional escolhe cor primária/secundária da área do paciente | ✅ Implementado |
| **Multi-tenancy** | Cada profissional tem slug único | ✅ Implementado (mock) |
| **Acessibilidade** | Textos em tamanho adequado, navegação simples na área do paciente | ✅ Implementado |
| **Idioma** | Português do Brasil (pt-BR) em todo o sistema | ✅ Implementado |
| **Performance** | Vite HMR, componentes otimizados com useMemo | ✅ Implementado |
| **TypeScript strict** | Todos os arquivos tipados, zero erros de compilação | ✅ Implementado |

---

## 11. DEPOIMENTOS (Prova Social — na Landing Page)

| Usuário | Handle | Destaque |
|---|---|---|
| Kimirli Abreu | @kimirliabreu.nutri | "Questionário personalizável reforça a exclusividade e seriedade do trabalho. Controle de pacientes ativos e inativos otimizou meu tempo." |
| Iago Pedrosa | @nutri.iagopedrosa | "Marco/revolução no atendimento. Automação de envio dos feedbacks para os pacientes." |
| Thales Faccin | @thales_faccin | "Essencial para ajustes na dieta, melhorias no planejamento dos alunos e refinamentos para atletas." |
| Paulo Reis | @pauloreis_90 | "Interface intuitiva, layout limpo. Facilita controle de lembretes, mensagens e planos." |
| Bernardo Lima | @bernardolimads | "Substituiu planilhas de controle. Gasta quase metade do tempo no suporte aos pacientes." |
| Henrique Nascimento | @nascimento_riq | "Simplificou a gestão de clientes e registros, melhorando organização e personalização do serviço." |
| Vinicius Paris | @viniciusparisnutri | "Agilidade e praticidade nos acompanhamentos e follow-ups de pacientes." |

---

## 12. FAQ (Perguntas Frequentes — implementado na Landing Page)

**P1: Como o HealthFlow pode beneficiar meu negócio?**
> Acompanhamento contínuo entre consultas de forma automatizada. A plataforma coleta dados automaticamente, permitindo consultas mais curtas e assertivas. A automação libera mais tempo para focar na qualidade do atendimento.

**P2: Posso cancelar quando quiser?**
> Os planos possuem opção de pagamento mensal ou trimestral. Sem renovação automática. Cancelamento a qualquer momento, sem contratos de longa duração.

**P3: O HealthFlow oferece suporte ao usuário?**
> Sim, suporte dedicado em horário comercial via WhatsApp.

**P4: E quanto aos pacientes idosos que podem ter dificuldades com tecnologia?**
> O aplicativo foi desenvolvido pensando também nos idosos, com letras em tamanho adequado e navegação simplificada.

**P5: Posso importar minha lista de pacientes de outros softwares?**
> Sim, é possível importar dados a partir de arquivos XLS ou CSV.

---

## 13. ESTRUTURA DE DADOS (Entidades — TypeScript Interfaces)

```typescript
// src/types/index.ts

interface Professional {
  id: string
  nome_completo: string
  email: string
  celular_whatsapp: string
  profissao: string               // enum: Nutricionista | Treinador | Profissional de Saúde | ...
  slug: string                    // URL da área do cliente
  titulo_profissao: string
  foto_perfil?: string            // URL
  capa_cliente?: string           // URL
  aparencia: { cor_primaria: string; cor_secundaria: string }
  plano_assinatura: 'mensal' | 'trimestral' | 'anual'
  data_criacao: string
}

interface Client {
  id: string
  profissional_id: string
  nome: string
  whatsapp: string
  email: string
  observacao?: string
  status: 'ativo' | 'finalizado' | 'inativo'
  servico?: string                // nome do serviço associado
  data_criacao: string
  flag?: boolean                  // marcador visual de atenção
}

interface Service {
  id: string
  profissional_id: string
  nome: string
  status: 'ativo' | 'inativo'
  validade_dias: number
  modalidade: 'presencial' | 'online'
  preco: number
  vendas: number
  faturamento: number
  data_criacao: string
}

interface QuestionOption {
  id: string
  texto: string
  pontuacao: number
}

interface Question {
  id: string
  questionario_id: string
  texto: string
  tipo: 'multipla_escolha' | 'aberta' | 'escala'
  ordem: number
  peso_pontuacao: number
  opcoes?: QuestionOption[]
}

interface Questionnaire {
  id: string
  profissional_id: string
  nome: string
  status: 'ativo' | 'inativo'
  total_perguntas: number
  data_criacao: string
  perguntas?: Question[]
}

interface CheckIn {
  id: string
  questionario_id: string
  questionario_nome: string
  cliente_id: string
  cliente_nome: string
  data_resposta: string
  pontuacao_total: number
  pontuacao_percentual: number
  comparativo?: number            // diferença % em relação ao check-in anterior
}

interface Reminder {
  id: string
  profissional_id: string
  cliente_id: string
  cliente_nome: string
  questionario_id: string
  questionario_nome: string
  data_envio_programada: string   // ISO 8601
  tipo: 'inicial' | 'lembrete' | 'vencimento_plano'
  canal: 'whatsapp' | 'email' | 'ambos'
  status: 'pendente' | 'enviado' | 'falhou'
}

interface FinancialEntry {
  id: string
  profissional_id: string
  cliente_nome: string
  servico_nome: string
  valor: number
  data: string
}
```

---

## 14. DADOS MOCK (src/data/mockData.ts)

| Dataset | Quantidade | Descrição |
|---|---|---|
| `mockClients` | 16 registros | Clientes com status variados (12 ativos, 2 finalizados, 2 inativos) |
| `mockServices` | 4 registros | Consulta Presencial R$200, Plano Trimestral R$540, Semestral R$1020, Avaliação R$120 |
| `chartData` | 6 pontos | Faturamento mensal Dez–Mai (R$3.200 a R$6.200) |
| `mockQuestionnaires` | 4 registros | Check-in Semanal (3q com perguntas completas), Avaliação Nutricional Mensal (6q — nutricionistas), Check-in Semanal de Treinos (6q — treinadores), Questionário de Adesão (inativo) |
| `mockCheckIns` | 4 registros | Check-ins com pontuações 71%–92% e comparativos |
| `progressData` | 6 pontos | Evolução semanas S1–S6 (62% a 85%) |
| `mockReminders` | 5 registros | Lembretes com status variados (pendente, enviado, falhou) |
| `mockFinancialEntries` | 6 registros | Entradas de Mai/2026 (R$200 a R$1020) |

---

## 15. FUNCIONALIDADES ESPECÍFICAS POR PROFISSÃO

> **Diferencial HealthFlow vs LiveClin:** o LiveClin original tem seção "Para quem é" apenas como marketing genérico (3 cards). O HealthFlow vai além implementando templates e hábitos diferenciados por profissão.

### 15.1 Landing Page — Seção por Profissão (`src/pages/LandingPage.tsx`)

**Abas interativas:** `profTab: 'nutri' | 'trainer'` com `useState`

**Nutricionistas (`profTab === 'nutri'`):**
| Item | Conteúdo |
|---|---|
| 6 feature cards | Prontuário nutricional, Anamnese alimentar, Check-in semanal hábitos, Tracking sintomas GI, Evolução composição corporal, Templates validados pela ciência |
| 4 templates listados | Anamnese Inicial (12q), Check-in Semanal de Hábitos (8q), Sintomas Gastrointestinais (6q), Comportamento Alimentar (7q) |
| Mini mockup prontuário | Hábitos: Sono, Funcionamento Intestinal, Adesão Dieta, Hidratação |

**Treinadores Pessoais (`profTab === 'trainer'`):**
| Item | Conteúdo |
|---|---|
| 6 feature cards | Ficha de treino + anamnese, Controle de cargas/PR, Check-in semanal performance, Evolução força/resistência, Tracking recuperação, Templates periodização |
| 4 templates listados | Avaliação Física Inicial (10q), Check-in Semanal de Treinos (7q), Controle de Recuperação (5q), Avaliação de Performance (6q) |
| Mini mockup prontuário | Hábitos: Treinos, Intensidade, Recuperação, Sono |

### 15.2 Módulo Questionários — Templates Prontos (`src/pages/app/QuestionnairesPage.tsx`)

**Botão "Templates prontos"** (ícone `LayoutTemplate`) → abre modal com abas Apple/Dumbbell

**Templates Nutricionistas (`NUTRI_TEMPLATES`):**
| Template | Perguntas | Categorias |
|---|---|---|
| Check-in Semanal Nutricional | 6 | Sono, plano alimentar, hidratação, intestinal, sintomas GI, saciedade |
| Avaliação de Sintomas Gastrointestinais | 5 | Refluxo, gases, trânsito intestinal, desconforto, síndrome irritável |
| Comportamento Alimentar | 5 | Fome emocional, compulsão, restrição, mindful eating, padrão alimentar |

**Templates Treinadores (`TRAINER_TEMPLATES`):**
| Template | Perguntas | Categorias |
|---|---|---|
| Check-in Semanal de Treinos | 6 | Freq. treinos, intensidade, recuperação muscular, sono, nutrição peritraining |
| Avaliação de Desempenho Físico | 5 | Força, resistência cardiovascular, flexibilidade, composição corporal, PRs |
| Controle de Recuperação e Sono | 5 | Qualidade sono, dores musculares, estresse, hidratação, variabilidade cardíaca |

**Função `useTemplate(template)`:** cria questionário a partir do template, incrementa ID, fecha modal.

### 15.3 Módulo Respostas — Hábitos por Profissão (`src/pages/app/ResponsesPage.tsx`)

**Tab switcher no ranking de hábitos:** `profTab: 'nutri' | 'trainer'`

**`NUTRI_HABITS` (6 itens):**
- Qualidade do Sono (Ótimo/verde)
- Adesão ao Plano Alimentar (Regular/âmbar)
- Funcionamento Intestinal (Ótimo/verde)
- Hidratação Diária (Ruim/vermelho)
- Sintomas Gastrointestinais (Bom/azul — text-primary-600 bg-primary-50)
- Controle de Fome/Saciedade (Bom/azul — text-primary-600 bg-primary-50)

**`TRAINER_HABITS` (6 itens):**
- Qualidade do Sono (Bom/azul — text-primary-600 bg-primary-50)
- Frequência de Treinos (Ótimo/verde)
- Intensidade dos Treinos (Ótimo/verde)
- Recuperação Muscular (Regular/âmbar)
- Hidratação Intra-treino (Ruim/vermelho)
- Nutrição Pré/Pós-treino (Bom/azul — text-primary-600 bg-primary-50)

**Select de evolução dinâmico:** opções mudam conforme `profTab` — nutri mostra hábitos alimentares; trainer mostra hábitos de treino.

---

## 16. CONSIDERAÇÕES PARA EVOLUÇÃO DO SISTEMA

### 16.1 O que falta para produção
| Item | Prioridade | Esforço |
|---|---|---|
| Backend API (Node.js + NestJS) | Alta | Grande |
| Banco de dados PostgreSQL (Prisma + Supabase) | Alta | Médio |
| Autenticação real (JWT + Google OAuth) | Alta | Médio |
| Integração WhatsApp Business API | Alta | Grande |
| Upload de imagens (Cloudinary/S3) | Média | Médio |
| Sistema de pagamento (Stripe/PagSeguro) | Média | Grande |
| Importação CSV/XLS real | Média | Médio |
| E-mail transacional (SendGrid) | Média | Pequeno |
| Filas de agendamento (BullMQ + Redis) | Alta | Grande |
| Deploy (Vercel + Railway + Supabase) | Alta | Médio |

### 16.2 Melhorias de UX a considerar
- Drag-and-drop real no construtor de questionários (react-beautiful-dnd)
- Notificações push (PWA)
- Dark mode
- Exportação de relatórios em PDF
- Chat interno profissional ↔ paciente
- Assinatura digital de documentos

---

*Documento gerado por análise de https://liveclin.com/ e implementação do HealthFlow.*
*Última atualização: 26/05/2026 — adicionadas funcionalidades específicas por profissão (seções 15 e dados mock atualizados).*
*Sistema implementado: React 18 + Vite 6 + TypeScript 5 + Tailwind CSS 3 + Recharts 2 + React Router 6.*
