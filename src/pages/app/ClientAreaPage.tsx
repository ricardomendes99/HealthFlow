import { useState } from 'react'
import { Layout, ExternalLink, Camera, Palette } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { APP_DOMAIN } from '../../lib/supabase'

export default function ClientAreaPage() {
  const { user } = useAuth()
  const [form, setForm] = useState({
    slug: user?.slug || 'dr-ricardo-junin',
    titulo: 'Nutricionista Clínico',
    corPrimaria: '#2563eb',
    corSecundaria: '#1d4ed8',
  })
  const [saved, setSaved] = useState(false)

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const clientUrl = `${APP_DOMAIN}/p/${form.slug}`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <Layout className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Área do Cliente</h1>
            <p className="text-sm text-slate-500">Personalize a experiência do seu paciente</p>
          </div>
        </div>
        <a href={`/p/${form.slug}`} target="_blank" rel="noopener" className="flex items-center gap-2 text-sm text-primary-600 border border-primary-200 px-4 py-2.5 rounded-xl hover:bg-primary-50 transition-colors font-medium">
          <ExternalLink className="w-4 h-4" /> Ir para a área do cliente
        </a>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3 space-y-5">
          {/* Link */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Link da área do cliente</h2>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-3 py-2.5 text-sm text-slate-400 border-r border-slate-200 whitespace-nowrap">{APP_DOMAIN}/p/</div>
              <input
                value={form.slug}
                onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                className="flex-1 px-3 py-2.5 text-sm focus:outline-none"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">URL: {clientUrl}</p>
          </div>

          {/* Perfil */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Informações do profissional</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome completo</label>
                <input value={user?.nome || ''} readOnly className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 text-slate-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título / Profissão</label>
                <input value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Ex: Nutricionista Clínico" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-slate-800 mb-4">Imagens</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Foto de perfil</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary-300 cursor-pointer transition-colors group">
                  <Camera className="w-8 h-8 text-slate-300 group-hover:text-primary-400 mx-auto mb-2 transition-colors" />
                  <p className="text-xs text-slate-400">400x400px · máx 8MB</p>
                  <p className="text-xs text-primary-500 mt-1 font-medium">Clique para enviar</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Capa da área do cliente</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-primary-300 cursor-pointer transition-colors group">
                  <Camera className="w-8 h-8 text-slate-300 group-hover:text-primary-400 mx-auto mb-2 transition-colors" />
                  <p className="text-xs text-slate-400">1080x1920px · máx 8MB</p>
                  <p className="text-xs text-primary-500 mt-1 font-medium">Clique para enviar</p>
                </div>
              </div>
            </div>
          </div>

          {/* Aparência */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary-600" />
              <h2 className="font-semibold text-slate-800">Aparência</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cor primária</label>
                <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-2">
                  <input type="color" value={form.corPrimaria} onChange={e => set('corPrimaria', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none outline-none" />
                  <span className="text-sm text-slate-600 font-mono">{form.corPrimaria}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Cor secundária</label>
                <div className="flex items-center gap-3 border border-slate-200 rounded-xl p-2">
                  <input type="color" value={form.corSecundaria} onChange={e => set('corSecundaria', e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none outline-none" />
                  <span className="text-sm text-slate-600 font-mono">{form.corSecundaria}</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={save} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
            {saved ? '✓ Salvo com sucesso!' : 'Salvar configurações'}
          </button>
        </div>

        {/* Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-6">
            <h2 className="font-semibold text-slate-700 text-sm mb-3">Prévia da área do cliente</h2>
            <div className="bg-slate-100 rounded-3xl p-4 flex justify-center">
              <div className="w-56 bg-white rounded-3xl shadow-xl overflow-hidden" style={{ '--preview-primary': form.corPrimaria } as React.CSSProperties}>
                {/* Capa */}
                <div className="h-28 flex items-end p-3" style={{ background: `linear-gradient(to bottom, ${form.corPrimaria}88, ${form.corPrimaria})` }}>
                  <div>
                    <div className="w-12 h-12 bg-white/30 rounded-full mb-2 flex items-center justify-center text-white font-bold text-lg">
                      {user?.nome?.charAt(0)}
                    </div>
                    <div className="text-white text-sm font-bold">{user?.nome}</div>
                    <div className="text-white/70 text-xs">{form.titulo}</div>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="text-sm font-semibold text-slate-800">Olá, Maria! 👋</div>
                  <div className="text-xs text-slate-500">Seja bem-vinda de volta</div>
                  <button className="w-full text-white text-xs font-semibold py-2.5 rounded-xl" style={{ backgroundColor: form.corPrimaria }}>
                    Questionários pendentes
                  </button>
                  <button className="w-full bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-xl">
                    Histórico de respostas
                  </button>
                  <div className="bg-slate-50 rounded-xl p-2.5 text-center">
                    <div className="text-lg font-black" style={{ color: form.corPrimaria }}>85%</div>
                    <div className="text-xs text-slate-400">última pontuação</div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-slate-400">Profissional on-line</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3">Prévia em tempo real</p>
          </div>
        </div>
      </div>
    </div>
  )
}
