export type Kind = 'website' | 'minecraft'

export interface Result {
  online: boolean
  latencyMs?: number
  detail?: string
  checkedAt: number
}

const TIMEOUT_MS = 8000

function withTimeout(ms: number) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ms)
  return { signal: controller.signal, done: () => clearTimeout(timer) }
}

/**
 * Website: no-cors-Request. Die Antwort ist opak (kein Statuscode), aber ein
 * Ergebnis bedeutet "Server antwortet", ein Fehler/Timeout bedeutet "nicht erreichbar".
 */
export async function checkWebsite(target: string): Promise<Result> {
  const start = performance.now()
  const t = withTimeout(TIMEOUT_MS)
  try {
    await fetch(target, { mode: 'no-cors', cache: 'no-store', signal: t.signal })
    return { online: true, latencyMs: Math.round(performance.now() - start), checkedAt: Date.now() }
  } catch {
    return { online: false, detail: 'Nicht erreichbar', checkedAt: Date.now() }
  } finally {
    t.done()
  }
}

/** Minecraft (Java): Browser können kein TCP, daher die öffentliche API von mcsrvstat.us. */
export async function checkMinecraft(target: string): Promise<Result> {
  const t = withTimeout(TIMEOUT_MS)
  try {
    const res = await fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(target)}`, { signal: t.signal })
    if (!res.ok) throw new Error(String(res.status))
    const data = await res.json()
    if (!data.online) return { online: false, detail: 'Offline', checkedAt: Date.now() }
    const players = data.players ? `${data.players.online}/${data.players.max} Spieler` : ''
    return {
      online: true,
      detail: [players, data.version].filter(Boolean).join(' · '),
      checkedAt: Date.now(),
    }
  } catch {
    return { online: false, detail: 'Status-Abfrage fehlgeschlagen', checkedAt: Date.now() }
  } finally {
    t.done()
  }
}

export const runCheck = (kind: Kind, target: string) =>
  kind === 'website' ? checkWebsite(target) : checkMinecraft(target)
