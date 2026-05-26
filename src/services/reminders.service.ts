import { supabase } from '../lib/supabase'
import { mockReminders } from '../data/mockData'
import type { Reminder } from '../types'

export async function getReminders(profissionalId: string): Promise<Reminder[]> {
  if (!supabase) return mockReminders

  const { data, error } = await supabase
    .from('reminders')
    .select('*, clients(nome), questionnaires(nome)')
    .eq('profissional_id', profissionalId)
    .order('data_envio_programada', { ascending: false })

  if (error) { console.error('getReminders:', error); return mockReminders }

  return data.map(row => ({
    id: row.id, profissional_id: row.profissional_id,
    cliente_id: row.cliente_id, cliente_nome: row.clients?.nome ?? '',
    questionario_id: row.questionario_id, questionario_nome: row.questionnaires?.nome ?? '',
    data_envio_programada: row.data_envio_programada,
    tipo: row.tipo as Reminder['tipo'],
    canal: row.canal as Reminder['canal'],
    status: row.status as Reminder['status'],
  }))
}

export async function addReminder(
  profissionalId: string,
  form: { cliente_id: string; questionario_id: string; data_envio_programada: string; tipo: string; canal: string }
): Promise<void> {
  if (!supabase) return

  await supabase.from('reminders').insert({
    profissional_id: profissionalId,
    cliente_id: form.cliente_id,
    questionario_id: form.questionario_id,
    data_envio_programada: form.data_envio_programada,
    tipo: form.tipo,
    canal: form.canal,
    status: 'pendente',
  })
}

export async function deleteReminder(id: string): Promise<void> {
  if (!supabase) return
  await supabase.from('reminders').delete().eq('id', id)
}
