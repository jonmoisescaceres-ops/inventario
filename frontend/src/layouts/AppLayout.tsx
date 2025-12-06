import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="min-h-full bg-gray-50">
      <Sidebar />
      <Topbar />
      <main className="pt-16 pl-64 p-6">
        <Outlet />
      </main>
    </div>
  )
}
