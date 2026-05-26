import { useState } from 'react'
import { Gift, Copy, Check, Star, Users, DollarSign } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function ReferralPage() {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)

  const referralLink = `https://healthflow.autotech.dev.br/cadastro?ref=${user?.slug || 'seu-codigo'}`

  const copy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Gift className="w-5 h-5 text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Indique e Ganhe</h1>
          <p className="text-sm text-slate-500">Indique colegas e ganhe desconto na sua assinatura</p>
        </div>
      </div>

      {/* Como funciona */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: 'Indique um colega', desc: 'Compartilhe seu link exclusivo', color: 'bg-blue-50 text-primary-600' },
          { icon: Star, label: 'Ele assina', desc: 'Seu indicado cria uma conta', color: 'bg-amber-50 text-amber-600' },
          { icon: DollarSign, label: 'Você ganha', desc: '1 mês grátis por indicação', color: 'bg-green-50 text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-sm font-semibold text-slate-800 mb-1">{s.label}</div>
            <div className="text-xs text-slate-500">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Link */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="text-sm font-semibold text-slate-700 mb-3">Seu link de indicação</div>
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
          <span className="text-sm text-slate-600 flex-1 truncate">{referralLink}</span>
          <button
            onClick={copy}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${copied ? 'bg-green-100 text-green-700' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}
          >
            {copied ? <><Check className="w-3.5 h-3.5" /> Copiado!</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3">
          A cada indicação que assinar o HealthFlow, você ganha 1 mês gratuito adicionado automaticamente à sua conta.
        </p>
      </div>
    </div>
  )
}
