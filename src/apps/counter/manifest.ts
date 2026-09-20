import { lazy } from 'react'
import type { AppManifest } from '../../registry/types'

const manifest: AppManifest = {
  id: 'counter',
  name: 'Zähler',
  icon: '🔢',
  version: '1.0.0',
  order: 20,
  component: lazy(() => import('./App')),
}

export default manifest
