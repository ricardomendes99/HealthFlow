import { chromium } from 'playwright'
const BASE = 'http://localhost:5173'
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe' })
const context = await browser.newContext()

// Autenticar antes de criar a página
await context.addInitScript(() => {
  localStorage.setItem('hf_user', JSON.stringify({
    id: '1', nome: 'Dr. Ricardo Junin', email: 'r@r.com',
    profissao: 'Nutricionista', slug: 'dr-ricardo-junin'
  }))
})

const page = await context.newPage()
const jsErrors = []
page.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon') && !m.text().includes('supabase')) jsErrors.push(m.text()) })

const allPages = ['/', '/login', '/cadastro', '/p/dr-ricardo-junin', '/app/clientes', '/app/servicos', '/app/questionarios', '/app/respostas', '/app/lembretes', '/app/area-cliente']

for (const url of allPages) {
  try {
    await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 15000 })
    await page.waitForTimeout(800)
    const h1 = await page.$eval('h1', el => el.textContent).catch(() => '—')
    console.log(`✅ ${url.padEnd(28)} H1: ${h1.trim().slice(0, 50)}`)
  } catch (e) {
    console.log(`❌ ${url.padEnd(28)} ${e.message.slice(0, 60)}`)
  }
}

if (jsErrors.length) {
  console.log('\n⚠️  Erros JS:')
  jsErrors.forEach(e => console.log('  ', e))
} else {
  console.log('\n✅ Sem erros de JavaScript')
}
await browser.close()
