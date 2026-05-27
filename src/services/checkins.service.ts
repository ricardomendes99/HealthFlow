import { supabase } from '../lib/supabase'
import { mockCheckIns, progressData } from '../data/mockData'
import type { CheckIn } from '../types'

export async function getCheckIns(profissionalId: string): Promise<CheckIn[]> {
  if (!supabase) return mockCheckIns

  const { data, error } = await supabase
    .from('vw_check_in_comparativo')
    .select('*')
    .eq('profissional_id', profissionalId)
    .order('data_resposta', { ascending: false })
    .limit(50)

  if (error) { console.error('getCheckIns:', error); return [] }

  return data.map(row => ({
    id: row.id, questionario_id: row.questionario_id,
    questionario_nome: row.questionario_nome ?? '',
    cliente_id: row.cliente_id, cliente_nome: row.cliente_nome ?? '',
    data_resposta: row.data_resposta,
    pontuacao_total: row.pontuacao_total,
    pontuacao_percentual: row.pontuacao_percentual,
    comparativo: row.comparativo ?? undefined,
  }))
}

export async function getProgressData(clienteId: string, questionarioId: string) {
  if (!supabase) return progressData

  const { data, error } = await supabase
    .from('check_ins')
    .select('data_resposta, pontuacao_percentual')
    .eq('cliente_id', clienteId)
    .eq('questionario_id', questionarioId)
    .order('data_resposta', { ascending: true })
    .limit(12)

  if (error) return []

  return data.map((row, i) => ({
    semana: `S${i + 1}`,
    pontuacao: row.pontuacao_percentual,
  }))
}

export async function submitCheckIn(
  clienteId: string,
  questionarioId: string,
  answers: Array<{ question_id: string; option_id?: string; resposta_texto?: string; pontuacao: number }>,
  pontuacaoTotal: number,
  pontuacaoPercentual: number
): Promise<string | null> {
  if (!supabase) return 'mock-checkin-' + Date.now()

  const { data: ci, error: ciErr } = await supabase
    .from('check_ins')
    .insert({ cliente_id: clienteId, questionario_id: questionarioId, pontuacao_total: pontuacaoTotal, pontuacao_percentual: pontuacaoPercentual })
    .select()
    .single()

  if (ciErr) { console.error('submitCheckIn:', ciErr); return null }

  await supabase.from('check_in_answers').insert(
    answers.map(a => ({ check_in_id: ci.id, question_id: a.question_id, option_id: a.option_id ?? null, resposta_texto: a.resposta_texto ?? null, pontuacao: a.pontuacao }))
  )

  return ci.id
}
