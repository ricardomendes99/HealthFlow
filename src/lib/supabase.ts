// Supabase client com import dinâmico opaco ao Vite.
// new Function('pkg', 'return import(pkg)') impede a análise estática do bundler,
// então o build local não falha mesmo sem o pacote instalado.
// No VPS (Docker), npm install instala o pacote e tudo funciona normalmente.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let supabase: any = null

export const APP_DOMAIN =
  (import.meta.env.VITE_APP_DOMAIN as string | undefined) ?? 'healthflow.autotech.dev.br'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export async function initSupabase(): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return
  try {
    // Import opaco: Vite não analisa estaticamente, não falha sem o pacote instalado
    const dynamicImport = new Function('pkg', 'return import(pkg)')
    const mod = await dynamicImport('@supabase/supabase-js')
    supabase = mod.createClient(SUPABASE_URL, SUPABASE_KEY)
  } catch {
    console.warn('[HealthFlow] @supabase/supabase-js não encontrado — usando mock data')
  }
}

export const isSupabaseConfigured = (): boolean => supabase !== null
