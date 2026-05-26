-- ============================================================
-- HealthFlow — Storage bucket para imagens de profissionais
-- Execute no SQL Editor do Supabase após schema.sql
-- ============================================================

-- Cria o bucket "professionals" (público para leitura)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'professionals',
  'professionals',
  true,
  8388608, -- 8 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 8388608,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Política: profissional autenticado pode fazer upload no seu próprio diretório
CREATE POLICY "Profissional faz upload das próprias imagens"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'professionals'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: profissional pode atualizar (upsert) suas imagens
CREATE POLICY "Profissional atualiza próprias imagens"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'professionals'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: profissional pode deletar suas imagens
CREATE POLICY "Profissional deleta próprias imagens"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'professionals'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Política: qualquer pessoa pode ler imagens (bucket público)
CREATE POLICY "Leitura pública das imagens"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'professionals');
