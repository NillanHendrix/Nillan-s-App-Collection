import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthProvider'

export function RequireAuth() {
  const { session, loading } = useAuth()
  if (loading) return <p style={{ padding: 24 }}>Lade…</p>
  return session ? <Outlet /> : <Navigate to="/login" replace />
}
