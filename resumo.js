import { spawnSync } from 'node:child_process'

const instrucao = `Resuma em uma frase falada, curta, em português do Brasil.
Comece com uma tag de emoção em inglês entre colchetes: [excited] se passou, [sighing][tired] se quebrou, [whispering] se precisa de permissão.
Responda só a frase, sem aspas e sem travessão.`

export function resumir(saida, situacao) {
  const prompt = `${instrucao}\n\nSituação: ${situacao}\n\n${saida.slice(-4000)}`
  const resultado = spawnSync('claude -p --model haiku', {
    input: prompt,
    encoding: 'utf8',
    shell: true,
    windowsHide: true,
    env: { ...process.env, FALA_DENTRO: '1' },
  })
  return resultado.stdout.trim() || '[sighing] Terminou, mas não consegui resumir.'
}
