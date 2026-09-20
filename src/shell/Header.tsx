import { NavLink } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthProvider'
import { AppMenu } from './AppMenu'

export function Header() {
  const { session } = useAuth()
  return (
    <header className="header">
      <NavLink to="/" end className="brand">Everything</NavLink>
      <AppMenu />
      <div className="user">
        <span>{session?.user.email}</span>
        <button onClick={() => supabase.auth.signOut()}>Abmelden</button>
      </div>
    </header>
  )
}
