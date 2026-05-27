import { supabase } from '../lib/supabase'
import { mockClients, mockQuestionnaires, mockCheckIns } from '../data/mockData'
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
    const stored = localStorage.getItem('hf_user')
    if (stored) {
      const u = JSON.parse(stored)
      const key = `hf_${u.id}_area_cliente`
      const area = localStorage.getItem(key)
      const area_data = area ? JSON.parse(area) : {}
      return {
        id: u.id,
        nome_completo: area_data.nome || u.nome,
        titulo_profissao: area_data.titulo || u.profissao,
        cor_primaria: area_data.corPrimaria || '#2563eb',
        cor_secundaria: area_data.corSecundaria || '#1d4ed8',
        slug,
      }
    }
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
  if (!supabase) {
    return mockQuestionnaires
      .filter(q => q.status === 'ativo' && q.perguntas && q.perguntas.length > 0)
  }

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

export type PatientClient = {
  id: string
  nome: string
  finaliza_em?: string
  recorrencia_tipo?: 'semanal' | 'quinzenal'
  recorrencia_questionario_id?: string
}

export async function getClientByWhatsApp(profissionalId: string, whatsapp: string): Promise<PatientClient | null> {
  const clean = whatsapp.replace(/\D/g, '')

  if (!supabase) {
    const client = mockClients.find(c => c.whatsapp.replace(/\D/g, '') === clean && c.status === 'ativo')
    if (client) return { id: client.id, nome: client.nome, finaliza_em: client.finaliza_em, recorrencia_tipo: client.recorrencia_tipo, recorrencia_questionario_id: client.recorrencia_questionario_id }
    if (clean.length >= 8) {
      const demo = mockClients.find(c => c.status === 'ativo')
      return demo ? { id: demo.id, nome: demo.nome, finaliza_em: demo.finaliza_em } : null
    }
    return null
  }

  const { data, error } = await supabase
    .from('clients')
    .select('id, nome, created_at, service_id, recorrencia_tipo, recorrencia_questionario_id, services(validade_dias)')
    .eq('profissional_id', profissionalId)
    .eq('whatsapp', clean)
    .eq('status', 'ativo')
    .maybeSingle()

  if (error || !data) return null

  const validade = (data as any).services?.validade_dias
  const finaliza_em = validade
    ? new Date(new Date((data as any).created_at).getTime() + validade * 86400000).toISOString().slice(0, 10)
    : undefined

  return {
    id: data.id,
    nome: data.nome,
    finaliza_em,
    recorrencia_tipo: data.recorrencia_tipo ?? undefined,
    recorrencia_questionario_id: data.recorrencia_questionario_id ?? undefined,
  }
}

export async function getClientCheckInHistory(clienteId: string) {
  if (!supabase) {
    return mockCheckIns.filter(c => c.cliente_id === clienteId)
  }

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
