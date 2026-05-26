import { supabase } from '../lib/supabase'
import type { Questionnaire } from '../types'

export interface ProfessionalPublic {
  id: string
  nome_completo: string
  titulo_profissao: string
  foto_perfil?: string
  cor_primaria: string
  cor_secundaria: string
  slug: string
}

export async function getProfessionalBySlug(slug: string): Promise<ProfessionalPublic | null> {
  if (!supabase) {
    return {
      id: '1', nome_completo: 'Dr. Ricardo Junin', titulo_profissao: 'Nutricionista',
      cor_primaria: '#2563eb', cor_secundaria: '#1d4ed8', slug,
    }
  }

  const { data, error } = await supabase
    .from('professionals')
    .select('id, nome_completo, titulo_profissao, foto_perfil, cor_primaria, cor_secundaria, slug')
    .eq('slug', slug)
    .single()

  if (error) { console.error('getProfessionalBySlug:', error); return null }
  return data
}

export async function getActiveQuestionnaires(profissionalId: string): Promise<Questionnaire[]> {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('questionnaires')
    .select(`
      *,
      questions (
        id, texto, tipo, ordem, peso_pontuacao,
        question_options ( id, texto, pontuacao )
      )
    `)
    .eq('profissional_id', profissionalId)
    .eq('status', 'ativo')
    .order('created_at', { ascending: false })

  if (error) { console.error('getActiveQuestionnaires:', error); return [] }

  return data.map(row => ({
    id: row.id, profissional_id: row.profissional_id,
    nome: row.nome, status: 'ativo' as const,
    total_perguntas: row.questions?.length ?? 0,
    data_criacao: row.created_at.slice(0, 10),
    perguntas: row.questions
      ?.sort((a: any, b: any) => a.ordem - b.ordem)
      .map((q: any) => ({
        id: q.id, questionario_id: row.id, texto: q.texto,
        tipo: q.tipo, ordem: q.ordem, peso_pontuacao: q.peso_pontuacao,
        opcoes: q.question_options ?? [],
      })),
  }))
}

export async function getClientByWhatsApp(profissionalId: string, whatsapp: string): Promise<{ id: string; nome: string } | null> {
  if (!supabase) return null

  const clean = whatsapp.replace(/\D/g, '')
  const { data, error } = await supabase
    .from('clients')
    .select('id, nome')
    .eq('profissional_id', profissionalId)
    .eq('whatsapp', clean)
    .eq('status', 'ativo')
    .maybeSingle()

  if (error || !data) return null
  return data
}

export async function getClientCheckInHistory(clienteId: string) {
  if (!supabase) return []

  const { data, error } = await supabase
    .from('check_ins')
    .select('*, questionnaires(nome)')
    .eq('cliente_id', clienteId)
    .order('data_resposta', { ascending: false })
    .limit(20)

  if (error) return []

  return data.map(row => ({
    id: row.id, questionario_id: row.questionario_id,
    questionario_nome: row.questionnaires?.nome ?? '',
    cliente_id: clienteId, cliente_nome: '',
    data_resposta: row.data_resposta,
    pontuacao_total: row.pontuacao_total,
    pontuacao_percentual: row.pontuacao_percentual,
  }))
}
