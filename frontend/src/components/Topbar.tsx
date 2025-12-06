import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function Topbar() {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  return (
    <header className="h-14 bg-white border-b fixed left-64 right-0 flex items-center justify-between px-4">
      <div className="font-semibold">Bienvenido, {usuario?.nombre}</div>
      <button className="px-3 py-1 rounded bg-primary-600 text-white" onClick={() => { logout(); navigate('/auth') }}>Salir</button>
    </header>
  )
}
