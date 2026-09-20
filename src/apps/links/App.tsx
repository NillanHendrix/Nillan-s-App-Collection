import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'

interface Link {
  id: string
  url: string
  title: string
  tags: string[]
}

function normalizeUrl(raw: string) {
  const value = raw.trim()
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

export default function LinksApp() {
  const [links, setLinks] = useState<Link[]>([])
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [tags, setTags] = useState('')
  const [filter, setFilter] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase
      .from('links_items')
      .select('id, url, title, tags')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setLinks(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e: FormEvent) {
    e.preventDefault()
    if (!url.trim()) return
    let normalized: string
    try {
      normalized = new URL(normalizeUrl(url)).toString()
    } catch {
      return setError('Ungültige URL')
    }
    setError('')
    // user_id wird per Default (auth.uid()) in der DB gesetzt.
    const { error } = await supabase.from('links_items').insert({
      url: normalized,
      title: title.trim(),
      tags: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
    })
    if (error) return setError(error.message)
    setUrl('')
    setTitle('')
    setTags('')
    load()
  }

  async function remove(id: string) {
    const { error } = await supabase.from('links_items').delete().eq('id', id)
    if (error) return setError(error.message)
    load()
  }

  const allTags = useMemo(() => [...new Set(links.flatMap((l) => l.tags))].sort(), [links])
  const visible = filter ? links.filter((l) => l.tags.includes(filter)) : links

  return (
    <div className="links">
      <h1>Links</h1>
      <form onSubmit={add}>
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" required />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titel (optional)" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags, kommagetrennt" />
        <button type="submit">Speichern</button>
      </form>
      {error && <p role="alert">{error}</p>}
      {allTags.length > 0 && (
        <div className="tags">
          <button className={filter === '' ? 'active' : ''} onClick={() => setFilter('')}>Alle</button>
          {allTags.map((t) => (
            <button key={t} className={filter === t ? 'active' : ''} onClick={() => setFilter(t)}>#{t}</button>
          ))}
        </div>
      )}
      <ul>
        {visible.map((l) => (
          <li key={l.id}>
            <div>
              <a href={l.url} target="_blank" rel="noopener noreferrer">{l.title || l.url}</a>
              {l.title && <small>{new URL(l.url).hostname}</small>}
              {l.tags.length > 0 && <small>{l.tags.map((t) => `#${t}`).join(' ')}</small>}
            </div>
            <button onClick={() => remove(l.id)} aria-label="Löschen">✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
