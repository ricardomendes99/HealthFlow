import { useState, useEffect } from 'react'
import { Bell, Plus, X, Clock, MessageSquare, Mail } from 'lucide-react'
import { getReminders, deleteReminder } from '../../services/reminders.service'
import { useAuth } from '../../context/AuthContext'
import type { Reminder } from '../../types'

const STATUS_MAP: Record<Reminder['status'], { label: string; cls: string }> = {
  pendente: { label: 'Pendente', cls: 'bg-amber-100 text-amber-700' },
  enviado: { label: 'Enviado', cls: 'bg-green-100 text-green-700' },
  falhou: { label: 'Falhou', cls: 'bg-red-100 text-red-700' },
}

const TIPO_MAP: Record<Reminder['tipo'], string> = {
  inicial: 'Envio inicial',
  lembrete: 'Lembrete de resposta',
  vencimento_plano: 'Vencimento de plano',
}

export default function RemindersPage() {
  const { user } = useAuth()
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ cliente_nome: '', questionario_nome: '', data_envio: '', hora_envio: '08:00', tipo: 'inicial', canal: 'whatsapp' })

  useEffect(() => {
    if (!user) return
    getReminders(user.id).then(setReminders)
  }, [user])

  const addReminder = () => {
    if (!form.cliente_nome || !form.data_envio) return
    const r: Reminder = {
      id: String(Date.now()), profissional_id: user?.id ?? '1',
      cliente_id: String(Date.now()), cliente_nome: form.cliente_nome,
      questionario_id: '1', questionario_nome: form.questionario_nome || 'Check-in Semanal',
      data_envio_programada: `${form.data_envio}T${form.hora_envio}:00`,
      tipo: form.tipo as Reminder['tipo'], canal: form.canal as Reminder['canal'],
      status: 'pendente'
    }
    setReminders(prev => [r, ...prev])
    setShowModal(false)
    setForm({ cliente_nome: '', questionario_nome: '', data_envio: '', hora_envio: '08:00', tipo: 'inicial', canal: 'whatsapp' })
  }

  const del = async (id: string) => {
    await deleteReminder(id)
    setReminders(prev => prev.filter(r => r.id !== id))
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }

  const canalIcon = (c: string) => {
    if (c === 'whatsapp') return <MessageSquare className="w-4 h-4 text-green-600" />
    if (c === 'email') return <Mail className="w-4 h-4 text-primary-600" />
    return <><MessageSquare className="w-4 h-4 text-green-600" /><Mail className="w-4 h-4 text-primary-600" /></>
  }

  const stats = {
    pendente: reminders.filter(r => r.status === 'pendente').length,
    enviado: reminders.filter(r => r.status === 'enviado').length,
    falhou: reminders.filter(r => r.status === 'falhou').length,
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Lembretes</h1>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Novo lembrete
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pendentes', val: stats.pendente, cls: 'bg-amber-50 border-amber-200', valCls: 'text-amber-600' },
          { label: 'Enviados', val: stats.enviado, cls: 'bg-green-50 border-green-200', valCls: 'text-green-600' },
          { label: 'Falhou', val: stats.falhou, cls: 'bg-red-50 border-red-200', valCls: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl p-5 ${s.cls}`}>
            <div className={`text-3xl font-black mb-1 ${s.valCls}`}>{s.val}</div>
            <div className="text-sm text-slate-600">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Cliente', 'Questionário', 'Tipo', 'Data e Hora', 'Canal', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reminders.map(r => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{r.cliente_nome}</td>
                <td className="px-4 py-3 text-sm text-slate-500">{r.questionario_nome}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{TIPO_MAP[r.tipo]}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-600">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(r.data_envio_programada)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">{canalIcon(r.canal)}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_MAP[r.status].cls}`}>
                    {STATUS_MAP[r.status].label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => del(r.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Novo lembrete</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Paciente *', key: 'cliente_nome', placeholder: 'Nome do paciente' },
                { label: 'Questionário', key: 'questionario_nome', placeholder: 'Check-in Semanal' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input value={form[f.key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data *</label>
                  <input type="date" value={form.data_envio} onChange={e => setForm(p => ({ ...p, data_envio: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                  <input type="time" value={form.hora_envio} onChange={e => setForm(p => ({ ...p, hora_envio: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <select value={form.tipo} onChange={e => setForm(p => ({ ...p, tipo: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="inicial">Envio inicial</option>
                  <option value="lembrete">Lembrete de resposta</option>
                  <option value="vencimento_plano">Vencimento de plano</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Canal</label>
                <select value={form.canal} onChange={e => setForm(p => ({ ...p, canal: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">E-mail</option>
                  <option value="ambos">WhatsApp + E-mail</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={addReminder} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700">Agendar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
