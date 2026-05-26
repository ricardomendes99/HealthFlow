-- ============================================================
-- HealthFlow — Schema PostgreSQL para Supabase
-- Execute este arquivo no SQL Editor do seu projeto Supabase
-- Ordem: schema.sql → rls.sql → seed.sql (opcional)
-- ============================================================

-- Extensão para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Função helper: atualiza updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABELA: professionals
-- Vinculada ao Supabase Auth (auth.users) via id
-- ============================================================
CREATE TABLE IF NOT EXISTS professionals (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo  TEXT        NOT NULL,
  email          TEXT        NOT NULL UNIQUE,
  celular_whatsapp TEXT,
  profissao      TEXT        NOT NULL DEFAULT 'Nutricionista',
  slug           TEXT        NOT NULL UNIQUE,
  titulo_profissao TEXT      NOT NULL DEFAULT '',
  foto_perfil    TEXT,                            -- URL (Supabase Storage)
  capa_cliente   TEXT,                            -- URL (Supabase Storage)
  cor_primaria   TEXT        NOT NULL DEFAULT '#2563eb',
  cor_secundaria TEXT        NOT NULL DEFAULT '#1d4ed8',
  plano_assinatura TEXT      NOT NULL DEFAULT 'mensal'
                             CHECK (plano_assinatura IN ('mensal', 'trimestral', 'anual')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_professionals_updated_at
  BEFORE UPDATE ON professionals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- TABELA: services
-- Planos/serviços criados pelo profissional
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profissional_id  UUID        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  nome             TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'ativo'
                               CHECK (status IN ('ativo', 'inativo')),
  validade_dias    INTEGER     NOT NULL DEFAULT 30,
  modalidade       TEXT        NOT NULL DEFAULT 'online'
                               CHECK (modalidade IN ('presencial', 'online')),
  preco            NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_services_profissional ON services(profissional_id);

-- ============================================================
-- TABELA: clients
-- Clientes/pacientes do profissional
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profissional_id  UUID        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  service_id       UUID        REFERENCES services(id) ON DELETE SET NULL,
  nome             TEXT        NOT NULL,
  whatsapp         TEXT,
  email            TEXT,
  observacao       TEXT,
  status           TEXT        NOT NULL DEFAULT 'ativo'
                               CHECK (status IN ('ativo', 'finalizado', 'inativo')),
  flag             BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_clients_profissional ON clients(profissional_id);
CREATE INDEX idx_clients_status       ON clients(profissional_id, status);

-- ============================================================
-- TABELA: questionnaires
-- Questionários criados pelo profissional
-- ============================================================
CREATE TABLE IF NOT EXISTS questionnaires (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profissional_id  UUID        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  nome             TEXT        NOT NULL,
  status           TEXT        NOT NULL DEFAULT 'ativo'
                               CHECK (status IN ('ativo', 'inativo')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_questionnaires_updated_at
  BEFORE UPDATE ON questionnaires
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_questionnaires_profissional ON questionnaires(profissional_id);

-- ============================================================
-- TABELA: questions
-- Perguntas de um questionário
-- ============================================================
CREATE TABLE IF NOT EXISTS questions (
  id               UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  questionario_id  UUID    NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  texto            TEXT    NOT NULL,
  tipo             TEXT    NOT NULL DEFAULT 'escala'
                           CHECK (tipo IN ('multipla_escolha', 'aberta', 'escala')),
  ordem            INTEGER NOT NULL DEFAULT 0,
  peso_pontuacao   INTEGER NOT NULL DEFAULT 1,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_questions_questionario ON questions(questionario_id, ordem);

-- ============================================================
-- TABELA: question_options
-- Opções de resposta de uma pergunta (exceto tipo "aberta")
-- ============================================================
CREATE TABLE IF NOT EXISTS question_options (
  id          UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID    NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  texto       TEXT    NOT NULL,
  pontuacao   INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_question_options_question ON question_options(question_id);

-- ============================================================
-- TABELA: check_ins
-- Sessão de resposta de um questionário por um cliente
-- ============================================================
CREATE TABLE IF NOT EXISTS check_ins (
  id                   UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  questionario_id      UUID        NOT NULL REFERENCES questionnaires(id),
  cliente_id           UUID        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  pontuacao_total      INTEGER     NOT NULL DEFAULT 0,
  pontuacao_percentual INTEGER     NOT NULL DEFAULT 0,  -- 0–100
  data_resposta        DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_checkins_cliente       ON check_ins(cliente_id, data_resposta DESC);
CREATE INDEX idx_checkins_questionario  ON check_ins(questionario_id);

-- ============================================================
-- TABELA: check_in_answers
-- Respostas individuais de cada check-in
-- ============================================================
CREATE TABLE IF NOT EXISTS check_in_answers (
  id             UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_in_id    UUID    NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  question_id    UUID    NOT NULL REFERENCES questions(id),
  option_id      UUID    REFERENCES question_options(id),  -- NULL se tipo "aberta"
  resposta_texto TEXT,                                     -- preenchido se tipo "aberta"
  pontuacao      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_answers_checkin ON check_in_answers(check_in_id);

-- ============================================================
-- TABELA: reminders
-- Lembretes agendados para envio ao cliente
-- ============================================================
CREATE TABLE IF NOT EXISTS reminders (
  id                    UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profissional_id       UUID        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  cliente_id            UUID        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  questionario_id       UUID        NOT NULL REFERENCES questionnaires(id),
  data_envio_programada TIMESTAMPTZ NOT NULL,
  tipo                  TEXT        NOT NULL DEFAULT 'inicial'
                                    CHECK (tipo IN ('inicial', 'lembrete', 'vencimento_plano')),
  canal                 TEXT        NOT NULL DEFAULT 'whatsapp'
                                    CHECK (canal IN ('whatsapp', 'email', 'ambos')),
  status                TEXT        NOT NULL DEFAULT 'pendente'
                                    CHECK (status IN ('pendente', 'enviado', 'falhou')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_reminders_updated_at
  BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_reminders_profissional ON reminders(profissional_id);
CREATE INDEX idx_reminders_status       ON reminders(profissional_id, status);

-- ============================================================
-- TABELA: financial_entries
-- Entradas financeiras (vendas de serviços)
-- ============================================================
CREATE TABLE IF NOT EXISTS financial_entries (
  id               UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  profissional_id  UUID        NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  cliente_id       UUID        REFERENCES clients(id) ON DELETE SET NULL,
  service_id       UUID        REFERENCES services(id) ON DELETE SET NULL,
  valor            NUMERIC(10,2) NOT NULL,
  descricao        TEXT,
  data             DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_financial_profissional ON financial_entries(profissional_id, data DESC);

-- ============================================================
-- VIEW: vw_services_stats
-- Agrega vendas e faturamento por serviço (usado em ServicesPage)
-- ============================================================
CREATE OR REPLACE VIEW vw_services_stats AS
SELECT
  s.id,
  s.profissional_id,
  s.nome,
  s.status,
  s.validade_dias,
  s.modalidade,
  s.preco,
  s.created_at,
  COUNT(fe.id)::INTEGER          AS vendas,
  COALESCE(SUM(fe.valor), 0)     AS faturamento
FROM services s
LEFT JOIN financial_entries fe ON fe.service_id = s.id
GROUP BY s.id;

-- ============================================================
-- VIEW: vw_check_in_comparativo
-- Calcula comparativo % em relação ao check-in anterior do mesmo cliente+questionário
-- ============================================================
CREATE OR REPLACE VIEW vw_check_in_comparativo AS
SELECT
  ci.*,
  ci.pontuacao_percentual - LAG(ci.pontuacao_percentual)
    OVER (PARTITION BY ci.cliente_id, ci.questionario_id ORDER BY ci.data_resposta)
  AS comparativo
FROM check_ins ci;
