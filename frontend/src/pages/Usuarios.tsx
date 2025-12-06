import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'

type Usuario = { _id: string; nombre: string; correo: string; rol: 'admin' | 'operador' }
type Rol = 'admin' | 'operador'

export default function Usuarios() {
  const [users, setUsers] = useState<Usuario[]>([])
  const [form, setForm] = useState<{ nombre: string; correo: string; password: string; rol: Rol }>({ nombre: '', correo: '', password: '', rol: 'operador' })
  useEffect(() => { api.get('/users').then((r) => setUsers(r.data)) }, [])
  async function add() {
    const r = await api.post('/users', form)
    const u = { _id: r.data.id, nombre: form.nombre, correo: form.correo, rol: form.rol }
    setUsers((prev) => [u, ...prev])
    setForm({ nombre: '', correo: '', password: '', rol: 'operador' })
  }
  async function remove(id: string) {
    await api.delete(`/users/${id}`)
    setUsers((prev) => prev.filter((u) => u._id !== id))
  }
  return (
    <div className="space-y-6">
      <PageTitle title="Usuarios" subtitle="Gestión de accesos" />
      <Card className="space-y-3">
        <div className="font-semibold">Agregar usuario</div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
          <input placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input placeholder="Correo" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} />
          <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value as Rol })}>
            <option value="operador">Operador</option>
            <option value="admin">Admin</option>
          </select>
          <button className="bg-primary-600 text-white rounded-lg" onClick={add}>Agregar</button>
        </div>
      </Card>
      <Card>
        <div className="font-semibold mb-3">Usuarios</div>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Correo</th>
              <th className="text-left p-2">Rol</th>
              <th className="text-left p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.nombre}</td>
                <td className="p-2">{u.correo}</td>
                <td className="p-2">{u.rol}</td>
                <td className="p-2">
                  <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => remove(u._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
