import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

if (process.env.FALA_DENTRO) process.exit(0)
// no Alethe o plugin de voz já fala o fim de cada vez; FALA_HOOKS_NO_ALETHE=1 liga os hooks mesmo assim
if (process.env.ALETHE_PLANNER && process.env.FALA_HOOKS_NO_ALETHE !== '1') process.exit(0)

const pasta = path.dirname(fileURLToPath(import.meta.url))
const origem = process.argv[2] ?? 'claude'
const evento = origem === 'codex' ? JSON.parse(process.argv[3]) : JSON.parse(readFileSync(0, 'utf8'))

function ultimaRespostaDoClaude(transcript) {
  if (!transcript || !existsSync(transcript)) return ''
  const linhas = readFileSync(transcript, 'utf8').trim().split('\n').reverse()
  for (const linha of linhas) {
    const item = JSON.parse(linha)
    if (item.type !== 'assistant') continue
    const texto = item.message.content.filter((parte) => parte.type === 'text').map((parte) => parte.text).join(' ')
    if (texto) return texto
  }
  return ''
}

const aviso =
  origem === 'codex'
    ? { origem, tipo: 'fim', texto: evento['last-assistant-message'] ?? '' }
    : evento.hook_event_name === 'Notification'
      ? { origem, tipo: evento.notification_type === 'idle_prompt' ? 'esperando' : 'permissao', texto: evento.message ?? '' }
      : { origem, tipo: 'fim', texto: evento.last_assistant_message ?? ultimaRespostaDoClaude(evento.transcript_path) }

// o hook roda síncrono, então a fala sai em outro processo e o agente segue na hora
spawn(process.execPath, [path.join(pasta, 'aviso.js'), JSON.stringify(aviso)], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
}).unref()
