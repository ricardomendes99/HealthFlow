import { supabase } from '../lib/supabase'
import { mockQuestionnaires } from '../data/mockData'
import type { Questionnaire, Question } from '../types'

export async function getQuestionnaires(profissionalId: string): Promise<Questionnaire[]> {
  if (!supabase) return mockQuestionnaires

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
    .order('created_at', { ascending: false })

  if (error) { console.error('getQuestionnaires:', error); return [] }

  return data.map(row => ({
    id: row.id, profissional_id: row.profissional_id,
    nome: row.nome, status: row.status as Questionnaire['status'],
    total_perguntas: row.questions?.length ?? 0,
    data_criacao: row.created_at.slice(0, 10),
    perguntas: row.questions
      ?.sort((a: Question, b: Question) => a.ordem - b.ordem)
      .map((q: any) => ({
        id: q.id, questionario_id: row.id, texto: q.texto,
        tipo: q.tipo, ordem: q.ordem, peso_pontuacao: q.peso_pontuacao,
        opcoes: q.question_options ?? [],
      })),
  }))
}

export async function saveQuestionnaire(
  profissionalId: string,
  nome: string,
  status: string,
  perguntas: Omit<Question, 'id' | 'questionario_id'>[],
  editId?: string | null
): Promise<Questionnaire | null> {
  if (!supabase) return null

  let questionarioId = editId

  if (editId) {
    await supabase.from('questionnaires').update({ nome, status }).eq('id', editId)
    // Remove perguntas antigas e re-insere
    await supabase.from('questions').delete().eq('questionario_id', editId)
  } else {
    const { data, error } = await supabase
      .from('questionnaires')
      .insert({ profissional_id: profissionalId, nome, status })
      .select()
      .single()
    if (error) { console.error('saveQuestionnaire:', error); return null }
    questionarioId = data.id
  }

  for (const p of perguntas) {
    const { data: qRow } = await supabase
      .from('questions')
      .insert({ questionario_id: questionarioId, texto: p.texto, tipo: p.tipo, ordem: p.ordem, peso_pontuacao: p.peso_pontuacao })
      .select()
      .single()

    if (qRow && p.opcoes && p.opcoes.length > 0) {
      await supabase.from('question_options').insert(
        p.opcoes.map(o => ({ question_id: qRow.id, texto: o.texto, pontuacao: o.pontuacao }))
      )
    }
  }

  return getQuestionnaires(profissionalId).then(list => list.find(q => q.id === questionarioId) ?? null)
}

export async function deleteQuestionnaire(id: string): Promise<void> {
  if (!supabase) return
  await supabase.from('questionnaires').delete().eq('id', id)
}
