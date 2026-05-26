-- ============================================================
-- HealthFlow — Seed Data (dados de exemplo)
-- Execute APÓS schema.sql + rls.sql
-- Substitua {PROFESSIONAL_ID} pelo UUID do usuário criado no Supabase Auth
-- ============================================================

-- Profissional demo
INSERT INTO professionals (id, nome_completo, email, celular_whatsapp, profissao, slug, titulo_profissao, cor_primaria, cor_secundaria, plano_assinatura)
VALUES (
  '{PROFESSIONAL_ID}',
  'Dr. Ricardo Junin',
  'ricardo@healthflow.com.br',
  '11999999999',
  'Nutricionista',
  'dr-ricardo-junin',
  'Nutricionista Esportivo',
  '#2563eb',
  '#1d4ed8',
  'mensal'
) ON CONFLICT DO NOTHING;

-- Serviços
INSERT INTO services (profissional_id, nome, status, validade_dias, modalidade, preco) VALUES
  ('{PROFESSIONAL_ID}', 'Consulta Presencial',  'ativo',   30,  'presencial', 200.00),
  ('{PROFESSIONAL_ID}', 'Plano Trimestral',     'ativo',   90,  'online',     540.00),
  ('{PROFESSIONAL_ID}', 'Plano Semestral',      'ativo',   180, 'online',    1020.00),
  ('{PROFESSIONAL_ID}', 'Avaliação Online',     'inativo', 1,   'online',     120.00);

-- Clientes (10 ativos, 3 finalizados, 3 inativos)
INSERT INTO clients (profissional_id, nome, whatsapp, email, status, observacao) VALUES
  ('{PROFESSIONAL_ID}', 'Ana Carolina Silva',    '11987654321', 'ana@email.com',       'ativo',     'Treina 4x por semana'),
  ('{PROFESSIONAL_ID}', 'Bruno Ferreira',        '11976543210', 'bruno@email.com',     'ativo',     NULL),
  ('{PROFESSIONAL_ID}', 'Carla Mendes',          '11965432109', 'carla@email.com',     'ativo',     'Hipertensão controlada'),
  ('{PROFESSIONAL_ID}', 'Diego Alves',           '11954321098', 'diego@email.com',     'ativo',     NULL),
  ('{PROFESSIONAL_ID}', 'Eduarda Lopes',         '11943210987', 'edu@email.com',       'ativo',     NULL),
  ('{PROFESSIONAL_ID}', 'Felipe Costa',          '11932109876', 'felipe@email.com',    'ativo',     'Atleta de CrossFit'),
  ('{PROFESSIONAL_ID}', 'Gabriela Rocha',        '11921098765', 'gabi@email.com',      'ativo',     NULL),
  ('{PROFESSIONAL_ID}', 'Henrique Santos',       '11910987654', 'henrique@email.com',  'ativo',     NULL),
  ('{PROFESSIONAL_ID}', 'Isabella Martins',      '11909876543', 'isa@email.com',       'ativo',     'Gestante 20 semanas'),
  ('{PROFESSIONAL_ID}', 'João Paulo Lima',       '11898765432', 'joao@email.com',      'ativo',     NULL),
  ('{PROFESSIONAL_ID}', 'Karina Souza',          '11887654321', 'karina@email.com',    'finalizado','Plano encerrado em abr/26'),
  ('{PROFESSIONAL_ID}', 'Lucas Barbosa',         '11876543210', 'lucas@email.com',     'finalizado',NULL),
  ('{PROFESSIONAL_ID}', 'Mariana Torres',        '11865432109', 'mari@email.com',      'finalizado',NULL),
  ('{PROFESSIONAL_ID}', 'Nicolas Oliveira',      '11854321098', 'nico@email.com',      'inativo',   NULL),
  ('{PROFESSIONAL_ID}', 'Olivia Pereira',        '11843210987', 'oli@email.com',       'inativo',   NULL),
  ('{PROFESSIONAL_ID}', 'Pedro Carvalho',        '11832109876', 'pedro@email.com',     'ativo',     NULL);

-- Questionário 1: Check-in Semanal Nutricional
WITH q AS (
  INSERT INTO questionnaires (profissional_id, nome, status)
  VALUES ('{PROFESSIONAL_ID}', 'Check-in Semanal Nutricional', 'ativo')
  RETURNING id
)
INSERT INTO questions (questionario_id, texto, tipo, ordem, peso_pontuacao)
SELECT q.id, perguntas.texto, perguntas.tipo, perguntas.ordem, 1
FROM q, (VALUES
  ('Como foi a qualidade do seu sono esta semana?',           'escala', 1),
  ('Qual foi sua adesão ao plano alimentar esta semana?',     'escala', 2),
  ('Como está seu funcionamento intestinal?',                 'escala', 3),
  ('Você está mantendo a hidratação diária recomendada?',    'escala', 4),
  ('Apresentou sintomas gastrointestinais (gases, refluxo)?', 'escala', 5),
  ('Como está seu controle de fome e saciedade?',             'escala', 6)
) AS perguntas(texto, tipo, ordem);

-- Opções padrão para as perguntas do Q1
INSERT INTO question_options (question_id, texto, pontuacao)
SELECT q.id, o.texto, o.pontuacao
FROM questions q
JOIN questionnaires qn ON qn.id = q.questionario_id AND qn.nome = 'Check-in Semanal Nutricional'
CROSS JOIN (VALUES ('Ótimo', 4), ('Bom', 3), ('Regular', 2), ('Ruim', 1)) AS o(texto, pontuacao);

-- Questionário 2: Check-in Semanal de Treinos
WITH q AS (
  INSERT INTO questionnaires (profissional_id, nome, status)
  VALUES ('{PROFESSIONAL_ID}', 'Check-in Semanal de Treinos', 'ativo')
  RETURNING id
)
INSERT INTO questions (questionario_id, texto, tipo, ordem, peso_pontuacao)
SELECT q.id, perguntas.texto, perguntas.tipo, perguntas.ordem, 1
FROM q, (VALUES
  ('Quantas vezes treinou esta semana?',                     'escala', 1),
  ('Como foi a intensidade dos seus treinos?',               'escala', 2),
  ('Como está sua recuperação muscular?',                    'escala', 3),
  ('Como foi a qualidade do seu sono esta semana?',          'escala', 4),
  ('Manteve a hidratação adequada durante os treinos?',      'escala', 5),
  ('Como está sua nutrição pré e pós-treino?',               'escala', 6)
) AS perguntas(texto, tipo, ordem);

INSERT INTO question_options (question_id, texto, pontuacao)
SELECT q.id, o.texto, o.pontuacao
FROM questions q
JOIN questionnaires qn ON qn.id = q.questionario_id AND qn.nome = 'Check-in Semanal de Treinos'
CROSS JOIN (VALUES ('Ótimo', 4), ('Bom', 3), ('Regular', 2), ('Ruim', 1)) AS o(texto, pontuacao);
