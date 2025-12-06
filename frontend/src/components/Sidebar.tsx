import { NavLink } from 'react-router-dom'
import { HomeIcon, CubeIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, BellAlertIcon, UsersIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/auth'

const base = 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-600/10'
const active = 'text-primary-700 font-semibold'

type Props = { isOpen: boolean; onClose: () => void }

export default function Sidebar({ isOpen, onClose }: Props) {
  const usuario = useAuthStore((s) => s.usuario)
  const admin = usuario?.rol === 'admin'
  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4">
          <div className="text-primary-700 font-bold text-lg">Control de Inventario</div>
          <button onClick={onClose} className="md:hidden text-gray-500 hover:text-gray-700">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col p-2 gap-1 overflow-y-auto h-[calc(100%-4rem)]">
          {admin && (
            <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose} end>
              <HomeIcon className="w-5" />
              <span>Dashboard</span>
            </NavLink>
          )}
          {admin && (
            <NavLink to="/inventario" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose}>
              <CubeIcon className="w-5" />
              <span>Inventario</span>
            </NavLink>
          )}
          {admin && (
            <NavLink to="/entradas" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose}>
              <ArrowUpTrayIcon className="w-5" />
              <span>Registrar Entrada</span>
            </NavLink>
          )}
          <NavLink to="/salidas" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose}>
            <ArrowDownTrayIcon className="w-5" />
            <span>Registrar Salida</span>
          </NavLink>
          {admin && (
            <NavLink to="/alertas" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose}>
              <BellAlertIcon className="w-5" />
              <span>Alertas</span>
            </NavLink>
          )}
          {admin && (
            <NavLink to="/usuarios" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose}>
              <UsersIcon className="w-5" />
              <span>Usuarios</span>
            </NavLink>
          )}
          {admin ? (
            <NavLink to="/historial" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose}>
              <ClockIcon className="w-5" />
              <span>Historial</span>
            </NavLink>
          ) : (
            <NavLink to="/mi-historial" className={({ isActive }) => `${base} ${isActive ? active : ''}`} onClick={onClose}>
              <ClockIcon className="w-5" />
              <span>Mi historial</span>
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  )
}
