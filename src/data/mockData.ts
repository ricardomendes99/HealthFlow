import type { Client, Service, Questionnaire, CheckIn, Reminder, FinancialEntry } from '../types'

export const mockClients: Client[] = [
  { id: '1', profissional_id: '1', nome: 'Ana Carolina Silva', whatsapp: '71999990001', email: 'ana@email.com', observacao: 'atleta', status: 'ativo', servico: 'Plano Trimestral', data_criacao: '2026-03-01', flag: false },
  { id: '2', profissional_id: '1', nome: 'Bruno Mendes', whatsapp: '71999990002', email: 'bruno@email.com', observacao: '', status: 'ativo', servico: 'Plano Semestral', data_criacao: '2026-02-15', flag: true },
  { id: '3', profissional_id: '1', nome: 'Carla Souza', whatsapp: '71999990003', email: 'carla@email.com', status: 'ativo', servico: 'Consulta Presencial', data_criacao: '2026-04-01', flag: false },
  { id: '4', profissional_id: '1', nome: 'Daniel Costa', whatsapp: '71999990004', email: 'daniel@email.com', status: 'finalizado', servico: 'Plano Trimestral', data_criacao: '2025-12-01', flag: false },
  { id: '5', profissional_id: '1', nome: 'Eduarda Lima', whatsapp: '71999990005', email: 'edu@email.com', status: 'ativo', servico: 'Plano Semestral', data_criacao: '2026-01-20', flag: false },
  { id: '6', profissional_id: '1', nome: 'Felipe Rodrigues', whatsapp: '71999990006', email: 'felipe@email.com', observacao: 'vegano', status: 'inativo', servico: 'Consulta Presencial', data_criacao: '2025-10-10', flag: false },
  { id: '7', profissional_id: '1', nome: 'Gabriela Santos', whatsapp: '71999990007', email: 'gabi@email.com', status: 'ativo', servico: 'Plano Trimestral', data_criacao: '2026-03-20', flag: false },
  { id: '8', profissional_id: '1', nome: 'Henrique Alves', whatsapp: '71999990008', email: 'henrique@email.com', status: 'ativo', servico: 'Plano Semestral', data_criacao: '2026-02-01', flag: false },
  { id: '9', profissional_id: '1', nome: 'Isabela Torres', whatsapp: '71999990009', email: 'isa@email.com', status: 'ativo', servico: 'Plano Trimestral', data_criacao: '2026-04-10', flag: false },
  { id: '10', profissional_id: '1', nome: 'João Pereira', whatsapp: '71999990010', email: 'joao@email.com', status: 'ativo', servico: 'Consulta Presencial', data_criacao: '2026-05-01', flag: false },
  { id: '11', profissional_id: '1', nome: 'Karina Oliveira', whatsapp: '71999990011', email: 'karina@email.com', status: 'finalizado', servico: 'Plano Semestral', data_criacao: '2025-11-15', flag: false },
  { id: '12', profissional_id: '1', nome: 'Lucas Fernandes', whatsapp: '71999990012', email: 'lucas@email.com', status: 'ativo', servico: 'Plano Trimestral', data_criacao: '2026-03-05', flag: false },
  { id: '13', profissional_id: '1', nome: 'Mariana Castro', whatsapp: '71999990013', email: 'mari@email.com', status: 'ativo', servico: 'Plano Semestral', data_criacao: '2026-01-08', flag: false },
  { id: '14', profissional_id: '1', nome: 'Nicolás Barros', whatsapp: '71999990014', email: 'nico@email.com', status: 'inativo', servico: 'Consulta Presencial', data_criacao: '2025-09-20', flag: false },
  { id: '15', profissional_id: '1', nome: 'Olivia Nunes', whatsapp: '71999990015', email: 'oli@email.com', status: 'ativo', servico: 'Plano Trimestral', data_criacao: '2026-04-25', flag: false },
  { id: '16', profissional_id: '1', nome: 'Pedro Azevedo', whatsapp: '71999990016', email: 'pedro@email.com', status: 'ativo', servico: 'Plano Semestral', data_criacao: '2026-02-28', flag: false },
]

export const mockServices: Service[] = [
  { id: '1', profissional_id: '1', nome: 'Consulta Presencial', status: 'ativo', validade_dias: 60, modalidade: 'presencial', preco: 200, vendas: 12, faturamento: 2400, data_criacao: '2025-01-01' },
  { id: '2', profissional_id: '1', nome: 'Plano Trimestral', status: 'ativo', validade_dias: 90, modalidade: 'online', preco: 540, vendas: 8, faturamento: 4320, data_criacao: '2025-01-01' },
  { id: '3', profissional_id: '1', nome: 'Plano Semestral', status: 'ativo', validade_dias: 180, modalidade: 'online', preco: 1020, vendas: 5, faturamento: 5100, data_criacao: '2025-01-01' },
  { id: '4', profissional_id: '1', nome: 'Avaliação Online', status: 'inativo', validade_dias: 30, modalidade: 'online', preco: 120, vendas: 3, faturamento: 360, data_criacao: '2025-06-01' },
]

export const chartData = [
  { mes: 'Dez', valor: 3200 },
  { mes: 'Jan', valor: 4100 },
  { mes: 'Fev', valor: 3800 },
  { mes: 'Mar', valor: 5600 },
  { mes: 'Abr', valor: 4900 },
  { mes: 'Mai', valor: 6200 },
]

export const mockQuestionnaires: Questionnaire[] = [
  {
    id: '1', profissional_id: '1', nome: 'Check-in Semanal de Hábitos', status: 'ativo', total_perguntas: 15, data_criacao: '2026-01-10',
    perguntas: [
      { id: 'q1', questionario_id: '1', texto: 'Como foi sua qualidade de sono esta semana?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [
        { id: 'o1', texto: 'Ótimo 😴', pontuacao: 4 },
        { id: 'o2', texto: 'Bom 🙂', pontuacao: 3 },
        { id: 'o3', texto: 'Regular 😐', pontuacao: 2 },
        { id: 'o4', texto: 'Ruim 😔', pontuacao: 1 },
      ]},
      { id: 'q2', questionario_id: '1', texto: 'Como foi seu desempenho com exercícios?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [
        { id: 'o5', texto: 'Altíssimo desempenho 💪', pontuacao: 4 },
        { id: 'o6', texto: 'Bom desempenho', pontuacao: 3 },
        { id: 'o7', texto: 'Desempenho regular', pontuacao: 2 },
        { id: 'o8', texto: 'Não pratiquei', pontuacao: 1 },
      ]},
      { id: 'q3', questionario_id: '1', texto: 'Como está seu funcionamento intestinal?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [
        { id: 'o9', texto: 'Ótimo', pontuacao: 4 },
        { id: 'o10', texto: 'Bom', pontuacao: 3 },
        { id: 'o11', texto: 'Regular', pontuacao: 2 },
        { id: 'o12', texto: 'Ruim', pontuacao: 1 },
      ]},
    ]
  },
  {
    id: '2', profissional_id: '1', nome: 'Avaliação Nutricional Mensal', status: 'ativo', total_perguntas: 6, data_criacao: '2026-02-01',
    perguntas: [
      { id: 'q4', questionario_id: '2', texto: 'Como está sua adesão ao plano alimentar?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [
        { id: 'o13', texto: 'Segui 100% 🥗', pontuacao: 4 },
        { id: 'o14', texto: 'Segui a maioria', pontuacao: 3 },
        { id: 'o15', texto: 'Tive algumas fugas', pontuacao: 2 },
        { id: 'o16', texto: 'Não consegui seguir', pontuacao: 1 },
      ]},
      { id: 'q5', questionario_id: '2', texto: 'Como está sua hidratação diária?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [
        { id: 'o17', texto: 'Bebi mais de 2L por dia 💧', pontuacao: 4 },
        { id: 'o18', texto: 'Bebi entre 1,5L e 2L', pontuacao: 3 },
        { id: 'o19', texto: 'Bebi menos de 1,5L', pontuacao: 2 },
        { id: 'o20', texto: 'Mal me hidratei', pontuacao: 1 },
      ]},
      { id: 'q6', questionario_id: '2', texto: 'Como está seu funcionamento intestinal?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [
        { id: 'o21', texto: 'Ótimo — evacuação regular', pontuacao: 4 },
        { id: 'o22', texto: 'Bom — quase todos os dias', pontuacao: 3 },
        { id: 'o23', texto: 'Regular — alguns desconfortos', pontuacao: 2 },
        { id: 'o24', texto: 'Ruim — constipação ou diarreia', pontuacao: 1 },
      ]},
      { id: 'q7', questionario_id: '2', texto: 'Sentiu sintomas gastrointestinais (gases, inchaço, azia)?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [
        { id: 'o25', texto: 'Nenhum sintoma 😊', pontuacao: 4 },
        { id: 'o26', texto: 'Leve e esporádico', pontuacao: 3 },
        { id: 'o27', texto: 'Moderado — alguns dias', pontuacao: 2 },
        { id: 'o28', texto: 'Frequente e intenso', pontuacao: 1 },
      ]},
      { id: 'q8', questionario_id: '2', texto: 'Como avalia sua saciedade após as refeições?', tipo: 'escala', ordem: 5, peso_pontuacao: 1, opcoes: [
        { id: 'o29', texto: 'Me sinto satisfeita sem excessos', pontuacao: 4 },
        { id: 'o30', texto: 'Quase sempre satisfeita', pontuacao: 3 },
        { id: 'o31', texto: 'Fome constante ou exageros', pontuacao: 2 },
        { id: 'o32', texto: 'Compulsão ou restrição severa', pontuacao: 1 },
      ]},
      { id: 'q9', questionario_id: '2', texto: 'Observações sobre alimentação desta semana (opcional)', tipo: 'aberta', ordem: 6, peso_pontuacao: 0 },
    ]
  },
  {
    id: '3', profissional_id: '1', nome: 'Check-in Semanal de Treinos', status: 'ativo', total_perguntas: 6, data_criacao: '2026-03-05',
    perguntas: [
      { id: 'q10', questionario_id: '3', texto: 'Quantos treinos realizou esta semana?', tipo: 'escala', ordem: 1, peso_pontuacao: 1, opcoes: [
        { id: 'o33', texto: '5 ou mais treinos 🏆', pontuacao: 4 },
        { id: 'o34', texto: '3 a 4 treinos', pontuacao: 3 },
        { id: 'o35', texto: '1 a 2 treinos', pontuacao: 2 },
        { id: 'o36', texto: 'Nenhum treino', pontuacao: 1 },
      ]},
      { id: 'q11', questionario_id: '3', texto: 'Como foi a intensidade dos treinos?', tipo: 'escala', ordem: 2, peso_pontuacao: 1, opcoes: [
        { id: 'o37', texto: 'Máxima intensidade 🔥', pontuacao: 4 },
        { id: 'o38', texto: 'Boa intensidade', pontuacao: 3 },
        { id: 'o39', texto: 'Intensidade moderada', pontuacao: 2 },
        { id: 'o40', texto: 'Baixa intensidade', pontuacao: 1 },
      ]},
      { id: 'q12', questionario_id: '3', texto: 'Como está sua recuperação muscular?', tipo: 'escala', ordem: 3, peso_pontuacao: 1, opcoes: [
        { id: 'o41', texto: 'Excelente — sem dores', pontuacao: 4 },
        { id: 'o42', texto: 'Boa — dor muscular leve', pontuacao: 3 },
        { id: 'o43', texto: 'Regular — dores persistentes', pontuacao: 2 },
        { id: 'o44', texto: 'Ruim — lesão ou dor intensa', pontuacao: 1 },
      ]},
      { id: 'q13', questionario_id: '3', texto: 'Como foi sua qualidade de sono esta semana?', tipo: 'escala', ordem: 4, peso_pontuacao: 1, opcoes: [
        { id: 'o45', texto: 'Dormi bem todas as noites 😴', pontuacao: 4 },
        { id: 'o46', texto: 'Maioria das noites boa', pontuacao: 3 },
        { id: 'o47', texto: 'Sono irregular', pontuacao: 2 },
        { id: 'o48', texto: 'Muito mal-dormido', pontuacao: 1 },
      ]},
      { id: 'q14', questionario_id: '3', texto: 'Como avalia sua nutrição pré e pós-treino?', tipo: 'escala', ordem: 5, peso_pontuacao: 1, opcoes: [
        { id: 'o49', texto: 'Segui o protocolo nutricional', pontuacao: 4 },
        { id: 'o50', texto: 'Segui na maioria dos dias', pontuacao: 3 },
        { id: 'o51', texto: 'Esqueci algumas vezes', pontuacao: 2 },
        { id: 'o52', texto: 'Não segui o protocolo', pontuacao: 1 },
      ]},
      { id: 'q15', questionario_id: '3', texto: 'Alguma observação sobre os treinos ou dificuldades? (opcional)', tipo: 'aberta', ordem: 6, peso_pontuacao: 0 },
    ]
  },
  { id: '4', profissional_id: '1', nome: 'Questionário de Adesão', status: 'inativo', total_perguntas: 8, data_criacao: '2026-01-20' },
]

export const mockCheckIns: CheckIn[] = [
  { id: '1', questionario_id: '1', questionario_nome: 'Check-in Semanal', cliente_id: '1', cliente_nome: 'Ana Carolina Silva', data_resposta: '2026-05-20', pontuacao_total: 48, pontuacao_percentual: 85, comparativo: 10 },
  { id: '2', questionario_id: '1', questionario_nome: 'Check-in Semanal', cliente_id: '2', cliente_nome: 'Bruno Mendes', data_resposta: '2026-05-21', pontuacao_total: 40, pontuacao_percentual: 71, comparativo: -5 },
  { id: '3', questionario_id: '2', questionario_nome: 'Avaliação Nutricional', cliente_id: '3', cliente_nome: 'Carla Souza', data_resposta: '2026-05-18', pontuacao_total: 52, pontuacao_percentual: 92, comparativo: 15 },
  { id: '4', questionario_id: '1', questionario_nome: 'Check-in Semanal', cliente_id: '5', cliente_nome: 'Eduarda Lima', data_resposta: '2026-05-22', pontuacao_total: 44, pontuacao_percentual: 78, comparativo: 3 },
]

export const progressData = [
  { semana: 'S1', pontuacao: 62 },
  { semana: 'S2', pontuacao: 71 },
  { semana: 'S3', pontuacao: 68 },
  { semana: 'S4', pontuacao: 75 },
  { semana: 'S5', pontuacao: 80 },
  { semana: 'S6', pontuacao: 85 },
]

export const mockReminders: Reminder[] = [
  { id: '1', profissional_id: '1', cliente_id: '1', cliente_nome: 'Ana Carolina Silva', questionario_id: '1', questionario_nome: 'Check-in Semanal', data_envio_programada: '2026-05-27T08:00:00', tipo: 'inicial', canal: 'whatsapp', status: 'pendente' },
  { id: '2', profissional_id: '1', cliente_id: '2', cliente_nome: 'Bruno Mendes', questionario_id: '1', questionario_nome: 'Check-in Semanal', data_envio_programada: '2026-05-27T08:00:00', tipo: 'inicial', canal: 'ambos', status: 'pendente' },
  { id: '3', profissional_id: '1', cliente_id: '3', cliente_nome: 'Carla Souza', questionario_id: '2', questionario_nome: 'Avaliação Nutricional', data_envio_programada: '2026-05-25T09:00:00', tipo: 'lembrete', canal: 'whatsapp', status: 'enviado' },
  { id: '4', profissional_id: '1', cliente_id: '4', cliente_nome: 'Daniel Costa', questionario_id: '1', questionario_nome: 'Check-in Semanal', data_envio_programada: '2026-05-24T08:00:00', tipo: 'vencimento_plano', canal: 'email', status: 'enviado' },
  { id: '5', profissional_id: '1', cliente_id: '5', cliente_nome: 'Eduarda Lima', questionario_id: '1', questionario_nome: 'Check-in Semanal', data_envio_programada: '2026-05-23T10:00:00', tipo: 'lembrete', canal: 'whatsapp', status: 'falhou' },
]

export const mockFinancialEntries: FinancialEntry[] = [
  { id: '1', profissional_id: '1', cliente_nome: 'Ana Carolina Silva', servico_nome: 'Plano Trimestral', valor: 540, data: '2026-05-01' },
  { id: '2', profissional_id: '1', cliente_nome: 'Eduarda Lima', servico_nome: 'Plano Semestral', valor: 1020, data: '2026-05-05' },
  { id: '3', profissional_id: '1', cliente_nome: 'Carla Souza', servico_nome: 'Consulta Presencial', valor: 200, data: '2026-05-10' },
  { id: '4', profissional_id: '1', cliente_nome: 'Gabriela Santos', servico_nome: 'Plano Trimestral', valor: 540, data: '2026-05-12' },
  { id: '5', profissional_id: '1', cliente_nome: 'Henrique Alves', servico_nome: 'Plano Semestral', valor: 1020, data: '2026-05-18' },
  { id: '6', profissional_id: '1', cliente_nome: 'João Pereira', servico_nome: 'Consulta Presencial', valor: 200, data: '2026-05-20' },
]
