import { Link } from 'react-router-dom'
import { apps } from '../registry'

export function Home() {
  return (
    <div className="home">
      <h1>Deine Apps</h1>
      <div className="grid">
        {apps.map((app) => (
          <Link key={app.id} to={`/apps/${app.id}`} className="card">
            <div className="icon">{app.icon}</div>
            <strong>{app.name}</strong>
            <small>v{app.version}</small>
          </Link>
        ))}
      </div>
    </div>
  )
}
