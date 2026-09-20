import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Nach einem neuen Deploy existieren alte Chunk-Dateien nicht mehr: einmalig neu laden.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  if (sessionStorage.getItem('chunk-reload') !== '1') {
    sessionStorage.setItem('chunk-reload', '1')
    window.location.reload()
  }
})
window.addEventListener('load', () => sessionStorage.removeItem('chunk-reload'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
