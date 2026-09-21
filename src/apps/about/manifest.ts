import { lazy } from 'react'
import type { AppManifest } from '../../registry/types'

const manifest: AppManifest = {
  id: 'about',
  name: 'Über mich',
  icon: '🙋',
  version: '1.0.0',
  order: 40,
  component: lazy(() => import('./App')),
}

export default manifest
