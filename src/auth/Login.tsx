import { useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthProvider'

export function Login() {
  const { session } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState('')

  if (session) return <Navigate to="/" replace />

  async function submit(e: FormEvent) {
    e.preventDefault()
    setMessage('')
    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    if (error) setMessage(error.message)
    else if (mode === 'signup') setMessage('Bestätigungs-Mail wurde gesendet (falls aktiviert).')
  }

  async function magicLink() {
    const { error } = await supabase.auth.signInWithOtp({ email })
    setMessage(error ? error.message : 'Magic Link gesendet.')
  }

  return (
    <form className="login" onSubmit={submit}>
      <h1>{mode === 'signin' ? 'Anmelden' : 'Registrieren'}</h1>
      <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">{mode === 'signin' ? 'Anmelden' : 'Registrieren'}</button>
      <button type="button" className="link" onClick={magicLink} disabled={!email}>Magic Link senden</button>
      <button type="button" className="link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
        {mode === 'signin' ? 'Noch kein Konto?' : 'Schon ein Konto?'}
      </button>
      {message && <p className="msg">{message}</p>}
    </form>
  )
}
