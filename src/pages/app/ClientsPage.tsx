import { useState, useMemo, useEffect } from 'react'
import { Users, Plus, Search, MessageSquare, Flag, Upload, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { getClients, addClient as addClientSvc, toggleClientFlag } from '../../services/clients.service'
import { useAuth } from '../../context/AuthContext'
import type { Client } from '../../types'

type Tab = 'todos' | 'ativo' | 'finalizado' | 'inativo'

const TABS: { key: Tab; label: string }[] = [
  { key: 'ativo', label: 'Ativos' },
  { key: 'finalizado', label: 'Finalizados' },
  { key: 'inativo', label: 'Inativos' },
  { key: 'todos', label: 'Todos' },
]

const PAGE_SIZE = 15

export default function ClientsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('ativo')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newClient, setNewClient] = useState({ nome: '', whatsapp: '', email: '', observacao: '', servico: '' })

  useEffect(() => {
    if (!user) return
    getClients(user.id).then(data => { setClients(data); setLoading(false) })
  }, [user])

  const filtered = useMemo(() => {
    return clients
      .filter(c => tab === 'todos' || c.status === tab)
      .filter(c => !search || c.nome.toLowerCase().includes(search.toLowerCase()))
  }, [clients, tab, search])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggleFlag = async (id: string) => {
    const c = clients.find(cl => cl.id === id)
    if (!c) return
    await toggleClientFlag(id, !c.flag)
    setClients(prev => prev.map(cl => cl.id === id ? { ...cl, flag: !cl.flag } : cl))
  }

  const addClient = async () => {
    if (!newClient.nome || !user) return
    const added = await addClientSvc(user.id, newClient)
    if (added) setClients(prev => [added, ...prev])
    setNewClient({ nome: '', whatsapp: '', email: '', observacao: '', servico: '' })
    setShowModal(false)
  }

  const statusColor = (s: string) => {
    if (s === 'ativo') return 'bg-green-100 text-green-700'
    if (s === 'finalizado') return 'bg-slate-100 text-slate-600'
    return 'bg-amber-100 text-amber-700'
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Clientes</h1>
            <p className="text-sm text-slate-500">{clients.filter(c => c.status === 'ativo').length} ativos</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" /> Importar
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
            <Plus className="w-4 h-4" /> Adicionar cliente
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-4 gap-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1) }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-500'}`}>
              {clients.filter(c => t.key === 'todos' || c.status === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="Buscar clientes por nome..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Serviço</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Observação</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400 text-sm">Nenhum cliente encontrado</td></tr>
            ) : paginated.map((c, i) => (
              <tr key={c.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xs font-bold flex-shrink-0">
                      {c.nome.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-slate-800">{c.nome}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-slate-500">{c.servico || '—'}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(c.status)}`}>
                    {c.status === 'ativo' ? '● Ativo' : c.status === 'finalizado' ? 'Finalizado' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-slate-500">{c.observacao || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <a href={`https://wa.me/55${c.whatsapp}`} target="_blank" rel="noopener" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="WhatsApp">
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <button onClick={() => toggleFlag(c.id)} className={`p-1.5 rounded-lg transition-colors ${c.flag ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`} title="Flag">
                      <Flag className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-sm text-slate-500">
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
            </span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors">
                Próximo <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Adicionar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Adicionar cliente</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Nome completo *', key: 'nome', placeholder: 'Nome do paciente' },
                { label: 'WhatsApp', key: 'whatsapp', placeholder: '71999990000' },
                { label: 'E-mail', key: 'email', placeholder: 'paciente@email.com' },
                { label: 'Serviço', key: 'servico', placeholder: 'Plano associado' },
                { label: 'Observação', key: 'observacao', placeholder: 'Ex: atleta, vegano...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  <input
                    value={newClient[f.key as keyof typeof newClient]}
                    onChange={e => setNewClient(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={addClient} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700">Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
