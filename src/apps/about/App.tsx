import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { supabase } from '../../lib/supabase'
import { renderMarkdown } from './markdown'

interface Page {
  id: string
  title: string
  content: string
}

const START_TITLE = 'Über mich'
const START_CONTENT = `# Über mich

Hallo! Ich bin **Niko**. Bearbeite diese Seite über den Editor.

- Markdown wird live angezeigt
- Mit [[Doppelklammern]] verlinkst du andere Seiten
`

export default function AboutApp() {
  const [pages, setPages] = useState<Page[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [editing, setEditing] = useState(false)
  const [status, setStatus] = useState<'saved' | 'saving' | 'dirty'>('saved')
  const [error, setError] = useState('')
  const saveTimer = useRef<number>(undefined)

  const active = pages.find((p) => p.id === activeId)
  const titles = useMemo(() => pages.map((p) => p.title), [pages])
  const html = useMemo(() => renderMarkdown(draft, titles), [draft, titles])

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('about_pages')
        .select('id, title, content')
        .order('title')
      if (error) return setError(error.message)
      if (data.length === 0) {
        const { data: created, error: e2 } = await supabase
          .from('about_pages')
          .insert({ title: START_TITLE, content: START_CONTENT })
          .select('id, title, content')
          .single()
        if (e2) return setError(e2.message)
        setPages([created])
        select(created)
      } else {
        setPages(data)
        select(data.find((p) => p.title === START_TITLE) ?? data[0])
      }
    })()
    return () => window.clearTimeout(saveTimer.current)
  }, [])

  function select(p: Page) {
    window.clearTimeout(saveTimer.current)
    setActiveId(p.id)
    setDraft(p.content)
    setStatus('saved')
  }

  async function save(id: string, content: string) {
    setStatus('saving')
    const { error } = await supabase
      .from('about_pages')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
    if (error) {
      setError(error.message)
      return setStatus('dirty')
    }
    setError('')
    setPages((ps) => ps.map((p) => (p.id === id ? { ...p, content } : p)))
    setStatus('saved')
  }

  function onChange(value: string) {
    setDraft(value)
    setStatus('dirty')
    window.clearTimeout(saveTimer.current)
    if (activeId) saveTimer.current = window.setTimeout(() => save(activeId, value), 800)
  }

  async function create(title: string): Promise<Page | null> {
    const { data, error } = await supabase
      .from('about_pages')
      .insert({ title, content: `# ${title}\n` })
      .select('id, title, content')
      .single()
    if (error) {
      setError(error.message)
      return null
    }
    setPages((ps) => [...ps, data].sort((a, b) => a.title.localeCompare(b.title)))
    return data
  }

  async function addPage() {
    const title = prompt('Titel der neuen Seite?')?.trim()
    if (!title) return
    const existing = pages.find((p) => p.title.toLowerCase() === title.toLowerCase())
    const page = existing ?? (await create(title))
    if (page) {
      select(page)
      setEditing(true)
    }
  }

  async function removePage() {
    if (!active || !confirm(`Seite „${active.title}“ löschen?`)) return
    const { error } = await supabase.from('about_pages').delete().eq('id', active.id)
    if (error) return setError(error.message)
    const rest = pages.filter((p) => p.id !== active.id)
    setPages(rest)
    if (rest[0]) select(rest[0])
    else {
      setActiveId(null)
      setDraft('')
    }
  }

  async function onPreviewClick(e: MouseEvent) {
    const el = (e.target as HTMLElement).closest<HTMLElement>('a[data-wiki]')
    if (!el) return
    e.preventDefault()
    const title = el.dataset.wiki!
    const page =
      pages.find((p) => p.title.toLowerCase() === title.toLowerCase()) ?? (await create(title))
    if (page) select(page)
  }

  return (
    <div className="about">
      <aside>
        <button onClick={addPage}>+ Neue Seite</button>
        <ul>
          {pages.map((p) => (
            <li key={p.id}>
              <button className={p.id === activeId ? 'active' : ''} onClick={() => select(p)}>
                {p.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <section>
        {error && <p role="alert">{error}</p>}
        {active && (
          <>
            <div className="toolbar">
              <button onClick={() => setEditing((v) => !v)}>
                {editing ? 'Nur Ansicht' : 'Bearbeiten'}
              </button>
              <button onClick={removePage}>Löschen</button>
              <span className="status">
                {status === 'saved' ? 'Gespeichert' : status === 'saving' ? 'Speichert…' : 'Ungespeichert'}
              </span>
            </div>
            <div className={editing ? 'panes split' : 'panes'}>
              {editing && (
                <textarea
                  value={draft}
                  onChange={(e) => onChange(e.target.value)}
                  spellCheck={false}
                />
              )}
              <article
                className="preview"
                onClick={onPreviewClick}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          </>
        )}
      </section>
    </div>
  )
}
