import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'
import { Bars3Icon } from '@heroicons/react/24/outline'

type Props = { onMenuClick: () => void }

export default function Topbar({ onMenuClick }: Props) {
  const usuario = useAuthStore((s) => s.usuario)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  return (
    <header className="h-14 bg-white border-b fixed top-0 left-0 right-0 md:left-64 flex items-center justify-between px-4 z-10 transition-all duration-300">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden p-1 -ml-2 text-gray-600 hover:text-gray-900">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <div className="font-semibold truncate max-w-[200px]">Bienvenido, {usuario?.nombre}</div>
      </div>
      <button className="px-3 py-1 rounded bg-primary-600 text-white hover:bg-primary-700 transition-colors" onClick={() => { logout(); navigate('/auth') }}>Salir</button>
    </header>
  )
}
