import { useState } from 'react'
import { BookOpen, Play, Search, X, Clock } from 'lucide-react'

interface Tutorial {
  id: string
  titulo: string
  descricao: string
  duracao: string
  youtubeId: string | null
  categoria: 'profissional' | 'paciente'
}

const TUTORIALS: Tutorial[] = [
  {
    id: '1',
    titulo: 'Introdução ao HealthFlow',
    descricao: 'Descubra como o HealthFlow pode transformar sua consultoria com personalização, automação e gestão eficiente dos seus pacientes.',
    duracao: '6:20',
    youtubeId: null,
    categoria: 'profissional',
  },
  {
    id: '2',
    titulo: 'Configurações iniciais',
    descricao: 'Guia passo a passo para configurar sua conta, personalizar sua área do cliente, definir cores, slug e muito mais.',
    duracao: '14:13',
    youtubeId: null,
    categoria: 'profissional',
  },
  {
    id: '3',
    titulo: 'Criando Perguntas',
    descricao: 'Aprenda a criar perguntas, definir categorias, personalizar respostas e configurar pontuações para seus questionários.',
    duracao: '6:50',
    youtubeId: null,
    categoria: 'profissional',
  },
  {
    id: '4',
    titulo: 'Criando Questionários',
    descricao: 'Explore a tela de criação de questionários, configure perguntas, ajuste pesos e garanta a consistência dos dados coletados.',
    duracao: '5:03',
    youtubeId: null,
    categoria: 'profissional',
  },
  {
    id: '5',
    titulo: 'Programando Envios',
    descricao: 'Aprenda como vincular e programar questionários para seus pacientes de forma automática via WhatsApp e e-mail.',
    duracao: '8:06',
    youtubeId: null,
    categoria: 'profissional',
  },
  {
    id: '6',
    titulo: 'Configurar Lembretes',
    descricao: 'Como ajustar notificações enviadas por e-mail e WhatsApp para manter um acompanhamento eficiente e profissional.',
    duracao: '4:40',
    youtubeId: null,
    categoria: 'profissional',
  },
  {
    id: '7',
    titulo: 'Como Importar Pacientes',
    descricao: 'Aprenda passo a passo como importar seus pacientes corretamente via XLS ou CSV, garantindo que todos os dados estejam no formato adequado.',
    duracao: '13:42',
    youtubeId: null,
    categoria: 'profissional',
  },
  {
    id: '8',
    titulo: 'Autorização de WhatsApp',
    descricao: 'Como autorizar notificações no WhatsApp e acessar os questionários de revisão enviados pelo profissional de saúde.',
    duracao: '0:43',
    youtubeId: null,
    categoria: 'paciente',
  },
  {
    id: '9',
    titulo: 'Preenchendo o Primeiro Questionário',
    descricao: 'Guia passo a passo para responder os questionários de revisão programados pelo seu profissional de saúde.',
    duracao: '0:44',
    youtubeId: null,
    categoria: 'paciente',
  },
  {
    id: '10',
    titulo: 'Como Acessar seu Histórico',
    descricao: 'Aprenda a visualizar seu histórico de respostas e gráficos de evolução para um acompanhamento completo da sua saúde.',
    duracao: '0:32',
    youtubeId: null,
    categoria: 'paciente',
  },
]

export default function TutorialsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Tutorial | null>(null)

  const filtered = TUTORIALS.filter(t =>
    t.titulo.toLowerCase().includes(search.toLowerCase()) ||
    t.descricao.toLowerCase().includes(search.toLowerCase())
  )

  const profissionais = filtered.filter(t => t.categoria === 'profissional')
  const pacientes = filtered.filter(t => t.categoria === 'paciente')

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Tutoriais</h1>
          <p className="text-sm text-slate-500">Aprenda a usar o HealthFlow em poucos minutos</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar conteúdo..."
          className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
        />
      </div>

      {/* Para profissionais */}
      {profissionais.length > 0 && (
        <section className="mb-10">
          <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-5 bg-primary-600 rounded-full inline-block" />
            Para profissionais
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profissionais.map(t => (
              <TutorialCard key={t.id} tutorial={t} onClick={() => setSelected(t)} />
            ))}
          </div>
        </section>
      )}

      {/* Para pacientes */}
      {pacientes.length > 0 && (
        <section>
          <h2 className="text-base font-bold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-2 h-5 bg-green-500 rounded-full inline-block" />
            Para pacientes
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pacientes.map(t => (
              <TutorialCard key={t.id} tutorial={t} onClick={() => setSelected(t)} />
            ))}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm">
          Nenhum tutorial encontrado para "{search}"
        </div>
      )}

      {/* Modal player */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-bold text-slate-900">{selected.titulo}</h2>
                <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  {selected.duracao}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-slate-900 flex items-center justify-center">
              {selected.youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-white/60 text-sm">Vídeo em breve</p>
                  <p className="text-white/40 text-xs mt-1">Este tutorial está sendo gravado</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4">
              <p className="text-sm text-slate-600">{selected.descricao}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TutorialCard({ tutorial, onClick }: { tutorial: Tutorial; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-left hover:shadow-md hover:border-primary-200 transition-all group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center relative">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <Play className="w-6 h-6 text-white ml-0.5" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
          {tutorial.duracao}
        </div>
        {!tutorial.youtubeId && (
          <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
            Em breve
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-sm mb-1 group-hover:text-primary-600 transition-colors">
          {tutorial.titulo}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{tutorial.descricao}</p>
      </div>
    </button>
  )
}
