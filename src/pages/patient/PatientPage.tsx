import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, ClipboardList, History, TrendingUp, TrendingDown, Phone, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  getProfessionalBySlug,
  getActiveQuestionnaires,
  getClientByWhatsApp,
  getClientCheckInHistory,
  type PatientClient,
} from '../../services/patient.service'
import { submitCheckIn } from '../../services/checkins.service'
import type { Questionnaire, Question, CheckIn } from '../../types'

type Screen = 'identify' | 'home' | 'list' | 'answering' | 'result' | 'history'

function daysUntilExpiry(finaliza_em?: string): number | null {
  if (!finaliza_em) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const exp = new Date(finaliza_em); exp.setHours(0, 0, 0, 0)
  return Math.ceil((exp.getTime() - today.getTime()) / 86400000)
}

function filterPending(
  questionnaires: import('../../types').Questionnaire[],
  history: import('../../types').CheckIn[],
  client: PatientClient,
) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return questionnaires.filter(q => {
    const answers = history.filter(h => h.questionario_id === q.id)
    if (answers.length === 0) return true
    const lastDate = new Date(answers[0].data_resposta); lastDate.setHours(0, 0, 0, 0)
    const daysSince = Math.round((today.getTime() - lastDate.getTime()) / 86400000)
    let period = 1 // padrão: aparece novamente no dia seguinte
    if (client.recorrencia_questionario_id === q.id) {
      period = client.recorrencia_tipo === 'quinzenal' ? 15 : 7
    }
    return daysSince >= period
  })
}

export default function PatientPage() {
  const { slug } = useParams<{ slug: string }>()

  const [screen, setScreen] = useState<Screen>('identify')
  const [whatsapp, setWhatsapp] = useState('')
  const [identifyError, setIdentifyError] = useState('')
  const [identifying, setIdentifying] = useState(false)

  const [prof, setProf] = useState<{ id: string; nome_completo: string; titulo_profissao: string; cor_primaria: string } | null>(null)
  const [patient, setPatient] = useState<PatientClient | null>(null)
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [history, setHistory] = useState<CheckIn[]>([])

  const [activeQ, setActiveQ] = useState<Questionnaire | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [finalResult, setFinalResult] = useState<{ pct: number } | null>(null)

  useEffect(() => {
    if (!slug) return
    getProfessionalBySlug(slug).then(setProf)
  }, [slug])

  const doIdentify = async (phone: string) => {
    if (!prof) return
    setIdentifying(true)
    setIdentifyError('')
    const client = await getClientByWhatsApp(prof.id, phone)
    if (!client) {
      setIdentifyError('WhatsApp não encontrado. Verifique o número ou fale com seu profissional.')
      setIdentifying(false)
      return
    }
    setPatient(client)
    const [qs, hist] = await Promise.all([
      getActiveQuestionnaires(prof.id),
      getClientCheckInHistory(client.id),
    ])
    setHistory(hist)
    setQuestionnaires(filterPending(qs, hist, client))
    setScreen('home')
    setIdentifying(false)
  }

  const identify = () => { if (whatsapp) doIdentify(whatsapp) }

  const startQuestionnaire = (q: Questionnaire) => {
    setActiveQ(q)
    setQuestions(q.perguntas || [])
    setCurrentQ(0)
    setAnswers({})
    setFinalResult(null)
    setScreen('answering')
  }

  // Calcula score a partir das respostas atuais (permite re-seleção)
  const computeScore = (qs: Question[], ans: Record<string, string>) =>
    qs.reduce((total, q) => {
      const sel = q.opcoes?.find(o => o.texto === ans[q.id])
      return total + (sel?.pontuacao ?? 0) * q.peso_pontuacao
    }, 0)

  const computeMax = (qs: Question[]) =>
    qs.reduce((a, q) => a + (q.opcoes && q.opcoes.length > 0 ? Math.max(...q.opcoes.map(o => o.pontuacao)) : 0) * q.peso_pontuacao, 0)

  const selectOption = (questionId: string, optionText: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionText }))
  }

  const nextQuestion = async () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      const finalScore = computeScore(questions, answers)
      const maxScore = computeMax(questions)
      const finalPct = maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0
      if (patient && activeQ) {
        const answersPayload = questions.map(q => {
          const opt = q.opcoes?.find(o => o.texto === answers[q.id])
          return {
            question_id: q.id,
            option_id: opt?.id,
            resposta_texto: q.tipo === 'aberta' ? answers[q.id] : undefined,
            pontuacao: opt?.pontuacao ?? 0,
          }
        })
        await submitCheckIn(patient.id, activeQ.id, answersPayload, finalScore, finalPct)
        const hist = await getClientCheckInHistory(patient.id)
        setHistory(hist)
        const allQs = await getActiveQuestionnaires(prof!.id)
        setQuestionnaires(filterPending(allQs, hist, patient))
      }
      setFinalResult({ pct: maxScore > 0 ? Math.round((computeScore(questions, answers) / maxScore) * 100) : 0 })
      setScreen('result')
    }
  }

  const pct = finalResult?.pct ?? 0

  const lastName = history.length > 0 ? history[0] : null
  const avgScore = history.length > 0 ? Math.round(history.reduce((a, h) => a + h.pontuacao_percentual, 0) / history.length) : null

  const cor = prof?.cor_primaria ?? '#2563eb'

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">

          {/* Header */}
          <div className="px-5 pt-8 pb-5" style={{ backgroundColor: cor }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                {prof?.nome_completo?.charAt(0) ?? '?'}
              </div>
              <div>
                <div className="text-white font-bold">{prof?.nome_completo ?? '...'}</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{prof?.titulo_profissao ?? ''}</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>on-line</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-5">

            {/* Identificação */}
            {screen === 'identify' && (
              <div className="h-full flex flex-col justify-center">
                <div className="text-center mb-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: cor + '20' }}>
                    <Phone className="w-7 h-7" style={{ color: cor }} />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">Bem-vindo!</h1>
                  <p className="text-slate-500 text-sm mt-2">Digite seu WhatsApp para acessar seus questionários</p>
                </div>
                <div className="space-y-4">
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && identify()}
                    placeholder="Ex: 71999990001"
                    className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary-400 text-center text-lg tracking-wide"
                  />
                  {identifyError && (
                    <p className="text-xs text-red-500 text-center">{identifyError}</p>
                  )}
                  <button
                    onClick={identify}
                    disabled={!whatsapp || identifying}
                    className="w-full text-white font-semibold py-3.5 rounded-2xl disabled:opacity-50 transition-colors"
                    style={{ backgroundColor: cor }}
                  >
                    {identifying ? 'Verificando...' : 'Continuar'}
                  </button>
                  <button
                    onClick={() => doIdentify('71999990001')}
                    className="w-full border border-slate-200 text-slate-500 text-xs py-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    ▶ Acessar como paciente demo
                  </button>
                </div>
              </div>
            )}

            {/* Home */}
            {screen === 'home' && patient && (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-slate-900">Olá, {patient.nome.split(' ')[0]}! 👋</h1>
                  <p className="text-slate-500 text-sm mt-1">Seja bem-vindo de volta</p>
                </div>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setScreen('list')}
                    className="w-full text-white font-semibold py-4 rounded-2xl flex items-center gap-3 px-5 transition-colors"
                    style={{ backgroundColor: cor }}
                  >
                    <ClipboardList className="w-5 h-5" />
                    <span>Questionários pendentes</span>
                    <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                      {questionnaires.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setScreen('history')}
                    className="w-full bg-slate-100 text-slate-700 font-semibold py-4 rounded-2xl flex items-center gap-3 px-5 hover:bg-slate-200 transition-colors"
                  >
                    <History className="w-5 h-5" />
                    <span>Histórico de respostas</span>
                  </button>
                </div>
                {(() => {
                  const days = daysUntilExpiry(patient.finaliza_em)
                  if (days === null || days > 7) return null
                  const msg = days <= 0
                    ? 'Seu plano venceu! Entre em contato para renovar.'
                    : days === 1
                      ? 'Seu plano vence amanhã! Entre em contato para renovar.'
                      : `Seu plano vence em ${days} dias. Entre em contato para renovar.`
                  return (
                    <div className="rounded-2xl p-4 flex items-start gap-3 bg-amber-50 border border-amber-200">
                      <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm font-semibold text-amber-800">Renovação do plano</div>
                        <div className="text-xs text-amber-700 mt-0.5">{msg}</div>
                      </div>
                    </div>
                  )
                })()}
                {lastName && (
                  <div className="rounded-2xl p-4 mt-auto" style={{ backgroundColor: cor + '15' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4" style={{ color: cor }} />
                      <span className="text-sm font-semibold text-slate-700">Sua última pontuação</span>
                    </div>
                    <div className="text-3xl font-black" style={{ color: cor }}>{lastName.pontuacao_percentual}%</div>
                    <div className="text-xs text-slate-500 mt-0.5">{new Date(lastName.data_resposta).toLocaleDateString('pt-BR')}</div>
                  </div>
                )}
              </div>
            )}

            {/* Lista */}
            {screen === 'list' && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <button onClick={() => setScreen('home')} className="text-slate-400 hover:text-slate-600">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-bold text-slate-900">Questionários pendentes</h2>
                </div>
                {questionnaires.length === 0 ? (
                  <div className="text-center text-sm text-slate-400 py-12">Nenhum questionário pendente</div>
                ) : (
                  <div className="space-y-3">
                    {questionnaires.map(q => (
                      <div key={q.id} className="border-2 rounded-2xl p-4" style={{ borderColor: cor + '60', backgroundColor: cor + '08' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-slate-800">{q.nome}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: cor + '20', color: cor }}>Pendente</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">{q.total_perguntas} perguntas</p>
                        <button
                          onClick={() => startQuestionnaire(q)}
                          className="w-full text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                          style={{ backgroundColor: cor }}
                        >
                          Responder <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Respondendo */}
            {screen === 'answering' && questions.length > 0 && (
              <div className="h-full flex flex-col">
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <button onClick={() => currentQ > 0 ? setCurrentQ(c => c - 1) : setScreen('list')} className="text-slate-400 hover:text-slate-600">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-slate-600">{currentQ + 1}/{questions.length}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%`, backgroundColor: cor }} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-slate-900 mb-5">{questions[currentQ].texto}</h2>
                  <div className="space-y-2">
                    {questions[currentQ].opcoes?.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => selectOption(questions[currentQ].id, opt.texto)}
                        className={`w-full text-left border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${answers[questions[currentQ].id] === opt.texto ? '' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        style={answers[questions[currentQ].id] === opt.texto ? { borderColor: cor, backgroundColor: cor, color: 'white' } : {}}
                      >
                        {opt.texto}
                      </button>
                    ))}
                    {questions[currentQ].tipo === 'aberta' && (
                      <textarea
                        placeholder="Digite sua resposta..."
                        onChange={e => setAnswers(prev => ({ ...prev, [questions[currentQ].id]: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm resize-none h-28 focus:outline-none"
                        style={{ outlineColor: cor }}
                      />
                    )}
                  </div>
                </div>
                <button
                  onClick={nextQuestion}
                  disabled={!answers[questions[currentQ].id]}
                  className="w-full text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: cor }}
                >
                  {currentQ < questions.length - 1 ? 'Próxima' : 'Finalizar'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Resultado */}
            {screen === 'result' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-black mb-1" style={{ color: cor }}>{pct}%</div>
                  <div className="text-slate-500 text-sm">Pontuação neste questionário</div>
                </div>
                <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: cor + '10' }}>
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Suas respostas</div>
                  <div className="space-y-2">
                    {questions.filter(q => answers[q.id]).map(q => (
                      <div key={q.id} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-slate-600 flex-1 leading-tight">{q.texto}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap" style={{ backgroundColor: cor + '20', color: cor }}>{answers[q.id]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setScreen('home')}
                  className="w-full text-white font-semibold py-3 rounded-2xl transition-colors"
                  style={{ backgroundColor: cor }}
                >
                  Voltar ao início
                </button>
              </div>
            )}

            {/* Histórico */}
            {screen === 'history' && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setScreen('home')} className="text-slate-400 hover:text-slate-600">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-bold text-slate-900">Histórico de respostas</h2>
                </div>
                {history.length === 0 ? (
                  <div className="text-center text-sm text-slate-400 py-12">Nenhuma resposta ainda</div>
                ) : (
                  <>
                    {/* Gráfico de evolução */}
                    {history.length >= 2 && (() => {
                      const chartData = [...history].reverse().map((h, i) => ({
                        label: `${i + 1}`,
                        score: h.pontuacao_percentual,
                        data: new Date(h.data_resposta).toLocaleDateString('pt-BR'),
                      }))
                      const latest = history[0]
                      const delta = latest.comparativo
                      return (
                        <div className="rounded-2xl p-4 mb-4 border border-slate-100 bg-white shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Evolução</span>
                            {delta !== undefined && delta !== null && delta !== 0 && (
                              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${delta > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {delta > 0
                                  ? <TrendingUp className="w-3 h-3" />
                                  : <TrendingDown className="w-3 h-3" />}
                                {delta > 0 ? '+' : ''}{Math.round(delta)}% vs anterior
                              </span>
                            )}
                          </div>
                          <ResponsiveContainer width="100%" height={110}>
                            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                              <Tooltip
                                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.10)', fontSize: 12 }}
                                formatter={(v: number) => [`${v}%`, 'Pontuação']}
                                labelFormatter={(_, payload) => payload?.[0]?.payload?.data ?? ''}
                              />
                              <Line
                                type="monotone"
                                dataKey="score"
                                stroke={cor}
                                strokeWidth={2.5}
                                dot={{ fill: cor, r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                          {avgScore !== null && (
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                              <span className="text-xs text-slate-400">Média geral</span>
                              <span className="text-sm font-black" style={{ color: cor }}>{avgScore}%</span>
                            </div>
                          )}
                        </div>
                      )
                    })()}

                    {/* Lista de check-ins */}
                    <div className="space-y-2">
                      {history.map(h => {
                        const delta = h.comparativo
                        return (
                          <div key={h.id} className="bg-slate-50 rounded-2xl p-3.5 flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-slate-800 truncate">{h.questionario_nome}</div>
                              <div className="text-xs text-slate-400">{new Date(h.data_resposta).toLocaleDateString('pt-BR')}</div>
                            </div>
                            <div className="flex flex-col items-end ml-3 gap-0.5 flex-shrink-0">
                              <span className="text-xl font-black" style={{ color: cor }}>{h.pontuacao_percentual}%</span>
                              {delta !== undefined && delta !== null && delta !== 0 && (
                                <span className={`flex items-center gap-0.5 text-xs font-semibold ${delta > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                  {delta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                  {delta > 0 ? '+' : ''}{Math.round(delta)}%
                                </span>
                              )}
                              {(delta === 0) && (
                                <span className="text-xs text-slate-400">=</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-400">Powered by <span className="font-semibold" style={{ color: cor }}>HealthFlow</span></p>
          <p className="text-xs text-slate-300 mt-0.5">healthflow.autotech.dev.br/p/{slug}</p>
        </div>
      </div>
    </div>
  )
}
