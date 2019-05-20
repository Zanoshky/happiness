import { useParams, Link } from 'react-router-dom'
import {
  Thermometer, Droplets, Wind, Flame, Volume2, Sun, Gauge, History,
} from 'lucide-react'
import { api } from '../api'
import { usePolling } from '../hooks/usePolling'
import HappinessRing from '../components/HappinessRing'
import SensorCard from '../components/SensorCard'
import type { Measurement } from '../types'

export default function HomebaseLive() {
  const { id } = useParams<{ id: string }>()
  const homebaseId = Number(id)

  const { data: latest, loading } = usePolling<Measurement>(
    () => api.getLatest(homebaseId),
    2000
  )

  if (loading || !latest) {
    return <div className="text-gray-500">Loading…</div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 md:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold truncate">Homebase #{homebaseId}</h1>
          <p className="text-gray-500 text-sm">
            Live — updated {new Date(latest.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <Link
          to={`/homebase/${homebaseId}/history`}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <History className="w-4 h-4" />
          <span className="hidden sm:inline">View History</span>
        </Link>
      </div>

      <div className="flex justify-center py-4">
        <HappinessRing value={latest.happiness ?? 0} size="lg" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        <SensorCard icon={<Thermometer className="w-4 h-4" />} label="Temperature" value={latest.temperature} unit="°C" />
        <SensorCard icon={<Droplets className="w-4 h-4" />} label="Humidity" value={latest.humidity} unit="%" />
        <SensorCard icon={<Wind className="w-4 h-4" />} label="Dust" value={latest.dust} unit="µg/m³" />
        <SensorCard icon={<Flame className="w-4 h-4" />} label="Gas" value={latest.gas} unit="ppm" />
        <SensorCard icon={<Volume2 className="w-4 h-4" />} label="Volume" value={latest.volume} unit="dB" />
        <SensorCard icon={<Sun className="w-4 h-4" />} label="Light" value={latest.light} unit="lux" />
        <SensorCard icon={<Gauge className="w-4 h-4" />} label="Pressure" value={latest.pressure} unit="hPa" />
      </div>
    </div>
  )
}
