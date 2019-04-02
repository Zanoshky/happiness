import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const db = new Database(path.join(__dirname, '..', 'happiness.db'))

db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS homebases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS measurements (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    homebase_id INTEGER NOT NULL REFERENCES homebases(id),
    timestamp TEXT NOT NULL DEFAULT (datetime('now')),
    temperature REAL,
    humidity REAL,
    dust REAL,
    gas REAL,
    volume REAL,
    light REAL,
    pressure REAL
  );

  CREATE INDEX IF NOT EXISTS idx_measurements_homebase
    ON measurements(homebase_id, timestamp DESC);
`)

export default db
