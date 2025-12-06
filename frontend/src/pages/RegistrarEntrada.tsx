import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'

type Item = { _id: string; nombre: string; stock_actual: number; stock_minimo: number }

export default function RegistrarEntrada() {
  const [items, setItems] = useState<Item[]>([])
  const [insumo_id, setInsumo] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [proveedor, setProveedor] = useState('')
  const [comentario, setComentario] = useState('')
  useEffect(() => { api.get('/items').then((r) => setItems(r.data)) }, [])
  async function submit() {
    await api.post('/entries', { insumo_id, cantidad, proveedor, comentario })
    setCantidad(1); setProveedor(''); setComentario('')
    alert('Entrada registrada')
  }
  return (
    <div className="space-y-6 max-w-xl">
      <PageTitle title="Registrar Entrada" />
      <Card>
        <div className="space-y-3">
          <select value={insumo_id} onChange={(e) => setInsumo(e.target.value)} className="w-full">
            <option value="">Selecciona insumo</option>
            {items.map((i) => <option key={i._id} value={i._id}>{i.nombre}</option>)}
          </select>
          <input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          <input placeholder="Proveedor (opcional)" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
          <input placeholder="Comentario (opcional)" value={comentario} onChange={(e) => setComentario(e.target.value)} />
          <button className="bg-primary-600 text-white rounded-lg px-3 py-2" onClick={submit} disabled={!insumo_id || cantidad < 1}>Registrar</button>
        </div>
      </Card>
    </div>
  )
}
