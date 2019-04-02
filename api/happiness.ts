export interface Measurement {
  id: string
  homebase_id: number
  timestamp: string
  temperature: number | null
  humidity: number | null
  dust: number | null
  gas: number | null
  volume: number | null
  light: number | null
  pressure: number | null
}

// Scoring ranges — each sensor contributes 0-100 to the overall score
function scoreTemperature(v: number | null): number {
  if (v == null) return 50
  // Ideal: 20-24°C
  if (v >= 20 && v <= 24) return 100
  if (v >= 18 && v < 20) return 80
  if (v > 24 && v <= 26) return 80
  if (v >= 15 && v < 18) return 50
  if (v > 26 && v <= 30) return 50
  return 20
}

function scoreHumidity(v: number | null): number {
  if (v == null) return 50
  // Ideal: 40-60%
  if (v >= 40 && v <= 60) return 100
  if (v >= 30 && v < 40) return 70
  if (v > 60 && v <= 70) return 70
  return 30
}

function scoreDust(v: number | null): number {
  if (v == null) return 50
  if (v <= 50) return 100
  if (v <= 150) return 70
  if (v <= 300) return 40
  return 10
}

function scoreGas(v: number | null): number {
  if (v == null) return 50
  if (v <= 200) return 100
  if (v <= 400) return 70
  if (v <= 600) return 40
  return 10
}

function scoreVolume(v: number | null): number {
  if (v == null) return 50
  // Ideal: 30-50 dB
  if (v <= 50) return 100
  if (v <= 70) return 70
  if (v <= 85) return 40
  return 10
}

function scoreLight(v: number | null): number {
  if (v == null) return 50
  // Ideal: 300-500 lux
  if (v >= 300 && v <= 500) return 100
  if (v >= 200 && v < 300) return 80
  if (v > 500 && v <= 750) return 80
  if (v >= 100 && v < 200) return 50
  return 30
}

export function calculateHappiness(m: Measurement): number {
  const scores = [
    scoreTemperature(m.temperature),
    scoreHumidity(m.humidity),
    scoreDust(m.dust),
    scoreGas(m.gas),
    scoreVolume(m.volume),
    scoreLight(m.light),
  ]
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(avg)
}
