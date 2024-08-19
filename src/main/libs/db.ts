import Database from 'better-sqlite3'

type Database = ReturnType<typeof Database>
export const getMain = (dbPath: string): Database => {
  const db = new Database(dbPath)
  db.pragma('busy_timeout = 5000')
  db.pragma('foreign_keys = ON')
  return db
}
