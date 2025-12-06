import { Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { useAuthStore } from '../store/auth'

export function RequireAuth({ children }: { children: ReactElement }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/auth" replace />
  return children
}

export function RequireRole({ role, children }: { role: 'admin' | 'operador' | ('admin' | 'operador')[]; children: ReactElement }) {
  const usuario = useAuthStore((s) => s.usuario)
  const roles = Array.isArray(role) ? role : [role]
  if (!usuario || !roles.includes(usuario.rol)) return <Navigate to="/auth" replace />
  return children
}
