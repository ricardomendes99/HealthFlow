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
      service_id:      row.service_id ?? undefined,
      finaliza_em,
      data_criacao:    row.created_at.slice(0, 10),
      flag:            row.flag ?? false,
    }
  })
}

export async function addClient(
  profissionalId: string,
  data: { nome: string; whatsapp: string; email: string; observacao?: string; servico?: string; service_id?: string }
): Promise<Client | null> {
  if (!supabase) {
    const novo: Client = {
      id: String(Date.now()), profissional_id: profissionalId,
      nome: data.nome, whatsapp: data.whatsapp, email: data.email,
      observacao: data.observacao, servico: data.servico, service_id: data.service_id,
      status: 'ativo', data_criacao: new Date().toISOString().slice(0, 10), flag: false,
    }
    mockClients.unshift(novo)
    return novo
  }

  const { data: row, error } = await supabase
    .from('clients')
    .insert({
      profissional_id: profissionalId,
      nome: data.nome,
      whatsapp: data.whatsapp,
      email: data.email,
      observacao: data.observacao,
      service_id: data.service_id || null,
    })
    .select('*, services(nome, validade_dias)')
    .single()

  if (error) { console.error('addClient:', error); return null }

  const validade = (row as any).services?.validade_dias
  const finaliza_em = validade
    ? new Date(new Date(row.created_at).getTime() + validade * 86400000).toISOString().slice(0, 10)
    : undefined

  return {
    id: row.id, profissional_id: row.profissional_id,
    nome: row.nome, whatsapp: row.whatsapp ?? '', email: row.email ?? '',
    observacao: row.observacao ?? undefined,
    status: row.status as Client['status'],
    servico: (row as any).services?.nome ?? undefined,
    service_id: row.service_id ?? undefined,
    finaliza_em, data_criacao: row.created_at.slice(0, 10), flag: row.flag ?? false,
  }
}

export async function updateClient(
  id: string,
  data: Partial<Pick<Client, 'nome' | 'whatsapp' | 'email' | 'observacao' | 'servico' | 'service_id' | 'status'>>
): Promise<void> {
  if (!supabase) {
    const c = mockClients.find(c => c.id === id)
    if (c) Object.assign(c, data)
    return
  }
  const { servico: _, ...dbFields } = data
  await supabase.from('clients').update({
    ...dbFields,
    service_id: data.service_id || null,
  }).eq('id', id)
}

export async function deleteClient(id: string): Promise<void> {
  if (!supabase) {
    const idx = mockClients.findIndex(c => c.id === id)
    if (idx >= 0) mockClients.splice(idx, 1)
    return
  }
  await supabase.from('clients').delete().eq('id', id)
}

export async function changeClientStatus(id: string, status: Client['status']): Promise<void> {
  if (!supabase) {
    const c = mockClients.find(c => c.id === id)
    if (c) c.status = status
    return
  }
  await supabase.from('clients').update({ status }).eq('id', id)
}

export async function toggleClientFlag(id: string, flag: boolean): Promise<void> {
  if (!supabase) {
    const c = mockClients.find(c => c.id === id)
    if (c) c.flag = flag
    return
  }
  await supabase.from('clients').update({ flag }).eq('id', id)
}
