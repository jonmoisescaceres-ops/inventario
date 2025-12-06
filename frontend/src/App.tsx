import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inventario from './pages/Inventario'
import RegistrarEntrada from './pages/RegistrarEntrada'
import RegistrarSalida from './pages/RegistrarSalida'
import Alertas from './pages/Alertas'
import Usuarios from './pages/Usuarios'
import Historial from './pages/Historial'
import MiHistorial from './pages/MiHistorial'
import Register from './pages/Register'
import Auth from './pages/Auth'
import { RequireAuth, RequireRole } from './routes/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth" element={<Auth />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route
          index
          element={
            <RequireRole role="admin">
              <Dashboard />
            </RequireRole>
          }
        />
        <Route
          path="inventario"
          element={
            <RequireRole role="admin">
              <Inventario />
            </RequireRole>
          }
        />
        <Route
          path="entradas"
          element={
            <RequireRole role="admin">
              <RegistrarEntrada />
            </RequireRole>
          }
        />
        <Route
          path="salidas"
          element={
            <RequireRole role={["admin","operador"]}>
              <RegistrarSalida />
            </RequireRole>
          }
        />
        <Route
          path="alertas"
          element={
            <RequireRole role="admin">
              <Alertas />
            </RequireRole>
          }
        />
        <Route
          path="usuarios"
          element={
            <RequireRole role="admin">
              <Usuarios />
            </RequireRole>
          }
        />
        <Route
          path="historial"
          element={
            <RequireRole role="admin">
              <Historial />
            </RequireRole>
          }
        />
        <Route
          path="mi-historial"
          element={
            <RequireRole role="operador">
              <MiHistorial />
            </RequireRole>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  )
}
