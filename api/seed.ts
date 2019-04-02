import db from './db.js'

// Create a demo homebase
const existing = db.prepare('SELECT id FROM homebases WHERE id = 1').get()
if (!existing) {
  db.prepare('INSERT INTO homebases (name) VALUES (?)').run('Prototype')
}

// Seed 100 measurements over the last ~2 hours
const stmt = db.prepare(`
  INSERT INTO measurements (homebase_id, timestamp, temperature, humidity, dust, gas, volume, light, pressure)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const now = Date.now()
const insertMany = db.transaction(() => {
  for (let i = 0; i < 100; i++) {
    const ts = new Date(now - (100 - i) * 72_000).toISOString()
    stmt.run(
      1,
      ts,
      20 + Math.random() * 8,          // temperature 20-28
      40 + Math.random() * 30,          // humidity 40-70
      Math.random() * 300,              // dust 0-300
      100 + Math.random() * 500,        // gas 100-600
      30 + Math.random() * 60,          // volume 30-90
      200 + Math.random() * 600,        // light 200-800
      950 + Math.random() * 100,        // pressure 950-1050
    )
  }
})
insertMany()

console.log('✅ Seeded 1 homebase + 100 measurements')
