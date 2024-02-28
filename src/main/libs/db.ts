import Database from 'better-sqlite3'

type Database = ReturnType<typeof Database>
export const getMain = (dbPath: string): Database => new Database(dbPath)
