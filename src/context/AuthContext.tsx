import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'

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
      return !error
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
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
        options: { data: { nome_completo: data.nome } },
      })
      if (error || !authData.user) return false

      const slug = slugify(data.nome)
      await supabase.from('professionals').insert({
        id: authData.user.id,
        nome_completo: data.nome,
        email: data.email,
        celular_whatsapp: data.celular,
        profissao: data.profissao,
        slug,
      })
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
