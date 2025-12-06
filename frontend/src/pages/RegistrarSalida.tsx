import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'

type Item = { _id: string; nombre: string }

export default function RegistrarSalida() {
  const [items, setItems] = useState<Item[]>([])
  const [insumo_id, setInsumo] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [area, setArea] = useState('')
  const [comentario, setComentario] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { api.get('/items/options').then((r) => setItems(r.data)) }, [])
  async function submit() {
    setError('')
    try {
      await api.post('/exits', { insumo_id, cantidad, area, comentario })
      setCantidad(1); setArea(''); setComentario('')
      alert('Salida registrada')
    } catch {
      setError('Stock insuficiente')
    }
  }
  return (
    <div className="space-y-6 max-w-xl">
      <PageTitle title="Registrar Salida" />
      <Card>
        <div className="space-y-3">
          <select value={insumo_id} onChange={(e) => setInsumo(e.target.value)} className="w-full">
            <option value="">Selecciona insumo</option>
            {items.map((i) => <option key={i._id} value={i._id}>{i.nombre}</option>)}
          </select>
          <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          <input placeholder="Área o motivo" value={area} onChange={(e) => setArea(e.target.value)} />
          <input placeholder="Comentario (opcional)" value={comentario} onChange={(e) => setComentario(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="bg-primary-600 text-white rounded-lg px-3 py-2" onClick={submit} disabled={!insumo_id || cantidad < 1}>Registrar</button>
        </div>
      </Card>
    </div>
  )
}
