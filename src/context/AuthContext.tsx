import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import { adminCreateUser, adminVerifyPassword, adminLoginByEmail, adminAuthAvailable } from '../lib/adminAuth'

interface User {
  id: string
  nome: string
  email: string
  profissao: string
  slug: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (data: RegisterData) => Promise<boolean>
}

interface RegisterData {
  nome: string
  email: string
  celular: string
  senha: string
  profissao: string
  cupom?: string
}

const AuthContext = createContext<AuthContextType | null>(null)

const mockUser: User = {
  id: '1',
  nome: 'Dr. Ricardo Junin',
  email: 'ricardo@healthflow.com.br',
  profissao: 'Nutricionista',
  slug: 'dr-ricardo-junin',
}

function slugify(nome: string) {
  return nome.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hf_user')
    return stored ? JSON.parse(stored) : null
  })

  // Sincroniza sessão Supabase ao inicializar (quando configurado)
  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        loadProfile(data.session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id)
      } else {
        setUser(null)
        localStorage.removeItem('hf_user')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadProfile(uid: string) {
    if (!supabase) return
    const { data } = await supabase
      .from('professionals')
      .select('id, nome_completo, email, profissao, slug')
      .eq('id', uid)
      .single()

    if (data) {
      const u: User = { id: data.id, nome: data.nome_completo, email: data.email, profissao: data.profissao, slug: data.slug }
      setUser(u)
      localStorage.setItem('hf_user', JSON.stringify(u))
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // --- Supabase Auth ---
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) return true

      const isEmailDisabled = error.message?.toLowerCase().includes('disabled') ||
        (error as { code?: string }).code === 'email_provider_disabled'

      if (isEmailDisabled) {
        if (!email || !password) return false

        // Validar senha via função SQL (bcrypt no banco) — não exige email provider
        if (adminAuthAvailable()) {
          const senhaValida = await adminVerifyPassword(email, password)
          if (!senhaValida) return false
          return adminLoginByEmail(supabase, email)
        }

        // Fallback final: refresh token armazenado (sessão anterior)
        const envToken = import.meta.env.VITE_SUPABASE_REFRESH_TOKEN as string | undefined
        const localToken = localStorage.getItem('hf_rt') ?? undefined
        for (const token of [localToken, envToken].filter((t): t is string => !!t)) {
          const res = await fetch(
            `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY as string },
              body: JSON.stringify({ refresh_token: token }),
            }
          )
          if (!res.ok) continue
          const tokens = await res.json() as { access_token: string; refresh_token: string }
          localStorage.setItem('hf_rt', tokens.refresh_token)
          const { error: setErr } = await supabase.auth.setSession({ access_token: tokens.access_token, refresh_token: tokens.refresh_token })
          if (!setErr) return true
        }
        return false
      }
      return false
    }

    // --- Mock fallback ---
    await new Promise(r => setTimeout(r, 800))
    if (!email) return false
    const u = { ...mockUser, email }
    setUser(u)
    localStorage.setItem('hf_user', JSON.stringify(u))
    return true
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setUser(null)
    localStorage.removeItem('hf_user')
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    // --- Supabase Auth ---
    if (supabase) {
      let userId: string | null = null

      // Tentar registro normal (funciona quando email provider está habilitado)
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: { data: { nome_completo: data.nome } },
      })

      const isEmailDisabled = error?.message?.toLowerCase().includes('disabled') ||
        (error as { code?: string } | null)?.code === 'email_provider_disabled'

      if (!error && authData.user) {
        userId = authData.user.id
      } else if (isEmailDisabled && adminAuthAvailable()) {
        // Criar usuário via admin API quando email provider está desabilitado
        const newUser = await adminCreateUser(data.email, data.senha, data.nome)
        if (!newUser?.id) return false
        userId = newUser.id

        // Auto-login via magic link
        const ok = await adminLoginByEmail(supabase, data.email)
        if (!ok) return false
      } else {
        return false
      }

      // Inserir/atualizar registro de profissional
      const slug = slugify(data.nome)
      await supabase.from('professionals').upsert({
        id: userId,
        nome_completo: data.nome,
        email: data.email,
        celular_whatsapp: data.celular,
        profissao: data.profissao,
        slug,
      }, { onConflict: 'id' })
      return true
    }

    // --- Mock fallback ---
    await new Promise(r => setTimeout(r, 1000))
    const u: User = { id: String(Date.now()), nome: data.nome, email: data.email, profissao: data.profissao, slug: slugify(data.nome) }
    setUser(u)
    localStorage.setItem('hf_user', JSON.stringify(u))
    return true
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
