import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { api } from '../api'
import { usePolling } from '../hooks/usePolling'
import SensorChart from '../components/SensorChart'
import type { Measurement } from '../types'

export default function HomebaseHistory() {
  const { id } = useParams<{ id: string }>()
  const homebaseId = Number(id)

  const { data, loading } = usePolling<Measurement[]>(
    () => api.getStatus(homebaseId, 50),
    5000
  )

  if (loading || !data) {
    return <div className="text-gray-500">Loading…</div>
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 md:space-y-6">
      <div className="flex items-center gap-3 md:gap-4">
        <Link
          to={`/homebase/${homebaseId}`}
          className="text-gray-400 hover:text-white transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate">Homebase #{homebaseId} — History</h1>
          <p className="text-gray-500 text-sm">Last {data.length} readings</p>
        </div>
      </div>

      <SensorChart data={data} dataKey="happiness" label="Happiness Score" color="#22c55e" maxY={100} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <SensorChart data={data} dataKey="temperature" label="Temperature (°C)" color="#f97316" maxY={50} />
        <SensorChart data={data} dataKey="humidity" label="Humidity (%)" color="#3b82f6" maxY={100} />
        <SensorChart data={data} dataKey="dust" label="Dust (µg/m³)" color="#a855f7" maxY={500} />
        <SensorChart data={data} dataKey="gas" label="Gas (ppm)" color="#ef4444" maxY={1000} />
        <SensorChart data={data} dataKey="volume" label="Volume (dB)" color="#eab308" maxY={120} />
        <SensorChart data={data} dataKey="light" label="Light (lux)" color="#06b6d4" maxY={1000} />
      </div>
    </div>
  )
}
