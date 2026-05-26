import { useState, useEffect } from 'react'
import { FileText, Plus, Search, Pencil, Trash2, ChevronDown, ChevronUp, X, GripVertical, LayoutTemplate, Apple, Dumbbell } from 'lucide-react'
import { getQuestionnaires, saveQuestionnaire, deleteQuestionnaire } from '../../services/questionnaires.service'
import { useAuth } from '../../context/AuthContext'
import type { Questionnaire, Question, QuestionOption } from '../../types'

// ── Templates por profissão ────────────────────────────────────────────────
const NUTRI_TEMPLATES: Omit<Questionnaire, 'id' | 'profissional_id' | 'data_criacao'>[] = [
  {
    nome: 'Check-in Semanal Nutricional',
    status: 'ativo',
    total_perguntas: 6,
    perguntas: [
      { id: 't1q1', questionario_id: '', texto: 'Como foi sua adesão ao plano alimentar esta semana?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Segui 100% 🌟', pontuacao: 4 }, { id: 'b', texto: 'Segui a maior parte', pontuacao: 3 }, { id: 'c', texto: 'Segui pela metade', pontuacao: 2 }, { id: 'd', texto: 'Não consegui seguir', pontuacao: 1 }] },
      { id: 't1q2', questionario_id: '', texto: 'Como foi sua ingestão de água?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Acima de 2L por dia', pontuacao: 4 }, { id: 'b', texto: 'Entre 1,5L e 2L', pontuacao: 3 }, { id: 'c', texto: 'Entre 1L e 1,5L', pontuacao: 2 }, { id: 'd', texto: 'Menos de 1L', pontuacao: 1 }] },
      { id: 't1q3', questionario_id: '', texto: 'Como está seu funcionamento intestinal?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Ótimo, diário e tranquilo', pontuacao: 4 }, { id: 'b', texto: 'Bom, poucos desconfortos', pontuacao: 3 }, { id: 'c', texto: 'Regular, alguns dias com desconforto', pontuacao: 2 }, { id: 'd', texto: 'Ruim, muito inchaço ou constipação', pontuacao: 1 }] },
      { id: 't1q4', questionario_id: '', texto: 'Houve episódios de compulsão alimentar?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Nenhum episódio', pontuacao: 4 }, { id: 'b', texto: '1 episódio leve', pontuacao: 3 }, { id: 'c', texto: '2-3 episódios', pontuacao: 2 }, { id: 'd', texto: 'Muitos episódios', pontuacao: 1 }] },
      { id: 't1q5', questionario_id: '', texto: 'Como foi a qualidade do seu sono?', tipo: 'escala', ordem: 5, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Dormiu bem todos os dias', pontuacao: 4 }, { id: 'b', texto: 'Dormiu bem na maioria', pontuacao: 3 }, { id: 'c', texto: 'Sono interrompido', pontuacao: 2 }, { id: 'd', texto: 'Dormiu mal', pontuacao: 1 }] },
      { id: 't1q6', questionario_id: '', texto: 'Tem alguma observação ou dificuldade que deseja relatar?', tipo: 'aberta', ordem: 6, peso_pontuacao: 0 },
    ],
  },
  {
    nome: 'Avaliação de Sintomas Gastrointestinais',
    status: 'ativo',
    total_perguntas: 5,
    perguntas: [
      { id: 't2q1', questionario_id: '', texto: 'Sentiu inchaço abdominal após as refeições?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Não senti', pontuacao: 4 }, { id: 'b', texto: 'Raramente', pontuacao: 3 }, { id: 'c', texto: 'Com frequência', pontuacao: 2 }, { id: 'd', texto: 'Após quase todas as refeições', pontuacao: 1 }] },
      { id: 't2q2', questionario_id: '', texto: 'Frequência de evacuação esta semana?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Diária e normal', pontuacao: 4 }, { id: 'b', texto: 'A cada 2 dias', pontuacao: 3 }, { id: 'c', texto: 'Menos de 3x na semana', pontuacao: 2 }, { id: 'd', texto: 'Constipado(a)', pontuacao: 1 }] },
      { id: 't2q3', questionario_id: '', texto: 'Sentiu azia ou refluxo?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Nenhum episódio', pontuacao: 4 }, { id: 'b', texto: '1-2 episódios leves', pontuacao: 3 }, { id: 'c', texto: 'Frequente mas tolerável', pontuacao: 2 }, { id: 'd', texto: 'Intenso e frequente', pontuacao: 1 }] },
      { id: 't2q4', questionario_id: '', texto: 'Sentiu náuseas?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Não', pontuacao: 4 }, { id: 'b', texto: 'Uma vez', pontuacao: 3 }, { id: 'c', texto: 'Algumas vezes', pontuacao: 2 }, { id: 'd', texto: 'Com muita frequência', pontuacao: 1 }] },
      { id: 't2q5', questionario_id: '', texto: 'Descreva seus sintomas mais incômodos desta semana:', tipo: 'aberta', ordem: 5, peso_pontuacao: 0 },
    ],
  },
  {
    nome: 'Comportamento Alimentar',
    status: 'ativo',
    total_perguntas: 5,
    perguntas: [
      { id: 't3q1', questionario_id: '', texto: 'Como você se sente em relação à sua alimentação esta semana?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Muito bem, tranquila(o)', pontuacao: 4 }, { id: 'b', texto: 'Bem, mas com algumas dificuldades', pontuacao: 3 }, { id: 'c', texto: 'Regular, com bastante dificuldade', pontuacao: 2 }, { id: 'd', texto: 'Mal, muita angústia', pontuacao: 1 }] },
      { id: 't3q2', questionario_id: '', texto: 'Comeu fora de casa com frequência?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Não ou somente uma vez', pontuacao: 4 }, { id: 'b', texto: '2-3 vezes, com controle', pontuacao: 3 }, { id: 'c', texto: 'Várias vezes, sem controle', pontuacao: 2 }, { id: 'd', texto: 'Quase todos os dias', pontuacao: 1 }] },
      { id: 't3q3', questionario_id: '', texto: 'Comer emocionalmente (ansiedade, estresse)?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Não identificou', pontuacao: 4 }, { id: 'b', texto: 'Uma situação isolada', pontuacao: 3 }, { id: 'c', texto: 'Algumas situações', pontuacao: 2 }, { id: 'd', texto: 'Frequente ao longo da semana', pontuacao: 1 }] },
      { id: 't3q4', questionario_id: '', texto: 'Pulou alguma refeição do plano?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Nenhuma', pontuacao: 4 }, { id: 'b', texto: '1 refeição', pontuacao: 3 }, { id: 'c', texto: '2-3 refeições', pontuacao: 2 }, { id: 'd', texto: 'Muitas refeições', pontuacao: 1 }] },
      { id: 't3q5', questionario_id: '', texto: 'O que foi mais difícil de seguir no plano esta semana?', tipo: 'aberta', ordem: 5, peso_pontuacao: 0 },
    ],
  },
]

const TRAINER_TEMPLATES: Omit<Questionnaire, 'id' | 'profissional_id' | 'data_criacao'>[] = [
  {
    nome: 'Check-in Semanal de Treinos',
    status: 'ativo',
    total_perguntas: 6,
    perguntas: [
      { id: 'tr1q1', questionario_id: '', texto: 'Quantos treinos realizou esta semana?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Todos os treinos programados 💪', pontuacao: 4 }, { id: 'b', texto: 'A maioria dos treinos', pontuacao: 3 }, { id: 'c', texto: 'Metade dos treinos', pontuacao: 2 }, { id: 'd', texto: 'Menos da metade', pontuacao: 1 }] },
      { id: 'tr1q2', questionario_id: '', texto: 'Como foi a intensidade dos seus treinos?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Altíssima intensidade 🔥', pontuacao: 4 }, { id: 'b', texto: 'Alta intensidade', pontuacao: 3 }, { id: 'c', texto: 'Intensidade moderada', pontuacao: 2 }, { id: 'd', texto: 'Baixa intensidade', pontuacao: 1 }] },
      { id: 'tr1q3', questionario_id: '', texto: 'Como está sua recuperação muscular?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Ótima, sem dores', pontuacao: 4 }, { id: 'b', texto: 'Boa, dor leve normal', pontuacao: 3 }, { id: 'c', texto: 'Regular, dores intensas', pontuacao: 2 }, { id: 'd', texto: 'Ruim, muito comprometido', pontuacao: 1 }] },
      { id: 'tr1q4', questionario_id: '', texto: 'Realizou o cardio/aeróbico programado?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Sim, todos os dias', pontuacao: 4 }, { id: 'b', texto: 'Na maioria dos dias', pontuacao: 3 }, { id: 'c', texto: 'Metade dos dias', pontuacao: 2 }, { id: 'd', texto: 'Não realizei', pontuacao: 1 }] },
      { id: 'tr1q5', questionario_id: '', texto: 'Como está sua motivação para treinar?', tipo: 'escala', ordem: 5, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Muito motivado(a) 🏆', pontuacao: 4 }, { id: 'b', texto: 'Motivado(a)', pontuacao: 3 }, { id: 'c', texto: 'Pouco motivado(a)', pontuacao: 2 }, { id: 'd', texto: 'Desmotivado(a)', pontuacao: 1 }] },
      { id: 'tr1q6', questionario_id: '', texto: 'Houve alguma dificuldade ou dor incomum? Descreva:', tipo: 'aberta', ordem: 6, peso_pontuacao: 0 },
    ],
  },
  {
    nome: 'Avaliação de Desempenho Físico',
    status: 'ativo',
    total_perguntas: 5,
    perguntas: [
      { id: 'tr2q1', questionario_id: '', texto: 'Bateu algum recorde pessoal (PR) esta semana?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Sim, múltiplos PRs!', pontuacao: 4 }, { id: 'b', texto: 'Sim, um PR', pontuacao: 3 }, { id: 'c', texto: 'Não, mas me mantive', pontuacao: 2 }, { id: 'd', texto: 'Rendimento abaixo do normal', pontuacao: 1 }] },
      { id: 'tr2q2', questionario_id: '', texto: 'Como avalia a qualidade da execução dos movimentos?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Excelente técnica', pontuacao: 4 }, { id: 'b', texto: 'Boa técnica na maioria', pontuacao: 3 }, { id: 'c', texto: 'Precisei adaptar alguns', pontuacao: 2 }, { id: 'd', texto: 'Muita dificuldade técnica', pontuacao: 1 }] },
      { id: 'tr2q3', questionario_id: '', texto: 'Nível de energia e disposição pré-treino?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Energia máxima', pontuacao: 4 }, { id: 'b', texto: 'Bem disposto(a)', pontuacao: 3 }, { id: 'c', texto: 'Cansado(a) mas fui', pontuacao: 2 }, { id: 'd', texto: 'Sem energia', pontuacao: 1 }] },
      { id: 'tr2q4', questionario_id: '', texto: 'Cumpriu o descanso entre séries e treinos?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Sim, perfeitamente', pontuacao: 4 }, { id: 'b', texto: 'Na maioria das vezes', pontuacao: 3 }, { id: 'c', texto: 'Precisei reduzir descanso', pontuacao: 2 }, { id: 'd', texto: 'Não respeitei os intervalos', pontuacao: 1 }] },
      { id: 'tr2q5', questionario_id: '', texto: 'Descreva o treino mais desafiador da semana:', tipo: 'aberta', ordem: 5, peso_pontuacao: 0 },
    ],
  },
  {
    nome: 'Controle de Recuperação e Sono',
    status: 'ativo',
    total_perguntas: 5,
    perguntas: [
      { id: 'tr3q1', questionario_id: '', texto: 'Quantas horas dormiu em média por noite?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Mais de 8 horas 😴', pontuacao: 4 }, { id: 'b', texto: 'Entre 7 e 8 horas', pontuacao: 3 }, { id: 'c', texto: 'Entre 5 e 6 horas', pontuacao: 2 }, { id: 'd', texto: 'Menos de 5 horas', pontuacao: 1 }] },
      { id: 'tr3q2', questionario_id: '', texto: 'Sentiu dores musculares que atrapalharam treinos?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Nenhuma dor', pontuacao: 4 }, { id: 'b', texto: 'Dor leve, não atrapalhou', pontuacao: 3 }, { id: 'c', texto: 'Dor moderada, adaptei treino', pontuacao: 2 }, { id: 'd', texto: 'Dor intensa, não treinei', pontuacao: 1 }] },
      { id: 'tr3q3', questionario_id: '', texto: 'Fez alguma atividade de recuperação (alongamento, massagem, banho frio)?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Sim, todos os dias', pontuacao: 4 }, { id: 'b', texto: 'Na maioria dos dias', pontuacao: 3 }, { id: 'c', texto: 'Raramente', pontuacao: 2 }, { id: 'd', texto: 'Não fiz nada', pontuacao: 1 }] },
      { id: 'tr3q4', questionario_id: '', texto: 'Nível de estresse e tensão esta semana?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [{ id: 'a', texto: 'Muito tranquilo(a)', pontuacao: 4 }, { id: 'b', texto: 'Estresse normal', pontuacao: 3 }, { id: 'c', texto: 'Bastante estressado(a)', pontuacao: 2 }, { id: 'd', texto: 'Estresse máximo', pontuacao: 1 }] },
      { id: 'tr3q5', questionario_id: '', texto: 'O que você faria diferente para melhorar sua recuperação?', tipo: 'aberta', ordem: 5, peso_pontuacao: 0 },
    ],
  },
]

export default function QuestionnairesPage() {
  const { user } = useAuth()
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return
    getQuestionnaires(user.id).then(setQuestionnaires)
  }, [user])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)
  const [templateTab, setTemplateTab] = useState<'nutri' | 'trainer'>('nutri')
  const [editingQ, setEditingQ] = useState<Questionnaire | null>(null)
  const [form, setForm] = useState({ nome: '', status: 'ativo' })
  const [questions, setQuestions] = useState<Question[]>([])
  const [showAddQ, setShowAddQ] = useState(false)
  const [newQ, setNewQ] = useState({ texto: '', tipo: 'escala' as Question['tipo'] })

  const filtered = questionnaires.filter(q => !search || q.nome.toLowerCase().includes(search.toLowerCase()))

  const openAdd = () => {
    setEditingQ(null)
    setForm({ nome: '', status: 'ativo' })
    setQuestions([])
    setShowModal(true)
  }

  const openEdit = (q: Questionnaire) => {
    setEditingQ(q)
    setForm({ nome: q.nome, status: q.status })
    setQuestions(q.perguntas || [])
    setShowModal(true)
  }

  const useTemplate = async (template: Omit<Questionnaire, 'id' | 'profissional_id' | 'data_criacao'>) => {
    if (!user) return
    const perguntas = template.perguntas?.map(p => ({
      texto: p.texto, tipo: p.tipo, ordem: p.ordem, peso_pontuacao: p.peso_pontuacao, opcoes: p.opcoes
    })) ?? []
    const saved = await saveQuestionnaire(user.id, template.nome, template.status, perguntas)
    if (saved) setQuestionnaires(prev => [saved, ...prev])
    else {
      const novo: Questionnaire = { id: String(Date.now()), profissional_id: user.id, nome: template.nome, status: template.status, total_perguntas: template.total_perguntas, data_criacao: new Date().toISOString().slice(0,10), perguntas: template.perguntas }
      setQuestionnaires(prev => [novo, ...prev])
    }
    setShowTemplates(false)
  }

  const addQuestion = () => {
    if (!newQ.texto) return
    const defaultOpts: QuestionOption[] | undefined = newQ.tipo !== 'aberta' ? [
      { id: `${Date.now()}-1`, texto: 'Ótimo', pontuacao: 4 },
      { id: `${Date.now()}-2`, texto: 'Bom', pontuacao: 3 },
      { id: `${Date.now()}-3`, texto: 'Regular', pontuacao: 2 },
      { id: `${Date.now()}-4`, texto: 'Ruim', pontuacao: 1 },
    ] : undefined
    const q: Question = {
      id: String(Date.now()), questionario_id: editingQ?.id || 'new',
      texto: newQ.texto, tipo: newQ.tipo, ordem: questions.length + 1, peso_pontuacao: 1,
      opcoes: defaultOpts
    }
    setQuestions(prev => [...prev, q])
    setNewQ({ texto: '', tipo: 'escala' })
    setShowAddQ(false)
  }

  const removeQuestion = (id: string) => setQuestions(prev => prev.filter(q => q.id !== id))

  const updateOption = (qId: string, oId: string, field: 'texto' | 'pontuacao', value: string) => {
    setQuestions(prev => prev.map(q =>
      q.id === qId ? { ...q, opcoes: q.opcoes?.map(o => o.id === oId ? { ...o, [field]: field === 'pontuacao' ? Number(value) : value } : o) } : q
    ))
  }

  const save = async () => {
    if (!form.nome || !user) return
    const perguntas = questions.map(p => ({ texto: p.texto, tipo: p.tipo, ordem: p.ordem, peso_pontuacao: p.peso_pontuacao, opcoes: p.opcoes }))
    const saved = await saveQuestionnaire(user.id, form.nome, form.status, perguntas, editingQ?.id)
    if (saved) {
      if (editingQ) setQuestionnaires(prev => prev.map(q => q.id === editingQ.id ? saved : q))
      else setQuestionnaires(prev => [saved, ...prev])
    } else {
      if (editingQ) setQuestionnaires(prev => prev.map(q => q.id === editingQ.id ? { ...q, ...form, status: form.status as 'ativo'|'inativo', total_perguntas: questions.length, perguntas: questions } : q))
      else setQuestionnaires(prev => [{ id: String(Date.now()), profissional_id: user.id, nome: form.nome, status: form.status as 'ativo'|'inativo', total_perguntas: questions.length, data_criacao: new Date().toISOString().slice(0,10), perguntas: questions }, ...prev])
    }
    setShowModal(false)
  }

  const del = async (id: string) => {
    await deleteQuestionnaire(id)
    setQuestionnaires(prev => prev.filter(q => q.id !== id))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Questionários</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="flex items-center gap-2 border border-primary-300 text-primary-700 bg-primary-50 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-100 transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" /> Templates prontos
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" /> Novo questionário
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar questionário..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
      </div>

      <div className="space-y-3">
        {filtered.map(q => (
          <div key={q.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{q.nome}</div>
                  <div className="text-sm text-slate-500">{q.total_perguntas} perguntas</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${q.status === 'ativo' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {q.status === 'ativo' ? '● Ativo' : 'Inativo'}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(q)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => del(q.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  <button onClick={() => setExpanded(expanded === q.id ? null : q.id)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                    {expanded === q.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {expanded === q.id && q.perguntas && q.perguntas.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-3">
                {q.perguntas.map((p, i) => (
                  <div key={p.id} className="bg-white rounded-xl p-4 border border-slate-200">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-xs font-bold text-primary-600 mt-0.5">{i + 1}.</span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-800">{p.texto}</div>
                        <div className="text-xs text-slate-400 mt-0.5 capitalize">{p.tipo.replace('_', ' ')}</div>
                      </div>
                    </div>
                    {p.opcoes && (
                      <div className="grid grid-cols-2 gap-2 ml-5">
                        {p.opcoes.map(o => (
                          <div key={o.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                            <span className="text-xs text-slate-600 flex-1">{o.texto}</span>
                            <span className="text-xs font-bold text-primary-600">{o.pontuacao}pt</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Templates por profissão */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                  <LayoutTemplate className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Templates prontos</h2>
                  <p className="text-xs text-slate-500">Escolha o template e importe com 1 clique</p>
                </div>
              </div>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            {/* Abas de profissão */}
            <div className="px-6 pt-4 flex gap-2">
              <button
                onClick={() => setTemplateTab('nutri')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${templateTab === 'nutri' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Apple className="w-4 h-4" /> Nutricionistas
              </button>
              <button
                onClick={() => setTemplateTab('trainer')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${templateTab === 'trainer' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Dumbbell className="w-4 h-4" /> Treinadores Pessoais
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {(templateTab === 'nutri' ? NUTRI_TEMPLATES : TRAINER_TEMPLATES).map((t, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl p-5 hover:border-primary-300 hover:bg-primary-50/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {templateTab === 'nutri'
                          ? <Apple className="w-4 h-4 text-primary-500" />
                          : <Dumbbell className="w-4 h-4 text-primary-500" />}
                        <span className="font-semibold text-slate-800">{t.nome}</span>
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-semibold">{t.total_perguntas} perguntas</span>
                      </div>
                      <div className="space-y-1 mt-3">
                        {t.perguntas?.slice(0, 3).map((p, pi) => (
                          <div key={pi} className="flex items-start gap-2">
                            <span className="text-xs text-primary-400 font-bold mt-0.5">{pi + 1}.</span>
                            <span className="text-xs text-slate-500 leading-snug">{p.texto}</span>
                          </div>
                        ))}
                        {(t.perguntas?.length ?? 0) > 3 && (
                          <div className="text-xs text-slate-400 ml-4">+ {(t.perguntas?.length ?? 0) - 3} perguntas...</div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => useTemplate(t)}
                      className="flex-shrink-0 bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      Usar template
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-between items-center">
              <p className="text-xs text-slate-400">Após importar, você pode editar e personalizar livremente</p>
              <button onClick={() => setShowTemplates(false)} className="border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm hover:bg-slate-50">Fechar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Construtor */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{editingQ ? 'Editar questionário' : 'Novo questionário'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome do questionário *</label>
                  <input value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Check-in Semanal" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">Perguntas ({questions.length})</h3>
                  <button onClick={() => setShowAddQ(!showAddQ)} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Adicionar pergunta
                  </button>
                </div>

                {showAddQ && (
                  <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 mb-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Texto da pergunta</label>
                      <input value={newQ.texto} onChange={e => setNewQ(p => ({ ...p, texto: e.target.value }))} placeholder="Ex: Como foi seu sono esta semana?" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
                        <select value={newQ.tipo} onChange={e => setNewQ(p => ({ ...p, tipo: e.target.value as Question['tipo'] }))} className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                          <option value="escala">Escala (Ótimo/Ruim)</option>
                          <option value="multipla_escolha">Múltipla escolha</option>
                          <option value="aberta">Resposta aberta</option>
                        </select>
                      </div>
                      <button onClick={addQuestion} className="mt-5 bg-primary-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-700">Adicionar</button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {questions.map((q, i) => (
                    <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                      <GripVertical className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-800">{i + 1}. {q.texto}</div>
                        <div className="text-xs text-slate-400 mt-0.5 capitalize">{q.tipo.replace('_', ' ')}</div>
                        {q.opcoes && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {q.opcoes.map(o => (
                              <div key={o.id} className="flex items-center gap-1.5 bg-primary-50 border border-primary-100 rounded-lg px-2 py-1">
                                <input value={o.texto} onChange={e => updateOption(q.id, o.id, 'texto', e.target.value)} className="text-xs bg-transparent border-none outline-none text-primary-700 w-20" />
                                <input type="number" value={o.pontuacao} onChange={e => updateOption(q.id, o.id, 'pontuacao', e.target.value)} className="text-xs bg-transparent border-none outline-none text-primary-500 w-6 text-right" />
                                <span className="text-xs text-primary-400">pt</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => removeQuestion(q.id)} className="text-slate-300 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {questions.length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-xl">
                      Nenhuma pergunta adicionada ainda
                    </div>
                  )}
                </div>
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
