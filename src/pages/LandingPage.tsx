import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Menu, X, Check, ChevronDown, ChevronUp,
  Zap, BarChart2, Users, MessageSquare, Star,
  Smartphone, Bell, DollarSign, ArrowRight,
  Play, Shield, Clock, TrendingUp, Apple, Dumbbell,
  HeartPulse, Utensils, Scale, Droplets, Moon,
  Activity, Target, Timer, Flame, Trophy
} from 'lucide-react'

const NAV_LINKS = [
  { label: 'Funções', href: '#funcoes' },
  { label: 'Preços', href: '#precos' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
]

const FEATURES = [
  { icon: Users, title: 'Nutricionistas', desc: 'Monitore dietas, ajuste planos alimentares e envie orientações nutricionais personalizadas entre consultas.' },
  { icon: Zap, title: 'Treinadores Pessoais', desc: 'Acompanhe indicadores físicos, envie lembretes de treino e monitore o progresso de cada aluno.' },
  { icon: Shield, title: 'Profissionais de Saúde', desc: 'Colete dados clínicos, avalie progresso terapêutico e automatize a comunicação com seus pacientes.' },
]

const NUTRI_FEATURES = [
  { icon: Utensils, label: 'Adesão alimentar', desc: 'Monitore quantos dias o paciente seguiu o plano alimentar com check-ins semanais automáticos.' },
  { icon: Droplets, label: 'Hidratação diária', desc: 'Acompanhe o consumo de água e identifique padrões de desidratação antes da próxima consulta.' },
  { icon: Scale, label: 'Controle de peso e medidas', desc: 'Registre peso, circunferências e bioimpedância diretamente pelo celular do paciente, sem papel.' },
  { icon: HeartPulse, label: 'Funcionamento intestinal', desc: 'Rastreie trânsito intestinal, inchaço e sintomas para ajustes rápidos na dieta.' },
  { icon: Moon, label: 'Qualidade do sono', desc: 'Sono ruim afeta o metabolismo — monitore e correlacione com resultados nutricionais.' },
  { icon: Apple, label: 'Comportamento alimentar', desc: 'Identifique compulsões, restrições e gatilhos emocionais com escalas validadas.' },
]

const NUTRI_TEMPLATES = [
  { nome: 'Check-in Semanal Nutricional', perguntas: 12 },
  { nome: 'Avaliação de Adesão Alimentar', perguntas: 8 },
  { nome: 'Controle de Sintomas GI', perguntas: 6 },
  { nome: 'Comportamento Alimentar', perguntas: 10 },
]

const TRAINER_FEATURES = [
  { icon: Dumbbell, label: 'Desempenho no treino', desc: 'Escala de percepção de esforço, PRs atingidos e qualidade de execução dos movimentos.' },
  { icon: Activity, label: 'Recuperação muscular', desc: 'Monitore dor muscular tardia (DOMS), fadiga acumulada e disposição pré-treino.' },
  { icon: Timer, label: 'Frequência de treinos', desc: 'Registre automaticamente quantos treinos o aluno realizou na semana, com alertas de falta.' },
  { icon: Flame, label: 'Cardio e condicionamento', desc: 'Acompanhe frequência cardíaca, tempo de cardio e evolução do condicionamento aeróbico.' },
  { icon: Target, label: 'Metas e objetivos', desc: 'Defina metas de composição corporal, força ou condicionamento e meça o progresso semana a semana.' },
  { icon: Trophy, label: 'Ranking de performance', desc: 'Gamificação motiva alunos a manterem consistência — pontuação por frequência e metas atingidas.' },
]

const TRAINER_TEMPLATES = [
  { nome: 'Check-in Semanal de Treinos', perguntas: 10 },
  { nome: 'Avaliação de Desempenho Físico', perguntas: 8 },
  { nome: 'Controle de Recuperação', perguntas: 6 },
  { nome: 'Metas e Evolução do Aluno', perguntas: 7 },
]

const HOW_IT_WORKS = [
  { num: '01', icon: Clock, title: 'Programe os check-ins', desc: 'Configure questionários personalizados e agende o envio automático por WhatsApp ou e-mail.' },
  { num: '02', icon: MessageSquare, title: 'Paciente responde', desc: 'Seu paciente recebe o link e responde no navegador, sem precisar baixar nenhum aplicativo.' },
  { num: '03', icon: BarChart2, title: 'Você revisa e orienta', desc: 'Acesse o prontuário digital com gráficos de progresso e envie orientações personalizadas.' },
]

const CLIENT_AREA_FEATURES = [
  { icon: Smartphone, title: 'Sem instalar app', desc: 'Área do paciente 100% no navegador — funciona em qualquer celular.' },
  { icon: Star, title: 'Questionários personalizados', desc: 'Monte check-ins com suas perguntas, escalas e pontuações.' },
  { icon: TrendingUp, title: 'Gamificação', desc: 'Paciente recebe pontuação e ranking de hábitos a cada resposta, aumentando a adesão.' },
]

const PROGRESS_FEATURES = [
  { icon: BarChart2, title: 'Prontuário digital', desc: 'Todas as respostas organizadas em um só lugar, acessíveis a qualquer momento.' },
  { icon: Shield, title: 'Dados sincronizados', desc: 'Informações em tempo real para decisões clínicas mais precisas.' },
  { icon: TrendingUp, title: 'Tendências comportamentais', desc: 'Identifique padrões e ajuste o plano antes que o problema apareça na consulta.' },
]

const AUTOMATION_FEATURES = [
  { icon: Bell, title: 'Check-ins automáticos', desc: 'Assistente virtual envia os questionários nas datas e horários que você programar.' },
  { icon: MessageSquare, title: 'Lembretes inteligentes', desc: 'Se o paciente não responder, o sistema envia um lembrete automático.' },
  { icon: Clock, title: 'Alerta de vencimento', desc: 'Ao fim do plano, o sistema avisa o paciente e solicita contato para renovação.' },
]

const FINANCIAL_FEATURES = [
  { icon: DollarSign, title: 'Gestão de planos', desc: 'Cadastre serviços com validade, modalidade e preço. Controle quem está ativo.' },
  { icon: BarChart2, title: 'Entradas financeiras', desc: 'Registre pagamentos e acompanhe o faturamento por período em gráficos claros.' },
  { icon: TrendingUp, title: 'Tendências sazonais', desc: 'Visualize picos de faturamento e planeje campanhas com base em dados reais.' },
]

const PRICING_FEATURES = [
  'Clientes Ilimitados',
  'Questionários Ilimitados',
  'Personalização Total da Área de Clientes',
  'Relatório de Respostas para o Profissional',
  'Relatório de Respostas para o Cliente',
  'Controle de Faturamento',
  'Importação de Clientes (XLS/CSV)',
  'Envio de Questionários por WhatsApp',
  'Lembrete de Prazo de Resposta',
  'Lembrete de Vencimento de Plano',
]

const TESTIMONIALS = [
  { nome: 'Kimirli Abreu', handle: '@kimirliabreu.nutri', foto: 'KA', texto: 'Questionário personalizável reforça a exclusividade e seriedade do trabalho. Controle de pacientes ativos e inativos otimizou muito meu tempo.' },
  { nome: 'Iago Pedrosa', handle: '@nutri.iagopedrosa', foto: 'IP', texto: 'Foi um marco no meu atendimento. A automação de envio dos feedbacks para os pacientes mudou completamente minha rotina.' },
  { nome: 'Thales Faccin', handle: '@thales_faccin', foto: 'TF', texto: 'Essencial para ajustes na dieta, melhorias no planejamento dos alunos e refinamentos para atletas de alto rendimento.' },
  { nome: 'Paulo Reis', handle: '@pauloreis_90', foto: 'PR', texto: 'Interface intuitiva, layout limpo. Facilita o controle de lembretes, mensagens automáticas e gestão de planos.' },
  { nome: 'Bernardo Lima', handle: '@bernardolimads', foto: 'BL', texto: 'Substituiu todas as minhas planilhas de controle. Gasto quase metade do tempo no suporte aos pacientes agora.' },
  { nome: 'Henrique Nascimento', handle: '@nascimento_riq', foto: 'HN', texto: 'Simplificou a gestão de clientes e registros, melhorando minha organização e personalização de serviço.' },
  { nome: 'Vinicius Paris', handle: '@viniciusparisnutri', foto: 'VP', texto: 'Agilidade e praticidade incrível nos acompanhamentos e follow-ups de pacientes. Recomendo muito!' },
]

const FAQS = [
  { q: 'Como o HealthFlow pode beneficiar meu negócio?', a: 'Você consegue fazer acompanhamento contínuo entre consultas de forma automatizada. A plataforma coleta dados automaticamente, permitindo consultas mais curtas e assertivas. A automação da comunicação libera mais tempo para focar na qualidade do atendimento.' },
  { q: 'Posso cancelar quando quiser?', a: 'Sim. Os planos possuem opção de pagamento mensal ou trimestral, sem renovação automática. Cancelamento a qualquer momento, sem contratos de longa duração.' },
  { q: 'O HealthFlow oferece suporte ao usuário?', a: 'Sim, suporte dedicado em horário comercial via WhatsApp. Nossa equipe está pronta para te ajudar com qualquer dúvida.' },
  { q: 'E quanto aos pacientes idosos que podem ter dificuldades com tecnologia?', a: 'O aplicativo foi desenvolvido pensando também nos idosos, com letras em tamanho adequado e navegação extremamente simplificada. Qualquer pessoa consegue usar.' },
  { q: 'Posso importar minha lista de pacientes de outros softwares?', a: 'Sim, é possível importar dados a partir de arquivos XLS ou CSV, facilitando a migração de qualquer sistema.' },
]

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [billingAnnual, setBillingAnnual] = useState(true)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [profTab, setProfTab] = useState<'nutri' | 'trainer'>('nutri')

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="min-h-screen font-sans">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">HealthFlow</span>
            </a>
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map(l => (
                <a key={l.href} href={l.href} className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">{l.label}</a>
              ))}
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors px-4 py-2">Entrar</Link>
              <Link to="/cadastro" className="bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-700 transition-colors">Testar Grátis</Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} className="block text-sm font-medium text-slate-700 py-2" onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link to="/login" className="text-center text-sm font-medium text-slate-700 py-2">Entrar</Link>
              <Link to="/cadastro" className="text-center bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full">Testar Grátis</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden gradient-hero">
        <div className="dot-grid absolute inset-0 opacity-40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-8 shadow-sm">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary-700">+904 profissionais de saúde já usam</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
              Automatize sua consultoria<br />
              <span className="text-primary-600">sem perder o toque humano</span> 💙
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Gerencie hábitos, colete dados relevantes por meio de check-ins e envie orientações, tudo em um ambiente intuitivo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/cadastro" className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-8 py-4 rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 text-lg">
                Testar o HealthFlow Gratuitamente
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#video" className="inline-flex items-center gap-2 bg-white text-slate-700 font-semibold px-8 py-4 rounded-full hover:bg-slate-50 transition-all border border-slate-200 text-lg">
                <Play className="w-5 h-5 text-primary-600" />
                Ver demonstração
              </a>
            </div>
          </div>

          {/* Mockup phones */}
          <div className="mt-16 relative flex justify-center gap-4">
            <div className="hidden sm:block w-48 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform -rotate-6 translate-y-4">
              <div className="bg-primary-600 h-8 flex items-center justify-center">
                <div className="w-16 h-1 bg-white/40 rounded" />
              </div>
              <div className="p-4 space-y-3">
                <div className="bg-primary-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black text-primary-600">85%</div>
                  <div className="text-xs text-slate-500">pontuação</div>
                </div>
                <div className="space-y-2">
                  {['Sono', 'Exercício', 'Dieta'].map((item, i) => (
                    <div key={item} className="flex items-center justify-between bg-slate-50 rounded-lg px-2 py-1.5">
                      <span className="text-xs text-slate-600">{item}</span>
                      <span className={`text-xs font-semibold ${i === 0 ? 'text-green-600' : i === 1 ? 'text-primary-600' : 'text-amber-600'}`}>
                        {i === 0 ? 'Ótimo' : i === 1 ? 'Bom' : 'Regular'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-56 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10">
              <div className="bg-primary-600 h-10 flex items-center px-4 gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-full" />
                <div className="text-white text-xs font-medium">HealthFlow</div>
              </div>
              <div className="p-4">
                <div className="text-sm font-semibold text-slate-800 mb-1">Olá, Ana! 👋</div>
                <div className="text-xs text-slate-500 mb-4">Seja bem-vinda de volta</div>
                <button className="w-full bg-primary-600 text-white text-xs font-semibold py-2.5 rounded-xl mb-2">
                  Questionários pendentes
                </button>
                <button className="w-full bg-slate-100 text-slate-700 text-xs font-semibold py-2.5 rounded-xl">
                  Histórico de respostas
                </button>
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-slate-500">Nutricionista on-line</span>
                </div>
              </div>
            </div>
            <div className="hidden sm:block w-48 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-6 translate-y-4">
              <div className="bg-slate-800 h-8 flex items-center px-3 gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-white">Pergunta 6/15</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="text-xs font-semibold text-slate-700">Como foi seu sono?</div>
                {['Ótimo 😴', 'Bom 🙂', 'Regular 😐', 'Ruim 😔'].map(opt => (
                  <div key={opt} className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 cursor-pointer hover:border-primary-400 hover:bg-primary-50">{opt}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é */}
      <section id="funcoes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Para quem é o HealthFlow?</h2>
            <p className="text-lg text-slate-500">Desenvolvido para profissionais de saúde que querem escalar sem perder qualidade</p>
          </div>

          {/* Cards gerais */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-slate-50 rounded-2xl p-8 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors">
                  <f.icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Detalhamento por profissão */}
          <div className="bg-slate-50 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 mb-2">Funcionalidades por especialidade</h3>
              <p className="text-slate-500">Cada profissão tem métricas e templates específicos para o seu dia a dia</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex bg-white border border-slate-200 rounded-2xl p-1.5 gap-1.5 shadow-sm">
                <button
                  onClick={() => setProfTab('nutri')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${profTab === 'nutri' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Apple className="w-4 h-4" />
                  Nutricionistas
                </button>
                <button
                  onClick={() => setProfTab('trainer')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${profTab === 'trainer' ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Dumbbell className="w-4 h-4" />
                  Treinadores Pessoais
                </button>
              </div>
            </div>

            {/* Conteúdo Nutricionista */}
            {profTab === 'nutri' && (
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                    <Apple className="w-4 h-4" /> Para Nutricionistas
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-3">Acompanhe a adesão do seu paciente entre consultas</h4>
                  <p className="text-slate-500 mb-6 leading-relaxed">Chega de depender do relato subjetivo na consulta. Com o HealthFlow, seus pacientes registram hábitos alimentares, hidratação, sintomas e comportamento toda semana — e você chega na consulta com dados reais.</p>
                  <div className="grid gap-3">
                    {NUTRI_FEATURES.map(f => (
                      <div key={f.label} className="flex gap-3 bg-white rounded-xl p-4 border border-slate-200">
                        <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <f.icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{f.label}</div>
                          <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Apple className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-bold text-slate-800 text-sm">Templates prontos para Nutricionistas</span>
                    </div>
                    <div className="space-y-2">
                      {NUTRI_TEMPLATES.map(t => (
                        <div key={t.nome} className="flex items-center justify-between bg-primary-50 rounded-xl px-4 py-3">
                          <span className="text-sm font-medium text-slate-700">{t.nome}</span>
                          <span className="text-xs text-primary-600 font-semibold bg-primary-100 px-2 py-0.5 rounded-full">{t.perguntas}q</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/cadastro" className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors">
                      Usar esses templates <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Mini mockup prontuário nutri */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Check-in semanal — Maria Silva</div>
                    <div className="space-y-2">
                      {[['Adesão alimentar', 'Ótimo', 'bg-green-100 text-green-700'], ['Hidratação', 'Regular', 'bg-amber-100 text-amber-700'], ['Funcionamento intestinal', 'Bom', 'bg-primary-100 text-primary-700'], ['Qualidade do sono', 'Ótimo', 'bg-green-100 text-green-700'], ['Compulsão alimentar', 'Bom', 'bg-primary-100 text-primary-700']].map(([label, status, cls]) => (
                        <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                          <span className="text-xs text-slate-600">{label}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{status}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 bg-primary-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-primary-600">88%</div>
                      <div className="text-xs text-slate-500">pontuação desta semana</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conteúdo Treinador */}
            {profTab === 'trainer' && (
              <div className="grid lg:grid-cols-2 gap-8 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                    <Dumbbell className="w-4 h-4" /> Para Treinadores Pessoais
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 mb-3">Saiba como seu aluno está treinando na semana inteira</h4>
                  <p className="text-slate-500 mb-6 leading-relaxed">Além das sessões presenciais, você precisa saber o que acontece fora da academia. O HealthFlow coleta dados de desempenho, recuperação e motivação dos seus alunos automaticamente toda semana.</p>
                  <div className="grid gap-3">
                    {TRAINER_FEATURES.map(f => (
                      <div key={f.label} className="flex gap-3 bg-white rounded-xl p-4 border border-slate-200">
                        <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <f.icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{f.label}</div>
                          <div className="text-xs text-slate-500 leading-relaxed">{f.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-7 h-7 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="font-bold text-slate-800 text-sm">Templates prontos para Treinadores</span>
                    </div>
                    <div className="space-y-2">
                      {TRAINER_TEMPLATES.map(t => (
                        <div key={t.nome} className="flex items-center justify-between bg-primary-50 rounded-xl px-4 py-3">
                          <span className="text-sm font-medium text-slate-700">{t.nome}</span>
                          <span className="text-xs text-primary-600 font-semibold bg-primary-100 px-2 py-0.5 rounded-full">{t.perguntas}q</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/cadastro" className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-600 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors">
                      Usar esses templates <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Mini mockup prontuário trainer */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Check-in semanal — João Pereira</div>
                    <div className="space-y-2">
                      {[['Desempenho no treino', 'Ótimo', 'bg-green-100 text-green-700'], ['Frequência semanal', 'Ótimo', 'bg-green-100 text-green-700'], ['Recuperação muscular', 'Bom', 'bg-primary-100 text-primary-700'], ['Cardio realizado', 'Regular', 'bg-amber-100 text-amber-700'], ['Motivação', 'Bom', 'bg-primary-100 text-primary-700']].map(([label, status, cls]) => (
                        <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                          <span className="text-xs text-slate-600">{label}</span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{status}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 bg-primary-50 rounded-xl p-3 text-center">
                      <div className="text-xl font-black text-primary-600">82%</div>
                      <div className="text-xs text-slate-500">desempenho esta semana</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Como funciona?</h2>
            <p className="text-lg text-slate-500">3 passos simples para automatizar seu acompanhamento</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(step => (
              <div key={step.num} className="bg-white rounded-2xl p-8 shadow-sm border border-primary-100">
                <div className="text-5xl font-black text-primary-100 mb-4">{step.num}</div>
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Área do Cliente */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Área do cliente personalizada 💙</h2>
              <p className="text-lg text-slate-500 mb-8">Crie um mini-portal com sua marca — logo, cores e capa personalizados — acessível diretamente no navegador do seu paciente.</p>
              <div className="space-y-4">
                {CLIENT_AREA_FEATURES.map(f => (
                  <div key={f.title} className="flex gap-4 p-5 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 mb-1">{f.title}</div>
                      <div className="text-sm text-slate-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-3xl p-8 flex justify-center">
              <div className="w-64 bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-primary-600 h-32 flex items-end p-4">
                  <div>
                    <div className="w-12 h-12 bg-white/20 rounded-full mb-2" />
                    <div className="text-white font-bold">Dr. Ricardo Junin</div>
                    <div className="text-primary-200 text-sm">Nutricionista</div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-sm font-semibold text-slate-800">Olá, Maria! 👋</div>
                  <div className="text-xs text-slate-500">Você tem 1 questionário pendente</div>
                  <button className="w-full bg-primary-600 text-white text-xs font-semibold py-3 rounded-xl">Responder check-in</button>
                  <div className="bg-primary-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-black text-primary-600">78%</div>
                    <div className="text-xs text-slate-500">última pontuação</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progresso */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="font-semibold text-slate-800 mb-4">Evolução — Ana Carolina</div>
              <div className="space-y-2 mb-4">
                {[['Qualidade do Sono', 'Ótimo', 'text-green-600 bg-green-50'], ['Frequência de Cardio', 'Bom', 'text-primary-600 bg-primary-50'], ['Frequência de Musculação', 'Bom', 'text-primary-600 bg-primary-50'], ['Adesão à Dieta', 'Regular', 'text-amber-600 bg-amber-50']].map(([label, status, cls]) => (
                  <div key={label as string} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm text-slate-700">{label}</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cls}`}>{status}</span>
                  </div>
                ))}
              </div>
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <div className="text-3xl font-black text-primary-600">85%</div>
                <div className="text-sm text-slate-500">10% melhor que o anterior 📈</div>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Avalie o progresso com dados reais</h2>
              <p className="text-lg text-slate-500 mb-8">Prontuário digital com todas as respostas organizadas, gráficos de evolução e identificação de tendências comportamentais.</p>
              <div className="space-y-4">
                {PROGRESS_FEATURES.map(f => (
                  <div key={f.title} className="flex gap-4 p-5 bg-white rounded-xl border border-slate-200">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 mb-1">{f.title}</div>
                      <div className="text-sm text-slate-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Automações */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Automações que trabalham por você 🤖</h2>
              <p className="text-lg text-slate-500 mb-8">Assistente virtual no WhatsApp envia check-ins, lembretes e alertas de vencimento — tudo automaticamente, sem você precisar lembrar.</p>
              <div className="space-y-4">
                {AUTOMATION_FEATURES.map(f => (
                  <div key={f.title} className="flex gap-4 p-5 bg-slate-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 mb-1">{f.title}</div>
                      <div className="text-sm text-slate-500">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-6 space-y-3">
              <div className="text-slate-400 text-sm font-mono mb-4">// Automações ativas</div>
              {[
                { icon: '📱', msg: 'Check-in enviado → Ana Carolina', time: '08:00', status: 'green' },
                { icon: '🔔', msg: 'Lembrete: Bruno Mendes sem resposta', time: '12:00', status: 'amber' },
                { icon: '⚠️', msg: 'Plano vencendo: Carla Souza (3 dias)', time: '09:00', status: 'red' },
                { icon: '✅', msg: 'Resposta recebida: Gabriela Santos', time: '14:32', status: 'green' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">{item.msg}</div>
                    <div className="text-xs text-slate-400">{item.time}</div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${item.status === 'green' ? 'bg-green-500' : item.status === 'amber' ? 'bg-amber-500' : 'bg-red-500'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Controle Financeiro */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Controle financeiro integrado 💰</h2>
            <p className="text-lg text-slate-500">Gerencie planos, registre entradas e acompanhe o faturamento em um só lugar.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FINANCIAL_FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video */}
      <section id="video" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Veja como funciona na prática</h2>
          <p className="text-lg text-slate-500 mb-10">Assista a uma demonstração completa do HealthFlow em ação</p>
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900 to-slate-900 opacity-80" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-10 h-10 text-white ml-1" />
              </div>
              <span className="text-white font-semibold">Assistir demonstração (3 min)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Plano único, acesso total</h2>
            <p className="text-lg text-slate-500 mb-8">Tudo que você precisa, sem surpresas. Cancele quando quiser.</p>
            <div className="inline-flex items-center bg-white border border-slate-200 rounded-full p-1 gap-1">
              <button onClick={() => setBillingAnnual(false)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!billingAnnual ? 'bg-primary-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}>Mensal</button>
              <button onClick={() => setBillingAnnual(true)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${billingAnnual ? 'bg-primary-600 text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                Anual <span className="ml-1 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">-15%</span>
              </button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-10 text-white">
            <div className="text-center mb-8">
              <div className="text-5xl font-black mb-2">
                {billingAnnual ? 'R$75' : 'R$89'}<span className="text-2xl font-normal text-primary-200">/mês</span>
              </div>
              {billingAnnual && <div className="text-primary-200 text-sm">ou R$900 no Pix (15% de desconto)</div>}
              <Link to="/cadastro" className="mt-6 inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-8 py-4 rounded-full hover:bg-primary-50 transition-colors text-lg">
                Começar gratuitamente <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {PRICING_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-primary-100">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">O que dizem nossos usuários</h2>
            <p className="text-lg text-slate-500">+904 profissionais de saúde confiam no HealthFlow</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {TESTIMONIALS.map(t => (
              <div key={t.handle} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                    {t.foto}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{t.nome}</div>
                    <div className="text-primary-600 text-xs">{t.handle}</div>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">"{t.texto}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Perguntas frequentes</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <button className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-slate-800 pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-primary-600 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6 text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contato" className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-10" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            HealthFlow: A revolução no<br />
            <span className="text-primary-400">Pós-Consulta</span>
          </h2>
          <p className="text-xl text-slate-400 mb-10">Junte-se a +904 profissionais que já automatizaram seu acompanhamento.</p>
          <Link to="/cadastro" className="inline-flex items-center gap-2 bg-primary-600 text-white font-bold px-10 py-5 rounded-full hover:bg-primary-500 transition-colors text-xl shadow-lg shadow-primary-900">
            Começar gratuitamente
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">HealthFlow</span>
            </div>
            <div className="flex gap-6 text-slate-400 text-sm">
              <a href="#funcoes" className="hover:text-white transition-colors">Funções</a>
              <a href="#precos" className="hover:text-white transition-colors">Preços</a>
              <a href="#contato" className="hover:text-white transition-colors">Contato</a>
              <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            </div>
            <div className="text-slate-500 text-sm">© 2026 HealthFlow. Todos os direitos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
