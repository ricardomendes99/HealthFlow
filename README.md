# 💙 HealthFlow — Plataforma SaaS de Acompanhamento para Profissionais de Saúde

> **HealthFlow** é uma plataforma SaaS moderna de acompanhamento pós-consulta inspirada no site [LiveClin](https://liveclin.com/). Ela permite que nutricionistas, personal trainers e outros profissionais de saúde gerenciem seus clientes, criem questionários de hábitos semanais personalizados, enviem lembretes de check-in e analisem a evolução dos pacientes por meio de relatórios de progresso gamificados.

O grande diferencial do **HealthFlow** é a **praticidade para o paciente**: ele não precisa baixar nenhum aplicativo. O acesso à área do cliente é feito inteiramente de forma responsiva pelo navegador através de um link personalizado (`/p/seu-slug`).

---

## 🚀 Principais Funcionalidades

### 🩺 1. Painel do Profissional (`/app/*`)
*   **Gestão de Clientes:** Listagem organizada (Ativos, Inativos, Finalizados), barra de busca em tempo real, paginação, marcadores de atenção (flags) e botão direto de contato via WhatsApp.
*   **Gestão de Serviços e Planos:** Cadastro de planos de atendimento (mensal, trimestral, semestral) e painel financeiro com gráficos de faturamento dos últimos 6 meses (usando Recharts).
*   **Construtor de Questionários Dinâmico:** Crie e edite questionários do zero ou utilize **Templates Prontos** desenvolvidos especificamente para a especialidade (Nutrição ou Educação Física).
*   **Acompanhamento de Respostas (Prontuário):** Visualização detalhada das respostas de cada check-in, score geral de adesão comparativo, ranking de hábitos e evolução temporal com gráficos de linha.
*   **Automação de Lembretes:** Cadastro de lembretes automáticos de check-in e vencimento de planos via WhatsApp e E-mail.
*   **Customização da Área do Cliente:** Definição de slug próprio (ex: `/p/dr-ricardo`), alteração das cores primárias/secundárias em tempo real e upload de foto de perfil e capa, com um simulador interativo de celular (preview).

### 📱 2. Área do Paciente (`/p/:slug`)
*   **Experiência Web App Fluida:** Layout mobile-first, limpo e de fácil leitura (perfeito para todas as idades).
*   **Fluxo de Questionário Paginado:** Resposta fácil de perguntas do tipo escala, múltipla escolha ou discursiva, com barra de progresso.
*   **Gamificação e Feedbacks:** Exibição do score percentual de hábitos no final de cada check-in e comparação de evolução com a semana anterior.
*   **Histórico de Acompanhamento:** Histórico completo de check-ins anteriores com médias de adesão.

### 🌐 3. Landing Page Institucional (`/`)
*   Página de vendas moderna contendo Hero com animações, abas dinâmicas detalhando funcionalidades para Nutricionistas e Treinadores, seção de preços (mensal/anual), FAQ interativo e prova social (depoimentos).

---

## 🛠️ Stack Tecnológica

*   **Core:** React 18 & TypeScript (tipagem estática em toda a aplicação)
*   **Build/Bundler:** Vite 6
*   **Estilização:** Tailwind CSS v3 (utilitários e tema customizado de cor primária azul `#2563eb`)
*   **Roteamento:** React Router DOM v6
*   **Gráficos:** Recharts (gráfico de faturamento em barras e gráfico de hábitos em linha)
*   **Ícones:** Lucide React (mais de 60 ícones vetoriais)
*   **Banco de Dados & Autenticação:** Preparado para integração completa com **Supabase** (contém esquemas SQL prontos) e com fallback local (localStorage/Mock data) integrado.
*   **Infraestrutura/Deploy:** Dockerfile + Nginx e suporte a deploy via Docker Swarm/Portainer.

---

## 📂 Estrutura do Projeto

```text
sistemajunin/
├── index.html                    # Ponto de entrada HTML e SEO
├── vite.config.ts                # Configuração do Vite + React
├── tailwind.config.js            # Configuração do Tailwind (Paleta azul e fontes)
├── Dockerfile                    # Arquivo Docker multi-stage (Node -> Nginx)
├── nginx.conf                    # Configurações do Nginx para single-page app (SPA)
├── docker-stack.yml              # Configuração de stack Docker Swarm (com Traefik)
├── supabase/                     # Scripts de banco de dados
│   ├── schema.sql                # Tabelas, chaves estrangeiras, triggers e índices
│   ├── rls.sql                   # Políticas de Row Level Security (Segurança)
│   └── seed.sql                  # Dados de exemplo para desenvolvimento
└── src/
    ├── main.tsx                  # Ponto de entrada do React
    ├── App.tsx                   # Roteamento e provedores globais (AuthContext)
    ├── index.css                 # Importações do Tailwind e padrões CSS (dot-grid, etc.)
    ├── types/
    │   └── index.ts              # Tipos TypeScript do domínio (Cliente, Questionário, etc.)
    ├── lib/
    │   └── supabase.ts           # Inicialização do cliente Supabase e configurações de domínio
    ├── context/
    │   └── AuthContext.tsx       # Controle de autenticação (Suporta Supabase Real & Mock Local)
    ├── services/                 # Serviços de conexão ao Supabase / fallback em Mock Data
    │   ├── clients.service.ts    # CRUD de Clientes
    │   ├── services.service.ts   # CRUD de Serviços e Faturamento
    │   ├── questionnaires.service.ts # Construtor de Questionários e perguntas
    │   ├── checkins.service.ts   # Envio e leitura de check-ins
    │   └── reminders.service.ts  # Gestão de alertas automáticos
    ├── data/
    │   └── mockData.ts           # Dados fake de simulação do painel
    └── pages/
        ├── LandingPage.tsx       # Landing Page principal
        ├── auth/                 # Login e Cadastro de Profissional
        ├── app/                  # Telas protegidas do Dashboard do Profissional
        └── patient/              # Fluxos públicos do Paciente (/p/:slug)
```

---

## 💻 Como Executar Localmente

### 1. Pré-requisitos
*   [Node.js](https://nodejs.org/) (Versão 18 ou superior recomendado)
*   NPM ou Yarn

### 2. Passo a Passo
1.  Clone o repositório no seu computador:
    ```bash
    git clone <url-do-repositorio>
    cd sistemajunin
    ```
2.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento local:
    ```bash
    npm run dev
    ```
4.  Abra seu navegador em: `http://localhost:5173`

---

## 🛢️ Integração com o Supabase (Opcional para Backend Real)

O projeto está configurado para alternar automaticamente para o **Supabase** caso as variáveis de ambiente corretas estejam configuradas. Se não estiverem, ele rodará em modo **Mock Local** usando dados em memória e localStorage.

Para ativar o Supabase:
1.  Instale o cliente do Supabase no projeto se ainda não tiver instalado:
    ```bash
    npm install @supabase/supabase-js
    ```
2.  Crie um projeto no painel do [Supabase](https://supabase.com/).
3.  Copie e preencha as variáveis no seu arquivo `.env.local` com base no arquivo `.env.example`:
    ```env
    VITE_SUPABASE_URL=https://sua-url-do-supabase.supabase.co
    VITE_SUPABASE_ANON_KEY=seu-token-anonimo-do-supabase
    VITE_APP_DOMAIN=seu-dominio-local-ou-producao
    ```
4.  No editor de SQL do painel do Supabase, execute o conteúdo dos arquivos na seguinte ordem:
    1.  `supabase/schema.sql` (Estruturação de tabelas e relacionamentos)
    2.  `supabase/rls.sql` (Ativação e regras de políticas de Row Level Security)
    3.  `supabase/seed.sql` (Dados iniciais de teste)

---

## 🐳 Deploy com Docker Swarm & Nginx

O projeto já conta com uma estrutura pronta para empacotamento em container e deploy.

### Build da Imagem
```bash
docker build -t healthflow:latest .
```

### Configuração da Stack (Docker Swarm)
O arquivo `docker-stack.yml` está configurado para gerenciar o serviço através do Traefik como proxy reverso, fornecendo HTTPS automático via Let's Encrypt.
Para implantar a stack no seu cluster Swarm:
```bash
docker stack deploy -c docker-stack.yml healthflow
```

---

## 🗺️ Próximos Passos & Roadmap

- [ ] Implementação de upload real de imagens para capa e avatar (via Supabase Storage ou Cloudinary).
- [ ] Integração com a API Oficial do WhatsApp Business (Meta) ou Evolution API para o disparo automatizado dos check-ins.
- [ ] Integração com gateway de pagamentos (Stripe, Asaas ou PagSeguro) para faturamento dos planos diretamente na landing page.
- [ ] Lembretes agendados automáticos por meio de filas (como BullMQ + Redis).
- [ ] Exportação de relatórios de progresso em PDF para apresentação direta em consultas presenciais.
