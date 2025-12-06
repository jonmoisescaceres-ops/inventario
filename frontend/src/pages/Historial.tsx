import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'

type Move = { _id: string; insumo_id: string; tipo: 'entrada' | 'salida'; cantidad: number; usuario: string; fecha: string; area?: string; comentario?: string }
type Item = { _id: string; nombre: string }

export default function Historial() {
  const [moves, setMoves] = useState<Move[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [filtro, setFiltro] = useState({ tipo: '', desde: '', hasta: '', usuario: '', insumo_id: '' })
  useEffect(() => { api.get('/movements').then((r) => setMoves(r.data)); api.get('/items').then((r) => setItems(r.data)) }, [])
  async function filtrar() {
    const params = Object.fromEntries(Object.entries(filtro).filter(([, v]) => v))
    const r = await api.get('/movements', { params })
    setMoves(r.data)
  }
  const getNombreInsumo = (id: string) => {
    const item = items.find((i) => i._id === id)
    return item ? item.nombre : id
  }
  return (
    <div className="space-y-6">
      <PageTitle title="Historial" subtitle="Movimientos registrados" />
      <Card className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <select value={filtro.tipo} onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}>
          <option value="">Tipo</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
        <input type="date" value={filtro.desde} onChange={(e) => setFiltro({ ...filtro, desde: e.target.value })} />
        <input type="date" value={filtro.hasta} onChange={(e) => setFiltro({ ...filtro, hasta: e.target.value })} />
        <input placeholder="Usuario" value={filtro.usuario} onChange={(e) => setFiltro({ ...filtro, usuario: e.target.value })} />
        <select value={filtro.insumo_id} onChange={(e) => setFiltro({ ...filtro, insumo_id: e.target.value })}>
          <option value="">Insumo</option>
          {items.map((i) => <option key={i._id} value={i._id}>{i.nombre}</option>)}
        </select>
        <button className="bg-primary-600 text-white rounded-lg" onClick={filtrar}>Filtrar</button>
      </Card>
      <Card>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Insumo</th>
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Cantidad</th>
              <th className="text-left p-2">Usuario</th>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((m) => (
              <tr key={m._id} className="border-t">
                <td className="p-2">{getNombreInsumo(m.insumo_id)}</td>
                <td className="p-2">{m.tipo}</td>
                <td className="p-2">{m.cantidad}</td>
                <td className="p-2">{m.usuario}</td>
                <td className="p-2">{new Date(m.fecha).toLocaleString()}</td>
                <td className="p-2">{m.comentario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
