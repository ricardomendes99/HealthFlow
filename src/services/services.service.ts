import { supabase } from '../lib/supabase'
import { mockServices, chartData, mockFinancialEntries } from '../data/mockData'
import type { Service, FinancialEntry } from '../types'

export async function getServices(profissionalId: string): Promise<Service[]> {
  if (!supabase) return mockServices

  const { data, error } = await supabase
    .from('vw_services_stats')
    .select('*')
    .eq('profissional_id', profissionalId)
    .order('created_at', { ascending: false })

  if (error) { console.error('getServices:', error); return mockServices }

  return data.map(row => ({
    id: row.id, profissional_id: row.profissional_id,
    nome: row.nome, status: row.status as Service['status'],
    validade_dias: row.validade_dias, modalidade: row.modalidade as Service['modalidade'],
    preco: Number(row.preco), vendas: Number(row.vendas), faturamento: Number(row.faturamento),
    data_criacao: row.created_at?.slice(0, 10) ?? '',
  }))
}

export async function saveService(
  profissionalId: string,
  form: { nome: string; validade_dias: number; preco: number; modalidade: string; status: string },
  editId?: string | null
): Promise<Service | null> {
  if (!supabase) return null

  const payload = {
    profissional_id: profissionalId,
    nome: form.nome, validade_dias: form.validade_dias, preco: form.preco,
    modalidade: form.modalidade, status: form.status,
  }

  if (editId) {
    const { data, error } = await supabase.from('services').update(payload).eq('id', editId).select().single()
    if (error) { console.error('saveService update:', error); return null }
    return { ...data, vendas: 0, faturamento: 0, data_criacao: data.created_at.slice(0, 10) } as Service
  }

  const { data, error } = await supabase.from('services').insert(payload).select().single()
  if (error) { console.error('saveService insert:', error); return null }
  return { ...data, vendas: 0, faturamento: 0, data_criacao: data.created_at.slice(0, 10) } as Service
}

export async function getChartData(profissionalId: string) {
  if (!supabase) return chartData

  const { data, error } = await supabase.rpc('get_monthly_revenue', { p_profissional_id: profissionalId })
  if (error) return chartData
  return data ?? chartData
}

export async function getFinancialEntries(profissionalId: string): Promise<FinancialEntry[]> {
  if (!supabase) return mockFinancialEntries

  const { data, error } = await supabase
    .from('financial_entries')
    .select('*, clients(nome), services(nome)')
    .eq('profissional_id', profissionalId)
    .order('data', { ascending: false })
    .limit(20)

  if (error) { console.error('getFinancialEntries:', error); return mockFinancialEntries }

  return data.map(row => ({
    id: row.id, profissional_id: row.profissional_id,
    cliente_nome: row.clients?.nome ?? '', servico_nome: row.services?.nome ?? '',
    valor: Number(row.valor), data: row.data,
  }))
}
