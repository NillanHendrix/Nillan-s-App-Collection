import { lazy } from 'react'
import type { AppManifest } from '../../registry/types'

const manifest: AppManifest = {
  id: 'monitor',
  name: 'Monitor',
  icon: '📡',
  version: '1.0.0',
  order: 25,
  component: lazy(() => import('./App')),
}

export default manifest
