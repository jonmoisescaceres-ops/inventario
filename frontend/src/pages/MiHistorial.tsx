import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'


type Move = { _id: string; insumo_id: string; tipo: 'entrada' | 'salida'; cantidad: number; usuario: string; fecha: string; area?: string; comentario?: string }
type Item = { _id: string; nombre: string }

export default function MiHistorial() {
  const [moves, setMoves] = useState<Move[]>([])
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    api.get('/movements', { params: { tipo: 'salida' } }).then((r) => setMoves(r.data))
    api.get('/items').then((r) => setItems(r.data))
  }, [])
  const getNombreInsumo = (id: string) => {
    const item = items.find((i) => i._id === id)
    console.log('Mi Historial - Buscando:', id, 'Items disponibles:', items.length, 'Encontrado:', item)
    return item ? item.nombre : id
  }
  return (
    <div className="space-y-6">
      <PageTitle title="Mi historial" subtitle="Tus salidas registradas" />
      <Card>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Insumo</th>
              <th className="text-left p-2">Cantidad</th>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Comentario</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((m) => (
              <tr key={m._id} className="border-t">
                <td className="p-2">{getNombreInsumo(m.insumo_id)}</td>
                <td className="p-2">{m.cantidad}</td>
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
