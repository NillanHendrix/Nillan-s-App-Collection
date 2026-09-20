import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../../lib/supabase'

interface Note {
  id: string
  text: string
}

export default function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  async function load() {
    const { data, error } = await supabase
      .from('notes_items')
      .select('id, text')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setNotes(data)
  }

  useEffect(() => {
    load()
  }, [])

  async function add(e: FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    // user_id wird per Default (auth.uid()) in der DB gesetzt.
    const { error } = await supabase.from('notes_items').insert({ text })
    if (error) return setError(error.message)
    setText('')
    load()
  }

  async function remove(id: string) {
    const { error } = await supabase.from('notes_items').delete().eq('id', id)
    if (error) return setError(error.message)
    load()
  }

  return (
    <div className="notes">
      <h1>Notizen</h1>
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Neue Notiz…" />
        <button type="submit">Hinzufügen</button>
      </form>
      {error && <p role="alert">{error}</p>}
      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <span>{n.text}</span>
            <button onClick={() => remove(n.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
