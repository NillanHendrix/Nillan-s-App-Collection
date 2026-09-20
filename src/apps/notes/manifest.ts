import { lazy } from 'react'
import type { AppManifest } from '../../registry/types'

const manifest: AppManifest = {
  id: 'notes',
  name: 'Notizen',
  icon: '📝',
  version: '1.0.0',
  order: 10,
  component: lazy(() => import('./App')),
}

export default manifest
