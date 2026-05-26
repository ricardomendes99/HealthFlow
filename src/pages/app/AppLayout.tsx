import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { APP_DOMAIN } from '../../lib/supabase'
import {
  Zap, Users, Briefcase, FileText, BarChart2, Bell,
  Layout, BookOpen, MessageSquare, Gift, ChevronLeft,
  ChevronRight, Copy, ExternalLink, LogOut, ChevronDown
} from 'lucide-react'

interface NavItem {
  to?: string
  icon: React.ElementType
  label: string
  children?: { to: string; label: string }[]
}

const NAV_ITEMS: NavItem[] = [
  {
    icon: Users, label: 'Gestão de Clientes',
    children: [
      { to: '/app/clientes', label: 'Clientes' },
      { to: '/app/clientes?importar=1', label: 'Importação' },
    ]
  },
  { to: '/app/servicos', icon: Briefcase, label: 'Serviços' },
  { to: '/app/questionarios', icon: FileText, label: 'Questionários' },
  { to: '/app/respostas', icon: BarChart2, label: 'Respostas' },
  { to: '/app/lembretes', icon: Bell, label: 'Lembretes' },
  { to: '/app/area-cliente', icon: Layout, label: 'Área do Cliente' },
  { to: '#', icon: BookOpen, label: 'Tutoriais' },
  { to: '#', icon: MessageSquare, label: 'Falar com o Suporte' },
  { to: '#', icon: Gift, label: 'Indique e Ganhe' },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>('Gestão de Clientes')
  const [copied, setCopied] = useState(false)

  const clientUrl = `${APP_DOMAIN}/p/${user?.slug || 'seu-slug'}`

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${clientUrl}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black text-slate-900">HealthFlow</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto">
              <Zap className="w-5 h-5 text-white" />
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className={`text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 ${collapsed ? 'mx-auto' : ''}`}>
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Client URL badge */}
        {!collapsed && (
          <div className="m-3 bg-primary-50 border border-primary-100 rounded-xl p-3">
            <div className="text-xs text-slate-500 mb-1">Área do cliente</div>
            <div className="text-xs font-mono text-primary-700 truncate mb-2">{clientUrl}</div>
            <div className="flex gap-1.5">
              <button onClick={copyLink} className="flex items-center gap-1 text-xs bg-white border border-primary-200 text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors">
                <Copy className="w-3 h-3" />
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
              <a href={`/p/${user?.slug}`} target="_blank" rel="noopener" className="flex items-center gap-1 text-xs bg-white border border-primary-200 text-primary-700 px-2 py-1 rounded-lg hover:bg-primary-50 transition-colors">
                <ExternalLink className="w-3 h-3" />
                Abrir
              </a>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {NAV_ITEMS.map(item => {
            if (item.children) {
              const isOpen = openGroup === item.label
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : item.label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isOpen ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {isOpen && !collapsed && (
                    <div className="ml-8 mt-0.5 space-y-0.5">
                      {item.children.map(child => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-xl text-sm transition-colors ${isActive ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`
                          }
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <NavLink
                key={item.label}
                to={item.to!}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-slate-100 p-3">
          {collapsed ? (
            <button onClick={handleLogout} className="w-full flex justify-center p-2 text-slate-400 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-primary-700">{user?.nome?.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{user?.nome}</div>
                <div className="text-xs text-slate-500 truncate">{user?.email}</div>
              </div>
              <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
