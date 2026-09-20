import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider'
import { Login } from './auth/Login'
import { RequireAuth } from './auth/RequireAuth'
import { AppHost } from './shell/AppHost'
import { Home } from './shell/Home'
import { Layout } from './shell/Layout'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="apps/:appId/*" element={<AppHost />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
