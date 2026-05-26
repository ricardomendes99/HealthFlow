import { MessageSquare, Phone, Mail, Clock } from 'lucide-react'

export default function SupportPage() {
  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Falar com o Suporte</h1>
          <p className="text-sm text-slate-500">Estamos aqui para ajudar</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* WhatsApp */}
        <a
          href="https://wa.me/5511999999999?text=Olá,%20preciso%20de%20suporte%20com%20o%20HealthFlow"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-green-300 hover:bg-green-50 transition-colors group"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">WhatsApp</div>
            <div className="text-sm text-slate-500">Resposta em até 2 horas no horário comercial</div>
          </div>
          <div className="ml-auto text-green-600 font-semibold text-sm">Abrir →</div>
        </a>

        {/* Email */}
        <a
          href="mailto:suporte@healthflow.app?subject=Suporte HealthFlow"
          className="flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
            <Mail className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">E-mail</div>
            <div className="text-sm text-slate-500">suporte@healthflow.app</div>
          </div>
          <div className="ml-auto text-primary-600 font-semibold text-sm">Enviar →</div>
        </a>

        {/* Horário */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-2xl p-5">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Clock className="w-6 h-6 text-slate-500" />
          </div>
          <div>
            <div className="font-semibold text-slate-700">Horário de atendimento</div>
            <div className="text-sm text-slate-500">Segunda a sexta, das 9h às 18h</div>
          </div>
        </div>
      </div>
    </div>
  )
}
