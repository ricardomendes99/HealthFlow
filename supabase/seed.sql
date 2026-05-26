-- ============================================================
-- HealthFlow — Seed Data (dados de exemplo)
-- Execute APÓS schema.sql + rls.sql
-- Pré-requisito: ter ao menos 1 usuário criado no Supabase Auth
--   (crie via Dashboard → Authentication → Users → Add User)
-- ============================================================

DO $$
DECLARE
  prof_id   UUID;
  svc1_id   UUID;
  q1_id     UUID;
  q2_id     UUID;
BEGIN

  -- Busca o primeiro usuário autenticado existente
  SELECT id INTO prof_id FROM auth.users ORDER BY created_at LIMIT 1;

  IF prof_id IS NULL THEN
    RAISE EXCEPTION
      'Nenhum usuário encontrado em auth.users. '
      'Crie um usuário em: Dashboard → Authentication → Users → Add User. '
      'Depois execute este seed novamente.';
  END IF;

  RAISE NOTICE 'Usando professional_id: %', prof_id;

  -- --------------------------------------------------------
  -- Profissional
  -- --------------------------------------------------------
  INSERT INTO professionals (
    id, nome_completo, email, celular_whatsapp,
    profissao, slug, titulo_profissao,
    cor_primaria, cor_secundaria, plano_assinatura
  ) VALUES (
    prof_id,
    'Dr. Ricardo Junin',
    'uruhara777@gmail.com',
    '11999999999',
    'Nutricionista',
    'dr-ricardo-junin',
    'Nutricionista Esportivo',
    '#2563eb',
    '#1d4ed8',
    'mensal'
  ) ON CONFLICT (id) DO NOTHING;

  -- --------------------------------------------------------
  -- Serviços
  -- --------------------------------------------------------
  INSERT INTO services (profissional_id, nome, status, validade_dias, modalidade, preco)
  VALUES
    (prof_id, 'Consulta Presencial', 'ativo',   30,  'presencial', 200.00),
    (prof_id, 'Plano Trimestral',    'ativo',   90,  'online',     540.00),
    (prof_id, 'Plano Semestral',     'ativo',   180, 'online',    1020.00),
    (prof_id, 'Avaliação Online',    'inativo', 1,   'online',     120.00);

  -- ID do primeiro serviço para vincular clientes
  SELECT id INTO svc1_id FROM services WHERE profissional_id = prof_id AND nome = 'Plano Trimestral';

  -- --------------------------------------------------------
  -- Clientes (10 ativos, 3 finalizados, 3 inativos)
  -- --------------------------------------------------------
  INSERT INTO clients (profissional_id, service_id, nome, whatsapp, email, status, observacao)
  VALUES
    (prof_id, svc1_id, 'Ana Carolina Silva',  '11987654321', 'ana@email.com',      'ativo',     'Treina 4x por semana'),
    (prof_id, svc1_id, 'Bruno Ferreira',      '11976543210', 'bruno@email.com',    'ativo',     NULL),
    (prof_id, svc1_id, 'Carla Mendes',        '11965432109', 'carla@email.com',    'ativo',     'Hipertensão controlada'),
    (prof_id, svc1_id, 'Diego Alves',         '11954321098', 'diego@email.com',    'ativo',     NULL),
    (prof_id, svc1_id, 'Eduarda Lopes',       '11943210987', 'edu@email.com',      'ativo',     NULL),
    (prof_id, svc1_id, 'Felipe Costa',        '11932109876', 'felipe@email.com',   'ativo',     'Atleta de CrossFit'),
    (prof_id, svc1_id, 'Gabriela Rocha',      '11921098765', 'gabi@email.com',     'ativo',     NULL),
    (prof_id, svc1_id, 'Henrique Santos',     '11910987654', 'henrique@email.com', 'ativo',     NULL),
    (prof_id, svc1_id, 'Isabella Martins',    '11909876543', 'isa@email.com',      'ativo',     'Gestante 20 semanas'),
    (prof_id, svc1_id, 'João Paulo Lima',     '11898765432', 'joao@email.com',     'ativo',     NULL),
    (prof_id, NULL,    'Karina Souza',        '11887654321', 'karina@email.com',   'finalizado','Plano encerrado em abr/26'),
    (prof_id, NULL,    'Lucas Barbosa',       '11876543210', 'lucas@email.com',    'finalizado', NULL),
    (prof_id, NULL,    'Mariana Torres',      '11865432109', 'mari@email.com',     'finalizado', NULL),
    (prof_id, NULL,    'Nicolas Oliveira',    '11854321098', 'nico@email.com',     'inativo',   NULL),
    (prof_id, NULL,    'Olivia Pereira',      '11843210987', 'oli@email.com',      'inativo',   NULL),
    (prof_id, svc1_id, 'Pedro Carvalho',      '11832109876', 'pedro@email.com',    'ativo',     NULL);

  -- --------------------------------------------------------
  -- Questionário 1: Check-in Semanal Nutricional
  -- --------------------------------------------------------
  INSERT INTO questionnaires (profissional_id, nome, status)
  VALUES (prof_id, 'Check-in Semanal Nutricional', 'ativo')
  RETURNING id INTO q1_id;

  INSERT INTO questions (questionario_id, texto, tipo, ordem, peso_pontuacao)
  VALUES
    (q1_id, 'Como foi a qualidade do seu sono esta semana?',            'escala', 1, 1),
    (q1_id, 'Qual foi sua adesão ao plano alimentar esta semana?',      'escala', 2, 1),
    (q1_id, 'Como está seu funcionamento intestinal?',                  'escala', 3, 1),
    (q1_id, 'Você está mantendo a hidratação diária recomendada?',     'escala', 4, 1),
    (q1_id, 'Apresentou sintomas gastrointestinais (gases, refluxo)?', 'escala', 5, 1),
    (q1_id, 'Como está seu controle de fome e saciedade?',              'escala', 6, 1);

  INSERT INTO question_options (question_id, texto, pontuacao)
  SELECT q.id, o.texto, o.pontuacao
  FROM questions q
  CROSS JOIN (VALUES ('Ótimo', 4), ('Bom', 3), ('Regular', 2), ('Ruim', 1)) AS o(texto, pontuacao)
  WHERE q.questionario_id = q1_id;

  -- --------------------------------------------------------
  -- Questionário 2: Check-in Semanal de Treinos
  -- --------------------------------------------------------
  INSERT INTO questionnaires (profissional_id, nome, status)
  VALUES (prof_id, 'Check-in Semanal de Treinos', 'ativo')
  RETURNING id INTO q2_id;

  INSERT INTO questions (questionario_id, texto, tipo, ordem, peso_pontuacao)
  VALUES
    (q2_id, 'Quantas vezes treinou esta semana?',                  'escala', 1, 1),
    (q2_id, 'Como foi a intensidade dos seus treinos?',            'escala', 2, 1),
    (q2_id, 'Como está sua recuperação muscular?',                 'escala', 3, 1),
    (q2_id, 'Como foi a qualidade do seu sono esta semana?',       'escala', 4, 1),
    (q2_id, 'Manteve a hidratação adequada durante os treinos?',   'escala', 5, 1),
    (q2_id, 'Como está sua nutrição pré e pós-treino?',            'escala', 6, 1);

  INSERT INTO question_options (question_id, texto, pontuacao)
  SELECT q.id, o.texto, o.pontuacao
  FROM questions q
  CROSS JOIN (VALUES ('Ótimo', 4), ('Bom', 3), ('Regular', 2), ('Ruim', 1)) AS o(texto, pontuacao)
  WHERE q.questionario_id = q2_id;

  RAISE NOTICE 'Seed concluído com sucesso para professional_id: %', prof_id;

END $$;
