import clsx from 'clsx'

interface Props {
  value: number
  size?: 'sm' | 'lg'
}

export default function HappinessRing({ value, size = 'lg' }: Props) {
  const r = size === 'lg' ? 80 : 40
  const stroke = size === 'lg' ? 10 : 6
  const circumference = 2 * Math.PI * r
  const offset = circumference - (value / 100) * circumference
  const dim = (r + stroke) * 2

  const color =
    value >= 80 ? 'text-green-400' : value > 50 ? 'text-amber-400' : 'text-red-400'
  const bgRing =
    value >= 80 ? 'stroke-green-400/15' : value > 50 ? 'stroke-amber-400/15' : 'stroke-red-400/15'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={dim} height={dim} className="-rotate-90">
        <circle
          cx={r + stroke}
          cy={r + stroke}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className={bgRing}
        />
        <circle
          cx={r + stroke}
          cy={r + stroke}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={clsx('transition-all duration-700', color)}
          style={{ stroke: 'currentColor' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={clsx('font-bold', size === 'lg' ? 'text-4xl' : 'text-lg', color)}>
          {value}%
        </span>
        <span className="text-xs text-gray-400 uppercase tracking-wider">Happiness</span>
      </div>
    </div>
  )
}
