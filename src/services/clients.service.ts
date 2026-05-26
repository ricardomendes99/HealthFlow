import { supabase } from '../lib/supabase'
import { mockClients } from '../data/mockData'
import type { Client } from '../types'

export async function getClients(profissionalId: string): Promise<Client[]> {
  if (!supabase) return mockClients

  const { data, error } = await supabase
    .from('clients')
    .select('*, services(nome, validade_dias)')
    .eq('profissional_id', profissionalId)
    .order('nome')

  if (error) { console.error('getClients:', error); return [] }

  return data.map(row => {
    const validade = row.services?.validade_dias
    const finaliza_em = validade
      ? new Date(new Date(row.created_at).getTime() + validade * 86400000).toISOString().slice(0, 10)
      : undefined
    return {
      id:              row.id,
      profissional_id: row.profissional_id,
      nome:            row.nome,
      whatsapp:        row.whatsapp ?? '',
      email:           row.email ?? '',
      observacao:      row.observacao ?? undefined,
      status:          row.status as Client['status'],
      servico:         row.services?.nome ?? undefined,
      finaliza_em,
      data_criacao:    row.created_at.slice(0, 10),
      flag:            row.flag ?? false,
    }
  })
}

export async function addClient(
  profissionalId: string,
  data: { nome: string; whatsapp: string; email: string; observacao?: string; servico?: string }
): Promise<Client | null> {
  if (!supabase) {
    const novo: Client = {
      id: String(Date.now()), profissional_id: profissionalId,
      nome: data.nome, whatsapp: data.whatsapp, email: data.email,
      observacao: data.observacao, servico: data.servico,
      status: 'ativo', data_criacao: new Date().toISOString().slice(0, 10), flag: false,
    }
    mockClients.unshift(novo)
    return novo
  }

  const { data: row, error } = await supabase
    .from('clients')
    .insert({ profissional_id: profissionalId, nome: data.nome, whatsapp: data.whatsapp, email: data.email, observacao: data.observacao })
    .select()
    .single()

  if (error) { console.error('addClient:', error); return null }
  return { ...row, servico: data.servico, data_criacao: row.created_at.slice(0, 10) }
}

export async function toggleClientFlag(id: string, flag: boolean): Promise<void> {
  if (!supabase) {
    const c = mockClients.find(c => c.id === id)
    if (c) c.flag = flag
    return
  }
  await supabase.from('clients').update({ flag }).eq('id', id)
}
