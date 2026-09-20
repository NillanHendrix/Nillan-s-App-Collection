import { Suspense } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { findApp } from '../registry'
import { ErrorBoundary } from './ErrorBoundary'

export function AppHost() {
  const { appId } = useParams()
  const app = findApp(appId)
  if (!app) return <Navigate to="/" replace />
  const Component = app.component
  return (
    <ErrorBoundary resetKey={app.id}>
      <Suspense fallback={<p style={{ padding: 24 }}>Lade {app.name}…</p>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  )
}
