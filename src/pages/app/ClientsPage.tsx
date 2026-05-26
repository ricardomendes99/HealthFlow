import { useState, useMemo, useEffect, useRef } from 'react'
import { Users, Plus, Search, MessageSquare, Flag, Upload, ChevronLeft, ChevronRight, X, FileText, CheckCircle, AlertCircle, Pencil, Trash2 } from 'lucide-react'
import { getClients, addClient as addClientSvc, updateClient as updateClientSvc, deleteClient as deleteClientSvc, changeClientStatus, toggleClientFlag } from '../../services/clients.service'
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

type ImportStatus = { imported: number; failed: number; errors: string[] } | null

const EMPTY_FORM = { nome: '', whatsapp: '', email: '', observacao: '', servico: '', status: 'ativo' as Client['status'] }

export default function ClientsPage() {
  const { user } = useAuth()
  const [tab, setTab] = useState<Tab>('ativo')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importStatus, setImportStatus] = useState<ImportStatus>(null)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [addForm, setAddForm] = useState(EMPTY_FORM)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

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

  const handleAdd = async () => {
    if (!addForm.nome || !user) return
    setFormError('')
    setSaving(true)
    const added = await addClientSvc(user.id, addForm)
    setSaving(false)
    if (added) {
      setClients(prev => [added, ...prev])
      setAddForm(EMPTY_FORM)
      setShowAddModal(false)
    } else {
      setFormError('Erro ao salvar cliente. Verifique a conexão com o banco.')
    }
  }

  const openEdit = (c: Client) => {
    setEditingClient(c)
    setEditForm({ nome: c.nome, whatsapp: c.whatsapp || '', email: c.email || '', observacao: c.observacao || '', servico: c.servico || '', status: c.status })
    setFormError('')
    setShowEditModal(true)
  }

  const handleEdit = async () => {
    if (!editingClient || !editForm.nome) return
    setFormError('')
    setSaving(true)
    await updateClientSvc(editingClient.id, editForm)
    if (editForm.status !== editingClient.status) {
      await changeClientStatus(editingClient.id, editForm.status)
    }
    setSaving(false)
    setClients(prev => prev.map(c => c.id === editingClient.id ? { ...c, ...editForm } : c))
    setShowEditModal(false)
    setEditingClient(null)
  }

  const handleDelete = async (c: Client) => {
    if (!window.confirm(`Excluir o cliente "${c.nome}"? Esta ação não pode ser desfeita.`)) return
    await deleteClientSvc(c.id)
    setClients(prev => prev.filter(cl => cl.id !== c.id))
  }

  const handleImportCSV = async (file: File) => {
    if (!user) return
    setImporting(true)
    setImportStatus(null)
    const text = await file.text()
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length < 2) { setImporting(false); setImportStatus({ imported: 0, failed: 0, errors: ['Arquivo vazio ou sem dados'] }); return }
    const sep = lines[0].includes(';') ? ';' : ','
    const headers = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/['"]/g, ''))
    const idx = (names: string[]) => names.reduce((found, n) => found >= 0 ? found : headers.indexOf(n), -1)
    const nomeIdx = idx(['nome', 'name', 'paciente', 'cliente'])
    const wppIdx = idx(['whatsapp', 'celular', 'telefone', 'fone', 'phone'])
    const emailIdx = idx(['email', 'e-mail'])
    const obsIdx = idx(['observacao', 'observação', 'obs', 'nota'])
    if (nomeIdx < 0) { setImporting(false); setImportStatus({ imported: 0, failed: 0, errors: ['Coluna "nome" não encontrada. Use: nome, paciente ou cliente'] }); return }
    let imported = 0, failed = 0
    const errors: string[] = []
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''))
      const nome = cols[nomeIdx] ?? ''
      if (!nome) { failed++; continue }
      const added = await addClientSvc(user.id, {
        nome,
        whatsapp: wppIdx >= 0 ? (cols[wppIdx] ?? '') : '',
        email: emailIdx >= 0 ? (cols[emailIdx] ?? '') : '',
        observacao: obsIdx >= 0 ? (cols[obsIdx] ?? '') : '',
      })
      if (added) { imported++; setClients(prev => [added, ...prev]) }
      else { failed++; errors.push(`Linha ${i + 1}: ${nome}`) }
    }
    setImporting(false)
    setImportStatus({ imported, failed, errors })
  }

  const statusColor = (s: string) => {
    if (s === 'ativo') return 'bg-green-100 text-green-700'
    if (s === 'finalizado') return 'bg-slate-100 text-slate-600'
    return 'bg-amber-100 text-amber-700'
  }

  const expirationInfo = (finaliza_em?: string) => {
    if (!finaliza_em) return null
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0)
    const fim = new Date(finaliza_em + 'T00:00:00')
    const dias = Math.ceil((fim.getTime() - hoje.getTime()) / 86400000)
    const label = fim.toLocaleDateString('pt-BR')
    if (dias < 0) return { label, cls: 'text-red-600 bg-red-50', tip: 'Vencido' }
    if (dias <= 7) return { label, cls: 'text-amber-600 bg-amber-50', tip: `Vence em ${dias}d` }
    return { label, cls: 'text-slate-600 bg-slate-50', tip: `${dias} dias restantes` }
  }

  const ClientFormFields = ({ form, setForm }: { form: typeof EMPTY_FORM; setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>> }) => (
    <div className="p-6 space-y-4">
      {([
        { label: 'Nome completo *', key: 'nome', placeholder: 'Nome do paciente' },
        { label: 'WhatsApp', key: 'whatsapp', placeholder: '71999990000' },
        { label: 'E-mail', key: 'email', placeholder: 'paciente@email.com' },
        { label: 'Serviço', key: 'servico', placeholder: 'Plano associado' },
        { label: 'Observação', key: 'observacao', placeholder: 'Ex: atleta, vegano...' },
      ] as const).map(f => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
          <input
            value={form[f.key as keyof typeof form] as string}
            onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
        <select
          value={form.status}
          onChange={e => setForm(prev => ({ ...prev, status: e.target.value as Client['status'] }))}
          className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        >
          <option value="ativo">Ativo</option>
          <option value="finalizado">Finalizado</option>
          <option value="inativo">Inativo</option>
        </select>
      </div>
    </div>
  )

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
          <button onClick={() => { setShowImport(true); setImportStatus(null) }} className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" /> Importar
          </button>
          <button onClick={() => { setAddForm(EMPTY_FORM); setFormError(''); setShowAddModal(true) }} className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Finaliza em</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Observação</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">Carregando...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-slate-400 text-sm">Nenhum cliente encontrado</td></tr>
            ) : paginated.map(c => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
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
                <td className="px-4 py-3 hidden lg:table-cell">
                  {(() => {
                    const exp = expirationInfo(c.finaliza_em)
                    if (!exp) return <span className="text-sm text-slate-400">—</span>
                    return (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${exp.cls}`} title={exp.tip}>
                        {exp.label}
                      </span>
                    )
                  })()}
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor(c.status)}`}>
                    {c.status === 'ativo' ? '● Ativo' : c.status === 'finalizado' ? 'Finalizado' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-sm text-slate-500">{c.observacao || '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <a href={`https://wa.me/55${c.whatsapp}`} target="_blank" rel="noopener" className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="WhatsApp">
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <button onClick={() => toggleFlag(c.id)} className={`p-1.5 rounded-lg transition-colors ${c.flag ? 'text-red-500 bg-red-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`} title="Flag">
                      <Flag className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Editar">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(c)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4" />
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

      {/* Modal Importar */}
      {showImport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Importar clientes</h2>
              <button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-1">
                <p className="font-medium text-slate-700 mb-2">Formato do arquivo CSV:</p>
                <p>• Colunas aceitas: <span className="font-mono text-xs bg-slate-200 px-1 rounded">nome</span>, <span className="font-mono text-xs bg-slate-200 px-1 rounded">whatsapp</span>, <span className="font-mono text-xs bg-slate-200 px-1 rounded">email</span>, <span className="font-mono text-xs bg-slate-200 px-1 rounded">observacao</span></p>
                <p>• Separador: vírgula (,) ou ponto-e-vírgula (;)</p>
                <p>• Primeira linha deve ser o cabeçalho</p>
                <p className="font-mono text-xs mt-2 bg-slate-200 p-2 rounded">nome;whatsapp;email<br/>João Silva;11999990000;joao@email.com</p>
              </div>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-600">Clique para selecionar o arquivo CSV</p>
                <p className="text-xs text-slate-400 mt-1">ou arraste e solte aqui</p>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImportCSV(f) }}
                />
              </div>
              {importing && (
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  Importando clientes...
                </div>
              )}
              {importStatus && (
                <div className="space-y-2">
                  {importStatus.imported > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-xl p-3">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      {importStatus.imported} cliente{importStatus.imported !== 1 ? 's' : ''} importado{importStatus.imported !== 1 ? 's' : ''} com sucesso
                    </div>
                  )}
                  {importStatus.failed > 0 && (
                    <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-xl p-3">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div>
                        <p>{importStatus.failed} linha{importStatus.failed !== 1 ? 's' : ''} com erro</p>
                        {importStatus.errors.slice(0, 3).map((e, i) => <p key={i} className="text-xs opacity-75">{e}</p>)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowImport(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">
                {importStatus ? 'Fechar' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Adicionar cliente</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <ClientFormFields form={addForm} setForm={setAddForm} />
            {formError && (
              <p className="mx-6 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{formError}</p>
            )}
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => { setShowAddModal(false); setFormError('') }} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={handleAdd} disabled={saving || !addForm.nome} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50">
                {saving ? 'Salvando...' : 'Adicionar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && editingClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Editar cliente</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <ClientFormFields form={editForm} setForm={setEditForm} />
            {formError && (
              <p className="mx-6 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{formError}</p>
            )}
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowEditModal(false)} className="flex-1 border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50">Cancelar</button>
              <button onClick={handleEdit} disabled={saving || !editForm.nome} className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
