import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import * as XLSX from 'xlsx'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'

type Item = { _id: string; nombre: string; categoria: string; unidad: string; stock_actual: number; stock_minimo: number }

export default function Inventario() {
  const [items, setItems] = useState<Item[]>([])
  const [form, setForm] = useState<Partial<Item>>({ nombre: '', categoria: '', unidad: '', stock_actual: undefined, stock_minimo: undefined })
  const [editing, setEditing] = useState<string | null>(null)
  useEffect(() => { api.get('/items').then((r) => setItems(r.data)) }, [])
  const status = useMemo(() => (i: Item) => (i.stock_actual <= i.stock_minimo ? 'text-red-600' : i.stock_actual - i.stock_minimo <= 5 ? 'text-yellow-600' : 'text-green-600'), [])
  async function save() {
    if (editing) {
      const r = await api.put(`/items/${editing}`, form)
      setItems((prev) => prev.map((i) => (i._id === editing ? r.data : i)))
      setEditing(null)
    } else {
      const r = await api.post('/items', form)
      setItems((prev) => [...prev, r.data])
    }
    setForm({ nombre: '', categoria: '', unidad: '', stock_actual: undefined, stock_minimo: undefined })
  }
  async function del(id: string) {
    await api.delete(`/items/${id}`)
    setItems((prev) => prev.filter((i) => i._id !== id))
  }
  function exportExcel() {
    const ws = XLSX.utils.json_to_sheet(items.map((i) => ({ Nombre: i.nombre, Categoría: i.categoria, Unidad: i.unidad, Stock: i.stock_actual, Mínimo: i.stock_minimo })))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Inventario')
    XLSX.writeFile(wb, 'inventario.xlsx')
  }
  return (
    <div className="space-y-6">
      <PageTitle title="Inventario" subtitle="Listado y gestión de insumos" />
      <Card className="space-y-3">
        <div className="font-semibold">Agregar/Editar Insumo</div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <input placeholder="Nombre" value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
          <input placeholder="Categoría" value={form.categoria || ''} onChange={(e) => setForm({ ...form, categoria: e.target.value })} />
          <input placeholder="Unidad" value={form.unidad || ''} onChange={(e) => setForm({ ...form, unidad: e.target.value })} />
          <input type="number" placeholder="Stock" value={form.stock_actual ?? ''} onChange={(e) => setForm({ ...form, stock_actual: e.target.value === '' ? 0 : Number(e.target.value) })} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          <input type="number" placeholder="Mínimo" value={form.stock_minimo ?? ''} onChange={(e) => setForm({ ...form, stock_minimo: e.target.value === '' ? 0 : Number(e.target.value) })} className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
          <button className="bg-primary-600 text-white rounded-lg" onClick={save}>{editing ? 'Guardar' : 'Agregar'}</button>
        </div>
      </Card>
      <Card>
        <div className="flex justify-between mb-3">
          <div className="font-semibold">Inventario</div>
          <button className="px-3 py-1 rounded bg-primary-600 text-white" onClick={exportExcel}>Exportar Excel</button>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2">Nombre</th>
                <th className="text-left p-2">Categoría</th>
                <th className="text-left p-2">Stock</th>
                <th className="text-left p-2">Mínimo</th>
                <th className="text-left p-2">Unidad</th>
                <th className="text-left p-2">Estado</th>
                <th className="text-left p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i._id} className="border-t">
                  <td className="p-2">{i.nombre}</td>
                  <td className="p-2">{i.categoria}</td>
                  <td className="p-2">{i.stock_actual}</td>
                  <td className="p-2">{i.stock_minimo}</td>
                  <td className="p-2">{i.unidad}</td>
                  <td className={`p-2 ${status(i)}`}>{i.stock_actual <= i.stock_minimo ? 'Rojo' : i.stock_actual - i.stock_minimo <= 5 ? 'Amarillo' : 'Verde'}</td>
                  <td className="p-2 flex gap-2">
                    <button className="px-2 py-1 rounded bg-gray-100" onClick={() => { setEditing(i._id); setForm(i) }}>Editar</button>
                    <button className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => del(i._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
