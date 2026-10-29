import { spawn } from 'node:child_process'
import { falar } from './fala.js'
import { resumir } from './resumo.js'

const comando = process.argv
  .slice(2)
  .map((argumento) => (/[\s"]/.test(argumento) ? `"${argumento.replace(/"/g, '\\"')}"` : argumento))
  .join(' ')
const ultimas = []
const dentroDoAlethe = Boolean(process.env.ALETHE_PLANNER) && process.env.FALA_LOCAL !== '1'

// dentro do Alethe a sequência 7777 pede pro app falar com a voz deste terminal e mostrar o assistente
async function anunciar(frase) {
  if (dentroDoAlethe) {
    process.stdout.write(`\x1b]7777;voice;${Buffer.from(frase).toString('base64')}\x07`)
    return
  }
  await falar(frase)
}

function guardar(pedaco) {
  ultimas.push(...pedaco.toString().split('\n'))
  ultimas.splice(0, Math.max(0, ultimas.length - 80))
}

const filho = spawn(comando, { shell: true, stdio: ['inherit', 'pipe', 'pipe'], env: { ...process.env, FORCE_COLOR: '1' } })
filho.stdout.on('data', (pedaco) => (process.stdout.write(pedaco), guardar(pedaco)))
filho.stderr.on('data', (pedaco) => (process.stderr.write(pedaco), guardar(pedaco)))

function fraseFixa(codigo) {
  const passou = codigo === 0
  if (/test/.test(comando)) return passou ? '[excited] Os testes passaram.' : '[sighing][tired] Os testes quebraram.'
  if (/build/.test(comando)) return passou ? '[excited] O build terminou.' : '[sighing][tired] O build quebrou.'
  return passou ? '[excited] Terminou, deu tudo certo.' : '[sighing][tired] Deu erro.'
}

filho.on('close', async (codigo) => {
  const saida = ultimas.join('\n').replace(/\x1b\[[0-9;]*m/g, '')
  const frase =
    process.env.FALA_RESUMO === '1'
      ? resumir(saida, `o comando "${comando}" terminou com código ${codigo} (${codigo === 0 ? 'passou' : 'quebrou'})`)
      : fraseFixa(codigo)
  await anunciar(frase)
  process.exit(codigo ?? 1)
})
