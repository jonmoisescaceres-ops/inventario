import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'

type Item = { _id: string; nombre: string; stock_actual: number; stock_minimo: number }

export default function Alertas() {
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => { api.get('/alerts').then((r) => setItems(r.data)) }, [])
  async function notify(id: string) {
    await api.post(`/alerts/notify/${id}`)
    alert('Notificación enviada')
  }
  return (
    <div className="space-y-6">
      <PageTitle title="Alertas" subtitle="Insumos en niveles críticos" />
      <Card>
        <ul className="divide-y">
          {items.map((i) => (
            <li key={i._id} className="py-2 flex justify-between">
              <div>
                <div>{i.nombre}</div>
                <div className="text-sm">{i.stock_actual}/{i.stock_minimo}</div>
              </div>
              <button className="px-3 py-1 rounded bg-primary-600 text-white" onClick={() => notify(i._id)}>Notificar</button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
