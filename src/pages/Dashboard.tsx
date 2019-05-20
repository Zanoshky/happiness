import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'
import { api } from '../api'
import { usePolling } from '../hooks/usePolling'
import HappinessRing from '../components/HappinessRing'
import type { Measurement } from '../types'

export default function Dashboard() {
  const { data: latest } = usePolling<Measurement>(
    () => api.getLatest(1),
    3000
  )

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Office environment at a glance</p>
      </div>

      {latest && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col items-center gap-4 md:gap-6">
          <HappinessRing value={latest.happiness ?? 0} size="lg" />
          <p className="text-gray-400 text-sm">
            Last reading: {new Date(latest.timestamp).toLocaleString()}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        <Link
          to="/homebase/1"
          className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-600 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Home className="w-5 h-5 text-green-400" />
            <div>
              <div className="font-medium">Prototype</div>
              <div className="text-sm text-gray-500">Live sensor readings</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </div>
  )
}
