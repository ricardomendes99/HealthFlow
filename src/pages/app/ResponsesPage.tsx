import { useState, useEffect } from 'react'
import { BarChart2, TrendingUp, TrendingDown, Apple, Dumbbell } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getCheckIns, getProgressData } from '../../services/checkins.service'
import { useAuth } from '../../context/AuthContext'
import type { CheckIn } from '../../types'

const NUTRI_HABITS = [
  { label: 'Qualidade do Sono', status: 'Ótimo', color: 'text-green-600 bg-green-50' },
  { label: 'Adesão ao Plano Alimentar', status: 'Regular', color: 'text-amber-600 bg-amber-50' },
  { label: 'Funcionamento Intestinal', status: 'Ótimo', color: 'text-green-600 bg-green-50' },
  { label: 'Hidratação Diária', status: 'Ruim', color: 'text-red-600 bg-red-50' },
  { label: 'Sintomas Gastrointestinais', status: 'Bom', color: 'text-primary-600 bg-primary-50' },
  { label: 'Controle de Fome/Saciedade', status: 'Bom', color: 'text-primary-600 bg-primary-50' },
]

const TRAINER_HABITS = [
  { label: 'Qualidade do Sono', status: 'Bom', color: 'text-primary-600 bg-primary-50' },
  { label: 'Frequência de Treinos', status: 'Ótimo', color: 'text-green-600 bg-green-50' },
  { label: 'Intensidade dos Treinos', status: 'Ótimo', color: 'text-green-600 bg-green-50' },
  { label: 'Recuperação Muscular', status: 'Regular', color: 'text-amber-600 bg-amber-50' },
  { label: 'Hidratação Intra-treino', status: 'Ruim', color: 'text-red-600 bg-red-50' },
  { label: 'Nutrição Pré/Pós-treino', status: 'Bom', color: 'text-primary-600 bg-primary-50' },
]

export default function ResponsesPage() {
  const { user } = useAuth()
  const [checkIns, setCheckIns] = useState<CheckIn[]>([])
  const [selected, setSelected] = useState<CheckIn | null>(null)
  const [progressData, setProgressData] = useState<{ semana: string; pontuacao: number }[]>([])
  const [profTab, setProfTab] = useState<'nutri' | 'trainer'>('nutri')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getCheckIns(user.id).then(data => {
      setCheckIns(data)
      if (data.length > 0) setSelected(data[0])
      setLoading(false)
    })
  }, [user])

  useEffect(() => {
    if (!selected) return
    getProgressData(selected.cliente_id, selected.questionario_id).then(setProgressData)
  }, [selected])

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-primary-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Respostas</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Lista de check-ins */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Check-ins recentes</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {loading && (
              <div className="p-8 text-center text-sm text-slate-400">Carregando...</div>
            )}
            {!loading && checkIns.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-400">Nenhum check-in recebido ainda</div>
            )}
            {checkIns.map(ci => (
              <button
                key={ci.id}
                onClick={() => setSelected(ci)}
                className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${selected?.id === ci.id ? 'bg-primary-50 border-l-2 border-primary-500' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{ci.cliente_nome}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{ci.questionario_nome}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{new Date(ci.data_resposta).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-primary-600">{ci.pontuacao_percentual}%</div>
                    {ci.comparativo !== undefined && ci.comparativo !== null && (
                      <div className={`text-xs flex items-center gap-0.5 justify-end ${ci.comparativo >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {ci.comparativo >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {ci.comparativo >= 0 ? '+' : ''}{ci.comparativo}%
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Prontuário */}
        <div className="lg:col-span-2 space-y-5">
          {!selected ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
              Selecione um check-in para ver o prontuário
            </div>
          ) : (
            <>
              {/* Score */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="font-semibold text-slate-800">{selected.cliente_nome}</h2>
                    <p className="text-sm text-slate-500">{selected.questionario_nome} · {new Date(selected.data_resposta).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-primary-600">{selected.pontuacao_percentual}%</div>
                    {selected.comparativo !== undefined && selected.comparativo !== null && (
                      <div className={`text-sm flex items-center gap-1 justify-end mt-1 ${selected.comparativo >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {selected.comparativo >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {selected.comparativo >= 0 ? '+' : ''}{selected.comparativo}% em relação ao anterior
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-600">Ranking de hábitos</h3>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                    <button
                      onClick={() => setProfTab('nutri')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${profTab === 'nutri' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Apple className="w-3.5 h-3.5" /> Nutrição
                    </button>
                    <button
                      onClick={() => setProfTab('trainer')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${profTab === 'trainer' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Dumbbell className="w-3.5 h-3.5" /> Treinos
                    </button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(profTab === 'nutri' ? NUTRI_HABITS : TRAINER_HABITS).map(h => (
                    <div key={h.label} className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
                      <span className="text-sm text-slate-700">{h.label}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${h.color}`}>{h.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gráfico de evolução */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-800">Evolução ao longo do tempo</h2>
                  <select className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none">
                    <option>Pontuação geral</option>
                    {profTab === 'nutri' ? (
                      <>
                        <option>Adesão ao plano alimentar</option>
                        <option>Hidratação diária</option>
                        <option>Funcionamento intestinal</option>
                      </>
                    ) : (
                      <>
                        <option>Frequência de treinos</option>
                        <option>Intensidade dos treinos</option>
                        <option>Recuperação muscular</option>
                      </>
                    )}
                  </select>
                </div>
                {progressData.length === 0 ? (
                  <div className="h-[200px] flex items-center justify-center text-sm text-slate-400">
                    Dados insuficientes para gráfico
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="semana" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip formatter={(v: number) => [`${v}%`, 'Pontuação']} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                      <Line type="monotone" dataKey="pontuacao" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
