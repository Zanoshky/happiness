import type { Homebase, Measurement } from './types'

const BASE = '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getHomebases: () => get<Homebase[]>('/homebases'),
  getHomebase: (id: number) => get<Homebase>(`/homebases/${id}`),
  getStatus: (homebaseId: number, limit = 30) =>
    get<Measurement[]>(`/status/${homebaseId}?limit=${limit}`),
  getLatest: (homebaseId: number) =>
    get<Measurement>(`/status/${homebaseId}/latest`),
}
