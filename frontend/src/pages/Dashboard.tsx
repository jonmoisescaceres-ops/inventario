import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler } from 'chart.js'
import Card from '../components/Card'
import PageTitle from '../components/PageTitle'

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend, Filler)

type AlertItem = { _id: string; nombre: string; stock_actual: number; stock_minimo: number }
type Dash = { totalInsumos: number; bajos: number; entradasHoy: number; salidasHoy: number; consumoMensual: { _id: { mes: number }; total: number }[]; alertas: AlertItem[] }

export default function Dashboard() {
  const [data, setData] = useState<Dash | null>(null)
  useEffect(() => { api.get('/dashboard').then((r) => setData(r.data)) }, [])

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

  const chart = {
    labels: data?.consumoMensual.map((d) => meses[d._id.mes - 1]) || [],
    datasets: [{
      label: 'Consumo',
      data: data?.consumoMensual.map((d) => d.total) || [],
      borderColor: '#2563EB',
      backgroundColor: 'rgba(37, 99, 235, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#2563EB',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Iconos SVG inline para evitar dependencias
  const IconBox = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  )

  const IconAlert = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )

  const IconArrowDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  )

  const IconArrowUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  )

  const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) => (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${color.replace('bg-', 'bg-').replace('/20', '')}`} style={{ opacity: 0.6 }}></div>
    </Card>
  )

  return (
    <div className="space-y-6">
      <PageTitle title="Dashboard" subtitle="Resumen general del inventario" />

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Insumos"
          value={data?.totalInsumos ?? '-'}
          icon={<IconBox />}
          color="bg-blue-500/20 text-blue-600"
        />
        <StatCard
          title="Bajo Stock"
          value={data?.bajos ?? '-'}
          icon={<IconAlert />}
          color="bg-red-500/20 text-red-600"
        />
        <StatCard
          title="Entradas Hoy"
          value={data?.entradasHoy ?? '-'}
          icon={<IconArrowDown />}
          color="bg-green-500/20 text-green-600"
        />
        <StatCard
          title="Salidas Hoy"
          value={data?.salidasHoy ?? '-'}
          icon={<IconArrowUp />}
          color="bg-orange-500/20 text-orange-600"
        />
      </div>

      {/* Gráfico y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de consumo - 2/3 del ancho */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Consumo Mensual</h3>
            <span className="text-sm text-gray-500">Últimos meses</span>
          </div>
          <div className="h-64">
            <Line data={chart} options={chartOptions} />
          </div>
        </Card>

        {/* Alertas críticas - 1/3 del ancho */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Alertas Críticas</h3>
            <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
              {data?.alertas?.length || 0} items
            </span>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {(data?.alertas || []).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <IconAlert />
                <p className="mt-2 text-sm">No hay alertas</p>
              </div>
            ) : (
              (data?.alertas || []).map((a) => (
                <div key={a._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="font-medium text-gray-800">{a.nombre}</p>
                    <p className="text-xs text-gray-500">Stock bajo</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-600">{a.stock_actual}</p>
                    <p className="text-xs text-gray-500">de {a.stock_minimo}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Información rápida */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Sistema de Control de Inventario</h3>
            <p className="text-blue-100 text-sm mt-1">Gestiona tus insumos de forma eficiente</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{data?.totalInsumos || 0}</p>
              <p className="text-xs text-blue-200">Productos</p>
            </div>
            <div className="w-px h-10 bg-blue-400"></div>
            <div className="text-center">
              <p className="text-2xl font-bold">{(data?.entradasHoy || 0) + (data?.salidasHoy || 0)}</p>
              <p className="text-xs text-blue-200">Movimientos hoy</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
