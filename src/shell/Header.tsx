import { NavLink } from 'react-router-dom'
import { apps } from '../registry'
import { supabase } from '../lib/supabase'
import { useAuth } from '../auth/AuthProvider'

export function Header() {
  const { session } = useAuth()
  return (
    <header className="header">
      <NavLink to="/" end className="brand">Everything</NavLink>
      <nav>
        {apps.map((app) => (
          <NavLink key={app.id} to={`/apps/${app.id}`} title={`v${app.version}`}>
            <span>{app.icon}</span> {app.name}
          </NavLink>
        ))}
      </nav>
      <div className="user">
        <span>{session?.user.email}</span>
        <button onClick={() => supabase.auth.signOut()}>Abmelden</button>
      </div>
    </header>
  )
}
