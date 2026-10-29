import { falar } from './fala.js'
import { resumir } from './resumo.js'

const { origem, tipo, texto } = JSON.parse(process.argv[2])

function primeiraFrase(texto) {
  const limpo = texto.replace(/[`*#>_]/g, '').replace(/\s+/g, ' ').trim()
  const frase = limpo.match(/^.{1,200}?[.!?](\s|$)/)?.[0] ?? limpo.slice(0, 200)
  return frase.trim()
}

const fixas = {
  permissao: '[whispering] Preciso da sua permissão pra continuar.',
  esperando: '[calm] Tô esperando você.',
}

const frase =
  process.env.FALA_RESUMO === '1'
    ? resumir(texto, tipo === 'fim' ? 'o agente terminou a tarefa' : 'o agente precisa de permissão')
    : (fixas[tipo] ?? primeiraFrase(texto))

const voz = origem === 'codex' ? process.env.FISH_VOICE_CODEX || process.env.FISH_VOICE : process.env.FISH_VOICE
await falar(frase, voz)
