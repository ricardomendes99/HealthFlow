import { useState, useEffect } from 'react'
import { Briefcase, Plus, Search, Pencil, X, Trash2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getServices, saveService, deleteService as deleteServiceSvc, getFinancialEntries, getChartData } from '../../services/services.service'
import { useAuth } from '../../context/AuthContext'
import { chartData as mockChartData } from '../../data/mockData'
import type { Service, FinancialEntry } from '../../types'

export default function ServicesPage() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [financialEntries, setFinancialEntries] = useState<FinancialEntry[]>([])
  const [chart, setChart] = useState(mockChartData)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ nome: '', validade_dias: '', modalidade: 'online', preco: '', status: 'ativo' })

  useEffect(() => {
    if (!user) return
    getServices(user.id).then(setServices)
    getFinancialEntries(user.id).then(setFinancialEntries)
    getChartData(user.id).then(setChart)
  }, [user])

  const filtered = services.filter(s => !search || s.nome.toLowerCase().includes(search.toLowerCase()))

  const totalPeriod = financialEntries.reduce((a, e) => a + e.valor, 0)
  const totalVendas = services.reduce((a, s) => a + s.vendas, 0)
  const ticketMedio = totalVendas > 0 ? totalPeriod / totalVendas : 0

  const openAdd = () => {
    setEditId(null)
    setForm({ nome: '', validade_dias: '', modalidade: 'online', preco: '', status: 'ativo' })
    setShowModal(true)
  }

  const openEdit = (s: Service) => {
    setEditId(s.id)
    setForm({ nome: s.nome, validade_dias: String(s.validade_dias), modalidade: s.modalidade, preco: String(s.preco), status: s.status })
    setShowModal(true)
  }

  const handleDelete = async (s: Service) => {
    if (!window.confirm(`Excluir o serviço "${s.nome}"? Esta ação não pode ser desfeita.`)) return
    await deleteServiceSvc(s.id)
    setServices(prev => prev.filter(sv => sv.id !== s.id))
  }

  const save = async () => {
    if (!form.nome || !user) return
    const payload = { nome: form.nome, validade_dias: Number(form.validade_dias), preco: Number(form.preco), modalidade: form.modalidade, status: form.status }
    const saved = await saveService(user.id, payload, editId)
    if (saved) {
      if (editId) setServices(prev => prev.map(s => s.id === editId ? { ...s, ...saved } : s))
      else setServices(prev => [saved, ...prev])
    } else {
      if (editId) setServices(prev => prev.map(s => s.id === editId ? { ...s, ...payload, validade_dias: Number(form.validade_dias), preco: Number(form.preco) } as Service : s))
      else setServices(prev => [{ id: String(Date.now()), profissional_id: user.id, vendas: 0, faturamento: 0, data_criacao: new Date().toISOString().slice(0,10), ...payload, status: form.status as 'ativo'|'inativo', modalidade: form.modalidade as 'presencial'|'online' }, ...prev])
    }
    setShowModal(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Serviços</h1>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
          <Plus className="w-4 h-4" /> Adicionar serviço
        </button>
      </div>

      {/* Dashboard financeiro */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Faturamento dos serviços</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Últimos 6 meses</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-primary-50 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Total do período</div>
              <div className="text-xl font-black text-primary-700">R$ {totalPeriod.toLocaleString('pt-BR')}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Vendas</div>
              <div className="text-xl font-black text-slate-800">{totalVendas}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-xs text-slate-500 mb-1">Ticket médio</div>
              <div className="text-xl font-black text-slate-800">R$ {ticketMedio.toFixed(0)}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Faturamento']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Bar dataKey="valor" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Últimas entradas */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-800">Últimas entradas</h2>
            <button className="text-xs text-primary-600 hover:underline">Ver todas</button>
          </div>
          <div className="space-y-3">
            {financialEntries.slice(0, 6).map(e => (
              <div key={e.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-700">{e.cliente_nome}</div>
                  <div className="text-xs text-slate-400">{e.servico_nome}</div>
                </div>
                <div className="text-sm font-bold text-green-600">+R$ {e.valor}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabela de serviços */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar serviço..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {['Nome', 'Status', 'Validade', 'Modalidade', 'Preço', 'Vendas', 'Faturamento', ''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-800">{s.nome}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {s.status === 'ativo' ? '● Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.validade_dias} dias</td>
                <td className="px-4 py-3 text-sm text-slate-600 capitalize">{s.modalidade}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-800">R$ {s.preco}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{s.vendas}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-700">R$ {s.faturamento.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(s)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
              <h2 className="text-lg font-bold text-slate-900">{editId ? 'Editar serviço' : 'Novo serviço'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Nome do serviço *', key: 'nome', type: 'text', placeholder: 'Ex: Plano Trimestral' },
                { label: 'Validade (dias)', key: 'validade_dias', type: 'number', placeholder: '90' },
                { label: 'Preço (R$)', key: 'preco', type: 'number', placeholder: '540' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Modalidade</label>
                <select value={form.modalidade} onChange={e => setForm(prev => ({ ...prev, modalidade: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="online">Online</option>
                  <option value="presencial">Presencial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select value={form.status} onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={save} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
