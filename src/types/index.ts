export interface Professional {
  id: string
  nome_completo: string
  email: string
  celular_whatsapp: string
  profissao: string
  slug: string
  titulo_profissao: string
  foto_perfil?: string
  capa_cliente?: string
  aparencia: { cor_primaria: string; cor_secundaria: string }
  plano_assinatura: 'mensal' | 'trimestral' | 'anual'
  data_criacao: string
}

export interface Client {
  id: string
  profissional_id: string
  nome: string
  whatsapp: string
  email: string
  observacao?: string
  status: 'ativo' | 'finalizado' | 'inativo'
  servico?: string
  finaliza_em?: string
  data_criacao: string
  flag?: boolean
}

export interface Service {
  id: string
  profissional_id: string
  nome: string
  status: 'ativo' | 'inativo'
  validade_dias: number
  modalidade: 'presencial' | 'online'
  preco: number
  vendas: number
  faturamento: number
  data_criacao: string
}

export interface QuestionOption {
  id: string
  texto: string
  pontuacao: number
}

export interface Question {
  id: string
  questionario_id: string
  texto: string
  tipo: 'multipla_escolha' | 'aberta' | 'escala'
  ordem: number
  peso_pontuacao: number
  opcoes?: QuestionOption[]
}

export interface Questionnaire {
  id: string
  profissional_id: string
  nome: string
  status: 'ativo' | 'inativo'
  total_perguntas: number
  data_criacao: string
  perguntas?: Question[]
}

export interface CheckIn {
  id: string
  questionario_id: string
  questionario_nome: string
  cliente_id: string
  cliente_nome: string
  data_resposta: string
  pontuacao_total: number
  pontuacao_percentual: number
  comparativo?: number
}

export interface Reminder {
  id: string
  profissional_id: string
  cliente_id: string
  cliente_nome: string
  questionario_id: string
  questionario_nome: string
  data_envio_programada: string
  tipo: 'inicial' | 'lembrete' | 'vencimento_plano'
  canal: 'whatsapp' | 'email' | 'ambos'
  status: 'pendente' | 'enviado' | 'falhou'
}

export interface FinancialEntry {
  id: string
  profissional_id: string
  cliente_nome: string
  servico_nome: string
  valor: number
  data: string
}
