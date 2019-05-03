import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  label: string
  value: number | null
  unit: string
}

export default function SensorCard({ icon, label, value, unit }: Props) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-semibold text-white">
        {value != null ? value.toFixed(1) : '—'}
        <span className="text-sm text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  )
}
