import { createClient } from '@supabase/supabase-js'

export const APP_DOMAIN =
  (import.meta.env.VITE_APP_DOMAIN as string | undefined) ?? 'healthflow.autotech.dev.br'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = (SUPABASE_URL && SUPABASE_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_KEY)
  : null

export const isSupabaseConfigured = (): boolean => supabase !== null

// Mantido para compatibilidade com main.tsx (agora é no-op)
export async function initSupabase(): Promise<void> {}
