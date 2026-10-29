import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const pasta = path.dirname(fileURLToPath(import.meta.url))
process.loadEnvFile(path.join(pasta, '.env'))

export async function falar(texto, voz = process.env.FISH_VOICE) {
  const inicio = performance.now()
  const resposta = await fetch('https://api.fish.audio/v1/tts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.FISH_API_KEY}`,
      'Content-Type': 'application/json',
      model: 's2.1-pro-free',
    },
    body: JSON.stringify({ text: texto, reference_id: voz, format: 'mp3', latency: 'balanced' }),
  })
  if (!resposta.ok) throw new Error(`Fish Audio respondeu ${resposta.status}: ${await resposta.text()}`)

  const player = spawn('ffplay', ['-nodisp', '-autoexit', '-loglevel', 'quiet', '-fflags', 'nobuffer', '-probesize', '32', '-analyzeduration', '0', '-f', 'mp3', '-i', 'pipe:0'], {
    stdio: ['pipe', 'ignore', 'ignore'],
    windowsHide: true,
  })
  let primeiro = true
  for await (const pedaco of resposta.body) {
    if (primeiro) {
      console.error(`primeiro áudio em ${Math.round(performance.now() - inicio)} ms`)
      primeiro = false
    }
    player.stdin.write(pedaco)
  }
  player.stdin.end()
  await new Promise((resolve) => player.on('close', resolve))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await falar(process.argv.slice(2).join(' '))
}
