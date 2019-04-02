import express from 'express'
import cors from 'cors'
import db from './db.js'
import { calculateHappiness, type Measurement } from './happiness.js'

const app = express()
app.use(cors())
app.use(express.json())

// --- Homebases ---

app.get('/api/homebases', (_req, res) => {
  const rows = db.prepare('SELECT * FROM homebases ORDER BY id').all()
  res.json(rows)
})

app.get('/api/homebases/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM homebases WHERE id = ?').get(req.params.id)
  if (!row) return res.status(404).json({ error: 'Not found' })
  res.json(row)
})

app.post('/api/homebases', (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })
  const result = db.prepare('INSERT INTO homebases (name) VALUES (?)').run(name)
  res.status(201).json({ id: result.lastInsertRowid, name })
})

// --- Measurements ---

app.post('/api/measurements', (req, res) => {
  const { homebase_id, temperature, humidity, dust, gas, volume, light, pressure } = req.body
  if (!homebase_id) return res.status(400).json({ error: 'homebase_id is required' })

  const stmt = db.prepare(`
    INSERT INTO measurements (homebase_id, temperature, humidity, dust, gas, volume, light, pressure)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  const result = stmt.run(homebase_id, temperature, humidity, dust, gas, volume, light, pressure)
  res.status(201).json({ id: result.lastInsertRowid })
})

app.get('/api/measurements/:homebaseId', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 50, 500)
  const rows = db.prepare(
    'SELECT * FROM measurements WHERE homebase_id = ? ORDER BY timestamp DESC LIMIT ?'
  ).all(req.params.homebaseId, limit) as Measurement[]

  res.json(rows)
})

// --- Status (with happiness score) ---

app.get('/api/status/:homebaseId', (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 30, 500)
  const rows = db.prepare(
    'SELECT * FROM measurements WHERE homebase_id = ? ORDER BY timestamp DESC LIMIT ?'
  ).all(req.params.homebaseId, limit) as Measurement[]

  const withHappiness = rows.map(m => ({
    ...m,
    happiness: calculateHappiness(m),
  }))

  res.json(withHappiness)
})

app.get('/api/status/:homebaseId/latest', (req, res) => {
  const row = db.prepare(
    'SELECT * FROM measurements WHERE homebase_id = ? ORDER BY timestamp DESC LIMIT 1'
  ).get(req.params.homebaseId) as Measurement | undefined

  if (!row) return res.status(404).json({ error: 'No measurements found' })
  res.json({ ...row, happiness: calculateHappiness(row) })
})

// --- IoT compat endpoint (GET-based insert from Arduino) ---

app.get('/api/measurements/:homebaseId/:humidity/:temperature/:dust/:gas/:pressure/:volume/:light', (req, res) => {
  const p = req.params
  const stmt = db.prepare(`
    INSERT INTO measurements (homebase_id, temperature, humidity, dust, gas, volume, light, pressure)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  stmt.run(p.homebaseId, p.temperature, p.humidity, p.dust, p.gas, p.volume, p.light, p.pressure)
  res.json({ ok: true })
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => console.log(`🟢 Happiness API running on http://localhost:${PORT}`))
