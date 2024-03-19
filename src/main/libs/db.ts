import Database from 'better-sqlite3'

type Database = ReturnType<typeof Database>
export const getMain = (dbPath: string): Database => {
  const db = new Database(dbPath)
  db.exec('PRAGMA foreign_keys = ON;')
  return db
}
