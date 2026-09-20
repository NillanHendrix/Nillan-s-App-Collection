import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { runCheck, type Kind, type Result } from './checks'

interface Target {
  id: string
  kind: Kind
  name: string
  target: string
}

const INTERVAL_MS = 60_000

function normalize(kind: Kind, raw: string) {
  const value = raw.trim()
  if (kind === 'minecraft') return value.replace(/^[a-z]+:\/\//i, '')
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`
  return new URL(withProtocol).toString()
}

export default function MonitorApp() {
  const [targets, setTargets] = useState<Target[]>([])
  const [results, setResults] = useState<Record<string, Result>>({})
  const [kind, setKind] = useState<Kind>('website')
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('monitor_targets')
      .select('id, kind, name, target')
      .order('created_at')
    if (error) setError(error.message)
    else setTargets(data as Target[])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const check = useCallback(async (list: Target[]) => {
    await Promise.all(
      list.map(async (t) => {
        const result = await runCheck(t.kind, t.target)
        setResults((prev) => ({ ...prev, [t.id]: result }))
      }),
    )
  }, [])

  useEffect(() => {
    if (targets.length === 0) return
    check(targets)
    const timer = setInterval(() => check(targets), INTERVAL_MS)
    return () => clearInterval(timer)
  }, [targets, check])

  async function add(e: FormEvent) {
    e.preventDefault()
    let target: string
    try {
      target = normalize(kind, address)
    } catch {
      return setError('Ungültige Adresse')
    }
    setError('')
    // user_id wird per Default (auth.uid()) in der DB gesetzt.
    const { error } = await supabase
      .from('monitor_targets')
      .insert({ kind, name: name.trim() || target, target })
    if (error) return setError(error.message)
    setName('')
    setAddress('')
    load()
  }

  async function remove(id: string) {
    const { error } = await supabase.from('monitor_targets').delete().eq('id', id)
    if (error) return setError(error.message)
    load()
  }

  return (
    <div className="monitor">
      <h1>Monitor</h1>
      <form onSubmit={add}>
        <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
          <option value="website">Website</option>
          <option value="minecraft">Minecraft-Server</option>
        </select>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name (optional)" />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={kind === 'website' ? 'example.com' : 'mc.example.com oder mc.example.com:25566'}
          required
        />
        <button type="submit">Hinzufügen</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {targets.length > 0 && (
        <p>
          <button onClick={() => check(targets)}>Jetzt prüfen</button> <small>Automatisch alle 60 s, solange die App offen ist.</small>
        </p>
      )}
      <ul>
        {targets.map((t) => {
          const r = results[t.id]
          const state = r ? (r.online ? 'up' : 'down') : 'pending'
          return (
            <li key={t.id}>
              <span className={`dot ${state}`} aria-label={state} />
              <div>
                <strong>{t.name}</strong>
                <small>{t.kind === 'minecraft' ? '⛏ ' : '🌐 '}{t.target}</small>
                <small>
                  {r
                    ? [r.online ? 'Online' : 'Offline', r.latencyMs != null && `${r.latencyMs} ms`, r.detail]
                        .filter(Boolean)
                        .join(' · ')
                    : 'Prüfe…'}
                </small>
              </div>
              <button onClick={() => remove(t.id)} aria-label="Löschen">✕</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
