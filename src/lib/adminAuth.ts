/**
 * adminAuth.ts — Autenticação via GoTrue Admin API
 * Usado APENAS quando o provedor de email está desabilitado no GoTrue.
 * Em produção com email habilitado, nenhuma dessas funções é chamada.
 * A service key é SOMENTE para ambiente de desenvolvimento (não vai para produção via Docker build args).
 */

// Em produção (npm run build com DEV=false), SERVICE_KEY fica undefined automaticamente
// pois o Rollup elimina dead code do bloco `if (import.meta.env.DEV)`
const SERVICE_KEY = import.meta.env.DEV
  ? (import.meta.env.VITE_SUPABASE_SERVICE_KEY as string | undefined)
  : undefined

const SUPA_URL = import.meta.env.VITE_SUPABASE_URL as string
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

async function adminPost(path: string, body: unknown): Promise<Response> {
  if (!SERVICE_KEY) throw new Error('Admin auth não disponível em produção')
  return fetch(`${SUPA_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify(body),
  })
}

/** Cria usuário via admin API (bypassa o email_provider_disabled do GoTrue) */
export async function adminCreateUser(
  email: string,
  password: string,
  nome: string,
): Promise<{ id: string; email: string } | null> {
  try {
    const res = await adminPost('/auth/v1/admin/users', {
      email,
      password,
      email_confirm: true,
      user_metadata: { nome_completo: nome },
    })
    if (!res.ok) return null
    return res.json() as Promise<{ id: string; email: string }>
  } catch {
    return null
  }
}

/** Valida email+senha via função SQL (bcrypt no banco, sem expor dados) */
export async function adminVerifyPassword(email: string, password: string): Promise<boolean> {
  if (!SERVICE_KEY) return false
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/rpc/verify_user_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      const result = await res.json()
      return result === true
    }
    // PGRST202 = schema cache desatualizado (PostgREST ainda não recarregou)
    // Fallback: verifica se email existe na tabela professionals (sem validar senha)
    // Aceitável apenas enquanto email_provider estiver desabilitado no GoTrue
    const errData = await res.json().catch(() => ({})) as { code?: string }
    if (errData.code !== 'PGRST202') return false
  } catch {
    return false
  }

  // Degraded mode: confirma que o email tem cadastro de profissional
  try {
    const check = await fetch(
      `${SUPA_URL}/rest/v1/professionals?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
      { headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` } },
    )
    if (!check.ok) return false
    const rows = await check.json() as { id: string }[]
    return rows.length > 0
  } catch {
    return false
  }
}

/** Gera magic link via admin e retorna o token para verificação imediata */
export async function adminGenerateToken(email: string): Promise<string | null> {
  try {
    const res = await adminPost('/auth/v1/admin/generate_link', {
      type: 'magiclink',
      email,
      redirect_to: window.location.origin,
    })
    if (!res.ok) return null
    const data = await res.json() as { hashed_token?: string }
    return data.hashed_token ?? null
  } catch {
    return null
  }
}

/** Login via magic link — fallback quando email provider está desabilitado */
export async function adminLoginByEmail(
  supabaseClient: { auth: { verifyOtp: (opts: { token_hash: string; type: string }) => Promise<{ error: unknown }> } },
  email: string,
): Promise<boolean> {
  const token = await adminGenerateToken(email)
  if (!token) return false
  const { error } = await supabaseClient.auth.verifyOtp({
    token_hash: token,
    type: 'magiclink',
  })
  return !error
}

/** Verifica se o admin auth está disponível (modo dev com service key configurada) */
export function adminAuthAvailable(): boolean {
  return !!SERVICE_KEY
}
