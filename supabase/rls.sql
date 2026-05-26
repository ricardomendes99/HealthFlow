-- ============================================================
-- HealthFlow — Row Level Security (RLS)
-- Execute APÓS schema.sql
-- ============================================================
-- Modelo de segurança:
--   • Profissional autenticado acessa somente seus próprios dados
--   • Área do paciente (/p/:slug) usa acesso anônimo controlado
--   • auth.uid() = id do profissional logado via Supabase Auth
-- ============================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE professionals      ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients            ENABLE ROW LEVEL SECURITY;
ALTER TABLE services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaires     ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options   ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins          ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_answers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- professionals
-- ============================================================
CREATE POLICY "professionals: leitura própria"
  ON professionals FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "professionals: inserção pelo próprio usuário"
  ON professionals FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "professionals: atualização própria"
  ON professionals FOR UPDATE
  USING (id = auth.uid());

-- Leitura pública do slug (área do paciente — sem login)
CREATE POLICY "professionals: leitura pública por slug"
  ON professionals FOR SELECT
  TO anon
  USING (true);  -- filtrado por slug na query, não aqui

-- ============================================================
-- clients
-- ============================================================
CREATE POLICY "clients: acesso do profissional"
  ON clients FOR ALL
  USING (profissional_id = auth.uid())
  WITH CHECK (profissional_id = auth.uid());

-- ============================================================
-- services
-- ============================================================
CREATE POLICY "services: acesso do profissional"
  ON services FOR ALL
  USING (profissional_id = auth.uid())
  WITH CHECK (profissional_id = auth.uid());

-- ============================================================
-- questionnaires
-- ============================================================
CREATE POLICY "questionnaires: acesso do profissional"
  ON questionnaires FOR ALL
  USING (profissional_id = auth.uid())
  WITH CHECK (profissional_id = auth.uid());

-- Paciente pode ler questionários ativos do seu profissional
CREATE POLICY "questionnaires: leitura pública (ativos)"
  ON questionnaires FOR SELECT
  TO anon
  USING (status = 'ativo');

-- ============================================================
-- questions
-- ============================================================
CREATE POLICY "questions: acesso via questionário do profissional"
  ON questions FOR ALL
  USING (
    questionario_id IN (
      SELECT id FROM questionnaires WHERE profissional_id = auth.uid()
    )
  );

CREATE POLICY "questions: leitura pública"
  ON questions FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- question_options
-- ============================================================
CREATE POLICY "question_options: acesso via questionário do profissional"
  ON question_options FOR ALL
  USING (
    question_id IN (
      SELECT q.id FROM questions q
      JOIN questionnaires qn ON qn.id = q.questionario_id
      WHERE qn.profissional_id = auth.uid()
    )
  );

CREATE POLICY "question_options: leitura pública"
  ON question_options FOR SELECT
  TO anon
  USING (true);

-- ============================================================
-- check_ins
-- ============================================================
CREATE POLICY "check_ins: profissional lê seus check-ins"
  ON check_ins FOR SELECT
  USING (
    cliente_id IN (
      SELECT id FROM clients WHERE profissional_id = auth.uid()
    )
  );

-- Paciente pode inserir check-in (área pública)
CREATE POLICY "check_ins: inserção pública pelo paciente"
  ON check_ins FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================
-- check_in_answers
-- ============================================================
CREATE POLICY "answers: profissional lê respostas"
  ON check_in_answers FOR SELECT
  USING (
    check_in_id IN (
      SELECT ci.id FROM check_ins ci
      JOIN clients c ON c.id = ci.cliente_id
      WHERE c.profissional_id = auth.uid()
    )
  );

CREATE POLICY "answers: inserção pública pelo paciente"
  ON check_in_answers FOR INSERT
  TO anon
  WITH CHECK (true);

-- ============================================================
-- reminders
-- ============================================================
CREATE POLICY "reminders: acesso do profissional"
  ON reminders FOR ALL
  USING (profissional_id = auth.uid())
  WITH CHECK (profissional_id = auth.uid());

-- ============================================================
-- financial_entries
-- ============================================================
CREATE POLICY "financial: acesso do profissional"
  ON financial_entries FOR ALL
  USING (profissional_id = auth.uid())
  WITH CHECK (profissional_id = auth.uid());
