import { NavLink } from 'react-router-dom'
import { HomeIcon, CubeIcon, ArrowUpTrayIcon, ArrowDownTrayIcon, BellAlertIcon, UsersIcon, ClockIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/auth'

const base = 'flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-600/10'
const active = 'text-primary-700 font-semibold'

export default function Sidebar() {
  const usuario = useAuthStore((s) => s.usuario)
  const admin = usuario?.rol === 'admin'
  return (
    <aside className="w-64 bg-white border-r h-full fixed">
      <div className="p-4 text-primary-700 font-bold">Control de Inventario</div>
      <nav className="flex flex-col p-2 gap-1">
        {admin && (
          <NavLink to="/" className={({ isActive }) => `${base} ${isActive ? active : ''}`} end>
            <HomeIcon className="w-5" />
            <span>Dashboard</span>
          </NavLink>
        )}
        {admin && (
          <NavLink to="/inventario" className={({ isActive }) => `${base} ${isActive ? active : ''}`}> 
            <CubeIcon className="w-5" />
            <span>Inventario</span>
          </NavLink>
        )}
        {admin && (
          <NavLink to="/entradas" className={({ isActive }) => `${base} ${isActive ? active : ''}`}> 
            <ArrowUpTrayIcon className="w-5" />
            <span>Registrar Entrada</span>
          </NavLink>
        )}
        <NavLink to="/salidas" className={({ isActive }) => `${base} ${isActive ? active : ''}`}> 
          <ArrowDownTrayIcon className="w-5" />
          <span>Registrar Salida</span>
        </NavLink>
        {admin && (
          <NavLink to="/alertas" className={({ isActive }) => `${base} ${isActive ? active : ''}`}> 
            <BellAlertIcon className="w-5" />
            <span>Alertas</span>
          </NavLink>
        )}
        {admin && (
          <NavLink to="/usuarios" className={({ isActive }) => `${base} ${isActive ? active : ''}`}> 
            <UsersIcon className="w-5" />
            <span>Usuarios</span>
          </NavLink>
        )}
        {admin ? (
          <NavLink to="/historial" className={({ isActive }) => `${base} ${isActive ? active : ''}`}> 
            <ClockIcon className="w-5" />
            <span>Historial</span>
          </NavLink>
        ) : (
          <NavLink to="/mi-historial" className={({ isActive }) => `${base} ${isActive ? active : ''}`}> 
            <ClockIcon className="w-5" />
            <span>Mi historial</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}
