export interface Homebase {
  id: number
  name: string
}

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
  happiness?: number
}
