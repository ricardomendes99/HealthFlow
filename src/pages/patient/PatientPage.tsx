import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, ClipboardList, History, TrendingUp, Phone } from 'lucide-react'
import {
  getProfessionalBySlug,
  getActiveQuestionnaires,
  getClientByWhatsApp,
  getClientCheckInHistory,
} from '../../services/patient.service'
import type { Questionnaire, Question, CheckIn } from '../../types'

type Screen = 'identify' | 'home' | 'list' | 'answering' | 'result' | 'history'

export default function PatientPage() {
  const { slug } = useParams<{ slug: string }>()

  const [screen, setScreen] = useState<Screen>('identify')
  const [whatsapp, setWhatsapp] = useState('')
  const [identifyError, setIdentifyError] = useState('')
  const [identifying, setIdentifying] = useState(false)

  const [prof, setProf] = useState<{ id: string; nome_completo: string; titulo_profissao: string; cor_primaria: string } | null>(null)
  const [patient, setPatient] = useState<{ id: string; nome: string } | null>(null)
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [history, setHistory] = useState<CheckIn[]>([])

  const [activeQ, setActiveQ] = useState<Questionnaire | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (!slug) return
    getProfessionalBySlug(slug).then(setProf)
  }, [slug])

  const identify = async () => {
    if (!whatsapp || !prof) return
    setIdentifying(true)
    setIdentifyError('')
    const client = await getClientByWhatsApp(prof.id, whatsapp)
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
    setQuestionnaires(qs)
    setHistory(hist)
    setScreen('home')
    setIdentifying(false)
  }

  const startQuestionnaire = (q: Questionnaire) => {
    setActiveQ(q)
    setQuestions(q.perguntas || [])
    setCurrentQ(0)
    setAnswers({})
    setScore(0)
    setScreen('answering')
  }

  const selectOption = (questionId: string, optionText: string, pts: number) => {
    if (answers[questionId]) return
    setAnswers(prev => ({ ...prev, [questionId]: optionText }))
    setScore(prev => prev + pts)
  }

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) setCurrentQ(prev => prev + 1)
    else setScreen('result')
  }

  const maxScore = questions.reduce((a, q) => a + (q.opcoes ? Math.max(...q.opcoes.map(o => o.pontuacao)) : 0) * q.peso_pontuacao, 0)
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

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
                    placeholder="Ex: 11999990000"
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
                        onClick={() => selectOption(questions[currentQ].id, opt.texto, opt.pontuacao)}
                        className={`w-full text-left border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${answers[questions[currentQ].id] === opt.texto ? 'text-white' : 'border-slate-200 text-slate-700 hover:border-opacity-60'}`}
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
                <div className="flex items-center gap-2 mb-5">
                  <button onClick={() => setScreen('home')} className="text-slate-400 hover:text-slate-600">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-bold text-slate-900">Histórico de respostas</h2>
                </div>
                {history.length === 0 ? (
                  <div className="text-center text-sm text-slate-400 py-12">Nenhuma resposta ainda</div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {history.map(h => (
                        <div key={h.id} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-semibold text-slate-800">{h.questionario_nome}</div>
                            <div className="text-xs text-slate-400">{new Date(h.data_resposta).toLocaleDateString('pt-BR')}</div>
                          </div>
                          <div className="text-xl font-black" style={{ color: cor }}>{h.pontuacao_percentual}%</div>
                        </div>
                      ))}
                    </div>
                    {avgScore !== null && (
                      <div className="rounded-2xl p-4 mt-4 text-center" style={{ backgroundColor: cor + '10' }}>
                        <div className="text-2xl font-black mb-1" style={{ color: cor }}>{avgScore}%</div>
                        <div className="text-xs text-slate-500">Média geral</div>
                      </div>
                    )}
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
