import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronRight, ChevronLeft, ClipboardList, History, TrendingUp } from 'lucide-react'
import { mockQuestionnaires } from '../../data/mockData'
import type { Question } from '../../types'

type Screen = 'home' | 'list' | 'answering' | 'result' | 'history'

const PATIENT_NAME = 'Ana Carolina'
const PROF_NAME = 'Dr. Ricardo Junin'
const PROF_TITLE = 'Nutricionista'

const RESULT_HABITS = [
  { label: 'Qualidade do Sono', status: 'Ótimo', color: 'text-green-600 bg-green-100' },
  { label: 'Frequência de Cardio', status: 'Bom', color: 'text-primary-600 bg-primary-100' },
  { label: 'Frequência de Musculação', status: 'Bom', color: 'text-primary-600 bg-primary-100' },
  { label: 'Adesão à Dieta', status: 'Regular', color: 'text-amber-600 bg-amber-100' },
  { label: 'Funcionamento Intestinal', status: 'Ótimo', color: 'text-green-600 bg-green-100' },
]

const HISTORY = [
  { data: '18/05/2026', questionario: 'Check-in Semanal', pontuacao: 75 },
  { data: '11/05/2026', questionario: 'Check-in Semanal', pontuacao: 80 },
  { data: '04/05/2026', questionario: 'Check-in Semanal', pontuacao: 68 },
  { data: '27/04/2026', questionario: 'Check-in Semanal', pontuacao: 72 },
]

export default function PatientPage() {
  const { slug } = useParams()
  const [screen, setScreen] = useState<Screen>('home')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [score, setScore] = useState(0)

  const questionnaire = mockQuestionnaires[0]
  const questions: Question[] = questionnaire.perguntas || []

  const selectOption = (questionId: string, optionText: string, pts: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionText }))
    setScore(prev => prev + pts)
  }

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1)
    } else {
      setScreen('result')
    }
  }

  const startQuestionnaire = () => {
    setCurrentQ(0)
    setAnswers({})
    setScore(0)
    setScreen('answering')
  }

  const maxScore = questions.reduce((a, q) => a + (q.opcoes ? Math.max(...q.opcoes.map(o => o.pontuacao)) : 0) * q.peso_pontuacao, 0)
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 85

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Phone frame */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
          {/* Header */}
          <div className="bg-primary-600 px-5 pt-8 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {PROF_NAME.charAt(0)}
              </div>
              <div>
                <div className="text-white font-bold">{PROF_NAME}</div>
                <div className="text-primary-200 text-sm">{PROF_TITLE}</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-primary-200">on-line</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-5">
            {/* Home */}
            {screen === 'home' && (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <h1 className="text-xl font-bold text-slate-900">Olá, {PATIENT_NAME}! 👋</h1>
                  <p className="text-slate-500 text-sm mt-1">Seja bem-vinda de volta</p>
                </div>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setScreen('list')}
                    className="w-full bg-primary-600 text-white font-semibold py-4 rounded-2xl flex items-center gap-3 px-5 hover:bg-primary-700 transition-colors"
                  >
                    <ClipboardList className="w-5 h-5" />
                    <span>Questionários pendentes</span>
                    <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">1</span>
                  </button>
                  <button
                    onClick={() => setScreen('history')}
                    className="w-full bg-slate-100 text-slate-700 font-semibold py-4 rounded-2xl flex items-center gap-3 px-5 hover:bg-slate-200 transition-colors"
                  >
                    <History className="w-5 h-5" />
                    <span>Histórico de respostas</span>
                  </button>
                </div>
                <div className="bg-primary-50 rounded-2xl p-4 mt-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                    <span className="text-sm font-semibold text-slate-700">Sua última pontuação</span>
                  </div>
                  <div className="text-3xl font-black text-primary-600">85%</div>
                  <div className="text-xs text-green-600 mt-0.5">+10% em relação ao anterior 📈</div>
                </div>
              </div>
            )}

            {/* List */}
            {screen === 'list' && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <button onClick={() => setScreen('home')} className="text-slate-400 hover:text-slate-600">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-bold text-slate-900">Questionários pendentes</h2>
                </div>
                <div className="space-y-3">
                  <div className="border-2 border-primary-200 bg-primary-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-800">Check-in Semanal de Hábitos</span>
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">Pendente</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">15 perguntas · ~5 minutos</p>
                    <button onClick={startQuestionnaire} className="w-full bg-primary-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                      Responder <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-center text-sm text-slate-400 py-4">Nenhum outro questionário pendente</div>
                </div>
              </div>
            )}

            {/* Answering */}
            {screen === 'answering' && questions.length > 0 && (
              <div className="h-full flex flex-col">
                {/* Progress */}
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <button onClick={() => currentQ > 0 ? setCurrentQ(c => c - 1) : setScreen('list')} className="text-slate-400 hover:text-slate-600">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-semibold text-slate-600">{currentQ + 1}/{questions.length}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-base font-bold text-slate-900 mb-5">{questions[currentQ].texto}</h2>
                  <div className="space-y-2">
                    {questions[currentQ].opcoes?.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => selectOption(questions[currentQ].id, opt.texto, opt.pontuacao)}
                        className={`w-full text-left border-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${answers[questions[currentQ].id] === opt.texto ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-primary-50'}`}
                      >
                        {opt.texto}
                      </button>
                    ))}
                    {questions[currentQ].tipo === 'aberta' && (
                      <textarea
                        placeholder="Digite sua resposta..."
                        onChange={e => setAnswers(prev => ({ ...prev, [questions[currentQ].id]: e.target.value }))}
                        className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm resize-none h-28 focus:outline-none focus:border-primary-400"
                      />
                    )}
                  </div>
                </div>

                <button
                  onClick={nextQuestion}
                  disabled={!answers[questions[currentQ].id]}
                  className="w-full bg-primary-600 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 mt-4 disabled:opacity-50 hover:bg-primary-700 transition-colors"
                >
                  {currentQ < questions.length - 1 ? 'Próxima' : 'Finalizar'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Result */}
            {screen === 'result' && (
              <div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-black text-primary-600 mb-1">{pct}%</div>
                  <div className="text-slate-500 text-sm">Neste questionário, minha pontuação foi</div>
                  <div className="text-green-600 text-sm font-semibold mt-1">+10% melhor que o anterior 📈</div>
                </div>
                <div className="bg-primary-50 rounded-2xl p-4 mb-4">
                  <div className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Ranking de hábitos</div>
                  <div className="space-y-2">
                    {RESULT_HABITS.map(h => (
                      <div key={h.label} className="flex items-center justify-between">
                        <span className="text-xs text-slate-700">{h.label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${h.color}`}>{h.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setScreen('home')} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-2xl hover:bg-primary-700 transition-colors">
                  Voltar ao início
                </button>
              </div>
            )}

            {/* History */}
            {screen === 'history' && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <button onClick={() => setScreen('home')} className="text-slate-400 hover:text-slate-600">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-bold text-slate-900">Histórico de respostas</h2>
                </div>
                <div className="space-y-3">
                  {HISTORY.map((h, i) => (
                    <div key={i} className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-slate-800">{h.questionario}</div>
                        <div className="text-xs text-slate-400">{h.data}</div>
                      </div>
                      <div className="text-xl font-black text-primary-600">{h.pontuacao}%</div>
                    </div>
                  ))}
                </div>
                <div className="bg-primary-50 rounded-2xl p-4 mt-4 text-center">
                  <div className="text-2xl font-black text-primary-600 mb-1">
                    {Math.round(HISTORY.reduce((a, h) => a + h.pontuacao, 0) / HISTORY.length)}%
                  </div>
                  <div className="text-xs text-slate-500">Média geral</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-400">Powered by <span className="text-primary-500 font-semibold">HealthFlow</span></p>
          <p className="text-xs text-slate-300 mt-0.5">healthflow.autotech.dev.br/p/{slug}</p>
        </div>
      </div>
    </div>
  )
}
