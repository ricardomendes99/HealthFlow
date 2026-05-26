# HealthFlow — Documentação Completa do Sistema

> **Referência cópia:** [liveclin.com](https://liveclin.com)  
> **Credenciais de referência LiveClin:** jrnutricaoesportiva@gmail.com / Nutri2023  
> **Usuário do projeto:** Ricardo Junin  
> **Data da última atualização:** 2026-05-26  
> **Domínio de produção:** healthflow.autotech.dev.br  
> **Status:** Frontend completo + camada de serviços Supabase pronta. Requer instalação do SDK e projeto Supabase para ativar banco real.

---

## 1. VISÃO GERAL

SaaS para profissionais de saúde (nutricionistas, treinadores pessoais) gerenciarem:
- Clientes (ativos, finalizados, inativos)
- Serviços/planos com controle financeiro
- Questionários de check-in com pontuação gamificada
- Respostas e evolução dos pacientes
- Lembretes automáticos por WhatsApp/email
- Área do cliente personalizada (mini-portal do profissional)

**Diferencial:** Paciente não precisa instalar nenhum app — acessa tudo pelo navegador via link `/p/{slug}`.

### 1.1 Personas

| Persona | Descrição |
|---|---|
| Nutricionista | Monitora dietas, ajusta planos alimentares, envia orientações nutricionais personalizadas |
| Treinador Pessoal | Acompanha indicadores físicos, envia lembretes de treino, monitora progresso de alunos |
| Profissional de Saúde | Coleta dados clínicos, avalia progresso terapêutico, envia orientações |

### 1.2 Casos de Uso Principais

1. **Acompanhamento pós-consulta** — profissional envia questionários automáticos entre consultas para monitorar adesão
2. **Check-in semanal de hábitos** — paciente relata adesão ao plano (dieta, exercício, sono)
3. **Relatório gamificado** — paciente recebe pontuação a cada resposta, incentivando adesão contínua
4. **Gestão de planos de serviço** — profissional cadastra planos (mensal, trimestral, semestral) com controle de validade e faturamento
5. **Automação via WhatsApp** — questionários enviados automaticamente no WhatsApp/e-mail com lembretes em caso de não-resposta
6. **Importação de pacientes** — migração via XLS/CSV de outros sistemas
7. **Área do cliente personalizada** — mini-portal com marca do profissional (logo, capa, cor, slug) em `/p/{slug}`

---

## 2. STACK TÉCNICA

| Item | Tecnologia |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Estilo | Tailwind CSS v3 |
| Roteamento | React Router v6 |
| Ícones | Lucide React |
| Gráficos | Recharts |
| Fonte | Inter (Google Fonts, todos os pesos 400–900) |
| Auth | Mock local (localStorage) — sem backend |
| Dados | Mock em memória — sem backend |

**Comando para rodar:**
```bash
npm run dev
```
Acessa em: `http://localhost:5173`

---

## 3. DESIGN SYSTEM

### 3.1 Paleta de Cores (Tailwind custom)

Cor primária: **AZUL** (igual à LiveClin — alterado de roxo em 2026-05-26)

```js
// tailwind.config.js
primary: {
  50:  '#eff6ff',
  100: '#dbeafe',
  200: '#bfdbfe',
  300: '#93c5fd',
  400: '#60a5fa',
  500: '#3b82f6',
  600: '#2563eb',  // cor principal — botões, links, destaques
  700: '#1d4ed8',  // hover dos botões
  800: '#1e40af',
  900: '#1e3a8a',
  950: '#172554',
}
```

Cores de suporte (Tailwind padrão):
- `slate-*` — textos, bordas, backgrounds neutros
- `green-*` — status ativo, sucesso
- `amber-*` — status inativo/pendente
- `red-*` — erros, status falhou, flags

### 3.2 Tipografia

- Família: **Inter** (Google Fonts)
- Fonte base: `font-sans` → `Inter, system-ui, sans-serif`
- Hierarquia:
  - Títulos de página: `text-xl font-bold text-slate-900`
  - Títulos de seção: `text-lg font-semibold text-slate-800`
  - Corpo: `text-sm text-slate-600`
  - Labels: `text-sm font-medium text-slate-700`
  - Captions: `text-xs text-slate-500`

### 3.3 Componentes Padrão

**Botão primário:**
```html
bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors
```

**Botão secundário (outline):**
```html
border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors
```

**Input:**
```html
w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all
```

**Card/Container:**
```html
bg-white rounded-2xl border border-slate-200
```

**Modal backdrop:**
```html
fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4
```

**Badge de status:**
- Ativo: `bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full`
- Inativo: `bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full`
- Pendente: `bg-amber-100 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full`
- Falhou: `bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full`

**Cabeçalho de página padrão:**
```tsx
<div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
  <Icon className="w-5 h-5 text-primary-600" />
</div>
<h1 className="text-xl font-bold text-slate-900">Título</h1>
```

### 3.4 CSS Global (`src/index.css`)

```css
.dot-grid {
  background-image: radial-gradient(circle, #93c5fd 1px, transparent 1px);
  background-size: 28px 28px;
}
.gradient-hero {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%);
}
```

---

## 4. ESTRUTURA DE ARQUIVOS

```
sistemajunin/
├── index.html                        # HTML raiz, carrega Inter, SEO
├── vite.config.ts
├── tailwind.config.js                # Paleta de cores customizada
├── tsconfig.json / tsconfig.node.json
├── postcss.config.js
├── .env.example                      # Template de variáveis de ambiente
├── Dockerfile                        # Build multi-stage Node→Nginx
├── nginx.conf                        # Configuração Nginx para SPA
├── docker-stack.yml                  # Stack Portainer/Docker Swarm
├── .dockerignore
├── supabase/
│   ├── schema.sql                    # Todas as tabelas, índices, views
│   ├── rls.sql                       # Políticas de Row Level Security
│   └── seed.sql                      # Dados iniciais de exemplo
└── src/
    ├── main.tsx                      # Entry point React
    ├── App.tsx                       # Roteamento principal
    ├── index.css                     # Tailwind + utilitários globais
    ├── lib/
    │   └── supabase.ts               # Cliente Supabase + APP_DOMAIN (null se não configurado)
    ├── types/
    │   └── index.ts                  # Todos os tipos TypeScript
    ├── context/
    │   └── AuthContext.tsx           # Auth: Supabase Auth real ou mock local
    ├── services/                     # Camada de dados (Supabase ou mock)
    │   ├── clients.service.ts
    │   ├── services.service.ts
    │   ├── questionnaires.service.ts
    │   ├── checkins.service.ts
    │   ├── reminders.service.ts
    │   └── patient.service.ts
    ├── data/
    │   └── mockData.ts               # Dados mock (fallback quando sem Supabase)
    └── pages/
        ├── LandingPage.tsx           # Página de marketing/vendas
        ├── auth/
        │   ├── LoginPage.tsx
        │   └── RegisterPage.tsx
        ├── app/                      # Área protegida (profissional)
        │   ├── AppLayout.tsx         # Layout com sidebar
        │   ├── ClientsPage.tsx
        │   ├── ServicesPage.tsx
        │   ├── QuestionnairesPage.tsx
        │   ├── ResponsesPage.tsx
        │   ├── RemindersPage.tsx
        │   └── ClientAreaPage.tsx
        └── patient/
            └── PatientPage.tsx       # Área pública do cliente
```

---

## 5. ROTEAMENTO (`src/App.tsx`)

```
/                    → LandingPage (pública)
/login               → LoginPage (público, redireciona se logado)
/cadastro            → RegisterPage (público, redireciona se logado)
/app                 → AppLayout (privado, redireciona para /app/clientes)
  /app/clientes      → ClientsPage
  /app/servicos      → ServicesPage
  /app/questionarios → QuestionnairesPage
  /app/respostas     → ResponsesPage
  /app/lembretes     → RemindersPage
  /app/area-cliente  → ClientAreaPage
/p/:slug             → PatientPage (pública, área do cliente)
```

Guarda de rota:
- `PrivateRoute` — redireciona para `/login` se não autenticado
- `PublicRoute` — redireciona para `/app/clientes` se já autenticado

---

## 6. AUTENTICAÇÃO (`src/context/AuthContext.tsx`)

**Totalmente mock — sem backend.**

Interface `User`:
```ts
{ id: string; nome: string; email: string; profissao: string; slug: string }
```

Comportamento:
- `login(email, password)` — aceita qualquer email não-vazio, sempre retorna true. Simula 800ms de delay.
- `register(data)` — cria usuário com slug gerado do nome. Simula 1000ms.
- `logout()` — limpa localStorage.
- Persiste em `localStorage` com chave `hf_user`.

Mock user padrão: Dr. Ricardo Junin / ricardo@healthflow.com.br / Nutricionista / slug: dr-ricardo-junin

**Para produção:** substituir por chamadas reais à API. Manter mesma interface de contexto.

---

## 7. TIPOS (`src/types/index.ts`)

```ts
Professional { id, nome_completo, email, celular_whatsapp, profissao, slug,
               titulo_profissao, foto_perfil?, capa_cliente?,
               aparencia: { cor_primaria, cor_secundaria },
               plano_assinatura: 'mensal'|'trimestral'|'anual', data_criacao }

Client { id, profissional_id, nome, whatsapp, email, observacao?,
         status: 'ativo'|'finalizado'|'inativo', servico?, data_criacao, flag? }

Service { id, profissional_id, nome, status: 'ativo'|'inativo',
          validade_dias, modalidade: 'presencial'|'online',
          preco, vendas, faturamento, data_criacao }

QuestionOption { id, texto, pontuacao }

Question { id, questionario_id, texto,
           tipo: 'multipla_escolha'|'aberta'|'escala',
           ordem, peso_pontuacao, opcoes? }

Questionnaire { id, profissional_id, nome,
                status: 'ativo'|'inativo',
                total_perguntas, data_criacao, perguntas? }

CheckIn { id, questionario_id, questionario_nome, cliente_id, cliente_nome,
          data_resposta, pontuacao_total, pontuacao_percentual, comparativo? }

Reminder { id, profissional_id, cliente_id, cliente_nome, questionario_id,
           questionario_nome, data_envio_programada,
           tipo: 'inicial'|'lembrete'|'vencimento_plano',
           canal: 'whatsapp'|'email'|'ambos',
           status: 'pendente'|'enviado'|'falhou' }

FinancialEntry { id, profissional_id, cliente_nome, servico_nome, valor, data }
```

---

## 8. DADOS MOCK (`src/data/mockData.ts`)

Exporta:
- `mockClients` — 16 clientes (10 ativos, 3 finalizados, 2 inativos)
- `mockServices` — 4 serviços (3 ativos, 1 inativo)
- `chartData` — 6 meses de faturamento para gráfico de barras
- `mockQuestionnaires` — 4 questionários (3 ativos, 1 inativo), com perguntas completas
- `mockCheckIns` — 4 check-ins recentes com pontuação e comparativo
- `progressData` — 6 semanas de evolução para gráfico de linha
- `mockReminders` — 5 lembretes (vários status)
- `mockFinancialEntries` — 6 entradas financeiras recentes

---

## 9. PÁGINAS — DETALHAMENTO

### 9.1 LandingPage (`src/pages/LandingPage.tsx`)

**Seções (de cima para baixo):**
1. **Header fixo** — logo HealthFlow + Zap icon + nav links + botões Entrar/Testar Grátis
2. **Hero** — gradient-hero + dot-grid + badge "+904 profissionais" + H1 + 2 CTAs + mockup de 3 phones
3. **Para quem é** — 3 cards (Nutricionistas, Treinadores, Profissionais de Saúde)
4. **Funcionalidades por especialidade** — tabs Nutricionistas/Treinadores com 6 features + templates + mini-prontuário preview
5. **Como funciona** — 3 passos (Programe → Paciente responde → Você revisa)
6. **Área do cliente** — features + mockup phone do portal
7. **Progresso com dados reais** — mockup prontuário + 3 features
8. **Automações** — features + mockup dark terminal de automações
9. **Controle financeiro** — 3 cards de features
10. **Vídeo** — placeholder com botão play
11. **Preços** — toggle Mensal/Anual + card gradiente azul + lista de 10 features
12. **Depoimentos** — 7 cards de usuários reais
13. **FAQ** — 5 perguntas accordion
14. **CTA Final** — fundo dark + título + botão
15. **Footer** — logo + links + copyright

**Constantes importantes:**
- `TESTIMONIALS` — nomes/handles reais da LiveClin (mantidos como prova social)
- Preços: R$89/mês ou R$75/mês (anual = R$900 no Pix, 15% desconto)
- Counter: "+904 profissionais de saúde"
- Profissões no cadastro: Nutricionista, Treinador Pessoal, Profissional de Saúde, Psicólogo, Fisioterapeuta, Médico, Outro

### 9.2 LoginPage (`src/pages/auth/LoginPage.tsx`)

- Background: `gradient-to-br from-primary-50 to-primary-100`
- Logo HealthFlow + ícone Zap azul
- Card branco `rounded-3xl shadow-xl`
- Campos: email + senha (com toggle show/hide)
- Link "Esqueci minha senha" (não implementado)
- Botão Google (visual only)
- Link para cadastro

### 9.3 RegisterPage (`src/pages/auth/RegisterPage.tsx`)

- Mesmo visual que login
- Campos: nome completo, email, celular/WhatsApp, senha, confirmar senha, profissão (select), cupom de indicação (opcional)
- Validação client-side: nome obrigatório, email com @, celular ≥10 chars, senha ≥6, senhas iguais, profissão selecionada
- Botão Google (visual only)

### 9.4 AppLayout (`src/pages/app/AppLayout.tsx`)

**Sidebar colapsável (w-64 → w-16):**
- Logo HealthFlow + ícone Zap no topo
- Badge "Área do cliente" com URL do profissional e botões Copiar/Abrir (só no expandido)
- URL format: `healthflow.app/p/{slug}`
- Navegação com grupos expansíveis (Gestão de Clientes tem submenus)

**Itens do menu (NAV_ITEMS):**
1. Gestão de Clientes (grupo) → Clientes | Importação
2. Serviços (`/app/servicos`)
3. Questionários (`/app/questionarios`)
4. Respostas (`/app/respostas`)
5. Lembretes (`/app/lembretes`)
6. Área do Cliente (`/app/area-cliente`)
7. Tutoriais (`#` — não implementado)
8. Falar com o Suporte (`#` — não implementado)
9. Indique e Ganhe (`#` — não implementado)

**Footer da sidebar:**
- Avatar com inicial do nome
- Nome + email do usuário
- Botão logout (ícone vermelho no hover)

### 9.5 ClientsPage (`src/pages/app/ClientsPage.tsx`)

**Funcionalidades:**
- Tabs: Ativos | Finalizados | Inativos | Todos (com contador)
- Busca por nome
- Tabela paginada (15 por página) com colunas: Nome (avatar), Serviço, Status, Observação, Ações
- Ações por linha: WhatsApp (link wa.me) + Flag (toggle vermelho)
- Botão "Importar" (visual, sem implementação)
- Modal "Adicionar cliente" com campos: nome*, WhatsApp, email, serviço, observação

**Estado local:** `useState<Client[]>` com `mockClients` como inicial

### 9.6 ServicesPage (`src/pages/app/ServicesPage.tsx`)

**Dashboard financeiro (topo):**
- Gráfico de barras Recharts (fill: `#2563eb`) — 6 meses
- Cards: Total do período, Vendas, Ticket médio
- Lista "Últimas entradas" (6 mais recentes de `mockFinancialEntries`)

**Tabela de serviços:**
- Colunas: Nome, Status, Validade (dias), Modalidade, Preço, Vendas, Faturamento, Editar
- Modal criar/editar: nome*, validade_dias, preço, modalidade (select), status (select)

### 9.7 QuestionnairesPage (`src/pages/app/QuestionnairesPage.tsx`)

**Duas formas de criar questionários:**
1. **Templates prontos** — modal com tabs Nutricionistas/Treinadores:
   - Nutricionistas: 3 templates (Check-in Semanal Nutricional 6q, Avaliação de Sintomas GI 5q, Comportamento Alimentar 5q)
   - Treinadores: 3 templates (Check-in Semanal de Treinos 6q, Avaliação de Desempenho Físico 5q, Controle de Recuperação e Sono 5q)
   - Importa com 1 clique

2. **Construtor manual** — modal com:
   - Nome + status do questionário
   - Adicionar perguntas: texto + tipo (escala/múltipla escolha/aberta)
   - Opções editáveis inline com pontuação
   - Escala padrão ao criar: Ótimo(4), Bom(3), Regular(2), Ruim(1)

**Lista de questionários:**
- Cards expansíveis mostrando perguntas completas com opções e pontuações
- Botões: Editar, Excluir, Expandir

### 9.8 ResponsesPage (`src/pages/app/ResponsesPage.tsx`)

**Layout 3 colunas:**
- Coluna 1 (esq): Lista de check-ins recentes com seleção, pontuação % e comparativo (↑↓)
- Colunas 2-3 (dir):
  - Card de pontuação do selecionado com comparativo
  - Tabs Nutrição/Treinos com ranking de hábitos (6 itens por tab)
  - Gráfico de linha Recharts (stroke: `#2563eb`) — 6 semanas de evolução com select de métrica

**Hábitos Nutrição:** Sono, Adesão ao Plano, Func. Intestinal, Hidratação, Sintomas GI, Controle de Fome  
**Hábitos Treinos:** Sono, Frequência, Intensidade, Recuperação, Hidratação Intra-treino, Nutrição Pré/Pós

### 9.9 RemindersPage (`src/pages/app/RemindersPage.tsx`)

**Cards de estatísticas:** Pendentes (amber), Enviados (green), Falhou (red)

**Tabela de lembretes:**
- Colunas: Cliente, Questionário, Tipo, Data e Hora, Canal, Status, Excluir
- Canal exibido com ícones: MessageSquare (WhatsApp verde), Mail (email azul)

**Tipos de lembrete:** Envio inicial | Lembrete de resposta | Vencimento de plano  
**Canais:** WhatsApp | E-mail | WhatsApp + E-mail

**Modal novo lembrete:** paciente*, questionário, data*, hora, tipo (select), canal (select)

### 9.10 ClientAreaPage (`src/pages/app/ClientAreaPage.tsx`)

**Formulário (col-span-3):**
1. Link da área do cliente — input de slug com prefixo `healthflow.app/p/`
2. Informações do profissional — nome (readonly) + título/profissão
3. Imagens — upload foto de perfil (400x400, 8MB) + capa (1080x1920, 8MB) — UI only, sem upload real
4. Aparência — color picker: cor primária (default `#2563eb`) + cor secundária (default `#1d4ed8`)
5. Botão Salvar (vira verde ao salvar)

**Preview ao vivo (col-span-2 sticky):**
- Mockup phone com gradient da cor escolhida no topo
- Avatar, nome, título do profissional
- Botões "Questionários pendentes" e "Histórico de respostas" na cor escolhida
- Pontuação 85% na cor primária
- Indicador online/offline

### 9.11 PatientPage (`src/pages/patient/PatientPage.tsx`)

**Área pública — acessada pelo link do profissional `/p/:slug`**

4 telas navegáveis (state: 'home' | 'list' | 'answering' | 'result' | 'history'):

- **Home** — saudação + botão questionários pendentes (badge contador) + histórico + card pontuação anterior
- **List** — lista de questionários pendentes com botão Responder
- **Answering** — barra de progresso + questão atual com opções clicáveis (destaque azul ao selecionar) + botão Próxima/Finalizar
- **Result** — pontuação % + comparativo + ranking de hábitos por categoria + botão Voltar
- **History** — lista de check-ins anteriores com data, nome e % + card de média geral

**Header fixo:** nome do profissional + avatar + título + indicador online (verde)  
**Footer:** "Powered by HealthFlow" + URL do profissional

Profissional demo: Dr. Ricardo Junin / Nutricionista  
Paciente demo: Ana Carolina

---

## 10. MUDANÇAS APLICADAS (HISTÓRICO)

### 2026-05-26 — Banco de dados + Deploy (Supabase + Docker Swarm)

**Motivação:** Preparar o sistema para produção com banco real e deploy no VPS via Portainer.

**Arquivos criados:**

| Arquivo | Descrição |
|---|---|
| `supabase/schema.sql` | 10 tabelas, views, triggers de updated_at, índices |
| `supabase/rls.sql` | Políticas RLS: profissional acessa só seus dados; paciente tem acesso anon controlado |
| `supabase/seed.sql` | Dados de exemplo (1 profissional, 4 serviços, 16 clientes, 2 questionários) |
| `.env.example` | Template: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_APP_DOMAIN |
| `src/lib/supabase.ts` | Cliente Supabase + `APP_DOMAIN` (null quando env vars ausentes → usa mock) |
| `src/services/clients.service.ts` | CRUD de clientes (Supabase real ou mock) |
| `src/services/services.service.ts` | CRUD de serviços + dados financeiros |
| `src/services/questionnaires.service.ts` | CRUD de questionários + perguntas/opções |
| `src/services/checkins.service.ts` | Leitura e submissão de check-ins |
| `src/services/reminders.service.ts` | CRUD de lembretes |
| `src/services/patient.service.ts` | Dados públicos para área do paciente |
| `Dockerfile` | Build multi-stage: Node 20 Alpine build → Nginx Alpine serve |
| `nginx.conf` | SPA config: try_files, gzip, cache de assets, security headers |
| `docker-stack.yml` | Stack Portainer/Swarm com Traefik labels e SSL automático |
| `.dockerignore` | Exclui node_modules, dist, .env do contexto Docker |

**Arquivos alterados:**

| Arquivo | Mudança |
|---|---|
| `src/context/AuthContext.tsx` | Suporta Supabase Auth real (signIn/signUp/signOut) + mock fallback |
| `src/pages/app/AppLayout.tsx` | Usa `APP_DOMAIN` de `src/lib/supabase.ts` |
| `src/pages/app/ClientAreaPage.tsx` | Usa `APP_DOMAIN` de `src/lib/supabase.ts` |
| `src/pages/patient/PatientPage.tsx` | Domínio atualizado para `healthflow.autotech.dev.br` |

**Domínio:** `healthflow.app` → `healthflow.autotech.dev.br`

**Para ativar Supabase:**
1. `npm install @supabase/supabase-js` (requer espaço em disco)
2. Criar projeto em supabase.com
3. Executar `supabase/schema.sql` → `supabase/rls.sql` → `supabase/seed.sql`
4. Copiar `.env.example` → `.env.local` e preencher as chaves

### 2026-05-26 — Mudança de cor: Roxo → Azul (padrão LiveClin)

**Motivação:** Alinhar visual ao site de referência liveclin.com que usa azul como cor primária.

**Arquivos alterados:**

| Arquivo | Mudança |
|---|---|
| `tailwind.config.js` | Paleta `primary` de roxo (`#9333ea`) para azul (`#2563eb`) |
| `src/index.css` | `dot-grid` dots: `#d8b4fe` → `#93c5fd`; `gradient-hero` de roxo para azul |
| `src/pages/app/ClientAreaPage.tsx` | Default `corPrimaria` `#9333ea` → `#2563eb`; `corSecundaria` `#7e22ce` → `#1d4ed8` |
| `src/pages/app/ServicesPage.tsx` | Gráfico BarChart `fill="#9333ea"` → `#2563eb` |
| `src/pages/app/ResponsesPage.tsx` | Gráfico LineChart `stroke="#9333ea"` → `#2563eb` |
| `src/pages/LandingPage.tsx` | Emoji 💜 → 💙 (2 ocorrências: hero e seção Área do Cliente) |

---

## 11. REGRAS DE DESENVOLVIMENTO

1. **Nunca hardcodar** cores primárias como hex — usar sempre classes Tailwind `primary-*`
2. A única exceção são os gráficos Recharts que não aceitam classes Tailwind — usar `#2563eb` (primary-600)
3. Toda nova página do app segue o padrão de cabeçalho: ícone + título + subtítulo opcionais
4. Modais sempre com backdrop blur e animação de entrada
5. Tabelas: `rounded-2xl border border-slate-200 overflow-hidden` no container, `bg-slate-50` no thead
6. Todo formulário: validação antes de chamar qualquer função de save
7. A cor primária da LiveClin é azul (`#2563eb`) — qualquer novo componente deve usar `primary-600`

---

## 12. PRÓXIMOS PASSOS (backend/produção)

- [ ] Substituir `AuthContext` mock por autenticação real (JWT/Supabase)
- [ ] Criar tabelas no banco: professionals, clients, services, questionnaires, questions, check_ins, reminders
- [ ] Implementar upload real de imagens (foto perfil + capa)
- [ ] Integrar envio WhatsApp (Evolution API / Twilio)
- [ ] Integrar envio email (Resend / SendGrid)
- [ ] Implementar agendamento de lembretes (cron job)
- [ ] Implementar importação CSV/XLS de clientes
- [ ] Implementar página de Tutoriais, Suporte, Indique e Ganhe

---

## 13. INFORMAÇÕES DO PROJETO

- **Email do usuário:** uruhara777@gmail.com  
- **Nome do produto:** HealthFlow  
- **Domínio de produção:** healthflow.autotech.dev.br  
- **Usuário demo:** Dr. Ricardo Junin (slug: `dr-ricardo-junin`)  
- **Referência de design:** liveclin.com (paleta azul, sidebar, estrutura de páginas)

---

## 14. PREÇOS E PLANOS

| Periodicidade | Valor |
|---|---|
| Mensal | R$89/mês |
| Anual | R$75/mês (R$900 no Pix — 15% desconto) |

Toggle visual mensal/anual implementado com `useState` na LandingPage.

**O que está incluso (10 features listadas no card de preços):**
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

## 15. INTEGRAÇÕES E CANAIS

| Canal | Status | Uso |
|---|---|---|
| **WhatsApp Business API (Meta)** | A implementar | Envio automático de questionários, lembretes, avisos de vencimento |
| **E-mail (SendGrid)** | A implementar | Envio alternativo de questionários e notificações |
| **Google OAuth** | Visual implementado | Login social para profissionais |
| **Google reCAPTCHA v3** | A implementar | Proteção de formulários de auth |
| **YouTube** | Placeholder implementado | Vídeo demonstrativo na landing page |
| **LinkedIn / Instagram** | Links no footer | Redes sociais da empresa |

---

## 16. FLUXOS DO USUÁRIO

### 16.1 Cadastro do Profissional
```
Landing Page → CTA "Testar Gratuitamente" → /cadastro
  Campos: Nome*, Email*, Celular*, Senha*, Confirmar Senha*, Profissão*, Cupom (opcional)
  Validação client-side com erros inline
  → AuthContext.register() → localStorage → redirect /app/clientes
```

### 16.2 Login
```
/login → email + senha → AuthContext.login() → localStorage → /app/clientes
  (mock: qualquer email não-vazio + qualquer senha = sucesso)
  Logout: clique no ícone → AuthContext.logout() → limpa localStorage → /
```

### 16.3 Onboarding do Profissional
```
1. /app/area-cliente → configurar slug, título, foto, capa, cores
2. /app/servicos → criar serviço (nome, validade, modalidade, preço)
3. /app/clientes → cadastrar cliente (associar serviço)
4. /app/questionarios → criar questionário + adicionar perguntas
5. /app/lembretes → agendar envio automático
6. Copiar link da área do cliente da sidebar → compartilhar com paciente
```

### 16.4 Fluxo do Paciente (Check-in)
```
Recebe link → /p/{slug}
→ Home: saudação + botões + última pontuação
→ [Questionários pendentes] → lista de questionários
→ [Responder] → pergunta 1/N → seleciona opção → [Próxima] → ... → [Finalizar]
→ Resultado: pontuação % + comparativo + ranking de hábitos
→ [Voltar ao início] → Home
→ [Histórico de respostas] → check-ins anteriores com médias
```

### 16.5 Revisão pelo Profissional
```
/app/respostas → lista de check-ins recentes
→ Clica em um check-in → prontuário abre no painel direito
→ Vê score, ranking de hábitos e gráfico de evolução
→ Pode filtrar o gráfico por categoria de hábito
```

---

## 17. REQUISITOS NÃO-FUNCIONAIS

| Requisito | Especificação | Status |
|---|---|---|
| **Responsividade** | Mobile-first; landing + área do paciente otimizadas para celular | ✅ Implementado |
| **Sem app nativo** | Área do paciente é web app puro — sem instalação | ✅ Implementado |
| **Tema customizável** | Profissional escolhe cor primária/secundária da área do paciente | ✅ Implementado |
| **Multi-tenancy** | Cada profissional tem slug único | ✅ Implementado (mock) |
| **Acessibilidade** | Textos em tamanho adequado, navegação simples na área do paciente | ✅ Implementado |
| **Idioma** | Português do Brasil (pt-BR) em todo o sistema | ✅ Implementado |
| **Performance** | Vite HMR, componentes otimizados com `useMemo` | ✅ Implementado |
| **TypeScript strict** | Todos os arquivos tipados, zero erros de compilação | ✅ Implementado |

---

## 18. DEPOIMENTOS (Prova Social — LandingPage)

7 cards estilo Twitter no array `TESTIMONIALS`:

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

## 19. FAQ (implementado como acordeão na LandingPage)

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

## 20. FUNCIONALIDADES ESPECÍFICAS POR PROFISSÃO

### 20.1 Landing Page — Seção por Profissão (LandingPage.tsx)

State `profTab: 'nutri' | 'trainer'` com `useState`.

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

### 20.2 Questionários — Templates Prontos (QuestionnairesPage.tsx)

Botão "Templates prontos" (ícone `LayoutTemplate`) → modal com abas Apple/Dumbbell.

**`NUTRI_TEMPLATES`:**
| Template | Perguntas | Categorias |
|---|---|---|
| Check-in Semanal Nutricional | 6 | Sono, plano alimentar, hidratação, intestinal, sintomas GI, saciedade |
| Avaliação de Sintomas Gastrointestinais | 5 | Refluxo, gases, trânsito intestinal, desconforto, síndrome irritável |
| Comportamento Alimentar | 5 | Fome emocional, compulsão, restrição, mindful eating, padrão alimentar |

**`TRAINER_TEMPLATES`:**
| Template | Perguntas | Categorias |
|---|---|---|
| Check-in Semanal de Treinos | 6 | Freq. treinos, intensidade, recuperação muscular, sono, nutrição peritraining |
| Avaliação de Desempenho Físico | 5 | Força, resistência cardiovascular, flexibilidade, composição corporal, PRs |
| Controle de Recuperação e Sono | 5 | Qualidade sono, dores musculares, estresse, hidratação, variabilidade cardíaca |

### 20.3 Respostas — Hábitos por Profissão (ResponsesPage.tsx)

State `profTab: 'nutri' | 'trainer'` controla qual array de hábitos exibir.

**`NUTRI_HABITS` (6 itens):**
- Qualidade do Sono — Ótimo (verde)
- Adesão ao Plano Alimentar — Regular (âmbar)
- Funcionamento Intestinal — Ótimo (verde)
- Hidratação Diária — Ruim (vermelho)
- Sintomas Gastrointestinais — Bom (azul: `text-primary-600 bg-primary-50`)
- Controle de Fome/Saciedade — Bom (azul: `text-primary-600 bg-primary-50`)

**`TRAINER_HABITS` (6 itens):**
- Qualidade do Sono — Bom (azul: `text-primary-600 bg-primary-50`)
- Frequência de Treinos — Ótimo (verde)
- Intensidade dos Treinos — Ótimo (verde)
- Recuperação Muscular — Regular (âmbar)
- Hidratação Intra-treino — Ruim (vermelho)
- Nutrição Pré/Pós-treino — Bom (azul: `text-primary-600 bg-primary-50`)

Select de evolução dinâmico: opções mudam conforme `profTab` — nutri mostra hábitos alimentares; trainer mostra hábitos de treino.

---

## 21. BACKEND / DEPLOY (a implementar para produção)

### 21.1 Backend
| Aspecto | Recomendação |
|---|---|
| **Runtime** | Node.js 20 LTS |
| **Framework** | NestJS (modular, TypeScript nativo) ou Express |
| **Autenticação** | JWT (access + refresh token) + Google OAuth 2.0 |
| **WhatsApp** | Meta WhatsApp Business Cloud API |
| **E-mail** | SendGrid ou Nodemailer + SMTP |
| **Filas** | BullMQ + Redis (agendamento de lembretes) |

### 21.2 Banco de Dados
| Aspecto | Recomendação |
|---|---|
| **Principal** | PostgreSQL via Supabase |
| **Cache / Filas** | Redis (sessões + BullMQ jobs) |
| **ORM** | Prisma (type-safe, migrations, seeds) |
| **Uploads** | Cloudinary ou AWS S3 |

### 21.3 Deploy
| Parte | Plataforma |
|---|---|
| **Front-end** | Vercel (CI/CD automático do GitHub) |
| **Back-end** | Railway ou Render |
| **Banco** | Supabase (PostgreSQL gerenciado) |
| **Cache** | Upstash Redis (serverless) |
| **Storage** | Cloudinary |
| **Domínio** | healthflow.app + *.healthflow.app |

---

## 22. PRIORIDADES PARA PRODUÇÃO

| Item | Prioridade | Esforço |
|---|---|---|
| Backend API (Node.js + NestJS) | Alta | Grande |
| Banco de dados PostgreSQL (Prisma + Supabase) | Alta | Médio |
| Autenticação real (JWT + Google OAuth) | Alta | Médio |
| Integração WhatsApp Business API | Alta | Grande |
| Filas de agendamento (BullMQ + Redis) | Alta | Grande |
| Deploy (Vercel + Railway + Supabase) | Alta | Médio |
| Upload de imagens (Cloudinary/S3) | Média | Médio |
| Sistema de pagamento (Stripe/PagSeguro) | Média | Grande |
| Importação CSV/XLS real | Média | Médio |
| E-mail transacional (SendGrid) | Média | Pequeno |

### Melhorias de UX a considerar
- Drag-and-drop real no construtor de questionários (`react-beautiful-dnd`)
- Notificações push (PWA)
- Dark mode
- Exportação de relatórios em PDF
- Chat interno profissional ↔ paciente
- Assinatura digital de documentos
