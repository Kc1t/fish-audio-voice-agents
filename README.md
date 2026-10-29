# Fish Audio Voice Agents

Agentes de terminal com voz, usando a API da Fish Audio.

Scripts do vídeo **"Dei voz pros meus agentes"** do canal [Kauã Miguel - Dev](https://www.youtube.com/@kc_1t). Com eles, o Claude Code, o Codex ou qualquer agente de terminal te chama em voz alta quando termina, quando quebra e quando precisa de você.

A voz vem da API da [Fish Audio](https://fish.audio), com o modelo **S2.1 Pro**, que está de graça na API até o fim de novembro de 2026.

## O que tem aqui

| Arquivo | O que faz |
|---|---|
| `fala.js` | Manda um texto pra API da Fish Audio e toca o áudio enquanto ele chega |
| `hook.js` | Hook do Claude Code e do Codex: pega a última resposta do agente e fala a primeira frase |
| `aviso.js` | Escolhe a frase (resposta, pedido de permissão ou "tô esperando você") e a voz de cada agente |
| `resumo.js` | Opcional: resume a resposta com o Claude Haiku antes de falar (`FALA_RESUMO=1`) |
| `fala-cmd.js` e `fala.cmd` | Roda qualquer comando e avisa em voz alta se passou ou quebrou (`fala npm test`) |
| `exemplos/claude-code/settings.json` | Os hooks `Stop` e `Notification` do Claude Code |
| `exemplos/codex/config.toml` | O `notify` do Codex |
| `exemplos/regras-de-voz/` | `CLAUDE.md` e `AGENTS.md` que fazem o agente começar a resposta com uma frase curta e uma tag de emoção |

## Requisitos

- [Node.js](https://nodejs.org) 22 ou mais novo
- [FFmpeg](https://ffmpeg.org) no PATH (o `ffplay` toca o áudio)
- Uma conta na Fish Audio

## Passo a passo

1. **Chave da API.** Entre em [fish.audio/app/api-keys](https://fish.audio/app/api-keys), crie uma chave e copie. Não deixe essa chave vazar.
2. **`.env`.** Copie o `.env.example` pra `.env` e cole a chave em `FISH_API_KEY=`.
3. **Voz.** Escolha uma voz em [fish.audio](https://fish.audio), copie o ID dela e cole em `FISH_VOICE=`. Se quiser uma voz diferente pro Codex, coloque em `FISH_VOICE_CODEX=`.
4. **Teste.**
   ```bash
   node fala.js "Terminei a tarefa, pode conferir."
   ```
5. **Emoção.** Coloque a tag em inglês entre colchetes, no começo ou no meio da frase:
   ```bash
   node fala.js "[excited] Os testes passaram de primeira! [sighing] Só que o build quebrou."
   ```
   Funcionam bem: `[excited]`, `[calm]`, `[sighing]`, `[whispering]`, `[laughing]`, `[tired]`. Em português a tag funciona pior.

## Ligar no Claude Code

Copie o conteúdo de `exemplos/claude-code/settings.json` pro `.claude/settings.json` do seu projeto e troque `C:/caminho/para/fish-audio-voice-agents` pelo caminho desta pasta. O `Stop` fala quando o agente termina e o `Notification` fala quando ele pede permissão.

## Ligar no Codex

Copie a linha de `exemplos/codex/config.toml` pro seu `~/.codex/config.toml`, com o caminho desta pasta.

## Fazer o agente falar curto

Sem regra, o agente responde com parágrafos que não fazem sentido em voz alta. Copie `exemplos/regras-de-voz/CLAUDE.md` (Claude Code) ou `AGENTS.md` (Codex, OpenCode e outros) pra raiz do projeto e troque `<seu nome>` pelo seu. A resposta passa a começar com uma tag e uma frase curta, e o hook lê só essa frase.

## Clonar a sua voz

Pelo site: [fish.audio/app/voice-cloning](https://fish.audio/app/voice-cloning). Grave de 10 segundos a 1 minuto, crie a voz e use o ID dela no `FISH_VOICE`. No plano grátis a voz clonada precisa ser pública. Pela API, criar voz pede crédito.

## Usar pelo MCP

Pra conversar com a Fish Audio direto do Claude Code, sem script:

```bash
claude mcp add --transport http fish-audio https://api.fish.audio/mcp
```

Depois rode `/mcp` no Claude Code e autentique. O uso pelo MCP gasta crédito da conta.

## Vários agentes ao mesmo tempo

No vídeo, a versão com quatro agentes, uma voz pra cada terminal e resposta por voz roda no [Alethe](https://github.com/Kc1t/alethe-agents), um app open source pra rodar agentes lado a lado.

## Cuidados

- A gratuidade do S2.1 Pro na API vale até o fim de novembro de 2026. Depois disso, confira o preço no site.
- O texto que vai pra API pode ser usado pra treinar modelos. Não mande segredo, chave ou dado de cliente pra voz.
